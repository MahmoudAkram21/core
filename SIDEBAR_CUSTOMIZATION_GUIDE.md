# 🎨 Sidebar Customization & Role-Based Access Guide

## 📋 نظرة عامة

تم تحديث نظام الـ Sidebar والـ Dashboard لدعم **عرض مخصص لكل role** مع **إخفاء العناصر بدلاً من حذفها** (عناصر مخفية بصرياً لكن موجودة في الـ DOM).

---

## 🎯 ما تم تعديله

### 1️⃣ **AppSidebarNav.js** - دالة التحقق من الـ Role

#### ✅ الميزات الجديدة:
- دالة `isItemAllowed()` للتحقق من السماح بالدخول
- إخفاء العناصر التي لا يسمح بها الـ role
- إخفاء المجموعات التي لا تحتوي على عناصر مرئية

```javascript
// دالة التحقق
const isItemAllowed = (item) => {
  if (!item.allowedRoles) return true     // ✅ بدون قيود = السماح
  if (!userRole) return false              // ❌ بدون role = منع
  return item.allowedRoles.includes(userRole)  // ✅ تحقق من role
}
```

#### الفرق بين `hidden` و `deleted`:
```javascript
// ✅ HIDDEN (مخفي لكن موجود في DOM)
if (!isItemAllowed(item)) {
  return null  // العنصر موجود في الـ DOM لكنه غير مرئي
}

// ❌ DELETED (محذوف من DOM)
// لم نستخدم هذا - كل العناصر موجودة في الـ DOM
```

---

### 2️⃣ **AppSidebar.js** - تمرير الـ Role

#### التحديث:
```javascript
// ✅ استيراد useAuth
import { useAuth } from '../Context/AuthContext'

const AppSidebar = () => {
  const { role } = useAuth()  // احصل على الـ role
  
  // تمرير role إلى AppSidebarNav
  <AppSidebarNav items={navigation} userRole={role} />
}
```

---

### 3️⃣ **_nav.js** - إضافة allowedRoles

#### مثال - تحديد الدخول للعناصر:

```javascript
// ✅ متاح لجميع الأدوار
{
  component: CNavItem,
  name: 'Dashboard',
  to: '/dashboard',
  allowedRoles: ['admin', 'superadmin', 'moderator', 'cashier', 'teacher', 'student'],
}

// ✅ متاح للـ admin و superadmin و moderator فقط
{
  component: CNavItem,
  name: 'Categories',
  to: '/categories',
  allowedRoles: ['admin', 'superadmin', 'moderator'],
}

// ✅ متاح للـ admin و superadmin فقط
{
  component: CNavItem,
  name: 'Packages',
  to: '/packages',
  allowedRoles: ['admin', 'superadmin'],
}

// ⚠️ بدون allowedRoles = متاح لجميع الأدوار
{
  component: CNavItem,
  name: 'Some Public Page',
  to: '/public',
  // لا توجد allowedRoles = متاح للجميع
}
```

#### الـ Roles المدعومة:
| Role | الوصف | الوصول |
|------|-------|--------|
| `admin` | مسؤول النظام | معظم العناصر |
| `superadmin` | مسؤول فوق | جميع العناصر |
| `moderator` | المشرف | عناصر معينة |
| `cashier` | أمين الصندوق | عناصر محدودة |
| `teacher` | المعلم | عناصر الدراسة |
| `student` | الطالب | عناصر الطلاب |

---

### 4️⃣ **Dashboard.js** - عرض بيانات مخصصة

#### الميزات:
- 🎯 Dashboard مخصص لكل role
- 📊 مقاييس (metrics) مختلفة حسب الـ role
- 👤 عرض معلومات المستخدم والـ role

#### مثال - الـ Dashboard لكل Role:

```javascript
// 💰 Cashier Dashboard
{
  title: '💰 Cashier Dashboard',
  metrics: [
    { label: 'Daily Sales', value: '₩45,231', color: 'success' },
    { label: 'Transactions', value: '127', color: 'info' },
  ]
}

// 📚 Student Dashboard
{
  title: '📚 Student Dashboard',
  metrics: [
    { label: 'Courses', value: '5', color: 'primary' },
    { label: 'Progress', value: '78%', color: 'success' },
  ]
}

// 👑 SuperAdmin Dashboard
{
  title: '👑 SuperAdmin Dashboard',
  metrics: [
    { label: 'Total Users', value: '2,842', color: 'primary' },
    { label: 'System Health', value: '99.8%', color: 'success' },
  ]
}
```

---

## 🔍 كيفية إضافة Role جديد

### الخطوة 1: إضافة Role في _nav.js

```javascript
// أضف allowedRoles لأي عنصر جديد
{
  component: CNavItem,
  name: 'My Feature',
  to: '/my-feature',
  allowedRoles: ['admin', 'your_new_role'],  // ✅ أضفه هنا
}
```

### الخطوة 2: تحديث Dashboard.js

```javascript
const getDashboardData = () => {
  // ... الـ roles الموجودة
  
  // ✅ أضف الـ role الجديد
  else if (role === 'your_new_role') {
    return {
      title: '🎉 Your Role Dashboard',
      subtitle: 'Your custom dashboard',
      metrics: [
        { label: 'Metric 1', value: '100', color: 'success' },
      ]
    }
  }
}
```

