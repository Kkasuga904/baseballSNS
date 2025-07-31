import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

// Register service worker with automatic update handling
// 開発環境では無効化可能（必要に応じてコメントアウトを解除）
// if (import.meta.env.DEV) {
//   console.log('開発環境: Service Worker を無効化')
// } else 
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        console.log('Service Worker registered:', registration)
        
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
      })
      .catch(error => {
        console.error('Service Worker registration failed:', error)
      })
  })
  
  // Service Workerがコントローラーを変更したときもリロード
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    console.log('[SW] コントローラーが変更されました。ページをリロードします。')
    window.location.reload()
  })
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