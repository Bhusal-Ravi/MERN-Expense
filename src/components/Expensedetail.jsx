import React, { useEffect, useState } from 'react'

function Expensedetail({ refreshTrigger }) {
    const [expenseStatus, setExpenseStatus] = useState(false)
    const [expense, setExpense] = useState([])

    async function getExpense() {
        try {
            const response = await fetch('http://localhost:5001/api/users/getexpense', {
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
            } else {
                setExpenseStatus(false)
            }

        } catch (error) {
            console.error('Error fetching user:', error);
        }
    }

    useEffect(() => {
        getExpense();
    }, [refreshTrigger])


    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <h1 className="text-2xl font-bold text-center mb-8 text-gray-800">Expense Details</h1>

            <div className="max-w-4xl mx-auto space-y-4">
                {expense.map((ex, index) => (
                    <div
                        key={index}
                        className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow duration-200"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                                #{index + 1}
                            </span>
                            <span className="text-2xl font-bold text-green-600">
                                ${ex.amount}
                            </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex items-center space-x-2">
                                <span className="text-gray-500 font-medium">Category:</span>
                                <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-sm">
                                    {ex.category}
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
                            <p className="text-gray-700 bg-gray-50 p-3 rounded-md border-l-4 border-blue-400">
                                {ex.note}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {expense.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-gray-500 text-lg">No expenses found</p>
                </div>
            )}
        </div>
    )
}

export default Expensedetail