# @bamaolink/prosemirror-react

[![npm version](https://img.shields.io/npm/v/@bamaolink/prosemirror-react.svg)](https://www.npmjs.com/package/@bamaolink/prosemirror-react)

A React component for the BamaoLink ProseMirror editor.

## Installation

Install the package using npm:

```bash
npm install @bamaolink/prosemirror-react
```

## Usage

Here is a basic example of how to use the `BamaoLinkEditor` component in your React application.

```tsx
import React, { useState, useRef } from 'react'
import {
  BamaoLinkEditor,
  BamaoLinkEditorImperativeHandleType
} from '@bamaolink/prosemirror-react'

const App = () => {
  const [value, setValue] = useState('<p>Hello, World!</p>')
  const editorRef = useRef<BamaoLinkEditorImperativeHandleType>(null)

  return (
    <div>
      <h1>BamaoLink ProseMirror React Editor</h1>
      <BamaoLinkEditor
        ref={editorRef}
        value={value}
        onChange={(newValue) => setValue(newValue)}
        options={
          {
            // See @bamaolink/prosemirror for options
          }
        }
      />
    </div>
  )
}

export default App
```

## Props

| Prop       | Description                                         | Type                                            | Default |
| ---------- | --------------------------------------------------- | ----------------------------------------------- | ------- |
| `value`    | The initial HTML content for the editor.            | `string`                                        |         |
| `onChange` | Callback function when the editor content changes.  | `(value: string, doc: ChangeDocType) => void`   |         |
| `onFocus`  | Callback function when the editor gains focus.      | `(view: EditorView, event: Event) => void`      |         |
| `onBlur`   | Callback function when the editor loses focus.      | `(view: EditorView, event: Event) => void`      |         |
| `options`  | Configuration options for the ProseMirror instance. | `EditorOptions` (from `@bamaolink/prosemirror`) | `{}`    |

## Refs

You can get access to the underlying ProseMirror instance using a ref.

| Method        | Description                                  |
| ------------- | -------------------------------------------- |
| `getEditor()` | Returns the `BamaoLinkProseMirror` instance. |

## Development

1.  **Install dependencies:**

    ```bash
    npm install
    ```

2.  **Run the development server:**
    ```bash
    npm run dev
    ```
