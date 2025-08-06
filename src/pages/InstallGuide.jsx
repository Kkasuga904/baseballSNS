import React from 'react'
import './InstallGuide.css'

function InstallGuide() {
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream
  const isAndroid = /Android/.test(navigator.userAgent)
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches 
    || window.navigator.standalone 
    || document.referrer.includes('android-app://')

  if (isStandalone) {
    return (
      <div className="install-guide-page">
        <div className="install-success">
          <div className="success-icon">✅</div>
          <h2>インストール完了！</h2>
          <p>BaseLogがアプリとして利用可能になりました</p>
          <button 
            className="btn-start"
            onClick={() => { window.location.href = '/' }}
          >
            アプリを開始
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="install-guide-page">
      {/* iOS風のシェアシート */}
      {isIOS && (
        <div className="ios-share-sheet">
          <div className="share-sheet-header">
            <div className="share-sheet-title">
              <img src="/icon-192x192.png" alt="BaseLog" className="share-icon" />
              <div className="share-text">
                <div className="share-title">野球練習ノート</div>
                <div className="share-url">baselog.jp</div>
              </div>
              <button className="close-sheet">×</button>
            </div>
            <div className="options-text">Options ›</div>
          </div>
          
          <div className="share-sheet-apps">
            <div className="app-icon-wrapper">
              <div className="app-icon airdrop">
                <div className="icon-image">📡</div>
              </div>
              <span>AirDrop</span>
            </div>
            <div className="app-icon-wrapper">
              <div className="app-icon messages">
                <div className="icon-image">💬</div>
              </div>
              <span>Messages</span>
            </div>
            <div className="app-icon-wrapper">
              <div className="app-icon mail">
                <div className="icon-image">✉️</div>
              </div>
              <span>Mail</span>
            </div>
            <div className="app-icon-wrapper">
              <div className="app-icon notes">
                <div className="icon-image">📝</div>
              </div>
              <span>Notes</span>
            </div>
          </div>
          
          <div className="share-sheet-actions">
            <div className="action-item">
              <span className="action-text">Copy</span>
              <span className="action-icon">📋</span>
            </div>
            <div className="action-item">
              <span className="action-text">Add to Reading List</span>
              <span className="action-icon">👓</span>
            </div>
            <div className="action-item">
              <span className="action-text">Add Bookmark</span>
              <span className="action-icon">📖</span>
            </div>
            <div className="action-item">
              <span className="action-text">Add to Favorites</span>
              <span className="action-icon">⭐</span>
            </div>
            <div className="action-item">
              <span className="action-text">Add to Quick Note</span>
              <span className="action-icon">📝</span>
            </div>
            <div className="action-item">
              <span className="action-text">Find on Page</span>
              <span className="action-icon">🔍</span>
            </div>
            <div className="action-item highlighted">
              <span className="action-text">Add to Home Screen</span>
              <span className="action-icon">➕</span>
            </div>
          </div>
          
          <div className="instruction-arrow">
            <span>👆</span>
            <p>「Add to Home Screen」をタップしてください</p>
          </div>
        </div>
      )}

      {!isIOS && (
        <div className="install-guide-container">
          <div className="install-header">
            <img src="/icon-192x192.png" alt="BaseLog" className="app-logo" />
            <h1>BaseLogをスマートフォンで<br/>アプリとして使用する</h1>
            <p className="subtitle">
              ブラウザアプリより「ホーム画面に追加」を選択することで、<br/>
              お使いのスマートフォンのホーム画面にBaseLogのアイコンを作成することができます。
            </p>
          </div>

          {isAndroid && (
            <div className="install-instructions android">
              <h2>Androidでの追加方法</h2>
            
            <div className="instruction-card">
              <div className="step-header">
                <span className="step-number">1</span>
                <h3>Safari で BaseLog を開く</h3>
              </div>
              <p>このページをSafariブラウザで開いてください</p>
              <div className="instruction-image safari-hint">
                <span className="browser-icon">🧭</span>
                Safari
              </div>
            </div>

            <div className="instruction-card">
              <div className="step-header">
                <span className="step-number">2</span>
                <h3>共有ボタンをタップ</h3>
              </div>
              <p>画面下部の共有ボタン（□に↑のアイコン）をタップします</p>
              <div className="share-button-demo">
                <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
                  <path d="M12 3L12 15M12 3L7 8M12 3L17 8" stroke="#007AFF" strokeWidth="2" strokeLinecap="round"/>
                  <rect x="3" y="10" width="18" height="11" stroke="#007AFF" strokeWidth="2" rx="2"/>
                </svg>
              </div>
            </div>

            <div className="instruction-card">
              <div className="step-header">
                <span className="step-number">3</span>
                <h3>「ホーム画面に追加」を選択</h3>
              </div>
              <p>メニューから「ホーム画面に追加」をタップします</p>
              <div className="menu-item-demo">
                <span className="menu-icon">➕</span>
                <span>ホーム画面に追加</span>
              </div>
            </div>

            <div className="instruction-card">
              <div className="step-header">
                <span className="step-number">4</span>
                <h3>「追加」をタップ</h3>
              </div>
              <p>右上の「追加」ボタンをタップして完了です</p>
            </div>
          </div>
        )}

        {isAndroid && (
          <div className="install-instructions android">
            <h2>Androidでの追加方法</h2>
            
            <div className="instruction-card">
              <div className="step-header">
                <span className="step-number">1</span>
                <h3>Chrome で BaseLog を開く</h3>
              </div>
              <p>このページをChromeブラウザで開いてください</p>
              <div className="instruction-image chrome-hint">
                <span className="browser-icon">🌐</span>
                Chrome
              </div>
            </div>

            <div className="instruction-card">
              <div className="step-header">
                <span className="step-number">2</span>
                <h3>メニューボタンをタップ</h3>
              </div>
              <p>画面右上の「⋮」メニューボタンをタップします</p>
            </div>

            <div className="instruction-card">
              <div className="step-header">
                <span className="step-number">3</span>
                <h3>「ホーム画面に追加」を選択</h3>
              </div>
              <p>メニューから「ホーム画面に追加」または「アプリをインストール」を選択</p>
            </div>

            <div className="instruction-card">
              <div className="step-header">
                <span className="step-number">4</span>
                <h3>「追加」または「インストール」をタップ</h3>
              </div>
              <p>確認画面で「追加」または「インストール」をタップして完了です</p>
            </div>
          </div>
        )}

        {!isIOS && !isAndroid && (
          <div className="install-instructions desktop">
            <h2>PCでの追加方法</h2>
            
            <div className="instruction-card">
              <div className="step-header">
                <span className="step-number">1</span>
                <h3>Chrome/Edge で BaseLog を開く</h3>
              </div>
              <p>ChromeまたはMicrosoft Edgeブラウザでこのページを開いてください</p>
            </div>

            <div className="instruction-card">
              <div className="step-header">
                <span className="step-number">2</span>
                <h3>アドレスバーのインストールアイコンをクリック</h3>
              </div>
              <p>アドレスバー右端の「＋」アイコンをクリックします</p>
            </div>

            <div className="instruction-card">
              <div className="step-header">
                <span className="step-number">3</span>
                <h3>「インストール」をクリック</h3>
              </div>
              <p>表示されたダイアログで「インストール」をクリックして完了です</p>
            </div>
          </div>
        )}

        <div className="app-features">
          <h2>アプリとして使うメリット</h2>
          <div className="features-grid">
            <div className="feature-item">
              <span className="feature-emoji">⚡</span>
              <h3>高速起動</h3>
              <p>ホーム画面から1タップで起動</p>
            </div>
            <div className="feature-item">
              <span className="feature-emoji">📱</span>
              <h3>フルスクリーン</h3>
              <p>ブラウザのUIなしで全画面表示</p>
            </div>
            <div className="feature-item">
              <span className="feature-emoji">💾</span>
              <h3>オフライン対応</h3>
              <p>一度開いたページはオフラインでも閲覧可能</p>
            </div>
            <div className="feature-item">
              <span className="feature-emoji">🔔</span>
              <p>練習リマインダーなどの通知機能（今後実装予定）</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default InstallGuide