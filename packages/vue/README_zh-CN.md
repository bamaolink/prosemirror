# @bamaolink/prosemirror-vue

[![npm version](https://img.shields.io/npm/v/@bamaolink/prosemirror-vue.svg)](https://www.npmjs.com/package/@bamaolink/prosemirror-vue)

一个用于 BamaoLink ProseMirror 编辑器的 Vue 3 组件。

## 安装

使用 npm 安装包：

```bash
npm install @bamaolink/prosemirror-vue @bamaolink/prosemirror
```

## 使用方法

以下是如何在您的 Vue 应用中使用 `ProseMirrorEditor` 组件的基本示例。

```vue
<template>
  <div>
    <h1>BamaoLink ProseMirror Vue 编辑器</h1>
    <ProseMirrorEditor
      v-model="content"
      :options="{
        /* 有关选项，请参阅 @bamaolink/prosemirror */
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

const content = ref('<p>你好，Vue！</p>')
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
  // 如果需要，您可以访问编辑器实例
  if (editorRef.value) {
    const editorInstance = editorRef.value.getEditor()
    console.log('编辑器实例：', editorInstance)
  }
})
</script>
```

## Props

| Prop         | 说明                                      | 类型                                            | 默认值 |
| ------------ | ----------------------------------------- | ----------------------------------------------- | ------ |
| `modelValue` | 编辑器的初始 HTML 内容 (支持 `v-model`)。 | `string`                                        | `''`   |
| `options`    | ProseMirror 实例的配置选项。              | `EditorOptions` (来自 `@bamaolink/prosemirror`) | `{}`   |

## 事件

| 事件                | 说明                                    | 参数                                  |
| ------------------- | --------------------------------------- | ------------------------------------- |
| `update:modelValue` | 编辑器内容更改时触发 (用于 `v-model`)。 | `(value: string)`                     |
| `change`            | 编辑器内容更改时触发。                  | `(value: string, doc: ChangeDocType)` |
| `focus`             | 编辑器获得焦点时触发。                  | `(view: EditorView, event: Event)`    |
| `blur`              | 编辑器失去焦点时触发。                  | `(view: EditorView, event: Event)`    |

## 暴露的方法

| 方法          | 说明                               |
| ------------- | ---------------------------------- |
| `getEditor()` | 返回 `BamaoLinkProseMirror` 实例。 |
