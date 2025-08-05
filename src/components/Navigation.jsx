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
import TrainingCalendar from './TrainingCalendar'
import './Navigation.css'

/**
 * ナビゲーションコンポーネント
 * 
 * @param {Object} props
 * @param {Array} props.posts - 投稿データ（カレンダー表示用）
 * @param {Function} props.onDateClick - カレンダーの日付クリックハンドラー
 * @param {Array} props.schedules - スケジュールデータ
 */
function Navigation({ posts = [], onDateClick, schedules = [] }) {
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
    // スマホの場合は初期状態で最小化
    const isMobile = window.innerWidth <= 768
    const saved = localStorage.getItem('baseballSNSCalendarMinimized')
    return saved !== null ? JSON.parse(saved) : isMobile
  })
  
  // PWAインストール関連
  const [showInstallButton, setShowInstallButton] = useState(false)
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  
  // カレンダーの位置（ドラッグ可能）
  const [calendarPosition, setCalendarPosition] = useState(() => {
    const saved = localStorage.getItem('baseballSNSCalendarPosition')
    const isMobile = window.innerWidth <= 768
    // スマホの場合は画面右下に配置
    return saved ? JSON.parse(saved) : { 
      x: isMobile ? window.innerWidth - 180 : 20, 
      y: isMobile ? window.innerHeight - 100 : 100 
    }
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
   * 初回ロード時にスマホかどうかチェックして、
   * LocalStorageに保存値がない場合のみ最小化を設定
   */
  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth <= 768
      const saved = localStorage.getItem('baseballSNSCalendarMinimized')
      
      // LocalStorageに保存値がない場合のみ、スマホなら最小化
      if (saved === null && isMobile) {
        setIsCalendarMinimized(true)
      }
    }
    
    // 初回チェック
    handleResize()
    
    // リサイズイベントリスナー
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

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
    // 開発環境ではPWAインストール機能を無効化
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      console.log('開発環境のため、PWAインストール機能は無効です')
      alert('PWAインストール機能は本番環境でのみ利用可能です')
      return
    }
    
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream
    
    if (isIOS) {
      // iOSの場合は手動インストール手順を表示
      alert('iOSでのインストール:\n1. Safari下部の共有ボタンをタップ\n2. 「ホーム画面に追加」を選択\n3. 「追加」をタップ')
    } else if (deferredPrompt) {
      try {
        // Android/デスクトップの場合はプロンプトを表示
        await deferredPrompt.prompt()
        const { outcome } = await deferredPrompt.userChoice
        
        if (outcome === 'accepted') {
          setShowInstallButton(false)
        }
      } catch (error) {
        console.error('PWAインストールプロンプトエラー:', error)
      } finally {
        setDeferredPrompt(null)
      }
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
    const calendarWidth = window.innerWidth < 480 ? 260 : 300
    const isMobile = window.innerWidth <= 768
    
    // PCの場合は画面外も許可、モバイルは画面内に制限
    let finalX, finalY
    if (isMobile) {
      const maxX = window.innerWidth - calendarWidth - 10
      const maxY = window.innerHeight - 200 // カレンダー最小化時の高さを考慮
      finalX = Math.max(0, Math.min(newX, maxX))
      finalY = Math.max(60, Math.min(newY, maxY))
    } else {
      // PCの場合は左と上に大きく移動可能（右と下は画面内に制限）
      const maxX = window.innerWidth - 100 // 最低100px表示
      const maxY = window.innerHeight - 100 // 最低100px表示
      finalX = Math.max(-calendarWidth + 50, Math.min(newX, maxX)) // 左に大きくはみ出し可能
      finalY = Math.max(-200, Math.min(newY, maxY)) // 上に大きくはみ出し可能
    }
    
    setCalendarPosition({
      x: finalX,
      y: finalY
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
    
    const calendarWidth = window.innerWidth < 480 ? 260 : 300
    const isMobile = window.innerWidth <= 768
    
    // PCの場合は画面外も許可、モバイルは画面内に制限
    let finalX, finalY
    if (isMobile) {
      const maxX = window.innerWidth - calendarWidth - 10
      const maxY = window.innerHeight - 200
      finalX = Math.max(0, Math.min(newX, maxX))
      finalY = Math.max(60, Math.min(newY, maxY))
    } else {
      const maxX = window.innerWidth - 100
      const maxY = window.innerHeight - 100
      finalX = Math.max(-calendarWidth + 50, Math.min(newX, maxX))
      finalY = Math.max(-200, Math.min(newY, maxY))
    }
    
    setCalendarPosition({
      x: finalX,
      y: finalY
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
        <div className="nav-items">
          {/* タイムライン - MVP段階では不要 */}
          {/* <Link
            to="/"
            className={`nav-item ${location.pathname === '/' ? 'active' : ''}`}
          >
            <span className="nav-icon">🏠</span>
            <span className="nav-label">タイムライン</span>
          </Link> */}
          
          {/* Diary（練習記録） */}
          <Link
            to="/mypage"
            className={`nav-item ${location.pathname === '/mypage' ? 'active' : ''}`}
          >
            <span className="nav-icon">📓</span>
            <span className="nav-label">Diary</span>
          </Link>
          
          {/* Calendar（練習カレンダー） - 統合されるためコメントアウト */}
          {/* <Link
            to="/calendar"
            className={`nav-item ${location.pathname === '/calendar' ? 'active' : ''}`}
          >
            <span className="nav-icon">📅</span>
            <span className="nav-label">Calendar</span>
          </Link> */}
          
          {/* Stats（測定 or 初期データ記録） - 統合されるためコメントアウト */}
          {/* <Link
            to="/measurements"
            className={`nav-item ${location.pathname === '/measurements' ? 'active' : ''}`}
          >
            <span className="nav-icon">📊</span>
            <span className="nav-label">Stats</span>
          </Link> */}
          
          {/* アプリ - MVP段階では不要 */}
          {/* {showInstallButton && (
            <button 
              className="nav-item install-button"
              onClick={handleInstallClick}
              title="アプリをインストール"
            >
              <span className="nav-icon">📱</span>
              <span className="nav-label">アプリ</span>
            </button>
          )} */}
          
          {/* 管理者 */}
          {(user.isAdmin || user.email === 'over9131120@gmail.com') && (
            <div className="nav-item admin-badge">
              <span className="nav-icon">👤</span>
              <span className="nav-label">管理者</span>
            </div>
          )}
          
          {/* Settings - 統合されるためコメントアウト */}
          {/* <Link
            to="/settings"
            className={`nav-item ${location.pathname === '/settings' ? 'active' : ''}`}
          >
            <span className="nav-icon">⚙️</span>
            <span className="nav-label">Settings</span>
          </Link> */}
          
          {/* ログアウト - 設定ページに移動 */}
          {/* <button 
            onClick={handleSignOut} 
            className="nav-item logout-button"
          >
            <span className="nav-label">ログアウト</span>
          </button> */}
        </div>
      </nav>
      
      {/* ドラッグ可能なフローティングカレンダー - MVP段階では不要 */}
      {/* {location.pathname !== '/calendar' && (
        <div 
          className={`nav-calendar ${isCalendarMinimized ? 'minimized' : ''} ${isDragging ? 'dragging' : ''}`}
          style={{
            left: `${calendarPosition.x}px`,
            top: `${calendarPosition.y}px`,
          }}
        >
          <div 
            className="calendar-header-section"
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
            style={{ cursor: 'move' }}
          >
            <h3 style={{ color: '#2c5aa0', margin: 0 }}>⚾ BaseLog</h3>
            <button 
              className="calendar-minimize-btn"
              onClick={toggleCalendarMinimize}
              title={isCalendarMinimized ? "展開" : "最小化"}
              style={{ 
                background: '#f0f0f0',
                border: 'none',
                borderRadius: '50%',
                width: '24px',
                height: '24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              {isCalendarMinimized ? '＋' : '−'}
            </button>
          </div>
          
          {!isCalendarMinimized && (
            <TrainingCalendar 
              practices={posts} 
              onDateClick={onDateClick}
              schedules={schedules}
            />
          )}
        </div>
      )} */}
    </>
  )
}

export default Navigation