import { MarkSpec } from 'prosemirror-model'

export const HighlightColorName = 'highlightColor'

export const HighlightColorMark: MarkSpec = {
  attrs: {
    color: { default: 'yellow' }
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
    return [
      'span',
      {
        style: `background-color: ${mark.attrs.color}`,
        class: 'highlight-color-mark'
      },
      0
    ]
  }
}
