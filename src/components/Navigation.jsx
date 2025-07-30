import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import './Navigation.css'

function Navigation() {
  const location = useLocation()

  return (
    <nav className="navigation">
      <Link 
        to="/" 
        className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
      >
        <span className="nav-icon">🏠</span>
        <span className="nav-label">タイムライン</span>
      </Link>
      <Link 
        to="/mypage" 
        className={`nav-link ${location.pathname === '/mypage' ? 'active' : ''}`}
      >
        <span className="nav-icon">📊</span>
        <span className="nav-label">マイページ</span>
      </Link>
    </nav>
  )
}

export default Navigation