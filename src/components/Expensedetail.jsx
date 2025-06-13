import React, { useEffect, useRef, useState } from 'react'
import ExpenseCharts from './ExpenseCharts'
import CsvConverter from './CsvConverter'
import PdfConverter from './PdfConverter'
import { Download, FileText, Filter, DollarSign } from 'lucide-react'

function Expensedetail({ refreshTrigger }) {
    const [expenseStatus, setExpenseStatus] = useState(false)
    const [expense, setExpense] = useState([])
    const [income, setIncome] = useState([])
    const [outgoing, setOutgoing] = useState([])
    const [incomeamount, setIncomeAmount] = useState(0);
    const [outgoingamount, setOutgoingAmount] = useState(0);
    const [result, setResult] = useState(0);
    const [filter, setFilter] = useState('today');
    const [loading, setLoading] = useState(false);
    const [backendError, setBackendError] = useState('')
    const chartRef = useRef();

    async function getExpense() {
        try {
            const response = await fetch(`http://localhost:5001/api/users/getexpense?filter=${filter}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            const result = await response.json();

            if (response.ok) {
                setExpense(result)
                console.log(result)
                setExpenseStatus(true)
                const In = result.filter((ex) => ex.type === 'income')
                setIncome(In)
                const Out = result.filter((ex) => ex.type === 'expense')
                setOutgoing(Out)
                const totalIn = In.reduce((total, item) => {
                    return total + parseFloat(item.amount || 0)
                }, 0)
                setIncomeAmount(totalIn)
                const totalOut = Out.reduce((total, item) => {
                    return total + parseFloat(item.amount || 0)
                }, 0)
                setOutgoingAmount(totalOut)
                const final = totalIn - totalOut
                setResult(final)
            } else {
                setExpenseStatus(false)
                setExpense([])
                setBackendError(result.message)
                setResult(0)
            }
        } catch (error) {
            console.error('Error fetching user:', error);
        }
    }

    function handleFilter(e) {
        setFilter(e.target.value)
    }

    useEffect(() => {
        getExpense();
    }, [refreshTrigger, filter])

    return (
        <div className="p-4 sm:p-6 min-h-screen bg-gradient-to-r from-slate-800 to-slate-900 rounded-xl">
            <div className="flex flex-col justify-center items-center space-y-6">
                <h1 className="text-2xl font-bold text-center text-emerald-400">Expense Details</h1>

                <div className="flex flex-col sm:flex-row justify-center items-center gap-4 w-full max-w-4xl">
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                        <DollarSign className="w-5 h-5 text-emerald-400" />
                        <div className={`${result < 0 ? "bg-red-500/20" : "bg-emerald-500/20"} text-white font-semibold rounded-xl p-4 flex-1`}>
                            Net Balance: {result > 0 && '+'}{result}$
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                        <div className="relative">
                            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <select
                                className="pl-10 pr-4 py-2 rounded-lg bg-slate-700 border border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent w-full"
                                value={filter}
                                onChange={handleFilter}
                            >
                                <option value="">Select Category</option>
                                <option value="today">Today</option>
                                <option value="this_week">This Week</option>
                                <option value="this_month">This Month</option>
                                <option value="last_month">Last Month</option>
                                <option value="this_year">This Year</option>
                            </select>
                        </div>

                        <div className="flex gap-2">
                            <button
                                onClick={() => document.querySelector('.csv-link').click()}
                                className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors duration-200"
                            >
                                <Download className="w-4 h-4" />
                                <span>CSV</span>
                            </button>
                            <button
                                onClick={() => document.querySelector('.pdf-button').click()}
                                className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors duration-200"
                            >
                                <FileText className="w-4 h-4" />
                                <span>PDF</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {expense && (
                <div
                    ref={chartRef}
                    className="w-full bg-slate-700/50 rounded-xl p-4 mt-6"
                >
                    <ExpenseCharts expense={expense} />
                </div>
            )}

            {expenseStatus ? (
                <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold text-emerald-400 text-center">Income: +${incomeamount}</h2>
                        {income.length > 0 ? income.map((ex, index) => (
                            <div
                                key={index}
                                className="bg-slate-700/50 rounded-lg p-6 hover:bg-slate-700/70 transition-colors duration-200"
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <span className="bg-emerald-500/20 text-emerald-400 text-sm font-medium px-3 py-1 rounded-full">
                                        #{index + 1}
                                    </span>
                                    <span className="text-2xl font-bold text-emerald-400">
                                        +${ex.amount}
                                    </span>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="flex items-center space-x-2">
                                        <span className="text-gray-300 font-medium">Type:</span>
                                        <span className="text-white font-semibold bg-emerald-500/20 px-2 py-1 rounded text-sm">
                                            {ex.type}
                                        </span>
                                    </div>

                                    <div className="flex items-center space-x-2">
                                        <span className="text-gray-300 font-medium">Date:</span>
                                        <span className="text-gray-200">
                                            {new Date(ex.date).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>

                                <div className="mt-4">
                                    <span className="text-gray-300 font-medium block mb-2">Note:</span>
                                    <p className="text-gray-200 bg-slate-800/50 p-3 rounded-md border-l-4 border-emerald-400">
                                        {ex.note}
                                    </p>
                                </div>
                            </div>
                        )) : <p className="text-center text-gray-400">No income records</p>}
                    </div>

                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold text-red-400 text-center">Expense: -${outgoingamount}</h2>
                        {outgoing.length > 0 ? outgoing.map((ex, index) => (
                            <div
                                key={index}
                                className="bg-slate-700/50 rounded-lg p-6 hover:bg-slate-700/70 transition-colors duration-200"
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <span className="bg-red-500/20 text-red-400 text-sm font-medium px-3 py-1 rounded-full">
                                        #{index + 1}
                                    </span>
                                    <span className="text-2xl font-bold text-red-400">
                                        -${ex.amount}
                                    </span>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="flex items-center space-x-2">
                                        <span className="text-gray-300 font-medium">Type:</span>
                                        <span className="text-white font-semibold bg-red-500/20 px-2 py-1 rounded text-sm">
                                            {ex.type}
                                        </span>
                                    </div>

                                    <div className="flex items-center space-x-2">
                                        <span className="text-gray-300 font-medium">Date:</span>
                                        <span className="text-gray-200">
                                            {new Date(ex.date).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>

                                <div className="mt-4">
                                    <span className="text-gray-300 font-medium block mb-2">Note:</span>
                                    <p className="text-gray-200 bg-slate-800/50 p-3 rounded-md border-l-4 border-red-400">
                                        {ex.note}
                                    </p>
                                </div>
                            </div>
                        )) : <p className="text-center text-gray-400">No expense records</p>}
                    </div>
                </div>
            ) : (
                <p className='flex justify-center items-center text-red-400 font-bold mt-10'>{backendError} for {filter}</p>
            )}

            {expense.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-gray-400 text-lg">No expenses found</p>
                </div>
            )}
        </div>
    )
}

export default Expensedetail