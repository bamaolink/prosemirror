import { BmlCheckbox } from '../../components/Checkbox'
import { BmlButton } from '../../components/Button'
import { BmlInput } from '../../components/Input'
import { BmlPopover } from '../../components/Popover'
import { toggleMark } from 'prosemirror-commands'
import { getMarkNodeInRange } from '../../functions/mark'
import { EditorView } from 'prosemirror-view'

interface HighlightColorViewOptions {
  view: EditorView
  trigger: BmlButton
  prefix: string
  setIsEditing: (isEditing: boolean) => void
  getIsEditing: () => boolean
}

export class HighlightColorView {
  options: HighlightColorViewOptions
  popover: BmlPopover

  constructor(options: HighlightColorViewOptions) {
    this.options = options

    this.popover = new BmlPopover({
      popover: 'manual',
      trigger: options.trigger.element,
      popoverId: `${options.prefix}bubble-menu-highlight-color`,
      anchorName: `${options.prefix}bubble-menu-highlight-color-anchor`,
      hover: false,
      positionArea: 'bottom'
    })

    const wrapper = this.createColorItems()
    this.popover.popover.appendChild(wrapper)
    this.bindEvents()
  }

  createColorItems() {
    const colors = [
      '#fdf9c5',
      '#ddfbe7',
      '#e1f2fd',
      '#f3e8fe',
      '#fbf1f5',
      '#fee4e6'
    ]
    const { view } = this.options
    const wrapper = document.createElement('div')
    wrapper.className = `${this.options.prefix}color-wrapper`
    colors.forEach((color) => {
      const btn = document.createElement('button')
      const span = document.createElement('span')
      span.style.backgroundColor = color

      btn.addEventListener('click', (e) => {
        e.preventDefault()
        e.stopPropagation()
        toggleMark(view.state.schema.marks.highlightColor, { color })(
          view.state,
          view.dispatch
        )
      })
      btn.appendChild(span)
      wrapper.appendChild(btn)
    })
    return wrapper
  }

  bindEvents() {
    // const { popover } = this
    // const { view, trigger, setIsEditing } = this.options
    // trigger.element.addEventListener('mousedown', (e) => {
    //   e.preventDefault()
    //   e.stopPropagation()
    //   const linkNode = getMarkNodeInRange(
    //     view.state,
    //     view.state.schema.marks.link
    //   )
    //   console.log(linkNode)
    // })
    // popover.popover.addEventListener(
    //   'mousedown',
    //   (e) => {
    //     const target = e.target as HTMLElement
    //     if (!['BUTTON'].includes(target.tagName)) {
    //       e.preventDefault()
    //     }
    //     setIsEditing(true)
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
