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
  ImageIcon
} from '../icons'

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
    action: () => alert(`Applying heading Bullet Image...`)
  }
]
