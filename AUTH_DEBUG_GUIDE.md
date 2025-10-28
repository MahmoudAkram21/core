# 🔐 Auth Token & User Data - Debug Guide
## دليل تشخيص حفظ التوكن والمستخدم

---

## ✅ الإصلاحات المطبقة

### 1. **AuthContext.jsx** - التحقق والحفظ الثنائي
- ✅ حفظ في Cookies و localStorage معاً
- ✅ التحقق من أن البيانات ليست "undefined"
- ✅ استرجاع البيانات من localStorage إذا فشل الـ cookie
- ✅ مسح كامل عند logout

### 2. **api.js** - معالجة التوكن الموثوقة
- ✅ محاولة الـ cookies أولاً، fallback إلى localStorage
- ✅ معالجة أخطاء 401 (Unauthorized)
- ✅ مسح البيانات عند انتهاء صلاحية التوكن

---

## 🧪 كيفية التحقق من الإصلاحات

### **الخطوة 1: فتح Browser Console**
1. افتح الموقع
2. اضغط **F12** → اختر **Console**
3. ابحث عن الرسائل التالية:

```
✅ User loaded from storage: {...}
🔑 Token loaded from storage: ✅ Valid
📡 Login API Response: {...}
🔍 Extracted Data: { tokenData: "...", userData: {...} }
✅ Auth data saved successfully
```

### **الخطوة 2: تسجيل الدخول**
1. روح إلى `/login`
2. أدخل بريدك وكلمة السر
3. **تابع Console** - يجب أن ترى:

```
📡 Login API Response: { data: { ... } }
🔍 Extracted Data: { tokenData: "eyJ...", userData: {...} }
🔐 Setting Auth Data: { userData: {...}, tokenData: "eyJ..." }
✅ Auth data saved successfully
✅ Token added to request
```

### **الخطوة 3: تحقق من Cookies و LocalStorage**

#### **في DevTools:**
1. F12 → **Application**
2. اضغط على **Cookies** → اختر الموقع
3. **يجب أن ترى:**
   - ✅ `token` = (jwt token طويل)
   - ✅ `user` = (json مع بيانات المستخدم)

#### **في LocalStorage:**
1. F12 → **Application**
2. اضغط على **Local Storage** → اختر الموقع
3. **يجب أن ترى:**
   - ✅ `token` = (jwt token طويل)
   - ✅ `user` = (json مع بيانات المستخدم)

### **الخطوة 4: إعادة تحميل الصفحة**
1. بعد تسجيل الدخول، اضغط **F5**
2. **يجب أن يحدث:**
   - ✅ البيانات تُحمل من localStorage/cookies
   - ✅ رسالة: `✅ User loaded from storage`
   - ✅ `🔑 Token loaded from storage: ✅ Valid`
   - ✅ تبقى مسجل دخول بدون إعادة login

### **الخطوة 5: التحقق من Protected Routes**
```
انتقل إلى:
/dashboard - يجب أن يعمل ✅
/packages - يجب أن يعمل (إذا كان admin) ✅
/login - يجب أن ينقلك للـ dashboard (لأنك مسجل دخول) ✅
```

---

## 🔍 استكشاف الأخطاء

### **المشكلة: Token يظهر كـ "undefined"**

**الحل:**
```javascript
// في Console، اكتب:
console.log(localStorage.getItem('token'))
console.log(document.cookie)

// يجب أن ترى قيمة حقيقية للـ token، وليس "undefined"
```

### **المشكلة: البيانات لا تُحفظ**

تحقق من:
1. هل API يُرجع البيانات بشكل صحيح؟
   ```
   في Console بعد Login:
   localStorage.getItem('token') // يجب يكون token
   localStorage.getItem('user')  // يجب يكون JSON
   ```

2. هل BaseURL في `api.js` صحيح؟
   ```javascript
   // api.js line 9
   baseURL: 'http://192.168.1.66:8000/api/'
   ```

3. هل API يُرجع الـ response بالصيغة الصحيحة؟
   ```javascript
   // يجب يكون:
   { data: { auth_token: "...", user: {...} } }
   // أو
   { data: { token: "...", user: {...} } }
   ```

### **المشكلة: Logout لا يمسح البيانات**

تحقق من Console:
```javascript
// يجب ترى:
✅ Auth data cleared
localStorage.getItem('token') // null
localStorage.getItem('user')  // null
```

---

## 📊 جدول التحقق

| العملية | ما يجب أن ترى في Console | ما يجب أن ترى في Storage |
|--------|----------------------|----------------------|
| **تحميل الصفحة الأولى** | No console messages | فارغ (إن لم تكن مسجل دخول سابقاً) |
| **بعد Login** | ✅ Auth data saved successfully | token + user موجودان |
| **بعد F5 (reload)** | ✅ User loaded from storage | token + user موجودان |
| **بعد Logout** | ✅ Auth data cleared | فارغ |

---

## 🚀 إذا استمرت المشاكل

### **1. مسح كامل البيانات:**
```javascript
// في Browser Console:
localStorage.clear()
// ثم: F5 لإعادة تحميل
```

### **2. فحص API Response:**
```javascript
// بعد محاولة Login، في Network tab (DevTools):
1. اضغط F12 → Network
2. ادخل بيانات الـ login
3. ابحث عن طلب "login"
4. اضغط عليه → Response
5. يجب ترى شيء مثل:
{
  "data": {
    "token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
    "user": { "id": 1, "name": "...", ... }
  }
}
```

### **3. إذا كان الـ token field مختلف:**

إذا كان API يُرجع الـ token باسم مختلف (مثل `access_token`):
1. اذهب إلى **AuthContext.jsx** line 73-77
2. أضف الـ field الجديد:
```javascript
tokenData = 
  res.data?.data?.auth_token || 
  res.data?.data?.token || 
  res.data?.data?.access_token ||  // ← أضف هنا
  res.data?.auth_token || 
  res.data?.token
```

---

## ✅ الخلاصة

| ✅ يعمل | ❌ لا يعمل |
|--------|-----------|
| Token يُحفظ في cookies | Token يبقى "undefined" |
| Token يُحفظ في localStorage | User data فارغة |
| Token يُحمّل بعد reload | Logout لا يمسح البيانات |
| Protected routes تعمل | Token لا يُرسل مع الـ requests |
| Logout يمسح كل شيء | 401 errors بعد login |

**إذا رأيت كل الـ ✅ - أنت بحالة جيدة! 🎉**

---

## 📞 معلومات مفيدة

- **localStorage**: محفوظ حتى يتم حذفه يدويا
- **Cookies**: محفوظ لمدة 7 أيام (من config)
- **كلاهما يُستخدم** للتأكد من الحفظ الموثوق