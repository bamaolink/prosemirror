import { EditorState, Plugin, PluginKey, Transaction } from 'prosemirror-state'
import type { PluginOptions } from '../../types'

export const changeEventPluginKey = new PluginKey('change-event-plugin')
export const changeEventPlugin = (options: PluginOptions) => {
  const { emitter } = options
  return new Plugin({
    key: changeEventPluginKey,
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
