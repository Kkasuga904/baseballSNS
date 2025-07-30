import React, { useState } from 'react'
import PostList from '../components/PostList'
import PostForm from '../components/PostForm'
import PracticeForm from '../components/PracticeForm'
import VideoForm from '../components/VideoForm'
import PostTypeSelector from '../components/PostTypeSelector'

function Timeline({ posts, addPost, addPracticeRecord, addVideoPost }) {
  const [postType, setPostType] = useState('normal')

  return (
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
      
      <PostList posts={posts} />
    </>
  )
}

export default Timeline