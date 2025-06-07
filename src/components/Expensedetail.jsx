import React, { useEffect, useState } from 'react'
import ExpenseCharts from './ExpenseCharts'

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
        <div className="p-6 bg-gray-50 min-h-screen">

            <div className='flex justify-center items-center flex-col'>
                <h1 className="text-2xl font-bold text-center mb-8 text-gray-800">Expense Details</h1>
                {expense.length >0 &&
                <ExpenseCharts  expense={expense}/>
            }
                <div className='flex flex-row justify-center items-center'>
                    <p className={`${result < 0 ? "bg-red-400 text-black font-semibold" : "bg-green-400 text-black font-semibold"} rounded-xl p-3 mb-5`}>NetBalance : {result > 0 && (<>+</>)}{result}$</p>
                    <select
                        className="flex justify-center mb-6 space-x-2 flex-wrap ml-10"
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
            </div>

            {expenseStatus ? (
                <div className="w-full md:max-w-6xl md:mx-auto flex flex-col md:flex-row space-y-6 md:space-y-0 md:space-x-6">


                    <div className="w-full md:w-1/2 space-y-4">
                        <h2 className="text-xl font-semibold mb-4 text-green-600 text-center">Income: +${incomeamount}</h2>
                        {income.length > 0 ? income.map((ex, index) => (
                            <div
                                key={index}
                                className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow duration-200"
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                                        #{index + 1}
                                    </span>
                                    <span className="text-2xl font-bold text-green-600">
                                        +${ex.amount}
                                    </span>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="flex items-center space-x-2">
                                        <span className="text-gray-500 font-medium">Type:</span>
                                        <span className="text-black font-semibold bg-green-400 px-2 py-1 rounded text-sm">
                                            {ex.type}
                                        </span>
                                    </div>

                                    <div className="flex items-center space-x-2">
                                        <span className="text-gray-500 font-medium">Date:</span>
                                        <span className="text-gray-700">
                                            {new Date(ex.date).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>

                                <div className="mt-4">
                                    <span className="text-gray-500 font-medium block mb-2">Note:</span>
                                    <p className="text-gray-700 bg-gray-50 p-3 rounded-md border-l-4 border-green-400">
                                        {ex.note}
                                    </p>
                                </div>
                            </div>
                        )) : <p className="text-center text-gray-500">No income records</p>}
                    </div>


                    <div className="w-full md:w-1/2 space-y-4">
                        <h2 className="text-xl font-semibold mb-4 text-red-600 text-center">Expense: -${outgoingamount}</h2>
                        {outgoing.length > 0 ? outgoing.map((ex, index) => (
                            <div
                                key={index}
                                className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow duration-200"
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                                        #{index + 1}
                                    </span>
                                    <span className="text-2xl font-bold text-red-600">
                                        -${ex.amount}
                                    </span>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="flex items-center space-x-2">
                                        <span className="text-gray-500 font-medium">Type:</span>
                                        <span className="text-black font-semibold bg-red-400 px-2 py-1 rounded text-sm">
                                            {ex.type}
                                        </span>
                                    </div>

                                    <div className="flex items-center space-x-2">
                                        <span className="text-gray-500 font-medium">Date:</span>
                                        <span className="text-gray-700">
                                            {new Date(ex.date).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>

                                <div className="mt-4">
                                    <span className="text-gray-500 font-medium block mb-2">Note:</span>
                                    <p className="text-gray-700 bg-gray-50 p-3 rounded-md border-l-4 border-red-400">
                                        {ex.note}
                                    </p>
                                </div>
                            </div>
                        )) : <p className="text-center text-gray-500">No expense records</p>}
                    </div>
                </div>
            ) : (<p className='flex justify-center items-center text-red-800 font-bold mt-10'>{backendError} for {filter}</p>)}

            {expense.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-gray-500 text-lg">No expenses found</p>
                </div>
            )}
        </div>
    )
}

export default Expensedetail
