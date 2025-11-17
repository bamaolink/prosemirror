import { Plugin, PluginKey } from 'prosemirror-state'
import { EditorView, NodeView } from 'prosemirror-view'
import { Node as ProseMirrorNode } from 'prosemirror-model'
import type { PluginOptions } from '../../types'

export const pluginKey = new PluginKey('image-block')

export class ImageBlockNodeView implements NodeView {
  dom: HTMLElement
  private imageContainer: HTMLElement
  private img: HTMLImageElement
  private altDisplay: HTMLElement
  private resizeHandle: HTMLElement

  private node: ProseMirrorNode
  private view: EditorView
  private getPos: () => number

  private isEditingAlt = false

  constructor(
    node: ProseMirrorNode,
    view: EditorView,
    getPos: () => number,
    options: PluginOptions
  ) {
    this.node = node
    this.view = view
    this.getPos = getPos

    // 创建 DOM 结构
    this.dom = document.createElement('div')
    this.dom.classList.add('image-block-wrapper')

    this.imageContainer = document.createElement('div')
    this.imageContainer.classList.add('image-container')

    this.img = document.createElement('img')
    this.img.classList.add('image-content')

    const operations = this.createOperations()

    this.altDisplay = document.createElement('div')
    this.altDisplay.classList.add('image-caption')

    this.resizeHandle = document.createElement('div')
    this.resizeHandle.classList.add('image-resize-handle')

    this.imageContainer.appendChild(this.img)
    this.imageContainer.appendChild(operations)
    this.imageContainer.appendChild(this.resizeHandle)
    this.dom.appendChild(this.imageContainer)
    this.dom.appendChild(this.altDisplay)

    this.resizeHandle.addEventListener(
      'mousedown',
      this.onResizeStart.bind(this)
    )

    this.updateView(node)
  }

  private createOperations(): HTMLElement {
    const container = document.createElement('div')
    container.classList.add('image-operations')
    container.contentEditable = 'false'

    const editButton = document.createElement('button')
    editButton.textContent = '编辑'
    editButton.addEventListener('click', this.toggleAltEdit.bind(this))

    const deleteButton = document.createElement('button')
    deleteButton.textContent = '删除'
    deleteButton.addEventListener('click', this.deleteNode.bind(this))

    container.appendChild(editButton)
    container.appendChild(deleteButton)
    return container
  }

  private updateView(node: ProseMirrorNode) {
    const { src, alt, width } = node.attrs

    if (this.img.src !== src) {
      this.img.src = src
    }

    if (this.altDisplay.textContent !== alt) {
      this.altDisplay.textContent = alt
    }

    if (width) {
      this.imageContainer.style.width = `${width}px`
    } else {
      this.imageContainer.style.width = ''
    }
  }

  private toggleAltEdit() {
    this.isEditingAlt = !this.isEditingAlt
    if (this.isEditingAlt) {
      this.altDisplay.contentEditable = 'true'
      this.altDisplay.classList.add('is-editing')
      this.altDisplay.focus()
      this.altDisplay.addEventListener('blur', this.saveAlt.bind(this), {
        once: true
      })
    } else {
      this.saveAlt()
    }
  }

  private saveAlt() {
    this.isEditingAlt = false
    this.altDisplay.contentEditable = 'false'
    this.altDisplay.classList.remove('is-editing')

    const newAlt = this.altDisplay.textContent || ''
    if (newAlt !== this.node.attrs.alt) {
      const tr = this.view.state.tr.setNodeMarkup(this.getPos(), undefined, {
        ...this.node.attrs,
        alt: newAlt
      })
      this.view.dispatch(tr)
    }
  }

  private deleteNode() {
    const pos = this.getPos()
    const tr = this.view.state.tr.delete(pos, pos + this.node.nodeSize)
    this.view.dispatch(tr)
  }

  private onResizeStart(e: MouseEvent) {
    e.preventDefault()
    const startX = e.clientX
    const startWidth = this.imageContainer.offsetWidth

    const onMouseMove = (moveEvent: MouseEvent) => {
      const currentX = moveEvent.clientX
      const diffX = currentX - startX
      const newWidth = startWidth + diffX

      // 实时更新样式以提供即时反馈
      this.imageContainer.style.width = `${newWidth}px`
    }

    const onMouseUp = (upEvent: MouseEvent) => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)

      const finalWidth = this.imageContainer.offsetWidth
      const tr = this.view.state.tr.setNodeMarkup(this.getPos(), undefined, {
        ...this.node.attrs,
        width: finalWidth
      })
      this.view.dispatch(tr)
    }

    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
  }

  update(node: ProseMirrorNode): boolean {
    if (node.type !== this.node.type) return false
    this.node = node
    this.updateView(node)
    return true
  }

  destroy() {
    this.resizeHandle.removeEventListener('mousedown', this.onResizeStart)
  }

  stopEvent() {
    return true
  }
}

export function imageBlock(options: PluginOptions): Plugin {
  return new Plugin({
    props: {
      nodeViews: {
        image_block(node, view, getPos) {
          return new ImageBlockNodeView(
            node,
            view,
            getPos as () => number,
            options
          )
        }
      }
    }
  })
}
