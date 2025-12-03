# @bamaolink/prosemirror-vue

[![npm version](https://img.shields.io/npm/v/@bamaolink/prosemirror-vue.svg)](https://www.npmjs.com/package/@bamaolink/prosemirror-vue)

A Vue 3 component for the BamaoLink ProseMirror editor.

## Installation

Install the package using npm:

```bash
npm install @bamaolink/prosemirror-vue
```

## Usage

Here is a basic example of how to use the `ProseMirrorEditor` component in your Vue application.

```vue
<template>
  <div>
    <h1>BamaoLink ProseMirror Vue Editor</h1>
    <ProseMirrorEditor
      v-model="content"
      :options="{
        /* See @bamaolink/prosemirror for options */
      }"
      @change="handleChange"
      @focus="handleFocus"
      @blur="handleBlur"
      ref="editorRef"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import ProseMirrorEditor from '@bamaolink/prosemirror-vue'
import type { EditorView, ChangeDocType } from '@bamaolink/prosemirror'

const content = ref('<p>Hello, Vue!</p>')
const editorRef = ref(null)

const handleChange = (value: string, doc: ChangeDocType) => {
  console.log('Change:', value, doc)
}

const handleFocus = (view: EditorView, event: Event) => {
  console.log('Focus:', view, event)
}

const handleBlur = (view: EditorView, event: Event) => {
  console.log('Blur:', view, event)
}

onMounted(() => {
  // You can access the editor instance if needed
  if (editorRef.value) {
    const editorInstance = editorRef.value.getEditor()
    console.log('Editor instance:', editorInstance)
  }
})
</script>
```

## Props

| Prop         | Description                                                   | Type                                            | Default |
| ------------ | ------------------------------------------------------------- | ----------------------------------------------- | ------- |
| `modelValue` | The initial HTML content for the editor (supports `v-model`). | `string`                                        | `''`    |
| `options`    | Configuration options for the ProseMirror instance.           | `EditorOptions` (from `@bamaolink/prosemirror`) | `{}`    |

## Events

| Event               | Description                                              | Parameters                            |
| ------------------- | -------------------------------------------------------- | ------------------------------------- |
| `update:modelValue` | Emitted when the editor content changes (for `v-model`). | `(value: string)`                     |
| `change`            | Emitted when the editor content changes.                 | `(value: string, doc: ChangeDocType)` |
| `focus`             | Emitted when the editor gains focus.                     | `(view: EditorView, event: Event)`    |
| `blur`              | Emitted when the editor loses focus.                     | `(view: EditorView, event: Event)`    |

## Expose

| Method        | Description                                  |
| ------------- | -------------------------------------------- |
| `getEditor()` | Returns the `BamaoLinkProseMirror` instance. |
