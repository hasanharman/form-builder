import { Link } from 'next-view-transitions'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card } from '@/components/ui/card'
import Code from '@/components/code'

import Autocomplete from '@/components/ui/autocomplete'
import { AutocompleteForm } from '@/components/components/autocomplete-form'

const code = `<Autocomplete
  value={field.value}
  onChange={field.onChange}
/>`

const installationCode = `npx shadcn@latest add https://www.shadcn-form.com/registry/autocomplete.json`

const installationManuel = `'use client'

import { useState, useCallback, useEffect } from 'react'
import { useDebounce } from 'use-debounce'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search } from 'lucide-react'

// Simulated API call
const fetchSuggestions = async (query: string): Promise<string[]> => {
  await new Promise((resolve) => setTimeout(resolve, 300)) // Simulate network delay
  const allSuggestions = [
    'React',
    'Redux',
    'Next.js',
    'TypeScript',
    'JavaScript',
    'Node.js',
    'Express',
    'MongoDB',
    'PostgreSQL',
    'GraphQL',
    'Vue.js',
    'Angular',
    'Svelte',
    'Tailwind CSS',
    'Sass',
    'Webpack',
    'Babel',
    'ESLint',
    'Jest',
    'Cypress',
  ]
  return allSuggestions.filter((suggestion) =>
    suggestion.toLowerCase().includes(query.toLowerCase()),
  )
}

interface AutoCompleteProps {
  value?: string
  onChange?: (value: string) => void
}

export default function Autocomplete({ value = '', onChange }: AutoCompleteProps) {
  const [query, setQuery] = useState(value)
  const [debouncedQuery] = useDebounce(query, 300)
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const [isLoading, setIsLoading] = useState(false)
  const [isFocused, setIsFocused] = useState(false)

  const fetchSuggestionsCallback = useCallback(async (q: string) => {
    if (q.trim() === '') {
      setSuggestions([])
      return
    }
    setIsLoading(true)
    const results = await fetchSuggestions(q)
    setSuggestions(results)
    setIsLoading(false)
  }, [])

  useEffect(() => {
    if (debouncedQuery && isFocused) {
      fetchSuggestionsCallback(debouncedQuery)
    } else {
      setSuggestions([])
    }
  }, [debouncedQuery, fetchSuggestionsCallback, isFocused])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setQuery(newValue)
    onChange?.(newValue)
    setSelectedIndex(-1)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex((prev) =>
        prev < suggestions.length - 1 ? prev + 1 : prev,
      )
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1))
    } else if (e.key === 'Enter' && selectedIndex >= 0) {
      setQuery(suggestions[selectedIndex])
      setSuggestions([])
      setSelectedIndex(-1)
    } else if (e.key === 'Escape') {
      setSuggestions([])
      setSelectedIndex(-1)
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion)
    onChange?.(suggestion)
    setSuggestions([])
    setSelectedIndex(-1)
  }

  const handleFocus = () => {
    setIsFocused(true)
  }

  const handleBlur = () => {
    // Delay hiding suggestions to allow for click events on suggestions
    setTimeout(() => {
      setIsFocused(false)
      setSuggestions([])
      setSelectedIndex(-1)
    }, 200)
  }

  return (
    <div className="w-full max-w-md mx-auto p-4">
      <div className="relative">
        <Input
          type="text"
          placeholder="Search..."
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className="pr-10"
          aria-label="Search input"
          aria-autocomplete="list"
          aria-controls="suggestions-list"
          aria-expanded={suggestions.length > 0}
        />
        <Button
          size="icon"
          variant="ghost"
          className="absolute right-0 top-0 h-full"
          aria-label="Search"
        >
          <Search className="h-4 w-4" />
        </Button>
      </div>
      {isLoading && isFocused && (
        <div
          className="mt-2 p-2 bg-background border rounded-md shadow-sm"
          aria-live="polite"
        >
          Loading...
        </div>
      )}
      {suggestions.length > 0 && !isLoading && isFocused && (
        <ul
          id="suggestions-list"
          className="mt-2 bg-background border rounded-md shadow-sm"
          role="listbox"
        >
          {suggestions.map((suggestion, index) => (
            <li
              key={suggestion}
              className={"px-4 py-2 cursor-pointer hover:bg-muted " +
                (index === selectedIndex ? 'bg-muted' : '')
              }
              onClick={() => handleSuggestionClick(suggestion)}
              role="option"
              aria-selected={index === selectedIndex}
            >
              {suggestion}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
`

const usageCode1 = `import Autocomplete from '@/components/ui/autocomplete'`

const formCode = ``

