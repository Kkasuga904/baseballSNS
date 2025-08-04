import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import './MobileNavigation.css'

function MobileNavigation() {
  const location = useLocation()
  
  // ページ遷移時にスクロールを一番上に
  const handleNavClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  
  return (
    <nav className="mobile-navigation">
      <Link
        to="/"
        className={`mobile-nav-item ${location.pathname === '/' ? 'active' : ''}`}
        onClick={handleNavClick}
      >
        <span className="mobile-nav-icon">🏠</span>
        <span className="mobile-nav-label">タイムライン</span>
      </Link>
      
      <Link
        to="/mypage"
        className={`mobile-nav-item ${location.pathname === '/mypage' ? 'active' : ''}`}
        onClick={handleNavClick}
      >
        <span className="mobile-nav-icon">📄</span>
        <span className="mobile-nav-label">マイページ</span>
      </Link>
      
      <Link
        to="/profile"
        className={`mobile-nav-item ${location.pathname.startsWith('/profile') ? 'active' : ''}`}
        onClick={handleNavClick}
      >
        <span className="mobile-nav-icon">👤</span>
        <span className="mobile-nav-label">プロフィール</span>
      </Link>
      
      <Link
        to="/measurements"
        className={`mobile-nav-item ${location.pathname === '/measurements' ? 'active' : ''}`}
        onClick={handleNavClick}
      >
        <span className="mobile-nav-icon">📊</span>
        <span className="mobile-nav-label">測定結果</span>
      </Link>
      
      <Link
        to="/settings"
        className={`mobile-nav-item ${location.pathname === '/settings' ? 'active' : ''}`}
        onClick={handleNavClick}
      >
        <span className="mobile-nav-icon">⚙️</span>
        <span className="mobile-nav-label">設定</span>
      </Link>
    </nav>
  )
}

export default MobileNavigation