import React, { useState } from 'react';
import { useForm, } from 'react-hook-form';
import { PlusCircle } from 'lucide-react';

function Expense({ onExpenseAdded }) {
    const [backendError, setBackendError] = useState('')
    const { register, handleSubmit, formState: { errors }, reset } = useForm();

    async function onSubmit(data) {
        try {
            const response = await fetch('https://mern-expense-s15g.onrender.com/api/users/registerexpense', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(data)
            });

            const result = await response.json()
            if (response.ok) {
                console.log('Expense saved successfully:', result);
                setBackendError('');
                reset();
                if (onExpenseAdded) {
                    onExpenseAdded();
                }
            } else {
                setBackendError(result.message || 'Failed to save expense');
            }
        } catch (error) {
            console.error('Error fetching user:', error);
        }
    };

    return (
        <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-xl shadow-lg p-6">
            <div className="flex flex-col items-center justify-center">
                <h1 className="text-2xl font-bold text-emerald-400 mb-6">Add Transaction</h1>
                <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-md space-y-6">
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-300">Amount</label>
                        <input
                            type="number"
                            {...register('amount', { required: 'Amount is required' })}
                            className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors"
                            placeholder="Enter amount"
                        />
                        {errors.amount && (
                            <p className="text-red-400 text-sm mt-1">{errors.amount.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-300">Type</label>
                        <select
                            {...register('type', { required: 'Type is required' })}
                            className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors"
                            defaultValue=""
                        >
                            <option value="" disabled className="bg-slate-700">Select type</option>
                            <option value="income" className="bg-slate-700">Income</option>
                            <option value="expense" className="bg-slate-700">Expense</option>
                        </select>
                        {errors.type && (
                            <p className="text-red-400 text-sm mt-1">{errors.type.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-300">Note</label>
                        <textarea
                            {...register('note', { required: 'Note is required' })}
                            className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors"
                            rows={3}
                            placeholder="Add a note about this transaction"
                        />
                        {errors.note && (
                            <p className="text-red-400 text-sm mt-1">{errors.note.message}</p>
                        )}
                    </div>

                    {backendError && (
                        <div className="text-red-400 text-sm bg-red-900/30 p-3 rounded-lg">
                            {backendError}
                        </div>
                    )}

                    <button
                        type="submit"
                        className="w-full flex items-center justify-center space-x-2 bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-slate-800"
                    >
                        <PlusCircle className="w-5 h-5" />
                        <span>Save Transaction</span>
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Expense;
