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

function Timeline({ posts, addPost, addPracticeRecord, addVideoPost, addHealthRecord }) {
  const [postType, setPostType] = useState('normal')
  const [showFullForm, setShowFullForm] = useState(false)
  const [showQuickPractice, setShowQuickPractice] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const { user } = useAuth()
  const navigate = useNavigate()
  
  // 検索クエリに基づいて投稿をフィルタリング
  const filteredPosts = filterPostsBySearch(posts, searchQuery)

  // クイック投稿のハンドラー
  const handleQuickShare = (shareData) => {
    addPost({
      content: shareData.content,
      type: shareData.shareType,
      author: shareData.author
    })
  }
  
  // クイック練習記録のハンドラー
  const handleQuickPractice = (practiceData) => {
    addPracticeRecord(practiceData)
    setShowQuickPractice(false)
  }
  
  // ハッシュタグクリックのハンドラー
  const handleHashtagClick = (hashtag) => {
    setSearchQuery(`#${hashtag}`)
  }

  const handleUserClick = (userId) => {
    navigate('/mypage')
  }

  return (
    <>
      <SearchBar 
        posts={posts} 
        onSearch={setSearchQuery} 
      />
      
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
      
      {user ? (
        <>
          <QuickShare onShare={handleQuickShare} />
          
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
          
          {showFullForm && (
            <>
              <PostTypeSelector 
                postType={postType} 
                onTypeChange={setPostType} 
              />
              
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
        <div className="view-only-notice">
          <p>📝 投稿するにはログインが必要です</p>
        </div>
      )}
      
      <PostList 
        posts={filteredPosts} 
        onHashtagClick={handleHashtagClick}
        onUserClick={handleUserClick}
      />
    </>
  )
}

export default Timeline