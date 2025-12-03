import BamaoLinkProseMirror from '@bamaolink/prosemirror'
import { useEffect, useRef, useImperativeHandle, forwardRef } from 'react'
import type {
  EditorOptions,
  EditorView,
  ChangeDocType
} from '@bamaolink/prosemirror'
import type { ForwardRefRenderFunction } from 'react'

export interface BamaoLinkEditorPropsType {
  value?: string
  onChange?: (value: string, doc: ChangeDocType) => void
  onFocus?: (value: EditorView, event: Event) => void
  onBlur?: (value: EditorView, event: Event) => void
  options?: EditorOptions
}

export interface BamaoLinkEditorImperativeHandleType {
  getEditor: () => BamaoLinkProseMirror | null
}

export const BamaoLinkEditor: ForwardRefRenderFunction<
  BamaoLinkEditorImperativeHandleType,
  BamaoLinkEditorPropsType
> = ({ value, onChange, onBlur, onFocus, options }, forwardedRef) => {
  const editor = useRef<BamaoLinkProseMirror>(null)
  const refEditor = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (refEditor.current && !editor.current) {
      editor.current = new BamaoLinkProseMirror(refEditor.current, options)
      if (value) {
        editor.current.setHtmlString(value)
      }
      editor.current.on('change', (doc: ChangeDocType) => {
        if (value !== doc.value) {
          onChange?.(doc.value, doc)
        }
      })

      editor.current.on('focus', (view: EditorView, event: Event) => {
        onFocus?.(view, event)
      })
      editor.current.on('blur', (view: EditorView, event: Event) => {
        onBlur?.(view, event)
      })
    }
  }, [options, value, onChange])

  useEffect(() => {
    if (editor.current && value !== editor.current.getHTML()) {
      editor.current.setHtmlString(value || '')
    }
  }, [value])

  useImperativeHandle(forwardedRef, () => ({
    getEditor: () => editor.current
  }))

  return <div ref={refEditor}></div>
}

export default forwardRef(BamaoLinkEditor)
