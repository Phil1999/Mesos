import { cn } from "@/lib/utils"

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"


type Props = {
    columnIndex: number
    selectedColumns: Record<string, string | null>
    onChange: (
        columnIndex: number,
        value: string | null // Allow user to skip specific options
    ) => void
}

// Must match with requiredOptions in import-card
const options = [
    "amount",
    "payee",
    //"notes",
    "date",
]

export const TableHeadSelect = ({
    columnIndex,
    selectedColumns,
    onChange,
}: Props) => {

    const currentSelection = selectedColumns[`column_${columnIndex}`]

    return (
        <Select
            value={currentSelection || ""}
            onValueChange={(value) => onChange(columnIndex, value)}
        >
            <SelectTrigger
                className={cn(
                    "focus:ring-offset-0 focus:ring-transparent outline-none border-none",
                    "bg-transparent capitalize",
                    // Let user know that its been selected already by highlighting it.
                    currentSelection && "text-blue-500",
                )}
            >
                <SelectValue placeholder="Skip" />
            </SelectTrigger>
            <SelectContent>
                {/* Hardcoded skip option here. */}
                <SelectItem value="skip">Skip</SelectItem>
                {options.map((option, index) => {
                    // Ensure we don't map out already selected options
                    const disabled = Object.values(selectedColumns).includes(option)
                    && selectedColumns[`column_${columnIndex}`] !== option

                    return (
                        <SelectItem
                            key={index}
                            value={option}
                            disabled={disabled}
                            className="capitalize"
                        >
                            {option}
                        </SelectItem>
                    )
                })}
            </SelectContent>
        </Select>
    )
}
