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
            className="px-4 mb-5 py-2 bg-blue-500 text-white rounded"
            onClick={handleDownload}
        >
            Download CSV
        </CSVLink>
    )
}

export default CsvConverter

