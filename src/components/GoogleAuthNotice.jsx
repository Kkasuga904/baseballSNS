import React from 'react'
import './GoogleAuthNotice.css'

function GoogleAuthNotice({ onClose, onProceed }) {
  return (
    <div className="google-auth-notice-overlay">
      <div className="google-auth-notice-modal">
        <h3>🔐 Google認証について</h3>
        
        <div className="notice-content">
          <p>Google認証を使用するには、以下の設定が必要です：</p>
          
          <ol>
            <li>
              <strong>Firebaseプロジェクトの設定</strong>
              <ul>
                <li>Firebase Consoleでプロジェクトを作成</li>
                <li>Google認証を有効化</li>
                <li>環境変数（.env）に認証情報を設定</li>
              </ul>
            </li>
            
            <li>
              <strong>ブラウザの設定</strong>
              <ul>
                <li>サードパーティCookieを許可</li>
                <li>ポップアップブロックを解除</li>
              </ul>
            </li>
          </ol>
          
          <div className="demo-notice">
            <p className="demo-title">💡 今すぐ試したい場合</p>
            <p>Firebase設定なしでデモ認証を使用できます。<br />
            「デモ認証を使用」をクリックしてください。</p>
          </div>
        </div>
        
        <div className="notice-actions">
          <button 
            className="notice-button notice-button-secondary"
            onClick={onClose}
          >
            デモ認証を使用
          </button>
          <button 
            className="notice-button notice-button-primary"
            onClick={onProceed}
          >
            Google認証を続行
          </button>
        </div>
      </div>
    </div>
  )
}

export default GoogleAuthNotice