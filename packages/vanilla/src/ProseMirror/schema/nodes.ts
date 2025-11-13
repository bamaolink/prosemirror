import { addListNodes } from 'prosemirror-schema-list'
import { schema } from 'prosemirror-schema-basic'

const nodes = addListNodes(
  schema.spec.nodes,
  'paragraph block*',
  'block'
).toObject()

nodes.doc.content = '(block | note | notegroup)+'

const emojis = {
  smail: '😃'
}

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
    emoji_type: { default: '' }
  },
  inline: true,
  group: 'inline',
  draggable: true,
  toDOM(node) {
    const emoji_type = node.attrs.emoji_type?.replace(
      /^:/,
      ''
    ) as keyof typeof emojis
    const emoji = emojis[emoji_type] || ''
    return ['span', { class: 'prose-emoji' }, emoji]
  },
  parseDOM: [
    {
      tag: 'span[data-emoji]',
      getAttrs(dom: HTMLElement) {
        return {
          emoji_type: dom.getAttribute('data-emoji')
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
