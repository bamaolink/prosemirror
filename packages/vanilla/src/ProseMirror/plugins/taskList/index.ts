import { Plugin, PluginKey } from 'prosemirror-state'
import { PluginOptions, EditorView } from '../../types'
import { isEventMatchNode } from '../../functions'

export const taskListPluginKey = new PluginKey('task-list-plugin')

export function taskListPlugin(options: PluginOptions): Plugin {
  return new Plugin({
    key: taskListPluginKey,
    props: {
      handleDOMEvents: {
        mousedown(view: EditorView, event: MouseEvent): boolean {
          const target = event.target as HTMLElement

          if (
            (target &&
              target.classList.contains('task-list-item-checkbox-wrapper')) ||
            target.closest('.task-list-item-checkbox-wrapper')
          ) {
            event.preventDefault()

            const node = isEventMatchNode(view, event, 'task_list_item')
            if (!node) return false

            const _node = node as Exclude<
              ReturnType<typeof isEventMatchNode>,
              boolean
            >
            const nodePos = _node.resolvedPos.before(_node.index)
            const { tr } = view.state
            const newAttrs = {
              ..._node.node.attrs,
              checked: !_node.node.attrs.checked
            }
            tr.setNodeMarkup(nodePos, undefined, newAttrs)
            view.dispatch(tr)

            return true
          }
          return false
        }
      }
    }
  })
}
