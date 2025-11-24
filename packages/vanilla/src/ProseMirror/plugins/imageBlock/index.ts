import { Plugin, PluginKey, NodeSelection } from 'prosemirror-state'
import { EditorView, NodeView } from 'prosemirror-view'
import { Node as ProseMirrorNode } from 'prosemirror-model'
import type { PluginOptions } from '../../types'
import { prefix } from '../../config/constants'
import { Trash2Icon } from '../../icons'
import { compressHTML } from '../../utils'

export const imageBlockPluginKey = new PluginKey('image-block-plugin')

export class ImageBlockNodeView implements NodeView {
  dom: HTMLElement
  private imageContainer: HTMLElement
  private img: HTMLImageElement
  private altDisplay: HTMLElement
  private resizeHandle: HTMLElement
  private delBtn: HTMLElement

  private node: ProseMirrorNode
  private view: EditorView
  private getPos: () => number
  private options: PluginOptions

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
    this.options = options

    this.dom = this.createDomElement()
    this.imageContainer = this.dom.querySelector('.image-container')!
    this.img = this.dom.querySelector('.image-content')!
    this.altDisplay = this.dom.querySelector('.image-caption')!
    this.resizeHandle = this.dom.querySelector('.image-resize-handle')!
    this.delBtn = this.dom.querySelector('.img-del-btn')!

    this.delBtn.appendChild(Trash2Icon.cloneNode(true))
    this.delBtn.addEventListener('click', this.deleteNode.bind(this))

    this.altDisplay.addEventListener('blur', this.saveAlt.bind(this))

    this.resizeHandle.addEventListener(
      'mousedown',
      this.onResizeStart.bind(this)
    )

    this.dom.addEventListener('click', (e) => {
      e.preventDefault()
      const pos = this.getPos()
      const selection = NodeSelection.create(this.view.state.doc, pos)
      const tr = this.view.state.tr.setSelection(selection)
      this.view.dispatch(tr)

      this.isEditingAlt = true
      this.altDisplay.contentEditable = 'true'
      this.altDisplay.classList.add('is-editing')
    })

    if (!this.view.editable) {
      this.resizeHandle.remove()
      this.delBtn.remove()
      this.altDisplay.contentEditable = 'false'
      this.dom.classList.add('disabled')
    }

    this.updateView(node)
  }

  private createDomElement() {
    const template = `<div class="${prefix}image-block" data-prose-node-view="true">
      <div class="image-wrapper">
        <div class="image-container">
          <img class="image-content" draggable="false">
        </div>
        <div class="image-operations" contentEditable="false">
          <button title="delete" class="img-del-btn"></button>
        </div>
        <div class="image-footer"> 
          <div class="image-resize-handle"></div>
          <div class="image-caption">view component section</div>
        </div>
      </div>
    </div>`
    const parser = new DOMParser()
    const doc = parser.parseFromString(compressHTML(template), 'text/html')
    const dom = doc.body.firstChild as HTMLElement
    return dom
  }

  private updateView(node: ProseMirrorNode) {
    const { src, alt, height } = node.attrs
    if (this.img.src !== src) {
      this.img.src = src
    }
    if (this.altDisplay.textContent !== alt) {
      this.altDisplay.textContent = alt
    }
    if (height) {
      this.imageContainer.style.height = `${height}px`
    } else {
      this.imageContainer.style.height = ''
    }
  }

  private saveAlt() {
    if (this.isEditingAlt) {
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
  }

  private deleteNode(e: Event) {
    e.preventDefault()
    e.stopPropagation()
    const pos = this.getPos()
    const tr = this.view.state.tr.delete(pos, pos + this.node.nodeSize)
    this.view.dispatch(tr)
  }

  private onResizeStart(e: MouseEvent) {
    e.preventDefault()
    const startY = e.clientY
    const startHeight = this.imageContainer.offsetHeight

    const onMouseMove = (moveEvent: MouseEvent) => {
      const currentY = moveEvent.clientY
      const diffY = currentY - startY
      const newHeight = startHeight + diffY

      // 实时更新样式以提供即时反馈
      this.imageContainer.style.height = `${newHeight < 64 ? 64 : newHeight}px`
    }

    const onMouseUp = (upEvent: MouseEvent) => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)

      const finalHeight = this.imageContainer.offsetHeight
      const tr = this.view.state.tr.setNodeMarkup(this.getPos(), undefined, {
        ...this.node.attrs,
        height: finalHeight
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
    this.dom.remove()
  }

  stopEvent() {
    return true
  }
}

export function imageBlockPlugin(options: PluginOptions): Plugin {
  return new Plugin({
    key: imageBlockPluginKey,
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
