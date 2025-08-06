import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../App'

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>読み込み中...</p>
      </div>
    )
  }

  // デバイス認証の場合は常にユーザーが存在するため、childrenを返す
  // メール認証システム（保留）の場合はログイン画面へリダイレクト
  return user ? children : children // デバイス認証では常に通過
  
  // メール認証システムを使用する場合は以下のコードを有効化
  // return user ? children : <Navigate to="/login" />
}

export default ProtectedRoute