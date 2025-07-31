import React, { createContext, useState, useEffect, useContext } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext({})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// Supabase設定の有効性をチェック
// Safari互換性: import.meta.envの安全な参照
const hasValidSupabaseConfig = () => {
  try {
    // Viteのdefineでグローバル変数として定義された値を参照
    const url = (typeof VITE_SUPABASE_URL !== 'undefined' ? VITE_SUPABASE_URL : '') || '';
    const key = (typeof VITE_SUPABASE_ANON_KEY !== 'undefined' ? VITE_SUPABASE_ANON_KEY : '') || '';
    
    return url && key && url.startsWith('https://') && url.includes('supabase');
  } catch (e) {
    return false;
  }
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const isSupabaseConfigured = hasValidSupabaseConfig()

  useEffect(() => {
    if (!isSupabaseConfigured) {
      console.warn('Supabase未設定のため、認証機能は利用できません')
      setLoading(false)
      return
    }

    // 現在のセッションを確認
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session && session.user ? session.user : null)
      setLoading(false)
    }).catch(err => {
      console.error('Supabase接続エラー:', err)
      setLoading(false)
    })

    // 認証状態の変更を監視
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session && session.user ? session.user : null)
    })

    return () => subscription && subscription.unsubscribe()
  }, [])

  const signUp = async (email, password) => {
    if (!isSupabaseConfigured) {
      return { data: null, error: new Error('Supabaseが設定されていません。.envファイルを確認してください。') }
    }
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      })
      return { data, error }
    } catch (err) {
      return { data: null, error: err }
    }
  }

  const signIn = async (email, password) => {
    if (!isSupabaseConfigured) {
      return { data: null, error: new Error('Supabaseが設定されていません。.envファイルを確認してください。') }
    }
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      return { data, error }
    } catch (err) {
      return { data: null, error: err }
    }
  }

  const signOut = async () => {
    if (!isSupabaseConfigured) {
      return { error: null }
    }
    try {
      const { error } = await supabase.auth.signOut()
      return { error }
    } catch (err) {
      return { error: err }
    }
  }

  const resetPassword = async (email) => {
    if (!isSupabaseConfigured) {
      return { data: null, error: new Error('Supabaseが設定されていません。.envファイルを確認してください。') }
    }
    try {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })
      return { data, error }
    } catch (err) {
      return { data: null, error: err }
    }
  }

  const updatePassword = async (newPassword) => {
    if (!isSupabaseConfigured) {
      return { data: null, error: new Error('Supabaseが設定されていません。.envファイルを確認してください。') }
    }
    try {
      const { data, error } = await supabase.auth.updateUser({
        password: newPassword
      })
      return { data, error }
    } catch (err) {
      return { data: null, error: err }
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