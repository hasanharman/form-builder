import { checkboxVariant } from './checkbox'
import { comboboxVariant } from './combobox'
import { creditCardVariant } from './credit-card'
import { datePickerVariant } from './date-picker'
import { datetimePickerVariant } from './datetime-picker'
import { fileInputVariant } from './file-input'
import { inputVariant } from './input'
import { inputOtpVariant } from './input-otp'
import { locationInputVariant } from './location-input'
import { multiSelectVariant } from './multi-select'
import { passwordVariant } from './password'
import { phoneVariant } from './phone'
import { radioGroupVariant } from './radio-group'
import { ratingVariant } from './rating'
import { selectVariant } from './select'
import { signatureInputVariant } from './signature-input'
import { signaturePadVariant } from './signature-pad'
import { sliderVariant } from './slider'
import { smartDatetimeInputVariant } from './smart-datetime-input'
import { switchVariant } from './switch'
import { tagsInputVariant } from './tags-input'
import { textareaVariant } from './textarea'
import type { FieldVariant } from './types'

export type { Binding, ControlProps, FieldSetting, FieldVariant } from './types'

/** Every field the playground offers, in picker order. */
export const fieldVariants: FieldVariant[] = [
  checkboxVariant,
  comboboxVariant,
  datePickerVariant,
  datetimePickerVariant,
  fileInputVariant,
  inputVariant,
  inputOtpVariant,
  locationInputVariant,
  multiSelectVariant,
  passwordVariant,
  phoneVariant,
  selectVariant,
  signatureInputVariant,
  signaturePadVariant,
  sliderVariant,
  smartDatetimeInputVariant,
  switchVariant,
  tagsInputVariant,
  textareaVariant,
  ratingVariant,
  radioGroupVariant,
  creditCardVariant,
]

const byName = new Map(fieldVariants.map((variant) => [variant.name, variant]))

export function getFieldVariant(name: string): FieldVariant {
  const variant = byName.get(name)
  if (!variant) throw new Error(`Unknown field variant: ${name}`)
  return variant
}
