import { format } from "date-fns"
import {
    Tooltip,
    XAxis,
    BarChart,
    Bar,
    ResponsiveContainer,
    CartesianGrid
} from "recharts"

import { CustomTooltip } from "@/components/custom-tooltip"

type Props = {
    data?: {
        date: string
        income: number
        expenses: number
    }[]
}

export const BarVariant = ({ data = [] }: Props) => {
    return (
        <ResponsiveContainer width="100%" height={350}>
            <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                    axisLine={false}
                    tickLine={false}
                    dataKey="date"
                    tickFormatter={(value) => format(new Date(value), "MMM dd")}
                    style={{ fontSize: "12px" }}
                    tickMargin={16} 
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar
                    dataKey="income"
                    fill="#008080"
                    className="drop-shadow-sm"
                />
                <Bar
                    dataKey="expenses"
                    fill="#FF4500"
                    className="drop-shadow-sm"
                />
            </BarChart>
        </ResponsiveContainer>
    )
}
