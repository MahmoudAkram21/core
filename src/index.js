import React from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import 'core-js'

import App from './App'
import store from './store'
import { AuthProvider } from './Context/AuthContext.jsx'


createRoot(document.getElementById('root')).render(
  <AuthProvider>
  <Provider store={store}>
    <App />
  </Provider>
  </AuthProvider>

)
