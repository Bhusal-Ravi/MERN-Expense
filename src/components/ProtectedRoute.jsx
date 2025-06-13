import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';


function ProtectedRoute({ children }) {

    const [isValid, setIsValid] = useState(null);
    const token = localStorage.getItem('token');

    useEffect(() => {
        async function validateToken() {
            if (!token) {
                setIsValid(false);
                return;
            }
            try {
                const response = await fetch('https://mern-expense-s15g.onrender.com/api/users/current', {
                    method: 'GET',
                    headers: {
                        'Content-type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                })

                if (response.ok) {
                    setIsValid(true)
                } else {
                    localStorage.removeItem('token');
                    setIsValid(false);
                }
            } catch (error) {
                console.error('Token validation failed:', error);
                localStorage.removeItem('token');
                setIsValid(false);
            }
        }
        validateToken();
    }, [])

    if (isValid === null) {
        return <p>Loading...</p>;
    }

    if (!isValid) {
        return <Navigate to="/" replace />;
    }
    return (
        <>
            {children}
        </>
    )
}


export default ProtectedRoute
