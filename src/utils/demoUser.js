// Supabaseインポート（設定がある場合のみ使用）
let supabase = null;
try {
  const supabaseModule = require('../lib/supabase');
  supabase = supabaseModule.supabase;
} catch (e) {
  // Supabaseが設定されていない場合は無視
}

// デモユーザーの情報
export const DEMO_USER = {
  email: 'demo@baselog.jp',
  password: 'demo123456',
  username: 'デモユーザー',
  displayName: 'デモ太郎',
  sport: 'baseball',
  positions: ['pitcher'],
  pitcherTypes: ['starter'],
  jerseyNumber: '18',
  bio: 'BaseLogのデモユーザーです。お試しでご利用ください。'
}

// デモユーザーが存在するかチェックし、なければ作成
export async function ensureDemoUserExists() {
  try {
    // Supabaseが設定されていない場合はスキップ
    if (!supabase) {
      return { success: false, error: 'Supabase not configured' }
    }
    
    const url = import.meta.env?.VITE_SUPABASE_URL || '';
    if (!url || url.includes('placeholder') || url.includes('your-')) {
      return { success: false, error: 'Supabase not configured' }
    }

    // まずログインを試みる
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: DEMO_USER.email,
      password: DEMO_USER.password
    })

    if (signInData?.user) {
      console.log('デモユーザーは既に存在します')
      // すぐにサインアウト
      await supabase.auth.signOut()
      return { success: true, exists: true }
    }

    // ユーザーが存在しない場合は作成
    console.log('デモユーザーを作成します...')
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: DEMO_USER.email,
      password: DEMO_USER.password,
      options: {
        data: {
          username: DEMO_USER.username,
          display_name: DEMO_USER.displayName
        }
      }
    })

    if (signUpError) {
      console.error('デモユーザー作成エラー:', signUpError)
      return { success: false, error: signUpError.message }
    }

    // プロフィールデータを作成
    if (signUpData?.user) {
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: signUpData.user.id,
          username: DEMO_USER.username,
          display_name: DEMO_USER.displayName,
          sport: DEMO_USER.sport,
          positions: DEMO_USER.positions,
          pitcher_types: DEMO_USER.pitcherTypes,
          jersey_number: DEMO_USER.jerseyNumber,
          bio: DEMO_USER.bio,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })

      if (profileError) {
        console.error('プロフィール作成エラー:', profileError)
      }

      // サインアウト
      await supabase.auth.signOut()
    }

    console.log('デモユーザーを作成しました')
    return { success: true, created: true }
  } catch (error) {
    console.error('デモユーザー処理エラー:', error)
    return { success: false, error: error.message }
  }
}