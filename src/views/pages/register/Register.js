import React, { useState } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser } from '@coreui/icons'
import { useAuth } from '../../../Context/AuthContext'
import { useNavigate } from 'react-router-dom'
import Cookies from 'universal-cookie'

const Register = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    re_password: '',
  })

  const { register, loading, error: authError } = useAuth()
  const navigate = useNavigate()
  const cookie = new Cookies()
  const [error, setError] = useState(null)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    try {
      await register(form) // calls register() from AuthContext
      setTimeout(() => {
        navigate('/dashboard')
      }, 300)
    } catch (error) {
      console.error(error)
      setError(error.response?.data?.message || 'Registration failed')
    }
  }

  return (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={9} lg={7} xl={6}>
            <CCard className="mx-4">
              <CCardBody className="p-4">
                <CForm onSubmit={handleSubmit}>
                  <h1>Register</h1>
                  <p className="text-body-secondary">Create your account</p>

                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilUser} />
                    </CInputGroupText>
                    <CFormInput
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Name"
                      autoComplete="username"
                    />
                  </CInputGroup>

                  <CInputGroup className="mb-3">
                    <CInputGroupText>@</CInputGroupText>
                    <CFormInput
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="Email"
                      autoComplete="email"
                    />
                  </CInputGroup>

                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilLockLocked} />
                    </CInputGroupText>
                    <CFormInput
                      name="password"
                      type="password"
                      value={form.password}
                      onChange={handleChange}
                      placeholder="Password"
                      autoComplete="new-password"
                    />
                  </CInputGroup>

                  <CInputGroup className="mb-4">
                    <CInputGroupText>
                      <CIcon icon={cilLockLocked} />
                    </CInputGroupText>
                    <CFormInput
                      name="re_password"
                      type="password"
                      value={form.re_password}
                      onChange={handleChange}
                      placeholder="Repeat password"
                      autoComplete="new-password"
                    />
                  </CInputGroup>

                  {error && (
                    <p className="text-danger text-center mb-3">{error}</p>
                  )}

                  <div className="d-grid">
                    <CButton color="success" type="submit" disabled={loading}>
                      {loading ? 'Creating...' : 'Create Account'}
                    </CButton>
                  </div>
                </CForm>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Register
