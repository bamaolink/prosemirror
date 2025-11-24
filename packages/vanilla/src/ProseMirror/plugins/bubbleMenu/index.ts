import { Plugin, PluginKey, EditorState } from 'prosemirror-state'
import { EditorView } from 'prosemirror-view'
import { toggleMark } from 'prosemirror-commands'
import type { PluginOptions } from '../../types'
import { prefix } from '../../config/constants'
import BmlButton from '../../components/Button'
import { selectedMarksAndNodesPluginKey } from '../selectedMarksAndNodes'
import { menus } from '../../config/menuItems'
import { LinkView } from './LinkView'
import { HighlightColorView } from './HighlightColorView'

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

export const bubbleMenuPluginKey = new PluginKey('bubble-menu-plugin')

export function bubbleMenuPlugin(options: PluginOptions): Plugin {
  return new Plugin({
    key: bubbleMenuPluginKey,
    state: {
      init() {
        return {
          visible: false
        }
      },
      apply(tr, prev) {
        const meta = tr.getMeta(bubbleMenuPluginKey)
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
            view.state.tr.setMeta(bubbleMenuPluginKey, {
              visible: true
            })
          )
          return false
        },
        blur(view) {
          view.dispatch(
            view.state.tr.setMeta(bubbleMenuPluginKey, {
              visible: false
            })
          )
          return false
        }
      }
    }
  })
}

export class BubbleMenuView {
  private view: EditorView
  private bubble: HTMLDivElement
  private options: PluginOptions
  private buttons: Array<{
    button: BmlButton
    item: (typeof menus)[number]
  }> = []
  private isEditing = false

  private linkView: LinkView | null = null
  private highlightColorView: HighlightColorView | null = null

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
          const linkView = new LinkView({
            view: this.view,
            trigger: button,
            setIsEditing: this.setIsEditing.bind(this),
            getIsEditing: this.getIsEditing.bind(this),
            prefix
          })
          this.bubble.appendChild(button.element)
          this.bubble.appendChild(linkView.popover.popover)
          this.linkView = linkView

          break
        case 'highlightColor': {
          const highlightColorView = new HighlightColorView({
            view: this.view,
            trigger: button,
            setIsEditing: this.setIsEditing.bind(this),
            getIsEditing: this.getIsEditing.bind(this),
            prefix
          })
          this.bubble.appendChild(button.element)
          this.bubble.appendChild(highlightColorView.popover.popover)
          this.highlightColorView = highlightColorView

          break
        }
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
    if (this.linkView) {
      this.linkView.popover.hide()
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

    const visibleState = bubbleMenuPluginKey.getState(this.view.state)
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

  setIsEditing(isEditing: boolean) {
    this.isEditing = isEditing
  }
  getIsEditing() {
    return this.isEditing
  }

  destroy() {
    this.bubble.remove()
  }
}
