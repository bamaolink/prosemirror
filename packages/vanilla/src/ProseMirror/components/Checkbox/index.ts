import { prefix } from '../../config/constants'
import './style.scss'

type BmlCheckboxProps = {
  name: string
}

export type CheckboxOptions = Partial<BmlCheckboxProps>

export class BmlCheckbox {
  element: HTMLElement
  input: HTMLInputElement
  options: CheckboxOptions
  constructor(options: Partial<CheckboxOptions> = {}) {
    this.options = options
    this.element = document.createElement('div')
    this.input = document.createElement('input')
    this.input.type = 'checkbox'
    this.element.appendChild(this.input)
    this.init()
  }

  private init() {
    const { element, input, options } = this
    const icon = document.createElement('div')
    icon.classList.add('checkbox-icon')

    input.classList.add('input-checkbox')
    input.name = options?.name || ''

    element.appendChild(icon)
    element.classList.add(`${prefix}checkbox`)
  }

  destroy() {
    this.element.remove()
  }
}

export default BmlCheckbox
