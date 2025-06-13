import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { LogIn, UserPlus } from 'lucide-react';

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
    };

    return (
        <div className="min-h-screen bg-[#0f172a] relative overflow-hidden flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAzNGMwLTIuMjA5IDEuNzkxLTQgNC00czQgMS43OTEgNCA0LTEuNzkxIDQtNCA0LTQtMS43OTEtNC00eiIgZmlsbD0iIzEwYjk4MSIgZmlsbC1vcGFjaXR5PSIuMDUiLz48L2c+PC9zdmc+')] opacity-20"></div>
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900/50 via-slate-800/50 to-slate-900/50"></div>
            
            <div className="relative w-full max-w-md">
                <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl shadow-xl border border-slate-700/50 p-8">
                    <h1 className="text-3xl font-bold text-center text-emerald-400 mb-8">Welcome Back</h1>
                    
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-300">Username</label>
                            <input
                                {...register('username', { required: 'Username is required' })}
                                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors"
                                placeholder="Enter your username"
                            />
                            {errors.username && (
                                <p className="text-red-400 text-sm mt-1">{errors.username.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-300">Password</label>
                            <input
                                type="password"
                                {...register('password', { required: 'Password is required' })}
                                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors"
                                placeholder="Enter your password"
                            />
                            {errors.password && (
                                <p className="text-red-400 text-sm mt-1">{errors.password.message}</p>
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
                            <LogIn className="w-5 h-5" />
                            <span>Login</span>
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <button 
                            onClick={createAccount}
                            className="inline-flex items-center space-x-2 text-emerald-400 hover:text-emerald-300 transition-colors"
                        >
                            <UserPlus className="w-4 h-4" />
                            <span>Create an Account</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;