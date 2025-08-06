import React, { useState, useEffect } from 'react'
import './InstallPrompt.css'

function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [showInstallPrompt, setShowInstallPrompt] = useState(false)
  const [isIOS, setIsIOS] = useState(false)
  const [isStandalone, setIsStandalone] = useState(false)

  useEffect(() => {
    // Check if app is already installed (standalone mode)
    const isInStandaloneMode = window.matchMedia('(display-mode: standalone)').matches 
      || window.navigator.standalone 
      || document.referrer.includes('android-app://');
    
    setIsStandalone(isInStandaloneMode)

    // Check if iOS
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream
    setIsIOS(iOS)

    // Don't show prompt if already installed
    if (isInStandaloneMode) {
      return
    }

    // Check if install prompt was dismissed recently (24 hours)
    const dismissedTime = localStorage.getItem('installPromptDismissed')
    if (dismissedTime) {
      const timeDiff = Date.now() - parseInt(dismissedTime)
      const hoursDiff = timeDiff / (1000 * 60 * 60)
      if (hoursDiff < 24) {
        return
      }
    }

    // For iOS, show custom install instructions
    if (iOS) {
      setTimeout(() => {
        setShowInstallPrompt(true)
      }, 3000) // Show after 3 seconds
      return
    }

    // For other browsers, listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setShowInstallPrompt(true)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

    // Check if should show install prompt based on user engagement
    const visitCount = parseInt(localStorage.getItem('visitCount') || '0') + 1
    localStorage.setItem('visitCount', visitCount.toString())
    
    if (visitCount >= 2) {
      // Show prompt after 2 visits
      setTimeout(() => {
        if (deferredPrompt) {
          setShowInstallPrompt(true)
        }
      }, 5000)
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    }
  }, [deferredPrompt])

  const handleInstallClick = async () => {
    if (!isIOS && deferredPrompt) {
      deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice
      
      if (outcome === 'accepted') {
        console.log('User accepted the install prompt')
      } else {
        console.log('User dismissed the install prompt')
      }
      
      setDeferredPrompt(null)
      setShowInstallPrompt(false)
    }
  }

  const handleDismiss = () => {
    setShowInstallPrompt(false)
    localStorage.setItem('installPromptDismissed', Date.now().toString())
  }

  if (!showInstallPrompt || isStandalone) {
    return null
  }

  // iOS用のインストール案内
  if (isIOS) {
    return (
      <div className="install-prompt ios">
        <div className="install-prompt-content">
          <div className="install-prompt-header">
            <img src="/icon-192.png" alt="BaseLog" className="app-icon" />
            <div className="install-prompt-text">
              <h3>BaseLogをホーム画面に追加</h3>
              <p>アプリのように素早くアクセスできます</p>
            </div>
            <button className="close-button" onClick={handleDismiss}>×</button>
          </div>
          
          <div className="ios-instructions">
            <div className="instruction-step">
              <span className="step-number">1</span>
              <span className="step-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M12 16V8M8 12L12 8L16 12" stroke="#2e7d46" strokeWidth="2" strokeLinecap="round"/>
                  <rect x="3" y="4" width="18" height="16" stroke="#2e7d46" strokeWidth="2" rx="2"/>
                </svg>
              </span>
              <span>下部の共有ボタンをタップ</span>
            </div>
            
            <div className="instruction-step">
              <span className="step-number">2</span>
              <span className="step-icon">➕</span>
              <span>「ホーム画面に追加」を選択</span>
            </div>
            
            <div className="instruction-step">
              <span className="step-number">3</span>
              <span className="step-icon">✓</span>
              <span>「追加」をタップで完了</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Android/その他のブラウザ用
  return (
    <div className="install-prompt">
      <div className="install-prompt-content">
        <div className="install-prompt-header">
          <img src="/icon-192.png" alt="BaseLog" className="app-icon" />
          <div className="install-prompt-text">
            <h3>BaseLogをインストール</h3>
            <p>ホーム画面に追加してアプリとして使用</p>
          </div>
        </div>
        
        <div className="install-prompt-features">
          <div className="feature">
            <span className="feature-icon">⚡</span>
            <span>高速起動</span>
          </div>
          <div className="feature">
            <span className="feature-icon">📱</span>
            <span>オフライン対応</span>
          </div>
          <div className="feature">
            <span className="feature-icon">🔔</span>
            <span>通知機能</span>
          </div>
        </div>
        
        <div className="install-prompt-actions">
          <button className="btn-install" onClick={handleInstallClick}>
            インストール
          </button>
          <button className="btn-later" onClick={handleDismiss}>
            後で
          </button>
        </div>
      </div>
    </div>
  )
}

export default InstallPrompt