import React, { useState } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CRow,
  CAlert,
  CSpinner,
} from '@coreui/react'
import { useAuth } from '../../../Context/AuthContext'
import { useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'

const ForgotPassword = () => {
  const [email, setEmail] = useState('')
  const { forgotPassword, loading, error } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await forgotPassword(email)
      Swal.fire('Success', 'Check your email for reset instructions', 'success')
      navigate('/login')
    } catch (err) {
      Swal.fire('Error', error || 'Failed to send reset link', 'error')
    }
  }

  return (
    <div className="bg-body-secondary min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={8}>
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <CForm onSubmit={handleSubmit}>
                    <h1>Forgot Password</h1>
                    <p className="text-body-secondary">
                      Enter your email to receive password reset instructions
                    </p>

                    {error && <CAlert color="danger">{error}</CAlert>}

                    <div className="mb-3">
                      <CFormInput
                        placeholder="Email"
                        autoComplete="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>

                    <CRow>
                      <CCol xs={6}>
                        <CButton
                          color="primary"
                          className="px-4"
                          disabled={loading}
                          type="submit"
                        >
                          {loading ? (
                            <>
                              <CSpinner size="sm" className="me-2" />
                              Sending...
                            </>
                          ) : (
                            'Send Reset Link'
                          )}
                        </CButton>
                      </CCol>
                      <CCol xs={6} className="text-end">
                        <CButton
                          color="link"
                          className="px-0"
                          onClick={() => navigate('/login')}
                        >
                          Back to Login
                        </CButton>
                      </CCol>
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default ForgotPassword