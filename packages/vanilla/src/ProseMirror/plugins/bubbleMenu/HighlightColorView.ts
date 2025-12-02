import { BmlButton } from '../../components/Button'
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
  wrapper: HTMLElement

  constructor(options: HighlightColorViewOptions) {
    this.options = options

    this.popover = new BmlPopover({
      trigger: options.trigger.element,
      hover: false,
      positionArea: 'bottom',
      onChange: this.onChange.bind(this)
    })

    this.popover.popover.style.setProperty(
      'border-radius',
      'var(--bml-border-radius-sm)'
    )

    this.wrapper = this.createColorItems()
    this.popover.popover.appendChild(this.wrapper)
    this.bindEvents()
  }

  onChange(curr: boolean) {
    this.options?.setIsEditing(curr)
    if (curr) {
      const node = getMarkNodeInRange(
        this.options.view.state,
        this.options.view.state.schema.marks.highlightColor
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
      ['#f6eddf', '#e5d3bb'], // 填充颜色 边框颜色
      ['#fdf9c5', '#eae79e'],
      ['#ddfbe7', '#c4ebca'],
      ['#e1f2fd', '#c6d9f0'],
      ['#f3e8fe', '#d9caf2'],
      ['#fbf1f5', '#e9dae2'],
      ['#fee4e6', '#e7c6c7']
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
          view.state.schema.marks.highlightColor
        )

        popover.hide()

        if (!node || node?.attrs.color === color[0]) {
          toggleMark(view.state.schema.marks.highlightColor, {
            color: color[0]
          })(view.state, view.dispatch)
        } else {
          const state = view.state
          const selection = state.selection
          const from = selection.from
          const to = selection.to
          const tr = state.tr
          tr.removeMark(from, to, state.schema.marks.highlightColor)
          tr.addMark(
            from,
            to,
            state.schema.marks.highlightColor.create({
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
