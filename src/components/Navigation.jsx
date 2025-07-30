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
  const [showInstallButton, setShowInstallButton] = useState(false)
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [calendarPosition, setCalendarPosition] = useState(() => {
    const saved = localStorage.getItem('baseballSNSCalendarPosition')
    return saved ? JSON.parse(saved) : { x: 20, y: 100 }
  })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  
  useEffect(() => {
    if (user) {
      let savedProfile = null
      
      // 管理者アカウントの場合は専用のキーから読み込み
      if (user.email === 'over9131120@gmail.com') {
        savedProfile = localStorage.getItem('baseballSNSAdminProfile')
      } else {
        const profileKey = `baseballSNSProfile_${user.email || 'guest'}`
        savedProfile = localStorage.getItem(profileKey)
      }
      
      if (savedProfile) {
        setUserProfile(JSON.parse(savedProfile))
      }
    }
  }, [user, location.pathname]) // location.pathnameを追加して、ページ遷移時に更新

  useEffect(() => {
    // PWAインストール可能かチェック
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setShowInstallButton(true)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

    // iOSかどうかチェック
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream
    const isInStandalone = window.matchMedia('(display-mode: standalone)').matches
    
    if (isIOS && !isInStandalone) {
      setShowInstallButton(true)
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    }
  }, [])

  const handleSignOut = async () => {
    await signOut()
    navigate('/login')
  }

  const toggleCalendarMinimize = () => {
    const newState = !isCalendarMinimized
    setIsCalendarMinimized(newState)
    localStorage.setItem('baseballSNSCalendarMinimized', JSON.stringify(newState))
  }

  const handleInstallClick = async () => {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream
    
    if (isIOS) {
      alert('iOSでのインストール:\n1. Safari下部の共有ボタンをタップ\n2. 「ホーム画面に追加」を選択\n3. 「追加」をタップ')
    } else if (deferredPrompt) {
      deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice
      
      if (outcome === 'accepted') {
        setShowInstallButton(false)
      }
      
      setDeferredPrompt(null)
    }
  }

  const handleMouseDown = (e) => {
    setIsDragging(true)
    setDragStart({
      x: e.clientX - calendarPosition.x,
      y: e.clientY - calendarPosition.y
    })
  }

  const handleMouseMove = (e) => {
    if (!isDragging) return
    
    const newX = e.clientX - dragStart.x
    const newY = e.clientY - dragStart.y
    
    // 画面内に収まるように制限
    const maxX = window.innerWidth - 300 // カレンダーの幅を考慮
    const maxY = window.innerHeight - 400 // カレンダーの高さを考慮
    
    setCalendarPosition({
      x: Math.max(0, Math.min(newX, maxX)),
      y: Math.max(60, Math.min(newY, maxY)) // ナビゲーションバーの高さを考慮
    })
  }

  const handleMouseUp = () => {
    if (isDragging) {
      setIsDragging(false)
      // 位置を保存
      localStorage.setItem('baseballSNSCalendarPosition', JSON.stringify(calendarPosition))
    }
  }

  const handleTouchStart = (e) => {
    const touch = e.touches[0]
    setIsDragging(true)
    setDragStart({
      x: touch.clientX - calendarPosition.x,
      y: touch.clientY - calendarPosition.y
    })
  }

  const handleTouchMove = (e) => {
    if (!isDragging) return
    
    const touch = e.touches[0]
    const newX = touch.clientX - dragStart.x
    const newY = touch.clientY - dragStart.y
    
    const maxX = window.innerWidth - 300
    const maxY = window.innerHeight - 400
    
    setCalendarPosition({
      x: Math.max(0, Math.min(newX, maxX)),
      y: Math.max(60, Math.min(newY, maxY))
    })
  }

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      document.addEventListener('touchmove', handleTouchMove)
      document.addEventListener('touchend', handleMouseUp)
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
        document.removeEventListener('touchmove', handleTouchMove)
        document.removeEventListener('touchend', handleMouseUp)
      }
    }
  }, [isDragging, dragStart, calendarPosition])

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
        {showInstallButton && (
          <button onClick={handleInstallClick} className="nav-install-button">
            <span className="install-icon">📲</span>
            <span className="install-label">アプリ</span>
          </button>
        )}
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
              <span className="user-email">
                {user?.isAdmin && <span className="admin-badge">管理者</span>}
                {userProfile?.nickname || user.email}
              </span>
            </div>
            <button onClick={handleSignOut} className="logout-button">
              ログアウト
            </button>
            {location.pathname === '/mypage' && (
              <>
                {!isCalendarMinimized && (
                  <div 
                    className="calendar-mobile-overlay"
                    onClick={() => setIsCalendarMinimized(true)}
                  />
                )}
                <div 
                  className={`nav-calendar ${isDragging ? 'dragging' : ''}`}
                  style={{
                    position: 'fixed',
                    left: `${calendarPosition.x}px`,
                    top: `${calendarPosition.y}px`,
                    zIndex: 999
                  }}
                >
                  <div 
                    className="calendar-header-section"
                    onMouseDown={handleMouseDown}
                    onTouchStart={handleTouchStart}
                  >
                    <div className="calendar-drag-handle">
                      <span className="drag-icon">⋮⋮</span>
                    </div>
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
              </>
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