import { EditorState, Plugin, PluginKey, Transaction } from 'prosemirror-state'
import type { PluginOptions } from '../../types'
import { schema } from '../../schema'
import {
  DOMSerializer as ProseMirrorDOMSerializer,
  Node
} from 'prosemirror-model'

const getHTML = (doc: Node) => {
  const serializer = ProseMirrorDOMSerializer.fromSchema(schema)
  let outor: HTMLDivElement | null = document.createElement('div')
  serializer.serializeFragment(doc.content, { document }, outor)
  const html = outor.innerHTML
  outor.remove()
  outor = null
  return html
}

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
            value: getHTML(newState.doc),
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
