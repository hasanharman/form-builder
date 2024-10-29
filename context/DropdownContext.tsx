import React, { createContext, useContext, useState } from 'react'

interface DropdownContextType {
  countryValue: string
  setCountryValue: (country: string) => void
  openCountryDropdown: boolean
  setOpenCountryDropdown: (open: boolean) => void
  stateValue: string
  setStateValue: (state: string) => void
  openStateDropdown: boolean
  setOpenStateDropdown: (open: boolean) => void
}

const DropdownContext = createContext<DropdownContextType | undefined>(
  undefined,
)

export const DropdownProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [countryValue, setCountryValue] = useState('')
  const [openCountryDropdown, setOpenCountryDropdown] = useState(false)
  const [stateValue, setStateValue] = useState('')
  const [openStateDropdown, setOpenStateDropdown] = useState(false)

  return (
    <DropdownContext.Provider
      value={{
        countryValue,
        setCountryValue,
        openCountryDropdown,
        setOpenCountryDropdown,
        stateValue,
        setStateValue,
        openStateDropdown,
        setOpenStateDropdown,
      }}
    >
      {children}
    </DropdownContext.Provider>
  )
}

export const useDropdown = () => {
  const context = useContext(DropdownContext)
  if (context === undefined) {
    throw new Error('useDropdown must be used within a DropdownProvider')
  }
  return context
}
