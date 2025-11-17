import { NodeSpec } from 'prosemirror-model'

export const StarNodeName = 'star'

export const StarNode: NodeSpec = {
  inline: true,
  group: 'inline',
  draggable: true,
  toDOM() {
    return ['star', { style: 'color: red' }, '🟊']
  },
  parseDOM: [{ tag: 'star' }]
}
