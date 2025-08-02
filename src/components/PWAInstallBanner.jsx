import React, { useState, useEffect } from 'react'
import './PWAInstallBanner.css'

function PWAInstallBanner() {
  const [showInstallBanner, setShowInstallBanner] = useState(false)
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [isIOS, setIsIOS] = useState(false)

  useEffect(() => {
    // iOSデバイスをチェック
    const checkIOS = () => {
      const userAgent = window.navigator.userAgent
      const isIOSDevice = /iPad|iPhone|iPod/.test(userAgent) && !window.MSStream
      const isInStandaloneMode = window.navigator.standalone
      return isIOSDevice && !isInStandaloneMode
    }

    setIsIOS(checkIOS())

    // PWAインストールバナーを表示済みかチェック
    const bannerDismissed = localStorage.getItem('pwaInstallBannerDismissed')
    
    // beforeinstallpromptイベントをリッスン
    const handleBeforeInstallPrompt = (e) => {
      // ブラウザのデフォルトプロンプトを防ぐ
      e.preventDefault()
      setDeferredPrompt(e)
      // カスタムバナーは表示しない（ブラウザのプロンプトを使う）
      // if (!bannerDismissed) {
      //   setShowInstallBanner(true)
      // }
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

    // iOS用のバナー表示（iOSはブラウザプロンプトがないため必要）
    if (checkIOS() && !bannerDismissed) {
      setShowInstallBanner(true)
    }

    // Android/デスクトップはブラウザのプロンプトに任せる
    // iOSのみカスタムバナーを表示

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    }
  }, [deferredPrompt])

  const handleInstallClick = async () => {
    if (isIOS) {
      // iOSの場合は手動インストール手順を表示
      alert('iOSでのインストール:\n1. Safari下部の共有ボタンをタップ\n2. 「ホーム画面に追加」を選択\n3. 「追加」をタップ')
    } else if (deferredPrompt) {
      deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice
      
      if (outcome === 'accepted') {
        console.log('PWAがインストールされました')
      }
      
      setDeferredPrompt(null)
      setShowInstallBanner(false)
    }
  }

  const handleDismiss = () => {
    setShowInstallBanner(false)
    localStorage.setItem('pwaInstallBannerDismissed', 'true')
  }

  if (!showInstallBanner) return null

  return (
    <div className="pwa-install-banner">
      <div className="banner-content">
        <div className="banner-icon">⚾</div>
        <div className="banner-text">
          <h3>BaseLogアプリをインストール</h3>
          <p>野球の記録と交流をひとつに</p>
        </div>
        <div className="banner-actions">
          <button className="install-button" onClick={handleInstallClick}>
            {isIOS ? '手順を見る' : 'インストール'}
          </button>
          <button className="dismiss-button" onClick={handleDismiss}>
            ✕
          </button>
        </div>
      </div>
    </div>
  )
}

export default PWAInstallBanner