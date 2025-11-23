import { prefix } from '../config/constants'

type BmlInputProps = {
  type: 'text' | 'number' | 'password'
  placeholder: string
  autocomplete: 'on' | 'off'
  name: string
}

export type InputOptions = Partial<BmlInputProps>

export class BmlInput {
  element: HTMLElement
  input: HTMLInputElement
  options: InputOptions
  constructor(options: Partial<InputOptions> = {}) {
    this.options = options
    this.element = document.createElement('div')
    this.input = document.createElement('input')
    this.element.appendChild(this.input)
    this.init()
  }

  private init() {
    const { element, input, options } = this

    element.classList.add(`${prefix}input-text`)

    input.type = options?.type || 'text'
    input.placeholder = options?.placeholder || ''
    input.autocomplete = options?.autocomplete || 'off'
    input.name = options?.name || ''
  }

  destroy() {
    this.element.remove()
  }
}

export default BmlInput
