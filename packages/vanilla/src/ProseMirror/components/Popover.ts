import { prefix } from '../config/constants'

export interface BmlPopoverOptions {
  trigger: HTMLButtonElement
  popoverId: string
  anchorName: string
  hover?: boolean
  popover?: 'auto' | 'hint' | 'manual'
  positionArea?:
    | 'top center'
    | 'top span-left'
    | 'top span-right'
    | 'top'
    | 'left center'
    | 'left span-top'
    | 'left span-bottom'
    | 'left'
    | 'bottom center'
    | 'bottom span-left'
    | 'bottom span-right'
    | 'bottom'
    | 'right center'
    | 'right span-top'
    | 'right span-bottom'
    | 'right'
    | 'top left'
    | 'top right'
    | 'bottom left'
    | 'bottom right'
}

export class BmlPopover {
  options: BmlPopoverOptions
  popover: HTMLElement
  trigger: HTMLElement
  constructor(options: BmlPopoverOptions) {
    this.options = options
    this.popover = document.createElement('div')
    this.popover.classList.add(`${prefix}popover`)
    this.popover.setAttribute('popover', options.popover ?? 'hint')
    this.popover.setAttribute('id', options.popoverId)
    this.popover.setAttribute(
      'style',
      `position-anchor: --${options.anchorName}; view-transition-name: --${
        options.anchorName
      }; position-area: ${options?.positionArea ?? 'top'};`
    )
    this.trigger = options.trigger

    // if (options?.popover !== 'manual') {
    this.trigger.setAttribute('popovertarget', options.popoverId)
    this.trigger.setAttribute(
      'popovertargetaction',
      options.hover ? 'show' : 'toggle'
    )
    // }
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

export default BmlPopover
