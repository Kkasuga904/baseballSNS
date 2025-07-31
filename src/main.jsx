import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

/**
 * Service Worker の登録処理
 * 
 * 本番環境でのみService Workerを登録
 * 開発環境では完全に無効化してMIMEタイプエラーを回避
 */
if ('serviceWorker' in navigator && !import.meta.env.DEV) {
  // 本番環境でのみ実行
  window.addEventListener('load', () => {
    console.log('[SW] 本番環境でService Workerを登録します')
    
    // register-sw.jsの動的読み込みは既にindex.htmlで行っているため、
    // ここでは自動更新のイベントリスナーのみ設定
    navigator.serviceWorker.ready.then(registration => {
      console.log('[SW] Service Worker is ready:', registration)
      
      // 更新が見つかったときの処理
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing
        console.log('[SW] 新しいService Workerが見つかりました')
        
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'activated') {
            console.log('[SW] 新しいService Workerがアクティブになりました')
            // 自動的にページをリロード
            window.location.reload()
          }
        })
      })
      
      // 定期的に更新をチェック（5分ごと）
      setInterval(() => {
        registration.update()
      }, 5 * 60 * 1000)
    })
  })
  
  // Service Workerがコントローラーを変更したときもリロード
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    console.log('[SW] コントローラーが変更されました。ページをリロードします。')
    window.location.reload()
  })
} else if (import.meta.env.DEV) {
  console.log('[SW] 開発環境のため、Service Workerは無効化されています')
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