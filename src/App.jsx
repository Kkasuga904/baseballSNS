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
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

// 認証システムの選択
// Firebase設定がある場合はFirebaseAuthContext、Supabase設定がある場合はAuthContext、それ以外はSimpleAuthContextを使用
import { AuthProvider as SupabaseAuthProvider, useAuth as useSupabaseAuth } from './contexts/AuthContext'
import { AuthProvider as SimpleAuthProvider, useAuth as useSimpleAuth } from './contexts/SimpleAuthContext'
import { AuthProvider as FirebaseAuthProvider, useAuth as useFirebaseAuth } from './contexts/FirebaseAuthContext'

// 環境変数をチェックして適切な認証システムを選択
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
  console.log('Firebase Config Check:', { firebaseApiKey, hasFirebaseConfig });
  console.log('Auth Provider Selected:', hasFirebaseConfig ? 'Firebase' : (hasSupabaseConfig ? 'Supabase' : 'SimpleAuth'));
} catch (e) {
  hasSupabaseConfig = false;
  hasFirebaseConfig = false;
  console.log('Auth config error, falling back to SimpleAuth:', e);
}

// 条件に応じて認証プロバイダーとフックをエクスポート
export const AuthProvider = hasFirebaseConfig ? FirebaseAuthProvider : (hasSupabaseConfig ? SupabaseAuthProvider : SimpleAuthProvider)
export const useAuth = hasFirebaseConfig ? useFirebaseAuth : (hasSupabaseConfig ? useSupabaseAuth : useSimpleAuth)

// コンポーネントのインポート
import Navigation from './components/Navigation'
import Timeline from './pages/Timeline'
import MyPage from './pages/MyPage'
import CalendarView from './pages/CalendarView'
import Profile from './pages/Profile'
import Settings from './pages/Settings'
import Disclaimer from './pages/Disclaimer'
// MVP版ではチーム機能は無効化
// import TeamDetail from './pages/TeamDetail'
// import Teams from './pages/Teams'
import Login from './components/Login'
import Signup from './components/Signup'
import CompactLogin from './components/CompactLogin'
import ProfileSetup from './components/ProfileSetup'
import ForgotPassword from './components/ForgotPassword'
import ProtectedRoute from './components/ProtectedRoute'
import InstallPWA from './components/InstallPWA'
import Footer from './components/Footer'
import PWAInstallBanner from './components/PWAInstallBanner'
import OfflineIndicator from './components/OfflineIndicator'
import { TeamProvider } from './contexts/TeamContext'
import { PostProvider } from './contexts/PostContext'
import { setupDemoTeam, joinDemoTeam, addDemoUserToTeam } from './utils/demoTeamSetup'
import { useOfflineSync } from './hooks/useOfflineSync'
import './App.css'
import './admin-theme.css'

/**
 * アプリケーションのメインコンテンツコンポーネント
 * ログイン後の全ての画面とデータ管理を行います
 */
