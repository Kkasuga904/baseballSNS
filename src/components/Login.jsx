import React, { useState } from 'react'
import { useAuth } from '../App'
import { useNavigate, Link } from 'react-router-dom'
import './Login.css'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const { signIn, signInWithGoogle } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const { error } = await signIn(email, password)
    
    if (error) {
      setError('ログインに失敗しました: ' + error.message)
      setLoading(false)
    } else {
      navigate('/')
    }
  }

  const handleGoogleLogin = async () => {
    setLoading(true)
    setError('')
    
    // signInWithGoogleがある場合（Firebase認証）は実際のGoogle認証を使用
    if (signInWithGoogle) {
      const { data, error, needsProfileSetup } = await signInWithGoogle()
      
      if (error) {
        setError('Googleアカウントでのログインに失敗しました')
        setLoading(false)
      } else {
        setLoading(false)
        if (needsProfileSetup) {
          navigate('/profile-setup')
        } else {
          navigate('/')
        }
      }
    } else {
      // Firebase設定がない場合はエラー表示
      setError('Google認証が設定されていません')
      setLoading(false)
    }
  }

  const handleAppleLogin = () => {
    // Appleログインは未実装
    setError('Apple認証は現在利用できません')
  }

  const handleDemoLogin = async () => {
    setLoading(true)
    setError('')
    
    // デモユーザーの認証情報
    const demoEmail = 'demo@baselog.jp'
    const demoPassword = 'demo123456'
    
    const { error } = await signIn(demoEmail, demoPassword)
    
    if (error) {
      // デモユーザーが存在しない場合は作成を促す
      setError('デモユーザーが見つかりません。管理者に連絡してください。')
      setLoading(false)
    } else {
      navigate('/')
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>⚾ ログイン</h2>
        
        {error && <div className="error-message">{error}</div>}
        
        <button type="button" onClick={handleGoogleLogin} className="google-login">
          <svg className="google-icon" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Googleでログイン
        </button>
        
        
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
          
          <button type="submit" disabled={loading} className="auth-button">
            {loading ? 'ログイン中...' : 'ログイン'}
          </button>
        </form>
        
        <div className="auth-links">
          <Link to="/signup">新規登録はこちら</Link>
        </div>
        
        <div style={{ marginTop: '20px' }}>
          <button 
            type="button" 
            onClick={handleDemoLogin} 
            className="demo-login-button"
            disabled={loading}
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.6 : 1
            }}
          >
            {loading ? 'ログイン中...' : 'デモユーザーでログイン'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default Login