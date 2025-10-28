# 🔧 Troubleshooting Guide

## Common Issues & Solutions

---

## 🔴 Authentication Issues

### Issue 1: Login Always Redirects Back to /login
**Symptoms:**
- Enter credentials and click login
- Redirected back to login page
- No error message shown

**Possible Causes:**
1. API URL is incorrect
2. Backend is not running
3. Credentials are wrong
4. Backend validation failing

**Solutions:**
```javascript
// 1. Check API URL in api/api.js (line 9)
baseURL: 'http://192.168.1.66:8000/api/', // ← Verify this is correct

// 2. Test API directly in browser:
// Open DevTools → Network tab
// Try login and check network requests
// Look for 401, 500 errors

// 3. Check credentials match backend
// Use same email/password that work in Postman

// 4. Check browser console for detailed error
// Press F12 → Console tab
// Look for specific error messages
```

**Debug Steps:**
```javascript
// Add this in Login.js temporarily for debugging:
const handleLogin = async (e) => {
  e.preventDefault()
  try {
    const result = await login(email, password)
    console.log('Login response:', result) // Add this
  } catch (error) {
    console.error('Login error:', error.response?.data) // Add this
  }
}
```

---

### Issue 2: Token Not Being Saved to Cookies
**Symptoms:**
- Login works but token not in cookies
- Refresh page and logged out
- Subsequent requests fail with 401

**Possible Causes:**
1. Cookies not being set by browser
2. Cookie settings blocked
3. Response doesn't contain token

**Solutions:**
```javascript
// 1. Check if cookies are enabled
// DevTools → Application → Cookies
// Should see 'token' and 'user' cookies

// 2. Check response format from API
// The API returns token in response.data.data.token
// Or response.data.data.auth_token
// Update AuthContext.jsx if format is different (line 32-33)

// 3. Check if backend sets Set-Cookie header
// DevTools → Network → Select login request
// Look for 'Set-Cookie' in Response Headers

// 4. If still failing, check AuthContext.jsx:
const setAuthData = (userData, tokenData) => {
  setUser(userData)
  setRole(userData?.role || null)
  setToken(tokenData)
  cookies.set('user', JSON.stringify(userData), { path: '/' })
  cookies.set('token', tokenData, { path: '/' }) // Verify this runs
}
```

---

### Issue 3: "Unauthorized" or 401 Errors
**Symptoms:**
- Login successful
- Categories page shows 401 error
- Token seems to be saved

**Possible Causes:**
1. Token format is wrong (missing "Bearer")
2. Token expired
3. Backend expects different header format

**Solutions:**
```javascript
// 1. Check token is sent with "Bearer" prefix
// In api/api.js interceptor (line 20):
config.headers.Authorization = `Bearer ${token}` // Must have "Bearer "

// 2. Verify header is being sent
// DevTools → Network → Select any API request
// Look in Request Headers for: Authorization: Bearer [token]

// 3. Token lifetime issue
// Check backend token expiration
// May need to implement token refresh

// 4. Test in Postman to verify token works
// Use same token that failed in app
// If it works in Postman but not app, issue is in app code
```

---

### Issue 4: Email Verification Not Working
**Symptoms:**
- Send verification code doesn't trigger
- Verify email page shows errors
- Code always invalid

**Possible Causes:**
1. Not authenticated when sending code
2. Code format wrong
3. API endpoint incorrect

**Solutions:**
```javascript
// 1. Ensure you're logged in before sending code
// Check AuthContext - user should exist

// 2. Check VerifyEmail.jsx code format
// Backend expects numeric code
// Make sure input accepts only numbers

// 3. Verify endpoint in api/api.js:
// sendVerificationCode: () => {
//   return api.post('send-verification-code') // ← Correct endpoint
// }

// 4. Try in Postman first with same token
// Use this token in your app to narrow down issue
```

---

### Issue 5: Reset Password Not Working
**Symptoms:**
- Forgot password sends email but reset fails
- OTP always invalid
- Password reset errors

**Possible Causes:**
1. OTP expired
2. OTP format incorrect
3. Password requirements not met
4. Email mismatch

**Solutions:**
```javascript
// 1. Check password requirements
// Typically: min 8 chars, include numbers/special chars
// Backend validation might be stricter

// 2. Verify OTP format
// In ResetPassword.jsx, ensure:
// - OTP is exactly as sent to email
// - No spaces or formatting
// - Numeric value

// 3. Email must match forgot-password request
// Cannot use different email in reset

// 4. OTP expiration
// Test within a few minutes of requesting OTP
// Backend might have 5-10 min expiration

// 5. Test with Postman first:
// POST /reset-password
// Body: {email, otp, password, re_password}
// Should work with same values as app
```

---

## 📂 Categories Issues

### Issue 6: Categories Not Loading
**Symptoms:**
- /categories page loads but no data
- Spinner shows forever
- No error message

**Possible Causes:**
1. Not logged in with admin role
2. API call failing silently
3. Response format different than expected

**Solutions:**
```javascript
// 1. Check user role
// Add temporary console log in Categories.jsx:
console.log('Current user role:', localStorage.getItem('role'))
// Must be 'admin' or 'super-admin'

// 2. Check if admin user exists
// Verify in backend that you have admin account
// Try login with admin credentials

// 3. Check API response format
// In browser DevTools → Network tab
// Select categories request
// Check Response tab to see actual data format

// 4. May need to update fetchCategories parsing:
// In useCategories.js line 16:
const res = await categoriesAPI.getAll(status, search)
setCategories(res.data.data || res.data) // ← May need adjustment
// If data is in res.data.data, this works
// If data is in res.data directly, adjust

// 5. Check error state
// Add this to Categories.jsx temporarily:
{error && <CAlert color="danger">{error}</CAlert>}
// Will show what's wrong
```

---

### Issue 7: Image Upload Failing
**Symptoms:**
- Upload button doesn't work
- Image not showing in preview
- "File type not allowed" error

**Possible Causes:**
1. File size too large
2. File type not supported
3. FormData not created correctly
4. Backend restrictions

**Solutions:**
```javascript
// 1. Check file size limits
// Backend might have max 2MB, 5MB, 10MB limit
// Compress image before uploading
// Test with small image first

// 2. Check supported formats
// Usually: jpg, jpeg, png, gif, webp
// Try different format if current one fails

// 3. Verify FormData creation in CategoryForm.jsx:
const handleImageChange = (e) => {
  const file = e.target.files[0]
  if (file) {
    setFormData({...formData, image: file})
    // Preview
    const reader = new FileReader()
    reader.onloadend = () => setImagePreview(reader.result)
    reader.readAsDataURL(file)
  }
}

// 4. Check form submission:
const handleSubmit = (e) => {
  e.preventDefault()
  const formDataToSend = new FormData()
  formDataToSend.append('image', formData.image) // ← Include file
  formDataToSend.append('name_ar', formData.name_ar)
  // ... append other fields
  // Then send via API
}

// 5. Test in Postman:
// Select form-data in body
// Add image file in image field
// Try same request from Postman
// If works in Postman, issue is in React code
```

---

### Issue 8: Category Search Not Working
**Symptoms:**
- Type in search box, nothing happens
- Search results not updating
- Search filters not applying

**Possible Causes:**
1. Search term not being passed to API
2. API endpoint doesn't support search
3. Search case sensitivity issue

**Solutions:**
```javascript
// 1. Check search is passed to API:
// In Categories.jsx, verify handleSearch calls fetchCategories:
const handleSearch = (e) => {
  setSearchTerm(e.target.value)
  // Should also fetch here or on button click
  loadCategories() // Call this with new search term
}

// 2. Verify API receives search param:
// In api/api.js line 97:
getAll: (status = null, search = null) => {
  const params = {}
  if (status) params.status = status
  if (search) params.search = search // ← Search passed as query param
  return api.get('categories', { params })
}

// 3. Check network request:
// DevTools → Network → categories request
// In URL should see: ...categories?search=yourterm
// If not there, search not being passed

// 4. Backend might need exact match
// Try full word instead of partial
// Or API might search only certain fields

// 5. Add loading state while searching:
// Show spinner while fetching results
// Prevents user thinking nothing happened
```

---

### Issue 9: Delete Category Confirmation Not Showing
**Symptoms:**
- Click delete button, nothing happens
- SweetAlert modal doesn't appear
- Category deletes without confirmation

**Possible Causes:**
1. SweetAlert not imported correctly
2. Confirmation dialog logic wrong
3. Delete called without confirmation

**Solutions:**
```javascript
// 1. Check SweetAlert import in Categories.jsx:
import Swal from 'sweetalert2'

// 2. Verify confirmation flow:
const handleDelete = async (id) => {
  const confirmed = await Swal.fire({
    title: 'Delete?',
    text: 'Cannot undo this',
    icon: 'warning',
    showCancelButton: true,
  })
  
  if (confirmed.isConfirmed) {
    // Only delete if confirmed
    await deleteCategory(id)
  }
}

// 3. Check delete button calls correct function:
// Should call handleDelete(id), not deleteCategory(id) directly

// 4. Test SweetAlert works:
// Add test button to test:
<button onClick={() => Swal.fire('Test')}>Test Alert</button>
// If this works, SweetAlert is fine
// If not, there's import/package issue
```

---

## 🌐 Network & API Issues

### Issue 10: "Cannot POST /api/categories"
**Symptoms:**
- API endpoints not found
- 404 errors on all requests
- Network shows "failed" status

**Possible Causes:**
1. Wrong API URL
2. Backend not running
3. Wrong endpoint path

**Solutions:**
```javascript
// 1. Verify API URL in api/api.js:
baseURL: 'http://192.168.1.66:8000/api/', // ← Check this

// 2. Test API URL is correct:
// Open this in browser:
// http://192.168.1.66:8000/api/
// Should return some response, not 404

// 3. Verify backend is running:
// Try running backend locally first
// If Docker, ensure container is running
// Check logs for startup errors

// 4. CORS issue might show as 404:
// Check backend CORS configuration
// Should allow requests from http://localhost:3000

// 5. Test individual endpoint:
// In Postman, use exact API URL
// If works in Postman, app issue
// If fails in Postman, backend issue
```

---

### Issue 11: CORS (Cross-Origin) Errors
**Symptoms:**
- Console shows: "Access to XMLHttpRequest blocked by CORS"
- Requests fail with no response
- Works in Postman but not browser

**Solutions:**
```javascript
// 1. Backend needs CORS headers
// Contact backend developer to enable CORS
// Should include Access-Control-Allow-* headers

// 2. Common CORS configuration (backend):
// Allow-Origin: http://localhost:3000
// Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
// Allow-Headers: Content-Type, Authorization

// 3. For development with different backend:
// Use CORS proxy (temporary solution):
// In api/api.js:
// baseURL: 'https://cors-anywhere.herokuapp.com/http://your-backend-url/api/'
// Not recommended for production

// 4. Verify backend returns OPTIONS response
// Should handle preflight requests

// 5. Check if credentials needed:
// In api.js add:
// withCredentials: true
// If backend requires credentials
```

---

### Issue 12: Timeout or Slow Requests
**Symptoms:**
- Requests take very long
- Spinner spins for 30+ seconds
- Eventually shows timeout error

**Possible Causes:**
1. Backend is slow
2. Network connection slow
3. Large response data
4. Backend not optimized

**Solutions:**
```javascript
// 1. Set request timeout in api/api.js:
export const api = axios.create({
  baseURL: 'http://192.168.1.66:8000/api/',
  timeout: 10000, // 10 seconds
  headers: {...}
})

// 2. Test backend response time:
// Use Postman to time requests
// DevTools → Network → see response time
// If slow in Postman, backend is slow

// 3. Check network tab timing:
// DevTools → Network
// Look at "Time" column
// Identify which part is slow:
// - Queueing: browser waiting
// - Stalled: connection setup
// - Request: sending request
// - Waiting: waiting for response (TTFB)
// - Download: downloading response

// 4. Optimize if backend slow:
// Add pagination to categories list
// Limit returned fields
// Add indexes to database

// 5. Add abort controller for cancellation:
// Prevents hanging requests if user navigates away
```

---

## 🔒 Security & Permission Issues

### Issue 13: "Access Denied" or Permission Error
**Symptoms:**
- Can login but some pages show access denied
- Categories page shows "Forbidden"
- Some API calls return 403

**Possible Causes:**
1. Not admin/super-admin role for admin-only pages
2. Role not loaded correctly
3. Backend permissions misconfigured

**Solutions:**
```javascript
// 1. Check your user role:
// Open DevTools → Application → Cookies
// Look for 'user' cookie
// Should contain role: "admin" or "super-admin"

// 2. Verify role is loaded in AuthContext:
// In AuthContext.jsx line 14:
const [role, setRole] = useState(user?.role || null)
// If user not loaded properly, role will be null

// 3. Check route protection in routes.js:
// Categories route should check for admin role:
// const isAdmin = user?.role === 'admin' || user?.role === 'super-admin'

// 4. Verify backend returns user with role:
// Test /user endpoint in Postman
// Response should include: {user: {id, name, role, ...}}

// 5. Login with correct user:
// Use admin account for admin pages
// Regular users cannot access /categories
```