function AppContent() {
  // 現在ログイン中のユーザー情報を取得
  const { user } = useAuth()
  
  // オフライン同期機能
  const { isOnline, pendingSync } = useOfflineSync()
  
  // カレンダーで選択された日付を管理
  const [selectedDate, setSelectedDate] = useState(null)
  
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
    // ユーザーのメールアドレスをキーとして使用（ゲストの場合は'guest'）
    const userKey = (user && user.email) || 'guest'
    const savedData = localStorage.getItem(`baseballSNSMyPageData_${userKey}`)
    
    // 管理者アカウント専用の永続化処理
    if (userKey === 'over9131120@gmail.com') {
      const adminData = localStorage.getItem('baseballSNSAdminData')
      return adminData ? JSON.parse(adminData) : {
        practices: [],
        videos: [],
        schedules: [],
        meals: [],
        supplements: [],
        sleep: [],
        games: [],
        diaries: []
      }
    }
    
    // 通常ユーザーのデータ読み込み
    return savedData ? JSON.parse(savedData) : {
      practices: [],
      videos: [],
      schedules: [],
      meals: [],
      supplements: [],
      sleep: [],
      games: [],
      diaries: []
    }
  })
  
  /**
   * タイムラインに表示する投稿の状態管理
   * 初期値としてデモデータを含む
   */
  const [posts, setPosts] = useState(() => {
    // LocalStorageから保存済みの投稿を読み込み
    const savedPosts = localStorage.getItem('baseballSNSPosts')
    return savedPosts ? JSON.parse(savedPosts) : [
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
      const adminData = localStorage.getItem('baseballSNSAdminData')
      if (adminData) {
        setMyPageData(JSON.parse(adminData))
      }
    } else {
      const savedData = localStorage.getItem(`baseballSNSMyPageData_${userKey}`)
      if (savedData) {
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
    }
  }, [user])

  // 初回ロード時にデモチームのセットアップ確認
  useEffect(() => {
    // デモチームが存在するか確認
    const teams = JSON.parse(localStorage.getItem('baseballSNS_teams') || '[]');
    const demoTeamExists = teams.some(team => team.id === 'demo-team-001');
    
    if (demoTeamExists) {
      // デモチームは存在するが、現在のユーザーがメンバーでない可能性があるため
      // デモユーザーを追加（既に存在する場合は何もしない）
      addDemoUserToTeam();
    }
  }, []);

  // デモチームセットアップ
  const handleSetupDemoTeam = () => {
    const wasSetup = setupDemoTeam();
    if (wasSetup) {
      // 現在のユーザーをチームに参加させる
      if (user) {
        joinDemoTeam(user.id || user.email);
      }
      // デモユーザーも追加
      addDemoUserToTeam();
      alert('デモチーム「新神田ウイングス」を作成しました！\nマイページで確認してください。');
      window.location.reload();
    } else {
      // 既に存在する場合もデモユーザーを追加
      if (user) {
        const joined = joinDemoTeam(user.id || user.email);
        if (joined) {
          alert('デモチームに参加しました！');
          window.location.reload();
        } else {
          alert('既にチームに参加しています。');
        }
      }
      addDemoUserToTeam();
    }
  };

  // JSXレンダリング部分
  return (
    <div className="app">
        {/* アプリケーションヘッダー */}
        <header className="app-header">
          <h1>⚾ BaseLog</h1>
          <p>野球の記録と交流をひとつに</p>
          {/* デモチームセットアップボタン */}
          {user && (
            <button 
              onClick={handleSetupDemoTeam}
              style={{
                position: 'absolute',
                right: '20px',
                top: '20px',
                padding: '8px 16px',
                backgroundColor: '#2e7d46',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              デモチームを作成
            </button>
          )}
        </header>
        
        {/* ナビゲーションバー（ログイン時のみ表示） */}
        <Navigation 
          posts={posts} 
          onDateClick={setSelectedDate} 
          selectedDate={selectedDate}
        />
        
        {/* PWAインストールボタン */}
        <InstallPWA />
        
        {/* PWAインストールバナー（一時的に無効化） */}
        {/* <PWAInstallBanner /> */}
        
        {/* オフラインインジケーター */}
        <OfflineIndicator isOnline={isOnline} pendingCount={pendingSync.length} />
        
        {/* ルーティング設定 */}
        <Routes>
          {/* ログイン画面 */}
          <Route path="/login" element={<Login />} />
          
          {/* 新規登録画面 */}
          <Route path="/signup" element={<Signup />} />
          
          {/* プロフィール設定画面 */}
          <Route path="/profile-setup" element={<ProfileSetup />} />
          
          {/* パスワードリセット画面 */}
          <Route path="/forgot-password" element={<ForgotPassword />} />
          
          {/* タイムライン（ホーム画面） - ログイン必須 */}
          <Route path="/" element={
            <ProtectedRoute>
              <Timeline posts={posts} addPost={addPost} />
            </ProtectedRoute>
          } />
          
          {/* マイページ - ログイン必須 */}
          <Route path="/mypage" element={
            <ProtectedRoute>
              <MyPage 
                posts={posts}
                myPageData={myPageData}
                setMyPageData={updateMyPageData}
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
              />
            </ProtectedRoute>
          } />
          
          {/* カレンダー画面 - ログイン必須 */}
          <Route path="/calendar" element={
            <ProtectedRoute>
              <CalendarView posts={posts} />
            </ProtectedRoute>
          } />
          
          {/* チーム一覧 - MVP版では無効化 */}
          {/* <Route path="/teams" element={
            <ProtectedRoute>
              <Teams />
            </ProtectedRoute>
          } /> */}
          
          {/* ユーザープロフィール画面 */}
          <Route path="/profile/:userId" element={
            <ProtectedRoute>
              <Profile posts={posts} myPageData={myPageData} />
            </ProtectedRoute>
          } />
          
          {/* プロフィール（自分） */}
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile posts={posts} myPageData={myPageData} />
            </ProtectedRoute>
          } />
          
          {/* 設定画面 - ログイン必須 */}
          <Route path="/settings" element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          } />
          
          {/* チーム詳細画面 - MVP版では無効化 */}
          {/* <Route path="/team/:teamId" element={
            <ProtectedRoute>
              <TeamDetail />
            </ProtectedRoute>
          } /> */}
          
          {/* 免責事項ページ */}
          <Route path="/disclaimer" element={<Disclaimer />} />
        </Routes>
        
        {/* フッター */}
        <Footer />
    </div>
  )
}

/**
 * アプリケーションのルートコンポーネント
 * RouterとAuthProviderでアプリ全体をラップ
 */
function App() {
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