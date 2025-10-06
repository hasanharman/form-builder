import { FormFieldType } from '@/types'
import { FormLibrary, FORM_LIBRARIES } from '@/constants'

export const generateCodeSnippetWithField = (field: FormFieldType, library: FormLibrary): string => {
  switch (field.variant) {
    case 'Input':
      return generateInputWithField(field, library)
    case 'Textarea':
      return generateTextareaWithField(field, library)
    case 'Checkbox':
      return generateCheckboxWithField(field, library)
    case 'Select':
      return generateSelectWithField(field, library)
    case 'Switch':
      return generateSwitchWithField(field, library)
    case 'Slider':
      return generateSliderWithField(field, library)
    case 'Radio':
      return generateRadioWithField(field, library)
    default:
      return generateDefaultFieldWithField(field, library)
  }
}

const generateInputWithField = (field: FormFieldType, library: FormLibrary): string => {
  if (library === FORM_LIBRARIES.REACT_HOOK_FORM) {
    return `<Field>
  <FieldLabel htmlFor="${field.name}">${field.label}</FieldLabel>
  <Input 
    id="${field.name}" 
    placeholder="${field.placeholder || ''}"
    ${field.disabled ? 'disabled' : ''}
    {...form.register("${field.name}")}
  />
  ${field.description ? `<FieldDescription>${field.description}</FieldDescription>` : ''}
  <FieldError>{form.formState.errors.${field.name}?.message}</FieldError>
</Field>`
  }
  
  return `<Field>
  <FieldLabel htmlFor="${field.name}">${field.label}</FieldLabel>
  <Input 
    id="${field.name}" 
    name="${field.name}" 
    placeholder="${field.placeholder || ''}"
    ${field.disabled ? 'disabled' : ''}
    ${library === FORM_LIBRARIES.TANSTACK_FORM ? `value={form.getFieldValue("${field.name}")}
    onChange={(e) => form.setFieldValue("${field.name}", e.target.value)}` : ''}
  />
  ${field.description ? `<FieldDescription>${field.description}</FieldDescription>` : ''}
  <FieldError />
</Field>`
}

const generateTextareaWithField = (field: FormFieldType, library: FormLibrary): string => {
  if (library === FORM_LIBRARIES.REACT_HOOK_FORM) {
    return `<Field>
  <FieldLabel htmlFor="${field.name}">${field.label}</FieldLabel>
  <Textarea 
    id="${field.name}" 
    placeholder="${field.placeholder || ''}"
    ${field.disabled ? 'disabled' : ''}
    {...form.register("${field.name}")}
  />
  ${field.description ? `<FieldDescription>${field.description}</FieldDescription>` : ''}
  <FieldError>{form.formState.errors.${field.name}?.message}</FieldError>
</Field>`
  }

  return `<Field>
  <FieldLabel htmlFor="${field.name}">${field.label}</FieldLabel>
  <Textarea 
    id="${field.name}" 
    name="${field.name}" 
    placeholder="${field.placeholder || ''}"
    ${field.disabled ? 'disabled' : ''}
    ${library === FORM_LIBRARIES.TANSTACK_FORM ? `value={form.getFieldValue("${field.name}")}
    onChange={(e) => form.setFieldValue("${field.name}", e.target.value)}` : ''}
  />
  ${field.description ? `<FieldDescription>${field.description}</FieldDescription>` : ''}
  <FieldError />
</Field>`
}

const generateCheckboxWithField = (field: FormFieldType, library: FormLibrary): string => {
  if (library === FORM_LIBRARIES.REACT_HOOK_FORM) {
    return `<Field className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
  <Checkbox 
    id="${field.name}"
    ${field.disabled ? 'disabled' : ''}
    {...form.register("${field.name}")}
  />
  <div className="space-y-1 leading-none">
    <FieldLabel htmlFor="${field.name}">${field.label}</FieldLabel>
    ${field.description ? `<FieldDescription>${field.description}</FieldDescription>` : ''}
    <FieldError>{form.formState.errors.${field.name}?.message}</FieldError>
  </div>
</Field>`
  }

  return `<Field className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
  <Checkbox 
    id="${field.name}" 
    name="${field.name}"
    ${field.disabled ? 'disabled' : ''}
    ${library === FORM_LIBRARIES.TANSTACK_FORM ? `checked={form.getFieldValue("${field.name}")}
    onCheckedChange={(checked) => form.setFieldValue("${field.name}", checked)}` : ''}
  />
  <div className="space-y-1 leading-none">
    <FieldLabel htmlFor="${field.name}">${field.label}</FieldLabel>
    ${field.description ? `<FieldDescription>${field.description}</FieldDescription>` : ''}
    <FieldError />
  </div>
</Field>`
}

