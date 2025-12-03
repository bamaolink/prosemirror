import BamaoLinkEditor from '@/components/ProseMirror'
import type {
  BamaoLinkEditorPropsType,
  BamaoLinkEditorImperativeHandleType
} from '@/components/ProseMirror'

export type {
  EditorOptions,
  EditorState,
  EditorView,
  Schema,
  Node,
  ChangeDocType
} from '@bamaolink/prosemirror'

import { ThemeProvider } from '@/components/Theme/Provider'
import { useTheme } from '@/components/Theme/useTheme'

export { BamaoLinkEditor, ThemeProvider, useTheme }

export type { BamaoLinkEditorPropsType, BamaoLinkEditorImperativeHandleType }
