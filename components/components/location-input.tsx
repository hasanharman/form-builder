'use client'

import LocationSelector from '@/components/ui/location-input'
import { ComponentDocShell } from '@/components/components/component-doc-shell'

const previewCode = `<LocationSelector
  onCountryChange={(country) => console.log(country?.name)}
  onStateChange={(state) => console.log(state?.name)}
/>`

const usageCode = `import LocationSelector from '@/components/ui/location-input'

<LocationSelector
  onCountryChange={(country) => setCountry(country?.name ?? '')}
  onStateChange={(state) => setState(state?.name ?? '')}
/>`

export default function LocationInputPreview() {
  return (
    <ComponentDocShell
      name="location-input"
      preview={<LocationSelector />}
      previewCode={previewCode}
      usageCode={usageCode}
      features={[
        'Country search with flag + country name.',
        'State list automatically filtered by selected country.',
        'Controlled callbacks for form integrations.',
      ]}
    />
  )
}
