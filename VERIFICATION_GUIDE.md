# 🔍 Local Verification Guide

## How to Verify Implementation is Complete

Follow this guide to verify every feature is working correctly in your local environment.

---

## ✅ Pre-Verification Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm start
```

### 3. Verify Server Started
```
Browser should open to http://localhost:3000
Should see CoreUI dashboard or login page
```

### 4. Prepare Test Credentials
```
Get from your backend:
- Admin email/password
- Regular user email/password
- Test OTP for email verification
```

---

## 🔐 Authentication Endpoints Verification

### Test 1: Login Endpoint ✅
**File:** `api/api.js` line 29-34

**Verification Steps:**
1. Navigate to `/login`
2. Enter email: `test@example.com`
3. Enter password: `testpassword`
4. Click "Login"

**Expected Results:**
- [ ] No error shown
- [ ] Redirected to `/dashboard`
- [ ] Check cookies: `token` and `user` should exist
- [ ] DevTools → Application → Cookies → Should see both

**Network Check:**
- [ ] Open DevTools → Network tab
- [ ] Filter by "login"
- [ ] Request should show: `POST http://your-api/api/login`
- [ ] Response should contain: `token` or `auth_token`
- [ ] Status should be 200

**How to Check:**
```javascript
// In browser console:
document.cookie
// Should output: token=...; user=...;
```

---

### Test 2: Register Endpoint ✅
**File:** `api/api.js` line 37-39

**Verification Steps:**
1. Navigate to `/register` (or create link)
2. Fill form:
   - Name: Test User
   - Email: test@test.com
   - Password: 12345678
   - Confirm: 12345678
   - Image: (optional)
3. Click Register

**Expected Results:**
- [ ] Registration successful message
- [ ] Redirected to dashboard or login
- [ ] New user created in backend
- [ ] Token received and saved

**Verify in Code:**
```javascript
// src/Context/AuthContext.jsx around line 46
const register = async (formData) => {
  // Should call authAPI.register(formData)
  // Should handle FormData with file
}
```

---

### Test 3: Logout Endpoint ✅
**File:** `api/api.js` line 42-44

**Verification Steps:**
1. Must be logged in
2. Find logout button (header or menu)
3. Click logout

**Expected Results:**
- [ ] Logged out successfully
- [ ] Redirected to login
- [ ] Cookies cleared
- [ ] Check cookies empty

**Verify:**
```javascript
// In browser console after logout:
document.cookie
// Should be empty or only have expired tokens
```

---

### Test 4: Get Profile Endpoint ✅
**File:** `api/api.js` line 47-49

**Verification Steps:**
1. Login with valid account
2. Navigate to `/account-settings`
3. Should show profile info

**Expected Results:**
- [ ] Profile information displayed
- [ ] Shows name, email, role
- [ ] Image shows if available
- [ ] No loading spinner after data loads

**Verify in Network:**
- [ ] Open DevTools → Network
- [ ] Filter by "user"
- [ ] Should see `GET /user` request
- [ ] Status 200, response has user data

---

### Test 5: Send Verification Code ✅
**File:** `api/api.js` line 52-54

**Verification Steps:**
1. Login with account
2. Navigate to `/verify-email`
3. Click "Send Verification Code"

**Expected Results:**
- [ ] Button shows loading state
- [ ] Success message appears
- [ ] Code sent to email (check backend logs)
- [ ] No error messages

**Backend Verification:**
- Verify email was sent with code
- Check backend logs for confirmation

---

### Test 6: Verify Email Endpoint ✅
**File:** `api/api.js` line 57-61

**Verification Steps:**
1. After sending code, on `/verify-email`
2. Enter code from email
3. Click verify

**Expected Results:**
- [ ] Button shows loading
- [ ] Success message shown
- [ ] Email marked as verified in backend
- [ ] Can proceed to dashboard

**Verify:**
```javascript
// In api.js line 60:
return api.post('verify-code', formData)
// FormData should contain 'code' key
```

---

### Test 7: Forgot Password Endpoint ✅
**File:** `api/api.js` line 64-70

