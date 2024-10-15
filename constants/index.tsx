import { FieldType } from '@/types'

export const fieldTypes: FieldType[] = [
  { name: 'Checkbox', isNew: false },
  { name: 'Combobox', isNew: false },
  { name: 'Date Picker', isNew: false },
  { name: 'File Input', isNew: false },
  { name: 'Input', isNew: false },
  { name: 'Input OTP', isNew: false },
  { name: 'Multi Select', isNew: true },
  { name: 'Select', isNew: false },
  { name: 'Slider', isNew: false },
  { name: 'Switch', isNew: false },
  { name: 'Tags Input', isNew: true },
  { name: 'Textarea', isNew: false },
  { name: 'Password', isNew: false },
  { name: 'Phone', isNew: false },
]

export const defaultFieldConfig: Record<
  string,
  { label: string; description: string; placeholder?: any }
> = {
  Checkbox: {
    label: 'Use different settings for my mobile devices',
    description:
      'You can manage your mobile notifications in the mobile settings page.',
  },
  Combobox: {
    label: 'Language',
    description: 'This is the language that will be used in the dashboard.',
  },
  'Date Picker': {
    label: 'Date of birth',
    description: 'Your date of birth is used to calculate your age.',
  },
  'File Input': {
    label: 'Default File Input Label',
    description: 'Upload a file.',
  },
  Input: {
    label: 'Username',
    description: 'This is your public display name.',
    placeholder: 'shadcn',
  },
  'Input OTP': { label: 'Default OTP Label', description: 'Enter your OTP.' },
  'Multi Select': {
    label: 'Default Multi Select Label',
    description: 'Select multiple options.',
  },
  Select: { label: 'Default Select Label', description: 'Choose an option.' },
  Slider: {
    label: 'Set Price Range',
    description: 'Adjust the price by sliding.',
  },
  Switch: { label: 'Default Switch Label', description: 'Toggle this option.' },
  'Tags Input': { label: 'Default Tags Input Label', description: 'Add tags.' },
  Textarea: {
    label: 'Default Textarea Label',
    description: 'Enter your text.',
  },
  Password: {
    label: 'Default Password Label',
    description: 'Enter your password.',
  },
  Phone: {
    label: 'Default Phone Label',
    description: 'Enter your phone number.',
  },
}
