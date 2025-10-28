import React, { useState, useEffect } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CForm,
  CFormInput,
  CFormTextarea,
  CFormSelect,
  CButton,
  CCol,
  CRow,
  CSpinner,
  CAlert,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilArrowLeft } from '@coreui/icons'
import { useCategories } from '../../hooks/useCategories'
import Swal from 'sweetalert2'

const CategoryForm = ({ categoryId, onClose }) => {
  const { loading, error, fetchCategory, createCategory, updateCategory } =
    useCategories()

  const [formData, setFormData] = useState({
    name_ar: '',
    name_en: '',
    description_ar: '',
    description_en: '',
    status: 'active',
    image: null,
  })

  const [imagePreview, setImagePreview] = useState(null)
  const [submitError, setSubmitError] = useState(null)

  useEffect(() => {
    if (categoryId) {
      loadCategory()
    }
  }, [categoryId])

  const loadCategory = async () => {
    try {
      const category = await fetchCategory(categoryId)
      setFormData({
        name_ar: category.name_ar || '',
        name_en: category.name_en || '',
        description_ar: category.description_ar || '',
        description_en: category.description_en || '',
        status: category.status || 'active',
        image: null,
      })
      if (category.image) {
        setImagePreview(category.image)
      }
    } catch (err) {
      setSubmitError('Failed to load category')
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setFormData((prev) => ({
        ...prev,
        image: file,
      }))
      const reader = new FileReader()
      reader.onload = (event) => {
        setImagePreview(event.target.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitError(null)

    try {
      // Validate required fields
      if (!formData.name_ar || !formData.name_en) {
        setSubmitError('Name in both languages is required')
        return
      }

      const submitFormData = new FormData()
      submitFormData.append('name_ar', formData.name_ar)
      submitFormData.append('name_en', formData.name_en)
      submitFormData.append('description_ar', formData.description_ar)
      submitFormData.append('description_en', formData.description_en)
      submitFormData.append('status', formData.status)

      if (formData.image) {
        submitFormData.append('image', formData.image)
      }

      if (categoryId) {
        await updateCategory(categoryId, submitFormData)
        Swal.fire('Success', 'Category updated successfully', 'success')
      } else {
        await createCategory(submitFormData)
        Swal.fire('Success', 'Category created successfully', 'success')
      }

      onClose()
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || 'An error occurred. Please try again.'
      setSubmitError(errorMsg)
      Swal.fire('Error', errorMsg, 'error')
    }
  }

  return (
    <CRow>
      <CCol xs={12}>
        <CCard>
          <CCardHeader>
            <CButton
              color="secondary"
              size="sm"
              onClick={onClose}
              className="me-2"
            >
              <CIcon icon={cilArrowLeft} /> Back
            </CButton>
            <strong>{categoryId ? 'Edit' : 'Add'} Category</strong>
          </CCardHeader>
          <CCardBody>
            {loading && (
              <div className="text-center py-5">
                <CSpinner color="primary" />
              </div>
            )}

            {!loading && (
              <>
                {(submitError || error) && (
                  <CAlert color="danger" className="mb-3">
                    {submitError || error}
                  </CAlert>
                )}

                <CForm onSubmit={handleSubmit}>
                  <CRow className="mb-3">
                    <CCol md={6}>
                      <label className="form-label">Name (Arabic) *</label>
                      <CFormInput
                        name="name_ar"
                        value={formData.name_ar}
                        onChange={handleInputChange}
                        placeholder="اسم الفئة"
                        required
                      />
                    </CCol>
                    <CCol md={6}>
                      <label className="form-label">Name (English) *</label>
                      <CFormInput
                        name="name_en"
                        value={formData.name_en}
                        onChange={handleInputChange}
                        placeholder="Category name"
                        required
                      />
                    </CCol>
                  </CRow>

                  <CRow className="mb-3">
                    <CCol md={6}>
                      <label className="form-label">Description (Arabic)</label>
                      <CFormTextarea
                        name="description_ar"
                        value={formData.description_ar}
                        onChange={handleInputChange}
                        placeholder="وصف الفئة"
                        rows="4"
                      />
                    </CCol>
                    <CCol md={6}>
                      <label className="form-label">
                        Description (English)
                      </label>
                      <CFormTextarea
                        name="description_en"
                        value={formData.description_en}
                        onChange={handleInputChange}
                        placeholder="Category description"
                        rows="4"
                      />
                    </CCol>
                  </CRow>

                  <CRow className="mb-3">
                    <CCol md={6}>
                      <label className="form-label">Status</label>
                      <CFormSelect
                        name="status"
                        value={formData.status}
                        onChange={handleInputChange}
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </CFormSelect>
                    </CCol>
                    <CCol md={6}>
                      <label className="form-label">Image</label>
                      <CFormInput
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                      />
                    </CCol>
                  </CRow>

                  {imagePreview && (
                    <CRow className="mb-3">
                      <CCol md={6}>
                        <div>
                          <small>Image Preview:</small>
                          <div className="mt-2">
                            <img
                              src={imagePreview}
                              alt="preview"
                              style={{
                                maxWidth: '100%',
                                maxHeight: '300px',
                                borderRadius: '4px',
                              }}
                            />
                          </div>
                        </div>
                      </CCol>
                    </CRow>
                  )}

                  <CRow>
                    <CCol className="text-end">
                      <CButton
                        color="secondary"
                        onClick={onClose}
                        className="me-2"
                      >
                        Cancel
                      </CButton>
                      <CButton color="primary" type="submit" disabled={loading}>
                        {loading ? (
                          <>
                            <CSpinner size="sm" className="me-2" />
                            Saving...
                          </>
                        ) : categoryId ? (
                          'Update Category'
                        ) : (
                          'Create Category'
                        )}
                      </CButton>
                    </CCol>
                  </CRow>
                </CForm>
              </>
            )}
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default CategoryForm