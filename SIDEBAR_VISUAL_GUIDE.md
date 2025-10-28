# 👁️ Sidebar Visual Guide - What Each Role Sees

## 🎨 Admin Sidebar (Full Access)

```
┌─────────────────────────────────────────┐
│  🏠 COREUI ADMIN                        │
├─────────────────────────────────────────┤
│ 🚀 Dashboard                       [NEW]│
│                                         │
│ 📋 ADMIN MANAGEMENT                    │
│  • 📂 Categories                       │
│  • 📦 Packages                         │
│  • ⚙️ Settings                          │
│                                         │
│ 🎨 THEME                               │
│  • 🎨 Colors                           │
│  • ✍️  Typography                      │
│                                         │
│ 🧩 COMPONENTS                           │
│  ▶ 🔧 Base                             │
│    • Accordion                         │
│    • Breadcrumb                        │
│    • Cards                             │
│    • ... (18+ items)                   │
│  ▶ 🔘 Buttons                          │
│    • Buttons                           │
│    • Button Groups                     │
│    • Dropdowns                         │
│  ▶ 📝 Forms                             │
│    • Checks & Radios                   │
│    • Form Control                      │
│    • ... (15+ items)                   │
│                                         │
│ 📊 Charts                              │
│                                         │
│ 🌟 Icons                               │
│  ▶ CoreUI Icons                        │
│  ▶ Flags                               │
│  ▶ Brands                              │
│                                         │
│ 🔔 Notifications                       │
│  ▶ Alerts                              │
│  ▶ Badges                              │
│  ▶ Modal                               │
│  ▶ Toasts                              │
│                                         │
│ 📌 Profile & Logout                    │
└─────────────────────────────────────────┘
```

---

## 👑 SuperAdmin Sidebar (Full Access)

```
┌─────────────────────────────────────────┐
│  🏠 COREUI ADMIN                        │
├─────────────────────────────────────────┤
│ 🚀 Dashboard                       [NEW]│
│                                         │
│ 📋 ADMIN MANAGEMENT                    │
│  • 📂 Categories                       │
│  • 📦 Packages                         │
│  • ⚙️ Settings                          │
│                                         │
│ 🎨 THEME                               │
│  • 🎨 Colors                           │
│  • ✍️  Typography                      │
│                                         │
│ 🧩 COMPONENTS                           │
│  ▶ 🔧 Base                             │
│    • ... (20+ items)                   │
│  ▶ 🔘 Buttons                          │
│  ▶ 📝 Forms                             │
│  ...                                   │
│                                         │
│ 📊 Charts                              │
│                                         │
│ 🌟 Icons                               │
│  ▶ CoreUI Icons                        │
│  ...                                   │
│                                         │
│ 🔔 Notifications                       │
│  ...                                   │
│                                         │
│ 📌 Profile & Logout                    │
└─────────────────────────────────────────┘
```

**Note:** SuperAdmin sees same as Admin (has all permissions)

---

## 🛡️ Moderator Sidebar (Limited Access)

```
┌─────────────────────────────────────────┐
│  🏠 COREUI ADMIN                        │
├─────────────────────────────────────────┤
│ 🚀 Dashboard                       [NEW]│
│                                         │
│ 📋 ADMIN MANAGEMENT                    │
│  • 📂 Categories                       │
│                                         │
│ ❌ Packages                    [HIDDEN] │
│ ❌ Settings                    [HIDDEN] │
│ ❌ Theme                       [HIDDEN] │
│ ❌ Components                  [HIDDEN] │
│ ❌ Charts                      [HIDDEN] │
│ ❌ Icons                       [HIDDEN] │
│ ❌ Notifications               [HIDDEN] │
│                                         │
│ 📌 Profile & Logout                    │
└─────────────────────────────────────────┘
```

**What's Visible:** Dashboard + Categories
**What's Hidden:** Packages, Settings, Theme, Components, Charts, Icons, Notifications

---

## 💰 Cashier Sidebar (Minimal Access)

```
┌─────────────────────────────────────────┐
│  🏠 COREUI ADMIN                        │
├─────────────────────────────────────────┤
│ 🚀 Dashboard                       [NEW]│
│                                         │
│ ❌ Admin Management            [HIDDEN] │
│ ❌ Categories                  [HIDDEN] │
│ ❌ Packages                    [HIDDEN] │
│ ❌ Settings                    [HIDDEN] │
│ ❌ Theme                       [HIDDEN] │
│ ❌ Components                  [HIDDEN] │
│ ❌ Charts                      [HIDDEN] │
│ ❌ Icons                       [HIDDEN] │
│ ❌ Notifications               [HIDDEN] │
│                                         │
│ 📌 Profile & Logout                    │
└─────────────────────────────────────────┘
```

**What's Visible:** Dashboard only
**What's Hidden:** All admin features

---

## 📚 Teacher Sidebar (Student Access)

