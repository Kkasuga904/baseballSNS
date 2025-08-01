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

  // Google認証でログイン
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
      
      const appUser = {
        id: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: firebaseUser.displayName,
        photoURL: firebaseUser.photoURL,
        isAdmin: firebaseUser.email === 'over9131120@gmail.com'
      }
      
      // プロフィールが未設定の場合はセットアップ画面へ
      const profileKey = `baseballSNSProfile_${firebaseUser.email}`
      const savedProfile = localStorage.getItem(profileKey)
      
      return { 
        data: appUser, 
        error: null,
        needsProfileSetup: !savedProfile
      }
    } catch (error) {
      console.error('Google認証エラー:', error)
      return { 
        data: null, 
        error: new Error('Google認証に失敗しました')
      }
    }
  }

  // メールアドレスとパスワードで新規登録
  const signUp = async (email, password) => {
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
      }
      
      return { data: null, error: new Error(errorMessage) }
    }
  }

  // メールアドレスとパスワードでログイン
  const signIn = async (email, password) => {
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
      
      let errorMessage = 'ログインに失敗しました'
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        errorMessage = 'メールアドレスまたはパスワードが正しくありません'
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'メールアドレスの形式が正しくありません'
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