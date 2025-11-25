import { MarkSpec } from 'prosemirror-model'

export const SuperscriptName = 'superscript'

export const SuperscriptMark: MarkSpec = {
  parseDOM: [{ tag: 'sup' }],
  toDOM() {
    return ['sup', 0]
  }
}