**Verification Steps:**
1. NOT logged in (public page)
2. Navigate to `/forgot-password`
3. Enter email
4. Click "Send Recovery Link"

**Expected Results:**
- [ ] Success message
- [ ] OTP sent to email
- [ ] Can redirect to reset password page
- [ ] No authentication header sent

**Important Check:**
```javascript
// Line 68 - Should NOT have Bearer token for this request:
headers: { Authorization: '' } // Removes auth header
```

---

### Test 8: Reset Password Endpoint ✅
**File:** `api/api.js` line 73-82

**Verification Steps:**
1. Navigate to `/reset-password`
2. Enter:
   - Email: your@email.com
   - OTP: received in email
   - New Password: newpass123
   - Confirm: newpass123
3. Click Reset

**Expected Results:**
- [ ] Success message
- [ ] Redirected to login
- [ ] Can login with new password
- [ ] No authentication required

**Verify Form Fields:**
- [ ] All 4 fields present
- [ ] OTP input accepts numbers
- [ ] Password confirmation validated

---

### Test 9: Delete Account Endpoint ✅
**File:** `api/api.js` line 85-87

**Verification Steps:**
1. Login with test account
2. Go to `/account-settings`
3. Scroll to "Delete Account"
4. Click delete button

**Expected Results:**
- [ ] Confirmation modal appears
- [ ] Warning about permanent deletion
- [ ] Cancel/Confirm buttons
- [ ] Click Confirm → Account deleted
- [ ] Logged out automatically
- [ ] Redirected to login

**Verify:**
```javascript
// Should use SweetAlert for confirmation
// In AccountSettings.jsx:
const handleDelete = async () => {
  const result = await Swal.fire({
    title: 'Delete Account?',
    text: 'Cannot undo',
    icon: 'warning',
    showCancelButton: true,
  })
  if (result.isConfirmed) {
    await deleteAccount()
  }
}
```

---

## 📂 Categories Endpoints Verification

### Test 10: Get All Categories ✅
**File:** `api/api.js` line 94-99

**Verification Steps:**
1. Login as admin/super-admin
2. Click "Categories" in sidebar
3. Page loads categories list

**Expected Results:**
- [ ] Table shows categories
- [ ] Loading spinner appears then disappears
- [ ] No error messages
- [ ] Each row shows: name, description, status, actions

**Verify in Network:**
- [ ] Request: `GET /categories`
- [ ] Query params show filters
- [ ] Response: Array of categories

---

### Test 11: Get All Categories with Search ✅
**File:** `src/views/categories/Categories.jsx` line 48-50

**Verification Steps:**
1. On Categories page
2. Type in search box: "test"
3. Press search button or auto-search

**Expected Results:**
- [ ] Results filtered
- [ ] Only matching categories shown
- [ ] Or message "No results found"

**Verify in Network:**
```
URL should include: ?search=test
Response should be filtered
```

---

### Test 12: Get All Categories with Filter ✅
**File:** `src/views/categories/Categories.jsx` line 52-54

**Verification Steps:**
1. On Categories page
2. Select "active" from status dropdown
3. Click "Filter" or auto-apply

**Expected Results:**
- [ ] Only active categories shown
- [ ] Filter resets or shows current selection
- [ ] Count updates

**Verify in Network:**
```
URL should include: ?status=active
```

---

### Test 13: Get Single Category ✅
**File:** `api/api.js` line 102-104

**Verification Steps:**
1. On Categories page
2. Click "Edit" button on any category
3. Edit form opens

**Expected Results:**
- [ ] Form loads with category data
- [ ] All fields pre-filled
- [ ] Image preview shows
- [ ] No error loading

**Verify in Network:**
```
Request: GET /categories/[id]
Response: Single category object
```

---

### Test 14: Create Category ✅
**File:** `api/api.js` line 107-113

**Verification Steps:**
1. On Categories page
2. Click "Add Category" button
3. Fill form:
   - Name (AR): اسم عربي
   - Name (EN): English Name
   - Description (AR): وصف عربي
   - Description (EN): English Description
   - Status: active
   - Image: Select file (optional)
4. Click Save

