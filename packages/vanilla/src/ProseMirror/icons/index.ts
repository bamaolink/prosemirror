import { prefix } from '../config/constants'
import {
  createElement,
  Bold,
  IconNode,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Heading5,
  Heading6,
  TextQuote,
  TextInitial,
  Italic,
  GripVertical,
  Plus,
  ListOrdered,
  List,
  ListTodo,
  Code
} from 'lucide'
export const createIcon = (icon: IconNode, name: string) => {
  return createElement(icon, {
    class: [`${prefix}icon`, `${prefix}icon-${name}`].join(' ')
  })
}

export const BoldIcon = createIcon(Bold, 'bold')
export const Heading1Icon = createIcon(Heading1, 'heading-1')
export const Heading2Icon = createIcon(Heading2, 'heading-2')
export const Heading3Icon = createIcon(Heading3, 'heading-3')
export const Heading4Icon = createIcon(Heading4, 'heading-4')
export const Heading5Icon = createIcon(Heading5, 'heading-5')
export const Heading6Icon = createIcon(Heading6, 'heading-6')
export const TextQuoteIcon = createIcon(TextQuote, 'text-quote')
export const TextInitialIcon = createIcon(TextInitial, 'text-initial')
export const ItalicIcon = createIcon(Italic, 'italic')
export const GripVerticalIcon = createIcon(GripVertical, 'grip-vertical')
export const PlusIcon = createIcon(Plus, 'plus')
export const ListOrderedIcon = createIcon(ListOrdered, 'list-ordered')
export const ListIcon = createIcon(List, 'list')
export const ListTodoIcon = createIcon(ListTodo, 'list-todo')
export const CodeIcon = createIcon(Code, 'code')
