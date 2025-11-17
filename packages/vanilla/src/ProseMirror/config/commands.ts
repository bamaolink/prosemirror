import type { CommandItemType } from '../types'
import { setBlockType } from 'prosemirror-commands'
import { wrapInList } from 'prosemirror-schema-list'
import {
  HeadingIcon,
  Heading1Icon,
  Heading2Icon,
  Heading3Icon,
  Heading4Icon,
  Heading5Icon,
  Heading6Icon,
  ListIcon,
  ListOrderedIcon,
  ImageIcon,
  SmilePlusIcon
} from '../icons'
import { emojis } from '../config/emojis'
import { insertImagePlaceholderCommand } from '../functions'

const headingIcons = [
  Heading1Icon,
  Heading2Icon,
  Heading3Icon,
  Heading4Icon,
  Heading5Icon,
  Heading6Icon
]
const headings: CommandItemType[] = headingIcons.map((icon, index) => {
  const level = index + 1
  return {
    id: `heading-${level}`,
    pid: 'heading',
    name: `Heading ${level}`,
    type: 'command',
    description: `Heading ${level}`,
    icon,
    action: (view, schema) => {
      setBlockType(schema.nodes.heading, { level })(view.state, view.dispatch)
    }
  }
})

const emojiItems: CommandItemType[] = emojis.map((e) => {
  return {
    id: e.id,
    pid: 'emoji',
    name: e.name,
    type: 'command',
    description: e.emoji,
    action: (view, schema) => {
      const { $from } = view.state.selection
      const index = $from.index()

      if (!$from.parent.canReplaceWith(index, index, schema.nodes.emoji)) {
        return false
      }

      view.dispatch(
        view.state.tr.replaceSelectionWith(
          schema.nodes.emoji.create({ emoji_id: e.id })
        )
      )
      return true
    }
  }
})

export const commandRootGroups: CommandItemType[] = [
  {
    id: 'basic-blocks',
    name: 'Basic blocks',
    type: 'group',
    description: 'Basic blocks'
  },
  {
    id: 'media',
    name: 'Media',
    type: 'group',
    description: 'Media'
  }
]

export const commands: CommandItemType[] = [
  {
    id: 'heading',
    gid: 'basic-blocks',
    name: 'Heading',
    type: 'group',
    description: 'Heading',
    icon: HeadingIcon
  },
  ...headings,
  {
    id: 'bullet_list',
    name: 'Bullet list',
    gid: 'basic-blocks',
    type: 'command',
    description: 'Bullet list',
    icon: ListIcon,
    action: (view, schema) => {
      wrapInList(schema.nodes.bullet_list)(view.state, view.dispatch)
    }
  },
  {
    id: 'ordered_list',
    name: 'Ordered list',
    gid: 'basic-blocks',
    type: 'command',
    description: 'Ordered list',
    icon: ListOrderedIcon,
    action: (view, schema) => {
      wrapInList(schema.nodes.ordered_list)(view.state, view.dispatch)
    }
  },
  {
    id: 'image',
    name: 'Image',
    gid: 'media',
    type: 'command',
    description: 'Image',
    icon: ImageIcon,
    action: insertImagePlaceholderCommand
  },
  {
    id: 'emoji',
    gid: 'media',
    name: 'Emoji',
    type: 'group',
    description: 'Emoji',
    icon: SmilePlusIcon
  },
  ...emojiItems
]
