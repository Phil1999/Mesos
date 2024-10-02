"use client"

import { useState, useEffect } from "react"
import { format, subDays, parseISO, startOfDay, endOfDay } from "date-fns"
import { DateRange } from "react-day-picker"
import { ChevronDown } from "lucide-react"
import qs from "query-string"
import {
    usePathname,
    useRouter,
    useSearchParams,
} from "next/navigation"


import { formatDateRange } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
    PopoverClose,
} from "@/components/ui/popover"

import { useGetSummary } from "@/features/summary/api/use-get-summary"
import { useGetAccounts } from "@/features/accounts/api/use-get-accounts"


export const DateFilter = () => {
    const router = useRouter()
    const pathname = usePathname()
    const params = useSearchParams()
    const accountId = params.get("accountId")
    const from = params.get("from") || ""
    const to = params.get("to") || ""

    const [rangeUnset, setRangeUnset] = useState(true)

    const defaultTo = new Date()
    const defaultFrom = subDays(defaultTo, 30)

    const paramState = {
        from: from ? parseISO(from) : defaultFrom,
        to: to ? parseISO(to) : defaultTo,
    }

    const [date, setDate] = useState<DateRange | undefined>(
        paramState
    )

    // React-query does cache results so this shouldn't cause multiple requests.
    // performance overhead should be quite minimal.
    const {
        isLoading: isLoadingSummary,
    } = useGetSummary()
    const {
        isLoading: isLoadingAccounts,
    } = useGetAccounts()
    
    const isLoading = isLoadingSummary ||
                      isLoadingAccounts

    const pushToUrl = (dateRange: DateRange | undefined) => {
        const query = {
            from: dateRange?.from ? format(startOfDay(dateRange.from), "yyyy-MM-dd") : undefined,
            to: dateRange?.to ? format(endOfDay(dateRange.to), "yyyy-MM-dd") : undefined,
            accountId,
        }
        
        const url = qs.stringifyUrl({
            url: pathname,
            query,
        }, { skipEmptyString: true, skipNull: true, })


        router.push(url)
    }

    const onReset = () => {
        setDate(undefined)
        setRangeUnset(true)
        pushToUrl(undefined)
    }

    const handleSelect = (newDate: DateRange | undefined) => {
        setDate(newDate)
        
        // Need both a from and to to be able to set new range.
        if (newDate?.from && newDate?.to) {
            setRangeUnset(false)
        } else {
            setRangeUnset(true)
        }
    }

    // When moving between pages, reset the component.
    // This fixes the issue where the component maintained its values
    // after moving between pages.
    // TODO: maybe better fix?
    useEffect(() => {
        setDate(paramState)
        setRangeUnset(true)
    }, [pathname])
    

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    disabled={isLoading}
                    size="sm"
                    variant="outline"
                    className="lg:w-auto w-full h-9 rounded-md px-3 font-normal bg-white/10
                            hover:bg-white/20 hover:Text-white border-none focus:ring-offset-0
                            focus:ring-transparent outline-none text-white focus-bg-white/30 transition"
                >
                    <span>{formatDateRange(paramState)}</span>
                    <ChevronDown className="ml-2 size-4 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent
                className="lg:w-auto w-full p-0"
                align="start"
            >
                <Calendar
                    disabled={isLoading}
                    initialFocus
                    mode="range"
                    defaultMonth={date?.from}
                    selected={date}
                    onSelect={handleSelect}
                    numberOfMonths={2}
                />

                <div className="p-4 w-full flex items-center gap-x-2">
                    <PopoverClose asChild>
                        <Button
                            onClick={onReset}
                            disabled={rangeUnset}
                            className="w-full"
                            variant="outline"
                        >
                            Reset

                        </Button>
                    </PopoverClose>

                    <PopoverClose asChild>
                        <Button
                            onClick={() => pushToUrl(date)}
                            disabled={rangeUnset}
                            className="w-full"
                        >
                            Apply

                        </Button>
                    </PopoverClose>
                </div>

            </PopoverContent>
        </Popover>
    )
}