import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

import { TableHeadSelect } from "./table-head-select"

type Props = {
    headers: string[]
    body: string[][]
    selectedColumns: Record<string, string |null>
    // We use this to change the table headers to what we expect them to be in the DB.
    // By alllowing the user to modify that on the frontend. 
    // E.g. Payee can be column 4.
    onTableHeadSelectChange: (columnIndex: number, value: string | null) => void
}

export const ImportTable = ({
    headers,
    body,
    selectedColumns,
    onTableHeadSelectChange,
}: Props) => {
    return (
        <div className="rounded-md border overflow-hidden">
            <Table>
                <TableHeader className="bg-muted">
                    <TableRow>
                        {headers.map(( _item, index ) => (
                            <TableHead key = {index}>
                                <TableHeadSelect
                                    columnIndex={index}
                                    selectedColumns={selectedColumns}
                                    onChange={onTableHeadSelectChange}
                                />
                            </TableHead>
                        ))}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {body.map((row: string[], index) => (
                        <TableRow key={index}>
                            {row.map((cell, index) => (
                                <TableCell key={index}>
                                    {cell}
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
                
            </Table>
        </div>
    )
}