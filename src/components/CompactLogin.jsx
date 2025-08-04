import React, { useState } from 'react'
import { useAuth } from '../App'
import { useNavigate, Link } from 'react-router-dom'
import './CompactLogin.css'

function CompactLogin() {
  const [isSignup, setIsSignup] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const { signIn, signUp, signInWithGoogle } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    
    if (isSignup) {
      if (password !== confirmPassword) {
        setError('パスワードが一致しません')
        return
      }
      if (password.length < 6) {
        setError('パスワードは6文字以上で入力してください')
        return
      }
    }
    
    setLoading(true)
    
    const { error } = isSignup 
      ? await signUp(email, password)
      : await signIn(email, password)
    
    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      navigate(isSignup ? '/profile-setup' : '/')
    }
  }

  const handleGoogleAuth = async () => {
    setLoading(true)
    setError('')
    
    if (signInWithGoogle) {
      const { data, error, needsProfileSetup } = await signInWithGoogle()
      
      if (error) {
        setError('Google認証に失敗しました')
        setLoading(false)
      } else {
        setLoading(false)
        navigate(needsProfileSetup ? '/profile-setup' : '/')
      }
    } else {
      setError('Google認証が設定されていません')
      setLoading(false)
    }
  }

  return (
    <div className="compact-auth-container">
      <div className="compact-auth-card">
        <div className="auth-header">
          <h1 className="app-title">⚾ BaseLog</h1>
          <p className="app-subtitle">野球の記録と交流をひとつに</p>
        </div>

        <div className="auth-tabs">
          <button
            className={`auth-tab ${!isSignup ? 'active' : ''}`}
            onClick={() => setIsSignup(false)}
          >
            ログイン
          </button>
          <button
            className={`auth-tab ${isSignup ? 'active' : ''}`}
            onClick={() => setIsSignup(true)}
          >
            新規登録
          </button>
        </div>

        {error && <div className="compact-error">{error}</div>}

        <form onSubmit={handleSubmit} className="compact-form">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="メールアドレス"
            required
            className="compact-input"
          />
          
          <div className="password-field">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="パスワード"
              required
              minLength={6}
              className="compact-input"
            />
            <button
              type="button"
              className="compact-password-toggle"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? '🙈' : '👁️'}
            </button>
          </div>
          
          {isSignup && (
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="パスワード（確認）"
              required
              className="compact-input"
            />
          )}
          
          <button
            type="submit"
            disabled={loading}
            className="compact-submit"
          >
            {loading ? '処理中...' : (isSignup ? '登録する' : 'ログイン')}
          </button>
        </form>

        <div className="auth-divider">
          <span>または</span>
        </div>

        <button
          onClick={handleGoogleAuth}
          disabled={loading}
          className="google-auth-btn"
        >
          <svg className="google-icon" viewBox="0 0 24 24" width="18" height="18">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Googleで{isSignup ? '新規登録' : 'ログイン'}
        </button>

        {!isSignup && (
          <div className="demo-section">
            <button
              type="button"
              onClick={() => {
                setEmail('demo@baseball-sns.com')
                setPassword('demo123')
              }}
              className="demo-button"
            >
              デモアカウントで試す
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default CompactLogin