# 📝 Register API Guide

## API Endpoint

```
POST /api/register
```

---

## Required Fields

| Field | Type | Description |
|-------|------|-------------|
| `email` | string | Unique email |
| `password` | string | Min 8 characters |
| `re_password` | string | Must match password |
| `name` | string | User full name |
| `image` | file | Profile picture (optional) |

---

## 🔧 Usage Example

### في React Component:

```javascript
import { useAuth } from 'src/Context/AuthContext'

export function RegisterForm() {
  const { register, loading, error } = useAuth()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    re_password: '',
    name: '',
    image: null,
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    setFormData(prev => ({ ...prev, image: file }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      // إنشء FormData object
      const data = new FormData()
      data.append('email', formData.email)
      data.append('password', formData.password)
      data.append('re_password', formData.re_password)
      data.append('name', formData.name)
      
      // إضافة الصورة إذا كانت موجودة
      if (formData.image) {
        data.append('image', formData.image)
      }

      // استدعاء دالة التسجيل
      const result = await register(data)
      console.log('✅ تم التسجيل بنجاح:', result)
      // إعادة التوجيه إلى Dashboard
      navigate('/dashboard')
    } catch (err) {
      console.error('❌ فشل التسجيل:', err)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        name="email"
        value={formData.email}
        onChange={handleInputChange}
        placeholder="البريد الإلكتروني"
        required
      />
      
      <input
        type="password"
        name="password"
        value={formData.password}
        onChange={handleInputChange}
        placeholder="كلمة المرور"
        required
      />
      
      <input
        type="password"
        name="re_password"
        value={formData.re_password}
        onChange={handleInputChange}
        placeholder="تأكيد كلمة المرور"
        required
      />
      
      <input
        type="text"
        name="name"
        value={formData.name}
        onChange={handleInputChange}
        placeholder="الاسم الكامل"
        required
      />
      
      <input
        type="file"
        name="image"
        onChange={handleImageChange}
        accept="image/*"
      />
      
      <button type="submit" disabled={loading}>
        {loading ? 'جاري التسجيل...' : 'تسجيل'}
      </button>
      
      {error && <p className="error">{error}</p>}
    </form>
  )
}
```

---

## 📦 Postman Test

### استخدام Postman:

```
1. نوع الطلب: POST
2. الـ URL: http://192.168.1.66:8000/api/register
3. Headers:
   - Accept: application/json
   - Content-Type: multipart/form-data (يضاف تلقائياً)

4. Body (Form-data):
   - email: hsdg@djg.sdfgkj
   - password: 94499449
   - re_password: 94499449
   - name: Mohamed
   - image: [اختر ملف صورة]
```

---

## ✅ Success Response

```json
{
  "status": true,
  "message": "User registered successfully",
  "data": {
    "id": 1,
    "email": "hsdg@djg.sdfgkj",
    "name": "Mohamed",
    "role": "user",
    "image": "path/to/image.jpg",
    "auth_token": "eyJ0eXAiOiJKV1QiLCJhbGc..."
  }
}
```

---

## ❌ Error Responses

### 422 - Validation Error
```json
{
  "message": "The given data was invalid.",
  "errors": {
    "email": ["The email has already been taken"],
    "password": ["The password must be at least 8 characters"]
  }
}
```

### 400 - Bad Request
```json
{
  "status": false,
  "message": "Registration failed"
}
```

---

## 🐛 Debugging Tips

### اضغط F12 وافتح Console للتحقق من:

```javascript
// ستظهر رسائل مثل:
📤 Sending register request to: http://192.168.1.66:8000/api/register
📦 FormData entries: 
  [['email', 'hsdg@djg.sdfgkj'], 
   ['password', '94499449'], 
   ['re_password', '94499449'],
   ['name', 'Mohamed'],
   ['image', File]]
✅ تم التسجيل بنجاح
```

---

## 🔐 Validation Rules

- **Email**: 
  - Format: valid email
  - Unique: لا يمكن تسجيل إيميل موجود
  
- **Password**:
  - Min length: 8 characters
  - Must match re_password
  - يفضل أن تحتوي على أحرف وأرقام

- **Name**:
  - Min length: 3 characters
  - Max length: 255 characters

- **Image** (Optional):
  - Formats: jpg, png, gif
  - Max size: 2MB

---

## 🚀 Complete Example (Register Page)

```javascript
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from 'src/Context/AuthContext'
import { CForm, CFormInput, CButton, CAlert } from '@coreui/react'

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

  const handleChange = (e) => {
    const { name, value, files } = e.target
    if (files) {
      setFormData(prev => ({ ...prev, [name]: files[0] }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // التحقق من البيانات
    if (formData.password !== formData.re_password) {
      alert('كلمات المرور غير متطابقة!')
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
      navigate('/dashboard')
    } catch (err) {
      console.error('❌ Registration failed:', err)
    }
  }

  return (
    <div style={{ maxWidth: '500px', margin: '50px auto' }}>
      <h2>إنشاء حساب جديد</h2>
      
      {error && <CAlert color="danger">{error}</CAlert>}

      <CForm onSubmit={handleSubmit}>
        <CFormInput
          type="text"
          name="name"
          label="الاسم الكامل"
          placeholder="أدخل اسمك"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <CFormInput
          type="email"
          name="email"
          label="البريد الإلكتروني"
          placeholder="example@email.com"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <CFormInput
          type="password"
          name="password"
          label="كلمة المرور"
          placeholder="Min 8 characters"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <CFormInput
          type="password"
          name="re_password"
          label="تأكيد كلمة المرور"
          value={formData.re_password}
          onChange={handleChange}
          required
        />

        <CFormInput
          type="file"
          name="image"
          label="صورة الملف الشخصي"
          onChange={handleChange}
          accept="image/*"
        />

        <CButton color="primary" type="submit" disabled={loading}>
          {loading ? 'جاري التسجيل...' : 'تسجيل'}
        </CButton>
      </CForm>
    </div>
  )
}
```

---

## ✨ All Done!

استخدم هذا الدليل لتنفيذ التسجيل في تطبيقك! 🎉