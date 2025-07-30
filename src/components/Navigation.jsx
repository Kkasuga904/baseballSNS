import React, { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../App'
import PracticeCalendar from './PracticeCalendar'
import './Navigation.css'

function Navigation({ posts, onDateClick, schedules = [] }) {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, signOut } = useAuth()
  
  const [userProfile, setUserProfile] = useState(null)
  const [isCalendarMinimized, setIsCalendarMinimized] = useState(() => {
    const saved = localStorage.getItem('baseballSNSCalendarMinimized')
    return saved ? JSON.parse(saved) : false
  })
  
  useEffect(() => {
    if (user) {
      const profileKey = `baseballSNSProfile_${user.email || 'guest'}`
      const savedProfile = localStorage.getItem(profileKey)
      if (savedProfile) {
        setUserProfile(JSON.parse(savedProfile))
      }
    }
  }, [user, location.pathname]) // location.pathnameを追加して、ページ遷移時に更新

  const handleSignOut = async () => {
    await signOut()
    navigate('/login')
  }

  const toggleCalendarMinimize = () => {
    const newState = !isCalendarMinimized
    setIsCalendarMinimized(newState)
    localStorage.setItem('baseballSNSCalendarMinimized', JSON.stringify(newState))
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
          <>
            <Link 
              to="/mypage" 
              className={`nav-link ${location.pathname === '/mypage' ? 'active' : ''}`}
            >
              <span className="nav-icon">📊</span>
              <span className="nav-label">マイページ</span>
            </Link>
            <Link 
              to="/profile" 
              className={`nav-link ${location.pathname === '/profile' ? 'active' : ''}`}
            >
              <span className="nav-icon">👤</span>
              <span className="nav-label">プロフィール</span>
            </Link>
          </>
        )}
      </div>
      <div className="nav-auth">
        {user ? (
          <>
            <div className="user-info">
              {userProfile?.avatar ? (
                <img 
                  src={userProfile.avatar} 
                  alt={userProfile.nickname} 
                  className="nav-user-avatar"
                  onClick={() => navigate('/profile')}
                />
              ) : (
                <div 
                  className="nav-avatar-placeholder"
                  onClick={() => navigate('/profile')}
                >
                  <span className="nav-avatar-icon">👤</span>
                </div>
              )}
              <span className="user-email">{userProfile?.nickname || user.email}</span>
            </div>
            <button onClick={handleSignOut} className="logout-button">
              ログアウト
            </button>
            {location.pathname === '/mypage' && (
              <div className="nav-calendar">
                <div className="calendar-header-section">
                  <h3 
                    className="calendar-header-clickable" 
                    onClick={() => navigate('/calendar')}
                    style={{ cursor: 'pointer' }}
                  >
                    📅 練習カレンダー
                  </h3>
                  <button
                    className="calendar-minimize-btn"
                    onClick={toggleCalendarMinimize}
                    title={isCalendarMinimized ? 'カレンダーを表示' : 'カレンダーを最小化'}
                  >
                    {isCalendarMinimized ? '▼' : '▲'}
                  </button>
                </div>
                {!isCalendarMinimized && (
                  <PracticeCalendar 
                    practices={posts} 
                    onDateClick={onDateClick}
                    schedules={schedules}
                  />
                )}
              </div>
            )}
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