import React, { useState } from 'react';
import { useForm, } from 'react-hook-form';

function Expense({ onExpenseAdded }) {
    const [backendError, setBackendError] = useState('')
    const { register, handleSubmit, formState: { errors }, reset } = useForm();

    async function onSubmit(data) {
        try {
            const response = await fetch('http://localhost:5001/api/users/registerexpense', {
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
            }

            else {
                setBackendError(result.message || 'Failed to save expense');
            }
        } catch (error) {
            console.error('Error fetching user:', error);
        }


    };

    return (
        <div>
            <div className='flex flex-col items-center justify-center mt-10'>
                <h1 className='text-xl font-bold mb-4'>Add Expense</h1>
                <form onSubmit={handleSubmit(onSubmit)} className="p-4 max-w-sm mx-auto flex flex-col">

                    <div className="mb-4">
                        <label className="block mb-1">Amount</label>
                        <input
                            type="number"
                            {...register('amount', { required: 'Amount is required' })}
                            className="w-full border px-3 py-2 rounded"
                        />
                        {errors.amount && <p className="text-red-500 text-sm">{errors.amount.message}</p>}
                    </div>


                    <div className="mb-4">
                        <label className="block mb-1">Category</label>
                        <input
                            {...register('category', { required: 'Category is required' })}
                            className="w-full border px-3 py-2 rounded"
                        />
                        {errors.category && <p className="text-red-500 text-sm">{errors.category.message}</p>}
                    </div>


                    <div className="mb-4">
                        <label className="block mb-1">Note</label>
                        <textarea
                            {...register('note', { required: 'Note is required' })}
                            className="w-full border px-3 py-2 rounded"
                            rows={3}
                        />
                        {errors.note && <p className="text-red-500 text-sm">{errors.note.message}</p>}
                    </div>
                    {backendError && (
                        <div className="text-red-500 text-sm mb-4">
                            {backendError}
                        </div>
                    )}
                    <button
                        type="submit"
                        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                    >
                        Save Expense
                    </button>
                </form>
            </div>



        </div>
    );
}

export default Expense;
