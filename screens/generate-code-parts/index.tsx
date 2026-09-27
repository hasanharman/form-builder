import { FormLibrary, FORM_LIBRARIES } from '@/constants'
import {
  formDefaultValuesSource,
  formSchemaSource,
  type FormFieldOrGroup,
} from '@/components/field-variants/form'

import { generateServerActionsCode } from './server-actions'
import { generateReactHookFormCode } from './react-hook-form'
import { generateTanStackFormCode } from './tanstack-form'
import { generateBringYourOwnCode } from './bring-your-own'

export const getZodSchemaString = (formFields: FormFieldOrGroup[]): string =>
  formSchemaSource(formFields)

export const generateDefaultValuesString = (fields: FormFieldOrGroup[]): string =>
  `defaultValues: ${formDefaultValuesSource(fields)},`

export const generateFormCodeForLibrary = (
  formFields: FormFieldOrGroup[],
  library: FormLibrary,
): string => {
  switch (library) {
    case FORM_LIBRARIES.SERVER_ACTIONS:
      return generateServerActionsCode(formFields)
    case FORM_LIBRARIES.TANSTACK_FORM:
      return generateTanStackFormCode(formFields)
    case FORM_LIBRARIES.BRING_YOUR_OWN:
      return generateBringYourOwnCode(formFields)
    case FORM_LIBRARIES.REACT_HOOK_FORM:
    default:
      return generateReactHookFormCode(formFields)
  }
}
