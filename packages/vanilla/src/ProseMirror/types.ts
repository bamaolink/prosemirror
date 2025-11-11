import type { EditorView as ProseMirrorEditorView } from 'prosemirror-view'
import type { Emitter as _Emitter } from 'mitt'
import type {
  Transaction,
  EditorState as ProseMirrorEditorState
} from 'prosemirror-state'
import type {
  Node,
  Schema as ProseMirrorSchema,
  Node as ProseMirrorNode
} from 'prosemirror-model'

export interface DragHandleStateType {
  nodePos: number // The position of the node in the document.
  node: ProseMirrorNode //  The ProseMirror Node object.
  dom: HTMLElement // The DOM element for the node.
  domRect: DOMRect // The DOMRect object for the node.
}

export type Events = {
  initialization: ProseMirrorEditorView
  change: { newDoc: Node; oldDoc: Node; tr: Transaction }
  selected: {
    nodes: Record<string, boolean>
    marks: Record<string, boolean>
    view: ProseMirrorEditorView
    prevState: ProseMirrorEditorState
  }
  'side-menu-update': {
    state: DragHandleStateType | null
    view: EditorView
  }
}

export type Options = {
  initialValue?: string
  placeholder?: string
}

export type EditorView = ProseMirrorEditorView

export type Schema = ProseMirrorSchema

export type PluginsOptions = {
  placeholder?: string
}

export type Emitter = _Emitter<Events>
