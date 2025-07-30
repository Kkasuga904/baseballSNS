import React, { useState } from 'react'
import { useAuth } from '../App'
import { Link } from 'react-router-dom'
import './Login.css'

function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const { resetPassword } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess(false)
    setLoading(true)

    const { error } = await resetPassword(email)
    
    if (error) {
      setError('パスワードリセットに失敗しました: ' + error.message)
      setLoading(false)
    } else {
      setSuccess(true)
      setLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>🔑 パスワードリセット</h2>
        
        {error && <div className="error-message">{error}</div>}
        {success && (
          <div className="success-message">
            パスワードリセットメールを送信しました。
            <br />
            メールをご確認ください。
          </div>
        )}
        
        {!success && (
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
              <small className="form-hint">
                登録時のメールアドレスを入力してください
              </small>
            </div>
            
            <button type="submit" disabled={loading} className="auth-button">
              {loading ? '送信中...' : 'リセットメールを送信'}
            </button>
          </form>
        )}
        
        <div className="auth-links">
          <Link to="/login">ログインに戻る</Link>
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword