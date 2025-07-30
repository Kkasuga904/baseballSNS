import { createClient } from '@supabase/supabase-js'

// 環境変数から読み込むか、直接設定
// 実際の値はSupabaseプロジェクトから取得してください
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'YOUR_SUPABASE_URL'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)