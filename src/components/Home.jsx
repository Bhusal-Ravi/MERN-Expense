import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';

function Home() {

    const [user, setUser] = useState(null)
    const navigate = useNavigate();
    useEffect(() => {
        async function getUserProfile() {
            try {
                const response = await fetch('http://localhost:5001/api/users/current', {
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

    function handleLogout() {
        localStorage.removeItem('token')
        navigate('/')
    }


    return (
        <div className='p-5 flex flex-col justify-center items-center'>
            <h1 className='flex justify-center font-bold text-xl'>User Info</h1>
            <div className='m-2'>
                <p>CreatedAt: <span className='text-green-600'> {user?.createdAt}</span></p>
                <p>UpdatedAt: <span className='text-green-600'> {user?.updatedAt}</span></p>
                <p>UserName: <span className='text-green-600'> {user?.username}</span></p>
                <p>Id: <span className='text-green-600'> {user?._id}</span></p>
            </div>
            <button className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600' onClick={handleLogout}>Logout</button>
        </div>
    )
}

export default Home