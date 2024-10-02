import { IconType } from "react-icons"
import { VariantProps, cva } from "class-variance-authority"

import { Skeleton } from "@/components/ui/skeleton"
import { cn, formatCurrency, formatPercentage } from "@/lib/utils"
import { CountUp } from "@/components/count-up"
import {
    Card,
    CardContent,
    CardDescription,
    CardTitle,
    CardHeader,
} from "@/components/ui/card"

const boxVariant = cva(
    "shrink-0 rounded-md p-3",
    {
        variants: {
            variant: {
                default: "bg-halloween-midnight/20",
                success: "bg-halloween-green/40",
                danger: "bg-halloween-red/20",
                warning: "bg-halloween-haunted_gold/50",
            }
        },
        defaultVariants: {
            variant: "default",
        },
    },
)

const iconVariant = cva(
    "size-6",
    {
        variants: {
            variant: {
                default: "fill-halloween-midnight",
                success: "fill-halloween-darker_green",
                danger: "fill-halloween-red",
                warning: "fill-halloween-bronze_gold",
            }
        },
        defaultVariants: {
            variant: "default",
        },
    },
)

type BoxVariants = VariantProps<typeof boxVariant>
type IconVariants = VariantProps<typeof iconVariant>

interface DataCardProps extends BoxVariants, IconVariants {
    icon: IconType
    title: string
    value?: number
    dateRange: string
    percentageChange? : number

}

export const DataCard = ({
    icon: Icon,
    title,
    value = 0,
    variant,
    dateRange,
    percentageChange = 0
}: DataCardProps) => {
    return (
        <Card className="border-none drop-shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between gap-x-4">
                <div className="space-y-2">
                    <CardTitle className="text-2xl line-clamp-1">
                        {title}
                    </CardTitle>
                    <CardDescription className="line-clamp-1">
                        {dateRange}
                    </CardDescription>
                </div>
                <div className={cn(
                    boxVariant({ variant }),
                )}>
                <Icon className={cn(iconVariant({ variant }))} />

                </div>
            </CardHeader>
            <CardContent>
                <h1 className="font-bold text-2xl mb-2 line-clamp-1 break-all">
                    <CountUp
                        preserveValue
                        start={0}
                        end={value}
                        decimals={2}
                        decimalPlaces={2}
                        formattingFn={formatCurrency}
                    />
                </h1>
                <p className={cn(
                    "text-muted-foreground text-sm line-clamp-1",
                    percentageChange > 0 && "text-halloween-darker_green",
                    percentageChange < 0 && "text-halloween-red",
                )}>
                  {formatPercentage(percentageChange, { addPrefix: true})} from last period.  
                </p>
            </CardContent>
        </Card>
    )
}

export const DataCardLoading = () => {
    return (
        <Card className="border-none drop-shadow-sm h-[192px]">
            <CardHeader className="flex flex-row items-center justify-between gap-x-4">
                <div className="space-y-2">
                    <Skeleton className="h-6 w-24" />
                    <Skeleton className="h-4 w-40" />
                </div>
                <Skeleton className="size-12" />
            </CardHeader>
            <CardContent>
                <Skeleton className="shrink-0 h-10 w-24 mb-2" />
                <Skeleton className="shrink-0 h-4 w-40" />
            </CardContent>
        </Card>
    )
}