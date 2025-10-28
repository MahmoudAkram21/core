import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../../../context/AuthContext'

/**
 * ProtectedRoute component
 * @param {ReactNode} children - the protected component to render
 * @param {string[]} roles - optional array of roles that can access this route
 */
const ProtectedRoute = ({ children, roles }) => {
  const { user, role, token } = useAuth()

  // if not logged in, redirect to login
  if (!token) {
    return <Navigate to="/login" replace />
  }

  // if roles are specified and user's role not allowed
  if (roles && !roles.includes(role)) {
    return <Navigate to="/unauthorized" replace />
  }

  return children
}

export default ProtectedRoute
