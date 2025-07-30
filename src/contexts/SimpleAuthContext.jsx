import React, { createContext, useState, useEffect, useContext } from 'react'

const AuthContext = createContext({})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // LocalStorageから保存されたユーザー情報を読み込み
    const savedUser = localStorage.getItem('baseballSNSUser')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    
    // デモアカウントの初期化
    const users = JSON.parse(localStorage.getItem('baseballSNSUsers') || '[]')
    if (!users.find(u => u.email === 'demo@baseball-sns.com')) {
      users.push({
        id: 'demo_user',
        email: 'demo@baseball-sns.com',
        password: 'demo123',
        createdAt: new Date().toISOString()
      })
      localStorage.setItem('baseballSNSUsers', JSON.stringify(users))
    }
    
    setLoading(false)
  }, [])

  const signUp = async (email, password) => {
    // LocalStorageでユーザー管理（実際の本番環境では使用しないでください）
    const users = JSON.parse(localStorage.getItem('baseballSNSUsers') || '[]')
    
    // すでに存在するメールアドレスかチェック
    if (users.find(u => u.email === email)) {
      return { 
        data: null, 
        error: new Error('このメールアドレスは既に登録されています') 
      }
    }

    // 新規ユーザー作成
    const newUser = {
      id: `user_${Date.now()}`,
      email,
      createdAt: new Date().toISOString()
    }

    // ユーザーリストに追加
    users.push({ ...newUser, password }) // 実際にはパスワードはハッシュ化すべき
    localStorage.setItem('baseballSNSUsers', JSON.stringify(users))

    // 現在のユーザーとして設定
    setUser(newUser)
    localStorage.setItem('baseballSNSUser', JSON.stringify(newUser))

    return { data: { user: newUser }, error: null }
  }

  const signIn = async (email, password) => {
    const users = JSON.parse(localStorage.getItem('baseballSNSUsers') || '[]')
    const user = users.find(u => u.email === email && u.password === password)

    if (!user) {
      return { 
        data: null, 
        error: new Error('メールアドレスまたはパスワードが正しくありません') 
      }
    }

    const { password: _, ...userWithoutPassword } = user
    setUser(userWithoutPassword)
    localStorage.setItem('baseballSNSUser', JSON.stringify(userWithoutPassword))

    return { data: { user: userWithoutPassword }, error: null }
  }

  const signOut = async () => {
    setUser(null)
    localStorage.removeItem('baseballSNSUser')
    return { error: null }
  }

  const resetPassword = async (email) => {
    // 簡易版なのでパスワードリセットは実装しない
    return { 
      data: null, 
      error: new Error('パスワードリセット機能は簡易版では利用できません') 
    }
  }

  const updatePassword = async (newPassword) => {
    if (!user) {
      return { 
        data: null, 
        error: new Error('ログインしていません') 
      }
    }

    const users = JSON.parse(localStorage.getItem('baseballSNSUsers') || '[]')
    const userIndex = users.findIndex(u => u.id === user.id)
    
    if (userIndex !== -1) {
      users[userIndex].password = newPassword
      localStorage.setItem('baseballSNSUsers', JSON.stringify(users))
      return { data: {}, error: null }
    }

    return { 
      data: null, 
      error: new Error('ユーザーが見つかりません') 
    }
  }

  const value = {
    user,
    loading,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updatePassword,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}