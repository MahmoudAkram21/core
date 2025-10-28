# 🔐 إضافة رابط Register إلى صفحة Login

## البحث عن صفحة Login

أولاً، ابحث عن ملف صفحة Login في مشروعك. قد تكون في:
- `src/views/pages/Login.js`
- `src/components/Login.js`
- `src/views/auth/Login.js`

---

## ✅ الخطوة 1: فتح ملف Login

```javascript
// src/views/pages/Login.js (مثال)
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from 'src/Context/AuthContext'
// ... imports

export default function Login() {
  const navigate = useNavigate()
  const { login, loading, error } = useAuth()
  // ...
}
```

---

## ✅ الخطوة 2: إضافة رابط Register

### الطريقة 1️⃣: رابط بسيط

```javascript
export default function Login() {
  // ... existing code ...

  return (
    <CContainer className="px-4">
      <CRow className="justify-content-center">
        <CCol md={6}>
          {/* Login Form */}
          <CCard className="mb-4">
            <CCardBody>
              <h1>تسجيل الدخول</h1>

              {/* Login inputs ... */}

              <CButton color="primary" className="w-100">
                دخول
              </CButton>

              {/* ✨ اضف هذا الجزء */}
              <p className="text-center mt-3">
                ليس لديك حساب؟{' '}
                <a 
                  href="/register" 
                  className="text-decoration-none text-primary fw-bold"
                >
                  إنشاء حساب جديد
                </a>
              </p>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </CContainer>
  )
}
```

### الطريقة 2️⃣: زر بدلاً من رابط

```javascript
<CRow className="mt-4">
  <CCol className="text-center">
    <p className="text-muted mb-3">ليس لديك حساب؟</p>
    <CButton 
      color="success" 
      onClick={() => navigate('/register')}
      className="w-100"
    >
      📝 إنشاء حساب جديد
    </CButton>
  </CCol>
</CRow>
```

### الطريقة 3️⃣: تبويبات (Tabs)

```javascript
import { CTabs, CTabContent, CTabList, CTabPanel } from '@coreui/react'

export default function AuthPage() {
  const navigate = useNavigate()

  return (
    <CContainer className="px-4">
      <CRow className="justify-content-center">
        <CCol md={6}>
          <CCard>
            <CTabs>
              <CTabList variant="pills">
                <CTabPanel>
                  <span>🔐 تسجيل الدخول</span>
                </CTabPanel>
                <CTabPanel>
                  <span>📝 إنشاء حساب</span>
                </CTabPanel>
              </CTabList>

              <CTabContent>
                <CTabPanel className="p-4">
                  {/* Login Form Component */}
                  <LoginForm />
                </CTabPanel>

                <CTabPanel className="p-4">
                  {/* Register Form Component */}
                  <RegisterForm />
                </CTabPanel>
              </CTabContent>
            </CTabs>
          </CCard>
        </CCol>
      </CRow>
    </CContainer>
  )
}
```

---

## ✅ الخطوة 3: إضافة المسار في routes.js

```javascript
// src/routes.js

import LoginPage from 'src/views/pages/Login'
import RegisterPage from 'src/views/pages/RegisterPage'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: LoginPage,
  },
  {
    path: '/register',
    name: 'Register',
    component: RegisterPage,
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
  },
  // ... other routes
]

export default routes
```

---

## ✅ الخطوة 4: إنشاء ملف RegisterPage.js

**نسخ المحتوى من `QUICK_REGISTER_EXAMPLE.js` إلى ملف جديد:**

```javascript
// src/views/pages/RegisterPage.js

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
} from '@coreui/react'

export default function RegisterPage() {
  const navigate = useNavigate()
  const { register, loading, error } = useAuth()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    re_password: '',
    image: null,
  })

  const [passwordMatch, setPasswordMatch] = useState(true)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))

    if (name === 're_password') {
      setPasswordMatch(value === formData.password || value === '')
    }
    if (name === 'password') {
      setPasswordMatch(value === formData.re_password || formData.re_password === '')
    }
  }

  const handleImageChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('حجم الصورة كبير جداً (الحد الأقصى 2MB)')
        return
      }
      if (!file.type.startsWith('image/')) {
        alert('يجب أن تختار ملف صورة')
        return
      }
      setFormData(prev => ({ ...prev, image: file }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!passwordMatch) {
      alert('❌ كلمات المرور غير متطابقة!')
      return
    }

    if (formData.password.length < 8) {
      alert('❌ كلمة المرور يجب أن تكون 8 أحرف على الأقل')
      return
    }

    try {
      const data = new FormData()
      data.append('name', formData.name)
      data.append('email', formData.email)
      data.append('password', formData.password)
      data.append('re_password', formData.re_password)

      if (formData.image) {
        data.append('image', formData.image)
      }

      await register(data)
      alert('✅ تم التسجيل بنجاح!')
      setTimeout(() => {
        navigate('/dashboard')
      }, 1500)
    } catch (err) {
      console.error('❌ فشل التسجيل:', err)
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
              {error && (
                <CAlert color="danger" className="mb-3">
                  ❌ {error}
                </CAlert>
              )}

              <CForm onSubmit={handleSubmit}>
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
                  />
                </div>

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

                <CButton
                  color="primary"
                  type="submit"
                  disabled={loading || !passwordMatch}
                  className="w-100 mb-3"
                >
                  {loading ? 'جاري التسجيل...' : '✅ تسجيل حساب'}
                </CButton>

                <p className="text-center mt-3">
                  لديك حساب بالفعل؟{' '}
                  <a href="/login" className="text-primary fw-bold">
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
```

