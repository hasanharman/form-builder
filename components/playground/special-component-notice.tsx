import { Link } from 'next-view-transitions'

import Code from '@/components/code'
import type { FormFieldOrGroup } from '@/components/field-variants/form'
import { formInstallCommand, formRegistryItems } from '@/lib/form-code'
import { getRegistryItem } from '@/lib/registry-catalog'

/** The install command for everything the generated form imports. */
const SpecialComponentsNotice = ({ formFields }: { formFields: FormFieldOrGroup[] }) => {
  if (formFields.length === 0) return null
  const ownItems = formRegistryItems(formFields)
    .map((name) => getRegistryItem(name))
    .filter((item) => item !== undefined)

  return (
    <div className="space-y-2">
      <p className="text-sm text-muted-foreground">
        Install every component this form uses:
      </p>
      <Code code={formInstallCommand(formFields)} />
      {ownItems.length > 0 && (
        <p className="text-sm text-muted-foreground">
          From the shadcn-form registry:{' '}
          {ownItems.map((item, index) => (
            <span key={item.name}>
              {index > 0 && ', '}
              <Link href={`/components/${item.name}`} className="underline">
                {item.title}
              </Link>
            </span>
          ))}
        </p>
      )}
    </div>
  )
}

export default SpecialComponentsNotice
