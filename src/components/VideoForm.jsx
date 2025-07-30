import React, { useState, useRef } from 'react'
import './VideoForm.css'

function VideoForm({ onSubmit }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'form-check',
    file: null,
    fileUrl: null
  })
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [error, setError] = useState('')
  const fileInputRef = useRef(null)

  const videoCategories = {
    'form-check': { label: 'フォーム確認', icon: '📹' },
    'practice': { label: '練習風景', icon: '🎥' },
    'game': { label: '試合ハイライト', icon: '🏆' },
    'technique': { label: '技術解説', icon: '📚' }
  }

  const MAX_FILE_SIZE = 100 * 1024 * 1024 // 100MB
  const ALLOWED_FORMATS = ['video/mp4', 'video/webm', 'video/quicktime']

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleFileSelect = (e) => {
    const file = e.target.files[0]
    if (!file) return

    // フォーマット検証
    if (!ALLOWED_FORMATS.includes(file.type)) {
      setError('対応していない動画形式です。MP4、WebM、MOV形式をアップロードしてください。')
      return
    }

    // ファイルサイズ検証
    if (file.size > MAX_FILE_SIZE) {
      setError('ファイルサイズが大きすぎます。100MB以下の動画をアップロードしてください。')
      return
    }

    setError('')
    const fileUrl = URL.createObjectURL(file)
    setFormData(prev => ({
      ...prev,
      file,
      fileUrl
    }))
  }

  const handleRemoveVideo = () => {
    if (formData.fileUrl) {
      URL.revokeObjectURL(formData.fileUrl)
    }
    setFormData(prev => ({
      ...prev,
      file: null,
      fileUrl: null
    }))
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const simulateUpload = async () => {
    setIsUploading(true)
    
    // アップロード進捗のシミュレーション
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 200))
      setUploadProgress(i)
    }

    return {
      url: formData.fileUrl,
      thumbnail: formData.fileUrl,
      duration: '2:30',
      size: formData.file.size
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.file) {
      setError('動画ファイルを選択してください')
      return
    }

    if (!formData.title.trim()) {
      setError('タイトルを入力してください')
      return
    }

    try {
      const uploadedData = await simulateUpload()
      
      onSubmit({
        title: formData.title,
        description: formData.description,
        category: formData.category,
        videoUrl: uploadedData.url,
        thumbnail: uploadedData.thumbnail,
        duration: uploadedData.duration,
        fileSize: uploadedData.size
      })

      // フォームをリセット
      setFormData({
        title: '',
        description: '',
        category: 'form-check',
        file: null,
        fileUrl: null
      })
      setUploadProgress(0)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    } catch (err) {
      setError('アップロードに失敗しました。もう一度お試しください。')
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <form className="video-form" onSubmit={handleSubmit}>
      <h3>🎬 動画投稿</h3>

      <div className="form-group">
        <label>動画ファイル</label>
        <div className="file-upload-area">
          {!formData.file ? (
            <>
              <input
                ref={fileInputRef}
                type="file"
                accept="video/mp4,video/webm,video/quicktime"
                onChange={handleFileSelect}
                className="file-input"
                id="video-file"
              />
              <label htmlFor="video-file" className="file-label">
                <span className="upload-icon">📹</span>
                <span className="upload-text">動画を選択</span>
                <span className="upload-hint">MP4, WebM, MOV (最大100MB)</span>
              </label>
            </>
          ) : (
            <div className="video-preview">
              <video 
                src={formData.fileUrl} 
                controls 
                className="preview-video"
              />
              <button
                type="button"
                onClick={handleRemoveVideo}
                className="remove-video-btn"
              >
                ✕ 動画を削除
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="form-group">
        <label>タイトル</label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => handleInputChange('title', e.target.value)}
          placeholder="例: スイングフォームの確認"
          maxLength={50}
          required
        />
        <span className="char-count">{formData.title.length} / 50</span>
      </div>

      <div className="form-group">
        <label>カテゴリー</label>
        <div className="category-selector">
          {Object.entries(videoCategories).map(([key, { label, icon }]) => (
            <button
              key={key}
              type="button"
              className={`category-button ${formData.category === key ? 'active' : ''}`}
              onClick={() => handleInputChange('category', key)}
            >
              <span className="category-icon">{icon}</span>
              <span className="category-label">{label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="form-group">
        <label>説明（任意）</label>
        <textarea
          value={formData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          placeholder="動画の説明やポイントなど"
          rows="3"
          maxLength={200}
        />
        <span className="char-count">{formData.description.length} / 200</span>
      </div>

      {error && (
        <div className="error-message">
          ⚠️ {error}
        </div>
      )}

      {isUploading && (
        <div className="upload-progress">
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
          <span className="progress-text">アップロード中... {uploadProgress}%</span>
        </div>
      )}

      <button 
        type="submit" 
        className="submit-button"
        disabled={isUploading || !formData.file}
      >
        {isUploading ? 'アップロード中...' : '動画を投稿'}
      </button>
    </form>
  )
}

export default VideoForm