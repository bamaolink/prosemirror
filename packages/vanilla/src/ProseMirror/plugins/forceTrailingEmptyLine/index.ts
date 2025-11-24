import { Plugin, PluginKey } from 'prosemirror-state'
import { Node } from 'prosemirror-model'
import type { PluginOptions } from '../../types'

const forceTrailingEmptyLinePluginKey = new PluginKey(
  'force-trailing-empty-line-plugin'
)

export function forceTrailingEmptyLinePlugin(options: PluginOptions) {
  return new Plugin({
    key: forceTrailingEmptyLinePluginKey,
    appendTransaction(transactions, oldState, newState) {
      if (
        !transactions.some((tr) => tr.docChanged) ||
        newState.tr.getMeta(forceTrailingEmptyLinePluginKey)
      ) {
        return null
      }

      const lastNode: Node | null = newState.doc.lastChild

      const isLastNodeEmptyParagraph =
        lastNode &&
        lastNode.type.name === 'paragraph' &&
        lastNode.content.size === 0

      if (isLastNodeEmptyParagraph) {
        return null
      }

      const tr = newState.tr
      const pos = newState.doc.content.size
      const paragraph = newState.schema.nodes.paragraph.create()

      tr.insert(pos, paragraph)

      tr.setMeta(forceTrailingEmptyLinePluginKey, true)
      return tr
    }
  })
}
