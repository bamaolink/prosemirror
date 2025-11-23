import { Plugin, PluginKey, EditorState } from 'prosemirror-state'
import { EditorView } from 'prosemirror-view'
import { toggleMark } from 'prosemirror-commands'
import type { PluginOptions } from '../../types'
import { prefix } from '../../config/constants'
import BmlButton from '../../components/Button'
import BmlTooltip from '../../components/Tooltip'
import { pluginKey as selectedMarksAndNodesPluginKey } from '../selectedMarksAndNodes'
import { menus } from '../../config/menuItems'
import { htmlStringtoDom } from '../../utils'
import { createLinkFormItems } from './link'

const _prefix = `${prefix}bubble-menu`

export function canShowInlineAndMark(state: EditorState) {
  const { schema, selection } = state
  const { $from, $to, empty } = selection

  for (const markType of Object.values(schema.marks)) {
    if (!toggleMark(markType)(state)) {
      return false
    }
  }
  let isCanShowInlineAndMark = Object.values(schema.marks).some((markType) => {
    if (!toggleMark(markType)(state)) {
      return false
    } else {
      return true
    }
  })

  if (!isCanShowInlineAndMark) {
    return false
  }

  isCanShowInlineAndMark = Object.values(schema.nodes).some((nodeType) => {
    if (!nodeType.isInline) {
      return false
    }
    if (!empty) {
      return $from.parent.canReplaceWith($from.index(), $to.index(), nodeType)
    }
    return $from.parent.canReplaceWith($from.index(), $from.index(), nodeType)
  })

  return isCanShowInlineAndMark
}

export const pluginKey = new PluginKey('bubbleMenu')

export function bubbleMenu(options: PluginOptions): Plugin {
  return new Plugin({
    key: pluginKey,
    state: {
      init() {
        return {
          visible: false
        }
      },
      apply(tr, prev) {
        const meta = tr.getMeta(pluginKey)
        if (meta) {
          return meta
        }
        return prev
      }
    },
    view(view) {
      return new BubbleMenuView(view, options)
    },
    props: {
      handleDOMEvents: {
        focus(view) {
          view.dispatch(
            view.state.tr.setMeta(pluginKey, {
              visible: true
            })
          )
          return false
        },
        blur(view) {
          view.dispatch(
            view.state.tr.setMeta(pluginKey, {
              visible: false
            })
          )
          return false
        }
      }
    }
  })
}

class BubbleMenuView {
  private view: EditorView
  private bubble: HTMLDivElement
  private options: PluginOptions
  private buttons: Array<{
    button: BmlButton
    item: (typeof menus)[number]
  }> = []
  private isEditing = false

  constructor(view: EditorView, options: PluginOptions) {
    this.view = view
    this.options = options
    this.bubble = document.createElement('div')
    this.bubble.className = `${prefix}bubble-menu`
    // this.bubble.style.position = 'fixed' // Changed to fixed
    this.bubble.style.display = 'none'
    this.view.dom.parentNode?.appendChild(this.bubble)

    this.renderButtons()
    this.update(view)
  }

  renderButtons() {
    this.buttons = menus.map((item) => {
      const { id, label, icon, action } = item
      const button = new BmlButton()
      button.setIcon(icon)
      button.element.title = label

      switch (id) {
        case 'link':
          const tooltip = new BmlTooltip({
            trigger: button.element,
            popoverId: `${_prefix}-tooltip`,
            anchorName: `${_prefix}-tooltip-anchor`,
            hover: false,
            positionArea: 'bottom'
          })
          button.element.addEventListener('mousedown', (e) => {
            e.preventDefault()
            e.stopPropagation()
          })

          const elements = createLinkFormItems(prefix)

          elements.formElement.addEventListener('submit', (e) => {
            e.preventDefault()
            const formData = new FormData(dom)

            const attrs = Object.fromEntries(formData)
            const state = this.view.state
            const selection = state.selection
            const from = selection.from
            const to = selection.to

            const linkMark = this.view.state.schema.marks.link.create(attrs)
            this.view.dispatch(this.view.state.tr.addMark(from, to, linkMark))
            this.view.focus()
          })
          tooltip.popover.appendChild(elements.formElement)
          // tooltip.popover.classList.add('light')

          // 防止点击 Tooltip 时导致编辑器失去焦点或选区混乱
          tooltip.popover.addEventListener(
            'mousedown',
            (e) => {
              const target = e.target as HTMLElement
              if (!['INPUT', 'LABEL'].includes(target.tagName)) {
                e.preventDefault()
              }
              this.isEditing = true
            },
            true
          )

          tooltip.popover.addEventListener(
            'focusin',
            () => (this.isEditing = true)
          )
          tooltip.popover.addEventListener(
            'focusout',
            () => (this.isEditing = false)
          )

          this.bubble.appendChild(button.element)
          this.bubble.appendChild(tooltip.popover)
          break
        default:
          button.element.addEventListener('mousedown', (e) => {
            e.preventDefault()
            this.view.focus()
            action(this.view, this.view.state.schema)
          })
          this.bubble.appendChild(button.element)
          break
      }

      return {
        item,
        button
      }
    })
  }

  updateSelectedMarksAndNodes() {
    const newState = selectedMarksAndNodesPluginKey.getState(this.view.state)
    this.buttons.forEach(({ button, item }) => {
      const isActive = newState.marks[item.id]
      button.element.classList.toggle('active', isActive)
    })
    if (newState.marks.link) {
    }
  }

  update(view: EditorView) {
    if (this.isEditing) {
      return
    }
    const { state } = view
    const { selection } = state
    const { from, to, empty } = selection

    if (!view.editable) {
      this.bubble.style.display = 'none'
      return
    }

    if (empty) {
      this.bubble.style.display = 'none'
      return
    }

    const visibleState = pluginKey.getState(this.view.state)
    if (!visibleState.visible) {
      this.bubble.style.display = 'none'
      return
    }

    if (!canShowInlineAndMark(view.state)) {
      this.bubble.style.display = 'none'
      return
    }

    const start = view.coordsAtPos(from)
    const end = view.coordsAtPos(to)

    // Calculate position relative to the viewport
    const rect = view.dom.getBoundingClientRect()
    // const left =
    //   start.left + (end.left - start.left) / 2 - parseInt(paddingLeft) * 2
    const left = start.left - rect.left
    const top = start.top - rect.top
    const width =
      Math.max(start.left, end.left) - Math.min(start.left, end.left)

    this.bubble.style.left =
      left + Math.max(width, this.bubble.offsetWidth) / 4 + 'px'
    this.bubble.style.top = top - this.bubble.offsetHeight - 8 + 'px' // Position above the selection
    this.bubble.style.display = 'flex'

    this.updateSelectedMarksAndNodes()
  }

  destroy() {
    this.bubble.remove()
  }
}
