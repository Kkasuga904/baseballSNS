/**
 * App.jsx - メインアプリケーションコンポーネント
 * 
 * このファイルは野球SNSアプリ全体の構成と状態管理を担当します。
 * - ルーティング設定
 * - グローバルな状態管理（投稿、ユーザーデータ）
 * - 認証状態の管理
 * - テーマ（管理者用ダークテーマ）の適用
 */

import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom'
import LoadingSpinner from './components/LoadingSpinner'
// import InstallPrompt from './components/InstallPrompt' // モバイルホーム追加ポップアップ無効化

// 認証システムの選択
// デバイス認証をデフォルトで使用
import { AuthProvider as DeviceAuthProvider, useAuth as useDeviceAuth } from './contexts/DeviceAuthContext'

// メール認証システム（保留）
// 以下の認証システムは現在使用していませんが、将来的に復活させる可能性があります
// import { AuthProvider as SupabaseAuthProvider, useAuth as useSupabaseAuth } from './contexts/AuthContext'
// import { AuthProvider as SimpleAuthProvider, useAuth as useSimpleAuth } from './contexts/SimpleAuthContext'
// import { AuthProvider as FirebaseAuthProvider, useAuth as useFirebaseAuth } from './contexts/FirebaseAuthContext'

// デバイス認証をデフォルトで使用
export const AuthProvider = DeviceAuthProvider
export const useAuth = useDeviceAuth

// メール認証システムの設定チェック（保留）
/*
let hasSupabaseConfig = false;
let hasFirebaseConfig = false;

try {
  // Firebaseの設定チェック - プレースホルダー値を含む場合は無効とする
  const firebaseApiKey = import.meta.env?.VITE_FIREBASE_API_KEY || '';
  hasFirebaseConfig = firebaseApiKey && 
    firebaseApiKey !== 'AIzaSyDummy-YourActualAPIKey' &&
    firebaseApiKey !== 'your-actual-api-key-here' &&
    !firebaseApiKey.includes('your-') &&
    !firebaseApiKey.includes('placeholder');
  
  // Supabaseの設定チェック
  if (!hasFirebaseConfig) {
    const url = (typeof VITE_SUPABASE_URL !== 'undefined' ? VITE_SUPABASE_URL : '') || '';
    hasSupabaseConfig = url && 
      url !== 'https://xyzcompanyprojectid.supabase.co' &&
      !url.includes('placeholder') &&
      !url.includes('your-');
  }
  
  // デバッグ用ログ
  if (process.env.NODE_ENV === 'development') {
    console.log('Firebase Config Check:', { firebaseApiKey, hasFirebaseConfig });
    console.log('Auth Provider Selected:', hasFirebaseConfig ? 'Firebase' : (hasSupabaseConfig ? 'Supabase' : 'SimpleAuth'));
  }
} catch (e) {
  hasSupabaseConfig = false;
  hasFirebaseConfig = false;
  if (process.env.NODE_ENV === 'development') {
    console.log('Auth config error, falling back to SimpleAuth:', e);
  }
}

// 条件に応じて認証プロバイダーとフックをエクスポート
// export const AuthProvider = hasFirebaseConfig ? FirebaseAuthProvider : (hasSupabaseConfig ? SupabaseAuthProvider : SimpleAuthProvider)
// export const useAuth = hasFirebaseConfig ? useFirebaseAuth : (hasSupabaseConfig ? useSupabaseAuth : useSimpleAuth)
*/

// コンポーネントのインポート
import Navigation from './components/Navigation'
// import MobileNavigation from './components/MobileNavigation' // フッター削除
// import Timeline from './pages/Timeline' // タイムライン機能は一時的に無効化

