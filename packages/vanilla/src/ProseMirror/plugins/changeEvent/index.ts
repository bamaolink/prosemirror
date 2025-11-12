import { EditorState, Plugin, PluginKey, Transaction } from 'prosemirror-state'
import type { PluginOptions } from '../../types'

export const pluginKey = new PluginKey('change-event')
export const changeEvent = (options: PluginOptions) => {
  const { emitter } = options
  return new Plugin({
    key: pluginKey,
    state: {
      init() {
        return null
      },
      apply(
        tr: Transaction,
        value: any,
        oldState: EditorState,
        newState: EditorState
      ) {
        if (tr.docChanged) {
          emitter.emit('change', {
            newDoc: newState.doc,
            oldDoc: oldState.doc,
            tr
          })
        }
        return null
      }
    }
  })
}
