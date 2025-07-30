import React, { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate, Link } from 'react-router-dom'
import './Login.css'

function Signup() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const { signUp } = useAuth()
  const navigate = useNavigate()
  
  // Supabase設定チェック
  const hasSupabaseConfig = import.meta.env.VITE_SUPABASE_URL && 
    import.meta.env.VITE_SUPABASE_URL !== 'https://placeholder.supabase.co'

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
      setTimeout(() => {
        navigate('/login')
      }, 3000)
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>⚾ 新規登録</h2>
        
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
        {hasSupabaseConfig && success && (
          <div className="success-message">
            登録完了！確認メールを送信しました。
            <br />
            メールを確認してアカウントを有効化してください。
          </div>
        )}
        
        {hasSupabaseConfig && (
          <>
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
                  placeholder="6文字以上"
                  minLength={6}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="confirmPassword">パスワード（確認）</label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  placeholder="パスワードを再入力"
                />
              </div>
              
              <button type="submit" disabled={loading || success} className="auth-button">
                {loading ? '登録中...' : '新規登録'}
              </button>
            </form>
            
            <div className="auth-links">
              <Link to="/login">既にアカウントをお持ちの方</Link>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default Signup