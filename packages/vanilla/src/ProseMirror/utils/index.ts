import { TextSelection } from 'prosemirror-state'
import type { EditorView } from 'prosemirror-view'
import type { DragHandleStateType } from '../types'

export function getNodeInfoFromEvent(
  view: EditorView,
  event: MouseEvent
): DragHandleStateType | null {
  const coords = { left: event.clientX, top: event.clientY }
  const pos = view.posAtCoords(coords)

  if (pos) {
    const $pos = view.state.doc.resolve(pos.pos)
    if ($pos.depth > 0) {
      const nodePos = $pos.before(1)
      const node = view.state.doc.nodeAt(nodePos)
      if (node && node.isBlock) {
        const dom = view.nodeDOM(nodePos) as HTMLElement
        const domRect = dom.getBoundingClientRect()
        return {
          nodePos,
          node,
          dom,
          domRect
        }
      }
    }
  }

  return null
}

export function insertText(view: EditorView, text: string, pos?: number) {
  const { state } = view
  const { selection } = state
  const { from } = selection
  const insertPos = pos === undefined ? from : pos
  const tr = state.tr.insertText(text, insertPos)
  const newSelection = TextSelection.create(tr.doc, insertPos + text.length + 1)
  tr.setSelection(newSelection)
  view.dispatch(tr)
}
