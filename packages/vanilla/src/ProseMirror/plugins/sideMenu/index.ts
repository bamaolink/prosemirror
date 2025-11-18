import {
  PluginKey,
  Plugin,
  Transaction,
  NodeSelection
} from 'prosemirror-state'
import { EditorView } from 'prosemirror-view'
import { getNodeInfoFromEvent, insertText } from '../../functions'
import Button from '../../components/Button'
import { GripVerticalIcon, PlusIcon } from '../../icons'
import type { DragHandleStateType, Emitter, PluginOptions } from '../../types'
import { prefix } from '../../config/constants'

export const pluginKey = new PluginKey('side-menu')

type StateType = DragHandleStateType | null

class SideMenuView {
  emitter: Emitter
  view: EditorView
  dom: HTMLElement
  dragButton: Button
  addButton: Button

  dragging = false
  currentNode: StateType = null

  constructor(editorView: EditorView, options: PluginOptions) {
    const { emitter } = options

    this.view = editorView
    this.emitter = emitter
    this.dom = document.createElement('div')
    this.dom.classList.add(`${prefix}side-menu`)
    this.dom.style.visibility = 'hidden'

    this.view.dom.parentNode?.appendChild(this.dom)
    this.view.dom.parentNode?.addEventListener('mouseleave', this.hideSideMenu)

    this.dragButton = this.createDragButton()
    this.addButton = this.createAddButton()
  }

  update(view: EditorView) {
    if (!view.editable) {
      this.dom.style.visibility = 'hidden'
      return
    }
    const state = pluginKey.getState(view.state)
    if (state && state.domRect) {
      const wrapper = this.view.dom.parentNode as HTMLElement
      const wrapperRect = wrapper.getBoundingClientRect()
      this.dom.style.top = state.domRect.top - wrapperRect.top + 'px'
      this.dom.style.visibility = 'visible'
    }
    this.emitter.emit('side-menu-update', {
      state,
      view
    })
  }

  createDragButton() {
    const dragButton = new Button()
    dragButton.setIcon(GripVerticalIcon)
    dragButton.element.draggable = true
    dragButton.element.style.cursor = 'grab'

    dragButton.element.addEventListener('mousedown', () => {
      this.currentNode = pluginKey.getState(this.view.state)
      if (!this.currentNode) {
        return
      }
      const tr = this.view.state.tr.setSelection(
        NodeSelection.create(this.view.state.doc, this.currentNode.nodePos)
      )
      this.view.dispatch(tr)
    })

    dragButton.element.addEventListener('dragstart', (event: DragEvent) => {
      if (!this.currentNode) {
        return
      }

      const selection = this.view.state.selection
      if (selection instanceof NodeSelection) {
        const slice = selection.content()
        this.view.dragging = { slice, move: true }

        // 设置拖拽效果
        // event.dataTransfer.effectAllowed = 'move'
        // event.dataTransfer.setData('text/plain', 'internal-drag') // Dummy data

        if (this.currentNode.dom) {
          event?.dataTransfer?.setDragImage(this.currentNode.dom, 0, 0)
        }
        this.dragging = true
      }
    })

    dragButton.element.addEventListener('dragend', () => {
      this.dragging = false
    })

    this.dom.appendChild(dragButton.element)

    return dragButton
  }

  createAddButton() {
    const addButton = new Button()
    addButton.setIcon(PlusIcon)

    addButton.element.addEventListener('click', () => {
      const currentNode = pluginKey.getState(this.view.state)
      if (!currentNode || !currentNode.nodePos) {
        return
      }
      insertText(this.view, '/', currentNode.nodePos)
      this.view.focus()

      this.hideSideMenu()
    })

    this.dom.appendChild(addButton.element)

    return addButton
  }

  hideSideMenu = () => {
    this.dom.style.visibility = 'hidden'
  }
  destroy() {
    this.dom.remove()
    this.view.dom.parentNode?.removeEventListener(
      'mouseleave',
      this.hideSideMenu
    )
  }
}

export const sideMenu = (options: PluginOptions) => {
  return new Plugin({
    key: pluginKey,
    state: {
      init(): StateType {
        return null
      },
      apply(tr: Transaction, value: StateType) {
        const meta = tr.getMeta(pluginKey)
        return meta || value || null
      }
    },
    view(editorView) {
      const sideMenuView = new SideMenuView(editorView, options)
      return sideMenuView
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
