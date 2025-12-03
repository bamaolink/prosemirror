# @bamaolink/prosemirror

[![npm version](https://img.shields.io/npm/v/@bamaolink/prosemirror.svg)](https://www.npmjs.com/package/@bamaolink/prosemirror)

A vanilla ProseMirror package.

## Installation

Install the package using npm:

```bash
npm install @bamaolink/prosemirror
```

## Usage

```ts
import BamaoLinkProseMirror from '@bamaolink/prosemirror'

const editor = new BamaoLinkProseMirror('#app', {
  initialValue: ''
})

editor.on('change', ({ value }) => {
  console.log(value)
})
```

## Repository

- **Homepage:** [GitHub Repository](https://github.com/bamaolink/prosemirror/tree/main/packages/vanilla#readme)
- **Bugs:** [Report an issue](https://github.com/bamaolink/prosemirror/issues)
