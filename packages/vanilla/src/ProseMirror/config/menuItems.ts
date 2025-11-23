import { toggleMark, setBlockType } from 'prosemirror-commands'
import { Schema } from 'prosemirror-model'
import { EditorView } from 'prosemirror-view'
import { ItalicIcon, BoldIcon, CodeIcon, Link2Icon } from '../icons'

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
    label: 'Em',
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
  }
]