```
┌─────────────────────────────────────────┐
│  🏠 COREUI ADMIN                        │
├─────────────────────────────────────────┤
│ 🚀 Dashboard                       [NEW]│
│                                         │
│ ❌ Admin Management            [HIDDEN] │
│ ❌ Categories                  [HIDDEN] │
│ ❌ Packages                    [HIDDEN] │
│ ❌ Settings                    [HIDDEN] │
│ ❌ Theme                       [HIDDEN] │
│ ❌ Components                  [HIDDEN] │
│ ❌ Charts                      [HIDDEN] │
│ ❌ Icons                       [HIDDEN] │
│ ❌ Notifications               [HIDDEN] │
│                                         │
│ 📌 Profile & Logout                    │
└─────────────────────────────────────────┘
```

**What's Visible:** Dashboard only (education content)
**What's Hidden:** Admin and system management

---

## 👨‍🎓 Student Sidebar (Student Access)

```
┌─────────────────────────────────────────┐
│  🏠 COREUI ADMIN                        │
├─────────────────────────────────────────┤
│ 🚀 Dashboard                       [NEW]│
│                                         │
│ ❌ Admin Management            [HIDDEN] │
│ ❌ Categories                  [HIDDEN] │
│ ❌ Packages                    [HIDDEN] │
│ ❌ Settings                    [HIDDEN] │
│ ❌ Theme                       [HIDDEN] │
│ ❌ Components                  [HIDDEN] │
│ ❌ Charts                      [HIDDEN] │
│ ❌ Icons                       [HIDDEN] │
│ ❌ Notifications               [HIDDEN] │
│                                         │
│ 📌 Profile & Logout                    │
└─────────────────────────────────────────┘
```

**What's Visible:** Dashboard only (personal dashboard)
**What's Hidden:** All admin and management features

---

## 📊 Dashboard Headers by Role

### Admin Dashboard
```
┌────────────────────────────────────────────┐
│ ⚙️ Admin Dashboard                         │
│ Manage system and resources                │
│                                            │
│ Welcome: John Admin (ADMIN)                │
│                        Role Access: [admin]│
├────────────────────────────────────────────┤
│ Total Users  │  Active Orders │ Categories│
│   2,842      │       89       │     12    │
├────────────────────────────────────────────┤
│ Packages     │                            │
│      5       │                            │
└────────────────────────────────────────────┘
```

### Cashier Dashboard
```
┌────────────────────────────────────────────┐
│ 💰 Cashier Dashboard                       │
│ Track sales and transactions               │
│                                            │
│ Welcome: Sarah Cashier (CASHIER)           │
│                      Role Access: [cashier]│
├────────────────────────────────────────────┤
│ Daily Sales   │ Transactions  │ Pending   │
│  ₩45,231      │      127      │    12    │
├────────────────────────────────────────────┤
│ Failed        │                            │
│     3         │                            │
└────────────────────────────────────────────┘
```

### Student Dashboard
```
┌────────────────────────────────────────────┐
│ 📚 Student Dashboard                       │
│ View your courses and progress             │
│                                            │
│ Welcome: Alice Student (STUDENT)           │
│                      Role Access: [student]│
├────────────────────────────────────────────┤
│ Courses       │  Progress     │ Assignments│
│      5        │      78%      │      8    │
├────────────────────────────────────────────┤
│ Certificates  │                            │
│      2        │                            │
└────────────────────────────────────────────┘
```

### Moderator Dashboard
```
┌────────────────────────────────────────────┐
│ 🛡️ Moderator Dashboard                     │
│ Monitor and manage content                 │
│                                            │
│ Welcome: Mike Moderator (MODERATOR)        │
│                   Role Access: [moderator] │
├────────────────────────────────────────────┤
│ Active Users  │ Pending Review │ Reported  │
│      342      │       23       │     5    │
├────────────────────────────────────────────┤
│ Approved      │                            │
│       89      │                            │
└────────────────────────────────────────────┘
```

### SuperAdmin Dashboard
```
┌────────────────────────────────────────────┐
│ 👑 SuperAdmin Dashboard                    │
│ Full system control and monitoring         │
│                                            │
│ Welcome: Admin SuperAdmin (SUPERADMIN)     │
│                   Role Access: [superadmin]│
├────────────────────────────────────────────┤
│ Total Users   │ System Health │ Active Ses │
│     2,842     │     99.8%     │    156    │
├────────────────────────────────────────────┤
│ Alerts        │                            │
│       4       │                            │
└────────────────────────────────────────────┘
```

---

## 🔄 Sidebar Update Behavior

### Login Flow with Sidebar Update

```
1. User clicks "Login"
   ↓
2. Credentials sent to API
   ↓
3. API returns token + user data (no role)
   ↓
4. AuthContext saves token
   ↓
5. AuthContext fetches /api/user (has role)
   ↓
6. AuthContext extracts role
   ↓
7. AuthContext updates state with role
   ↓
8. AppSidebar gets new role via useAuth()
   ↓
9. AppSidebarNav filters items by allowedRoles
   ↓
10. Sidebar re-renders showing correct items
```

### Sidebar Update Timeline

