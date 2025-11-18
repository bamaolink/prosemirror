import { prefix } from '../config/constants'

type ToastType = 'default' | 'success' | 'error' | 'info'
type Position =
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right'

interface ToastOptions {
  duration?: number
  type?: ToastType
  position?: Position
  description?: string
}

interface ToastMessageWithOptions extends ToastOptions {
  title: string
}

type ToastFunction = (
  message: string | ToastMessageWithOptions,
  options?: ToastOptions
) => void

export interface Toast extends ToastFunction {
  success: (message: string, options?: ToastOptions) => void
  error: (message: string, options?: ToastOptions) => void
  info: (message: string, options?: ToastOptions) => void
  message: (title: string, options?: ToastOptions) => void
}

const ICONS: Record<ToastType, string> = {
  success: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>`,
  error: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>`,
  info: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`,
  default: ''
}

const toastContainers = new Map<Position, HTMLDivElement>()

function getToastContainer(position: Position): HTMLDivElement {
  if (!toastContainers.has(position)) {
    const container = document.createElement('div')
    container.className = `${prefix}toast-container ${position}`
    document.body.appendChild(container)
    toastContainers.set(position, container)
  }
  return toastContainers.get(position)!
}

class BmlSonnerToast {
  private readonly options: Required<ToastOptions>
  private readonly message: string
  private readonly element: HTMLDivElement
  private dismissTimeout: number | null = null

  constructor(message: string, options: ToastOptions) {
    this.options = {
      duration: 4000,
      type: 'default',
      position: 'top-center',
      description: '',
      ...options
    }
    this.message = message
    this.element = this.createToastElement()
    this.show()
  }

  private createToastElement(): HTMLDivElement {
    const toastElement = document.createElement('div')
    toastElement.className = `toast-item ${this.options.type}`

    const iconHtml = ICONS[this.options.type]
      ? `<div class="toast-icon">${ICONS[this.options.type]}</div>`
      : ''
    const descriptionHtml = this.options.description
      ? `<div class="toast-description">${this.options.description}</div>`
      : ''

    toastElement.innerHTML = `
            ${iconHtml}
            <div class="toast-content">
                <div class="toast-title">${this.message}</div>
                ${descriptionHtml}
            </div>
            <button class="toast-close-btn">&times;</button>
        `

    toastElement
      .querySelector<HTMLButtonElement>('.toast-close-btn')!
      .addEventListener('click', () => this.hide())

    return toastElement
  }

  private show(): void {
    const container = getToastContainer(this.options.position)
    container.appendChild(this.element)

    setTimeout(() => {
      this.element.classList.add('visible')
    }, 50)

    this.dismissTimeout = setTimeout(() => this.hide(), this.options.duration)
  }

  private hide(): void {
    if (this.dismissTimeout) {
      clearTimeout(this.dismissTimeout)
    }
    this.element.classList.remove('visible')
    this.element.classList.add('exit')

    this.element.addEventListener(
      'transitionend',
      () => {
        this.destroy()
      },
      { once: true }
    )
  }

  private destroy(): void {
    if (this.element.parentNode) {
      this.element.parentNode.removeChild(this.element)
    }
    const container = toastContainers.get(this.options.position)
    if (container && container.childElementCount === 0) {
      container.remove()
      toastContainers.delete(this.options.position)
    }
  }
}

const toast: Toast = (
  message: string | ToastMessageWithOptions,
  options: ToastOptions = {}
) => {
  if (typeof message === 'object' && message !== null) {
    options = { ...message, ...options }
    message = message.title
  }
  new BmlSonnerToast(message, options)
}

toast.success = (message, options) =>
  toast(message, { ...options, type: 'success' })
toast.error = (message, options) =>
  toast(message, { ...options, type: 'error' })
toast.info = (message, options) => toast(message, { ...options, type: 'info' })
toast.message = (title, options) => toast(title, { ...options })

export { toast }

// toast('Event has been created.')
// toast.success('Event has been created successfully!')
// toast.error('Failed to create event.')
// toast.info('Event will be created in a moment.')

// toast('Top Left', { position: 'top-left' })
// toast('Top Right', { position: 'top-right' })
// toast('Bottom Left', { position: 'bottom-left' })
// toast('Bottom Center', { position: 'bottom-center' })
// toast('Bottom Right', { position: 'bottom-right' })

// toast('Event has been created.', { duration: 10000 })
// toast.message('A custom message', {
//   description: 'This is a longer description for the toast message.'
// })
