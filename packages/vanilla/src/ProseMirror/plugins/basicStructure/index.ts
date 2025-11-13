import { Plugin, PluginKey } from 'prosemirror-state'
import { EditorView } from 'prosemirror-view'
import type { PluginOptions } from '../../types'
import { prefix as prefixDefault } from '../../config/constants'

export const pluginKey = new PluginKey('basic-structure')

class BasicStructureView {
  view: EditorView

  constructor(view: EditorView, pluginOptions: PluginOptions) {
    this.view = view
    const { wrapper, options } = pluginOptions
    const { prefix = prefixDefault } = options

    view.dom.classList.add(`${prefix}prosemirror`)

    wrapper.classList.add(`${prefix}prosemirror-wrapper`)
  }

  update() {}

  destroy() {}
}

export const basicStructure = (options: PluginOptions) => {
  return new Plugin({
    key: pluginKey,
    view: (view) => {
      return new BasicStructureView(view, options)
    }
  })
}
