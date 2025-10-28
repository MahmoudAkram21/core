# 👨‍💻 Developer Reference Card

Quick reference for developers working on this CoreUI React Admin Template project.

---

## 🚀 Quick Start

```bash
npm install           # Install dependencies
npm start            # Start dev server at http://localhost:3000
npm run build        # Build for production
npm run serve        # Serve production build locally
```

---

## 📁 Project Structure Reference

```
src/
├── api/
│   └── api.js                    # All 14 API endpoints + interceptor
├── Context/
│   └── AuthContext.jsx           # Auth state + 8 methods
├── hooks/
│   └── useCategories.js          # Categories CRUD + state
├── views/
│   ├── categories/
│   │   ├── Categories.jsx        # List with search/filter
│   │   └── CategoryForm.jsx      # Create/Edit form
│   └── pages/
│       ├── auth/
│       │   ├── ForgotPassword.jsx
│       │   ├── ResetPassword.jsx
│       │   └── VerifyEmail.jsx
│       ├── account/
│       │   └── AccountSettings.jsx
│       └── login/
│           └── Login.js
├── routes.js                     # 8 routes with protection
├── _nav.js                       # Sidebar navigation
└── store.js                      # Redux/state store
```

---

## 🔐 Authentication API Reference

### authAPI Object (api/api.js)

```javascript
import { authAPI } from '../../api/api'

// 1. Login
authAPI.login(email, password)
// POST /login
// Body: FormData {email, password}
// Returns: {data: {user: {...}, token: '...'}}

// 2. Register
authAPI.register(formData)
// POST /register
// Body: FormData {email, password, re_password, name, image}
// Returns: {data: {user: {...}, token: '...'}}

// 3. Logout
authAPI.logout()
// POST /logout (requires Bearer token)
// Returns: {success: true}

// 4. Get Profile
authAPI.getProfile()
// GET /user (requires Bearer token)
// Returns: {data: {user: {...}}}

// 5. Send Verification Code
authAPI.sendVerificationCode()
// POST /send-verification-code (requires Bearer token)
// Returns: {success: true}

// 6. Verify Email
authAPI.verifyEmail(code)
// POST /verify-code (requires Bearer token)
// Body: FormData {code}
// Returns: {success: true}

// 7. Forgot Password
authAPI.forgotPassword(email)
// POST /forgot-password (NO auth required)
// Body: FormData {email}
// Returns: {success: true, message: 'OTP sent'}

// 8. Reset Password
authAPI.resetPassword(email, otp, password, re_password)
// POST /reset-password (NO auth required)
// Body: FormData {email, otp, password, re_password}
// Returns: {success: true}

// 9. Delete Account
authAPI.deleteAccount()
// DELETE /delete-account (requires Bearer token)
// Returns: {success: true}
```

---

## 📂 Categories API Reference

### categoriesAPI Object (api/api.js)

```javascript
import { categoriesAPI } from '../../api/api'

// 1. Get All Categories
categoriesAPI.getAll(status = null, search = null)
// GET /categories?status=active&search=test
// Returns: {data: [{id, name_ar, name_en, status, image, ...}, ...]}

// 2. Get Single Category
categoriesAPI.getById(id)
// GET /categories/1
// Returns: {data: {id, name_ar, name_en, description_ar, ...}}

// 3. Create Category
categoriesAPI.create(formData)
// POST /categories (requires Bearer token + admin role)
// Body: FormData {name_ar, name_en, description_ar, description_en, status, image}
// Returns: {data: {id, name_ar, ...}}

// 4. Update Category
categoriesAPI.update(id, formData)
// POST /categories/1?_method=PUT (requires Bearer token + admin role)
// Automatically appends: _method=PUT
// Body: FormData {name_ar, name_en, description_ar, description_en, status, image}
// Returns: {data: {id, name_ar, ...}}

// 5. Delete Category
categoriesAPI.delete(id)
// DELETE /categories/1 (requires Bearer token + admin role)
// Returns: {success: true}
```

---

## 🎯 Using Auth Context

### useAuth Hook