```
Time    Event                          Sidebar
────────────────────────────────────────────
T0      User logged out                Dashboard only
T1      User enters credentials        ↓ (no change)
T2      Click login button             ↓ (no change)
T3      API response with token        ↓ (no change, waiting for profile)
T4      Fetch /api/user called         ↓ (no change)
T5      Role extracted from profile    ↓ (ready to update)
T6      State updated with role        ↑ (filtering starts)
T7      useAuth() returns role         ↑ (Sidebar gets role)
T8      AppSidebarNav re-renders       ✅ (NEW ITEMS VISIBLE!)
```

---

## 📱 Responsive Behavior

### Desktop View (>992px)
```
┌─────────────┬──────────────────────────┐
│  Sidebar    │   Main Content           │
│  (Visible)  │   (Dashboard/Pages)      │
│             │                          │
│ Dashboard   │  ┌──────────────────────┐│
│ Categories  │  │ Dashboard Header     ││
│ Packages    │  ├──────────────────────┤│
│             │  │ Metrics              ││
│             │  ├──────────────────────┤│
│             │  │ Charts & Tables      ││
│             │  └──────────────────────┘│
└─────────────┴──────────────────────────┘
```

### Tablet View (768px - 991px)
```
┌─┬─────────────────────────────────────┐
│S│ Main Content                        │
│ │ ┌─────────────────────────────────┐│
│ │ │ Dashboard Header                ││
│i│ ├─────────────────────────────────┤│
│d│ │ Metrics (2 columns)             ││
│e│ ├─────────────────────────────────┤│
│b│ │ Charts & Tables (responsive)    ││
│a│ └─────────────────────────────────┘│
│r│                                     │
│  │                                     │
│ │                                     │
│(│                                     │
│T│                                     │
│o│                                     │
│g│                                     │
│g│                                     │
│l│                                     │
└─┴─────────────────────────────────────┘
```

### Mobile View (<768px)
```
┌──────────────────────────────────────┐
│ ☰ Menu │ Main Content                │
├──────────────────────────────────────┤
│ Dashboard Header                     │
├──────────────────────────────────────┤
│ Metrics (1 column, stacked)          │
├──────────────────────────────────────┤
│ Charts & Tables (full width)         │
├──────────────────────────────────────┤
│                                      │
│ [Sidebar toggles via hamburger menu] │
│                                      │
└──────────────────────────────────────┘
```

---

## ✨ Key Visual Differences

| Aspect | Admin | Cashier | Student |
|--------|-------|---------|---------|
| Sidebar Items | 50+ | 1 | 1 |
| Dashboard Title | ⚙️ Admin | 💰 Cashier | 📚 Student |
| Metrics | 4 (Users, Orders, etc) | 4 (Sales, Transactions, etc) | 4 (Courses, Progress, etc) |
| Color Scheme | Blue/Primary | Green/Success | Purple/Info |
| Features Visible | All | Minimal | Educational |

---

## 🎨 Color Codes Used

```javascript
// Dashboard Header Colors
Admin:     bg-primary (Blue)
SuperAdmin: bg-danger (Red)
Moderator: bg-warning (Orange)
Cashier:   bg-success (Green)
Teacher:   bg-info (Cyan)
Student:   bg-info (Cyan)

// Badge Colors
role: 'admin'       → badge bg-info
role: 'superadmin'  → badge bg-danger
role: 'moderator'   → badge bg-warning
role: 'cashier'     → badge bg-success
role: 'teacher'     → badge bg-info
role: 'student'     → badge bg-info
```

---

## 📸 Real Implementation

When you login with different accounts, you'll see:

### Before Login
```
┌─────────────────────────────────┐
│  Login Page                      │
│                                  │
│  Email: _______________          │
│  Password: _______________       │
│  [Login Button]                  │
└─────────────────────────────────┘
```

### After Admin Login
```
┌─────────────────────────────────┐
│ Sidebar with FULL items visible │
│                                  │
│ 🚀 Dashboard                     │
│ 📋 Categories                    │
│ 📦 Packages                      │
│ ⚙️  Settings                      │
│ ... (30+ more)                   │
└─────────────────────────────────┘
```

### After Cashier Login
```
┌─────────────────────────────────┐
│ Sidebar with LIMITED items       │
│                                  │
│ 🚀 Dashboard                     │
│ ... (everything else hidden)    │
│                                  │
│                                  │
│                                  │
└─────────────────────────────────┘
```

---

## 🔍 Debugging Tips

### To see all roles at once (DevTools):

```javascript
// In Console
const roles = ['admin', 'superadmin', 'moderator', 'cashier', 'teacher', 'student']
console.table(roles.map(r => ({ role: r, visible: '✅' })))
```

### To simulate role change (for testing):

```javascript
// ⚠️ FOR TESTING ONLY - in AuthContext
const [role, setRole] = useState('admin')

// Temporarily change to test
setRole('cashier')  // see cashier sidebar
setRole('student')  // see student sidebar
```

---

**The sidebar system is now fully customizable and role-aware! 🎉**