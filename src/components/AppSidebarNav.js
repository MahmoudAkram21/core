import React from 'react'
import { NavLink } from 'react-router-dom'
import PropTypes from 'prop-types'

import SimpleBar from 'simplebar-react'
import 'simplebar-react/dist/simplebar.min.css'

import { CBadge, CNavLink, CSidebarNav } from '@coreui/react'

export const AppSidebarNav = ({ items, userRole }) => {
  // 🔥 Log role status at component render
  React.useEffect(() => {
    console.log('🎯 AppSidebarNav rendered with userRole:', userRole)
  }, [userRole])

  // ✅ دالة للتحقق من السماح بالدخول للعنصر
  const isItemAllowed = (item) => {
    // إذا لم يكن هناك قيود، السماح بالدخول
    if (!item.allowedRoles) {
      console.log(`✅ Item "${item.name}" allowed (no role restrictions)`)
      return true
    }
    
    // إذا كان هناك قيود لكن userRole موجود
    if (userRole) {
      const allowed = item.allowedRoles.includes(userRole.toLowerCase())
      console.log(`${allowed ? '✅' : '❌'} Item "${item.name}" - Role "${userRole}" ${allowed ? 'allowed' : 'not allowed'}`)
      return allowed
    }
    
    // 🔥 إذا لم يكن هناك دور، اعرض رسالة خطأ واضحة
    console.error(`🚨 CRITICAL: "${item.name}" requires role but userRole is NULL!`)
    console.error(`   allowedRoles: ${item.allowedRoles.join(', ')}`)
    console.error(`   Check browser console (F12) -> Application -> LocalStorage`)
    return false
  }

  const navLink = (name, icon, badge, indent = false) => {
    return (
      <>
        {icon
          ? icon
          : indent && (
              <span className="nav-icon">
                <span className="nav-icon-bullet"></span>
              </span>
            )}
        {name && name}
        {badge && (
          <CBadge color={badge.color} className="ms-auto" size="sm">
            {badge.text}
          </CBadge>
        )}
      </>
    )
  }

  const navItem = (item, index, indent = false) => {
    // ❌ إخفاء العنصر إذا لم يكن مسموح
    if (!isItemAllowed(item)) {
      return null
    }

    const { component, name, badge, icon, allowedRoles, ...rest } = item
    const Component = component
    return (
      <Component as="div" key={index}>
        {rest.to || rest.href ? (
          <CNavLink
            {...(rest.to && { as: NavLink })}
            {...(rest.href && { target: '_blank', rel: 'noopener noreferrer' })}
            {...rest}
          >
            {navLink(name, icon, badge, indent)}
          </CNavLink>
        ) : (
          navLink(name, icon, badge, indent)
        )}
      </Component>
    )
  }

  const navGroup = (item, index) => {
    // ❌ إخفاء المجموعة إذا لم تكن مسموحة أو إذا كانت جميع العناصر الداخلية مخفية
    if (!isItemAllowed(item)) {
      return null
    }

    const { component, name, icon, items, to, allowedRoles, ...rest } = item
    const Component = component
    
    // فلترة العناصر الداخلية وإظهار المجموعة فقط إذا كان هناك عناصر مرئية
    const visibleItems = items?.filter(subItem => isItemAllowed(subItem))
    
    if (!visibleItems || visibleItems.length === 0) {
      return null
    }

    return (
      <Component compact as="div" key={index} toggler={navLink(name, icon)} {...rest}>
        {visibleItems.map((item, index) =>
          item.items ? navGroup(item, index) : navItem(item, index, true),
        )}
      </Component>
    )
  }

  return (
    <CSidebarNav as={SimpleBar}>
      {items &&
        items.map((item, index) => (item.items ? navGroup(item, index) : navItem(item, index)))}
    </CSidebarNav>
  )
}

AppSidebarNav.propTypes = {
  items: PropTypes.arrayOf(PropTypes.any).isRequired,
  userRole: PropTypes.string,
}
