import React, { useState } from 'react'
import { useAuth } from '../App'
import { useNavigate, Link } from 'react-router-dom'
import GoogleAuthButton from './GoogleAuthButton'
import './Login.css'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
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
        
        <GoogleAuthButton mode="login" />
        
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