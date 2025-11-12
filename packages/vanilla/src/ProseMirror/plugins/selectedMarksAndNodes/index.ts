import { EditorState, Plugin, PluginKey } from 'prosemirror-state'
import { MarkType, NodeType, Node } from 'prosemirror-model'
import type { PluginOptions } from '../../types'

export const pluginKey = new PluginKey('selected-marks-and-nodes')

/**
 * 检查给定的 Mark 类型在当前选区是否处于激活状态。
 *
 * @param state 当前的编辑器状态。
 * @param markType 要检查的 Mark 类型 (例如 schema.marks.strong)。
 * @returns 如果标记激活，则返回 true；否则返回 false。
 */
function isMarkActive(state: EditorState, markType: MarkType): boolean {
  const { from, to, empty, $from } = state.selection

  // 情况1：选区为空（光标状态）
  if (empty) {
    // 检查 storedMarks (用于决定下一个字符的样式)
    // 或者检查光标位置的标记
    return !!markType.isInSet(state.storedMarks || $from.marks())
  }

  // 情况2：有选区（选中了文字）
  // 遍历选区内的所有节点，检查所有文本节点是否都包含该标记。
  // 如果发现任何一个文本节点不包含该标记，则认为该标记不激活。
  let allTextNodesHaveMark = true
  let hasAnyTextNode = false // 确保选区内至少有文本节点

  state.doc.nodesBetween(from, to, (node) => {
    if (node.isText) {
      hasAnyTextNode = true
      if (!markType.isInSet(node.marks)) {
        allTextNodesHaveMark = false
        return false // 发现不匹配的文本节点，停止遍历
      }
    }
    // 如果遇到非文本节点，我们通常认为它不影响文本标记的“激活”状态，
    // 但如果你的需求是“整个选区（包括非文本节点）都必须被标记”，则需要调整逻辑。
    // 目前的逻辑是：只关注选区内的文本节点。
  })

  // 只有当选区内有文本节点，并且所有文本节点都包含该标记时，才认为是激活状态。
  return hasAnyTextNode && allTextNodesHaveMark
}

/**
 * 检查给定的 Node 类型在当前选区是否处于激活状态。
 * 该函数能同时处理块级节点和行内节点。
 *
 * @param state 当前的编辑器状态。
 * @param nodeType 要检查的 Node 类型 (例如 schema.nodes.heading, schema.nodes.image)。
 * @param attrs 可选的属性对象，用于检查节点是否具有特定的属性值 (例如 { level: 1 })。
 * @returns 如果节点激活，则返回 true；否则返回 false。
 */
function isNodeActive(
  state: EditorState,
  nodeType: NodeType,
  attrs: { [key: string]: any } | null = null
): boolean {
  const { $from, to, empty, from } = state.selection

  // 辅助函数：检查一个节点是否匹配给定的类型和属性
  const matches = (node: Node | null): boolean => {
    if (!node || node.type !== nodeType) return false
    if (attrs) {
      return Object.keys(attrs).every((key) => node.attrs[key] === attrs[key])
    }
    return true
  }

  // --- 块级节点检查 (Block Node Check) ---
  // 对于块级节点，我们检查选区起始位置的祖先节点链
  if (!nodeType.isInline) {
    for (let i = $from.depth; i >= 0; i--) {
      const node = $from.node(i)
      if (matches(node)) {
        return true
      }
    }
  }
  // --- 行内节点检查 (Inline Node Check) ---
  // 对于行内节点，我们检查选区周围或选区内的节点
  else {
    // 情况1：选区为空（光标状态）
    if (empty) {
      // 检查光标前后的节点
      if (matches($from.nodeBefore)) return true
      if (matches($from.nodeAfter)) return true
      // 如果你的行内节点是可编辑的 NodeView，并且光标在其内部，
      // 这里的逻辑可能需要更复杂，但对于大多数非编辑行内节点，检查前后节点足够。
    }
    // 情况2：有选区（选中了文字）
    else {
      let found = false
      // 遍历选区内的所有节点，看是否包含目标行内节点
      state.doc.nodesBetween(from, to, (node) => {
        if (matches(node)) {
          found = true
          return false // 找到后停止遍历
        }
      })
      if (found) return true
    }
  }

  return false // 没有找到匹配的节点
}

export const selectedMarksAndNodes = (options: PluginOptions) => {
  const { emitter, schema } = options
  function getNodesAndMarksActive(state: EditorState) {
    const { nodes, marks } = schema
    return {
      nodes: Object.keys(nodes).reduce((acc, key) => {
        acc[key] = isNodeActive(state, nodes[key])
        return acc
      }, {} as Record<string, boolean>),
      marks: Object.keys(marks).reduce((acc, key) => {
        acc[key] = isMarkActive(state, marks[key])
        return acc
      }, {} as Record<string, boolean>)
    }
  }

  return new Plugin({
    key: pluginKey,
    state: {
      init() {
        return null
      },
      apply(tr, value) {
        const meta = tr.getMeta(pluginKey)
        return meta || value || null
      }
    },
    view() {
      return {
        update: (view, prevState) => {
          if (
            view.state.doc !== prevState.doc ||
            view.state.selection !== prevState.selection
          ) {
            const nodesAndMarks = getNodesAndMarksActive(view.state)
            const res = {
              ...nodesAndMarks,
              view,
              prevState
            }
            view.dispatch(view.state.tr.setMeta(pluginKey, nodesAndMarks))
            emitter.emit('selected', res)
          }
        }
      }
    }
  })
}
