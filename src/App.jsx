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
// Supabase設定がある場合はAuthContext、ない場合はSimpleAuthContextを使用
import { AuthProvider as SupabaseAuthProvider, useAuth as useSupabaseAuth } from './contexts/AuthContext'
import { AuthProvider as SimpleAuthProvider, useAuth as useSimpleAuth } from './contexts/SimpleAuthContext'

// 環境変数をチェックして適切な認証システムを選択
// Safari互換性: import.meta.envの安全な参照
let hasSupabaseConfig = false;

try {
  // Viteのdefineで置換される値を直接参照
  const url = (typeof VITE_SUPABASE_URL !== 'undefined' ? VITE_SUPABASE_URL : '') || '';
  hasSupabaseConfig = url && url !== 'https://xyzcompanyprojectid.supabase.co';
} catch (e) {
  hasSupabaseConfig = false;
}

// 条件に応じて認証プロバイダーとフックをエクスポート
export const AuthProvider = hasSupabaseConfig ? SupabaseAuthProvider : SimpleAuthProvider
export const useAuth = hasSupabaseConfig ? useSupabaseAuth : useSimpleAuth

// コンポーネントのインポート
import Navigation from './components/Navigation'
import Timeline from './pages/Timeline'
import MyPage from './pages/MyPage'
import CalendarView from './pages/CalendarView'
import Profile from './pages/Profile'
import Settings from './pages/Settings'
import Disclaimer from './pages/Disclaimer'
import Login from './components/Login'
import Signup from './components/Signup'
import ProfileSetup from './components/ProfileSetup'
import ForgotPassword from './components/ForgotPassword'
import ProtectedRoute from './components/ProtectedRoute'
import InstallPWA from './components/InstallPWA'
import Footer from './components/Footer'
import PWAInstallBanner from './components/PWAInstallBanner'
import './App.css'
import './admin-theme.css'

/**
 * アプリケーションのメインコンテンツコンポーネント
 * ログイン後の全ての画面とデータ管理を行います
 */
function AppContent() {
  // 現在ログイン中のユーザー情報を取得
  const { user } = useAuth()
  
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
        sleep: []
      }
    }
    
    // 通常ユーザーのデータ読み込み
    return savedData ? JSON.parse(savedData) : {
      practices: [],
      videos: [],
      schedules: [],
      meals: [],
      supplements: [],
      sleep: []
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
          sleep: []
        })
      }
    }
  }, [user])

  // JSXレンダリング部分
  return (
    <div className="app">
        {/* アプリケーションヘッダー */}
        <header className="app-header">
          <h1>⚾ BaseLog</h1>
          <p>野球の記録と交流をひとつに</p>
        </header>
        
        {/* ナビゲーションバー（ログイン時のみ表示） */}
        <Navigation 
          posts={posts} 
          onDateClick={setSelectedDate} 
          selectedDate={selectedDate}
        />
        
        {/* PWAインストールボタン */}
        <InstallPWA />
        
        {/* PWAインストールバナー（初回訪問時） */}
        <PWAInstallBanner />
        
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
                updateMyPageData={updateMyPageData}
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
                addPost={addPost}
                addVideoPost={addVideoPost}
                addHealthRecord={addHealthRecord}
              />
            </ProtectedRoute>
          } />
          
          {/* カレンダー画面 - ログイン必須 */}
          <Route path="/calendar" element={
            <ProtectedRoute>
              <CalendarView posts={posts} />
            </ProtectedRoute>
          } />
          
          {/* ユーザープロフィール画面 */}
          <Route path="/profile/:userId" element={
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
        <AppContent />
      </AuthProvider>
    </Router>
  )
}

export default App