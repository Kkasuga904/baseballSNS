import React, { useState } from 'react'
import PostList from '../components/PostList'
import PostForm from '../components/PostForm'
import PracticeForm from '../components/PracticeForm'
import PostTypeSelector from '../components/PostTypeSelector'

function Timeline({ posts, addPost, addPracticeRecord }) {
  const [postType, setPostType] = useState('normal')

  return (
    <>
      <PostTypeSelector 
        postType={postType} 
        onTypeChange={setPostType} 
      />
      
      {postType === 'normal' ? (
        <PostForm onSubmit={addPost} />
      ) : (
        <PracticeForm onSubmit={addPracticeRecord} />
      )}
      
      <PostList posts={posts} />
    </>
  )
}

export default Timeline