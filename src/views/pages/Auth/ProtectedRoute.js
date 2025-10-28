import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../../../Context/AuthContext'

/**
 * ProtectedRoute component
 * @param {ReactNode} children - the protected component to render
 * @param {string[]} roles - optional array of roles that can access this route
 */
const ProtectedRoute = ({ children, roles }) => {
  const { user, role, token } = useAuth()

  // if not logged in, redirect to login
  if (!token) {
    console.log('🔒 ProtectedRoute: No token found, redirecting to login')
    return <Navigate to="/login" replace />
  }

  // if roles are specified and user's role not allowed
  if (roles && !roles.includes(role)) {
    console.error('🚫 Access Denied!', {
      userRole: role,
      allowedRoles: roles,
      user: user,
      hasRole: !!role,
      roleMatches: role ? roles.includes(role) : 'no role'
    })
    // return <Navigate to="/404" replace />
  }

  console.log('✅ ProtectedRoute: Access granted', { role, allowedRoles: roles })
  return children
}

export default ProtectedRoute
