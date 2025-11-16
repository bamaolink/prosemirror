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

export type EmitterEvents = {
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

export type EditorOptions = {
  prefix?: string
  initialValue?: string
  placeholder?: string
}

export type EditorView = ProseMirrorEditorView

export type Schema = ProseMirrorSchema

// 创建插件时的统一参数
export type PluginOptions = {
  schema: Schema
  emitter: Emitter
  wrapper: HTMLElement
  options: EditorOptions
}

export type Emitter = _Emitter<EmitterEvents>

export type CommandItemType = {
  id: string
  type: 'command' | 'group'
  name: string
  description: string
  icon?: SVGElement
  gid?: string // group id
  pid?: string // parent id
  isSelected?: boolean
  action?: (view: EditorView, schema: Schema) => void
  children?: CommandItemType[]
}
