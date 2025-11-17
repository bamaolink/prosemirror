import { MarkSpec } from 'prosemirror-model'

export const SubMarkName = 'sub'

export const SubMark: MarkSpec = {
  parseDOM: [{ tag: 'sub' }],
  toDOM() {
    return ['sub', 0]
  }
}
