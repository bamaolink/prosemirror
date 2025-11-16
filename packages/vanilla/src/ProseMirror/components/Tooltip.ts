import { prefix } from '../config/constants'

interface BmlTooltipOptions {
  trigger: HTMLButtonElement
  popoverId: string
  anchorName: string
  hover?: boolean
}
export default class BmlTooltip {
  options: BmlTooltipOptions
  popover: HTMLElement
  trigger: HTMLElement
  constructor(options: BmlTooltipOptions) {
    this.options = options
    this.popover = document.createElement('div')
    this.popover.classList.add(`${prefix}tooltip`)
    this.popover.setAttribute('popover', 'hint')
    this.popover.setAttribute('id', options.popoverId)
    this.popover.setAttribute(
      'style',
      `position-anchor: --${options.anchorName}; view-transition-name: --${options.anchorName}; position-area: top;`
    )
    this.trigger = options.trigger
    this.trigger.setAttribute('popovertarget', options.popoverId)
    this.trigger.setAttribute(
      'popovertargetaction',
      options.hover ? 'show' : 'toggle'
    )
    this.trigger.style = `${this.trigger.style.cssText} anchor-name: --${options.anchorName};`

    if (options.hover) {
      this.trigger.addEventListener('mouseenter', this.show.bind(this))
      this.trigger.addEventListener('mouseleave', this.hide.bind(this))
    }
  }
  show() {
    this.popover.showPopover()
  }
  hide() {
    this.popover.hidePopover()
  }
  toggle() {
    this.popover.togglePopover()
  }
  destroy() {
    const anchorName = this.options.anchorName
    this.popover.remove()
    this.trigger.setAttribute('popovertarget', '')
    this.trigger.setAttribute('popovertargetaction', '')
    this.trigger.style = this.trigger.style.cssText.replace(
      `anchor-name: --${anchorName};`,
      ''
    )
    if (this.options.hover) {
      this.trigger.removeEventListener('mouseenter', this.show)
      this.trigger.removeEventListener('mouseleave', this.hide)
    }
  }
}
