import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { js_beautify } from 'js-beautify'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const sentenceCase = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

export const lowerCase = (str: string): string => {
  return str.charAt(0).toLowerCase() + str.slice(1).toLowerCase()
}

export const isNotEmpty = (value: string | undefined) =>
  value!.trim().length > 0

export function formatJSXCode(code: string): string {
  return js_beautify(code, {
    indent_size: 2,
    indent_char: ' ',
    max_preserve_newlines: 2,
    preserve_newlines: true,
    keep_array_indentation: false,
    break_chained_methods: false,
    // indent_scripts: "normal",
    // brace_style: "collapse,preserve-inline",
    space_before_conditional: true,
    unescape_strings: false,
    jslint_happy: false,
    end_with_newline: false,
    wrap_line_length: 0,
    // indent_inner_html: false,
    comma_first: false,
    e4x: true,
    indent_empty_lines: false,
  })
}
