import { MarkSpec } from 'prosemirror-model'

export const TextColorName = 'textColor'

export const TextColorMark: MarkSpec = {
  attrs: {
    color: { default: 'red' }
  },
  parseDOM: [
    {
      tag: 'span',
      getAttrs: (dom) => {
        const backgroundColor = dom.style.backgroundColor
        return backgroundColor ? { color: backgroundColor } : false
      }
    }
  ],
  toDOM: (mark) => {
    return ['span', { style: `color: ${mark.attrs.color}` }, 0]
  }
}