---

## 💾 Data & State Issues

### Issue 14: Data Not Persisting After Refresh
**Symptoms:**
- Login works
- Refresh page and logged out
- User data lost
- Categories list cleared

**Possible Causes:**
1. Cookies not being set
2. Cookies being cleared by browser
3. Cookie settings wrong

**Solutions:**
```javascript
// 1. Verify cookies are saved:
// DevTools → Application → Cookies
// Check for 'token' and 'user' cookies
// Should show path: /

// 2. Check cookie settings in AuthContext:
// Line 22-23:
// cookies.set('user', JSON.stringify(userData), { path: '/' })
// cookies.set('token', tokenData, { path: '/' })
// Both lines must execute

// 3. Check browser cookie settings:
// DevTools → Settings → Privacy
// Cookies should be allowed
// Not in private/incognito mode

// 4. Add error logging:
// In setAuthData function:
console.log('Saving to cookies:', userData)
cookies.set('user', JSON.stringify(userData), { path: '/' })
console.log('Cookie set:', cookies.get('user'))

// 5. If still not working:
// Use localStorage as fallback (less secure):
// localStorage.setItem('token', tokenData)
// localStorage.getItem('token')
```

---

## 📝 Form Validation Issues

### Issue 15: Form Accepts Invalid Data
**Symptoms:**
- Can submit empty name field
- Image validation not working
- Can submit non-matching passwords

**Solutions:**
```javascript
// 1. Add HTML5 validation:
<input type="email" required />
<input type="password" minLength="8" required />

// 2. Add JS validation:
const handleSubmit = (e) => {
  e.preventDefault()
  
  // Validate before submit
  if (!formData.name_en || !formData.name_ar) {
    setSubmitError('All names required')
    return
  }
  
  if (formData.image && formData.image.size > 5 * 1024 * 1024) {
    setSubmitError('Image too large (max 5MB)')
    return
  }
  
  // Then submit
  submitForm()
}

// 3. Show validation errors:
{submitError && <CAlert color="danger">{submitError}</CAlert>}

// 4. Real-time validation:
const handleNameChange = (e) => {
  const value = e.target.value
  if (value.length < 3) {
    setNameError('Min 3 characters')
  } else {
    setNameError(null)
  }
}
```

---

## 🎯 General Debugging Steps

### When Something Goes Wrong:

**Step 1: Check Browser Console**
```
Press F12 → Console tab
Look for red error messages
Copy full error text
Search for solution online
```

**Step 2: Check Network Tab**
```
Press F12 → Network tab
Make action that fails
Look at failed requests
Check status code:
  - 200: Success
  - 400: Bad request (validation error)
  - 401: Unauthorized (token issue)
  - 403: Forbidden (permission issue)
  - 404: Not found (wrong URL)
  - 500: Server error (backend issue)
```

**Step 3: Check Application/Storage**
```
Press F12 → Application tab
Check Cookies → token, user
Check LocalStorage → any saved data
Verify data looks correct
```

**Step 4: Test with Postman**
```
Copy exact request from Network tab
Try same request in Postman
If works in Postman:
  → Issue is in React app code
If fails in Postman:
  → Issue is in backend API
```

**Step 5: Add Console Logs**
```javascript
// Before API call
console.log('Sending request:', {email, password})

// In catch block
console.log('Error response:', error.response?.data)
console.log('Error status:', error.response?.status)

// After success
console.log('Success response:', response.data)
```

---

## 📞 Still Need Help?

1. **Check these files first:**
   - `API_DOCUMENTATION.md` - API reference
   - `POSTMAN_IMPLEMENTATION_CHECKLIST.md` - Endpoint details
   - `QUICK_START.md` - Setup help

2. **Ask yourself:**
   - Does it work in Postman?
   - Are cookies being saved?
   - What's the exact error message?
   - When did this last work?

3. **Gather info before asking for help:**
   - Full error message from console
   - Screenshot of Network tab
   - Exact steps to reproduce
   - What browser/OS you're using

---

**Good luck! Most issues are either API URL or backend problems.** 🚀