**Expected Results:**
- [ ] Success message
- [ ] New category appears in list
- [ ] Form closes or clears
- [ ] No error messages

**Verify in Network:**
```
Request: POST /categories
Content-Type: multipart/form-data
Body: All form fields + image file
Response: 200, new category object
```

**Verify in Code:**
```javascript
// In CategoryForm.jsx:
// handleSubmit should create FormData:
const formDataToSend = new FormData()
formDataToSend.append('name_ar', formData.name_ar)
formDataToSend.append('name_en', formData.name_en)
formDataToSend.append('description_ar', formData.description_ar)
formDataToSend.append('description_en', formData.description_en)
formDataToSend.append('image', formData.image)
formDataToSend.append('status', formData.status)
await createCategory(formDataToSend)
```

---

### Test 15: Update Category ✅
**File:** `api/api.js` line 116-123

**Verification Steps:**
1. On Categories page
2. Click "Edit" on existing category
3. Change some fields
4. Upload new image (optional)
5. Click Save

**Expected Results:**
- [ ] Success message
- [ ] Changes reflected in list
- [ ] Image updated if changed
- [ ] Status updated correctly
- [ ] All fields updated

**Verify in Network:**
```
Request: POST /categories/[id]?_method=PUT
Content-Type: multipart/form-data
Note: _method=PUT in URL (Laravel form override)
Response: 200, updated category
```

**Verify Method Override:**
```javascript
// In api.js line 117:
formData.append('_method', 'PUT')
// This is required for Laravel to recognize as PUT
```

---

### Test 16: Delete Category ✅
**File:** `api/api.js` line 126-128

**Verification Steps:**
1. On Categories page
2. Click delete button on any category
3. Confirmation modal appears
4. Click Confirm

**Expected Results:**
- [ ] Confirmation modal shown
- [ ] Warning message displayed
- [ ] Cancel/Confirm buttons
- [ ] After confirm: Category removed
- [ ] Success message shown
- [ ] Category gone from list

**Verify in Network:**
```
Request: DELETE /categories/[id]
Response: 200, success message
```

---

## 🔒 Security Verification

### Test 17: Token Injection ✅
**Verification:**
1. Login successfully
2. Open DevTools → Network tab
3. Make any API request (view categories, etc.)
4. Click request to view details
5. Go to "Request Headers" tab

**Expected:**
```
Authorization: Bearer [your-token-here]
```

**Should be on ALL requests:**
- [ ] `/categories` requests have Bearer token
- [ ] `/user` request has Bearer token
- [ ] Logout request has Bearer token
- [ ] Delete account has Bearer token

**Login/Register should NOT have token:**
- [ ] `/login` - no Authorization header
- [ ] `/register` - no Authorization header
- [ ] `/forgot-password` - no Authorization header
- [ ] `/reset-password` - no Authorization header

---

### Test 18: Role-Based Access ✅
**Verification:**

**Admin User:**
1. Login as admin
2. Should access `/categories`
3. Should see "Categories" in sidebar
4. CRUD operations work

**Regular User:**
1. Login as regular user
2. Navigate to `/categories`
3. Should see "Access Denied" or 403 error
4. "Categories" not in sidebar

**Not Logged In:**
1. Logout
2. Try to access `/categories`
3. Should redirect to `/login`

---

## 📱 UI/UX Verification

### Test 19: Loading States ✅
**Verification:**

When making API requests:
- [ ] Spinner appears
- [ ] Button becomes disabled
- [ ] User cannot double-submit
- [ ] Spinner disappears after response

**Test in:**
- [ ] Login page
- [ ] Create category form
- [ ] Delete category
- [ ] Load categories list

---

### Test 20: Error Handling ✅
**Verification:**

Test error scenarios:
- [ ] Wrong login credentials → Error message shown
- [ ] Network error → Friendly error message
- [ ] Missing required fields → Validation error
- [ ] File too large → Error shown
- [ ] Invalid email format → Validation error

**Check that:**
- [ ] Errors don't crash app
- [ ] Error messages are clear
- [ ] User can retry
- [ ] Form stays filled (except password)

---

### Test 21: Image Preview ✅
**Verification:**

