import React from 'react'
import { Navigate } from 'react-router-dom'

function ProtectedRoute({ children }: { children: JSX.Element }) {
  const isAuthenticated = localStorage.getItem('auth') === 'true'
  return isAuthenticated ? children : <Navigate to="/" />
}

export default ProtectedRoute
