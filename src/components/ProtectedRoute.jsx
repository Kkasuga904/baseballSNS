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

  return user ? children : <Navigate to="/login" />
}

export default ProtectedRoute