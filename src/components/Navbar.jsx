import React, { useContext, useEffect, useState } from 'react'
import UserContext from './context/context'
import { useNavigate } from 'react-router-dom';
import { CircleUserRound, CalendarHeart, CircleDollarSign, Menu, X } from 'lucide-react';

function Navbar() {
    const user = useContext(UserContext);
    const [year, setYear] = useState('')
    const [month, setMonth] = useState('')
    const [date, setDate] = useState('')
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const now = new Date();
        setYear(now.getFullYear())
        setMonth(now.getMonth() + 1);
        setDate(now.getDate())
    }, [])

    function handleLogout() {
        localStorage.removeItem('token')
        navigate('/')
    }

    return (
        <nav className="bg-gradient-to-r from-slate-800 to-slate-900 text-white shadow-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo and Title */}
                    <div className="flex items-center space-x-3">
                        <CircleDollarSign className="h-8 w-8 text-emerald-400" />
                        <h1 className="text-2xl font-bold text-emerald-400">Expense Manager</h1>
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="text-gray-300 hover:text-white focus:outline-none"
                        >
                            {isMenuOpen ? (
                                <X className="h-6 w-6" />
                            ) : (
                                <Menu className="h-6 w-6" />
                            )}
                        </button>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex md:items-center md:space-x-8">
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2">
                                <CircleUserRound className="h-5 w-5 text-emerald-400" />
                                <span className="text-sm font-medium bg-slate-700 px-3 py-1 rounded-full">
                                    {user?.username}
                                </span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <CalendarHeart className="h-5 w-5 text-emerald-400" />
                                <span className="text-sm font-medium bg-slate-700 px-3 py-1 rounded-full">
                                    {year}/{month}/{date}
                                </span>
                            </div>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Navigation */}
            {isMenuOpen && (
                <div className="md:hidden">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        <div className="flex flex-col space-y-4 p-4 bg-slate-800 rounded-lg">
                            <div className="flex items-center space-x-2">
                                <CircleUserRound className="h-5 w-5 text-emerald-400" />
                                <span className="text-sm font-medium bg-slate-700 px-3 py-1 rounded-full">
                                    {user?.username}
                                </span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <CalendarHeart className="h-5 w-5 text-emerald-400" />
                                <span className="text-sm font-medium bg-slate-700 px-3 py-1 rounded-full">
                                    {year}/{month}/{date}
                                </span>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    )
}

export default Navbar