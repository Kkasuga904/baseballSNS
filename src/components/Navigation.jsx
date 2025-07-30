import React from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../App'
import './Navigation.css'

function Navigation() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, signOut } = useAuth()

  const handleSignOut = async () => {
    await signOut()
    navigate('/login')
  }

  return (
    <nav className="navigation">
      <div>
        <Link 
          to="/" 
          className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
        >
          <span className="nav-icon">🏠</span>
          <span className="nav-label">タイムライン</span>
        </Link>
        {user && (
          <Link 
            to="/mypage" 
            className={`nav-link ${location.pathname === '/mypage' ? 'active' : ''}`}
          >
            <span className="nav-icon">📊</span>
            <span className="nav-label">マイページ</span>
          </Link>
        )}
      </div>
      <div className="nav-auth">
        {user ? (
          <>
            <span className="user-email">{user.email}</span>
            <button onClick={handleSignOut} className="logout-button">
              ログアウト
            </button>
          </>
        ) : (
          <Link to="/login" className="login-link">
            ログイン
          </Link>
        )}
      </div>
    </nav>
  )
}

export default Navigation