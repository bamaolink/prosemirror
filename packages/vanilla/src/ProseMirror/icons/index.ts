import { prefix } from '../config/constants'
import {
  createElement,
  Bold,
  IconNode,
  Heading,
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
  Code,
  FileCodeCorner,
  Image,
  Search,
  ArrowRight,
  CircleQuestionMark,
  SmilePlus,
  ChevronDown,
  ChevronRight,
  SquarePen,
  Trash2,
  Copy,
  Sheet,
  ArrowDownFromLine,
  ArrowLeftFromLine,
  ArrowRightFromLine,
  ArrowUpFromLine,
  TableCellsMerge,
  TableCellsSplit,
  Link2,
  ExternalLink,
  Save,
  Check
} from 'lucide'
export const createIcon = (icon: IconNode, name: string) => {
  return createElement(icon, {
    class: [`${prefix}icon`, `${prefix}icon-${name}`].join(' ')
  })
}

export const BoldIcon = createIcon(Bold, 'bold')
export const HeadingIcon = createIcon(Heading, 'heading')
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
export const FileCodeCornerIcon = createIcon(FileCodeCorner, 'file-code-corner')
export const ImageIcon = createIcon(Image, 'image')
export const SearchIcon = createIcon(Search, 'search')
export const ArrowRightIcon = createIcon(ArrowRight, 'arrow-right')
export const CircleQuestionMarkIcon = createIcon(
  CircleQuestionMark,
  'circle-question-mark'
)
export const SmilePlusIcon = createIcon(SmilePlus, 'smile-plus')
export const ChevronDownIcon = createIcon(ChevronDown, 'chevron-down')
export const ChevronRightIcon = createIcon(ChevronRight, 'chevron-right')
export const SquarePenIcon = createIcon(SquarePen, 'square-pen')
export const Trash2Icon = createIcon(Trash2, 'trash-2')
export const CopyIcon = createIcon(Copy, 'copy')
export const SheetIcon = createIcon(Sheet, 'sheet')

export const ArrowLeftFromLineIcon = createIcon(
  ArrowLeftFromLine,
  'arrow-left-from-line'
)
export const ArrowRightFromLineIcon = createIcon(
  ArrowRightFromLine,
  'arrow-right-from-line'
)
export const ArrowUpFromLineIcon = createIcon(
  ArrowUpFromLine,
  'arrow-up-from-line'
)
export const ArrowDownFromLineIcon = createIcon(
  ArrowDownFromLine,
  'arrow-down-from-line'
)
export const TableCellsMergeIcon = createIcon(
  TableCellsMerge,
  'table-cells-merge'
)
export const TableCellsSplitIcon = createIcon(
  TableCellsSplit,
  'table-cells-split'
)
export const Link2Icon = createIcon(Link2, 'link-2')
export const ExternalLinkIcon = createIcon(ExternalLink, 'external-link')
export const SaveIcon = createIcon(Save, 'save')
export const CheckIcon = createIcon(Check, 'check')
