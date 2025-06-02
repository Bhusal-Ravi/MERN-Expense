import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

function Login() {
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [backendError, setBackendError] = useState('');



    const createAccount = () => {
        navigate('/register')
    }

    const onSubmit = async (data) => {
        setBackendError('')
        try {
            const response = await fetch('http://localhost:5001/api/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })

            const result = await response.json();

            if (!response.ok) {
                setBackendError(result.message)
            } else {
                console.log('Login Success', result)
                console.log(result.token)
                localStorage.setItem('token', result.token)
                navigate('/home')
            }








        } catch (error) {
            console.error('Request Failed', error)
        }

        console.log('Form Data:', data);
    };

    return (
        <div className='flex flex-col items-center justify-center h-screen'>
            <h1>LOGIN</h1>
            <form onSubmit={handleSubmit(onSubmit)} className="p-4 max-w-sm mx-auto flex flex-col">
                <div className="mb-4">
                    <label className="block mb-1">Username</label>
                    <input
                        {...register('username', { required: 'Username is required' })}
                        className="w-full border px-3 py-2 rounded"
                    />
                    {errors.username && <p className="text-red-500 text-sm">{errors.username.message}</p>}
                </div>

                <div className="mb-4">
                    <label className="block mb-1">Password</label>
                    <input
                        type="password"
                        {...register('password', { required: 'Password is required' })}
                        className="w-full border px-3 py-2 rounded"
                    />
                    {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
                </div>
                {backendError && <p className='text-red-500 mt-2 mb-4 font-bold'>{backendError}</p>}

                <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    Login
                </button>
            </form>
            <button className='text-blue-500 cursor-pointer hover:text-blue-600' onClick={createAccount}>
                Create a Account ?
            </button>
        </div>
    );
}

export default Login;