"use client"

import { useMemo } from "react"
import { SingleValue } from "react-select"
import CreateableSelect from "react-select/creatable"


type Props = {
    onChange: (value?: string) => void
    onCreate?: (value : string) => void
    options?: { label: string; value: string }[]
    // Define value like this for more type safety.
    // It allows us to define behavior for all three scenarios.
    value?: string | null | undefined
    disabled?: boolean
    placeholder?: string
}

export const Select = ({
    value,
    onChange,
    disabled,
    onCreate,
    options = [],
    placeholder
} : Props) => {

    const onSelect = (
        option: SingleValue<{ label: string, value: string }>
    ) => {
        onChange(option?.value)
    }

    // We utilize useMemo() here because once we calculate our options
    // we can simply just use the cached options instead of recalculating,
    // unless we have actually changed options or value.
    const formattedValue = useMemo(() => {
        return options.find((option) => option.value === value)
    }, [options, value]) 

    return (
        <CreateableSelect
            placeholder={placeholder}
            className="text-sm h-10"
            styles={{
                control: (base) => ({
                    // Keep base styles except for borderColor and hover.
                    ...base,
                    borderColor: "#e2e8f0",
                    ":hover": {
                        borderColor: "#e2e8f0",
                    },
                })
            }}
            value={formattedValue}
            onChange={onSelect}
            options={options}
            onCreateOption={onCreate}
            isDisabled={disabled}
        />
    )
}


