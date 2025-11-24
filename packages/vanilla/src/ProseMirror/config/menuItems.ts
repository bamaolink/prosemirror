import { toggleMark, setBlockType } from 'prosemirror-commands'
import { Schema } from 'prosemirror-model'
import { EditorView } from 'prosemirror-view'
import {
  ItalicIcon,
  BoldIcon,
  CodeIcon,
  Link2Icon,
  PaletteIcon,
  HighlighterIcon
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
  }
]
