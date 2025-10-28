# API Documentation & Project Setup

## 🚀 Project Overview

This is a complete CoreUI React Admin Template with integrated authentication and categories management system. The project includes:

- **Authentication System** (Login, Register, Password Reset, Email Verification)
- **Role-Based Access Control** (Super Admin, Admin, Teacher, Student)
- **Categories Management** (Create, Read, Update, Delete)
- **Account Settings** (User Profile, Account Deletion)
- **API Integration** (Axios with Bearer Token Authentication)

---

## 📁 Project Structure

```
src/
├── api/
│   └── api.js                 # API configuration and endpoints
├── Context/
│   ├── AuthContext.jsx        # Authentication context
│   └── CheckRoleContext.js    # Role checking context
├── hooks/
│   └── useCategories.js       # Categories management hook
├── views/
│   ├── categories/
│   │   ├── Categories.jsx     # Categories list page
│   │   └── CategoryForm.jsx   # Category form (add/edit)
│   ├── pages/
│   │   ├── auth/
│   │   │   ├── ForgotPassword.jsx
│   │   │   ├── ResetPassword.jsx
│   │   │   └── VerifyEmail.jsx
│   │   ├── account/
│   │   │   └── AccountSettings.jsx
│   │   └── login/
│   │       └── Login.js
│   └── dashboard/
│       └── Dashboard.jsx
├── routes.js                  # Application routes
└── _nav.js                    # Navigation menu
```

---

## 🔐 Authentication Endpoints

All authentication endpoints are located in `api/api.js` with the `authAPI` object.

### 1. **Login**
```javascript
authAPI.login(email, password)
```
- **Method:** POST
- **URL:** `/login`
- **Body:**
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```
- **Response:**
  ```json
  {
    "data": {
      "user": { "id": 1, "name": "John", "email": "john@example.com", "role": "admin" },
      "auth_token": "token_here"
    }
  }
  ```

### 2. **Register**
```javascript
authAPI.register(formData)
```
- **Method:** POST
- **URL:** `/register`
- **Form Data:**
  - `email` (required, unique)
  - `password` (required)
  - `re_password` (required)
  - `name` (required)
  - `image` (optional, file)

### 3. **Logout**
```javascript
authAPI.logout()
```
- **Method:** POST
- **URL:** `/logout`
- **Authentication:** Required (Bearer Token)

### 4. **Get User Profile**
```javascript
authAPI.getProfile()
```
- **Method:** GET
- **URL:** `/user`
- **Authentication:** Required (Bearer Token)

### 5. **Send Verification Code**
```javascript
authAPI.sendVerificationCode()
```
- **Method:** POST
- **URL:** `/send-verification-code`
- **Authentication:** Required (Bearer Token)

### 6. **Verify Email**
```javascript
authAPI.verifyEmail(code)
```
- **Method:** POST
- **URL:** `/verify-code`
- **Authentication:** Required (Bearer Token)
- **Body:**
  ```json
  {
    "code": "48422"
  }
  ```

### 7. **Forgot Password**
```javascript
authAPI.forgotPassword(email)
```
- **Method:** POST
- **URL:** `/forgot-password`
- **Body:**
  ```json
  {
    "email": "user@example.com"
  }
  ```

### 8. **Reset Password**
```javascript
authAPI.resetPassword(email, otp, password, re_password)
```
- **Method:** POST
- **URL:** `/reset-password`
- **Body:**
  ```json
  {
    "email": "user@example.com",
    "otp": "45036",
    "password": "newpassword123",
    "re_password": "newpassword123"
  }
  ```

### 9. **Delete Account**
```javascript
authAPI.deleteAccount()
```
- **Method:** DELETE
- **URL:** `/delete-account`
- **Authentication:** Required (Bearer Token)

---

## 📂 Categories Endpoints

All categories endpoints are located in `api/api.js` with the `categoriesAPI` object.

### 1. **Get All Categories**
```javascript
categoriesAPI.getAll(status, search)
```
- **Method:** GET
- **URL:** `/categories`
- **Query Parameters:**
  - `status` (optional): `active` or `inactive`
  - `search` (optional): Search in name
- **Authentication:** Required (Bearer Token)

### 2. **Get Single Category**
```javascript
categoriesAPI.getById(id)
```
- **Method:** GET
- **URL:** `/categories/:id`
- **Authentication:** Required (Bearer Token)

### 3. **Create Category**
```javascript
categoriesAPI.create(formData)
```
- **Method:** POST
- **URL:** `/categories`
- **Authentication:** Required (Bearer Token)
- **Roles:** Admin or Super-Admin
- **Form Data:**
  - `name_ar` (required)
  - `name_en` (required)
  - `description_ar` (optional)
  - `description_en` (optional)
  - `image` (optional, file)
  - `status` (required): `active` or `inactive`

### 4. **Update Category**
```javascript
categoriesAPI.update(id, formData)
```
- **Method:** POST (with `_method=PUT`)
- **URL:** `/categories/:id?_method=PUT`
- **Authentication:** Required (Bearer Token)
- **Roles:** Admin or Super-Admin
- **Form Data:** Same as create

### 5. **Delete Category**
```javascript
categoriesAPI.delete(id)
```
- **Method:** DELETE
- **URL:** `/categories/:id`
- **Authentication:** Required (Bearer Token)
- **Roles:** Admin or Super-Admin

---

## 🎣 Using Context Hooks

### Authentication Hook
```javascript
import { useAuth } from '@/Context/AuthContext'

