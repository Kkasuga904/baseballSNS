import React, { useState } from 'react'
import { useAuth } from '../App'
import PostList from '../components/PostList'
import PostForm from '../components/PostForm'
import PracticeForm from '../components/PracticeForm'
import VideoForm from '../components/VideoForm'
import HealthForm from '../components/HealthForm'
import PostTypeSelector from '../components/PostTypeSelector'
import './Timeline.css'

function Timeline({ posts, addPost, addPracticeRecord, addVideoPost, addHealthRecord }) {
  const [postType, setPostType] = useState('normal')
  const { user } = useAuth()

  return (
    <>
      {user ? (
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