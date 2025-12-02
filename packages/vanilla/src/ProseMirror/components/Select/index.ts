import { prefix } from '../../config/constants'
import { ChevronDownIcon } from '../../icons'
import './select.scss'

export type BmlSelectProps = {
  children: HTMLElement | string | SVGElement
  options?: Array<
    | {
        value: string
        label: string
      }
    | string
  >
}

export type SelectOptions = Partial<BmlSelectProps>

export class BmlSelect {
  element: HTMLLabelElement
  select: HTMLSelectElement
  options: SelectOptions
  constructor(options: Partial<SelectOptions> = {}) {
    this.options = options
    this.element = document.createElement('label')
    this.element.classList.add(`${prefix}select-wrapper`)

    this.select = document.createElement('select')
    this.element.appendChild(this.select)
    this.element.appendChild(ChevronDownIcon.cloneNode(true))
    this.init()
  }

  private init() {
    const options = this.options?.options || []
    for (const option in options) {
      const item = document.createElement('option')
      if (typeof options[option] === 'string') {
        item.value = options[option]
        item.textContent = options[option]
      } else {
        item.value = options[option].value
        item.textContent = options[option].label
      }
      this.select.appendChild(item)
    }
  }

  destroy() {
    this.element.remove()
  }
}

export default BmlSelect
