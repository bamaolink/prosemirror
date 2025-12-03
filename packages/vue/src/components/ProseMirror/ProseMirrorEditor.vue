<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue'
import BamaoLinkProseMirror from '@bamaolink/prosemirror'
import type { EditorOptions, ChangeDocType, EditorView } from '@bamaolink/prosemirror'

interface Props {
  modelValue?: string
  options?: EditorOptions
}

let editor: BamaoLinkProseMirror

const props = withDefaults(defineProps<Props>(), {
  modelValue: ''
})
const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void,
  (e: 'change', value: string, doc: ChangeDocType): void,
  (e: 'focus', view: EditorView, event: Event): void,
  (e: 'blur', view: EditorView, event: Event): void,
}>()
const editorRef = ref(null)

onMounted(() => {
  if (editorRef.value) {
    editor = new BamaoLinkProseMirror(editorRef.value, props.options)
    if (props.modelValue) {
      editor.setHtmlString(props.modelValue)
    }
    editor.on('change', (doc: ChangeDocType) => {
      if (props.modelValue !== doc.value) {
        emit('update:modelValue', doc.value)
        emit('change', doc.value, doc)
      }
    })
    editor.on('focus', (view: EditorView, event: Event) => {
      emit('focus', view, event)
    })
    editor.on('blur', (view: EditorView, event: Event) => {
      emit('blur', view, event)
    })
  }
})

watch(() => props.modelValue, (value) => {
  if (editor && editor.getHTML() !== value) {
    editor.setHtmlString(value)
  }
})

defineExpose({
  getEditor: () => editor,
})
</script>

<template>
  <div ref="editorRef"></div>
</template>
