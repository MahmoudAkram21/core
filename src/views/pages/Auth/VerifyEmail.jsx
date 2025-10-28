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

const VerifyEmail = () => {
  const [code, setCode] = useState('')
  const { verifyEmail, sendVerificationCode, loading, error, user } = useAuth()
  const navigate = useNavigate()

  // Redirect if not authenticated
  React.useEffect(() => {
    if (!user) {
      navigate('/login')
    }
  }, [user, navigate])

  const handleSendCode = async () => {
    try {
      await sendVerificationCode()
      Swal.fire('Success', 'Verification code sent to your email', 'success')
    } catch (err) {
      Swal.fire('Error', 'Failed to send verification code', 'error')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await verifyEmail(code)
      Swal.fire('Success', 'Email verified successfully', 'success')
      navigate('/dashboard')
    } catch (err) {
      Swal.fire('Error', error || 'Failed to verify email', 'error')
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
                    <h1>Verify Email</h1>
                    <p className="text-body-secondary">
                      Enter the verification code sent to your email
                    </p>

                    {error && <CAlert color="danger">{error}</CAlert>}

                    <div className="mb-3">
                      <CFormInput
                        placeholder="Enter verification code"
                        type="text"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        required
                      />
                    </div>

                    <CRow>
                      <CCol xs={12} className="mb-3">
                        <CButton
                          color="secondary"
                          className="w-100"
                          onClick={handleSendCode}
                          disabled={loading}
                        >
                          {loading ? (
                            <>
                              <CSpinner size="sm" className="me-2" />
                              Sending...
                            </>
                          ) : (
                            'Send Verification Code'
                          )}
                        </CButton>
                      </CCol>
                    </CRow>

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
                              Verifying...
                            </>
                          ) : (
                            'Verify Email'
                          )}
                        </CButton>
                      </CCol>
                      <CCol xs={6} className="text-end">
                        <CButton
                          color="link"
                          className="px-0"
                          onClick={() => navigate('/dashboard')}
                        >
                          Skip
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

export default VerifyEmail