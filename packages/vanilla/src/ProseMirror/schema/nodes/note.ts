import { NodeSpec } from 'prosemirror-model'

export const NoteNodeName = 'note'

export const NoteNode: NodeSpec = {
  content: '(star | text)*',
  toDOM() {
    return ['note', 0]
  },
  parseDOM: [{ tag: 'note' }]
}

export const NoteGroupNodeName = 'notegroup'

export const NoteGroupNode: NodeSpec = {
  content: 'note+',
  toDOM() {
    return ['notegroup', 0]
  },
  parseDOM: [{ tag: 'notegroup' }]
}
