// components/editor/blocks/checkbox.tsx
import { defaultProps } from '@blocknote/core'
import { createReactBlockSpec } from '@blocknote/react'
import * as CheckboxPrimitive from '@radix-ui/react-checkbox'
import { CheckIcon } from '@radix-ui/react-icons'
import { cn } from '@/lib/utils'

export const checkboxTypes = [
  {
    title: 'Default',
    value: 'default',
  },
  {
    title: 'Checked',
    value: 'checked',
  },
] as const

export const Checkbox = createReactBlockSpec(
  {
    type: 'checkbox',
    propSchema: {
      textAlignment: defaultProps.textAlignment,
      textColor: defaultProps.textColor,
      checked: {
        default: false,
      },
      label: {
        default: '',
      },
    },
    content: 'inline',
  },
  {
    render: (props) => {
      return (
        <div className="flex items-center space-x-2">
          <CheckboxPrimitive.Root
            checked={props.block.props.checked}
            onCheckedChange={(checked) => {
              const isChecked = checked === true
              props.editor.updateBlock(props.block, {
                props: { checked: isChecked },
              })
            }}
            className={cn(
              'peer h-4 w-4 shrink-0 rounded-sm border border-primary shadow focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground',
            )}
          >
            <CheckboxPrimitive.Indicator
              className={cn('flex items-center justify-center text-current')}
            >
              <CheckIcon className="h-4 w-4" />
            </CheckboxPrimitive.Indicator>
          </CheckboxPrimitive.Root>
          <div ref={props.contentRef} className="flex-1" />
        </div>
      )
    },
  },
)
