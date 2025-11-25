import { NodeSpec } from 'prosemirror-model'

export const ParagraphName = 'paragraph'

export const ParagraphNode: NodeSpec = {
  content: 'inline*',
  group: 'block',
  attrs: {
    textAlign: { default: 'start' }
  },
  parseDOM: [
    {
      tag: 'p',
      getAttrs: (dom) => ({
        textAlign: dom.style.textAlign || 'start'
      })
    }
  ],
  toDOM(node) {
    const { textAlign } = node.attrs
    let style = ''
    if (textAlign && textAlign !== 'start') {
      style = `text-align: ${textAlign}`
    }
    if (style) {
      return ['p', { style }, 0]
    }
    return ['p', 0]
  }
}
