import { BmlCheckbox } from '../../components/Checkbox'
import { BmlButton } from '../../components/Button'
import { BmlInput } from '../../components/Input'
import { SaveIcon, Trash2Icon, ExternalLinkIcon } from '../../icons'
import { htmlStringtoDom } from '../../utils'

export const createLinkFormItems = (prefix: string) => {
  const template = `<form class="link-input-form">
    <div class="${prefix}link-input-wrapper dark">
      <div class="link-input-actions">
      </div>
    </div>
  </form>`

  const formElement = htmlStringtoDom(template) as HTMLFormElement
  const hrefInput = new BmlInput({
    name: 'href',
    placeholder: 'URL (https://...)',
    autocomplete: 'off'
  })
  const textInput = new BmlInput({
    name: 'title',
    placeholder: 'Title (Tooltip text)',
    autocomplete: 'off'
  })
  const targetCheckbox = new BmlCheckbox({
    name: 'target',
    label: 'Open in new window'
  })

  const saveButton = new BmlButton()
  saveButton.setIcon(SaveIcon)

  const removeButton = new BmlButton()
  removeButton.setIcon(Trash2Icon)

  const openButton = new BmlButton()
  openButton.setIcon(ExternalLinkIcon)

  const actions = formElement.querySelector('.link-input-actions')!

  actions.before(hrefInput.element)
  actions.before(textInput.element)
  actions.before(targetCheckbox.element)
  actions.appendChild(saveButton.element)
  actions.appendChild(removeButton.element)
  actions.appendChild(openButton.element)

  return {
    formElement,
    hrefInput,
    textInput,
    targetCheckbox,
    saveButton,
    removeButton,
    openButton
  }
}
