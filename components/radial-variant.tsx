import {
    RadialBar,
    RadialBarChart,
    Legend,
    ResponsiveContainer,
} from "recharts"

import { formatCurrency } from "@/lib/utils"

const COLORS = ["#6B5B95", "#008080", "#FF4500", "#FF9354"]

type Props = {
    data?: {
        name: string
        value: number
    }[]
}

export const RadialVariant = ({ data = [] }: Props) => {
    return (
        <ResponsiveContainer width="100%" height={350}>
            <RadialBarChart
                cx="50%"
                cy="30%"
                barSize={10}
                innerRadius="90%"
                outerRadius="40%"
                data={data.map((item, index) => ({
                    ...item,
                    fill: COLORS[index % COLORS.length]
                }))}
            >
                <RadialBar
                    label={{
                        position: "insideStart",
                        fill: "#F2F2F2",
                        fontSize: "12px"
                    }}
                    background
                    dataKey="value"
                />
                <Legend
                    layout="horizontal"
                    verticalAlign="bottom"
                    align="right"
                    iconType="circle"
                    content={({ payload }: any) => {
                        // Necessary check:
                        // We have to ensure payload is undefined or empty
                        // Otherwise, it will hydration issues.
                        if (!payload) return null

                        return (
                            <ul className="flex flex-col space-y-2">
                                {payload.map((entry: any, index: number) => (
                                    <li
                                        key={`item-${index}`}
                                        className="flex items-center space-x-2"
                                    >
                                        <span
                                            className="size-2 rounded-full"
                                            style={{ backgroundColor: entry.color }}
                                        />
                                        <div className="space-x-1">
                                            <span className="text-sm text-muted-foreground">
                                                {entry.value}:
                                            </span>
                                            <span className="text-sm">
                                                {formatCurrency(entry.payload.value)}
                                            </span>
                                        </div>

                                    </li>
                                ))}
                            </ul>
                        )
                    }}
                />
                
            </RadialBarChart>

        </ResponsiveContainer>
    )
}