import React, { useState } from 'react'
import { useAuth } from '../App'
import PostList from '../components/PostList'
import PostForm from '../components/PostForm'
import PracticeForm from '../components/PracticeForm'
import VideoForm from '../components/VideoForm'
import HealthForm from '../components/HealthForm'
import PostTypeSelector from '../components/PostTypeSelector'
import QuickShare from '../components/QuickShare'
import './Timeline.css'

function Timeline({ posts, addPost, addPracticeRecord, addVideoPost, addHealthRecord }) {
  const [postType, setPostType] = useState('normal')
  const [showFullForm, setShowFullForm] = useState(false)
  const { user } = useAuth()

  // クイック投稿のハンドラー
  const handleQuickShare = (shareData) => {
    addPost({
      content: shareData.content,
      type: shareData.shareType,
      author: shareData.author
    })
  }

  return (
    <>
      {user ? (
        <>
          <QuickShare onShare={handleQuickShare} />
          
          {!showFullForm ? (
            <button
              className="show-full-form-btn"
              onClick={() => setShowFullForm(true)}
            >
              📋 詳細な記録を投稿
            </button>
          ) : (
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