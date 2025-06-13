import React from 'react'
import { CSVLink } from 'react-csv'

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
            className="csv-link hidden"
            onClick={handleDownload}
        />
    )
}

export default CsvConverter

