import React from 'react'
import PostItem from './PostItem'
import './PostList.css'

function PostList({ posts }) {
  return (
    <div className="post-list">
      <h2>最新の投稿</h2>
      {posts.length === 0 ? (
        <p className="no-posts">まだ投稿がありません</p>
      ) : (
        posts.map(post => (
          <PostItem key={post.id} post={post} />
        ))
      )}
    </div>
  )
}

export default PostList