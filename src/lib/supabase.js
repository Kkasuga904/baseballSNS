import { createClient } from '@supabase/supabase-js'

// 環境変数から読み込むか、直接設定
// 実際の値はSupabaseプロジェクトから取得してください
// Safari互換性: import.meta.envの安全な参照
const getEnvVar = (key, defaultValue) => {
  try {
    return (typeof import !== 'undefined' && import.meta && import.meta.env && import.meta.env[key]) || defaultValue;
  } catch {
    return defaultValue;
  }
};

const supabaseUrl = getEnvVar('VITE_SUPABASE_URL', 'https://xyzcompanyprojectid.supabase.co');
const supabaseAnonKey = getEnvVar('VITE_SUPABASE_ANON_KEY', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsYWNlaG9sZGVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE2MDAwMDAwMDAsImV4cCI6MTcwMDAwMDAwMH0.placeholder');

// Supabase設定がない場合の警告
if (!getEnvVar('VITE_SUPABASE_URL') || !getEnvVar('VITE_SUPABASE_ANON_KEY')) {
  console.warn('⚠️ Supabase設定が見つかりません。.envファイルを作成して、VITE_SUPABASE_URLとVITE_SUPABASE_ANON_KEYを設定してください。')
}

let supabase = null

try {
  supabase = createClient(supabaseUrl, supabaseAnonKey)
} catch (error) {
  console.error('Supabase初期化エラー:', error)
  // ダミーのsupabaseオブジェクトを作成（エラーを防ぐため）
  supabase = {
    auth: {
      getSession: async () => ({ data: { session: null }, error: null }),
      signUp: async () => ({ data: null, error: new Error('Supabase未設定') }),
      signInWithPassword: async () => ({ data: null, error: new Error('Supabase未設定') }),
      signOut: async () => ({ error: null }),
      resetPasswordForEmail: async () => ({ data: null, error: new Error('Supabase未設定') }),
      updateUser: async () => ({ data: null, error: new Error('Supabase未設定') }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } })
    }
  }
}

export { supabase }