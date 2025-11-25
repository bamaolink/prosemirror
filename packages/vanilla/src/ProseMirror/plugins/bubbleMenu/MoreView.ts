import { BmlButton } from '../../components/Button'
import { BmlPopover } from '../../components/Popover'
import { getMarkNodeInRange } from '../../functions/mark'
import { EditorView } from 'prosemirror-view'
import { moreMenuItems } from '../../config/menuItems'
import { selectedMarksAndNodesPluginKey } from '../../plugins/selectedMarksAndNodes'

interface MoreViewOptions {
  view: EditorView
  trigger: BmlButton
  prefix: string
  setIsEditing: (isEditing: boolean) => void
  getIsEditing: () => boolean
}

export class MoreView {
  options: MoreViewOptions
  popover: BmlPopover
  wrapper: HTMLElement

  constructor(options: MoreViewOptions) {
    this.options = options

    this.popover = new BmlPopover({
      popover: 'hint',
      trigger: options.trigger.element,
      popoverId: `${options.prefix}bubble-menu-more`,
      anchorName: `${options.prefix}bubble-menu-more-anchor`,
      hover: false,
      positionArea: 'bottom',
      onOpenChange: this.onOpenChange.bind(this)
    })

    this.wrapper = this.createButtonItems()
    this.popover.popover.appendChild(this.wrapper)
    this.bindEvents()
  }

  onOpenChange(curr: boolean) {
    this.options?.setIsEditing(curr)
    if (curr) {
      const newState = selectedMarksAndNodesPluginKey.getState(
        this.options.view.state
      )
      const { marks } = newState
      const btns = this.wrapper.querySelectorAll('button')
      btns.forEach((btn) => {
        const id = btn.dataset.id
        if (marks?.[id as keyof typeof marks]) {
          btn.classList.add('active')
        } else {
          btn.classList.remove('active')
        }
      })
    }
  }

  createButtonItems() {
    const { popover } = this
    const { view } = this.options
    const wrapper = document.createElement('div')
    wrapper.className = `${this.options.prefix}more-wrapper`
    moreMenuItems.forEach((item) => {
      const { id, label, icon, action } = item
      const button = new BmlButton()
      button.setIcon(icon)
      button.element.title = label
      button.element.dataset.id = id
      button.element.addEventListener('click', (e) => {
        e.preventDefault()
        view.focus()
        action(view, view.state.schema)
        popover.hide()
      })
      wrapper.appendChild(button.element)
    })
    return wrapper
  }

  bindEvents() {
    const { popover } = this
    const { trigger, setIsEditing } = this.options

    trigger.element.addEventListener('mousedown', (e) => {
      e.preventDefault()
      e.stopPropagation()
    })

    popover.popover.addEventListener(
      'mousedown',
      (e) => {
        const target = e.target as HTMLElement
        if (!['BUTTON'].includes(target.tagName)) {
          e.preventDefault()
        }
        setIsEditing(true)
      },
      true
    )
  }

  destroy() {
    this.popover.destroy()
  }
}
