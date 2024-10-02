import { Upload } from "lucide-react";
import { useCSVReader } from "react-papaparse"

import { Button } from "@/components/ui/button"

type Props = {
    onUpload: (results: any) => void
}

export const UploadButton = ({ onUpload }: Props) => {
    const { CSVReader } = useCSVReader()

    // Optionally, we can add a paywall here if we decide to make a premium option.

    // Filter out empty row or whitespace
    const isRowEmpty = (row: string[]) => {
        return row.every(cell => !cell.trim());
    };

    const handleUploadAccepted = (results: any) => {
        const filteredResults = {
            ...results,
            data: results.data.filter((row: string[]) => !isRowEmpty(row))
        };
        onUpload(filteredResults);
    };


    return (
        <CSVReader onUploadAccepted={handleUploadAccepted}>
            {({ getRootProps }: any) => (
                <Button
                    size="sm"
                    className="w-full lg:w-auto"
                    {...getRootProps()}
                >
                    <Upload className="size-4 mr-2" />
                        Import
                </Button>
            )}
        </CSVReader>
    )
}