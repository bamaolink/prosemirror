import { toggleMark, setBlockType } from 'prosemirror-commands'
import { Schema } from 'prosemirror-model'
import { EditorView } from 'prosemirror-view'
import { ItalicIcon, BoldIcon, CodeIcon, TextInitialIcon } from '../icons'

// ['doc', 'paragraph', 'blockquote', 'horizontal_rule', 'heading', 'code_block', 'text', 'image', 'hard_break', 'ordered_list', 'bullet_list', 'list_item', 'star', 'note', 'notegroup']
// ['link', 'em', 'strong', 'code', 'sub', 'sup']

export const menus = [
  {
    key: 'note',
    type: 'node',
    label: 'Paragraph',
    icon: TextInitialIcon,
    action: (view: EditorView, schema: Schema) => {
      setBlockType(schema.nodes.note)(view.state, view.dispatch)
    }
  },
  {
    key: 'strong',
    type: 'mark',
    label: 'Strong',
    icon: BoldIcon,
    action: (view: EditorView, schema: Schema) => {
      toggleMark(schema.marks.strong)(view.state, view.dispatch)
    }
  },
  {
    key: 'em',
    type: 'mark',
    label: 'Em',
    icon: ItalicIcon,
    action: (view: EditorView, schema: Schema) => {
      toggleMark(schema.marks.em)(view.state, view.dispatch)
    }
  },
  {
    key: 'code',
    type: 'mark',
    label: 'Code',
    icon: CodeIcon,
    action: (view: EditorView, schema: Schema) => {
      toggleMark(schema.marks.strong)(view.state, view.dispatch)
    }
  }
]
