import { Link } from 'next-view-transitions'

import Code from '@/components/code'
import { SPECIAL_COMPONENTS } from '@/constants/special-components'
import { getRegistryItem, installCommand } from '@/lib/registry-catalog'
import { FormFieldType } from '@/types'

export type FormFieldOrGroup = FormFieldType | FormFieldType[]

const SpecialComponentsNotice = ({
  formFields,
}: {
  formFields: FormFieldOrGroup[]
}) => {
  const variants = new Set(formFields.flat().map((field) => field.variant))
  const used = SPECIAL_COMPONENTS.filter((component) =>
    variants.has(component.variant),
  )

  if (used.length === 0) return null

  return (
    <div className="space-y-2">
      <p className="text-sm text-muted-foreground">
        This form uses components from the shadcn-form registry. Install them
        with:
      </p>
      <Code code={installCommand(used.map((component) => component.item))} />
      <ul className="list-disc text-sm text-muted-foreground pl-3">
        {used.map((component) => (
          <li key={component.item}>
            <Link href={`/components/${component.item}`} className="hover:underline">
              {getRegistryItem(component.item)?.title ?? component.variant}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default SpecialComponentsNotice