// 動的インポートでコード分割
const MyPage = React.lazy(() => import('./pages/MyPage'))
const CalendarView = React.lazy(() => import('./pages/CalendarView'))
const Profile = React.lazy(() => import('./pages/Profile'))
const Settings = React.lazy(() => import('./pages/Settings'))
const Disclaimer = React.lazy(() => import('./pages/Disclaimer'))
const PrivacyPolicy = React.lazy(() => import('./pages/PrivacyPolicy'))
const TermsOfService = React.lazy(() => import('./pages/TermsOfService'))
const PracticeRecordPage = React.lazy(() => import('./pages/PracticeRecordPage'))
const Measurements = React.lazy(() => import('./pages/Measurements'))
const TeamsPage = React.lazy(() => import('./pages/TeamsPage'))
const InstallGuide = React.lazy(() => import('./pages/InstallGuide'))
// MVP版ではチーム機能は無効化
// import TeamDetail from './pages/TeamDetail'
// import Teams from './pages/Teams'

// メール認証関連コンポーネント（保留）
// 現在はデバイス認証を使用しているため、以下のコンポーネントは使用しません
// import Login from './components/Login'
// import Signup from './components/Signup'
// import AuthCallback from './pages/AuthCallback'
// import CompactLogin from './components/CompactLogin'
// import ProfileSetup from './components/ProfileSetup'
// import ForgotPassword from './components/ForgotPassword'
// import ProtectedRoute from './components/ProtectedRoute' // デバイス認証では不要
// import InstallPWA from './components/InstallPWA' // インストールボタン削除
import Footer from './components/Footer'
// import PWAInstallBanner from './components/PWAInstallBanner' // インストールバナー削除
import OfflineIndicator from './components/OfflineIndicator'
import { TeamProvider } from './contexts/TeamContext'
import { PostProvider } from './contexts/PostContext'
import { useOfflineSync } from './hooks/useOfflineSync'
// import { ensureDemoUserExists } from './utils/demoUser' // メール認証システム（保留）で使用
import { initializeAdminData } from './utils/adminInitialData'
import './utils/clearAndReload' // 管理者権限更新ユーティリティ
import { updatePWAIcon } from './utils/pwaCache' // PWAアイコン更新ユーティリティ
import './App.css'
import './admin-theme.css'

/**
 * アプリケーションのメインコンテンツコンポーネント
 * ログイン後の全ての画面とデータ管理を行います
 */
