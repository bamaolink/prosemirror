import type { Schema, EditorView } from '../types'
export function insertImagePlaceholderCommand(
  view: EditorView,
  schema: Schema
) {
  const placeholderNode = schema.nodes.image_upload_placeholder.create()
  const tr = view.state.tr.replaceSelectionWith(placeholderNode)

  view.dispatch(tr)
  return true
}
