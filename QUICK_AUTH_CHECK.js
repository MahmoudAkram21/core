/**
 * 🔐 Quick Auth Status Check
 * 
 * كيفية الاستخدام:
 * 1. افتح DevTools (F12)
 * 2. روح على Console tab
 * 3. انسخ والصق كل كود أدناه
 * 4. شوف النتائج
 */

console.clear()
console.log('═══════════════════════════════════════════════════════════')
console.log('🔐 AUTH STATUS CHECK - تحقق من حالة التوثيق')
console.log('═══════════════════════════════════════════════════════════\n')

// ============ CHECK LOCALSTORAGE ============
console.log('📦 LOCALSTORAGE:')
const localToken = localStorage.getItem('token')
const localUser = localStorage.getItem('user')

if (localToken && localToken !== 'undefined') {
  console.log('✅ Token in localStorage:', localToken.substring(0, 50) + '...')
} else {
  console.log('❌ Token in localStorage: NOT FOUND or undefined')
}

if (localUser && localUser !== 'undefined') {
  try {
    const user = JSON.parse(localUser)
    console.log('✅ User in localStorage:', user)
  } catch (e) {
    console.log('❌ User in localStorage: CORRUPTED JSON')
  }
} else {
  console.log('❌ User in localStorage: NOT FOUND or undefined')
}

console.log('\n')

// ============ CHECK COOKIES ============
console.log('🍪 COOKIES:')
const cookies = document.cookie
  .split('; ')
  .reduce((acc, cookie) => {
    const [name, value] = cookie.split('=')
    if (name === 'token' || name === 'user') {
      acc[name] = decodeURIComponent(value)
    }
    return acc
  }, {})

if (cookies.token && cookies.token !== 'undefined') {
  console.log('✅ Token in cookies:', cookies.token.substring(0, 50) + '...')
} else {
  console.log('❌ Token in cookies: NOT FOUND or undefined')
}

if (cookies.user && cookies.user !== 'undefined') {
  try {
    const user = JSON.parse(cookies.user)
    console.log('✅ User in cookies:', user)
  } catch (e) {
    console.log('❌ User in cookies: CORRUPTED JSON')
  }
} else {
  console.log('❌ User in cookies: NOT FOUND or undefined')
}

console.log('\n')

// ============ OVERALL STATUS ============
console.log('═══════════════════════════════════════════════════════════')
console.log('📊 OVERALL STATUS:')
console.log('═══════════════════════════════════════════════════════════')

const hasValidToken = 
  (localToken && localToken !== 'undefined') || 
  (cookies.token && cookies.token !== 'undefined')

const hasValidUser = 
  (localUser && localUser !== 'undefined') || 
  (cookies.user && cookies.user !== 'undefined')

if (hasValidToken && hasValidUser) {
  console.log('✅ YOU ARE LOGGED IN!')
  console.log('✅ Token: VALID')
  console.log('✅ User Data: VALID')
  console.log('\n✨ Everything looks good! Try navigating to /dashboard')
} else if (hasValidToken && !hasValidUser) {
  console.log('⚠️ PARTIAL LOGIN STATE')
  console.log('✅ Token: FOUND')
  console.log('❌ User Data: MISSING')
  console.log('\n🔄 Try logging out and logging in again')
} else if (!hasValidToken && hasValidUser) {
  console.log('⚠️ PARTIAL LOGIN STATE')
  console.log('❌ Token: MISSING')
  console.log('✅ User Data: FOUND')
  console.log('\n🔄 Try logging out and logging in again')
} else {
  console.log('❌ NOT LOGGED IN')
  console.log('❌ Token: NOT FOUND')
  console.log('❌ User Data: NOT FOUND')
  console.log('\n👉 Go to /login and enter your credentials')
}

console.log('\n═══════════════════════════════════════════════════════════')
console.log('🛠️ QUICK FIXES:')
console.log('═══════════════════════════════════════════════════════════')

console.log(`
1. CLEAR ALL DATA:
   localStorage.clear()
   location.reload()

2. CLEAR SPECIFIC DATA:
   localStorage.removeItem('token')
   localStorage.removeItem('user')
   location.reload()

3. CHECK FULL TOKEN (long output):
   console.log(localStorage.getItem('token'))

4. CHECK FULL USER DATA:
   console.log(JSON.parse(localStorage.getItem('user')))
`)

console.log('═══════════════════════════════════════════════════════════\n')