### الخطوة 3: إضافة Protected Routes

في `routes.js`:

```javascript
{
  path: '/my-feature',
  element: <ProtectedRoute roles={['admin', 'your_new_role']}>
    <MyFeaturePage />
  </ProtectedRoute>
}
```

---

## 🧪 اختبار السلوك

### اختبار 1: عرض/إخفاء الـ Sidebar

```javascript
// 1. سجل دخول كـ Admin
// النتيجة: جميع العناصر مرئية

// 2. سجل دخول كـ Cashier
// النتيجة: فقط Dashboard visible
// Categories, Packages, Settings → مخفية

// 3. سجل دخول كـ Student
// النتيجة: فقط Dashboard visible
```

### اختبار 2: تغيير Dashboard

```javascript
// 1. Admin → Dashboard: ⚙️ Admin Dashboard
// 2. Cashier → Dashboard: 💰 Cashier Dashboard
// 3. Student → Dashboard: 📚 Student Dashboard
```

### اختبار 3: Protected Routes

```javascript
// إذا حاول student الوصول مباشرة:
// GET /packages → 🚫 Redirect to 404
```

---

## 🔐 الأمان والملاحظات

### ⚠️ تنبيهات هامة:

1. **الإخفاء ليس أمان**
   - الـ Sidebar إخفاء بصري فقط
   - **يجب** فحص الـ role على الخادم أيضاً
   - لا تثق في الـ frontend وحده

2. **البيانات الحساسة**
   ```javascript
   // ❌ خطأ: البيانات متاحة في الـ Frontend
   console.log('User Token:', token)
   
   // ✅ صحيح: التحقق على الخادم
   GET /api/packages  // الخادم يفحص الـ role
   ```

3. **قائمة السماح (Allowlist)**
   - استخدم قائمة بيضاء (allowlist) وليس قائمة سوداء
   - حدد ما هو **مسموح** وليس ما هو **ممنوع**

---

## 📚 الملفات المعدلة

| الملف | التغييرات |
|------|-----------|
| `src/components/AppSidebarNav.js` | ✅ دالة `isItemAllowed()` |
| `src/components/AppSidebar.js` | ✅ تمرير role من AuthContext |
| `src/_nav.js` | ✅ إضافة allowedRoles لكل عنصر |
| `src/views/dashboard/Dashboard.js` | ✅ Dashboard مخصص لكل role |

---

## 🎬 سير العمل الكامل

```
1. تسجيل الدخول
   ↓
2. استخراج الـ role من API
   ↓
3. حفظ role في AuthContext
   ↓
4. AppSidebar يستدعي useAuth() للحصول على role
   ↓
5. AppSidebar يمرر role إلى AppSidebarNav
   ↓
6. AppSidebarNav يفلتر العناصر حسب allowedRoles
   ↓
7. العناصر المخفية تظل في الـ DOM لكنها غير مرئية
   ↓
8. Dashboard يعرض بيانات مخصصة حسب الـ role
```

---

## 🐛 حل المشاكل

### المشكلة 1: جميع العناصر مرئية

**السبب:** `allowedRoles` لم تُضف

**الحل:**
```javascript
// أضف allowedRoles لكل عنصر
{
  component: CNavItem,
  name: 'My Item',
  to: '/my-item',
  allowedRoles: ['admin'],  // ✅ أضفه
}
```

### المشكلة 2: عنصر معين مخفي دائماً

**السبب:** الـ role غير موجود في `allowedRoles`

**الحل:**
```javascript
// تحقق من الـ role والـ allowedRoles
console.log('Current Role:', role)
console.log('Allowed:', ['admin', 'superadmin'])

// اجعل الـ role مطابقاً (lowercase)
{
  allowedRoles: ['admin'],  // ✅ lowercase
  // NOT: ['Admin', 'ADMIN']  ❌
}
```

### المشكلة 3: Dashboard لا يتغير

**السبب:** `role` غير متوفر أو null

**الحل:**
```javascript
// تحقق من أن role يتم تحميله
const { role } = useAuth()
console.log('Current Role:', role)

// إذا كان null، تحقق من استدعاء profile API
// (انظر ROLE_FIX_COMPLETED.md)
```

---

## ✨ ملخص الميزات

| الميزة | الحالة | التفاصيل |
|--------|--------|---------|
| إخفاء عناصر الـ Sidebar | ✅ | بدون حذف من الـ DOM |
| تمرير الـ role | ✅ | من AuthContext إلى Sidebar |
| Dashboard مخصص | ✅ | مقاييس مختلفة لكل role |
| Protected Routes | ✅ | إعادة توجيه إلى 404 |
| دعم 6 أدوار | ✅ | admin, superadmin, moderator, cashier, teacher, student |

---

**تم الانتهاء من التخصيص! 🎉**

الآن يمكنك:
- ✅ إضافة أدوار جديدة بسهولة
- ✅ إخفاء العناصر بدون حذفها
- ✅ عرض بيانات مخصصة لكل role
- ✅ حماية الصفحات بناءً على الـ role