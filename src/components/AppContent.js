import React, { Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { CContainer, CSpinner } from '@coreui/react'

// routes config
import routes from '../routes'

/**
 * AppContent component - renders all application routes
 * Handles both React lazy components and pre-rendered JSX elements
 */

const AppContent = () => {
  return (
    <CContainer className="px-4" lg>
      <Suspense fallback={<CSpinner color="primary" />}>
        <Routes>
          {routes.map((route, idx) => {
            if (!route.element) return null
            
            // Check if element is a React element (JSX) or a component
            const elementToRender = React.isValidElement(route.element) 
              ? route.element 
              : <route.element />
            
            return (
              <Route
                key={idx}
                path={route.path}
                exact={route.exact}
                name={route.name}
                element={elementToRender}
              />
            )
          })}
          <Route path="/" element={<Navigate to="dashboard" replace />} />
        </Routes>
      </Suspense>
    </CContainer>
  )
}

export default React.memo(AppContent)