const generateSelectWithField = (field: FormFieldType, library: FormLibrary): string => {
  if (library === FORM_LIBRARIES.REACT_HOOK_FORM) {
    return `<Field>
  <FieldLabel htmlFor="${field.name}">${field.label}</FieldLabel>
  <Select 
    ${field.disabled ? 'disabled' : ''}
    {...form.register("${field.name}")}
  >
    <SelectTrigger id="${field.name}">
      <SelectValue placeholder="${field.placeholder || 'Select an option'}" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="option1">Option 1</SelectItem>
      <SelectItem value="option2">Option 2</SelectItem>
      <SelectItem value="option3">Option 3</SelectItem>
    </SelectContent>
  </Select>
  ${field.description ? `<FieldDescription>${field.description}</FieldDescription>` : ''}
  <FieldError>{form.formState.errors.${field.name}?.message}</FieldError>
</Field>`
  }

  return `<Field>
  <FieldLabel htmlFor="${field.name}">${field.label}</FieldLabel>
  <Select 
    name="${field.name}"
    ${field.disabled ? 'disabled' : ''}
    ${library === FORM_LIBRARIES.TANSTACK_FORM ? `value={form.getFieldValue("${field.name}")}
    onValueChange={(value) => form.setFieldValue("${field.name}", value)}` : ''}
  >
    <SelectTrigger id="${field.name}">
      <SelectValue placeholder="${field.placeholder || 'Select an option'}" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="option1">Option 1</SelectItem>
      <SelectItem value="option2">Option 2</SelectItem>
      <SelectItem value="option3">Option 3</SelectItem>
    </SelectContent>
  </Select>
  ${field.description ? `<FieldDescription>${field.description}</FieldDescription>` : ''}
  <FieldError />
</Field>`
}

const generateSwitchWithField = (field: FormFieldType, library: FormLibrary): string => {
  if (library === FORM_LIBRARIES.REACT_HOOK_FORM) {
    return `<Field className="flex flex-row items-center justify-between rounded-lg border p-4">
  <div className="space-y-0.5">
    <FieldLabel htmlFor="${field.name}" className="text-base">${field.label}</FieldLabel>
    ${field.description ? `<FieldDescription>${field.description}</FieldDescription>` : ''}
  </div>
  <Switch 
    id="${field.name}"
    ${field.disabled ? 'disabled' : ''}
    {...form.register("${field.name}")}
  />
  <FieldError>{form.formState.errors.${field.name}?.message}</FieldError>
</Field>`
  }

  return `<Field className="flex flex-row items-center justify-between rounded-lg border p-4">
  <div className="space-y-0.5">
    <FieldLabel htmlFor="${field.name}" className="text-base">${field.label}</FieldLabel>
    ${field.description ? `<FieldDescription>${field.description}</FieldDescription>` : ''}
  </div>
  <Switch 
    id="${field.name}" 
    name="${field.name}"
    ${field.disabled ? 'disabled' : ''}
    ${library === FORM_LIBRARIES.TANSTACK_FORM ? `checked={form.getFieldValue("${field.name}")}
    onCheckedChange={(checked) => form.setFieldValue("${field.name}", checked)}` : ''}
  />
  <FieldError />
</Field>`
}

