import { BmlButton } from '../../components/Button'
import { BmlPopover } from '../../components/Popover'
import { toggleMark } from 'prosemirror-commands'
import { getMarkNodeInRange } from '../../functions/mark'
import { EditorView } from 'prosemirror-view'

interface TextColorViewOptions {
  view: EditorView
  trigger: BmlButton
  prefix: string
  setIsEditing: (isEditing: boolean) => void
  getIsEditing: () => boolean
}

export class TextColorView {
  options: TextColorViewOptions
  popover: BmlPopover
  wrapper: HTMLElement

  constructor(options: TextColorViewOptions) {
    this.options = options

    this.popover = new BmlPopover({
      popover: 'hint',
      trigger: options.trigger.element,
      popoverId: `${options.prefix}bubble-menu-text-color`,
      anchorName: `${options.prefix}bubble-menu-text-color-anchor`,
      hover: false,
      positionArea: 'bottom',
      onOpenChange: this.onOpenChange.bind(this)
    })

    this.wrapper = this.createColorItems()
    this.popover.popover.appendChild(this.wrapper)
    this.bindEvents()
  }

  onOpenChange(curr: boolean) {
    this.options?.setIsEditing(curr)
    if (curr) {
      const node = getMarkNodeInRange(
        this.options.view.state,
        this.options.view.state.schema.marks.textColor
      )
      const btns = this.wrapper.querySelectorAll('button')
      btns.forEach((btn) => {
        btn.classList.remove('active')
        if (node) {
          if (btn.dataset.color === node.attrs.color) {
            btn.classList.add('active')
          }
        }
      })
    }
  }

  createColorItems() {
    const colors = [
      ['#c77f28', '#e5d3bb'], // 文本颜色 边框颜色
      ['#bf9840', '#eae79e'],
      ['#5f8769', '#c4ebca'],
      ['#5981ab', '#c6d9f0'],
      ['#8e6db1', '#d9caf2'],
      ['#b35c90', '#e9dae2'],
      ['#c05c50', '#e7c6c7']
    ]
    const { popover } = this
    const { view } = this.options
    const wrapper = document.createElement('div')
    wrapper.className = `${this.options.prefix}color-wrapper`
    colors.forEach((color) => {
      const btn = document.createElement('button')
      const span = document.createElement('span')
      span.style.backgroundColor = color[0]

      btn.style.borderColor = color[1]
      btn.dataset.color = color[0]

      btn.addEventListener('click', (e) => {
        e.preventDefault()
        e.stopPropagation()

        const node = getMarkNodeInRange(
          view.state,
          view.state.schema.marks.textColor
        )

        popover.hide()

        if (!node || node?.attrs.color === color[0]) {
          toggleMark(view.state.schema.marks.textColor, {
            color: color[0]
          })(view.state, view.dispatch)
        } else {
          const state = view.state
          const selection = state.selection
          const from = selection.from
          const to = selection.to
          const tr = state.tr
          tr.removeMark(from, to, state.schema.marks.textColor)
          tr.addMark(
            from,
            to,
            state.schema.marks.textColor.create({
              color: color[0]
            })
          )
          view.dispatch(tr)
        }

        view.focus()
      })
      btn.appendChild(span)
      wrapper.appendChild(btn)
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
