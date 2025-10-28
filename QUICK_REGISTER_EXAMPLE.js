/**
 * 🎯 Quick Register Example
 * استخدم هذا المثال لتنفيذ التسجيل بسرعة
 */

import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from 'src/Context/AuthContext'
import {
  CForm,
  CFormInput,
  CButton,
  CAlert,
  CCard,
  CCardBody,
  CCardHeader,
  CContainer,
  CRow,
  CCol,
  CSpinner,
} from '@coreui/react'

export default function RegisterExample() {
  const navigate = useNavigate()
  const { register, loading, error } = useAuth()

  // حالة النموذج
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    re_password: '',
    image: null,
  })

  const [passwordMatch, setPasswordMatch] = useState(true)

  // معالج تغيير الحقول
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))

    // التحقق من تطابق كلمات المرور
    if (name === 're_password') {
      setPasswordMatch(value === formData.password || value === '')
    }
    if (name === 'password') {
      setPasswordMatch(value === formData.re_password || formData.re_password === '')
    }
  }

  // معالج تغيير الصورة
  const handleImageChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      // التحقق من حجم الملف (2MB max)
      if (file.size > 2 * 1024 * 1024) {
        alert('حجم الصورة كبير جداً (الحد الأقصى 2MB)')
        return
      }
      // التحقق من نوع الملف
      if (!file.type.startsWith('image/')) {
        alert('يجب أن تختار ملف صورة')
        return
      }
      setFormData(prev => ({ ...prev, image: file }))
    }
  }

  // معالج الإرسال
  const handleSubmit = async (e) => {
    e.preventDefault()

    // التحقق من البيانات
    if (!passwordMatch) {
      alert('❌ كلمات المرور غير متطابقة!')
      return
    }

    if (formData.password.length < 8) {
      alert('❌ كلمة المرور يجب أن تكون 8 أحرف على الأقل')
      return
    }

    try {
      console.log('📤 بدء عملية التسجيل...')

      // إنشاء FormData
      const data = new FormData()
      data.append('name', formData.name)
      data.append('email', formData.email)
      data.append('password', formData.password)
      data.append('re_password', formData.re_password)

      // إضافة الصورة إذا كانت موجودة
      if (formData.image) {
        data.append('image', formData.image)
        console.log('🖼️ الصورة المضافة:', formData.image.name)
      }

      // استدعاء دالة التسجيل
      console.log('🔐 استدعاء API Register...')
      const result = await register(data)

      console.log('✅ تم التسجيل بنجاح!', result)

      // إظهار رسالة النجاح
      alert('✅ تم التسجيل بنجاح! سيتم نقلك إلى لوحة التحكم...')

      // الانتظار قليلاً ثم الانتقال
      setTimeout(() => {
        navigate('/dashboard')
      }, 1500)
    } catch (err) {
      console.error('❌ فشل التسجيل:', err)
      alert('❌ فشل التسجيل! تحقق من Console للمزيد من التفاصيل')
    }
  }

  return (
    <CContainer className="mt-5 mb-5">
      <CRow className="justify-content-center">
        <CCol md={6}>
          <CCard>
            <CCardHeader className="bg-primary text-white">
              <h4>📝 إنشاء حساب جديد</h4>
            </CCardHeader>
            <CCardBody>
              {/* عرض رسائل الخطأ */}
              {error && (
                <CAlert color="danger" className="mb-3">
                  ❌ {error}
                </CAlert>
              )}

              <CForm onSubmit={handleSubmit}>
                {/* حقل الاسم */}
                <div className="mb-3">
                  <CFormInput
                    type="text"
                    name="name"
                    label="الاسم الكامل *"
                    placeholder="مثال: محمد أحمد"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    disabled={loading}
                  />
                </div>

                {/* حقل البريد الإلكتروني */}
                <div className="mb-3">
                  <CFormInput
                    type="email"
                    name="email"
                    label="البريد الإلكتروني *"
                    placeholder="مثال: example@email.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    disabled={loading}
                  />
                </div>

                {/* حقل كلمة المرور */}
                <div className="mb-3">
                  <CFormInput
                    type="password"
                    name="password"
                    label="كلمة المرور *"
                    placeholder="8 أحرف على الأقل"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    disabled={loading}
                    feedback="يجب أن تكون 8 أحرف على الأقل"
                  />
                </div>

                {/* حقل تأكيد كلمة المرور */}
                <div className="mb-3">
                  <CFormInput
                    type="password"
                    name="re_password"
                    label="تأكيد كلمة المرور *"
                    placeholder="أعد إدخال كلمة المرور"
                    value={formData.re_password}
                    onChange={handleInputChange}
                    required
                    disabled={loading}
                    invalid={!passwordMatch && formData.re_password !== ''}
                    feedback={!passwordMatch ? '❌ كلمات المرور غير متطابقة' : ''}
                  />
                  {passwordMatch && formData.re_password && (
                    <small className="text-success">✅ كلمات المرور متطابقة</small>
                  )}
                </div>

                {/* حقل الصورة */}
                <div className="mb-3">
                  <label className="form-label">صورة الملف الشخصي (اختياري)</label>
                  <CFormInput
                    type="file"
                    name="image"
                    onChange={handleImageChange}
                    accept="image/*"
                    disabled={loading}
                  />
                  {formData.image && (
                    <small className="text-success d-block mt-2">
                      ✅ تم اختيار الصورة: {formData.image.name}
                    </small>
                  )}
                </div>

                {/* زر التسجيل */}
                <CButton
                  color="primary"
                  type="submit"
                  disabled={loading || !passwordMatch}
                  className="w-100 mb-3"
                >
                  {loading ? (
                    <>
                      <CSpinner size="sm" className="me-2" />
                      جاري التسجيل...
                    </>
                  ) : (
                    '✅ تسجيل حساب'
                  )}
                </CButton>

                {/* رابط تسجيل الدخول */}
                <p className="text-center mt-3">
                  لديك حساب بالفعل؟{' '}
                  <a href="/login" className="text-primary">
                    سجل الدخول هنا
                  </a>
                </p>
              </CForm>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </CContainer>
  )
}

/**
 * 🎯 خطوات الاستخدام:
 * 
 * 1. انسخ هذا الملف إلى: src/views/pages/RegisterExample.js
 * 
 * 2. أضفه إلى routes في src/routes.js:
 *    {
 *      path: '/register',
 *      name: 'Register',
 *      component: RegisterExample,
 *    }
 * 
 * 3. استخدمه في صفحة التسجيل أو رابط Register
 * 
 * ✅ هذا المثال يتضمن:
 * - ✅ التحقق من تطابق كلمات المرور
 * - ✅ التحقق من طول كلمة المرور (8 أحرف)
 * - ✅ التحقق من حجم الصورة (2MB)
 * - ✅ التحقق من نوع الصورة
 * - ✅ عرض رسائل الخطأ والنجاح
 * - ✅ تحميل حالة الزر (disabled أثناء الإرسال)
 * - ✅ Logging شامل في Console
 */