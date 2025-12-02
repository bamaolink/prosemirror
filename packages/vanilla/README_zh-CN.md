# @bamaolink/prosemirror

[![npm version](https://img.shields.io/npm/v/@bamaolink/prosemirror.svg)](https://www.npmjs.com/package/@bamaolink/prosemirror)

一个基于 ProseMirror 的原生包。

## 安装

使用 npm 安装包：

```bash
npm install @bamaolink/prosemirror
```

## 使用 (开发)

要在本地启动项目，请按照以下步骤操作：

1.  **安装依赖：**
    ```bash
    npm install
    ```

2.  **运行开发服务器：**
    ```bash
    npm run dev
    ```

    这将启动一个 Vite 开发服务器，您可以在其中看到编辑器运行。

## 构建

要为生产环境构建项目，请运行以下命令：

```bash
npm run build
```

这将在 `dist` 目录中生成所需的文件。

## 可用脚本

-   `dev`：启动 Vite 开发服务器。
-   `build`：构建项目，包括 TypeScript 编译和类型定义生成。
-   `build:types`：从源文件生成类型定义。
-   `preview`：在本地提供生产构建以进行预览。

## 参数

| 参数         | 说明       | 类型     | 默认值                       |
| ------------ | ---------- | -------- | ---------------------------- |
| initialValue | 值         | string   |                              |
| placeholder  | 占位符     | string   | Write, type '/' for commands |
| imageUpload  | 上传图片   | function |                              |
| editable     | 是否可编辑 | boolean  | true                         |

## 仓库

-   **主页：** [GitHub 仓库](https://github.com/bamaolink/prosemirror/tree/main/packages/vanilla#readme)
-   **Bug：** [报告问题](https://github.com/bamaolink/prosemirror/issues)