export default function Component() {
  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <h1 className="text-xl font-semibold capitalize">Autocomplete</h1>
        <p className="text-md text-muted-foreground">
          An Autocomplete component for implementing a search bar with live
          suggestions. This component leverages debounced state updates and
          simulated API calls to provide search suggestions based on user input.
          It includes keyboard navigation and click interaction for selecting
          items from the suggestion list, making it both accessible and highly
          interactive.
        </p>
      </div>
      <Tabs defaultValue="preview">
        <TabsList className="grid w-fit grid-cols-2">
          <TabsTrigger value="preview">Preview</TabsTrigger>
          <TabsTrigger value="Code">Code</TabsTrigger>
        </TabsList>
        <TabsContent value="preview">
          <Card className="flex justify-center items-center h-[200px]">
            <Autocomplete />
          </Card>
        </TabsContent>
        <TabsContent value="Code">
          <Card>
            <Code code={code} />
          </Card>
        </TabsContent>
      </Tabs>
      <div className="space-y-3">
        <h5 className="font-semibold">Features</h5>
        <ul className="list-disc pl-3 text-muted-foreground">
          <li>
            Debounced Input: Uses
            <Link
              href="https://www.npmjs.com/package/use-debounce"
              target="_blank"
              className="font-semibold px-1"
            >
              use-debounce
            </Link>
            to delay API calls, minimizing unnecessary requests and improving
            performance.
          </li>
          <li>
            Simulated API Call: Provides a mocked API that filters predefined
            suggestions to emulate real-time search functionality.
          </li>
          <li>
            Keyboard Navigation: Supports ArrowUp, ArrowDown, and Enter keys to
            navigate and select suggestions.
          </li>
        </ul>
        <h5 className="font-semibold">Props</h5>
        <ul className="list-disc pl-3 text-muted-foreground">
          <li>value (optional): The initial value for the input field.</li>
          <li>
            onChange (optional): A callback function that receives the updated
            input value.
          </li>
        </ul>
      </div>
      {/* Installation */}
      <div className="space-y-3">
        <h1 className="text-xl font-semibold capitalize">Installation</h1>
        <Tabs defaultValue="cli">
          <TabsList className="grid w-fit grid-cols-2">
            <TabsTrigger value="cli">CLI</TabsTrigger>
            <TabsTrigger value="manual">Manual</TabsTrigger>
          </TabsList>
          <TabsContent value="cli">
            <Code code={installationCode} />
          </TabsContent>
          <TabsContent value="manual">
            <div className="p-6 sm:p-10">
              <div className="after:absolute after:inset-y-0 after:w-px after:bg-gray-500/20 relative pl-5  after:left-0 grid gap-10 dark:after:bg-gray-400/20">
                <div className="grid gap-1 text-sm relative">
                  <div className="flex justify-center items-center aspect-square w-6 h-6 bg-gray-200 rounded-full absolute left-0 translate-x-[-31.5px] z-10 top-0 dark:bg-gray-50">
                    1
                  </div>
                  <div className="text-lg font-bold">
                    Copy and paste the following code into your project.
                  </div>

                  <Code code={installationManuel} customStyle="h-[300px]" />
                </div>
                <div className="grid gap-1 text-sm relative">
                  <div className="flex justify-center items-center aspect-square w-6 h-6 bg-gray-200 rounded-full absolute left-0 translate-x-[-31.5px] z-10 top-1 dark:bg-gray-50">
                    2
                  </div>
                  <div className="text-lg font-bold">
                    Update the import paths to match your project setup.
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        <p className="text-muted-foreground">
          Once the component is installed successfully, add the following JSON
          files to your project. <code>/data/</code> folder is recommended for
          better organization.
        </p>
        <ul className="list-disc text-muted-foreground ml-4">
          <li>
            <Link
              href="https://github.com/hasanharman/form-builder/blob/main/data/countries.json"
              target="_blank"
              className="hover:underline"
            >
              Countries JSON
            </Link>
          </li>
          <li>
            <Link
              href="https://github.com/hasanharman/form-builder/blob/main/data/states.json"
              target="_blank"
              className="hover:underline"
            >
              States JSON
            </Link>
          </li>
        </ul>
      </div>
      {/* Usage */}
      <div className="space-y-3">
        <h1 className="text-xl font-semibold capitalize">Usage</h1>
        <Code code={usageCode1} />
        <Code code={code} />
      </div>
      {/* Form */}
      <div className="space-y-3">
        <h1 className="text-xl font-semibold capitalize">Form</h1>
        <Tabs defaultValue="preview">
          <TabsList className="grid w-fit grid-cols-2">
            <TabsTrigger value="preview">Preview</TabsTrigger>
            <TabsTrigger value="Code">Code</TabsTrigger>
          </TabsList>
          <TabsContent value="preview">
            <Card className="flex justify-center items-center h-[400px]">
              <AutocompleteForm />
            </Card>
          </TabsContent>
          <TabsContent value="Code">
            <Card>
              <Code code={formCode} customStyle="h-[500px]" />
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
