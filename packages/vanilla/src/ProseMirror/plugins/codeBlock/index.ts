import { Plugin, PluginKey } from 'prosemirror-state'
import { PluginOptions } from '../../types'
import { prefix } from '../../config/constants'
import BmlButton from '../../components/Button'
import BmlSelect from '../../components/Select'
import { CopyIcon } from '../../icons'

import { Node as ProseMirrorNode } from 'prosemirror-model'
import { EditorView as ProseMirrorView, NodeView } from 'prosemirror-view'
import { EditorView as CodeMirrorView } from '@codemirror/view'
import { EditorState as CodeMirrorState, Compartment } from '@codemirror/state'
import { javascript } from '@codemirror/lang-javascript'
import { python } from '@codemirror/lang-python'
import { css } from '@codemirror/lang-css'
import { oneDark } from './codeMirrorTheme'
import { basicSetup } from './basicSetup'

const languages = {
  typescript: () => javascript({ typescript: true }),
  javascript: () => javascript(),
  python: () => python(),
  css: () => css(),
  plaintext: () => []
}
type LanguageId = keyof typeof languages

const getFuzzyLanguage = (language: string) => {
  language = language.toLowerCase()
  if (language.includes('python')) {
    return 'python'
  } else if (language.includes('javascript') || language.includes('js')) {
    return 'javascript'
  } else if (language.includes('typescript') || language.includes('ts')) {
    return 'typescript'
  } else if (language.includes('css')) {
    return 'css'
  } else {
    return 'plaintext'
  }
}

export const codeBlockPluginKey = new PluginKey('code-block-plugin')

export class CodeBlockNodeView implements NodeView {
  dom: HTMLElement
  private cmView: CodeMirrorView
  private languageCompartment = new Compartment()
  private updating = false // Flag to prevent recursive updates

  private node: ProseMirrorNode
  private view: ProseMirrorView
  private getPos: () => number
  private options: PluginOptions

  constructor(
    node: ProseMirrorNode,
    view: ProseMirrorView,
    getPos: () => number | undefined,
    options: PluginOptions
  ) {
    this.node = node
    this.view = view
    this.getPos = getPos as () => number
    this.options = options

    // Create the DOM structure
    this.dom = document.createElement('div')
    this.dom.classList.add(`${prefix}code-block-wrapper`)
    this.dom.classList.add('dark')

    const header = this.createHeader()
    this.dom.appendChild(header)

    const cmContainer = document.createElement('div')
    this.dom.appendChild(cmContainer)

    // Create the CodeMirror instance
    let language = getFuzzyLanguage(this.node.attrs.language)
    const initialLang = language
    const langLoader =
      languages[initialLang as LanguageId] || languages.plaintext

    this.cmView = new CodeMirrorView({
      state: CodeMirrorState.create({
        doc: this.node.textContent,
        extensions: [
          basicSetup,
          oneDark,
          CodeMirrorState.readOnly.of(!view.editable),
          this.languageCompartment.of(langLoader()),
          CodeMirrorView.updateListener.of((update) => {
            if (update.docChanged) {
              this.syncToProseMirror()
            }
          })
        ]
      }),
      parent: cmContainer
    })

    // Focus CodeMirror
    setTimeout(() => {
      this.cmView.focus()
    }, 0)
  }

  private createHeader(): HTMLElement {
    const header = document.createElement('div')
    header.classList.add('code-block-header')

    const langSelect = new BmlSelect({
      options: Object.keys(languages).map((lang) => ({
        value: lang,
        label: lang
      }))
    })
    langSelect.select.value = getFuzzyLanguage(this.node.attrs.language)
    langSelect.select.addEventListener('change', (e) => {
      const newLang = (e.target as HTMLSelectElement).value
      this.setLanguage(newLang)
    })

    const toast = this.options.toast
    const copyButton = new BmlButton()
    copyButton.setIcon(CopyIcon)
    copyButton.element.addEventListener('click', () => {
      navigator.clipboard.writeText(this.cmView.state.doc.toString())
      toast.success('Code copied to clipboard!')
    })

    header.appendChild(langSelect.element)
    header.appendChild(copyButton.element)
    return header
  }

  private syncToProseMirror() {
    if (this.updating) return

    const newText = this.cmView.state.doc.toString()
    const pos = this.getPos()
    if (pos === undefined) return

    const tr = this.view.state.tr.replaceWith(
      pos + 1,
      pos + 1 + this.node.textContent.length,
      newText ? this.view.state.schema.text(newText) : []
    )
    this.view.dispatch(tr)
  }

  private setLanguage(langId: string) {
    const pos = this.getPos()
    if (pos === undefined) return

    // Update ProseMirror state first (source of truth)
    const tr = this.view.state.tr.setNodeMarkup(pos, undefined, {
      ...this.node.attrs,
      language: langId
    })
    this.view.dispatch(tr)
  }

  update(node: ProseMirrorNode): boolean {
    if (node.type !== this.node.type) return false

    this.updating = true // Set flag to prevent sync loop

    // Sync language attribute
    const newLang = getFuzzyLanguage(node.attrs.language) as LanguageId
    if (newLang !== getFuzzyLanguage(this.node.attrs.language)) {
      const langLoader = languages[newLang] || languages.plaintext
      this.cmView.dispatch({
        effects: this.languageCompartment.reconfigure(langLoader())
      })
      // Update the select dropdown value
      this.dom.querySelector('select')!.value = newLang
    }

    // Sync content
    const newContent = node.textContent
    if (newContent !== this.cmView.state.doc.toString()) {
      this.cmView.dispatch({
        changes: {
          from: 0,
          to: this.cmView.state.doc.length,
          insert: newContent
        }
      })
    }

    this.node = node
    this.updating = false
    return true
  }

  // Prevent ProseMirror from handling events inside CodeMirror
  stopEvent() {
    return true
  }

  // Let CodeMirror handle its own DOM mutations
  ignoreMutation() {
    return true
  }

  destroy() {
    this.cmView.destroy()
  }
}
export function codeBlockPlugin(options: PluginOptions): Plugin {
  return new Plugin({
    key: codeBlockPluginKey,
    props: {
      nodeViews: {
        code_block: (node, view, getPos) => {
          return new CodeBlockNodeView(node, view, getPos, options)
        }
      }
    }
  })
}
