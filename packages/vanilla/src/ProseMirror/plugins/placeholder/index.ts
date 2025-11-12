import { EditorState, Plugin, PluginKey } from 'prosemirror-state'
import { Decoration, DecorationSet } from 'prosemirror-view'
import { prefix } from '../../components/consts'
import type { PluginOptions } from '../../types'

export const pluginKey = new PluginKey('placeholder-plugin')
export const placeholderPlugin = (options: PluginOptions) => {
  const { placeholder = '请输入...' } = options?.options || {}
  return new Plugin({
    key: pluginKey,
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
