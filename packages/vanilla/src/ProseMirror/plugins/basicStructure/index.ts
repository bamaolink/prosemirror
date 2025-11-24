import { Plugin, PluginKey } from 'prosemirror-state'
import { EditorView } from 'prosemirror-view'
import type { PluginOptions } from '../../types'
import { prefix as prefixDefault } from '../../config/constants'

export const basicStructurePluginKey = new PluginKey('basic-structure-plugin')

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

export const basicStructurePlugin = (options: PluginOptions) => {
  return new Plugin({
    key: basicStructurePluginKey,
    view: (view) => {
      return new BasicStructureView(view, options)
    }
  })
}
