import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

/**
 * Service Worker の登録処理
 * 
 * 開発環境と本番環境で異なるService Workerを使用：
 * - 開発環境: sw-dev.js（最小限の機能のみ）
 * - 本番環境: sw.js（完全な機能）
 */
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    // 環境に応じてService Workerファイルを選択
    const swUrl = import.meta.env.DEV ? '/sw-dev.js' : '/sw.js';
    
    // Service Workerを通常のスクリプトとして登録（ESモジュールではない）
    // type: 'classic' を明示的に指定してMIMEタイプエラーを防ぐ
    navigator.serviceWorker.register(swUrl, { type: 'classic' })
      .then(registration => {
        console.log(`Service Worker registered: ${swUrl}`, registration)
        
        // 本番環境でのみ自動更新機能を有効化
        if (!import.meta.env.DEV) {
          // 更新が見つかったときの処理
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing
            console.log('[SW] 新しいService Workerが見つかりました')
            
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'activated') {
                console.log('[SW] 新しいService Workerがアクティブになりました')
                // controllerchangeイベントを待たずに即座にリロード
                window.location.reload()
              }
            })
          })
          
          // 即座に更新をチェック
          registration.update()
          
          // 定期的に更新をチェック（5分ごと）
          setInterval(() => {
            registration.update()
          }, 5 * 60 * 1000) // 5分ごと
        }
      })
      .catch(error => {
        console.error('Service Worker registration failed:', error)
      })
  })
  
  // 本番環境でのみ: Service Workerがコントローラーを変更したときもリロード
  if (!import.meta.env.DEV) {
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      console.log('[SW] コントローラーが変更されました。ページをリロードします。')
      window.location.reload()
    })
  }
}

// Add PWA install prompt handling
window.addEventListener('beforeinstallprompt', (e) => {
  // Prevent the mini-infobar from appearing on mobile
  e.preventDefault()
  // Store the event so it can be triggered later
  window.deferredPrompt = e
  // Optionally, notify your UI that install is available
  console.log('PWA install available')
})

// Handle app installed event
window.addEventListener('appinstalled', () => {
  console.log('PWA was installed')
  window.deferredPrompt = null
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)