import React, { useState } from 'react'
import './PostForm.css'

function PostForm({ onSubmit }) {
  const [content, setContent] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (content.trim()) {
      onSubmit(content)
      setContent('')
    }
  }

  return (
    <form className="post-form" onSubmit={handleSubmit}>
      <h3>新しい投稿</h3>
      <textarea
        className="post-textarea"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="今日の試合はどうでしたか？感想を共有しよう！"
        rows="4"
      />
      <div className="form-actions">
        <span className="char-count">{content.length} / 280</span>
        <button 
          type="submit" 
          className="submit-button"
          disabled={!content.trim() || content.length > 280}
        >
          投稿する
        </button>
      </div>
    </form>
  )
}

export default PostForm