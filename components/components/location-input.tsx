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
      title="Location Input"
      slug="location-input"
      description="Country and state picker based on your local countries/states JSON data."
      preview={<LocationSelector />}
      previewCode={previewCode}
      usageCode={usageCode}
      features={[
        'Country search with flag + country name.',
        'State list automatically filtered by selected country.',
        'Controlled callbacks for form integrations.',
      ]}
      notes={
        <p>
          Add <code>countries.json</code> and <code>states.json</code> in your{' '}
          <code>/data</code> directory before using this component.
        </p>
      }
    />
  )
}
