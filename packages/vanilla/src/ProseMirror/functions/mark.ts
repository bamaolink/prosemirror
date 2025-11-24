import { EditorState } from 'prosemirror-state'
import { MarkType, Mark } from 'prosemirror-model'

export function isMarkActive(state: EditorState, markType: MarkType): boolean {
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

export function getMarksInRange(state: EditorState) {
  const { from, to } = state.selection
  const marks: Mark[] = []

  // 遍历选区内的所有节点
  state.doc.nodesBetween(from, to, (node) => {
    // node.marks 是一个包含该节点所有 Mark 的数组
    // 使用扩展运算符 (...) 将它们全部添加到 marks 数组中
    marks.push(...node.marks)
  })

  // 去重：因为多个节点可能共享相同的 Mark 实例，我们需要一个唯一的列表
  const uniqueMarks: Mark[] = []
  marks.forEach((mark) => {
    // Mark 对象有一个 eq 方法可以比较两个 Mark 是否完全相同（包括属性）
    const alreadyExists = uniqueMarks.some((m) => m.eq(mark))
    if (!alreadyExists) {
      uniqueMarks.push(mark)
    }
  })

  return uniqueMarks
}

export function getMarkNodeInRange(state: EditorState, markType: MarkType) {
  const marks: Mark[] = getMarksInRange(state)
  return marks.find((m) => m.type === markType)
}
