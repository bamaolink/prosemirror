# @bamaolink/prosemirror

[![npm version](https://img.shields.io/npm/v/@bamaolink/prosemirror.svg)](https://www.npmjs.com/package/@bamaolink/prosemirror)

一个基于 ProseMirror 的原生包。

## 安装

使用 npm 安装包：

```bash
npm install @bamaolink/prosemirror
```

## 使用

```ts
import BamaoLinkProseMirror from '@bamaolink/prosemirror'

const editor = new BamaoLinkProseMirror('#app', {
  initialValue: ''
})

editor.on('change', ({ value }) => {
  console.log(value)
})
```

## 仓库

- **主页：** [GitHub 仓库](https://github.com/bamaolink/prosemirror/tree/main/packages/vanilla#readme)
- **Bug：** [报告问题](https://github.com/bamaolink/prosemirror/issues)
