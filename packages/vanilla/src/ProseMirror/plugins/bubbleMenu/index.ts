import { Plugin, PluginKey, EditorState } from 'prosemirror-state'
import { EditorView } from 'prosemirror-view'
import { toggleMark } from 'prosemirror-commands'
import type { PluginOptions } from '../../types'
import { prefix } from '../../config/constants'
import Button from '../../components/Button'
import { ItalicIcon, BoldIcon, CodeIcon } from '../../icons'
import { pluginKey as selectedMarksAndNodesPluginKey } from '../selectedMarksAndNodes'

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
    button: Button
    item: any
  }> = []

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
    const buttons = [
      { mark: 'strong', label: 'B', icon: BoldIcon },
      { mark: 'em', label: 'I', icon: ItalicIcon },
      { mark: 'code', label: 'C', icon: CodeIcon }
    ]

    this.buttons = buttons.map((item) => {
      const { mark, label, icon } = item
      const button = new Button()
      button.setIcon(icon)
      button.element.title = label
      button.element.addEventListener('mousedown', (e) => {
        e.preventDefault()
        this.view.focus()
        toggleMark(this.view.state.schema.marks[mark])(
          this.view.state,
          this.view.dispatch
        )
      })
      this.bubble.appendChild(button.element)
      return {
        item,
        button
      }
    })
  }

  updateSelectedMarksAndNodes() {
    const newState = selectedMarksAndNodesPluginKey.getState(this.view.state)
    this.buttons.forEach(({ button, item }) => {
      const isActive = newState.marks[item.mark]
      button.element.classList.toggle('active', isActive)
    })
  }

  update(view: EditorView) {
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
