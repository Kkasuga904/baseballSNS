import React, { useState } from 'react'
import { useAuth } from '../App'
import { useNavigate, Link } from 'react-router-dom'
import GoogleAuthNotice from './GoogleAuthNotice'
import './Login.css'

function Signup() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [showGoogleNotice, setShowGoogleNotice] = useState(false)
  const { signUp, signInWithGoogle } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess(false)

    if (password !== confirmPassword) {
      setError('パスワードが一致しません')
      return
    }

    if (password.length < 6) {
      setError('パスワードは6文字以上で入力してください')
      return
    }

    setLoading(true)

    const { error } = await signUp(email, password)
    
    if (error) {
      setError('登録に失敗しました: ' + error.message)
      setLoading(false)
    } else {
      setSuccess(true)
      setLoading(false)
      // プロフィール設定画面へ遷移
      setTimeout(() => {
        navigate('/profile-setup')
      }, 1500)
    }
  }

  const handleGoogleSignup = async () => {
    // Firebase設定がない場合は通知を表示
    if (!signInWithGoogle || !import.meta.env.VITE_FIREBASE_API_KEY) {
      setShowGoogleNotice(true)
      return
    }
    
    setLoading(true)
    setError('')
    
    const { data, error, needsProfileSetup } = await signInWithGoogle()
    
    if (error) {
      setError('Googleアカウントでの登録に失敗しました')
      setLoading(false)
    } else {
      setSuccess(true)
      setLoading(false)
      setTimeout(() => {
        navigate(needsProfileSetup ? '/profile-setup' : '/')
      }, 1500)
    }
  }

  const handleDemoGoogleSignup = async () => {
    setShowGoogleNotice(false)
    setLoading(true)
    setError('')
    
    // デモ用のGoogle風認証
    const googleEmail = `user${Date.now()}@gmail.com`
    const googlePassword = 'google123'
    
    setEmail(googleEmail)
    setPassword(googlePassword)
    setConfirmPassword(googlePassword)
    
    const { error } = await signUp(googleEmail, googlePassword)
    
    if (error) {
      setError('デモ登録に失敗しました')
      setLoading(false)
    } else {
      setSuccess(true)
      setLoading(false)
      setTimeout(() => {
        navigate('/profile-setup')
      }, 1500)
    }
  }

  const handleAppleSignup = async () => {
    // Appleアカウント風の登録（実際には自動生成されたメールで登録）
    const appleEmail = `user${Date.now()}@icloud.com`
    const applePassword = 'apple123'
    
    setEmail(appleEmail)
    setPassword(applePassword)
    setConfirmPassword(applePassword)
    setLoading(true)
    
    const { error } = await signUp(appleEmail, applePassword)
    
    if (error) {
      setError('Appleアカウントでの登録に失敗しました')
      setLoading(false)
    } else {
      setSuccess(true)
      setLoading(false)
      setTimeout(() => {
        navigate('/profile-setup')
      }, 1500)
    }
  }

  return (
    <div className="auth-container">
      {showGoogleNotice && (
        <GoogleAuthNotice
          onClose={handleDemoGoogleSignup}
          onProceed={async () => {
            setShowGoogleNotice(false)
            // Firebase設定がある場合のみ実際のGoogle認証を実行
            if (signInWithGoogle && import.meta.env.VITE_FIREBASE_API_KEY) {
              setLoading(true)
              setError('')
              
              const { data, error, needsProfileSetup } = await signInWithGoogle()
              
              if (error) {
                setError('Googleアカウントでの登録に失敗しました')
                setLoading(false)
              } else {
                setSuccess(true)
                setLoading(false)
                setTimeout(() => {
                  navigate(needsProfileSetup ? '/profile-setup' : '/')
                }, 1500)
              }
            } else {
              // Firebase設定がない場合はデモ認証
              handleDemoGoogleSignup()
            }
          }}
        />
      )}
      
      <div className="auth-card">
        <h2>⚾ 新規登録</h2>
        
        {error && <div className="error-message">{error}</div>}
        {success && (
          <div className="success-message">
            登録完了！
            <br />
            プロフィール設定へ移動します...
          </div>
        )}
        
        <button type="button" onClick={handleGoogleSignup} className="google-login" disabled={loading}>
          <svg className="google-icon" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Googleで新規登録
        </button>
        
        
        <div className="divider">または</div>
        
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">メールアドレス</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="example@email.com"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">パスワード</label>
            <div className="password-input-wrapper">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder=""
                minLength={6}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "パスワードを隠す" : "パスワードを表示"}
              >
                {showPassword ? (
                  // パスワード表示中: 通常の目のアイコン
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                ) : (
                  // パスワード非表示: 目に斜線のアイコン
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                    <line x1="1" y1="1" x2="23" y2="23"/>
                  </svg>
                )}
              </button>
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="confirmPassword">パスワード（確認）</label>
            <div className="password-input-wrapper">
              <input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder=""
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                aria-label={showConfirmPassword ? "パスワードを隠す" : "パスワードを表示"}
              >
                {showConfirmPassword ? (
                  // パスワード表示中: 通常の目のアイコン
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                ) : (
                  // パスワード非表示: 目に斜線のアイコン
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                    <line x1="1" y1="1" x2="23" y2="23"/>
                  </svg>
                )}
              </button>
            </div>
          </div>
          
          <button type="submit" disabled={loading || success} className="auth-button">
            {loading ? '登録中...' : '新規登録'}
          </button>
        </form>
        
        <div className="auth-links">
          <Link to="/login">既にアカウントをお持ちの方</Link>
        </div>
      </div>
    </div>
  )
}

export default Signup