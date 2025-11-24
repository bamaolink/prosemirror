import { EditorState, Plugin, PluginKey } from 'prosemirror-state'
import { Decoration, DecorationSet } from 'prosemirror-view'
import { prefix } from '../../config/constants'
import type { PluginOptions } from '../../types'

export const placeholderPluginKey = new PluginKey('placeholder-plugin')
export const placeholderPlugin = (options: PluginOptions) => {
  const { placeholder = `Write, type '/' for commands` } =
    options?.options || {}
  return new Plugin({
    key: placeholderPluginKey,
    props: {
      decorations: (state: EditorState) => {
        const decorations: Decoration[] = []
        if (state.doc.textContent.length === 0) {
          decorations.push(
            Decoration.node(0, state.doc.content.size, {
              class: `${prefix}placeholder`,
              'data-placeholder': placeholder
            })
          )
        }
        return DecorationSet.create(state.doc, decorations)
      }
    }
  })
}
