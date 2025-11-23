import { prefix } from '../config/constants'

type BmlButtonProps = {
  children: HTMLElement | string | SVGElement
}

export type ButtonOptions = Partial<BmlButtonProps>

export class BmlButton {
  element: HTMLButtonElement
  options: ButtonOptions
  constructor(options: Partial<ButtonOptions> = {}) {
    this.options = options
    this.element = document.createElement('button')
    this.init()
  }

  private init() {
    const { element } = this
    element.classList.add(`${prefix}button`)
  }

  setIcon(icon: SVGElement, iconBtn = true) {
    this.element.appendChild(icon.cloneNode(true))
    if (iconBtn) {
      this.element.classList.add(`${prefix}button-icon`)
    }
  }

  destroy() {
    this.element.remove()
  }
}

export default BmlButton
