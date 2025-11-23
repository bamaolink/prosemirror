import { prefix } from '../config/constants'

type BmlCheckboxProps = {
  label: string
  name: string
}

export type CheckboxOptions = Partial<BmlCheckboxProps>

export class BmlCheckbox {
  element: HTMLElement
  input: HTMLInputElement
  options: CheckboxOptions
  constructor(options: Partial<CheckboxOptions> = {}) {
    this.options = options
    this.element = document.createElement('label')
    this.input = document.createElement('input')
    this.input.type = 'checkbox'
    this.element.appendChild(this.input)
    this.init()
  }

  private init() {
    const { element, input, options } = this
    const icon = document.createElement('div')
    icon.classList.add('checkbox-icon')

    const label = document.createElement('div')
    label.classList.add('checkbox-label')
    label.textContent = this.options?.label || ''

    input.classList.add('input-checkbox')
    input.name = options?.name || ''

    element.appendChild(label)
    element.appendChild(icon)
    element.classList.add(`${prefix}checkbox`)
  }

  destroy() {
    this.element.remove()
  }
}

export default BmlCheckbox
