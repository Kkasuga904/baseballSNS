import React, { useState } from 'react'
import { useAuth } from '../App'
import { useNavigate, Link } from 'react-router-dom'
import './Login.css'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { signIn } = useAuth()
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

  const handleGoogleLogin = () => {
    // Googleログイン風の動作（実際には簡易ログイン）
    setEmail('demo@baseball-sns.com')
    setPassword('demo123')
    setTimeout(() => {
      handleSubmit({ preventDefault: () => {} })
    }, 500)
  }

  const useDemoAccount = (demoEmail, demoPassword) => {
    setEmail(demoEmail)
    setPassword(demoPassword)
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
        
        <div className="demo-login">
          <div className="demo-login-title">🎯 デモアカウントで試す</div>
          <div className="demo-account">
            <div className="demo-account-info">
              <span className="demo-email">demo@baseball-sns.com</span>
              <span className="demo-password">パスワード: demo123</span>
            </div>
            <button 
              type="button" 
              className="use-demo-btn"
              onClick={() => useDemoAccount('demo@baseball-sns.com', 'demo123')}
            >
              使用
            </button>
          </div>
        </div>
        
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
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
            />
          </div>
          
          <button type="submit" disabled={loading} className="auth-button">
            {loading ? 'ログイン中...' : 'ログイン'}
          </button>
        </form>
        
        <div className="auth-links">
          <Link to="/signup">新規登録はこちら</Link>
        </div>
      </div>
    </div>
  )
}

export default Login