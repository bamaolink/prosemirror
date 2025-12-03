# @bamaolink/prosemirror-react

[![npm version](https://img.shields.io/npm/v/@bamaolink/prosemirror-react.svg)](https://www.npmjs.com/package/@bamaolink/prosemirror-react)

一个用于 BamaoLink ProseMirror 编辑器的 React 组件。

## 安装

使用 npm 安装包：

```bash
npm install @bamaolink/prosemirror-react
```

## 使用方法

以下是如何在您的 React 应用中使用 `BamaoLinkEditor` 组件的基本示例。

```tsx
import React, { useState, useRef } from 'react'
import {
  BamaoLinkEditor,
  BamaoLinkEditorImperativeHandleType
} from '@bamaolink/prosemirror-react'

const App = () => {
  const [value, setValue] = useState('<p>你好，世界！</p>')
  const editorRef = useRef<BamaoLinkEditorImperativeHandleType>(null)

  return (
    <div>
      <h1>BamaoLink ProseMirror React 编辑器</h1>
      <BamaoLinkEditor
        ref={editorRef}
        value={value}
        onChange={(newValue) => setValue(newValue)}
        options={
          {
            // 有关选项，请参阅 @bamaolink/prosemirror
          }
        }
      />
    </div>
  )
}

export default App
```

## Props

| Prop       | 说明                         | 类型                                            | 默认值 |
| ---------- | ---------------------------- | ----------------------------------------------- | ------ |
| `value`    | 编辑器的初始 HTML 内容。     | `string`                                        |        |
| `onChange` | 编辑器内容更改时的回调函数。 | `(value: string, doc: ChangeDocType) => void`   |        |
| `onFocus`  | 编辑器获得焦点时的回调函数。 | `(view: EditorView, event: Event) => void`      |        |
| `onBlur`   | 编辑器失去焦点时的回调函数。 | `(view: EditorView, event: Event) => void`      |        |
| `options`  | ProseMirror 实例的配置选项。 | `EditorOptions` (来自 `@bamaolink/prosemirror`) | `{}`   |

## Refs

您可以使用 ref 访问底层的 ProseMirror 实例。

| 方法          | 说明                               |
| ------------- | ---------------------------------- |
| `getEditor()` | 返回 `BamaoLinkProseMirror` 实例。 |

## 开发

1.  **安装依赖：**

    ```bash
    npm install
    ```

2.  **运行开发服务器：**
    ```bash
    npm run dev
    ```
