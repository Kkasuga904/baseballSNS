import React, { useState } from 'react'
import { useAuth } from '../App'
import { useNavigate, Link } from 'react-router-dom'
import GoogleAuthButton from './GoogleAuthButton'
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
  const { signUp } = useAuth()
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
        
        <GoogleAuthButton mode="signup" />
        
        
        <div className="divider">または</div>
        
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">メールアドレス</label>
            <input
              id="email"
              type="text"
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