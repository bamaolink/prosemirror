import { Plugin, PluginKey } from 'prosemirror-state'
import { EditorView } from 'prosemirror-view'
import { toggleMark } from 'prosemirror-commands'

export const bubbleMenuPluginKey = new PluginKey('bubbleMenu')

export function createBubbleMenuPlugin(): Plugin {
  return new Plugin({
    key: bubbleMenuPluginKey,
    view(view) {
      return new BubbleMenuView(view)
    }
  })
}

class BubbleMenuView {
  private view: EditorView
  private bubble: HTMLDivElement

  constructor(view: EditorView) {
    this.view = view
    this.bubble = document.createElement('div')
    this.bubble.className = 'bamao-link-bubble-menu'
    this.bubble.style.position = 'fixed' // Changed to fixed
    this.bubble.style.display = 'none'
    this.view.dom.parentNode?.appendChild(this.bubble)

    this.renderButtons()
    this.update(view, null)
  }

  renderButtons() {
    const buttons = [
      { mark: 'strong', label: 'B' },
      { mark: 'em', label: 'I' },
      { mark: 'code', label: 'C' }
    ]

    buttons.forEach(({ mark, label }) => {
      const button = document.createElement('button')
      button.textContent = label
      button.addEventListener('mousedown', (e) => {
        e.preventDefault()
        this.view.focus()
        toggleMark(this.view.state.schema.marks[mark])(
          this.view.state,
          this.view.dispatch
        )
      })
      this.bubble.appendChild(button)
    })
  }

  update(view: EditorView, prevState: any) {
    const { state } = view
    const { selection } = state
    const { from, to, empty } = selection

    if (empty) {
      this.bubble.style.display = 'none'
      return
    }

    const start = view.coordsAtPos(from)
    const end = view.coordsAtPos(to)

    // Calculate position relative to the viewport
    const left = (start.left + end.left) / 2
    const top = start.top

    this.bubble.style.left = left + 'px'
    this.bubble.style.top = top - this.bubble.offsetHeight - 10 + 'px' // Position above the selection
    this.bubble.style.display = 'block'
  }

  destroy() {
    this.bubble.remove()
  }
}
