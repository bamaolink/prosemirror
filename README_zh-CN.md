# BamaoLink ProseMirror 编辑器

一个基于 ProseMirror 的现代化富文本编辑器，支持多种框架集成。

## 特性

- 🚀 **高性能** - 基于 ProseMirror 构建，提供流畅的编辑体验
- 📝 **富文本编辑** - 支持粗体、斜体、链接等常见格式
- 🔧 **插件系统** - 可扩展的插件架构
- 🎯 **多框架支持** - 提供 Vanilla、React、Vue 版本
- 📱 **响应式设计** - 适配不同屏幕尺寸
- 🎨 **自定义样式** - 支持主题定制

## 快速开始

### 安装

```bash
npm install @bamaolink/prosemirror
# npm install @bamaolink/prosemirror-react
# npm install @bamaolink/prosemirror-vue
# or
pnpm add @bamaolink/prosemirror
# pnpm add @bamaolink/prosemirror-react
# pnpm add @bamaolink/prosemirror-vue
# or
yarn add @bamaolink/prosemirror
# yarn add @bamaolink/prosemirror-react
# yarn add @bamaolink/prosemirror-vue
```

### 基础用法

#### Vanilla JavaScript

```html
<!DOCTYPE html>
<html>
  <head>
    <title>ProseMirror Editor</title>
  </head>
  <body>
    <div id="editor"></div>

    <script type="module">
      import BamaoLinkProseMirror from '@bamaolink/prosemirror'

      const editor = new BamaoLinkProseMirror('#editor', {
        initialValue: '# Hello World\n\nThis is an example document.',
        placeholder: 'Start writing...'
      })

      // Listen for editor events
      editor.on('change', ({ value, newDoc, oldDoc, tr }) => {
        console.log('Content has changed')
      })
    </script>
  </body>
</html>
```

#### React

```tsx
import {
  BamaoLinkEditor,
  ThemeProvider,
  useTheme
} from '@bamaolink/prosemirror-react'
import type { BamaoLinkEditorImperativeHandleType } from '@bamaolink/prosemirror-react'

import { useEffect, useState, useRef } from 'react'
import { Button } from '@/components/ui/button'

function App() {
  const editor = useRef<BamaoLinkEditorImperativeHandleType>(null)
  const [value, setValue] = useState('')

  useEffect(() => {
    console.log('value', value)
  }, [value])

  return (
    <ThemeProvider>
      <div className="flex gap-2 items-center justify-end p-2 mb-8 border-b gray-200">
        <Button
          onClick={() => {
            const val = editor.current?.getEditor()?.getHTML()
            console.log(val)
          }}
        >
          获取Value
        </Button>
      </div>
      <div
        className="prose dark:prose-invert"
        style={{ maxWidth: 980, margin: '0 auto' }}
      >
        <BamaoLinkEditor
          options={{ initialValue: value }}
          value={value}
          onChange={setValue}
          ref={editor}
        />
      </div>
    </ThemeProvider>
  )
}

export default App
```

#### Vue

```vue
<script setup lang="ts">
import { ref, watch } from 'vue'
import { Button } from '@/components/ui/button'
import { BamaoLinkEditor } from '@bamaolink/prosemirror-vue'

const value = ref('')
const editor = ref()
const onChange = (val: string) => {
  console.log('change event', val)
}
const onFocus = () => {
  console.log('focus')
}
const onBlur = () => {
  console.log('blur')
}
const getValue = () => {
  const val = editor.value?.getEditor()?.getHTML()
  console.log('click', val)
}
watch(
  () => value.value,
  () => {
    console.log('value changed', value.value)
  }
)
</script>

<template>
  <div
    className="flex gap-2 items-center justify-end p-2 mb-8 border-b gray-200"
  >
    <Button @click="getValue"> 获取Value </Button>
  </div>
  <div
    className="prose dark:prose-invert"
    :style="{ maxWidth: '980px', margin: '0 auto' }"
  >
    <BamaoLinkEditor
      v-model="value"
      @change="onChange"
      @focus="onFocus"
      @blur="onBlur"
      ref="editor"
    />
  </div>
</template>
```

## API 参考

### 构造函数

```typescript
new BamaoLinkProseMirror(dom: HTMLElement | string, options?: Options)
```

**参数:**

- `dom` - DOM 元素或选择器字符串
- `options` - 配置选项（可选）

**Options 配置:**

```typescript
interface EditorOptions {
  prefix?: string
  initialValue?: string
  placeholder?: string
  editable?: boolean
  imageUploadFunc?: (
    file: File,
    onProgress: (progress: number) => void
  ) => Promise<{ src: string | ArrayBuffer | null }>
}
```

### 实例方法

#### 内容操作

```typescript
// 设置 Markdown 内容
editor.setMarkdown('# 标题\n内容')

// 设置 HTML 内容
editor.setHtmlString('<h1>标题</h1><p>内容</p>')

// 设置 JSON 内容
editor.setJsonString('{"type":"doc","content":[...]}')

// 获取内容
const text = editor.getText() // 纯文本
const markdown = editor.getMarkdown() // Markdown 格式
const html = editor.getHTML() // HTML 格式
const json = editor.getJSON() // JSON 格式
const node = editor.getNode() // ProseMirror Node
```

#### 事件监听

```typescript
// Listen for events
editor.on(
  'change',
  (data: { value: string; newDoc: Node; oldDoc: Node; tr: Transaction }) => {
    console.log('Content changed', data)
  }
)

editor.on('focus', (view: EditorView, event: Event) => {
  console.log('Content changed', view)
})

editor.on('blur', (view: EditorView, event: Event) => {
  console.log('Content changed', view)
})

// Unsubscribe
editor.off('change', callback)
```

## 插件系统

编辑器内置了丰富的插件系统：

- **占位符插件** - 显示占位文本
- **变更监听插件** - 监听内容变化
- **选中状态插件** - 跟踪选中状态
- **斜杠命令插件** - 支持斜杠命令菜单
- **气泡菜单插件** - 浮动格式工具栏

## 开发

### 项目结构

本项目是一个 monorepo，包含以下几个包：

- [`@bamaolink/prosemirror`](packages/vanilla/README_zh-CN.md) - 原生 JavaScript 实现的核心包。
- [`@bamaolink/prosemirror-react`](packages/react/README_zh-CN.md) - 编辑器的 React 组件封装。
- [`@bamaolink/prosemirror-vue`](packages/vue/README_zh-CN.md) - 编辑器的 Vue 组件封装。
- [`demo`](packages/demo/README_zh-CN.md) - 一个简单的演示应用。

## 浏览器支持

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## 许可证

MIT License

## 贡献

欢迎提交 Issue 和 Pull Request！

## 更新日志

### v0.0.1 (2024-11-04)

- 初始版本发布
- 支持基础富文本编辑
- 提供 Vanilla、React、Vue 版本
- 内置常用插件系统

## 技术支持

- 文档: [GitHub Wiki](https://github.com/bamaolink/prose-mirror/wiki)
- 问题: [GitHub Issues](https://github.com/bamaolink/prose-mirror/issues)
- 邮箱: 63401208@qq.com