```javascript
import { useAuth } from '../Context/AuthContext'

export function MyComponent() {
  const {
    // State
    user,              // Current user object: {id, name, email, role, ...}
    token,             // Auth token string
    role,              // User role: 'admin', 'super-admin', 'user'
    loading,           // Boolean: true while API call in progress
    error,             // Error message string or null
    
    // Methods
    login,             // async (email, password) => user data
    register,          // async (formData) => user data
    logout,            // async () => void
    profileData,       // async () => user profile
    sendVerificationCode, // async () => success
    verifyEmail,       // async (code) => success
    forgotPassword,    // async (email) => success
    resetPassword,     // async (email, otp, password, re_password) => success
    deleteAccount,     // async () => success
  } = useAuth()

  return (
    <div>
      {loading && <Spinner />}
      {error && <Alert>{error}</Alert>}
      <p>Hello {user?.name}</p>
      <button onClick={logout}>Logout</button>
    </div>
  )
}
```

---

## 🎨 Using Categories Hook

### useCategories Hook

```javascript
import { useCategories } from '../../hooks/useCategories'

export function CategoriesPage() {
  const {
    // State
    categories,        // Array of category objects
    loading,          // Boolean: true while loading
    error,            // Error message or null
    selectedCategory, // Currently selected/edited category
    
    // Methods
    fetchCategories,  // async (status?, search?) => categories
    fetchCategory,    // async (id) => single category
    createCategory,   // async (formData) => new category
    updateCategory,   // async (id, formData) => updated category
    deleteCategory,   // async (id) => success
  } = useCategories()

  useEffect(() => {
    fetchCategories()
  }, [])

  if (loading) return <Spinner />
  if (error) return <Alert color="danger">{error}</Alert>

  return (
    <table>
      <tbody>
        {categories.map(cat => (
          <tr key={cat.id}>
            <td>{cat.name_en}</td>
            <td>{cat.status}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
```

---

## 📤 Making API Requests

### Direct API Call Example

```javascript
import { authAPI, categoriesAPI } from '../api/api'

// Login
try {
  const response = await authAPI.login('test@test.com', 'password123')
  console.log(response.data.data.user)
  console.log(response.data.data.token)
} catch (error) {
  console.error(error.response?.data?.message)
}

// Get categories with filters
try {
  const response = await categoriesAPI.getAll('active', 'test')
  console.log(response.data.data) // Array of categories
} catch (error) {
  console.error(error.response?.data?.message)
}

// Create category with file
const formData = new FormData()
formData.append('name_ar', 'اسم')
formData.append('name_en', 'Name')
formData.append('description_ar', 'وصف')
formData.append('description_en', 'Description')
formData.append('image', fileInput.files[0])
formData.append('status', 'active')

try {
  const response = await categoriesAPI.create(formData)
  console.log(response.data.data) // New category
} catch (error) {
  console.error(error.response?.data?.message)
}
```

---

## 🛡️ Bearer Token Handling

### Automatic Token Injection

```javascript
// In api/api.js, tokens are AUTOMATICALLY injected:
api.interceptors.request.use((config) => {
  const token = cookies.get('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// You don't need to manually add Bearer token!
// All requests automatically include it
```

### Accessing Token Directly

```javascript
import Cookies from 'universal-cookie'

const cookies = new Cookies()
const token = cookies.get('token')
console.log(token) // 'your-bearer-token'
```

---

## ⚠️ Error Handling Pattern

### Try-Catch Pattern

```javascript
try {
  const response = await authAPI.login(email, password)
  // Success
  setUser(response.data.data.user)
} catch (error) {
  // Handle error
  const message = error.response?.data?.message || 'Unknown error'
  setError(message)
  console.error('Full error:', error)
}
```

### Error Response Format

```javascript
// API error response structure:
error.response = {
  status: 400,      // HTTP status code
  data: {
    message: 'Email or password is incorrect',
    errors: {
      email: ['Invalid email format'],
      password: ['Min 8 characters']
    }
  }
}

// Extract message:
const message = error.response?.data?.message || 'Error'

// Extract validation errors:
const errors = error.response?.data?.errors
Object.keys(errors).forEach(field => {
  console.log(`${field}: ${errors[field][0]}`)
})
```

---

## 🔄 FormData Usage

### Creating FormData

```javascript
// For regular form data (no files)
const formData = new FormData()
formData.append('email', 'test@test.com')
formData.append('password', 'pass123')
await authAPI.login(email, password) // Handled internally

// For files (multipart)
const formData = new FormData()
formData.append('name', 'Test')
formData.append('image', fileInput.files[0]) // File object
formData.append('status', 'active')
await categoriesAPI.create(formData)

// For mixed data with optional file
const formData = new FormData()
formData.append('name', 'Test')
if (fileInput.files[0]) {
  formData.append('image', fileInput.files[0])
}
formData.append('status', 'active')
```

