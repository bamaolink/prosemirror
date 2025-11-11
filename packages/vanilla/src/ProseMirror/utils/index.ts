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