const MyComponent = () => {
  const { 
    user, 
    token, 
    role, 
    loading, 
    error,
    login, 
    logout, 
    register,
    profileData,
    sendVerificationCode,
    verifyEmail,
    forgotPassword,
    resetPassword,
    deleteAccount
  } = useAuth()

  return (
    // Your component code
  )
}
```

### Categories Hook
```javascript
import { useCategories } from '@/hooks/useCategories'

const MyComponent = () => {
  const {
    categories,
    loading,
    error,
    selectedCategory,
    fetchCategories,
    fetchCategory,
    createCategory,
    updateCategory,
    deleteCategory
  } = useCategories()

  return (
    // Your component code
  )
}
```

---

## 🛣️ Available Routes

| Route | Component | Protection | Roles |
|-------|-----------|-----------|-------|
| `/login` | Login | None | - |
| `/register` | Register | None | - |
| `/forgot-password` | ForgotPassword | None | - |
| `/reset-password` | ResetPassword | None | - |
| `/dashboard` | Dashboard | Yes | admin, teacher, student |
| `/categories` | Categories | Yes | admin, super-admin |
| `/verify-email` | VerifyEmail | Yes | All authenticated |
| `/account-settings` | AccountSettings | Yes | All authenticated |

---

## 🔒 Protected Routes

Routes are protected using the `ProtectedRoute` component:

```javascript
import ProtectedRoute from '@/views/pages/Auth/ProtectedRoute'

<ProtectedRoute roles={['admin', 'super-admin']}>
  <Categories />
</ProtectedRoute>
```

---

## 🍪 Authentication Flow

### Login Process:
1. User submits email and password
2. API returns user data and token
3. Token is stored in cookies
4. User state is updated in AuthContext
5. User is redirected to dashboard

### Token Management:
- Token is automatically added to all API requests via interceptor
- Token is stored in universal-cookie for persistence
- Token is sent as Bearer token in Authorization header

---

## 📝 Using Categories

### Fetch All Categories:
```javascript
const { categories, loading, error, fetchCategories } = useCategories()

useEffect(() => {
  fetchCategories('active', null) // Fetch active categories
}, [])
```

### Create Category:
```javascript
const { createCategory } = useCategories()

const handleCreate = async () => {
  const formData = new FormData()
  formData.append('name_ar', 'اسم')
  formData.append('name_en', 'Name')
  formData.append('description_ar', 'الوصف')
  formData.append('description_en', 'Description')
  formData.append('image', imageFile)
  formData.append('status', 'active')

  try {
    await createCategory(formData)
    // Success
  } catch (err) {
    // Error handling
  }
}
```

### Update Category:
```javascript
const { updateCategory } = useCategories()

const handleUpdate = async (id) => {
  const formData = new FormData()
  // Append data...
  await updateCategory(id, formData)
}
```

### Delete Category:
```javascript
const { deleteCategory } = useCategories()

const handleDelete = async (id) => {
  await deleteCategory(id)
}
```

---

## ⚙️ API Configuration

The API base URL is configured in `api/api.js`:

```javascript
export const api = axios.create({
  baseURL: 'http://192.168.1.66:8000/api/',
  headers: {
    'Content-Type': 'application/json',
    accept: 'application/json',
  },
})
```

### To change the API URL:
Edit the `baseURL` in `api/api.js`:
```javascript
baseURL: 'http://your-api-url/api/',
```

---

## 🔄 Request Interceptor

The API automatically adds the Bearer token to all requests:

```javascript
api.interceptors.request.use((config) => {
  const token = cookies.get('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})
```

---

## ✨ Features Implemented

### ✅ Authentication
- [x] Login
- [x] Register
- [x] Logout
- [x] Forgot Password
- [x] Reset Password
- [x] Email Verification
- [x] Account Deletion
- [x] Get User Profile

### ✅ Categories Management
- [x] View All Categories
- [x] View Single Category
- [x] Create Category
- [x] Update Category
- [x] Delete Category
- [x] Filter by Status
- [x] Search by Name

### ✅ Role-Based Access Control
- [x] Protected Routes
- [x] Role-Based Navigation
- [x] Admin/Super-Admin Only Features

### ✅ User Experience
- [x] Loading States
- [x] Error Handling
- [x] Success Messages
- [x] Form Validation
- [x] Image Preview

---

## 📦 Dependencies

- `@coreui/react` - UI Components
- `axios` - HTTP Client
- `react-router-dom` - Routing
- `universal-cookie` - Cookie Management
- `sweetalert2` - Alert/Modal Dialogs
- `redux` & `react-redux` - State Management

---

## 🚀 Getting Started

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Start Development Server:**
   ```bash
   npm start
   ```

3. **Build for Production:**
   ```bash
   npm run build
   ```

---

## 📚 Additional Resources

- [CoreUI React Documentation](https://coreui.io/react/docs/)
- [Axios Documentation](https://axios-http.com/)
- [React Router Documentation](https://reactrouter.com/)
- [Redux Documentation](https://redux.js.org/)

---

## 🆘 Troubleshooting

### Token Not Being Sent
- Check that token is stored in cookies
- Verify interceptor is set up correctly
- Check browser DevTools Network tab

### CORS Issues
- Ensure API server has CORS enabled
- Check API URL in `api/api.js`

### Routes Not Working
- Verify routes are exported in `routes.js`
- Check navigation menu in `_nav.js`
- Ensure ProtectedRoute wrapper is correctly applied

---

## 📞 Support

For issues or questions, please check:
1. The documentation above
2. Console errors in browser DevTools
3. API response errors
4. Backend API logs

---

**Last Updated:** 2024
**Version:** 1.0.0