import { BmlCheckbox } from '../../components/Checkbox'
import { BmlButton } from '../../components/Button'
import { BmlInput } from '../../components/Input'
import { BmlPopover } from '../../components/Popover'
import { BmlTooltip } from '../../components/Tooltip'
import { SaveIcon, Trash2Icon, ExternalLinkIcon } from '../../icons'
import { htmlStringtoDom } from '../../utils'
import { getMarkNodeInRange } from '../../functions/mark'
import { EditorView } from 'prosemirror-view'

interface LinkViewOptions {
  view: EditorView
  trigger: BmlButton
  prefix: string
  setIsEditing: (isEditing: boolean) => void
  getIsEditing: () => boolean
}

export class LinkView {
  options: LinkViewOptions
  popover: BmlPopover
  items: {
    formElement: HTMLFormElement
    hrefInput: BmlInput
    titleInput: BmlInput
    targetCheckbox: BmlCheckbox
    saveButton: BmlButton
    removeButton: BmlButton
    openButton: BmlButton
  }

  constructor(options: LinkViewOptions) {
    this.options = options

    this.popover = new BmlPopover({
      trigger: options.trigger.element,
      hover: false,
      positionArea: 'bottom',
      onChange: this.onChange.bind(this)
    })

    this.items = this.createLinkFormItems()
    this.popover.popover.appendChild(this.items.formElement)
    this.bindEvents()
  }

  onChange(curr: boolean) {
    this.options?.setIsEditing(curr)
  }

  createLinkFormItems() {
    const template = `<form class="link-input-form">
      <div class="${this.options.prefix}link-input-wrapper">
        <div class="form-container"> 
        </div>
        <div class="link-input-actions">
        </div>
      </div>
    </form>`

    const formElement = htmlStringtoDom(template) as HTMLFormElement
    const formContainer = formElement.querySelector('.form-container')!
    const hrefInput = new BmlInput({
      name: 'href',
      placeholder: 'URL (https://...)',
      autocomplete: 'off'
    })
    const titleInput = new BmlInput({
      name: 'title',
      placeholder: 'Title (Tooltip text)',
      autocomplete: 'off'
    })
    const targetLabel = document.createElement('label')
    const targetCheckbox = new BmlCheckbox({
      name: 'target'
    })
    targetCheckbox.input.value = '_blank'
    targetLabel.style.setProperty('display', 'flex')
    targetLabel.style.setProperty('align-items', 'center')
    targetLabel.style.setProperty('gap', '8px')
    targetLabel.style.setProperty('font-size', '14px')
    targetLabel.appendChild(targetCheckbox.element)
    targetLabel.append('Open in new tab')

    const saveButton = new BmlButton()
    saveButton.setIcon(SaveIcon)
    saveButton.element.style.marginLeft = 'auto'

    const saveTooltip = new BmlTooltip({
      trigger: saveButton.element,
      title: 'Save'
    })

    const removeButton = new BmlButton()
    removeButton.setIcon(Trash2Icon)

    const removeTooltip = new BmlTooltip({
      trigger: removeButton.element,
      title: 'Remove'
    })

    const openButton = new BmlButton()
    openButton.setIcon(ExternalLinkIcon)

    const openTooltip = new BmlTooltip({
      trigger: openButton.element,
      title: 'Open in new tab'
    })

    const actions = formElement.querySelector('.link-input-actions')!

    formContainer.appendChild(hrefInput.element)
    formContainer.appendChild(titleInput.element)
    formContainer.appendChild(targetLabel)

    actions.appendChild(removeTooltip.trigger)
    actions.appendChild(removeTooltip.popover)

    actions.appendChild(openTooltip.trigger)
    actions.appendChild(openTooltip.popover)

    actions.appendChild(saveTooltip.trigger)
    actions.appendChild(saveTooltip.popover)

    return {
      formElement,
      hrefInput,
      titleInput,
      targetCheckbox,
      saveButton,
      removeButton,
      openButton
    }
  }

  bindEvents() {
    const { popover } = this
    const { view, trigger } = this.options
    const {
      formElement,
      hrefInput,
      titleInput,
      targetCheckbox,
      removeButton,
      openButton
    } = this.items

    trigger.element.addEventListener('mousedown', (e) => {
      e.preventDefault()
      e.stopPropagation()

      const linkNode = getMarkNodeInRange(
        view.state,
        view.state.schema.marks.link
      )
      if (linkNode) {
        hrefInput.input.value = linkNode.attrs.href || ''
        titleInput.input.value = linkNode.attrs.title || ''
        targetCheckbox.input.checked = linkNode.attrs.target === '_blank'
      } else {
        hrefInput.input.value = ''
        titleInput.input.value = ''
        targetCheckbox.input.checked = false
      }
    })

    formElement.addEventListener('submit', (e) => {
      e.preventDefault()
      const formData = new FormData(formElement)

      const attrs = Object.fromEntries(formData)

      const state = view.state
      const selection = state.selection
      const from = selection.from
      const to = selection.to

      const linkMark = state.schema.marks.link.create(attrs)

      view.dispatch(state.tr.addMark(from, to, linkMark))
      view.focus()
      popover.hide()
    })

    removeButton.element.addEventListener('click', (e) => {
      e.preventDefault()
      e.stopPropagation()

      const state = view.state
      const selection = state.selection
      const from = selection.from
      const to = selection.to

      view.dispatch(view.state.tr.removeMark(from, to, state.schema.marks.link))
      view.focus()

      popover.hide()
    })

    openButton.element.addEventListener('click', (e) => {
      e.preventDefault()
      e.stopPropagation()

      const linkNode = getMarkNodeInRange(
        view.state,
        view.state.schema.marks.link
      )
      if (linkNode && linkNode.attrs.href) {
        window.open(linkNode.attrs.href, '_blank')
      }
    })

    // 防止点击 Tooltip 时导致编辑器失去焦点或选区混乱
    // popover.popover.addEventListener(
    //   'mousedown',
    //   (e) => {
    //     const target = e.target as HTMLElement
    //     if (!['INPUT', 'LABEL'].includes(target.tagName)) {
    //       e.preventDefault()
    //     }
    //     // setIsEditing(true)
    //   },
    //   true
    // )

    // popover.popover.addEventListener('focusin', () => {
    //   setIsEditing(true)
    // })
    // popover.popover.addEventListener('focusout', () => {
    //   setIsEditing(false)
    // })
  }

  destroy() {
    this.popover.destroy()
  }
}
