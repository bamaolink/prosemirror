import type { Schema, EditorView } from '../types'
import { TextSelection } from 'prosemirror-state'
import type { DragHandleStateType } from '../types'
import type { Node, ResolvedPos } from 'prosemirror-model'
export function insertImagePlaceholderCommand(
  view: EditorView,
  schema: Schema
) {
  const placeholderNode = schema.nodes.image_upload_placeholder.create()
  const tr = view.state.tr.replaceSelectionWith(placeholderNode)

  view.dispatch(tr)
  return true
}

// 获取doc下第一级节点信息
export function getNodeInfoFromEvent(
  view: EditorView,
  event: MouseEvent
): DragHandleStateType | null {
  const coords = { left: event.clientX, top: event.clientY }
  const pos = view.posAtCoords(coords)

  if (pos) {
    let domNode = view.nodeDOM(pos.pos) as HTMLElement
    if (domNode?.dataset?.proseNodeView === 'true') {
      return {
        nodePos: pos.pos,
        node: view.state.doc.nodeAt(pos.pos)!,
        dom: domNode,
        domRect: domNode.getBoundingClientRect()
      }
    }
    domNode = view.nodeDOM(pos.pos - 1) as HTMLElement
    if (domNode?.dataset?.proseNodeView === 'true') {
      return {
        nodePos: pos.pos,
        node: view.state.doc.nodeAt(pos.pos)!,
        dom: domNode,
        domRect: domNode.getBoundingClientRect()
      }
    }

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

// 获取当前节点信息
export function isEventMatchNode(
  view: EditorView,
  event: MouseEvent,
  nodeType: string
):
  | boolean
  | {
      node: Node
      pos: number
      resolvedPos: ResolvedPos
      index: number
    } {
  const target = event.target as HTMLElement
  const pos = view.posAtDOM(target, 0)
  const resolvedPos = view.state.doc.resolve(pos)

  for (let i = resolvedPos.depth; i > 0; i--) {
    const node = resolvedPos.node(i)
    if (node.type.name === nodeType) {
      return {
        node,
        pos,
        resolvedPos,
        index: i
      }
    }
  }
  return false
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

/**
 * 一个创建并插入表格的命令
 * @param state
 * @param dispatch
 */
export function insertTableCommand(view: EditorView, schema: Schema) {
  const { table, table_row, table_cell, paragraph } = schema.nodes
  function createCell() {
    return table_cell.create(null, paragraph.create())
  }

  const numRows = 3
  const numCols = 3
  const rows = []

  for (let i = 0; i < numRows; i++) {
    const cells = []
    for (let j = 0; j < numCols; j++) {
      cells.push(createCell())
    }
    rows.push(table_row.create(null, cells))
  }

  const tableNode = table.create(null, rows)

  // 1. 开始一个事务
  let tr = view.state.tr
  const insertPos = tr.selection.from

  // 2. 用表格替换当前选区
  tr = tr.replaceSelectionWith(tableNode)

  // 3. 计算第一个单元格内段落的起始位置
  //    table(1) > row(1) > cell(1) > paragraph(1) = 4
  //    这个 4 是因为 ProseMirror 的位置计算包含了节点的起始 "token"
  const focusPos = insertPos + 4

  // 4. 创建一个新的文本选区（光标）并设置到事务中
  const newSelection = TextSelection.create(tr.doc, focusPos)
  tr = tr.setSelection(newSelection)

  // 5. 派发这个包含了“插入”和“设置选区”两个步骤的事务
  view.dispatch(tr)
}

export function setTextAlign(
  alignment: 'start' | 'center' | 'end' | 'justify'
) {
  return (view: EditorView, schema: Schema) => {
    const { selection, doc, tr } = view.state
    const { from, to } = selection

    let hasChange = false

    doc.nodesBetween(from, to, (node, pos) => {
      if (node.isBlock && 'textAlign' in node.attrs) {
        if (node.attrs.textAlign !== alignment) {
          tr.setNodeMarkup(pos, undefined, {
            ...node.attrs,
            textAlign: alignment
          })
          hasChange = true
        }
      }
    })

    if (hasChange && view.dispatch) {
      view.dispatch(tr)
    }

    return hasChange
  }
}
