import React from 'react'
import {
  RiH1,
  RiH2,
  RiH3,
  RiParagraph,
  RiLayoutColumnLine,
} from 'react-icons/ri'

export interface CommandItem {
  title: string
  value: string
  icon: React.ReactElement
  isNew?: boolean
}

export const labelCommands: CommandItem[] = [
  { title: 'Heading 1', value: 'h1', icon: <RiH1 /> },
  { title: 'Heading 2', value: 'h2', icon: <RiH2 /> },
  { title: 'Heading 3', value: 'h3', icon: <RiH3 /> },
  { title: 'Paragraph', value: 'p', icon: <RiParagraph /> },
]

export const layoutCommands: CommandItem[] = [
  { title: 'Columns', value: 'columns', icon: <RiLayoutColumnLine /> },
]

export const componentCommands: CommandItem[] = [
  { title: 'Checkbox', value: 'checkbox', icon: <span>C</span> },
  { title: 'Combobox', value: 'combobox', icon: <span>C</span> },
  { title: 'Date Picker', value: 'date-picker', icon: <span>D</span> },
  {
    title: 'Datetime Picker',
    value: 'datetime-picker',
    icon: <span>D</span>,
    isNew: true,
  },
  { title: 'File Input', value: 'file-input', icon: <span>F</span> },
  { title: 'Input', value: 'input', icon: <span>I</span> },
  { title: 'Input OTP', value: 'input-otp', icon: <span>I</span> },
  {
    title: 'Location Input',
    value: 'location-input',
    icon: <span>L</span>,
    isNew: true,
  },
  { title: 'Multi Select', value: 'multi-select', icon: <span>M</span> },
  { title: 'Password', value: 'password', icon: <span>P</span> },
  { title: 'Phone', value: 'phone', icon: <span>P</span> },
  { title: 'Select', value: 'select', icon: <span>S</span> },
  {
    title: 'Signature Input',
    value: 'signature-input',
    icon: <span>S</span>,
    isNew: true,
  },
  { title: 'Slider', value: 'slider', icon: <span>S</span> },
  {
    title: 'Smart Datetime Input',
    value: 'smart-datetime-input',
    icon: <span>S</span>,
    isNew: true,
  },
  { title: 'Switch', value: 'switch', icon: <span>S</span> },
  { title: 'Tags Input', value: 'tags-input', icon: <span>T</span> },
  { title: 'Textarea', value: 'textarea', icon: <span>T</span> },
]
