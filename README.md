# BamaoLink ProseMirror Editor

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
# 或
pnpm add @bamaolink/prosemirror
# 或
yarn add @bamaolink/prosemirror
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
        import BamaoLinkProseMirror from '@bamaolink/prosemirror/vanilla';
        
        const editor = new BamaoLinkProseMirror('#editor', {
            initialValue: '# Hello World\n\n这是一个示例文档。',
            placeholder: '开始写作...'
        });
        
        // 监听编辑器事件
        editor.on('change', ({ newDoc, oldDoc, tr }) => {
            console.log('内容已更改');
        });
        
        editor.on('selected', ({ nodes, marks, view }) => {
            console.log('选中状态变化', { nodes, marks });
        });
    </script>
</body>
</html>
```

#### React

```jsx
import React, { useEffect, useRef } from 'react';
import BamaoLinkProseMirror from '@bamaolink/prosemirror/react';

function Editor() {
    const editorRef = useRef(null);
    const editorInstance = useRef(null);

    useEffect(() => {
        if (editorRef.current) {
            editorInstance.current = new BamaoLinkProseMirror(editorRef.current, {
                initialValue: '# React 编辑器\n\n在 React 中使用 ProseMirror。',
            });

            return () => {
                editorInstance.current?.destroy();
            };
        }
    }, []);

    return <div ref={editorRef} />;
}

export default Editor;
```

#### Vue

```vue
<template>
    <div ref="editor"></div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import BamaoLinkProseMirror from '@bamaolink/prosemirror/vue';

const editor = ref(null);
let editorInstance = null;

onMounted(() => {
    if (editor.value) {
        editorInstance = new BamaoLinkProseMirror(editor.value, {
            initialValue: '# Vue 编辑器\n\n在 Vue 中使用 ProseMirror。',
        });
    }
});

onUnmounted(() => {
    editorInstance?.destroy();
});
</script>
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
interface Options {
    initialValue?: string;      // 初始内容（Markdown 格式）
    placeholder?: string;      // 占位符文本
}
```

### 实例方法

#### 内容操作

```typescript
// 设置 Markdown 内容
editor.setMarkdown('# 标题\n内容');

// 设置 HTML 内容
editor.setHtmlString('<h1>标题</h1><p>内容</p>');

// 设置 JSON 内容
editor.setJsonString('{"type":"doc","content":[...]}');

// 获取内容
const text = editor.getText();        // 纯文本
const markdown = editor.getMarkdown(); // Markdown 格式
const html = editor.getHTML();         // HTML 格式
const json = editor.getJSON();         // JSON 格式
const node = editor.getNode();         // ProseMirror Node
```

#### 编辑器控制

```typescript
// 聚焦编辑器
editor.focus();

// 销毁编辑器
editor.destroy();
```

#### 事件监听

```typescript
// 监听事件
editor.on('change', (data) => {
    console.log('内容变化', data);
});

editor.on('selected', (data) => {
    console.log('选中状态', data);
});

// 取消监听
editor.off('change', callback);
```

### 事件类型

```typescript
interface Events {
    initialization: EditorView;                    // 编辑器初始化完成
    change: { newDoc: Node; oldDoc: Node; tr: Transaction }; // 内容变化
    selected: { 
        nodes: Record<string, boolean>;           // 选中的节点
        marks: Record<string, boolean>;           // 选中的标记
        view: EditorView;                         // 编辑器视图
        prevState: EditorState;                   // 之前的状态
    };
}
```

## 插件系统

编辑器内置了丰富的插件系统：

- **占位符插件** - 显示占位文本
- **变更监听插件** - 监听内容变化
- **选中状态插件** - 跟踪选中状态
- **斜杠命令插件** - 支持斜杠命令菜单
- **气泡菜单插件** - 浮动格式工具栏

### 自定义插件

```typescript
import { Plugin } from 'prosemirror-state';

const myPlugin = new Plugin({
    view(editorView) {
        return {
            update(view, prevState) {
                // 插件逻辑
            },
            destroy() {
                // 清理逻辑
            }
        };
    }
});
```

## 开发

### 项目结构

```
packages/
├── vanilla/          # Vanilla JavaScript 版本
├── react/            # React 版本
└── vue/              # Vue 版本
```

### 本地开发

```bash
# 安装依赖
pnpm install

# 开发模式
cd packages/vanilla
pnpm dev

# 构建
pnpm build
```

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
- 邮箱: support@bamaolink.com