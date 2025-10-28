import React, { useEffect, useState } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CButton,
  CButtonGroup,
  CCol,
  CRow,
  CSpinner,
  CAlert,
  CForm,
  CFormInput,
  CFormSelect,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilPencil, cilTrash, cilPlus, cilSearch } from '@coreui/icons'
import { useCategories } from '../../hooks/useCategories'
import CategoryForm from './CategoryForm'
import Swal from 'sweetalert2'

const Categories = () => {
  const { categories, loading, error, fetchCategories, deleteCategory } =
    useCategories()
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  useEffect(() => {
    loadCategories()
  }, [])

  const loadCategories = async () => {
    try {
      await fetchCategories(statusFilter || null, searchTerm || null)
    } catch (err) {
      console.error('Error loading categories:', err)
    }
  }

  const handleSearch = (e) => {
    setSearchTerm(e.target.value)
  }

  const handleStatusFilter = (e) => {
    setStatusFilter(e.target.value)
  }

  const handleApplyFilters = async () => {
    try {
      await fetchCategories(statusFilter || null, searchTerm || null)
    } catch (err) {
      console.error('Error filtering categories:', err)
    }
  }

  const handleEdit = (id) => {
    setEditingId(id)
    setShowForm(true)
  }

  const handleAdd = () => {
    setEditingId(null)
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Delete Category',
      text: 'Are you sure you want to delete this category?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel',
    })

    if (result.isConfirmed) {
      try {
        await deleteCategory(id)
        Swal.fire('Deleted', 'Category deleted successfully', 'success')
      } catch (err) {
        Swal.fire('Error', 'Failed to delete category', 'error')
      }
    }
  }

  const handleFormClose = () => {
    setShowForm(false)
    setEditingId(null)
    loadCategories()
  }

  if (showForm) {
    return <CategoryForm categoryId={editingId} onClose={handleFormClose} />
  }

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Categories Management</strong>
          </CCardHeader>
          <CCardBody>
            {/* Search and Filter Section */}
            <CForm className="mb-4">
              <CRow className="mb-3">
                <CCol md={4}>
                  <CFormInput
                    placeholder="Search categories..."
                    value={searchTerm}
                    onChange={handleSearch}
                    type="text"
                  />
                </CCol>
                <CCol md={3}>
                  <CFormSelect
                    value={statusFilter}
                    onChange={handleStatusFilter}
                  >
                    <option value="">All Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </CFormSelect>
                </CCol>
                <CCol md={2}>
                  <CButton
                    color="primary"
                    onClick={handleApplyFilters}
                    className="w-100"
                  >
                    <CIcon icon={cilSearch} /> Search
                  </CButton>
                </CCol>
                <CCol md={3} className="text-end">
                  <CButton color="success" onClick={handleAdd}>
                    <CIcon icon={cilPlus} /> Add Category
                  </CButton>
                </CCol>
              </CRow>
            </CForm>

            {/* Error Alert */}
            {error && (
              <CAlert color="danger" className="mb-3">
                {error}
              </CAlert>
            )}

            {/* Loading State */}
            {loading ? (
              <div className="text-center py-5">
                <CSpinner color="primary" />
              </div>
            ) : (
              <>
                {/* Table */}
                {categories && categories.length > 0 ? (
                  <CTable hover>
                    <CTableHead>
                      <CTableRow>
                        <CTableHeaderCell>ID</CTableHeaderCell>
                        <CTableHeaderCell>Name (AR)</CTableHeaderCell>
                        <CTableHeaderCell>Name (EN)</CTableHeaderCell>
                        <CTableHeaderCell>Status</CTableHeaderCell>
                        <CTableHeaderCell>Image</CTableHeaderCell>
                        <CTableHeaderCell>Actions</CTableHeaderCell>
                      </CTableRow>
                    </CTableHead>
                    <CTableBody>
                      {categories.map((category) => (
                        <CTableRow key={category.id}>
                          <CTableDataCell>{category.id}</CTableDataCell>
                          <CTableDataCell>{category.name_ar}</CTableDataCell>
                          <CTableDataCell>{category.name_en}</CTableDataCell>
                          <CTableDataCell>
                            <span
                              className={`badge bg-${
                                category.status === 'active'
                                  ? 'success'
                                  : 'danger'
                              }`}
                            >
                              {category.status}
                            </span>
                          </CTableDataCell>
                          <CTableDataCell>
                            {category.image ? (
                              <img
                                src={category.image}
                                alt={category.name_en}
                                style={{
                                  width: '50px',
                                  height: '50px',
                                  borderRadius: '4px',
                                }}
                              />
                            ) : (
                              'No image'
                            )}
                          </CTableDataCell>
                          <CTableDataCell>
                            <CButtonGroup>
                              <CButton
                                size="sm"
                                color="warning"
                                onClick={() => handleEdit(category.id)}
                              >
                                <CIcon icon={cilPencil} />
                              </CButton>
                              <CButton
                                size="sm"
                                color="danger"
                                onClick={() => handleDelete(category.id)}
                              >
                                <CIcon icon={cilTrash} />
                              </CButton>
                            </CButtonGroup>
                          </CTableDataCell>
                        </CTableRow>
                      ))}
                    </CTableBody>
                  </CTable>
                ) : (
                  <CAlert color="info">No categories found</CAlert>
                )}
              </>
            )}
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default Categories