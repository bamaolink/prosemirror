import { Plugin, PluginKey } from 'prosemirror-state'
import { PluginOptions } from '../../types'

export const titleEnforcerPluginKey = new PluginKey('title-enforcer')

/**
 * Creates a ProseMirror plugin that enforces the first node in the document
 * is always a heading with level 1.
 *
 * It relies on the schema (`content: "heading block*"`) to ensure the first
 * node is a heading. This plugin then checks the level of that heading.
 * If the level is not 1, it creates and returns a new transaction that
 * sets the level back to 1.
 */
export function titleEnforcerPlugin(options: PluginOptions) {
  return new Plugin({
    key: titleEnforcerPluginKey,
    appendTransaction(transactions, oldState, newState) {
      // Only run if the document has changed.
      if (!transactions.some((tr) => tr.docChanged)) {
        return null
      }

      const firstNode = newState.doc.firstChild

      // Check if the first node is a heading and its level is not 1.
      if (
        firstNode &&
        firstNode.type.name === 'heading' &&
        firstNode.attrs.level !== 1
      ) {
        // If it's not, create a corrective transaction.
        const tr = newState.tr
        tr.setNodeMarkup(0, undefined, { ...firstNode.attrs, level: 1 })

        // Prevent this corrective transaction from being added to the undo history.
        tr.setMeta('addToHistory', false)

        return tr
      }

      return null
    }
  })
}
