import React, { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate, Link } from 'react-router-dom'
import './Login.css'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { signIn } = useAuth()
  const navigate = useNavigate()
  
  // Supabase設定チェック
  const hasSupabaseConfig = import.meta.env.VITE_SUPABASE_URL && 
    import.meta.env.VITE_SUPABASE_URL !== 'https://placeholder.supabase.co'

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

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>⚾ ログイン</h2>
        
        {!hasSupabaseConfig && (
          <div className="error-message">
            ⚠️ 認証機能を使用するにはSupabaseの設定が必要です。
            <br />
            <br />
            <strong>セットアップ手順：</strong>
            <ol style={{ textAlign: 'left', margin: '10px 0' }}>
              <li>baseball-sns-appフォルダに.envファイルを作成</li>
              <li>以下の内容を記入：
                <pre style={{ background: '#f5f5f5', padding: '10px', borderRadius: '4px', fontSize: '12px' }}>
{`VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_key`}
                </pre>
              </li>
              <li>npm run devでサーバーを再起動</li>
            </ol>
            <Link to="/" style={{ color: '#2e7d46' }}>タイムラインに戻る</Link>
          </div>
        )}
        
        {hasSupabaseConfig && error && <div className="error-message">{error}</div>}
        
        {hasSupabaseConfig && (
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
        )}
        
        {hasSupabaseConfig && (
          <div className="auth-links">
            <Link to="/forgot-password">パスワードを忘れた方</Link>
            <Link to="/signup">新規登録はこちら</Link>
          </div>
        )}
      </div>
    </div>
  )
}

export default Login