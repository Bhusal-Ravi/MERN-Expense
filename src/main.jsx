import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import Home from './components/Home.jsx'
import Login from './components/Login.jsx'
import Register from './components/Register.jsx'

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <div>Page not found</div>,
    children: [
      {
        path: "/home",
        element: <Home />
      },
      {
        path: "/",
        element: <Login />
      },
      {
        path: "/register",
        element: <Register />
      }
    ]

  }
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
