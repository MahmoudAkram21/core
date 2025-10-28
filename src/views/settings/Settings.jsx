import React, { useEffect, useState } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CForm,
  CFormInput,
  CFormLabel,
  CSpinner,
} from '@coreui/react'
import Swal from 'sweetalert2'
import { settingsAPI } from '../../../api/api'

const Settings = () => {
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    free_trail_days: '',
    free_trail_products: '',
    free_trail_cashiers: '',
    free_trail_product_details: '',
    free_trail_clients: '',
  })

  // Fetch settings
  const fetchSettings = async () => {
    setLoading(true)
    try {
      const res = await settingsAPI.get()
      const data = res.data.data || {}
      setFormData({
        free_trail_days: data.free_trail_days || '',
        free_trail_products: data.free_trail_products || '',
        free_trail_cashiers: data.free_trail_cashiers || '',
        free_trail_product_details: data.free_trail_product_details || '',
        free_trail_clients: data.free_trail_clients || '',
      })
    } catch (error) {
      Swal.fire('خطأ', 'فشل في تحميل الإعدادات', 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSettings()
  }, [])

  // Handle form change
  const handleFormChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const formDataToSend = new FormData()
      Object.keys(formData).forEach((key) => {
        formDataToSend.append(key, formData[key])
      })
      await settingsAPI.update(formDataToSend)
      Swal.fire('نجاح', 'تم تحديث الإعدادات بنجاح', 'success')
      fetchSettings()
    } catch (error) {
      Swal.fire('خطأ', error.response?.data?.message || 'حدث خطأ', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <CRow>
      <CCol xs={12} lg={8}>
        <CCard>
          <CCardHeader>
            <span>إعدادات النسخة التجريبية المجانية</span>
          </CCardHeader>
          <CCardBody>
            {loading ? (
              <div className="text-center">
                <CSpinner />
              </div>
            ) : (
              <CForm onSubmit={handleSubmit}>
                <div className="mb-4">
                  <CFormLabel htmlFor="free_trail_days">
                    أيام النسخة التجريبية المجانية
                  </CFormLabel>
                  <CFormInput
                    type="number"
                    id="free_trail_days"
                    name="free_trail_days"
                    value={formData.free_trail_days}
                    onChange={handleFormChange}
                    placeholder="عدد الأيام"
                    required
                  />
                  <small className="text-muted">عدد الأيام المسموحة للنسخة التجريبية</small>
                </div>

                <div className="mb-4">
                  <CFormLabel htmlFor="free_trail_products">
                    عدد المنتجات في النسخة التجريبية
                  </CFormLabel>
                  <CFormInput
                    type="number"
                    id="free_trail_products"
                    name="free_trail_products"
                    value={formData.free_trail_products}
                    onChange={handleFormChange}
                    placeholder="عدد المنتجات"
                    required
                  />
                  <small className="text-muted">العدد الأقصى للمنتجات في النسخة التجريبية</small>
                </div>

                <div className="mb-4">
                  <CFormLabel htmlFor="free_trail_cashiers">
                    عدد أمناء الصندوق في النسخة التجريبية
                  </CFormLabel>
                  <CFormInput
                    type="number"
                    id="free_trail_cashiers"
                    name="free_trail_cashiers"
                    value={formData.free_trail_cashiers}
                    onChange={handleFormChange}
                    placeholder="عدد أمناء الصندوق"
                    required
                  />
                  <small className="text-muted">العدد الأقصى لأمناء الصندوق في النسخة التجريبية</small>
                </div>

                <div className="mb-4">
                  <CFormLabel htmlFor="free_trail_product_details">
                    عدد تفاصيل المنتجات في النسخة التجريبية
                  </CFormLabel>
                  <CFormInput
                    type="number"
                    id="free_trail_product_details"
                    name="free_trail_product_details"
                    value={formData.free_trail_product_details}
                    onChange={handleFormChange}
                    placeholder="عدد التفاصيل"
                    required
                  />
                  <small className="text-muted">العدد الأقصى لصور المنتجات في النسخة التجريبية</small>
                </div>

                <div className="mb-4">
                  <CFormLabel htmlFor="free_trail_clients">
                    عدد العملاء في النسخة التجريبية
                  </CFormLabel>
                  <CFormInput
                    type="number"
                    id="free_trail_clients"
                    name="free_trail_clients"
                    value={formData.free_trail_clients}
                    onChange={handleFormChange}
                    placeholder="عدد العملاء"
                    required
                  />
                  <small className="text-muted">العدد الأقصى للعملاء في النسخة التجريبية</small>
                </div>

                <div style={{ display: 'flex', gap: '10px', marginTop: '30px' }}>
                  <CButton color="primary" type="submit" disabled={submitting}>
                    {submitting ? 'جاري الحفظ...' : 'حفظ الإعدادات'}
                  </CButton>
                </div>
              </CForm>
            )}
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default Settings