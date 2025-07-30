import React from 'react'
import './PostTypeSelector.css'

function PostTypeSelector({ postType, onTypeChange }) {
  return (
    <div className="post-type-selector">
      <button
        className={`type-button ${postType === 'normal' ? 'active' : ''}`}
        onClick={() => onTypeChange('normal')}
      >
        <span className="type-icon">💬</span>
        <span className="type-label">通常投稿</span>
      </button>
      <button
        className={`type-button ${postType === 'practice' ? 'active' : ''}`}
        onClick={() => onTypeChange('practice')}
      >
        <span className="type-icon">📝</span>
        <span className="type-label">練習記録</span>
      </button>
      <button
        className={`type-button ${postType === 'video' ? 'active' : ''}`}
        onClick={() => onTypeChange('video')}
      >
        <span className="type-icon">🎬</span>
        <span className="type-label">動画投稿</span>
      </button>
      <button
        className={`type-button ${postType === 'health' ? 'active' : ''}`}
        onClick={() => onTypeChange('health')}
      >
        <span className="type-icon">🏥</span>
        <span className="type-label">健康記録</span>
      </button>
    </div>
  )
}

export default PostTypeSelector