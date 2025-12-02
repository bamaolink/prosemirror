# @bamaolink/prosemirror

[![npm version](https://img.shields.io/npm/v/@bamaolink/prosemirror.svg)](https://www.npmjs.com/package/@bamaolink/prosemirror)

A vanilla ProseMirror package.

## Installation

Install the package using npm:

```bash
npm install @bamaolink/prosemirror
```

## Usage (Development)

To get started with the project locally, follow these steps:

1.  **Install dependencies:**
    ```bash
    npm install
    ```

2.  **Run the development server:**
    ```bash
    npm run dev
    ```

    This will start a Vite development server and you can see the editor in action.

## Build

To build the project for production, run the following command:

```bash
npm run build
```

This will generate the necessary files in the `dist` directory.

## Available Scripts

-   `dev`: Starts the Vite development server.
-   `build`: Builds the project, including TypeScript compilation and type definition generation.
-   `build:types`: Generates type definitions from the source files.
-   `preview`: Serves the production build locally for preview.

## Parameters

| 参数         | 说明       | 类型     | 默认值                       |
| ------------ | ---------- | -------- | ---------------------------- |
| initialValue | 值         | string   |                              |
| placeholder  | 占位符     | string   | Write, type '/' for commands |
| imageUpload  | 上传图片   | function |                              |
| editable     | 是否可编辑 | boolean  | true                         |

## Repository

-   **Homepage:** [GitHub Repository](https://github.com/bamaolink/prosemirror/tree/main/packages/vanilla#readme)
-   **Bugs:** [Report an issue](https://github.com/bamaolink/prosemirror/issues)