import { nanoid } from 'nanoid'
import './style.scss'
import { prefix as _prefix } from '../../config/constants'

const prefix = _prefix + 'popover'

export interface PopoverOptions {
  trigger?: HTMLElement | string
  popover?: HTMLElement | string
  popoverType?: 'auto' | 'manual'
  hover?: boolean
  hideDelay?: number
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
  positionTryFallbacks?: string
  onChange?: (opened: boolean) => void
}

export class BmlPopover {
  readonly popoverId = nanoid(5)
  readonly options: PopoverOptions
  opened = false

  readonly popover: HTMLElement
  readonly trigger: HTMLElement

  private hideTimeout: number | undefined
  private createdPopover: boolean
  private createdTrigger: boolean

  private events: {
    mouseenter: (event: Event) => void
    mouseleave: (event: Event) => void
    beforetoggle: (event: Event) => void
  }

  constructor(options?: PopoverOptions) {
    this.options = {
      trigger: 'button',
      popover: 'div',
      hover: false,
      popoverType: 'auto',
      positionArea: 'top',
      hideDelay: 200,
      positionTryFallbacks: 'flip-block flip-inline',
      ...options
    }

    if (typeof this.options.trigger === 'string') {
      this.trigger = document.createElement(this.options.trigger)
      this.createdTrigger = true
    } else {
      this.trigger = this.options.trigger!
      this.createdTrigger = false
    }

    if (typeof this.options.popover === 'string') {
      this.popover = document.createElement(this.options.popover)
      this.createdPopover = true
    } else {
      this.popover = this.options.popover!
      this.createdPopover = false
    }

    this.events = {
      mouseenter: this.handleMouseEnter.bind(this),
      mouseleave: this.handleMouseLeave.bind(this),
      beforetoggle: this.handleBeforeToggle.bind(this)
    }

    this.init()
  }

  private init() {
    const id = `${this.popoverId}-popover`
    const anchorName = `--${this.popoverId}-anchor`

    this.popover.setAttribute('id', id)
    this.popover.setAttribute('popover', this.options.popoverType!)
    this.popover.style.setProperty('position-anchor', anchorName)
    this.popover.style.setProperty('position-area', this.options.positionArea!)
    this.popover.style.setProperty(
      'position-try-fallbacks',
      this.options.positionTryFallbacks!
    )
    this.popover.classList.add(`${prefix}`)
    this.popover.addEventListener('beforetoggle', this.events.beforetoggle)

    this.trigger.setAttribute('popovertarget', id)
    this.trigger.setAttribute(
      'popovertargetaction',
      this.options.hover ? 'show' : 'toggle'
    )
    this.trigger.style.setProperty('anchor-name', anchorName)
    this.trigger.classList.add(`${prefix}-trigger`)

    if (this.options.hover) {
      this.trigger.addEventListener('mouseenter', this.events.mouseenter)
      this.trigger.addEventListener('mouseleave', this.events.mouseleave)
      this.popover.addEventListener('mouseenter', this.events.mouseenter)
      this.popover.addEventListener('mouseleave', this.events.mouseleave)
    }
  }

  private handleMouseEnter() {
    clearTimeout(this.hideTimeout)
    this.show()
  }

  private handleMouseLeave() {
    this.hideTimeout = window.setTimeout(() => {
      this.hide()
    }, this.options.hideDelay)
  }

  private handleBeforeToggle() {
    const willOpen = !this.popover.matches(':popover-open')
    this.popover.dataset.popover = willOpen ? 'open' : 'close'
    this.opened = willOpen
    this.options.onChange?.(this.opened)
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
    this.popover.removeEventListener('beforetoggle', this.events.beforetoggle)
    if (this.options.hover) {
      this.trigger.removeEventListener('mouseenter', this.events.mouseenter)
      this.trigger.removeEventListener('mouseleave', this.events.mouseleave)
      this.popover.removeEventListener('mouseenter', this.events.mouseenter)
      this.popover.removeEventListener('mouseleave', this.events.mouseleave)
    }

    if (this.createdPopover) {
      this.popover.remove()
    }
    if (this.createdTrigger) {
      this.trigger.remove()
    }
  }
}