### Reading FormData Values

```javascript
// FormData is immutable, can't read back
// Store original values in state instead:
const [form, setForm] = useState({
  name: '',
  image: null
})

// When submitting:
const formData = new FormData()
formData.append('name', form.name)
if (form.image) {
  formData.append('image', form.image)
}
```

---

## 🎯 Route Protection

### How Routes Are Protected

```javascript
// In routes.js:
const ProtectedRoute = ({ user, requiredRole, children }) => {
  if (!user) return <Navigate to="/login" />
  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/dashboard" />
  }
  return children
}

// Usage:
<Route
  path="/categories"
  element={
    <ProtectedRoute user={user} requiredRole="admin">
      <Categories />
    </ProtectedRoute>
  }
/>
```

### Route Access Levels

```
PUBLIC (No auth required):
  /login
  /register
  /forgot-password
  /reset-password

AUTHENTICATED (Any logged in user):
  /dashboard
  /account-settings
  /verify-email

ADMIN ONLY:
  /categories
```

---

## 🎨 Component Patterns

### Form Component Pattern

```javascript
import { useState } from 'react'
import { useAuth } from '../Context/AuthContext'
import { CForm, CButton, CFormInput, CAlert } from '@coreui/react'

export function LoginForm() {
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [submitError, setSubmitError] = useState(null)
  const { login, loading } = useAuth()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitError(null)
    
    try {
      await login(formData.email, formData.password)
      // Success - redirect handled by auth context
    } catch (error) {
      setSubmitError(error.response?.data?.message || 'Login failed')
    }
  }

  return (
    <CForm onSubmit={handleSubmit}>
      {submitError && <CAlert color="danger">{submitError}</CAlert>}
      
      <CFormInput
        name="email"
        type="email"
        label="Email"
        value={formData.email}
        onChange={handleChange}
        required
      />
      
      <CFormInput
        name="password"
        type="password"
        label="Password"
        value={formData.password}
        onChange={handleChange}
        required
      />
      
      <CButton color="primary" type="submit" disabled={loading}>
        {loading ? 'Loading...' : 'Login'}
      </CButton>
    </CForm>
  )
}
```

---

## 📝 Validation Examples

### Form Validation

```javascript
const validateForm = (data) => {
  const errors = {}
  
  // Email validation
  if (!data.email) {
    errors.email = 'Email required'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = 'Invalid email'
  }
  
  // Password validation
  if (!data.password) {
    errors.password = 'Password required'
  } else if (data.password.length < 8) {
    errors.password = 'Min 8 characters'
  }
  
  // Password confirmation
  if (data.password !== data.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match'
  }
  
  // File size validation
  if (data.image && data.image.size > 5 * 1024 * 1024) {
    errors.image = 'File too large (max 5MB)'
  }
  
  return errors
}

// Usage:
const errors = validateForm(formData)
if (Object.keys(errors).length > 0) {
  setValidationErrors(errors)
  return
}
```

---

## 🧪 Testing API Endpoints in Postman

### Postman Setup

1. **Create environment variable:**
   ```
   base_url = http://192.168.1.66:8000/api
   token = [your-bearer-token]
   ```

2. **Use in requests:**
   ```
   {{base_url}}/login
   Header: Authorization: Bearer {{token}}
   ```

3. **Save token after login:**
   ```javascript
   // In Postman Tests tab:
   var jsonData = pm.response.json()
   pm.environment.set('token', jsonData.data.token)
   ```

---

## 🔍 Debugging Tips

### Console Logging

```javascript
// Log API calls
console.log('Calling API:', {method, endpoint, data})

// Log responses
console.log('API Response:', response.data)

// Log errors
console.error('API Error:', error.response?.data)

// Log state changes
console.log('User updated:', user)
console.log('Categories loaded:', categories)
```

### Network Inspection (DevTools)

```
F12 → Network tab

Look for:
- Request URL: http://api/endpoint
- Request Headers: Authorization: Bearer token
- Request Body: form data or JSON
- Response Status: 200 (success), 4xx (client error), 5xx (server error)
- Response Body: API response data
- Timing: How long request took
```

### React DevTools

```
F12 → Components tab

Inspect:
- AuthContext state: user, token, role
- Component props
- Hook values
- Re-render causes
```

---

## 📚 File Cross-Reference

