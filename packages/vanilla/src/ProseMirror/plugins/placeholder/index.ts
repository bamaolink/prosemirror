import { EditorState, Plugin, PluginKey } from 'prosemirror-state'
import { Decoration, DecorationSet } from 'prosemirror-view'
import { prefix } from '../../config/constants'
import type { PluginOptions } from '../../types'
import './index.scss'

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
          let size = state.doc.content.size
          size = size > 2 ? 2 : size
          decorations.push(
            Decoration.node(0, size, {
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
