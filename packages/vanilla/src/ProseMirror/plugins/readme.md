# Plugins

## 插件开发的最佳范式

```ts
export const sideMenuPluginKey = new PluginKey('side-menu-plugin')
export class SideMenuView {}
export const sideMenuPlugin = (options: PluginOptions) => {
  return new Plugin({
    key: pluginKey,
    state: {
      init(): StateType {
        return null
      },
      apply(tr: Transaction, state: StateType) {
        const meta = tr.getMeta(pluginKey)
        return meta || state || null
      }
    },
    view(view) {
      return new SideMenuView(view, options)
    },
    props: {
      handleDOMEvents: {
        mouseover(view, event) {
          const nodeInfo = getNodeInfoFromEvent(view, event)
          if (nodeInfo) {
            view.dispatch(view.state.tr.setMeta(pluginKey, nodeInfo))
          }
        },
        click(view, event) {
          const nodeInfo = getNodeInfoFromEvent(view, event)
          if (nodeInfo) {
            view.dispatch(view.state.tr.setMeta(pluginKey, nodeInfo))
          }
        }
      }
    }
  })
}
```

## 通用组件

大多数是提供 html 结构和样式的组件，事件和逻辑自行处理
