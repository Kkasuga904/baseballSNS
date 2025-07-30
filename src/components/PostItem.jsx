import React from 'react'
import './PostItem.css'

function PostItem({ post }) {
  const formatDate = (date) => {
    const now = new Date()
    const diff = now - date
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return 'たった今'
    if (minutes < 60) return `${minutes}分前`
    if (hours < 24) return `${hours}時間前`
    return `${days}日前`
  }

  return (
    <div className="post-item">
      <div className="post-header">
        <span className="post-author">{post.author}</span>
        <span className="post-time">{formatDate(post.timestamp)}</span>
      </div>
      <div className="post-content">
        {post.content}
      </div>
      <div className="post-actions">
        <button className="action-button">
          <span className="heart">♥</span> {post.likes}
        </button>
        <button className="action-button">
          <span className="comment">💬</span> {post.comments}
        </button>
        <button className="action-button">
          <span className="share">🔗</span> シェア
        </button>
      </div>
    </div>
  )
}

export default PostItem