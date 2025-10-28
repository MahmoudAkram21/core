# 🔐 Roles & Access Control

## مستويات الوصول المدعومة

تطبيقك يدعم **4 أنواع من الـ Roles** الرئيسية:

### 1. **Admin** 👤
- الوصول الكامل للنظام
- إدارة الفئات (Categories)
- إدارة الحزم (Packages)
- إعدادات النظام (Settings)
- لوحة التحكم (Dashboard)
- إعدادات الحساب (Account Settings)

```
Accessible Routes:
- /dashboard ✅
- /categories ✅
- /packages ✅
- /settings ✅
- /account-settings ✅
```

---

### 2. **Superadmin** 🔥
- الوصول الكامل (مثل Admin)
- يمكنه إدارة المسؤولين الآخرين
- إدارة النظام الكاملة

```
Accessible Routes:
- /dashboard ✅
- /categories ✅
- /packages ✅
- /settings ✅
- /account-settings ✅
```

---

### 3. **Moderator** 👥
- إدارة الفئات والمحتوى
- لا يمكنه الوصول للإعدادات الحساسة
- لا يمكنه إدارة الحزم

```
Accessible Routes:
- /dashboard ✅
- /categories ✅ (moderate content)
- /account-settings ✅
✗ /packages (No access)
✗ /settings (No access)
```

---

### 4. **Cashier** 💳
- الوصول محدود
- استخدام النقاط (Sales/Checkout)
- عرض لوحة التحكم الأساسية
- إدارة حسابه الشخصي فقط

```
Accessible Routes:
- /dashboard ✅ (basic view)
- /account-settings ✅
✗ /categories (No access)
✗ /packages (No access)
✗ /settings (No access)
```

---

## 🔧 كيفية الفحص - الملفات المعنية

### 1. **AuthContext.jsx**
```javascript
// استخراج الـ Role من بيانات المستخدم
const extractRole = (userData) => {
  // محاولة استخراج role من حقول مختلفة
  let roleValue = userData.role || userData.user_role || ...
  
  // تطبيع القيمة (تحويل لـ lowercase)
  if (roleValue) {
    roleValue = roleValue.toLowerCase().trim()
  }
  
  return roleValue
}
```

**الدعم:**
- `role`
- `user_role`
- `userRole`
- `type`
- `user_type`
- `role_name`

### 2. **ProtectedRoute.js**
```javascript
// التحقق من وجود الـ role في القائمة المسموحة
if (roles && !roles.includes(role)) {
  return <Navigate to="/404" replace />
}
```

### 3. **routes.js**
```javascript
// تحديد الـ roles المسموحة لكل صفحة
<ProtectedRoute roles={['admin', 'superadmin', 'moderator', 'cashier']}>
  <Component />
</ProtectedRoute>
```

---

## 📊 جدول الوصول الكامل

| الصفحة | Admin | Superadmin | Moderator | Cashier |
|-------|-------|-----------|-----------|---------|
| Dashboard | ✅ | ✅ | ✅ | ✅ |
| Categories | ✅ | ✅ | ✅ | ❌ |
| Packages | ✅ | ✅ | ❌ | ❌ |
| Settings | ✅ | ✅ | ❌ | ❌ |
| Account Settings | ✅ | ✅ | ✅ | ✅ |
| Verify Email | ✅ | ✅ | ✅ | ✅ |

---

## 🔄 خطوات تسجيل الدخول

```
1. المستخدم يدخل البريد والكلمة المرورية
   ↓
2. يتم إرسال الطلب إلى: POST /api/login
   ↓
3. الخادم يرجع: token + user data
   ↓
4. يتم حفظ البيانات في الـ State والـ Cookies والـ LocalStorage
   ↓
5. يتم استدعاء: GET /api/user (لاستخراج الـ role الكامل)
   ↓
6. يتم استخراج role من بيانات المستخدم
   ↓
7. يتم التحقق من ProtectedRoute
   ↓
8. إذا كان الـ role مسموح → الدخول للصفحة ✅
   إذا كان الـ role غير مسموح → إعادة توجيه إلى 404 ❌
```

---

## 🧪 اختبار الـ Roles

### مع Postman:

1. **اختبر Login:**
```
POST http://your-api/api/login
Body (urlencoded):
  email: admin@note.com
  password: 123456789
```

2. **انسخ الـ token المرجع**

3. **اختبر Get Profile:**
```
GET http://your-api/api/user
Header: Authorization: Bearer {token}
```

4. **تحقق من بيانات المستخدم، خاصة حقل الـ role:**
```json
{
  "id": 1,
  "name": "gdshgf",
  "email": "admin@note.com",
  "role": "admin",  // ← ابحث عن هذا
  "status": "Active"
}
```

---

## ⚠️ استكشاف الأخطاء

### المشكلة: "تحويل إلى 404 بعد الدخول"

**الأسباب المحتملة:**

1. **role = null**
   - فتح DevTools → Console
   - ابحث عن رسالة: `🎯 Extracted role: null`
   - **الحل:** تأكد أن API يرجع حقل role في بيانات المستخدم

2. **role field غير مدعوم**
   - إذا كان API يرجع الـ role في حقل مخصص (مثل: `role_type` أو `permission_level`)
   - **الحل:** أضف اسم الحقل إلى دالة `extractRole()` في AuthContext.jsx

3. **role قيمة مختلفة**
   - مثال: API يرجع `"admin"` لكن routes تبحث عن `"Admin"` (حالة كبرى)
   - **الحل:** تم إضافة `.toLowerCase()` لحل هذه المشكلة

4. **Token غير صحيح**
   - فتح DevTools → Application → Cookies/Local Storage
   - تأكد من وجود `token` و `user`

---

## 💡 تعديل الـ Roles

### لإضافة role جديد:

1. **في AuthContext.jsx:**
```javascript
// أضف اسم الحقل إذا لزم الأمر
const extractRole = (userData) => {
  let roleValue = userData.role || userData.new_role_field || ...
  return roleValue?.toLowerCase().trim()
}
```

2. **في routes.js:**
```javascript
<ProtectedRoute roles={['admin', 'superadmin', 'newrole']}>
  <Component />
</ProtectedRoute>
```

3. **أعد بناء التطبيق:**
```bash
npm run build
```

---

## 📝 ملاحظات

- جميع الـ roles يتم تحويلها إلى **lowercase** تلقائياً
- **عدم وجود role لا يعني الرفض** - فقط إذا حددت `roles` prop في ProtectedRoute
- إذا لم تحدد `roles`، يكون الوصول مفتوح لأي مستخدم مسجل دخول

---

## ✅ الحالة الحالية (بعد التحديثات)

- ✅ دعم: admin, superadmin, moderator, cashier
- ✅ استدعاء تلقائي لـ /user بعد الدخول
- ✅ استخراج Roles من ملفات متعددة
- ✅ معالجة الحالات الكبرى (uppercase/lowercase)
- ✅ تسجيل تفصيلي في Console

---

**آخر تحديث:** بعد إصلاح 404 Redirect