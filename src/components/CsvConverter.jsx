import React from 'react'
import { CSVLink } from 'react-csv'
import { Download } from 'lucide-react'

const headers = [
    { label: 'Amount', key: 'amount' },
    { label: 'Type', key: 'type' },
    { label: 'Date', key: 'date' },
    { label: 'Note', key: 'note' },
    { label: 'Created At', key: 'createdAt' },
];

function handleDownload() {
    alert("Your CSV file will download soon")
}

function CsvConverter({ expense }) {
    return (
        <CSVLink
            data={expense}
            headers={headers}
            filename={'expense-data.csv'}
            onClick={handleDownload}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors duration-200"
        >
            <Download className="w-4 h-4" />
            <span>CSV</span>
        </CSVLink>
    )
}

export default CsvConverter

