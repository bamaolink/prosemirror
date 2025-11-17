import { Plugin, PluginKey } from 'prosemirror-state'
import type { PluginOptions } from '../../types'
import { EditorView, NodeView } from 'prosemirror-view'
import { Node as ProseMirrorNode } from 'prosemirror-model'

export const pluginKey = new PluginKey('image-upload')

// 一个模拟的上传函数
function mockUploadFile(
  file: File,
  onProgress: (progress: number) => void
): Promise<{ src: string | ArrayBuffer | null }> {
  return new Promise((resolve, reject) => {
    let progress = 0
    const interval = setInterval(() => {
      progress += 10
      onProgress(progress)
      if (progress >= 100) {
        clearInterval(interval)
        const fileReader = new FileReader()
        fileReader.onload = (e) => resolve({ src: e.target?.result ?? '' })
        fileReader.onerror = reject
        fileReader.readAsDataURL(file)
      }
    }, 200)
  })
}

export const imageUploadPlaceholder = (options: PluginOptions) => {
  return new Plugin({
    props: {
      nodeViews: {
        image_upload_placeholder(node, view, getPos) {
          return new ImageUploadNodeView(
            node,
            view,
            getPos as () => number,
            options
          )
        }
      },
      handleDrop(view, event) {
        const files = event.dataTransfer?.files
        if (files && files.length > 0) {
          const file = files[0]
          const { $from } = view.state.selection
          const placeholderNode =
            view.state.schema.nodes.image_upload_placeholder.create({
              file: file
            })

          const tr = view.state.tr.insert($from.pos, placeholderNode)
          view.dispatch(tr)

          return true
        }
        return false
      }
    }
  })
}

export class ImageUploadNodeView implements NodeView {
  dom: HTMLDivElement
  content: HTMLDivElement
  progressBar: HTMLDivElement
  fileInput: HTMLInputElement

  node: ProseMirrorNode
  view: EditorView
  getPos: () => number
  options: PluginOptions

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

    this.dom = document.createElement('div')
    this.dom.classList.add('image-upload-placeholder')

    this.content = document.createElement('div')
    this.content.classList.add('content')

    this.progressBar = document.createElement('div')
    this.progressBar.classList.add('progress-bar')

    this.dom.appendChild(this.content)
    this.dom.appendChild(this.progressBar)

    this.fileInput = document.createElement('input')
    this.fileInput.type = 'file'
    this.fileInput.accept = 'image/*'
    this.fileInput.style.display = 'none'
    this.dom.appendChild(this.fileInput)

    this.dom.addEventListener('click', this.onClick.bind(this))
    this.dom.addEventListener('dragover', this.onDragOver.bind(this))
    this.dom.addEventListener('dragleave', this.onDragLeave.bind(this))
    this.dom.addEventListener('drop', this.onDrop.bind(this))
    this.fileInput.addEventListener('change', this.onFileChange.bind(this))

    this.update(node)
  }

  update(node: ProseMirrorNode): boolean {
    if (node.type !== this.node.type) return false
    this.node = node
    const { status, progress } = node.attrs

    if (status === 'waiting') {
      this.content.textContent = 'Click to upload or drag and drop'
      this.dom.classList.remove('uploading')
    } else if (status === 'uploading') {
      this.content.textContent = `uploading... ${progress}%`
      this.progressBar.style.width = `${progress}%`
      this.dom.classList.add('uploading')
    }
    return true
  }

  onClick(e: MouseEvent) {
    if (this.node.attrs.status === 'waiting') {
      this.fileInput.click()
    }
  }

  onDragOver(e: DragEvent) {
    e.preventDefault()
    if (this.node.attrs.status === 'waiting') {
      this.dom.classList.add('drag-over')
    }
  }

  onDragLeave(e: DragEvent) {
    this.dom.classList.remove('drag-over')
  }

  onDrop(e: DragEvent) {
    e.preventDefault()
    this.dom.classList.remove('drag-over')
    const files = e.dataTransfer?.files
    if (files && files.length > 0 && this.node.attrs.status === 'waiting') {
      this.startUpload(files[0])
    }
  }

  onFileChange(e: Event) {
    const target = e.target as HTMLInputElement
    const files = target.files
    if (files && files.length > 0 && this.node.attrs.status === 'waiting') {
      this.startUpload(files[0])
    }
  }

  startUpload(file: File) {
    const pos = this.getPos()

    const tr1 = this.view.state.tr.setNodeMarkup(pos, null, {
      ...this.node.attrs,
      status: 'uploading'
    })
    this.view.dispatch(tr1)

    mockUploadFile(file, (progress) => {
      const tr2 = this.view.state.tr.setNodeMarkup(pos, null, {
        ...this.node.attrs,
        status: 'uploading',
        progress: progress
      })
      this.view.dispatch(tr2)
    })
      .then((result) => {
        const imageNode = this.view.state.schema.nodes.image_block.create({
          src: result.src,
          alt: file.name,
          width: '100%'
        })
        const tr3 = this.view.state.tr.replaceWith(pos, pos + 1, imageNode)
        this.view.dispatch(tr3)
      })
      .catch((error) => {
        console.error('Upload failed:', error)
        const tr4 = this.view.state.tr.delete(pos, pos + 1)
        this.view.dispatch(tr4)
      })
  }

  destroy() {
    this.dom.removeEventListener('click', this.onClick)
    this.dom.removeEventListener('dragover', this.onDragOver)
    this.dom.removeEventListener('dragleave', this.onDragLeave)
    this.dom.removeEventListener('drop', this.onDrop)
    this.fileInput.removeEventListener('change', this.onFileChange)
  }
}
