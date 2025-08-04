/**
 * SimpleAuthContext.jsx - シンプルな認証システム
 * 
 * LocalStorageを使用した簡易的な認証システムです。
 * 本番環境では使用せず、開発・デモ用として使用してください。
 * 
 * 機能:
 * - ユーザーの新規登録
 * - ログイン/ログアウト
 * - セッション管理（LocalStorage使用）
 * - デモアカウントと管理者アカウントの自動作成
 */

import React, { createContext, useState, useEffect, useContext } from 'react'

// 認証コンテキストの作成
// コンテキストを使用することで、アプリ全体で認証情報を共有できます
const AuthContext = createContext({})

/**
 * useAuth カスタムフック
 * コンポーネントから認証機能にアクセスするためのフック
 * 
 * @returns {Object} 認証関連の関数とユーザー情報
 * @throws {Error} AuthProvider外で使用された場合
 */
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

/**
 * AuthProvider コンポーネント
 * アプリ全体に認証機能を提供するプロバイダー
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - 子コンポーネント
 */
export const AuthProvider = ({ children }) => {
  // 現在ログイン中のユーザー情報
  const [user, setUser] = useState(null)
  
  // 初期化中かどうかのフラグ（ローディング表示用）
  const [loading, setLoading] = useState(true)

  /**
   * 初期化処理
   * コンポーネントマウント時に実行
   */
  useEffect(() => {
    // LocalStorageから保存されたユーザー情報を読み込み
    const savedUser = localStorage.getItem('baseballSNSUser')
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser)
      
      // 管理者権限チェック
      // 特定のメールアドレスの場合、管理者フラグを追加
      if (parsedUser.email === 'over9131120@gmail.com') {
        parsedUser.isAdmin = true
      }
      setUser(parsedUser)
    }
    
    // ユーザーデータベースの初期化
    // LocalStorageにユーザーリストを保存（簡易DB）
    const users = JSON.parse(localStorage.getItem('baseballSNSUsers') || '[]')
    
    // デモアカウントの自動作成
    // 初回起動時にデモ用アカウントを作成
    if (!users.find(u => u.email === 'demo@baseball-sns.com')) {
      users.push({
        id: 'demo_user',
        email: 'demo@baseball-sns.com',
        password: 'demo123', // 本番環境ではハッシュ化必須
        createdAt: new Date().toISOString()
      })
    }
    
    // 管理者アカウントの自動作成
    if (!users.find(u => u.email === 'over9131120@gmail.com')) {
      users.push({
        id: 'admin_user',
        email: 'over9131120@gmail.com',
        password: 'Sawamura18', // 本番環境ではハッシュ化必須
        isAdmin: true,
        createdAt: new Date().toISOString()
      })
    }
    
    // テストアカウントの自動作成
    if (!users.find(u => u.email === 'test')) {
      users.push({
        id: 'test_user',
        email: 'test',
        password: 'test',
        createdAt: new Date().toISOString()
      })
    }
    
    // ユーザーリストを保存
    localStorage.setItem('baseballSNSUsers', JSON.stringify(users))
    
    // 初期化完了
    setLoading(false)
  }, [])

  /**
   * ユーザー新規登録関数
   * 
   * @param {string} email - メールアドレス
   * @param {string} password - パスワード
   * @returns {Promise<{data: Object|null, error: Error|null}>} 
   *          成功時はdata、失敗時はerrorを返す
   */
  const signUp = async (email, password) => {
    // ユーザーリストを取得
    const users = JSON.parse(localStorage.getItem('baseballSNSUsers') || '[]')
    
    // メールアドレスの重複チェック
    if (users.find(u => u.email === email)) {
      return { 
        data: null, 
        error: new Error('このメールアドレスは既に登録されています') 
      }
    }

    // 新規ユーザーオブジェクトの作成
    const newUser = {
      id: `user_${Date.now()}`, // 一意のIDを生成
      email,
      createdAt: new Date().toISOString()
    }

    // ユーザーリストに追加
    // 注意: 実際の本番環境ではパスワードはハッシュ化して保存すべき
    users.push({ ...newUser, password })
    localStorage.setItem('baseballSNSUsers', JSON.stringify(users))

    // 新規登録したユーザーで自動ログイン
    setUser(newUser)
    localStorage.setItem('baseballSNSUser', JSON.stringify(newUser))

    return { data: newUser, error: null }
  }

  /**
   * ログイン関数
   * 
   * @param {string} email - メールアドレス
   * @param {string} password - パスワード
   * @returns {Promise<{data: Object|null, error: Error|null}>}
   */
  const signIn = async (email, password) => {
    // ユーザーリストから該当ユーザーを検索
    const users = JSON.parse(localStorage.getItem('baseballSNSUsers') || '[]')
    const foundUser = users.find(u => u.email === email && u.password === password)

    if (!foundUser) {
      return { 
        data: null, 
        error: new Error('メールアドレスまたはパスワードが正しくありません') 
      }
    }

    // ユーザー情報からパスワードを除外
    const { password: _, ...userWithoutPassword } = foundUser
    
    // 管理者権限の付与
    if (userWithoutPassword.email === 'over9131120@gmail.com') {
      userWithoutPassword.isAdmin = true
    }
    
    // ログイン成功
    setUser(userWithoutPassword)
    localStorage.setItem('baseballSNSUser', JSON.stringify(userWithoutPassword))

    return { data: userWithoutPassword, error: null }
  }

  /**
   * ログアウト関数
   * ユーザー情報をクリアしてログアウト状態にする
   */
  const signOut = async () => {
    setUser(null)
    localStorage.removeItem('baseballSNSUser')
    // セッションストレージもクリア（必要に応じて）
    sessionStorage.clear()
    return { error: null }
  }

  /**
   * プロフィール更新関数
   * 
   * @param {Object} updates - 更新するプロフィール情報
   * @returns {Promise<{data: Object|null, error: Error|null}>}
   */
  const updateProfile = async (updates) => {
    if (!user) {
      return { 
        data: null, 
        error: new Error('ログインしていません') 
      }
    }

    // ユーザーリストを更新
    const users = JSON.parse(localStorage.getItem('baseballSNSUsers') || '[]')
    const userIndex = users.findIndex(u => u.id === user.id)
    
    if (userIndex !== -1) {
      // プロフィール情報を更新
      users[userIndex] = { ...users[userIndex], ...updates }
      localStorage.setItem('baseballSNSUsers', JSON.stringify(users))
    }

    // 現在のユーザー情報も更新
    const updatedUser = { ...user, ...updates }
    setUser(updatedUser)
    localStorage.setItem('baseballSNSUser', JSON.stringify(updatedUser))

    return { data: updatedUser, error: null }
  }

  /**
   * パスワードリセット関数（簡易実装）
   * 実際の実装ではメール送信などが必要
   * 
   * @param {string} email - リセット対象のメールアドレス
   * @returns {Promise<{data: null, error: Error|null}>}
   */
  const resetPassword = async (email) => {
    const users = JSON.parse(localStorage.getItem('baseballSNSUsers') || '[]')
    const userExists = users.find(u => u.email === email)

    if (!userExists) {
      return { 
        data: null, 
        error: new Error('このメールアドレスは登録されていません') 
      }
    }

    // 実際の実装では、ここでメール送信処理を行う
    // デモ版では成功を返すのみ
    console.log(`パスワードリセットメールを送信しました: ${email}`)
    
    return { data: null, error: null }
  }

  /**
   * パスワード更新関数
   * 
   * @param {string} newPassword - 新しいパスワード
   * @returns {Promise<{data: Object|null, error: Error|null}>}
   */
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
    }

    return { data: user, error: null }
  }

  // コンテキストに提供する値
  const value = {
    user,           // 現在のユーザー情報
    loading,        // ローディング状態
    signUp,         // 新規登録関数
    signIn,         // ログイン関数
    signOut,        // ログアウト関数
    updateProfile,  // プロフィール更新関数
    resetPassword,  // パスワードリセット関数
    updatePassword  // パスワード更新関数
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}