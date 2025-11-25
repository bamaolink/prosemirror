import { MarkSpec } from 'prosemirror-model'

export const SubscriptName = 'subscript'

export const SubscriptMark: MarkSpec = {
  parseDOM: [{ tag: 'sub' }],
  toDOM() {
    return ['sub', 0]
  }
}