const generateSliderWithField = (field: FormFieldType, library: FormLibrary): string => {
  if (library === FORM_LIBRARIES.REACT_HOOK_FORM) {
    return `<Field>
  <FieldLabel htmlFor="${field.name}">${field.label}</FieldLabel>
  <Slider 
    id="${field.name}"
    min={${field.min || 0}}
    max={${field.max || 100}}
    step={${field.step || 1}}
    ${field.disabled ? 'disabled' : ''}
    {...form.register("${field.name}")}
  />
  ${field.description ? `<FieldDescription>${field.description}</FieldDescription>` : ''}
  <FieldError>{form.formState.errors.${field.name}?.message}</FieldError>
</Field>`
  }

  return `<Field>
  <FieldLabel htmlFor="${field.name}">${field.label}</FieldLabel>
  <Slider 
    id="${field.name}"
    name="${field.name}"
    min={${field.min || 0}}
    max={${field.max || 100}}
    step={${field.step || 1}}
    ${field.disabled ? 'disabled' : ''}
    ${library === FORM_LIBRARIES.TANSTACK_FORM ? `value={[form.getFieldValue("${field.name}")]}
    onValueChange={(vals) => form.setFieldValue("${field.name}", vals[0])}` : ''}
  />
  ${field.description ? `<FieldDescription>${field.description}</FieldDescription>` : ''}
  <FieldError />
</Field>`
}

const generateRadioWithField = (field: FormFieldType, library: FormLibrary): string => {
  if (library === FORM_LIBRARIES.REACT_HOOK_FORM) {
    return `<Field className="space-y-3">
  <FieldLabel>${field.label}</FieldLabel>
  <RadioGroup 
    ${field.disabled ? 'disabled' : ''}
    {...form.register("${field.name}")}
  >
    <div className="flex items-center space-x-2">
      <RadioGroupItem value="option1" id="${field.name}_option1" />
      <Label htmlFor="${field.name}_option1">Option 1</Label>
    </div>
    <div className="flex items-center space-x-2">
      <RadioGroupItem value="option2" id="${field.name}_option2" />
      <Label htmlFor="${field.name}_option2">Option 2</Label>
    </div>
    <div className="flex items-center space-x-2">
      <RadioGroupItem value="option3" id="${field.name}_option3" />
      <Label htmlFor="${field.name}_option3">Option 3</Label>
    </div>
  </RadioGroup>
  ${field.description ? `<FieldDescription>${field.description}</FieldDescription>` : ''}
  <FieldError>{form.formState.errors.${field.name}?.message}</FieldError>
</Field>`
  }

  return `<Field className="space-y-3">
  <FieldLabel>${field.label}</FieldLabel>
  <RadioGroup 
    name="${field.name}"
    ${field.disabled ? 'disabled' : ''}
    ${library === FORM_LIBRARIES.TANSTACK_FORM ? `value={form.getFieldValue("${field.name}")}
    onValueChange={(value) => form.setFieldValue("${field.name}", value)}` : ''}
  >
    <div className="flex items-center space-x-2">
      <RadioGroupItem value="option1" id="${field.name}_option1" />
      <Label htmlFor="${field.name}_option1">Option 1</Label>
    </div>
    <div className="flex items-center space-x-2">
      <RadioGroupItem value="option2" id="${field.name}_option2" />
      <Label htmlFor="${field.name}_option2">Option 2</Label>
    </div>
    <div className="flex items-center space-x-2">
      <RadioGroupItem value="option3" id="${field.name}_option3" />
      <Label htmlFor="${field.name}_option3">Option 3</Label>
    </div>
  </RadioGroup>
  ${field.description ? `<FieldDescription>${field.description}</FieldDescription>` : ''}
  <FieldError />
</Field>`
}

const generateDefaultFieldWithField = (field: FormFieldType, library: FormLibrary): string => {
  if (library === FORM_LIBRARIES.REACT_HOOK_FORM) {
    return `<Field>
  <FieldLabel htmlFor="${field.name}">${field.label}</FieldLabel>
  <Input 
    id="${field.name}" 
    placeholder="${field.placeholder || ''}"
    {...form.register("${field.name}")}
  />
  ${field.description ? `<FieldDescription>${field.description}</FieldDescription>` : ''}
  <FieldError>{form.formState.errors.${field.name}?.message}</FieldError>
</Field>`
  }

  return `<Field>
  <FieldLabel htmlFor="${field.name}">${field.label}</FieldLabel>
  <Input 
    id="${field.name}" 
    name="${field.name}" 
    placeholder="${field.placeholder || ''}"
  />
  ${field.description ? `<FieldDescription>${field.description}</FieldDescription>` : ''}
  <FieldError />
</Field>`
}
