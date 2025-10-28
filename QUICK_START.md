# 🚀 Quick Start Guide

## ⏱️ 5-Minute Setup

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Configure API URL
Open `api/api.js` and update the API URL:

```javascript
// Line 9 - Change this to your API URL
baseURL: 'http://your-api-url:8000/api/',
```

### Step 3: Start Development Server
```bash
npm start
```

### Step 4: Access the Application
```
http://localhost:3000
```

---

## 🔐 Default Routes

```
/login                  → User Login
/register               → User Registration  
/forgot-password        → Password Recovery
/dashboard             → Main Dashboard
/categories            → Categories Management (Admin Only)
/account-settings      → Account & Profile Management
```

---

## 👤 Testing with Demo Credentials

Use your backend API credentials:
```
Email: your-email@example.com
Password: your-password
```

---

## 🎯 Key Features Ready to Use

### ✅ Authentication
- Login / Register / Logout
- Password Reset Flow
- Email Verification
- Account Management

### ✅ Categories Management
- Create, Read, Update, Delete
- Search & Filter
- Image Upload
- Multi-language Support (AR/EN)

### ✅ Security
- Automatic Bearer Token Injection
- Role-Based Access Control
- Protected Routes

---

## 📁 Project Structure

```
src/
├── api/api.js                    ← All API endpoints
├── Context/AuthContext.jsx       ← Auth state management
├── hooks/useCategories.js        ← Categories logic
├── views/
│   ├── categories/               ← Categories pages
│   ├── pages/auth/               ← Auth pages
│   └── pages/account/            ← Account settings
└── routes.js                     ← All routes defined
```

---

## 🔑 Important Files

| File | Purpose |
|------|---------|
| `api/api.js` | All 14 API endpoints |
| `AuthContext.jsx` | User authentication state |
| `useCategories.js` | Categories CRUD operations |
| `routes.js` | Route configuration |
| `_nav.js` | Sidebar navigation |

---

## 🧪 Test Each Endpoint

### Login
```bash
1. Go to /login
2. Enter credentials
3. You should be redirected to dashboard
4. Token saved in cookies ✅
```

### Create Category
```bash
1. Login as admin/super-admin
2. Go to /categories
3. Click "Add Category"
4. Fill form (name, description, image, status)
5. Click save ✅
```

### Search Categories
```bash
1. Go to /categories
2. Enter search term in search box
3. Results auto-filter ✅
```

### Delete Category
```bash
1. Go to /categories
2. Click delete button
3. Confirm in modal
4. Category removed ✅
```

---

## 🐛 Troubleshooting

### Issue: CORS Error
**Solution:** Make sure backend has CORS enabled and API URL is correct

### Issue: Token Not Working
**Solution:** Check if token is stored in cookies (DevTools → Application → Cookies)

### Issue: Login Redirects to /login
**Solution:** Verify API credentials and backend is running

### Issue: Image Upload Fails
**Solution:** Ensure file size is not too large and format is supported

### Issue: Categories Not Loading
**Solution:** Verify you're logged in as admin/super-admin role

---

## 📚 Documentation Files

| File | Description |
|------|-------------|
| `API_DOCUMENTATION.md` | Complete API reference |
| `POSTMAN_IMPLEMENTATION_CHECKLIST.md` | Detailed endpoint mapping |
| `PROJECT_COMPLETION_SUMMARY.md` | Project overview |
| `QUICK_START.md` | This file |

---

## 🎓 Code Examples

### Using AuthContext in Components
```jsx
import { useAuth } from '../Context/AuthContext'

export function MyComponent() {
  const { user, token, login, logout } = useAuth()
  
  return (
    <div>
      <p>Hello, {user?.name}</p>
      <button onClick={logout}>Logout</button>
    </div>
  )
}
```

### Using Categories Hook in Components
```jsx
import { useCategories } from '../hooks/useCategories'

export function CategoriesPage() {
  const { categories, loading, fetchCategories, createCategory } = useCategories()
  
  useEffect(() => {
    fetchCategories()
  }, [])
  
  return (
    <div>
      {loading && <Spinner />}
      {categories.map(cat => <div key={cat.id}>{cat.name_en}</div>)}
    </div>
  )
}
```

### Making API Calls
```jsx
import { authAPI, categoriesAPI } from '../api/api'

// Login
await authAPI.login('email@test.com', 'password')

// Get all categories
await categoriesAPI.getAll('active', 'search term')

// Create category
const formData = new FormData()
formData.append('name_ar', 'Arabic Name')
formData.append('image', fileInput.files[0])
await categoriesAPI.create(formData)
```

---

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Test Production Build
```bash
npm run serve
```

### Deploy
Upload the `dist/` folder to your hosting service

---

## ✅ Checklist Before Deploy

- [ ] API URL updated in `api/api.js`
- [ ] Tested login functionality
- [ ] Tested category CRUD operations
- [ ] Verified role-based access works
- [ ] Checked error handling
- [ ] Tested image uploads
- [ ] Tested search & filters
- [ ] Verified responsive design

---

## 📞 Need Help?

1. Check the full `API_DOCUMENTATION.md`
2. Review `POSTMAN_IMPLEMENTATION_CHECKLIST.md`
3. Check browser console for errors
4. Verify backend API is responding correctly
5. Check network tab in DevTools

---

## 🎉 You're All Set!

Your CoreUI React Admin Template is now:
- ✅ Fully configured with API endpoints
- ✅ Ready for authentication testing
- ✅ Ready for categories management testing
- ✅ Production-ready

**Start the dev server and begin testing:**
```bash
npm start
```

Happy coding! 🚀