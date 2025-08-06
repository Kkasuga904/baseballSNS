import React, { createContext, useState, useEffect, useContext } from 'react'
import { 
  signInWithPopup, 
  signOut as firebaseSignOut,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  updatePassword as firebaseUpdatePassword
} from 'firebase/auth'
import { auth, googleProvider, isFirebaseConfigured } from '../firebase/config'

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
    // Firebase設定がない場合は何もしない
    if (!isFirebaseConfigured || !auth) {
      setLoading(false)
      return
    }
    
    // Firebase認証状態の監視
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        // Firebaseユーザーをアプリのユーザー形式に変換
        const appUser = {
          id: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL,
          isAdmin: firebaseUser.email === 'over9131120@gmail.com'
        }
        setUser(appUser)
        
        // LocalStorageにも保存（互換性のため）
        localStorage.setItem('baseballSNSUser', JSON.stringify(appUser))
      } else {
        setUser(null)
        localStorage.removeItem('baseballSNSUser')
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  // Google認証でログイン（新規・既存を自動判別）
  const signInWithGoogle = async () => {
    if (!isFirebaseConfigured || !auth || !googleProvider) {
      return { 
        data: null, 
        error: new Error('Firebase設定が必要です')
      }
    }
    
    try {
      const result = await signInWithPopup(auth, googleProvider)
      const firebaseUser = result.user
      
      // ユーザー情報を取得
      const appUser = {
        id: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: firebaseUser.displayName || firebaseUser.email?.split('@')[0],
        photoURL: firebaseUser.photoURL,
        isAdmin: firebaseUser.email === 'over9131120@gmail.com',
        provider: 'google',
        createdAt: firebaseUser.metadata.creationTime,
        lastLoginAt: firebaseUser.metadata.lastSignInTime
      }
      
      // 初回ログインかどうかを判定
      const isNewUser = firebaseUser.metadata.creationTime === firebaseUser.metadata.lastSignInTime
      
      // ユーザーデータをローカルストレージに保存
      const userKey = `baseballSNSUser_${firebaseUser.uid}`
      const existingUserData = localStorage.getItem(userKey)
      
      if (!existingUserData || isNewUser) {
        // 新規ユーザーの場合、初期データを作成
        const userData = {
          ...appUser,
          isNewUser: true,
          registeredAt: new Date().toISOString()
        }
        localStorage.setItem(userKey, JSON.stringify(userData))
        console.log('新規ユーザーとして登録しました')
      } else {
        // 既存ユーザーの場合、最終ログイン時刻を更新
        const userData = JSON.parse(existingUserData)
        userData.lastLoginAt = new Date().toISOString()
        localStorage.setItem(userKey, JSON.stringify(userData))
        console.log('既存ユーザーとしてログインしました')
      }
      
      // プロフィールが未設定の場合はセットアップ画面へ
      const profileKey = `baseballSNSProfile_${firebaseUser.email}`
      const savedProfile = localStorage.getItem(profileKey)
      
      return { 
        data: appUser, 
        error: null,
        isNewUser: isNewUser || !existingUserData,
        needsProfileSetup: !savedProfile
      }
    } catch (error) {
      console.error('Google認証エラー:', error)
      
      // エラーの詳細に応じたメッセージ
      let errorMessage = 'Google認証に失敗しました'
      if (error.code === 'auth/popup-closed-by-user') {
        errorMessage = '認証がキャンセルされました'
      } else if (error.code === 'auth/network-request-failed') {
        errorMessage = 'ネットワークエラーが発生しました'
      }
      
      return { 
        data: null, 
        error: new Error(errorMessage)
      }
    }
  }

  // メールアドレスとパスワードで新規登録
  const signUp = async (email, password) => {
    // Firebase認証が利用できない場合のフォールバック
    if (!isFirebaseConfigured || !auth) {
      // ローカルストレージを使った簡易登録
      const storedUsers = JSON.parse(localStorage.getItem('baseballSNSUsers') || '[]')
      const existingUser = storedUsers.find(u => u.email === email)
      
      if (existingUser) {
        return { data: null, error: new Error('このメールアドレスは既に登録されています') }
      }
      
      const newUser = {
        id: `local_${Date.now()}`,
        email,
        password,
        displayName: email.split('@')[0],
        isAdmin: email === 'over9131120@gmail.com',
        createdAt: new Date().toISOString()
      }
      
      storedUsers.push(newUser)
      localStorage.setItem('baseballSNSUsers', JSON.stringify(storedUsers))
      
      const appUser = {
        id: newUser.id,
        email: newUser.email,
        displayName: newUser.displayName,
        isAdmin: newUser.isAdmin
      }
      
      setUser(appUser)
      localStorage.setItem('baseballSNSUser', JSON.stringify(appUser))
      return { data: appUser, error: null }
    }
    
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      const firebaseUser = userCredential.user
      
      const appUser = {
        id: firebaseUser.uid,
        email: firebaseUser.email,
        isAdmin: firebaseUser.email === 'over9131120@gmail.com'
      }
      
      return { data: appUser, error: null }
    } catch (error) {
      console.error('新規登録エラー:', error)
      
      // Firebaseのエラーコードに応じて日本語メッセージを返す
      let errorMessage = '登録に失敗しました'
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'このメールアドレスは既に登録されています'
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'パスワードは6文字以上で入力してください'
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'メールアドレスの形式が正しくありません'
      } else if (error.code === 'auth/invalid-credential') {
        errorMessage = 'Firebase認証の設定を確認してください'
      }
      
      return { data: null, error: new Error(errorMessage) }
    }
  }

  // メールアドレスとパスワードでログイン
  const signIn = async (email, password) => {
    // Firebase認証が利用できない場合のフォールバック
    if (!isFirebaseConfigured || !auth) {
      // ローカルストレージを使った簡易認証
      const storedUsers = JSON.parse(localStorage.getItem('baseballSNSUsers') || '[]')
      const user = storedUsers.find(u => u.email === email && u.password === password)
      
      if (user) {
        const appUser = {
          id: user.id || `local_${Date.now()}`,
          email: user.email,
          displayName: user.displayName || email.split('@')[0],
          isAdmin: email === 'over9131120@gmail.com'
        }
        setUser(appUser)
        localStorage.setItem('baseballSNSUser', JSON.stringify(appUser))
        return { data: appUser, error: null }
      } else if (email === 'over9131120@gmail.com' && password === 'admin123') {
        // 管理者アカウントのフォールバック
        const adminUser = {
          id: 'admin_local',
          email: 'over9131120@gmail.com',
          displayName: '管理者',
          isAdmin: true
        }
        setUser(adminUser)
        localStorage.setItem('baseballSNSUser', JSON.stringify(adminUser))
        return { data: adminUser, error: null }
      } else {
        return { data: null, error: new Error('メールアドレスまたはパスワードが正しくありません') }
      }
    }
    
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      const firebaseUser = userCredential.user
      
      const appUser = {
        id: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: firebaseUser.displayName,
        photoURL: firebaseUser.photoURL,
        isAdmin: firebaseUser.email === 'over9131120@gmail.com'
      }
      
      return { data: appUser, error: null }
    } catch (error) {
      console.error('ログインエラー:', error)
      
      // Firebase認証が失敗した場合、管理者アカウントのフォールバック
      if (email === 'over9131120@gmail.com' && password === 'admin123') {
        const adminUser = {
          id: 'admin_local',
          email: 'over9131120@gmail.com',
          displayName: '管理者',
          isAdmin: true
        }
        setUser(adminUser)
        localStorage.setItem('baseballSNSUser', JSON.stringify(adminUser))
        return { data: adminUser, error: null }
      }
      
      let errorMessage = 'ログインに失敗しました'
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        errorMessage = 'メールアドレスまたはパスワードが正しくありません'
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'メールアドレスの形式が正しくありません'
      } else if (error.code === 'auth/invalid-credential') {
        errorMessage = 'Firebase認証の設定を確認してください'
      }
      
      return { data: null, error: new Error(errorMessage) }
    }
  }

  // ログアウト
  const signOut = async () => {
    try {
      await firebaseSignOut(auth)
      sessionStorage.clear()
      return { error: null }
    } catch (error) {
      console.error('ログアウトエラー:', error)
      return { error: new Error('ログアウトに失敗しました') }
    }
  }

  // パスワードリセット
  const resetPassword = async (email) => {
    try {
      await sendPasswordResetEmail(auth, email)
      return { data: null, error: null }
    } catch (error) {
      console.error('パスワードリセットエラー:', error)
      
      let errorMessage = 'パスワードリセットに失敗しました'
      if (error.code === 'auth/user-not-found') {
        errorMessage = 'このメールアドレスは登録されていません'
      }
      
      return { data: null, error: new Error(errorMessage) }
    }
  }

  // パスワード更新
  const updatePassword = async (newPassword) => {
    if (!auth.currentUser) {
      return { data: null, error: new Error('ログインしていません') }
    }
    
    try {
      await firebaseUpdatePassword(auth.currentUser, newPassword)
      return { data: user, error: null }
    } catch (error) {
      console.error('パスワード更新エラー:', error)
      return { data: null, error: new Error('パスワード更新に失敗しました') }
    }
  }

  // プロフィール更新（LocalStorageのみ）
  const updateProfile = async (updates) => {
    if (!user) {
      return { data: null, error: new Error('ログインしていません') }
    }
    
    const updatedUser = { ...user, ...updates }
    setUser(updatedUser)
    localStorage.setItem('baseballSNSUser', JSON.stringify(updatedUser))
    
    return { data: updatedUser, error: null }
  }

  const value = {
    user,
    loading,
    signUp,
    signIn,
    signOut,
    signInWithGoogle,
    updateProfile,
    resetPassword,
    updatePassword
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}