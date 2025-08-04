import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

function AuthCallback() {
  const navigate = useNavigate()

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // URLからコードを取得してセッションを確立
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('認証エラー:', error)
          navigate('/login')
          return
        }

        if (session) {
          // ユーザーのプロフィールをチェック
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single()

          // プロフィールが存在しない場合は設定画面へ
          if (!profile || !profile.username) {
            navigate('/profile-setup')
          } else {
            navigate('/')
          }
        } else {
          navigate('/login')
        }
      } catch (error) {
        console.error('コールバックエラー:', error)
        navigate('/login')
      }
    }

    handleAuthCallback()
  }, [navigate])

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>認証中...</h2>
        <p>しばらくお待ちください</p>
      </div>
    </div>
  )
}

export default AuthCallback