import React, { useState, useRef } from 'react'
import './VideoPost.css'

function VideoPost({ videoData }) {
  const { title, description, category, videoUrl, thumbnail, duration, fileSize } = videoData
  const [isPlaying, setIsPlaying] = useState(false)
  const [showControls, setShowControls] = useState(false)
  const videoRef = useRef(null)

  const categoryIcons = {
    'form-check': '📹',
    'practice': '🎥',
    'game': '🏆',
    'technique': '📚'
  }

  const categoryLabels = {
    'form-check': 'フォーム確認',
    'practice': '練習風景',
    'game': '試合ハイライト',
    'technique': '技術解説'
  }

  const formatFileSize = (bytes) => {
    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`
    }
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  return (
    <div className="video-post">
      <div className="video-header">
        <div className="video-category">
          <span className="category-icon">{categoryIcons[category]}</span>
          <span className="category-name">{categoryLabels[category]}</span>
        </div>
        <div className="video-meta">
          <span className="video-duration">⏱️ {duration}</span>
          {fileSize && <span className="video-size">📦 {formatFileSize(fileSize)}</span>}
        </div>
      </div>

      <h4 className="video-title">{title}</h4>

      <div 
        className="video-container"
        onMouseEnter={() => setShowControls(true)}
        onMouseLeave={() => setShowControls(false)}
      >
        <video
          ref={videoRef}
          className="video-player"
          src={videoUrl}
          poster={thumbnail}
          onClick={handlePlayPause}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          controls={showControls}
        />
        {!showControls && !isPlaying && (
          <div className="play-overlay" onClick={handlePlayPause}>
            <button className="play-button">▶️</button>
          </div>
        )}
      </div>

      {description && (
        <div className="video-description">
          <p>{description}</p>
        </div>
      )}

      <div className="video-actions">
        <button className="action-btn">
          <span className="icon">👁️</span>
          <span className="label">詳細表示</span>
        </button>
        <button className="action-btn">
          <span className="icon">🔄</span>
          <span className="label">スロー再生</span>
        </button>
        <button className="action-btn">
          <span className="icon">💾</span>
          <span className="label">保存</span>
        </button>
      </div>
    </div>
  )
}

export default VideoPost