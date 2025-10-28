import React, { useEffect, useState } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CBadge,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CForm,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CSpinner,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilColorBucket, cilPencil, cilTrash, cilPlus } from '@coreui/icons'
import Swal from 'sweetalert2'
import { packagesAPI } from '../../../api/api'

const Packages = () => {
  const [packages, setPackages] = useState([])
  const [loading, setLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({
    name_ar: '',
    name_en: '',
    description_ar: '',
    description_en: '',
    valid_days: '',
    cashiers_count: '',
    clients_count: '',
    products_count: '',
    product_images_count: '',
    price: '',
    status: 'active',
  })

  // Fetch packages
  const fetchPackages = async () => {
    setLoading(true)
    try {
      const res = await packagesAPI.getAll()
      setPackages(res.data.data || [])
    } catch (error) {
      Swal.fire('خطأ', 'فشل في تحميل الحزم', 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPackages()
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
    try {
      if (editingId) {
        const formDataToSend = new FormData()
        Object.keys(formData).forEach((key) => {
          formDataToSend.append(key, formData[key])
        })
        await packagesAPI.update(editingId, formDataToSend)
        Swal.fire('نجاح', 'تم تحديث الحزمة بنجاح', 'success')
      } else {
        const formDataToSend = new FormData()
        Object.keys(formData).forEach((key) => {
          formDataToSend.append(key, formData[key])
        })
        await packagesAPI.create(formDataToSend)
        Swal.fire('نجاح', 'تم إنشاء الحزمة بنجاح', 'success')
      }
      setShowModal(false)
      resetForm()
      fetchPackages()
    } catch (error) {
      Swal.fire('خطأ', error.response?.data?.message || 'حدث خطأ', 'error')
    }
  }

  // Reset form
  const resetForm = () => {
    setFormData({
      name_ar: '',
      name_en: '',
      description_ar: '',
      description_en: '',
      valid_days: '',
      cashiers_count: '',
      clients_count: '',
      products_count: '',
      product_images_count: '',
      price: '',
      status: 'active',
    })
    setEditingId(null)
  }

  // Handle edit
  const handleEdit = (pkg) => {
    setFormData({
      name_ar: pkg.name_ar || '',
      name_en: pkg.name_en || '',
      description_ar: pkg.description_ar || '',
      description_en: pkg.description_en || '',
      valid_days: pkg.valid_days || '',
      cashiers_count: pkg.cashiers_count || '',
      clients_count: pkg.clients_count || '',
      products_count: pkg.products_count || '',
      product_images_count: pkg.product_images_count || '',
      price: pkg.price || '',
      status: pkg.status || 'active',
    })
    setEditingId(pkg.id)
    setShowModal(true)
  }

  // Handle delete
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'هل أنت متأكد؟',
      text: 'لن تتمكن من التراجع عن هذا!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'نعم، احذفها!',
    })

    if (result.isConfirmed) {
      try {
        await packagesAPI.delete(id)
        Swal.fire('تم الحذف!', 'تم حذف الحزمة بنجاح', 'success')
        fetchPackages()
      } catch (error) {
        Swal.fire('خطأ', 'فشل في حذف الحزمة', 'error')
      }
    }
  }

  const openNewModal = () => {
    resetForm()
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    resetForm()
  }

  return (
    <CRow>
      <CCol xs={12}>
        <CCard>
          <CCardHeader>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>الحزم</span>
              <CButton
                color="success"
                onClick={openNewModal}
                size="sm"
                style={{ marginLeft: 'auto' }}
              >
                <CIcon icon={cilPlus} /> إضافة حزمة جديدة
              </CButton>
            </div>
          </CCardHeader>
          <CCardBody>
            {loading ? (
              <div className="text-center">
                <CSpinner />
              </div>
            ) : (
              <CTable bordered hover responsive>
                <CTableHead>
                  <CTableHeaderCell>الاسم (عربي)</CTableHeaderCell>
                  <CTableHeaderCell>الاسم (إنجليزي)</CTableHeaderCell>
                  <CTableHeaderCell>أيام الصلاحية</CTableHeaderCell>
                  <CTableHeaderCell>السعر</CTableHeaderCell>
                  <CTableHeaderCell>الحالة</CTableHeaderCell>
                  <CTableHeaderCell>الإجراءات</CTableHeaderCell>
                </CTableHead>
                <CTableBody>
                  {packages.length > 0 ? (
                    packages.map((pkg) => (
                      <tr key={pkg.id}>
                        <CTableDataCell>{pkg.name_ar}</CTableDataCell>
                        <CTableDataCell>{pkg.name_en}</CTableDataCell>
                        <CTableDataCell>{pkg.valid_days}</CTableDataCell>
                        <CTableDataCell>${pkg.price}</CTableDataCell>
                        <CTableDataCell>
                          <CBadge color={pkg.status === 'active' ? 'success' : 'danger'}>
                            {pkg.status === 'active' ? 'نشط' : 'غير نشط'}
                          </CBadge>
                        </CTableDataCell>
                        <CTableDataCell>
                          <div style={{ display: 'flex', gap: '5px' }}>
                            <CButton
                              color="warning"
                              size="sm"
                              onClick={() => handleEdit(pkg)}
                            >
                              <CIcon icon={cilPencil} />
                            </CButton>
                            <CButton
                              color="danger"
                              size="sm"
                              onClick={() => handleDelete(pkg.id)}
                            >
                              <CIcon icon={cilTrash} />
                            </CButton>
                          </div>
                        </CTableDataCell>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <CTableDataCell colSpan={6} className="text-center">
                        لا توجد حزم
                      </CTableDataCell>
                    </tr>
                  )}
                </CTableBody>
              </CTable>
            )}
          </CCardBody>
        </CCard>
      </CCol>

      {/* Modal */}
      <CModal backdrop="static" visible={showModal} onClose={closeModal} size="lg">
        <CModalHeader closeButton>
          <CModalTitle>{editingId ? 'تحديث الحزمة' : 'إضافة حزمة جديدة'}</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm onSubmit={handleSubmit}>
            <CFormLabel>الاسم (عربي)</CFormLabel>
            <CFormInput
              name="name_ar"
              value={formData.name_ar}
              onChange={handleFormChange}
              required
              className="mb-3"
            />

            <CFormLabel>الاسم (إنجليزي)</CFormLabel>
            <CFormInput
              name="name_en"
              value={formData.name_en}
              onChange={handleFormChange}
              required
              className="mb-3"
            />

            <CFormLabel>الوصف (عربي)</CFormLabel>
            <CFormInput
              as="textarea"
              name="description_ar"
              value={formData.description_ar}
              onChange={handleFormChange}
              className="mb-3"
            />

            <CFormLabel>الوصف (إنجليزي)</CFormLabel>
            <CFormInput
              as="textarea"
              name="description_en"
              value={formData.description_en}
              onChange={handleFormChange}
              className="mb-3"
            />

            <CFormLabel>أيام الصلاحية</CFormLabel>
            <CFormInput
              type="number"
              name="valid_days"
              value={formData.valid_days}
              onChange={handleFormChange}
              className="mb-3"
            />

            <CFormLabel>عدد أمناء الصندوق</CFormLabel>
            <CFormInput
              type="number"
              name="cashiers_count"
              value={formData.cashiers_count}
              onChange={handleFormChange}
              className="mb-3"
            />

            <CFormLabel>عدد العملاء</CFormLabel>
            <CFormInput
              type="number"
              name="clients_count"
              value={formData.clients_count}
              onChange={handleFormChange}
              className="mb-3"
            />

            <CFormLabel>عدد المنتجات</CFormLabel>
            <CFormInput
              type="number"
              name="products_count"
              value={formData.products_count}
              onChange={handleFormChange}
              className="mb-3"
            />

            <CFormLabel>عدد صور المنتجات</CFormLabel>
            <CFormInput
              type="number"
              name="product_images_count"
              value={formData.product_images_count}
              onChange={handleFormChange}
              className="mb-3"
            />

            <CFormLabel>السعر</CFormLabel>
            <CFormInput
              type="number"
              step="0.01"
              name="price"
              value={formData.price}
              onChange={handleFormChange}
              className="mb-3"
            />

            <CFormLabel>الحالة</CFormLabel>
            <CFormSelect
              name="status"
              value={formData.status}
              onChange={handleFormChange}
              className="mb-3"
            >
              <option value="active">نشط</option>
              <option value="inactive">غير نشط</option>
            </CFormSelect>

            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
              <CButton color="primary" type="submit">
                {editingId ? 'تحديث' : 'إضافة'}
              </CButton>
              <CButton color="secondary" onClick={closeModal}>
                إلغاء
              </CButton>
            </div>
          </CForm>
        </CModalBody>
      </CModal>
    </CRow>
  )
}

export default Packages