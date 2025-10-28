import React, { createContext, useContext, useState, useCallback } from 'react'
import Cookies from 'universal-cookie'
import { authAPI } from '../../api/api'

const AuthContext = createContext()
const cookies = new Cookies()

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      // Try cookies first
      let storedUser = cookies.get('user')
      
      // Fallback to localStorage
      if (!storedUser || storedUser === 'undefined') {
        storedUser = localStorage.getItem('user')
      }
      
      if (storedUser && storedUser !== 'undefined' && typeof storedUser === 'string') {
        const parsed = JSON.parse(storedUser)
        console.log('✅ User loaded from storage:', parsed)
        return parsed
      }
      return null
    } catch (err) {
      console.error('❌ Failed to parse stored user:', err)
      return null
    }
  })
  
  const [token, setToken] = useState(() => {
    // Try cookies first
    let storedToken = cookies.get('token')
    
    // Fallback to localStorage
    if (!storedToken || storedToken === 'undefined') {
      storedToken = localStorage.getItem('token')
    }
    
    const isValid = storedToken && storedToken !== 'undefined' && storedToken !== 'null'
    console.log('🔑 Token loaded from storage:', isValid ? '✅ Valid' : '❌ Invalid')
    return isValid ? storedToken : null
  })
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Extract role from user object - try multiple field names
  const extractRole = (userData) => {
    if (!userData) return null
    
    // Try common role field names (supports: admin, superadmin, moderator, cashier)
    let roleValue = 
      userData.role || 
      userData.user_role || 
      userData.userRole || 
      userData.type || 
      userData.user_type || 
      userData.role ||
      null
    
    // Normalize role value
    if (roleValue) {
      roleValue = roleValue.toLowerCase().trim()
    }
    
    console.log('🎯 Extracted role:', roleValue, 'from user data:', userData)
    return roleValue
  }

  const [role, setRole] = useState(() => {
    return extractRole(user)
  })

  const setAuthData = (userData, tokenData) => {
    console.log('🔐 Setting Auth Data...', { userData, tokenData })
    
    // Validate data before saving
    if (!tokenData || tokenData === 'undefined') {
      console.error('❌ Token is undefined or invalid:', tokenData)
      return false
    }
    
    if (!userData || userData === 'undefined') {
      console.error('❌ User data is undefined or invalid:', userData)
      return false
    }

    console.log('✅ Validation passed, saving data to state...')
    
    // Save to state
    setUser(userData)
    console.log('✅ User state updated')
    
    const extractedRole = extractRole(userData)
    setRole(extractedRole)
    console.log('📝 Role set to:', extractedRole)
    
    setToken(tokenData)
    console.log('🔑 Token state updated')

    // Save to cookies
    try {
      cookies.set('user', JSON.stringify(userData), { path: '/', maxAge: 86400 * 7 })
      console.log('✅ User saved to cookies')
      cookies.set('token', tokenData, { path: '/', maxAge: 86400 * 7 })
      console.log('✅ Token saved to cookies')
    } catch (err) {
      console.error('⚠️ Error saving to cookies:', err)
    }

    // Backup to localStorage
    try {
      localStorage.setItem('user', JSON.stringify(userData))
      console.log('✅ User saved to localStorage')
      localStorage.setItem('token', tokenData)
      console.log('✅ Token saved to localStorage')
    } catch (err) {
      console.error('⚠️ Error saving to localStorage:', err)
    }

    console.log('✅✅✅ Auth data saved successfully')
    return true
  }

  // LOGIN
  const login = async (email, password) => {
    setLoading(true)
    setError(null)
    try {
      console.log('🔐 Attempting login with email:', email)
      const res = await authAPI.login(email, password)
      console.log('📡 Full Login API Response:', res)
      console.log('📡 Response data:', res.data)
      console.log('📡 Response status:', res.status)
      
      // Try multiple paths for token and user data
      let tokenData = null
      let userData = null

      // Try common token field names
      tokenData = 
        res.data?.data?.auth_token || 
        res.data?.data?.token || 
        res.data?.auth_token || 
        res.data?.token
      
      // Try common user field names
      userData = 
        res.data?.data?.user || 
        res.data?.user || 
        res.data?.data

      console.log('🔍 Extracted Data:', { tokenData, userData })
      console.log('✅ Token extracted:', tokenData ? 'YES' : 'NO - PROBLEM!')
      console.log('✅ User extracted:', userData ? 'YES' : 'NO - PROBLEM!')

      if (!tokenData) {
        console.error('❌ CRITICAL: No token found in any expected location')
        console.error('   Response structure:', JSON.stringify(res.data, null, 2))
        throw new Error('No token received from API')
      }
      if (!userData) {
        console.error('❌ CRITICAL: No user data found in any expected location')
        console.error('   Response structure:', JSON.stringify(res.data, null, 2))
        throw new Error('No user data received from API')
      }

      console.log('✅ All data extracted successfully, calling setAuthData...')
      const saved = setAuthData(userData, tokenData)
      console.log('✅ setAuthData returned:', saved)
      
      // 🔥 IMPORTANT: Fetch full profile immediately to get role
      console.log('🔄 Fetching full profile to extract role...')
      try {
        const profileRes = await authAPI.getProfile()
        const fullUserData = profileRes.data?.data || profileRes.data
        console.log('✅ Profile fetched successfully:', fullUserData)
        
        if (fullUserData) {
          const extractedRole = extractRole(fullUserData)
          console.log('🎯 Role extracted from profile:', extractedRole)
          
          // Update user and role with full profile data
          setUser(fullUserData)
          setRole(extractedRole)
          
          // Save updated data
          try {
            localStorage.setItem('user', JSON.stringify(fullUserData))
            cookies.set('user', JSON.stringify(fullUserData), { path: '/', maxAge: 86400 * 7 })
          } catch (err) {
            console.error('⚠️ Error saving profile data:', err)
          }
        }
      } catch (profileErr) {
        console.warn('⚠️ Could not fetch profile immediately (might not be critical):', profileErr.message)
      }
      
      return res.data
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Login failed'
      console.error('❌ Login Error:', errorMsg)
      console.error('❌ Full error object:', err)
      setError(errorMsg)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // REGISTER
  const register = async (formData) => {
    setLoading(true)
    setError(null)
    try {
      console.log('🔐 Starting registration process...')
      const res = await authAPI.register(formData)
      console.log('✅ Register API Response received:', res.data)
      
      // Try multiple paths for token and user data
      let tokenData = null
      let userData = null

      // Try common token field names
      tokenData = 
        res.data?.data?.auth_token || 
        res.data?.data?.token || 
        res.data?.auth_token || 
        res.data?.token
      
      // Try common user field names
      userData = 
        res.data?.data?.user || 
        res.data?.user || 
        res.data?.data

      console.log('🔍 Extracted Data:', { tokenData: !!tokenData, userData: !!userData })

      if (!tokenData) {
        console.error('❌ CRITICAL: No token found in response')
        throw new Error('No token received from API')
      }
      if (!userData) {
        console.error('❌ CRITICAL: No user data found in response')
        throw new Error('No user data received from API')
      }

      console.log('✅ All data validated, saving to storage...')
      setAuthData(userData, tokenData)
      console.log('✅✅ Registration completed successfully!')
      return res.data
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Registration failed'
      console.error('❌ Register Error:', errorMsg)
      console.error('📋 Full error:', err.response?.data || err)
      setError(errorMsg)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // PROFILE DATA
  const profileData = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await authAPI.getProfile()
      const userData = res.data.data
      
      if (userData) {
        setUser(userData)
        const extractedRole = extractRole(userData)
        setRole(extractedRole)
        console.log('📝 Profile role updated to:', extractedRole)
        
        // Save to both cookies and localStorage
        localStorage.setItem('user', JSON.stringify(userData))
        cookies.set('user', JSON.stringify(userData), { path: '/', maxAge: 86400 * 7 })
        
        console.log('✅ Profile data updated:', userData)
      }
      
      return userData
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Profile fetch failed'
      setError(errorMsg)
      console.error('❌ Profile fetch failed:', err)
    } finally {
      setLoading(false)
    }
  }

  // LOGOUT
  const logout = async () => {
    setLoading(true)
    try {
      await authAPI.logout()
    } catch (err) {
      console.error('❌ Logout error:', err)
    } finally {
      setUser(null)
      setRole(null)
      setToken(null)
      
      // Clear cookies
      cookies.remove('user', { path: '/' })
      cookies.remove('token', { path: '/' })
      
      // Clear localStorage
      localStorage.removeItem('user')
      localStorage.removeItem('token')
      
      console.log('✅ Auth data cleared')
      setLoading(false)
    }
  }

  // SEND VERIFICATION CODE
  const sendVerificationCode = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await authAPI.sendVerificationCode()
      return res.data
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to send verification code'
      setError(errorMsg)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // VERIFY EMAIL
  const verifyEmail = async (code) => {
    setLoading(true)
    setError(null)
    try {
      const res = await authAPI.verifyEmail(code)
      return res.data
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Email verification failed'
      setError(errorMsg)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // FORGOT PASSWORD
  const forgotPassword = async (email) => {
    setLoading(true)
    setError(null)
    try {
      const res = await authAPI.forgotPassword(email)
      return res.data
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to send reset link'
      setError(errorMsg)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // RESET PASSWORD
  const resetPassword = async (email, otp, password, re_password) => {
    setLoading(true)
    setError(null)
    try {
      const res = await authAPI.resetPassword(email, otp, password, re_password)
      return res.data
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Password reset failed'
      setError(errorMsg)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // DELETE ACCOUNT
  const deleteAccount = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await authAPI.deleteAccount()
      logout()
      return res.data
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to delete account'
      setError(errorMsg)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        token,
        loading,
        error,
        login,
        logout,
        register,
        profileData,
        sendVerificationCode,
        verifyEmail,
        forgotPassword,
        resetPassword,
        deleteAccount,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
export { AuthProvider }
export default AuthProvider