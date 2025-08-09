// Safari デバッグ: モジュール読み込み開始
try {
  if (window.debugLog) window.debugLog('main.jsx starting imports...');
} catch (e) {
  console.error('Debug log error:', e);
}

// Safari互換性のためのcore-js polyfill
import 'core-js/stable'

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import './styles/mobile-fixes.css'

// Safari デバッグ: インポート完了
try {
  if (window.debugLog) window.debugLog('Imports completed successfully');
} catch (e) {
  console.error('Debug log error:', e);
}

/**
 * Service Worker の登録処理
 * 
 * 本番環境でのみService Workerを登録
 * 開発環境では完全に無効化してMIMEタイプエラーを回避
 */
// Safari互換性: import.meta.envの安全な参照
const isDev = (() => {
  try {
    return import.meta.env.DEV || false;
  } catch {
    return false;
  }
})();

if ('serviceWorker' in navigator && !isDev) {
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
} else if (isDev) {
  console.log('[SW] 開発環境のため、Service Workerは無効化されています')
}

// PWA install prompt handling - 開発環境では完全に無効化
if (!isDev) {
  let deferredPrompt = null;
  window.addEventListener('beforeinstallprompt', (e) => {
    // ブラウザのデフォルトプロンプトを無効化
    e.preventDefault();
    // 後で使うためにイベントを保存（但し今は使わない）
    deferredPrompt = e;
    console.log('PWAインストールプロンプトを無効化しました');
    
    // グローバル変数として保存（コンポーネントからアクセス可能にする）
    window.deferredPrompt = e;
  });
}

// アプリがインストールされたときの処理 - 開発環境では無効化
if (!isDev) {
  window.addEventListener('appinstalled', () => {
    console.log('PWAがインストールされました');
  });
}

// Safari デバッグ: React レンダリング開始
try {
  if (window.debugLog) window.debugLog('Starting React render...');
  
  const rootElement = document.getElementById('root');
  if (!rootElement) {
    throw new Error('Root element not found');
  }
  
  if (window.debugLog) window.debugLog('Root element found, creating React root...');
  
  const root = ReactDOM.createRoot(rootElement);
  
  if (window.debugLog) window.debugLog('Rendering App component...');
  
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
  
  if (window.debugLog) window.debugLog('React render completed');
} catch (error) {
  console.error('Failed to render React app:', error);
  if (window.debugLog) window.debugLog('React render failed: ' + error.message);
  
  // フォールバックエラー表示
  document.getElementById('root').innerHTML = `
    <div style="padding: 20px; font-family: sans-serif;">
      <h1 style="color: red;">エラーが発生しました</h1>
      <p>アプリケーションの起動に失敗しました。</p>
      <p>エラー: ${error.message}</p>
      <p>ブラウザのコンソールで詳細を確認してください。</p>
    </div>
  `;
}