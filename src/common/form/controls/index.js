import { FormInput } from './input.view'
import { FormRadio } from './radio.view'
import { FormCheckbox } from './checkbox.view'
import { FormTextarea } from './textarea.view'
import { FormAttachmentControl } from './attachment.view'
import { FormDropdown } from './dropdown.view'
import { FormMoneyInput } from './money.view'
import { FormControlWrapper } from './wrapper.view'
import { FormDateInput } from './date.view'

export const FormControls = {
  Wrapper: FormControlWrapper,
  Input: FormInput,
  Radio: FormRadio,
  Checkbox: FormCheckbox,
  Textarea: FormTextarea,
  Attachment: FormAttachmentControl,
  Dropdown: FormDropdown,
  Money: FormMoneyInput,
  DateInput: FormDateInput,
}

export * from './models'
export { CONTROL_ID_DATA_ATTR } from './wrapper.view'