In Category form:
1. Click file input
2. Select image file
3. Before submitting, image should preview

**Expected:**
- [ ] Image preview appears
- [ ] Shows before upload
- [ ] Clear/change option available
- [ ] File size shown

---

### Test 22: Confirmation Dialogs ✅
**Verification:**

Testing Delete operations:
1. Click any delete button
2. SweetAlert modal appears
3. Shows warning message
4. Has Cancel and Confirm buttons

**Verify:**
- [ ] Cancel button cancels deletion
- [ ] Confirm button proceeds
- [ ] Message is clear
- [ ] No accidental deletions

---

## 🧪 Form Validation Verification

### Test 23: Required Fields ✅
**Test in Create Category form:**

Try submitting with empty fields:
- [ ] Name (AR) required
- [ ] Name (EN) required
- [ ] Status required
- [ ] Form shows error before submit
- [ ] Server rejects if empty

---

### Test 24: Email Validation ✅
**Test in Login/Register:**

Try invalid emails:
- [ ] `invalid` - Should reject
- [ ] `test@` - Should reject
- [ ] `@example.com` - Should reject
- [ ] `test@example.com` - Should accept

---

### Test 25: Password Confirmation ✅
**Test in Register/Reset Password:**

1. Enter password: `Test@123`
2. Enter confirm: `Test@124` (different)
3. Should show mismatch error
4. Change confirm to match: `Test@123`
5. Should allow submit

---

## 🌐 Routing Verification

### Test 26: Protected Routes ✅
**Not Logged In:**
- [ ] Access `/categories` → redirect to `/login`
- [ ] Access `/account-settings` → redirect to `/login`
- [ ] Access `/verify-email` → redirect to `/login`

**Logged In - Regular User:**
- [ ] Access `/dashboard` → works
- [ ] Access `/account-settings` → works
- [ ] Access `/categories` → denied (admin only)

**Logged In - Admin User:**
- [ ] All routes work
- [ ] Including `/categories`

---

### Test 27: Public Routes ✅
**Not Logged In:**
- [ ] `/login` → accessible
- [ ] `/register` → accessible
- [ ] `/forgot-password` → accessible
- [ ] `/reset-password` → accessible

---

## 📊 Final Verification Checklist

### API Endpoints
- [ ] 9/9 Auth endpoints working
- [ ] 5/5 Categories endpoints working
- [ ] 14/14 Total endpoints functional

### Features
- [ ] Login/Logout works
- [ ] Registration works
- [ ] Password reset works
- [ ] Email verification works
- [ ] Categories CRUD works
- [ ] Search/filter works
- [ ] Image upload works
- [ ] Multi-language works (AR/EN)

### Security
- [ ] Bearer token injected
- [ ] Role-based access works
- [ ] Protected routes working
- [ ] Token persists in cookies
- [ ] Token cleared on logout

### UX/UI
- [ ] Loading states show
- [ ] Error messages display
- [ ] Confirmation dialogs work
- [ ] Form validation works
- [ ] Image preview works
- [ ] Responsive design works

### Performance
- [ ] No console errors
- [ ] No memory leaks
- [ ] API calls reasonable speed
- [ ] Forms responsive
- [ ] Transitions smooth

---

## 🎯 All Tests Passed?

If you checked all boxes above, then:

✅ **Your implementation is complete and working!**

You can now:
1. Deploy to production
2. Add more features
3. Integrate with your backend
4. Start using in production

---

## ❌ Some Tests Failed?

If some tests failed:

1. **Check the error message carefully**
2. **Review TROUBLESHOOTING.md**
3. **Check browser console (F12)**
4. **Check Network tab for API errors**
5. **Verify backend API is running**
6. **Test endpoint in Postman**

---

## 📞 Quick Reference

| Test | File | Location |
|------|------|----------|
| Login | api/api.js | Line 29-34 |
| Register | api/api.js | Line 37-39 |
| Categories | Categories.jsx | Full component |
| Auth Context | AuthContext.jsx | All methods |
| Routes | routes.js | Full file |

---

**Happy Testing! 🚀**

All features should be working after following this guide.