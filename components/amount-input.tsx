import * as React from 'react'
import CurrencyInput from "react-currency-input-field"
import { Info, MinusCircle, PlusCircle } from "lucide-react"

import { cn } from "@/lib/utils"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"


type Props = {
    id?: string
    value: string
    // We deal with strings here because in JS, currencies exist as a
    // string and that is also how our currency-input-field handles currencies.
    onChange: (value: string | undefined) => void
    placeholder? : string
    disabled?: boolean
}


export const AmountInput = React.forwardRef<HTMLInputElement, Props>(
    ({ id, value, onChange, placeholder, disabled }, ref) => {

    const parsedValue = parseFloat(value)
    const isIncome = parsedValue > 0
    const isExpense = parsedValue < 0

    // Limit to 1 trillion. (13 digits for whole number + 2 digits for cents)
    const limit = 15

    // Allow users to easily change things from an expense
    // to an income or vice-versa
    const onReverseValue = () => {
        if (!value) return

        const newValue = parseFloat(value) * -1
        onChange(newValue.toString())
    }

    return (
        <div className="relative">
            <TooltipProvider>
                <Tooltip delayDuration={100}>
                    <TooltipTrigger asChild>
                        <button
                            type="button"
                            onClick={onReverseValue}
                            className={cn(
                                "bg-halloween-gray hover:bg-halloween-midnight absolute top-1.5 left-1.5",
                                "rounded-md p-2 flex items-center justify-center transition",
                                isIncome && "bg-emerald-500 hover:bg-emerald-600",
                                isExpense && "bg-rose-500 hover:bg-rose-600"
                            )}
                        >
                            {!parsedValue && <Info className="size-3 text-halloween-white" />}
                            {isIncome && <PlusCircle className="size-3 text-halloween-white" />}
                            {isExpense && <MinusCircle className="size-3 text-halloween-white" />}

                        </button>
                    </TooltipTrigger>
                    <TooltipContent>
                        Use [+] for income and [-] for expenses. Limit: 1 trillion dollars
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
            <CurrencyInput
                ref={ref}
                id={id}
                prefix="$"
                className="
                    pl-10 flex h-10 w-full rounded-md border border-input bg-background px-3
                    py-2 text-sm ring-offset-background file:border-0 file:bg-transparent
                    file:text-sm file:font-medium file:text-foreground
                    placeholder:text-muted-foreground focus-visible:outline-none
                    focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
                    disabled:cursor-not-allowed disabled:opacity-50
                "
                placeholder={placeholder}
                value={value}
                decimalsLimit={2}
                decimalScale={2}
                onValueChange={onChange}
                disabled={disabled}
                maxLength={limit}
            />
            <p className="text-xs text-muted-foreground mt-2">
                {isIncome && "This will count as income"}
                {isExpense && "This will count as expense"}
            </p>
        </div>
        )
    }
)