/**
 * Navigation.jsx - ナビゲーションバーコンポーネント
 * 
 * アプリケーション全体のナビゲーションを提供します。
 * ページ間の移動、ログアウト、カレンダー表示、PWAインストールなどの機能を実装。
 * 
 * 主な機能:
 * - ページナビゲーション（タイムライン、マイページ、カレンダー）
 * - ユーザー情報表示（アイコン、名前）
 * - ドラッグ可能な練習カレンダー
 * - PWAインストールボタン
 * - ログアウト機能
 * - 管理者バッジ表示
 */

import React, { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../App'
import PracticeCalendar from './PracticeCalendar'
import './Navigation.css'

/**
 * ナビゲーションコンポーネント
 * 
 * @param {Object} props
 * @param {Array} props.posts - 投稿データ（カレンダー表示用）
 * @param {Function} props.onDateClick - カレンダーの日付クリックハンドラー
 * @param {Array} props.schedules - スケジュールデータ
 */
function Navigation({ posts, onDateClick, schedules = [] }) {
  // React Routerのフック
  const location = useLocation() // 現在のURLパス
  const navigate = useNavigate() // プログラマティックなナビゲーション
  
  // 認証情報
  const { user, signOut } = useAuth()
  
  /**
   * 状態管理
   */
  // ユーザープロフィール情報
  const [userProfile, setUserProfile] = useState(null)
  
  // カレンダーの最小化状態（LocalStorageに永続化）
  const [isCalendarMinimized, setIsCalendarMinimized] = useState(() => {
    const saved = localStorage.getItem('baseballSNSCalendarMinimized')
    return saved ? JSON.parse(saved) : false
  })
  
  // PWAインストール関連
  const [showInstallButton, setShowInstallButton] = useState(false)
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  
  // カレンダーの位置（ドラッグ可能）
  const [calendarPosition, setCalendarPosition] = useState(() => {
    const saved = localStorage.getItem('baseballSNSCalendarPosition')
    return saved ? JSON.parse(saved) : { x: 20, y: 100 } // デフォルト位置
  })
  
  // ドラッグ状態の管理
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  
  /**
   * ユーザープロフィールの読み込み
   * ログインユーザーが変更されたときや、ページ遷移時に実行
   */
  useEffect(() => {
    if (user) {
      let savedProfile = null
      
      // 管理者アカウントの場合は専用のキーから読み込み
      if (user.email === 'over9131120@gmail.com') {
        savedProfile = localStorage.getItem('baseballSNSAdminProfile')
      } else {
        // 通常ユーザーはメールアドレスをキーに使用
        const profileKey = `baseballSNSProfile_${user.email || 'guest'}`
        savedProfile = localStorage.getItem(profileKey)
      }
      
      if (savedProfile) {
        setUserProfile(JSON.parse(savedProfile))
      }
    }
  }, [user, location.pathname]) // location.pathnameを依存配列に追加

  /**
   * PWAインストール可能性のチェック
   * beforeinstallpromptイベントをリッスンし、インストール可能な場合はボタンを表示
   */
  useEffect(() => {
    // PWAインストールプロンプトのハンドラー
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault() // デフォルトのプロンプトを防ぐ
      setDeferredPrompt(e) // 後で使用するために保存
      setShowInstallButton(true)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

    // iOS対応：iOSではbeforeinstallpromptイベントが発生しない
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream
    const isInStandalone = window.matchMedia('(display-mode: standalone)').matches
    
    // iOSでまだインストールされていない場合はボタンを表示
    if (isIOS && !isInStandalone) {
      setShowInstallButton(true)
    }

    // クリーンアップ
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    }
  }, [])

  /**
   * ログアウト処理
   * 認証情報をクリアしてログイン画面へ遷移
   */
  const handleSignOut = async () => {
    await signOut()
    navigate('/login')
  }

  /**
   * カレンダーの最小化/展開切り替え
   * 状態をLocalStorageに保存して永続化
   */
  const toggleCalendarMinimize = () => {
    const newState = !isCalendarMinimized
    setIsCalendarMinimized(newState)
    localStorage.setItem('baseballSNSCalendarMinimized', JSON.stringify(newState))
  }

  /**
   * PWAインストールボタンのクリックハンドラー
   * Android/デスクトップとiOSで異なる処理を実行
   */
  const handleInstallClick = async () => {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream
    
    if (isIOS) {
      // iOSの場合は手動インストール手順を表示
      alert('iOSでのインストール:\n1. Safari下部の共有ボタンをタップ\n2. 「ホーム画面に追加」を選択\n3. 「追加」をタップ')
    } else if (deferredPrompt) {
      // Android/デスクトップの場合はプロンプトを表示
      deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice
      
      if (outcome === 'accepted') {
        setShowInstallButton(false)
      }
      
      setDeferredPrompt(null)
    }
  }

  /**
   * マウスドラッグ開始ハンドラー
   * カレンダーのドラッグ移動用
   * 
   * @param {MouseEvent} e - マウスイベント
   */
  const handleMouseDown = (e) => {
    setIsDragging(true)
    // ドラッグ開始時のマウス位置とカレンダー位置の差分を記録
    setDragStart({
      x: e.clientX - calendarPosition.x,
      y: e.clientY - calendarPosition.y
    })
  }

  /**
   * マウス移動ハンドラー
   * ドラッグ中のカレンダー位置を更新
   * 
   * @param {MouseEvent} e - マウスイベント
   */
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

  /**
   * マウスボタンリリースハンドラー
   * ドラッグ終了時に位置を保存
   */
  const handleMouseUp = () => {
    if (isDragging) {
      setIsDragging(false)
      // 位置をLocalStorageに保存
      localStorage.setItem('baseballSNSCalendarPosition', JSON.stringify(calendarPosition))
    }
  }

  /**
   * タッチ開始ハンドラー（モバイル対応）
   * 
   * @param {TouchEvent} e - タッチイベント
   */
  const handleTouchStart = (e) => {
    const touch = e.touches[0]
    setIsDragging(true)
    setDragStart({
      x: touch.clientX - calendarPosition.x,
      y: touch.clientY - calendarPosition.y
    })
  }

  /**
   * タッチ移動ハンドラー（モバイル対応）
   * 
   * @param {TouchEvent} e - タッチイベント
   */
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

  /**
   * タッチ終了ハンドラー（モバイル対応）
   */
  const handleTouchEnd = handleMouseUp

  /**
   * ドラッグ中のマウス/タッチイベントをドキュメント全体で処理
   * カレンダー外でマウスを動かしても追従するように
   */
  useEffect(() => {
    if (isDragging) {
      // マウスイベント
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      
      // タッチイベント
      document.addEventListener('touchmove', handleTouchMove)
      document.addEventListener('touchend', handleTouchEnd)
      
      // クリーンアップ
      return () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
        document.removeEventListener('touchmove', handleTouchMove)
        document.removeEventListener('touchend', handleTouchEnd)
      }
    }
  }, [isDragging, dragStart])

  // 非ログイン時は何も表示しない
  if (!user) return null

  // コンポーネントのレンダリング
  return (
    <>
      {/* メインナビゲーションバー */}
      <nav className="navigation">
        {/* ナビゲーションアイテム */}
        <div className="nav-items">
          {/* タイムライン */}
          <Link
            to="/"
            className={`nav-item ${location.pathname === '/' ? 'active' : ''}`}
          >
            <span className="nav-icon">🏠</span>
            <span className="nav-label">タイムライン</span>
          </Link>
          
          {/* マイページ */}
          <Link
            to="/mypage"
            className={`nav-item ${location.pathname === '/mypage' ? 'active' : ''}`}
          >
            <span className="nav-icon">📄</span>
            <span className="nav-label">マイページ</span>
          </Link>
          
          {/* プロフィール */}
          <Link
            to="/profile"
            className={`nav-item ${location.pathname === '/profile' ? 'active' : ''}`}
          >
            <span className="nav-icon">👤</span>
            <span className="nav-label">プロフィール</span>
          </Link>
          
          {/* アプリインストール */}
          {showInstallButton && (
            <button 
              className="nav-item install-button"
              onClick={handleInstallClick}
              title="アプリをインストール"
            >
              <span className="nav-icon">📱</span>
              <span className="nav-label">アプリ</span>
            </button>
          )}
          
          {/* 管理者 */}
          {(user.isAdmin || user.email === 'over9131120@gmail.com') && (
            <div className="nav-item admin-info">
              <span className="nav-icon">👤</span>
              <span className="nav-label">管理者</span>
            </div>
          )}
          
          {/* その他メニュー */}
          <div className="nav-item more-menu">
            <span className="nav-icon">⚙️</span>
            <span className="nav-label">その他</span>
            <div className="dropdown-menu">
              <Link to="/calendar" className="dropdown-item">
                <span className="dropdown-icon">📅</span>
                カレンダー
              </Link>
              <button onClick={handleSignOut} className="dropdown-item logout">
                <span className="dropdown-icon">🚪</span>
                ログアウト
              </button>
            </div>
          </div>
        </div>
      </nav>
      
      {/* ドラッグ可能なフローティングカレンダー */}
      {location.pathname !== '/calendar' && (
        <div 
          className={`nav-calendar ${isCalendarMinimized ? 'minimized' : ''} ${isDragging ? 'dragging' : ''}`}
          style={{
            left: `${calendarPosition.x}px`,
            top: `${calendarPosition.y}px`,
          }}
        >
          {/* カレンダーヘッダー（ドラッグ可能エリア） */}
          <div 
            className="calendar-header-section"
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
          >
            <h3>📅 練習カレンダー</h3>
            <button 
              className="calendar-minimize-btn"
              onClick={toggleCalendarMinimize}
              title={isCalendarMinimized ? "展開" : "最小化"}
            >
              {isCalendarMinimized ? '📅' : '−'}
            </button>
          </div>
          
          {/* カレンダー本体 */}
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
  )
}

export default Navigation