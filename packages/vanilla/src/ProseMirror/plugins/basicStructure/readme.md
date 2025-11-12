# basicStructure

编辑器基本的结构处理。

- 给默认 `div` 添加 `class="bamao-link-prosemirror-wrapper"`
- 给默认 `view.dom` 添加 `class="bamao-link-prosemirror"`

## 修改前缀 `bamao-link-`

```js
new BamaoLinkProseMirror('#app', {
  prefix: 'bamao-link-a-',
  initialValue: ''
})
```

修改文件 `./styles/index.scss`

```scss
@import 'prosemirror-view/style/prosemirror.css';

$prefix: 'bamao-link-a-';
```
