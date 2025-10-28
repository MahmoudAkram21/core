import React, { useState } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CAlert,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CSpinner,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilTrash } from '@coreui/icons'
import { useAuth } from '../../../Context/AuthContext'
import { useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'

const AccountSettings = () => {
  const { user, deleteAccount, loading, logout } = useAuth()
  const navigate = useNavigate()
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [password, setPassword] = useState('')

  // Redirect if not authenticated
  React.useEffect(() => {
    if (!user) {
      navigate('/login')
    }
  }, [user, navigate])

  const handleDeleteAccount = async () => {
    if (!password) {
      Swal.fire('Error', 'Please enter your password', 'error')
      return
    }

    try {
      await deleteAccount()
      Swal.fire('Success', 'Your account has been deleted', 'success')
      navigate('/login')
    } catch (err) {
      Swal.fire('Error', 'Failed to delete account', 'error')
    } finally {
      setShowDeleteModal(false)
      setPassword('')
    }
  }

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  if (!user) {
    return null
  }

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Account Settings</strong>
          </CCardHeader>
          <CCardBody>
            {/* User Information */}
            <div className="mb-4">
              <h5>Profile Information</h5>
              <table className="table">
                <tbody>
                  <tr>
                    <td>
                      <strong>Name:</strong>
                    </td>
                    <td>{user.name}</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Email:</strong>
                    </td>
                    <td>{user.email}</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Role:</strong>
                    </td>
                    <td>
                      <span className="badge bg-info">{user.role}</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <hr />

            {/* Account Actions */}
            <div className="mb-4">
              <h5>Account Actions</h5>
              <div className="d-flex gap-2">
                <CButton
                  color="warning"
                  onClick={handleLogout}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <CSpinner size="sm" className="me-2" />
                      Logging out...
                    </>
                  ) : (
                    'Logout'
                  )}
                </CButton>
              </div>
            </div>

            <hr />

            {/* Danger Zone */}
            <div>
              <h5 className="text-danger">Danger Zone</h5>
              <CAlert color="warning" className="mb-3">
                <strong>Warning:</strong> Deleting your account is permanent
                and cannot be undone. All your data will be deleted.
              </CAlert>
              <CButton
                color="danger"
                onClick={() => setShowDeleteModal(true)}
              >
                <CIcon icon={cilTrash} className="me-2" />
                Delete Account
              </CButton>
            </div>
          </CCardBody>
        </CCard>
      </CCol>

      {/* Delete Account Modal */}
      <CModal
        visible={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
      >
        <CModalHeader>
          <CModalTitle>Confirm Account Deletion</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CAlert color="danger">
            This action cannot be undone. All your data will be permanently
            deleted.
          </CAlert>
          <p>Are you sure you want to delete your account?</p>
          <p>
            <input
              type="password"
              className="form-control"
              placeholder="Enter your password to confirm"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </p>
        </CModalBody>
        <CModalFooter>
          <CButton
            color="secondary"
            onClick={() => setShowDeleteModal(false)}
            disabled={loading}
          >
            Cancel
          </CButton>
          <CButton
            color="danger"
            onClick={handleDeleteAccount}
            disabled={loading || !password}
          >
            {loading ? (
              <>
                <CSpinner size="sm" className="me-2" />
                Deleting...
              </>
            ) : (
              'Delete Account'
            )}
          </CButton>
        </CModalFooter>
      </CModal>
    </CRow>
  )
}

export default AccountSettings