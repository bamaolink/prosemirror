import { toggleMark, setBlockType } from 'prosemirror-commands'
import { Schema } from 'prosemirror-model'
import { EditorView } from 'prosemirror-view'
import { setTextAlign } from '../functions'
import {
  ItalicIcon,
  BoldIcon,
  CodeIcon,
  Link2Icon,
  PaletteIcon,
  HighlighterIcon,
  UnderlineIcon,
  StrikethroughIcon,
  SuperscriptIcon,
  SubscriptIcon,
  EllipsisVerticalIcon,
  TextAlignStartIcon,
  TextAlignCenterIcon,
  TextAlignEndIcon,
  TextAlignJustifyIcon
} from '../icons'

// ['doc', 'paragraph', 'blockquote', 'horizontal_rule', 'heading', 'code_block', 'text', 'image', 'hard_break', 'ordered_list', 'bullet_list', 'list_item', 'star', 'note', 'notegroup']
// ['link', 'em', 'strong', 'code', 'sub', 'sup']

export const menus = [
  {
    id: 'strong',
    type: 'mark',
    label: 'Strong',
    icon: BoldIcon,
    action: (view: EditorView, schema: Schema) => {
      toggleMark(schema.marks.strong)(view.state, view.dispatch)
    }
  },
  {
    id: 'em',
    type: 'mark',
    label: 'Italic',
    icon: ItalicIcon,
    action: (view: EditorView, schema: Schema) => {
      toggleMark(schema.marks.em)(view.state, view.dispatch)
    }
  },
  {
    id: 'underline',
    type: 'mark',
    label: 'Underline',
    icon: UnderlineIcon,
    action: (view: EditorView, schema: Schema) => {
      toggleMark(schema.marks.underline)(view.state, view.dispatch)
    }
  },
  {
    id: 'strikethrough',
    type: 'mark',
    label: 'Strikethrough',
    icon: StrikethroughIcon,
    action: (view: EditorView, schema: Schema) => {
      toggleMark(schema.marks.strikethrough)(view.state, view.dispatch)
    }
  },
  {
    id: 'code',
    type: 'mark',
    label: 'Code',
    icon: CodeIcon,
    action: (view: EditorView, schema: Schema) => {
      toggleMark(schema.marks.code)(view.state, view.dispatch)
    }
  },
  {
    id: 'link',
    type: 'mark',
    label: 'Link',
    icon: Link2Icon,
    action: (view: EditorView, schema: Schema) => {
      toggleMark(schema.marks.link)(view.state, view.dispatch)
    }
  },
  {
    id: 'highlightColor',
    type: 'mark',
    label: 'Highlight Color',
    icon: HighlighterIcon,
    action: (view: EditorView, schema: Schema) => {
      toggleMark(schema.marks.highlightColor, { color: 'yellow' })(
        view.state,
        view.dispatch
      )
    }
  },
  {
    id: 'textColor',
    type: 'mark',
    label: 'Text Color',
    icon: PaletteIcon,
    action: (view: EditorView, schema: Schema) => {
      toggleMark(schema.marks.textColor, { color: 'red' })(
        view.state,
        view.dispatch
      )
    }
  },
  {
    id: 'more',
    type: 'group',
    label: 'More options',
    icon: EllipsisVerticalIcon,
    action: (view: EditorView, schema: Schema) => {
      return false
    }
  }
]

export const moreMenuItems = [
  {
    id: 'superscript',
    type: 'mark',
    label: 'Superscript',
    icon: SuperscriptIcon,
    action: (view: EditorView, schema: Schema) => {
      toggleMark(schema.marks.superscript)(view.state, view.dispatch)
    }
  },
  {
    id: 'subscript',
    type: 'mark',
    label: 'Subscript',
    icon: SubscriptIcon,
    action: (view: EditorView, schema: Schema) => {
      toggleMark(schema.marks.subscript)(view.state, view.dispatch)
    }
  },
  {
    id: 'text-align-start',
    type: 'mark',
    label: 'Text align start',
    icon: TextAlignStartIcon,
    action: (view: EditorView, schema: Schema) => {
      setTextAlign('start')(view, schema)
    }
  },
  {
    id: 'text-align-center',
    type: 'mark',
    label: 'Text align center',
    icon: TextAlignCenterIcon,
    action: (view: EditorView, schema: Schema) => {
      setTextAlign('center')(view, schema)
    }
  },
  {
    id: 'text-align-end',
    type: 'mark',
    label: 'Text align end',
    icon: TextAlignEndIcon,
    action: (view: EditorView, schema: Schema) => {
      setTextAlign('end')(view, schema)
    }
  },
  {
    id: 'text-align-justify',
    type: 'mark',
    label: 'Text align justify',
    icon: TextAlignJustifyIcon,
    action: (view: EditorView, schema: Schema) => {
      setTextAlign('justify')(view, schema)
    }
  }
]
