// Define the FormField type
export interface FormField {
  type: string;
  label: string;
  name: string;
  value?: string;
  placeholder?: string;
  required: boolean;
  disabled: boolean;
}
