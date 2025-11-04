import type { EditorView as ProseMirrorEditorView } from 'prosemirror-view'
import type { Emitter as _Emitter } from 'mitt'
import type {
  Transaction,
  EditorState as ProseMirrorEditorState
} from 'prosemirror-state'
import type { Node, Schema as ProseMirrorSchema } from 'prosemirror-model'

declare namespace BamaoLinkEditorType {
  type Events = {
    initialization: ProseMirrorEditorView
    change: { newDoc: Node; oldDoc: Node; tr: Transaction }
    selected: {
      nodes: Record<string, boolean>
      marks: Record<string, boolean>
      view: ProseMirrorEditorView
      prevState: ProseMirrorEditorState
    }
  }

  type Options = {
    initialValue?: string
    placeholder?: string
  }

  type EditorView = ProseMirrorEditorView

  type Schema = ProseMirrorSchema

  type PluginsOptions = {
    placeholder?: string
  }

  type Emitter = _Emitter<Events>
}

export = BamaoLinkEditorType

export as namespace BamaoLinkEditorType
