import { NodeSpec } from 'prosemirror-model'

export const TaskListNodeName = 'task_list'

export const TaskListNode: NodeSpec = {
  group: 'block',
  content: 'task_list_item+',
  toDOM() {
    return ['ul', { 'data-type': 'task-list' }, 0]
  },
  parseDOM: [
    {
      tag: 'ul[data-type="task-list"]'
    }
  ]
}

export const TaskListItemNodeName = 'task_list_item'

export const TaskListItemNode: NodeSpec = {
  content: 'paragraph block*',
  defining: true,
  attrs: {
    checked: { default: false }
  },
  toDOM(node) {
    const { checked } = node.attrs

    return [
      'li',
      {
        'data-type': 'task-list-item',
        'data-checked': checked ? 'true' : 'false'
      },
      [
        'label',
        {
          contenteditable: 'false',
          class: 'task-list-item-checkbox-wrapper'
        },
        [
          'input',
          {
            type: 'checkbox',
            class: 'task-list-item-checkbox',
            checked: checked ? '' : undefined
          }
        ],
        ['div', { class: 'checkbox-icon' }]
      ],
      ['div', { class: 'task-list-item-content' }, 0]
    ]
  },
  parseDOM: [
    {
      tag: 'li[data-type="task-list-item"]',
      getAttrs(dom: HTMLElement) {
        return {
          checked: dom.getAttribute('data-checked') === 'true'
        }
      }
    }
  ]
}
