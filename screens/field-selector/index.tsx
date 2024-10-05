import React from 'react'

import { fieldTypes } from '@/constants'
import { Button } from '@/components/ui/button'
import If from '@/components/ui/if'
import Link from 'next/link'

type FieldSelectorProps = {
  addFormField: (type: string, index?: number) => void
}

export const FieldSelector: React.FC<FieldSelectorProps> = ({
  addFormField,
}) => {
  return (
    <div className="flex md:flex-col items-start flex-wrap gap-3">
      {fieldTypes.map((type) => (
        <div className="flex items-center gap-1" key={type.name}>
          <Button
            key={type.name}
            variant="outline"
            onClick={() => addFormField(type.name, type.index)}
            className="rounded-full"
            size="sm"
          >
            {type.name}
            <If
              condition={type.isNew}
              render={() => (
                <div className="md:hidden ml-1 text-[10px] p-1 bg-yellow-200 rounded">
                  New
                </div>
              )}
            />
          </Button>
          <If
            condition={type.isNew}
            render={() => (
              <div className="hidden md:block ml-1 text-[10px] p-1 bg-yellow-200 rounded">
                New
              </div>
            )}
          />
        </div>
      ))}
      <Link href="https://shadcnform.featurebase.app/" target="_blank">
        <Button className="rounded-full" size="sm">
          Request
        </Button>
      </Link>
    </div>
  )
}
