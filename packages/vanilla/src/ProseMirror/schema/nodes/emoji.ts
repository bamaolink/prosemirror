import { NodeSpec } from 'prosemirror-model'
import { emojis } from '../../config/emojis'

export const EmojiNodeName = 'emoji'

export const EmojiNode: NodeSpec = {
  attrs: {
    emoji_id: { default: '' }
  },
  inline: true,
  group: 'inline',
  draggable: true,
  toDOM(node) {
    const emojiId = node.attrs.emoji_id
    const emoji = emojis.find((emoji) => emoji.id === emojiId)?.emoji || ''
    return ['span', { class: 'bml-emoji' }, emoji]
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