---

## ✅ الخطوة 5: تعديل صفحة Login (إضافة رابط Register)

```javascript
// في ملف src/views/pages/Login.js
// أضف هذا السطر في نهاية Form:

<p className="text-center mt-4">
  ليس لديك حساب؟{' '}
  <a href="/register" className="text-primary fw-bold">
    إنشاء حساب جديد
  </a>
</p>

// أو باستخدام navigate:
<CButton 
  color="info" 
  className="w-100 mt-3"
  onClick={() => navigate('/register')}
>
  📝 إنشاء حساب جديد
</CButton>
```

---

## 🎯 تدفق العملية الكاملة

```
1. المستخدم يفتح الموقع
   ↓
2. يرى صفحة Login
   ↓
3. إذا لم يكن لديه حساب، يضغط "إنشاء حساب جديد"
   ↓
4. ينتقل إلى صفحة Register
   ↓
5. يملأ النموذج بالبيانات الصحيحة
   ↓
6. يضغط "تسجيل"
   ↓
7. يتم التحقق من البيانات
   ↓
8. يتم إرسالها للـ API
   ↓
9. يتم حفظ البيانات في الـ State والـ Storage
   ↓
10. ينتقل تلقائياً إلى Dashboard
```

---

## 🔗 الروابط المدعومة

```
/login              → صفحة تسجيل الدخول
/register           → صفحة إنشاء حساب
/dashboard          → لوحة التحكم (بعد الدخول)
/forgot-password    → استعادة كلمة المرور (اختياري)
```

---

## 🧪 الاختبار

### 1️⃣ اختبر الرابط:
```
http://localhost:5173/login
↓ اضغط على "إنشاء حساب جديد"
↓
http://localhost:5173/register
```

### 2️⃣ سجل حساباً جديداً:
```
الاسم: Test User
البريد: test@example.com
كلمة المرور: 12345678
تأكيد: 12345678
صورة: (اختياري)
```

### 3️⃣ تحقق من Console (F12):
```
🔐 Starting registration process...
📤 Sending register request to: http://192.168.1.66:8000/api/register
✅ Register API Response received: {...}
✅✅ Registration completed successfully!
```

### 4️⃣ تحقق من Dashboard:
يجب أن ينقلك تلقائياً بعد النجاح ✅

---

## 🐛 حل المشاكل الشائعة

### المشكلة: رابط Register لا يعمل
**الحل:** تأكد من إضافة المسار في `src/routes.js`

### المشكلة: عند الضغط لا يحدث شيء
**الحل:** استخدم `navigate('/register')` بدلاً من `href`

### المشكلة: البيانات لا تُحفظ
**الحل:** تأكد من أن `register()` تُستدعى صحيحة في AuthContext

### المشكلة: الصورة لا تُرسل
**الحل:** استخدم `FormData` بدلاً من JSON

---

## ✨ التصميم الموصى به

```
┌─────────────────────────────────┐
│   تسجيل الدخول / إنشاء حساب    │
├─────────────────────────────────┤
│  [Tab 1: Login] [Tab 2: Register]│
├─────────────────────────────────┤
│                                 │
│  [Form Controls]                │
│                                 │
│  [Login/Register Button]        │
│                                 │
│  Don't have account? Sign up    │
│                                 │
└─────────────────────────────────┘
```

---

## ✅ Checklist

- [ ] تم نسخ `QUICK_REGISTER_EXAMPLE.js` إلى `src/views/pages/RegisterPage.js`
- [ ] تم إضافة المسار في `src/routes.js`
- [ ] تم إضافة رابط Register في صفحة Login
- [ ] تم الاختبار بتسجيل حساب جديد
- [ ] تم التحقق من رسائل Console
- [ ] تم التحقق من الانتقال إلى Dashboard بعد النجاح

---

## 🎉 خلصت! 🚀

كل شيء جاهز الآن. ستتمكن من:
- ✅ فتح صفحة Login
- ✅ الضغط على رابط Register
- ✅ إنشاء حساب جديد
- ✅ تسجيل الدخول بالحساب الجديد
- ✅ الوصول إلى Dashboard

**استمتع بـ Application الخاصة بك! 🎊**