export const FORM_LIBRARIES = {
  SERVER_ACTIONS: 'server-actions',
  REACT_HOOK_FORM: 'react-hook-form',
  TANSTACK_FORM: 'tanstack-form',
  BRING_YOUR_OWN: 'bring-your-own',
} as const

export type FormLibrary = typeof FORM_LIBRARIES[keyof typeof FORM_LIBRARIES]

export const FORM_LIBRARY_LABELS = {
  [FORM_LIBRARIES.SERVER_ACTIONS]: 'Server Actions',
  [FORM_LIBRARIES.REACT_HOOK_FORM]: 'React Hook Form',
  [FORM_LIBRARIES.TANSTACK_FORM]: 'TanStack Form',
  [FORM_LIBRARIES.BRING_YOUR_OWN]: 'Bring Your Own Form',
}
