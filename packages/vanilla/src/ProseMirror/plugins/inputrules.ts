import {
  inputRules,
  wrappingInputRule,
  textblockTypeInputRule,
  InputRule,
  smartQuotes,
  emDash,
  ellipsis
} from 'prosemirror-inputrules'
import { NodeType, MarkType } from 'prosemirror-model'
import type { PluginOptions } from '../types'

/// Given a blockquote node type, returns an input rule that turns `"> "`
/// at the start of a textblock into a blockquote.
export function blockQuoteRule(nodeType: NodeType) {
  return wrappingInputRule(/^\s*>\s$/, nodeType)
}

/// Given a list node type, returns an input rule that turns a number
/// followed by a dot at the start of a textblock into an ordered list.
export function orderedListRule(nodeType: NodeType) {
  return wrappingInputRule(
    /^(\d+)\.\s$/,
    nodeType,
    (match) => ({ order: +match[1] }),
    (match, node) => node.childCount + node.attrs.order == +match[1]
  )
}

/// Given a list node type, returns an input rule that turns a bullet
/// (dash, plush, or asterisk) at the start of a textblock into a
/// bullet list.
export function bulletListRule(nodeType: NodeType) {
  return wrappingInputRule(/^\s*([-+*])\s$/, nodeType)
}

/// Given a code block node type, returns an input rule that turns a
/// textblock starting with three backticks into a code block.
export function codeBlockRule(nodeType: NodeType) {
  // return textblockTypeInputRule(/^```$/, nodeType)
  return textblockTypeInputRule(/^```(\w+)?\s$/, nodeType, (match) => ({
    language: match[1] || 'plaintext'
  }))
}

/// Given a node type and a maximum level, creates an input rule that
/// turns up to that number of `#` characters followed by a space at
/// the start of a textblock into a heading whose level corresponds to
/// the number of `#` signs.
export function headingRule(nodeType: NodeType, maxLevel: number) {
  return textblockTypeInputRule(
    new RegExp('^(#{1,' + maxLevel + '})\\s$'),
    nodeType,
    (match) => ({ level: match[1].length })
  )
}

/// Input rules for task list items
export function taskListInputRule(nodeType: NodeType, checked: boolean) {
  // uncheckedTaskListInputRule input rule for `-[]` or `-[ ]` for an unchecked item.
  // checkedTaskListInputRule input rule for `-[x]` for a checked item.
  const pattern = checked ? /^\s*(-\[x\])\s$/i : /^\s*(-\[\s*\])\s$/
  return wrappingInputRule(
    pattern,
    nodeType,
    { checked },
    (match, node) => node.childCount + node.attrs.checked === (checked ? 1 : 0)
  )
}

export function createLinkInputRule(linkType: MarkType) {
  return new InputRule(
    // 正则表达式：匹配 [text](url) 或 [text](url "title")
    /\[([^\]]+)]\(([^)\s]+)(?:\s+"([^"]+)")?\) $/,
    (state, match, start, end) => {
      const [fullMatch, text, href, title] = match
      const tr = state.tr

      if (!href) return null

      // 1. 替换文本：把 [text](url) 替换为 text
      tr.insertText(text, start, end)

      // 2. 添加 Mark：给 text 添加 link mark
      const mark = linkType.create({ href, title: title || '' })
      tr.addMark(start, start + text.length, mark)

      return tr
    }
  )
}

/// A set of input rules for creating the basic block quotes, lists,
/// code blocks, and heading.
export function buildInputRules(options: PluginOptions) {
  const { schema } = options
  let rules = smartQuotes.concat(ellipsis, emDash),
    type
  if ((type = schema.nodes.blockquote)) rules.push(blockQuoteRule(type))
  if ((type = schema.nodes.ordered_list)) rules.push(orderedListRule(type))
  if ((type = schema.nodes.bullet_list)) rules.push(bulletListRule(type))
  if ((type = schema.nodes.code_block)) rules.push(codeBlockRule(type))
  if ((type = schema.nodes.heading)) rules.push(headingRule(type, 6))
  if ((type = schema.nodes.task_list_item))
    rules.push(taskListInputRule(type, true))
  if ((type = schema.nodes.task_list_item))
    rules.push(taskListInputRule(type, false))
  if ((type = schema.marks.link)) rules.push(createLinkInputRule(type))
  return inputRules({ rules })
}
