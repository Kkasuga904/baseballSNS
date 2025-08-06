import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../App'
import './GoogleAuthButton.css'

function GoogleAuthButton({ mode = 'both' }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { signInWithGoogle } = useAuth()
  const navigate = useNavigate()

  const handleGoogleAuth = async () => {
    setLoading(true)
    setError('')
    
    try {
      // Firebase Google認証を実行
      const result = await signInWithGoogle()
      
      if (result.error) {
        setError(result.error.message)
        setLoading(false)
        return
      }
      
      if (result.data) {
        // 新規ユーザーの場合のメッセージ
        if (result.isNewUser) {
          console.log('ようこそ！新規登録が完了しました')
        } else {
          console.log('おかえりなさい！')
        }
        
        // プロフィール設定が必要な場合
        if (result.needsProfileSetup) {
          navigate('/profile/setup')
        } else {
          navigate('/mypage')
        }
      }
    } catch (error) {
      console.error('認証エラー:', error)
      setError('認証中にエラーが発生しました')
    } finally {
      setLoading(false)
    }
  }

  // ボタンのラベルを決定
  const getButtonLabel = () => {
    if (loading) return '認証中...'
    
    switch (mode) {
      case 'login':
        return 'Googleでログイン'
      case 'signup':
        return 'Googleで新規登録'
      case 'both':
      default:
        return 'Googleでログイン・新規登録'
    }
  }

  return (
    <div className="google-auth-wrapper">
      <button
        type="button"
        onClick={handleGoogleAuth}
        disabled={loading}
        className="google-auth-button"
      >
        <svg className="google-icon" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
        <span className="google-button-text">{getButtonLabel()}</span>
      </button>
      
      {error && (
        <div className="google-auth-error">
          {error}
        </div>
      )}
      
      <div className="google-auth-info">
        <p>✨ Googleアカウントで簡単スタート</p>
        <ul>
          <li>新規の方も既存の方も同じボタンでOK</li>
          <li>面倒な登録作業は不要</li>
          <li>セキュアな認証で安心</li>
        </ul>
      </div>
    </div>
  )
}

export default GoogleAuthButton