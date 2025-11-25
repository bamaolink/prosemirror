import { MarkSpec } from 'prosemirror-model'

export const StrikethroughName = 'strikethrough'

export const StrikethroughMark: MarkSpec = {
  parseDOM: [
    { tag: 's' },
    { tag: 'del' },
    { tag: 'strike' },
    { style: 'text-decoration=line-through' },
    { style: 'text-decoration-line=line-through' }
  ],
  toDOM() {
    return ['span', { class: 'strikethrough-mark' }, 0]
  }
}
