import React, { useState, useEffect } from 'react'
import './InstallPWA.css'

function InstallPWA() {
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [showInstallButton, setShowInstallButton] = useState(false)
  const [isIOS, setIsIOS] = useState(false)
  const [isStandalone, setIsStandalone] = useState(false)

  useEffect(() => {
    // Check if running on iOS
    const isIOSDevice = /iphone|ipad|ipod/.test(window.navigator.userAgent.toLowerCase())
    setIsIOS(isIOSDevice)

    // Check if app is already installed
    const isInStandaloneMode = window.matchMedia('(display-mode: standalone)').matches || 
                               window.navigator.standalone === true
    setIsStandalone(isInStandaloneMode)

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setShowInstallButton(true)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

    // Check if prompt is already available
    if (window.deferredPrompt) {
      setDeferredPrompt(window.deferredPrompt)
      setShowInstallButton(true)
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    }
  }, [])

  const handleInstallClick = async () => {
    if (!deferredPrompt) return

    try {
      // Show the install prompt
      await deferredPrompt.prompt()

      // Wait for the user to respond to the prompt
      const { outcome } = await deferredPrompt.userChoice

      if (outcome === 'accepted') {
        console.log('User accepted the install prompt')
      } else {
        console.log('User dismissed the install prompt')
      }
    } catch (error) {
      console.error('PWAインストールプロンプトエラー:', error)
    } finally {
      // Clear the deferred prompt
      setDeferredPrompt(null)
      setShowInstallButton(false)
    }
  }

  // Don't show anything if app is already installed
  if (isStandalone) {
    return null
  }

  // iOS specific instructions
  if (isIOS) {
    return (
      <div className="install-pwa-ios">
        <div className="install-instructions">
          <p>ホーム画面に追加するには：</p>
          <ol>
            <li>下部の共有ボタン <span className="share-icon">􀈂</span> をタップ</li>
            <li>「ホーム画面に追加」を選択</li>
            <li>「追加」をタップ</li>
          </ol>
        </div>
      </div>
    )
  }

  // Android/Desktop install button
  if (showInstallButton) {
    return (
      <button className="install-pwa-button" onClick={handleInstallClick}>
        <span className="install-icon">📲</span>
        アプリをインストール
      </button>
    )
  }

  return null
}

export default InstallPWA