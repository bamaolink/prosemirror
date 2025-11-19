import { NodeSpec } from 'prosemirror-model'

export const CodeBlockNodeName = 'code_block'

export const CodeBlockNode: NodeSpec = {
  content: 'text*',
  marks: '',
  group: 'block',
  code: true,
  defining: true,
  attrs: { language: { default: 'plaintext' } },
  parseDOM: [
    {
      tag: 'pre',
      preserveWhitespace: 'full',
      getAttrs: (node) => {
        const language = node.getAttribute('data-language')
        return {
          language
        }
      }
    }
  ],
  toDOM(node) {
    return ['pre', { 'data-language': node.attrs.language }, ['code', 0]]
  }
}
