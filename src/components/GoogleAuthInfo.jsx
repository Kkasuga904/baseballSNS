import React from 'react'
import './GoogleAuthInfo.css'

function GoogleAuthInfo() {
  return (
    <div className="google-auth-info">
      <h3>📝 Google認証の設定方法</h3>
      
      <div className="auth-info-section">
        <h4>1. Firebaseプロジェクトの作成</h4>
        <ol>
          <li>
            <a href="https://console.firebase.google.com/" target="_blank" rel="noopener noreferrer">
              Firebase Console
            </a>
            にアクセス
          </li>
          <li>「プロジェクトを作成」をクリック</li>
          <li>プロジェクト名を入力（例：baseball-sns-app）</li>
          <li>Google Analyticsは任意（オフでもOK）</li>
        </ol>
      </div>

      <div className="auth-info-section">
        <h4>2. Google認証の有効化</h4>
        <ol>
          <li>左側メニューから「Authentication」を選択</li>
          <li>「始める」をクリック</li>
          <li>「Sign-in method」タブで「Google」を選択</li>
          <li>「有効にする」をオンにして保存</li>
        </ol>
      </div>

      <div className="auth-info-section">
        <h4>3. ウェブアプリの追加</h4>
        <ol>
          <li>プロジェクト概要ページで「ウェブ」アイコンをクリック</li>
          <li>アプリのニックネームを入力</li>
          <li>「アプリを登録」をクリック</li>
          <li>表示される設定情報をコピー</li>
        </ol>
      </div>

      <div className="auth-info-section">
        <h4>4. 環境変数の設定</h4>
        <pre className="code-block">
{`# .envファイルを作成して以下を設定
VITE_FIREBASE_API_KEY=取得したAPIキー
VITE_FIREBASE_AUTH_DOMAIN=取得したauthDomain
VITE_FIREBASE_PROJECT_ID=取得したprojectId
VITE_FIREBASE_STORAGE_BUCKET=取得したstorageBucket
VITE_FIREBASE_MESSAGING_SENDER_ID=取得したmessagingSenderId
VITE_FIREBASE_APP_ID=取得したappId`}
        </pre>
      </div>

      <div className="auth-info-note">
        <strong>注意:</strong> 設定後はアプリを再起動してください
        <pre className="code-inline">npm run dev</pre>
      </div>
    </div>
  )
}

export default GoogleAuthInfo