function AppContent() {
  // 現在ログイン中のユーザー情報を取得
  const { user } = useAuth()
  
  // React Routerのナビゲーション
  const navigate = useNavigate()
  
  // オフライン同期機能
  const { isOnline, pendingSync } = useOfflineSync()
  
  // カレンダーで選択された日付を管理
  const [selectedDate, setSelectedDate] = useState(null)
  
  // アプリケーションのローディング状態
  // 全デバイスで初期状態をfalseにして即座に表示（初回ロード問題の修正）
  const [isAppLoading, setIsAppLoading] = useState(false)
  
  /**
   * マイページ専用データの状態管理
   * LocalStorageを使用してユーザーごとにデータを永続化
   * 
   * データ構造:
   * - practices: 練習記録の配列
   * - videos: 動画投稿の配列
   * - schedules: スケジュールの配列
   * - meals: 食事記録の配列
   * - supplements: サプリメント記録の配列
   * - sleep: 睡眠記録の配列
   */
  const [myPageData, setMyPageData] = useState(() => {
    // デフォルトの空データ
    const defaultData = {
      practices: [],
      videos: [],
      schedules: [],
      meals: [],
      supplements: [],
      sleep: [],
      games: [],
      diaries: []
    }
    
    try {
      // ユーザーのメールアドレスをキーとして使用（ゲストの場合は'guest'）
      const userKey = (user && user.email) || 'guest'
      
      // 管理者アカウント専用の永続化処理
      if (userKey === 'over9131120@gmail.com') {
        const adminData = localStorage.getItem('baseballSNSAdminData')
        if (adminData && adminData !== 'undefined') {
          return JSON.parse(adminData)
        }
      } else {
        // 通常ユーザーのデータ読み込み
        const savedData = localStorage.getItem(`baseballSNSMyPageData_${userKey}`)
        if (savedData && savedData !== 'undefined') {
          return JSON.parse(savedData)
        }
      }
    } catch (error) {
      console.error('Error loading myPageData from localStorage:', error)
    }
    
    return defaultData
  })
  
  /**
   * タイムラインに表示する投稿の状態管理
   * 初期値としてデモデータを含む
   */
  const [posts, setPosts] = useState(() => {
    try {
      // LocalStorageから保存済みの投稿を読み込み
      const savedPosts = localStorage.getItem('baseballSNSPosts')
      if (savedPosts && savedPosts !== 'undefined') {
        return JSON.parse(savedPosts)
      }
    } catch (error) {
      console.error('Error loading posts from localStorage:', error)
    }
    
    return [
    // デモ投稿データ
    {
      id: 1,
      type: 'normal',
      content: '今日は素晴らしい試合でした！9回裏の逆転サヨナラホームランは鳥肌ものでした！',
      author: '野球太郎',
      timestamp: '2025-01-30T15:00:00',
      likes: 42,
      comments: 5
    },
    {
      id: 2,
      type: 'practice',
      author: '練習マニア',
      timestamp: '2025-01-30T14:00:00',
      likes: 23,
      comments: 8,
      practiceData: {
        date: '2025-01-30',
        startTime: '15:00',
        endTime: '17:30',
        category: 'batting',
        condition: 4,
        menu: [
          { name: '素振り', value: 200, unit: '回' },
          { name: 'ティーバッティング', value: 150, unit: '球' },
          { name: 'フリーバッティング', value: 80, unit: '球' }
        ],
        note: '今日はスイングの軌道を意識して練習。特にインコースの対応を重点的に行った。'
      }
    },
    {
      id: 3,
      type: 'normal',
      content: '明日の先発投手は誰だろう？エースの調子が心配です。',
      author: '応援団長',
      timestamp: '2025-01-30T13:30:00',
      likes: 15,
      comments: 3
    }
    ]
  })

  /**
   * ユーザーごとのマイページデータを更新する関数
   * 
   * @param {Object} newData - 更新するデータ
   * @param {Array} newData.practices - 練習記録
   * @param {Array} newData.videos - 動画投稿
   * 他のプロパティも同様
   */
  const updateMyPageData = (newData) => {
    const userKey = (user && user.email) || 'guest'
    
    // 管理者アカウントの場合は専用キーで保存
    if (userKey === 'over9131120@gmail.com') {
      localStorage.setItem('baseballSNSAdminData', JSON.stringify(newData))
    } else {
      localStorage.setItem(`baseballSNSMyPageData_${userKey}`, JSON.stringify(newData))
    }
    
    setMyPageData(newData)
  }

  /**
   * 新しい投稿をタイムラインに追加する関数
   * 
   * @param {Object} postData - 投稿データ
   * @param {string} postData.type - 投稿タイプ（normal/practice/video/health）
   * @param {string} postData.content - 投稿内容
   * @param {Object} postData.practiceData - 練習記録データ（練習投稿の場合）
   */
  const addPost = (postData) => {
    const newPost = {
      id: Date.now(), // 一意のIDとしてタイムスタンプを使用
      ...postData,
      author: (user && user.email) || 'ゲストユーザー',
      userId: (user && user.id) || null,
      timestamp: new Date().toISOString(),
      likes: 0,
      comments: 0,
      isPrivate: false // デフォルトは公開
    }
    setPosts([newPost, ...posts]) // 新しい投稿を先頭に追加
  }

  /**
   * 動画投稿を追加する関数
   * MyPageから呼ばれて、タイムラインにも反映される
   */
  const addVideoPost = (videoData) => {
    const newPost = {
      id: Date.now(),
      type: 'video',
      author: (user && user.email) || 'ゲストユーザー',
      userId: (user && user.id) || null,
      timestamp: new Date().toISOString(),
      likes: 0,
      comments: 0,
      videoData
    }
    setPosts([newPost, ...posts])
  }

  /**
   * 健康記録を投稿として追加する関数
   */
  const addHealthRecord = (healthData) => {
    const newPost = {
      id: Date.now(),
      type: 'health',
      author: (user && user.email) || 'ゲストユーザー',
      userId: (user && user.id) || null,
      timestamp: new Date().toISOString(),
      likes: 0,
      comments: 0,
      healthData,
      isPrivate: false
    }
    setPosts([newPost, ...posts])
  }

  /**
   * 管理者用ダークテーマの適用
   * useEffectフックを使用して、ユーザー情報が変更されたときに実行
   */
  useEffect(() => {
    // 管理者アカウントかどうかをチェック
    if ((user && user.isAdmin) || (user && user.email === 'over9131120@gmail.com')) {
      document.body.classList.add('admin-theme')
    } else {
      document.body.classList.remove('admin-theme')
    }
    
    // クリーンアップ関数：コンポーネントがアンマウントされたときに実行
    return () => {
      document.body.classList.remove('admin-theme')
    }
  }, [user]) // userが変更されたときのみ実行

  /**
   * 投稿データの永続化
   * 投稿が更新されるたびにLocalStorageに保存
   */
  useEffect(() => {
    localStorage.setItem('baseballSNSPosts', JSON.stringify(posts))
  }, [posts])
  
  /**
   * ユーザーが変更されたときにマイページデータを再読み込み
   * ログイン/ログアウト時に適切なデータを表示
   */
  useEffect(() => {
    const userKey = (user && user.email) || 'guest'
    
    if (userKey === 'over9131120@gmail.com') {
      try {
        const adminData = localStorage.getItem('baseballSNSAdminData')
        if (adminData && adminData !== 'undefined') {
          setMyPageData(JSON.parse(adminData))
        }
      } catch (error) {
        console.error('Error parsing admin data:', error)
      }
    } else {
      try {
        const savedData = localStorage.getItem(`baseballSNSMyPageData_${userKey}`)
        if (savedData && savedData !== 'undefined') {
          setMyPageData(JSON.parse(savedData))
        } else {
          // 新規ユーザーの場合は空のデータを設定
          setMyPageData({
            practices: [],
            videos: [],
            schedules: [],
            meals: [],
            supplements: [],
            sleep: [],
            games: [],
            diaries: []
          })
        }
      } catch (error) {
        console.error('Error loading myPageData:', error)
      }
    }
  }, [user])

  // 初回ロード時にデモチームのセットアップ確認
  useEffect(() => {
    // 管理人アカウントでログインしている場合、初期データを設定
    if (user && user.email === 'over9131120@gmail.com') {
      initializeAdminData();
    }
  }, [user])

  // ローディング状態の初期化
  useEffect(() => {
    // モバイルの場合は既にfalseなのでスキップ
    if (!isMobile && isAppLoading) {
      // デスクトップは少し待つ
      setTimeout(() => {
        setIsAppLoading(false)
      }, 300)
    }

    // PWAアイコンを更新（キャッシュ対策）
    updatePWAIcon()
  }, [])
  
  // ローディング中の表示
  if (isAppLoading) {
    return <LoadingSpinner fullPage size="large" message="データを読み込んでいます..." />
  }
  
  // JSXレンダリング部分
  return (
    <div className="app">
        {/* アプリケーションヘッダー */}
        <header className="app-header">
          <h1 
            onClick={() => navigate('/mypage')} 
            style={{ cursor: 'pointer' }}
            title="マイページへ"
          >
            ⚾ BaseLog
          </h1>
          <p>野球の記録と交流をひとつに</p>
        </header>
        
        {/* ナビゲーションバー（ログイン時のみ表示） */}
        <Navigation 
          posts={posts} 
          onDateClick={setSelectedDate} 
          selectedDate={selectedDate}
        />
        
        {/* PWAインストールボタン削除 */}
        {/* <InstallPWA /> */}
        
        {/* PWAインストールバナー削除 */}
        {/* <PWAInstallBanner /> */}
        
        {/* オフラインインジケーター */}
        <OfflineIndicator isOnline={isOnline} pendingCount={pendingSync.length} />
        
        {/* ルーティング設定 */}
        <React.Suspense fallback={<LoadingSpinner />}>
          <Routes>
            {/* メール認証関連ルート（保留） */}
            {/* デバイス認証ではログイン画面は不要のためコメントアウト */}
            {/*
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route path="/profile-setup" element={<ProfileSetup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            */}
            
            {/* タイムライン（ホーム画面） - ログイン必須 */}
            {/* <Route path="/" element={
              <ProtectedRoute>
                <Timeline posts={posts} addPost={addPost} />
              </ProtectedRoute>
            } /> */}
            
            {/* ホーム画面（デフォルト） - デバイス認証で自動ログイン */}
            <Route path="/" element={
              <MyPage 
                  posts={posts}
                  myPageData={myPageData}
                  setMyPageData={updateMyPageData}
                  selectedDate={selectedDate}
                  setSelectedDate={setSelectedDate}
                  addPost={addPost}
                />
            } />
            
            {/* マイページ */}
            <Route path="/mypage" element={
                <MyPage 
                  posts={posts}
                  myPageData={myPageData}
                  setMyPageData={updateMyPageData}
                  selectedDate={selectedDate}
                  setSelectedDate={setSelectedDate}
                  addPost={addPost}
                />
            } />
            
            {/* インストールガイド */}
            <Route path="/install" element={<InstallGuide />} />
          
          {/* カレンダー画面 */}
          <Route path="/calendar" element={
              <CalendarView posts={posts} />
          } />
          
          {/* チーム一覧 */}
          <Route path="/teams" element={
              <TeamsPage />
          } />
          
          {/* ユーザープロフィール画面 */}
          <Route path="/profile/:userId" element={
              <Profile posts={posts} myPageData={myPageData} />
          } />
          
          {/* プロフィール（自分） */}
          <Route path="/profile" element={
              <Profile posts={posts} myPageData={myPageData} />
          } />
          
          {/* 測定結果画面 */}
          <Route path="/measurements" element={
              <Measurements />
          } />
          
          {/* 設定画面 */}
          <Route path="/settings" element={
              <Settings />
          } />
          
          {/* チーム詳細画面 - MVP版では無効化 */}
          {/* <Route path="/team/:teamId" element={
            <ProtectedRoute>
              <TeamDetail />
            </ProtectedRoute>
          } /> */}
          
          {/* 免責事項ページ */}
          <Route path="/disclaimer" element={<Disclaimer />} />
          
          {/* プライバシーポリシーページ */}
          <Route path="/privacy" element={<PrivacyPolicy />} />
          
          {/* 利用規約ページ */}
          <Route path="/terms" element={<TermsOfService />} />
          
          {/* 練習記録ページ */}
          <Route path="/practice-record" element={
              <PracticeRecordPage 
                addPost={addPost}
                myPageData={myPageData}
                setMyPageData={updateMyPageData}
              />
          } />
          </Routes>
        </React.Suspense>
        
        {/* モバイル用固定ナビゲーション削除 */}
        {/* {user && <MobileNavigation />} */}
        
        {/* フッター */}
        <Footer />
        
        {/* PWAインストールプロンプト - 無効化 */}
        {/* <InstallPrompt /> */}
    </div>
  )
}

/**
 * アプリケーションのルートコンポーネント
 * RouterとAuthProviderでアプリ全体をラップ
 */
function App() {
  // デバイス認証では自動的にユーザーが作成されるため、デモユーザー作成は不要
  // メール認証システム（保留）でのデモユーザー作成
  /*
  useEffect(() => {
    // Supabaseが設定されている場合のみデモユーザーを作成
    if (hasSupabaseConfig) {
      ensureDemoUserExists().then(result => {
        if (result.created) {
          if (process.env.NODE_ENV === 'development') {
            console.log('デモユーザーを作成しました')
          }
        }
      })
    }
  }, [])
  */

  return (
    <Router>
      <AuthProvider>
        <PostProvider>
          <TeamProvider>
            <AppContent />
          </TeamProvider>
        </PostProvider>
      </AuthProvider>
    </Router>
  )
}

export default App