| Functionality | Files |
|---------------|-------|
| All Auth endpoints | api/api.js |
| Auth state + methods | Context/AuthContext.jsx |
| Login page | views/pages/login/Login.js |
| Password reset | pages/auth/ForgotPassword.jsx, ResetPassword.jsx |
| All Categories endpoints | api/api.js |
| Categories state + logic | hooks/useCategories.js |
| Categories UI | views/categories/Categories.jsx |
| Categories form | views/categories/CategoryForm.jsx |
| Route definitions | routes.js |
| Navigation menu | _nav.js |
| Token interceptor | api/api.js |

---

## 💡 Common Code Snippets

### Check User Role

```javascript
const isAdmin = user?.role === 'admin' || user?.role === 'super-admin'
if (isAdmin) {
  // Show admin features
}
```

### Get Stored Token

```javascript
import Cookies from 'universal-cookie'

const cookies = new Cookies()
const token = cookies.get('token')
const user = JSON.parse(cookies.get('user') || '{}')
```

### Show Loading with Spinner

```javascript
import { CSpinner } from '@coreui/react'

{loading && <CSpinner color="primary" />}
```

### Show Error Alert

```javascript
import { CAlert } from '@coreui/react'

{error && <CAlert color="danger">{error}</CAlert>}
```

### Handle File Upload

```javascript
const handleFileChange = (e) => {
  const file = e.target.files[0]
  if (file) {
    // Show preview
    const reader = new FileReader()
    reader.onload = (e) => setPreview(e.target.result)
    reader.readAsDataURL(file)
    
    // Store file
    setFormData({...formData, image: file})
  }
}

// In form submit:
const fd = new FormData()
fd.append('image', formData.image)
```

### Confirmation Dialog

```javascript
import Swal from 'sweetalert2'

const handleDelete = async () => {
  const result = await Swal.fire({
    title: 'Delete?',
    text: 'Cannot undo',
    icon: 'warning',
    showCancelButton: true,
  })
  
  if (result.isConfirmed) {
    // Proceed with deletion
    await deleteItem()
  }
}
```

---

## 🚨 Common Mistakes to Avoid

```javascript
// ❌ WRONG: Manually adding Bearer token
// (Already added by interceptor)
axios.get('/categories', {
  headers: { Authorization: 'Bearer ' + token }
})

// ✅ RIGHT: Just make the request
api.get('/categories')

// ❌ WRONG: Not handling FormData for files
const data = {name: 'Test', image: fileInput.files[0]}
api.post('/categories', data)

// ✅ RIGHT: Use FormData
const formData = new FormData()
formData.append('name', 'Test')
formData.append('image', fileInput.files[0])
api.post('/categories', formData)

// ❌ WRONG: Forgetting to append _method=PUT
api.post(`/categories/${id}`, data)

// ✅ RIGHT: Append _method for update
const fd = new FormData()
// ... append fields
fd.append('_method', 'PUT') // For Laravel
api.post(`/categories/${id}`, fd)

// ❌ WRONG: Not catching errors
await authAPI.login(email, password)

// ✅ RIGHT: Always handle errors
try {
  await authAPI.login(email, password)
} catch (error) {
  console.error(error.response?.data?.message)
}
```

---

## 📱 Responsive Design Notes

```
CoreUI components are mobile-responsive by default
Use CRow and CCol for layout:
<CRow>
  <CCol md={6}>Desktop half width, mobile full</CCol>
  <CCol md={6}>Desktop half width, mobile full</CCol>
</CRow>
```

---

## 🎯 Performance Tips

```javascript
// 1. Lazy load routes
const Categories = lazy(() => import('./views/categories/Categories'))

// 2. Memoize expensive components
const CategoriesList = memo(function List({categories}) {
  return <Table categories={categories} />
})

// 3. Use useCallback for event handlers
const handleSearch = useCallback((term) => {
  fetchCategories(term)
}, [])

// 4. Debounce search input
const [searchTerm, setSearchTerm] = useState('')
const debouncedSearch = debounce((term) => {
  fetchCategories(term)
}, 500)

// 5. Pagination for large lists
const [page, setPage] = useState(1)
fetchCategories({page, limit: 10})
```

---

## ✅ Pre-Deployment Checklist

- [ ] API URL updated
- [ ] All endpoints tested
- [ ] Error handling works
- [ ] Loading states functional
- [ ] Role-based access working
- [ ] Responsive on mobile
- [ ] No console errors
- [ ] Environment variables set

---

**Happy Coding! 🚀**

Keep this reference handy for quick lookups!