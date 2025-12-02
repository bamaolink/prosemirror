import { BmlPopover } from '../Popover'
import type { PopoverOptions } from '../Popover'
import { prefix as _prefix } from '../../config/constants'

const prefix = _prefix + 'tooltip'

export interface TooltipOptions extends PopoverOptions {
  title?: string
}

export class BmlTooltip extends BmlPopover {
  private originalTitle: string | null = null

  constructor(options?: TooltipOptions) {
    const defaultOptions: TooltipOptions = {
      hover: true,
      positionArea: 'top',
      hideDelay: 100,
      ...options
    }
    super(defaultOptions)
    this.popover.classList.add(prefix)

    this.originalTitle = options?.title ?? ''
    this.popover.textContent = this.originalTitle
  }

  destroy(): void {
    this.popover.classList.remove(prefix)
    super.destroy()
  }
}
