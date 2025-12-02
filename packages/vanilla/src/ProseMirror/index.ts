import { emitter } from './events'
import { schema } from './schema'
import { EditorView } from 'prosemirror-view'
import { EditorState } from 'prosemirror-state'
import { createPlugins } from './plugins'
import {
  Schema,
  DOMParser as ProseMirrorDOMParser,
  DOMSerializer as ProseMirrorDOMSerializer,
  Node
} from 'prosemirror-model'
import {
  defaultMarkdownParser,
  defaultMarkdownSerializer,
  MarkdownParser,
  MarkdownSerializer
} from 'prosemirror-markdown'
import { toast } from './components/Toast/Sonner'
import './styles/index.scss'

import type { EmitterEvents, EditorOptions } from './types'

export const markdownParser = new MarkdownParser(
  schema,
  defaultMarkdownParser.tokenizer,
  defaultMarkdownParser.tokens
)

export const markdownSerializer = new MarkdownSerializer(
  defaultMarkdownSerializer.nodes,
  defaultMarkdownSerializer.marks
)

class BamaoLinkProseMirror {
  readonly emitter = emitter
  readonly schema = schema
  readonly plugins

  // 监听
  on(event: keyof EmitterEvents, callback: (...args: any[]) => void) {
    this.emitter.on(event, callback)
  }
  // 取消监听
  off(event: keyof EmitterEvents, callback: (...args: any[]) => void) {
    this.emitter.off(event, callback)
  }

  view: EditorView
  options: EditorOptions

  // 构造函数
  constructor(dom: HTMLElement | string, options: EditorOptions = {}) {
    const { view, plugins } = this.create(dom, options)
    this.view = view
    this.plugins = plugins
    this.options = options
  }

  // 创建
  create(dom: HTMLElement | string, options: EditorOptions) {
    const wrapper: HTMLElement =
      typeof dom === 'string' ? document.querySelector(dom)! : dom

    const { initialValue = '' } = options || {}
    const doc = this.markdownToNode(initialValue)
    const plugins = createPlugins({
      schema,
      emitter,
      wrapper,
      options,
      toast
    })
    const view = new EditorView(wrapper, {
      state: EditorState.create({
        doc,
        plugins
      }),
      editable: (state: EditorState) => options.editable ?? true
    })

    this.emitter.emit('initialization', this.view)
    return { view, plugins, wrapper }
  }

  // 销毁
  destroy() {
    this.view.destroy()
  }

  focus() {
    this.view.focus()
  }

  // dom 转 node
  domToNode(el: HTMLElement | string, _schema: Schema = schema) {
    const dom = typeof el === 'string' ? document.querySelector(el) : el
    return ProseMirrorDOMParser.fromSchema(_schema).parse(dom!)
  }

  // markdown 转 node
  markdownToNode(markdown: string) {
    return markdownParser.parse(markdown)
  }

  // json字符串设置编辑器的内容
  setJsonString(jsonString: string) {
    try {
      const json = JSON.parse(jsonString)
      const view = this.view
      const doc = Node.fromJSON(view.state.schema, json)
      view.dispatch(
        view.state.tr.replaceWith(0, view.state.doc.content.size, doc.content)
      )
    } catch (error) {
      console.error(error)
    }
  }

  // html字符串设置编辑器的内容
  setHtmlString(htmlString: string) {
    const view = this.view
    const parser = ProseMirrorDOMParser.fromSchema(view.state.schema)
    const dom = new DOMParser().parseFromString(htmlString, 'text/html')
    const doc = parser.parse(dom.body)

    const tr = view.state.tr
    tr.replaceWith(0, view.state.doc.content.size, doc.content)
    view.dispatch(tr)
  }

  // markdown字符串设置编辑器的内容
  setMarkdown(markdown: string) {
    const view = this.view
    const doc = this.markdownToNode(markdown)
    const tr = view.state.tr
    tr.replaceWith(0, view.state.doc.content.size, doc.content)
    view.dispatch(tr)
  }

  // 获取编辑器的内容 纯文本
  getText(view?: EditorView) {
    const _view = view || this.view
    return _view.state.doc.textContent
  }

  // 获取编辑器内容 Node
  getNode(view?: EditorView) {
    const _view = view || this.view
    return _view.state.doc
  }

  // 获取编辑器内容 json
  getJSON(view?: EditorView) {
    const _view = view || this.view
    return _view.state.doc.toJSON()
  }

  // 获取编辑器内容 markdown
  getMarkdown(view?: EditorView) {
    const _view = view || this.view
    // 在这里处理自定义的数据
    return markdownSerializer.serialize(_view.state.doc)
  }

  // 获取编辑器内容 html
  getHTML(view?: EditorView, _schema?: Schema) {
    const _view = view || this.view
    const serializer = ProseMirrorDOMSerializer.fromSchema(_schema || schema)
    let outor: HTMLDivElement | null = document.createElement('div')
    serializer.serializeFragment(_view.state.doc.content, { document }, outor)
    const html = outor.innerHTML
    outor.remove()
    outor = null
    return html
  }

  // 设置编辑器是否可编辑
  setEditable(isEditable: boolean) {
    this.view.setProps({
      ...this.view.props,
      editable: () => isEditable
    })
  }
}

export default BamaoLinkProseMirror
