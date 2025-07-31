/**
 * Timeline.jsx - タイムラインページコンポーネント
 * 
 * SNSのメインページで、全ユーザーの投稿を時系列で表示します。
 * 投稿の閲覧、作成、検索などの主要機能を提供。
 * 
 * 主な機能:
 * - 投稿の一覧表示
 * - クイック投稿（簡易投稿）
 * - 詳細投稿（練習記録、動画、健康記録）
 * - ハッシュタグ検索
 * - ユーザー投稿のフィルタリング
 */

import React, { useState } from 'react'
import { useAuth } from '../App'
import { useNavigate } from 'react-router-dom'
import PostList from '../components/PostList'
import PostForm from '../components/PostForm'
import PracticeForm from '../components/PracticeForm'
import VideoForm from '../components/VideoForm'
import HealthForm from '../components/HealthForm'
import PostTypeSelector from '../components/PostTypeSelector'
import QuickShare from '../components/QuickShare'
import QuickPracticeForm from '../components/QuickPracticeForm'
import SearchBar from '../components/SearchBar'
import { filterPostsBySearch } from '../utils/hashtagUtils.jsx'
import './Timeline.css'

/**
 * タイムラインページコンポーネント
 * 
 * @param {Object} props
 * @param {Array} props.posts - 全投稿データの配列
 * @param {Function} props.addPost - 通常投稿を追加する関数
 * @param {Function} props.addPracticeRecord - 練習記録を追加する関数
 * @param {Function} props.addVideoPost - 動画投稿を追加する関数
 * @param {Function} props.addHealthRecord - 健康記録を追加する関数
 */
function Timeline({ posts, addPost, addPracticeRecord, addVideoPost, addHealthRecord }) {
  /**
   * 状態管理
   * postType: 投稿タイプ（normal/practice/video/health）
   * showFullForm: 詳細投稿フォームの表示状態
   * showQuickPractice: クイック練習記録フォームの表示状態
   * searchQuery: 検索クエリ文字列
   */
  const [postType, setPostType] = useState('normal')
  const [showFullForm, setShowFullForm] = useState(false)
  const [showQuickPractice, setShowQuickPractice] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  
  // 認証情報とナビゲーション機能を取得
  const { user } = useAuth()
  const navigate = useNavigate()
  
  /**
   * 検索クエリに基づいて投稿をフィルタリング
   * hashtagUtils.jsxのfilterPostsBySearch関数を使用
   * 検索対象: 投稿内容、ハッシュタグ、作者名など
   */
  const filteredPosts = filterPostsBySearch(posts, searchQuery)

  /**
   * クイック投稿のハンドラー
   * QuickShareコンポーネントから受け取ったデータを処理
   * 
   * @param {Object} shareData - 投稿データ
   * @param {string} shareData.content - 投稿内容
   * @param {string} shareData.shareType - 投稿タイプ
   * @param {string} shareData.author - 投稿者名
   */
  const handleQuickShare = (shareData) => {
    addPost({
      content: shareData.content,
      type: shareData.shareType,
      author: shareData.author
    })
  }
  
  /**
   * クイック練習記録のハンドラー
   * 簡易的な練習記録を作成し、フォームを閉じる
   * 
   * @param {Object} practiceData - 練習データ
   */
  const handleQuickPractice = (practiceData) => {
    addPracticeRecord(practiceData)
    setShowQuickPractice(false) // フォームを閉じる
  }
  
  /**
   * ハッシュタグクリックのハンドラー
   * クリックされたハッシュタグで検索を実行
   * 
   * @param {string} hashtag - クリックされたハッシュタグ（#なし）
   */
  const handleHashtagClick = (hashtag) => {
    // #を付けて検索クエリに設定
    setSearchQuery(`#${hashtag}`)
  }

  /**
   * ユーザー名クリックのハンドラー
   * 現在はマイページへの遷移のみ（将来的にはユーザープロフィールへ）
   * 
   * @param {string} userId - クリックされたユーザーのID
   */
  const handleUserClick = (userId) => {
    // TODO: 将来的には `/profile/${userId}` に遷移
    navigate('/mypage')
  }

  // コンポーネントのレンダリング
  return (
    <>
      {/* 検索バー: ハッシュタグや投稿内容の検索 */}
      <SearchBar 
        posts={posts} 
        onSearch={setSearchQuery} 
      />
      
      {/* 検索結果の表示 */}
      {searchQuery && (
        <div className="search-results-info">
          <p>「{searchQuery}」の検索結果: {filteredPosts.length}件</p>
          <button 
            className="clear-search-btn"
            onClick={() => setSearchQuery('')}
          >
            検索をクリア
          </button>
        </div>
      )}
      
      {/* ログインユーザー向けの投稿機能 */}
      {user ? (
        <>
          {/* クイック投稿フォーム: 簡単なテキスト投稿 */}
          <QuickShare onShare={handleQuickShare} />
          
          {/* クイックアクションボタン: 各種投稿フォームへのアクセス */}
          {!showQuickPractice && !showFullForm && (
            <div className="quick-actions">
              <button
                className="quick-practice-btn"
                onClick={() => setShowQuickPractice(true)}
              >
                ⚡ クイック練習記録
              </button>
              <button
                className="show-full-form-btn"
                onClick={() => setShowFullForm(true)}
              >
                📋 詳細な記録を投稿
              </button>
            </div>
          )}
          
          {/* クイック練習記録フォーム: 簡易的な練習記録 */}
          {showQuickPractice && (
            <>
              <QuickPracticeForm onSubmit={handleQuickPractice} />
              <button
                className="hide-quick-practice-btn"
                onClick={() => setShowQuickPractice(false)}
              >
                閉じる
              </button>
            </>
          )}
          
          {/* 詳細投稿フォーム: 投稿タイプ別の詳細フォーム */}
          {showFullForm && (
            <>
              {/* 投稿タイプセレクター */}
              <PostTypeSelector 
                postType={postType} 
                onTypeChange={setPostType} 
              />
              
              {/* 投稿タイプに応じたフォームを表示 */}
              {postType === 'normal' && (
                <PostForm onSubmit={addPost} />
              )}
              {postType === 'practice' && (
                <PracticeForm onSubmit={addPracticeRecord} />
              )}
              {postType === 'video' && (
                <VideoForm onSubmit={addVideoPost} />
              )}
              {postType === 'health' && (
                <HealthForm onSubmit={addHealthRecord} />
              )}
              
              {/* フォームを閉じるボタン */}
              <button
                className="hide-full-form-btn"
                onClick={() => setShowFullForm(false)}
              >
                簡単投稿に戻る
              </button>
            </>
          )}
        </>
      ) : (
        // 非ログインユーザー向けのメッセージ
        <div className="view-only-notice">
          <p>📝 投稿するにはログインが必要です</p>
        </div>
      )}
      
      {/* 投稿一覧: フィルタリングされた投稿を表示 */}
      <PostList 
        posts={filteredPosts} 
        onHashtagClick={handleHashtagClick}
        onUserClick={handleUserClick}
      />
    </>
  )
}

export default Timeline