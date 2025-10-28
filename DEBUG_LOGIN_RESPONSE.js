/**
 * DIRECT LOGIN DEBUG SCRIPT
 * 
 * Copy this entire script and paste into Browser DevTools Console (F12)
 * Then try to login - you'll see exactly what the API returns
 */

// Step 1: Log everything that happens
console.clear();
console.log('🚀 DEBUG MODE ACTIVATED - Monitoring login...\n');

// Step 2: Intercept the API response
const originalFetch = window.fetch;
window.fetch = function(...args) {
  const url = args[0];
  console.log(`📡 API Request: ${url}`);
  
  return originalFetch.apply(this, args)
    .then(response => {
      console.log(`📥 API Response Status: ${response.status} ${response.statusText}`);
      
      // Clone the response so we can read it twice
      const clonedResponse = response.clone();
      
      clonedResponse.json()
        .then(data => {
          if (url.includes('login')) {
            console.log('🔐 LOGIN RESPONSE DATA:', JSON.stringify(data, null, 2));
            console.log('\n📊 Response Structure:');
            console.log('- data:', data?.data ? 'EXISTS' : 'MISSING');
            console.log('- data.user:', data?.data?.user ? 'EXISTS' : 'MISSING');
            console.log('- data.auth_token:', data?.data?.auth_token ? 'EXISTS' : 'MISSING');
            console.log('- data.token:', data?.data?.token ? 'EXISTS' : 'MISSING');
            console.log('- user.role:', data?.data?.user?.role || 'MISSING');
          }
        })
        .catch(() => {});
      
      return response;
    })
    .catch(error => {
      console.error('❌ API ERROR:', error.message);
      throw error;
    });
};

console.log('✅ Debug script activated!');
console.log('📝 Now try logging in and watch the console...\n');

// Also log localStorage changes
setInterval(() => {
  const stored = localStorage.getItem('user');
  if (stored) {
    try {
      const user = JSON.parse(stored);
      console.log('💾 User saved in localStorage:', user);
    } catch (e) {
      console.log('💾 localStorage.user (raw):', stored);
    }
  }
}, 500);