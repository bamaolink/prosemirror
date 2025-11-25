import { MarkSpec } from 'prosemirror-model'

export const UnderlineName = 'underline'

export const UnderlineMark: MarkSpec = {
  parseDOM: [
    { tag: 'span.underline-mark' },
    { style: 'text-decoration=underline' },
    { tag: 'u' }
  ],
  toDOM() {
    return ['span', { class: 'underline-mark' }, 0]
  }
}
