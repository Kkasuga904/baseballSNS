import React, { useState } from 'react'
import { useAuth } from '../App'
import PostList from '../components/PostList'
import PostForm from '../components/PostForm'
import PracticeForm from '../components/PracticeForm'
import VideoForm from '../components/VideoForm'
import HealthForm from '../components/HealthForm'
import PostTypeSelector from '../components/PostTypeSelector'
import QuickShare from '../components/QuickShare'
import QuickPracticeForm from '../components/QuickPracticeForm'
import './Timeline.css'

function Timeline({ posts, addPost, addPracticeRecord, addVideoPost, addHealthRecord }) {
  const [postType, setPostType] = useState('normal')
  const [showFullForm, setShowFullForm] = useState(false)
  const [showQuickPractice, setShowQuickPractice] = useState(false)
  const { user } = useAuth()

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

  return (
    <>
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
      
      <PostList posts={posts} />
    </>
  )
}

export default Timeline