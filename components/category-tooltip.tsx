import { format } from "date-fns";

import { formatCurrency } from "@/lib/utils";
import { Separator } from "@radix-ui/react-dropdown-menu";


export const CategoryTooltip = ({ active, payload }: any) => {
    if (!active) return null

    // Rechart documentation tells us how the payload is formatted.
    const name = payload[0].payload.name
    const value = payload[0].value

    return (
        <div className="rounded-sm bg-halloween-white shadow-sm border overflow-hidden">
            <div className="text-sm p-2 px-3 bg-muted text-muted-foreground">
                {name}
            </div>
            <Separator />
            <div className="p-2 px-3 space-y-1">
                <div className="flex items-center justify-between gap-x-4">
                    <div className="flex items-center gap-x-2">
                        <div className="size-1.5 bg-halloween-red rounded-full" />
                            <p className="text-sm text-muted-foreground">
                                Expenses
                            </p>
                    </div>
                    <p className="text-sm text-right font-medium">
                        {/* We multiply by -1 because our api returns abs(expenses) */}
                        {formatCurrency(value * -1)}
                    </p>
                </div>

            </div>
        </div>
    )
}