import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import Expense from './Expense';
import Expensedetail from './Expensedetail';
import Navbar from './Navbar';
import UserContext from './context/context';

function Home() {
    const [user, setUser] = useState(null)
    const [refreshExpenses, setRefreshExpenses] = useState(0)

    useEffect(() => {
        async function getUserProfile() {
            try {
                const response = await fetch('https://mern-expense-s15g.onrender.com/api/users/current', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });

                const result = await response.json();
                if (!response.ok) {
                    setStatus(401);
                    throw new Error(result.message || "Failed to fetch Data")
                }
                setUser(result)
                console.log('User data', result)
            } catch (error) {
                console.error('Error fetching user:', error);
            }
        }

        getUserProfile();
    }, []);

    function handleExpenseAdded() {
        setRefreshExpenses(prev => prev + 1);
    }

    return (
        <UserContext.Provider value={user}>
            <div className="min-h-screen bg-[#0f172a] relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAzNGMwLTIuMjA5IDEuNzkxLTQgNC00czQgMS43OTEgNCA0LTEuNzkxIDQtNCA0LTQtMS43OTEtNC00eiIgZmlsbD0iIzEwYjk4MSIgZmlsbC1vcGFjaXR5PSIuMDUiLz48L2c+PC9zdmc+')] opacity-20"></div>
                <div className="absolute inset-0 bg-gradient-to-br from-slate-900/50 via-slate-800/50 to-slate-900/50"></div>
                <div className="relative">
                    <Navbar />
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        <div className="space-y-8">
                            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl shadow-xl border border-slate-700/50">
                                <Expense onExpenseAdded={handleExpenseAdded} />
                            </div>
                            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl shadow-xl border border-slate-700/50">
                                <Expensedetail refreshTrigger={refreshExpenses} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </UserContext.Provider>
    )
}

export default Home
