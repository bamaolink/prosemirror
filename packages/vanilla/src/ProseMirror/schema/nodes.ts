import { addListNodes } from 'prosemirror-schema-list'
import { schema } from 'prosemirror-schema-basic'
import { emojis } from '../config/emojis'

const nodes = addListNodes(
  schema.spec.nodes,
  'paragraph block*',
  'block'
).toObject()

nodes.doc.content = '(block | note | notegroup)+'

nodes.star = {
  inline: true,
  group: 'inline',
  draggable: true,
  toDOM() {
    return ['star', { style: 'color: red' }, '🟊']
  },
  parseDOM: [{ tag: 'star' }]
}

nodes.emoji = {
  attrs: {
    emoji_id: { default: '' }
  },
  inline: true,
  group: 'inline',
  draggable: true,
  toDOM(node) {
    const emojiId = node.attrs.emoji_id
    const emoji = emojis.find((emoji) => emoji.id === emojiId)?.emoji || ''
    return ['span', { class: 'prose-emoji' }, emoji]
  },
  parseDOM: [
    {
      tag: 'span[data-emoji-id]',
      getAttrs(dom: HTMLElement) {
        return {
          emoji_id: dom.getAttribute('data-emoji-id')
        }
      }
    }
  ]
}

nodes.note = {
  content: '(star | text)*',
  toDOM() {
    return ['note', 0]
  },
  parseDOM: [{ tag: 'note' }]
}

nodes.notegroup = {
  content: 'note+',
  toDOM() {
    return ['notegroup', 0]
  },
  parseDOM: [{ tag: 'notegroup' }]
}

export { nodes }
