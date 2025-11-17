import { MarkSpec } from 'prosemirror-model'

export const SupMarkName = 'sup'

export const SupMark: MarkSpec = {
  parseDOM: [{ tag: 'sup' }],
  toDOM() {
    return ['sup', 0]
  }
}
