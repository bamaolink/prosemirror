import BamaoLinkProseMirror from '@bamaolink/prosemirror'
import React, { useEffect, useRef } from 'react'
import type { EditorOptions } from '@bamaolink/prosemirror'

const BamaoLinkEditor: React.FC<{
  value?: string
  onChange?: (value: string) => void
  options?: EditorOptions
}> = ({ value, onChange, options }) => {
  const editor = useRef<BamaoLinkProseMirror>(null)
  const refEditor = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (refEditor.current && !editor.current) {
      editor.current = new BamaoLinkProseMirror(refEditor.current, options)
      if (value) {
        editor.current.setHtmlString(value)
      }
      editor.current.on('change', (doc) => {
        if (value !== doc.value) {
          onChange?.(doc.value)
        }
      })
    }
  }, [options, value, onChange])

  useEffect(() => {
    if (editor.current && value !== editor.current.getHTML()) {
      editor.current.setHtmlString(value || '')
    }
  }, [value])

  return <div ref={refEditor}></div>
}

export default BamaoLinkEditor
