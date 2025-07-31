/**
 * VideoForm.jsx - 動画投稿フォームコンポーネント
 * 
 * 練習動画をアップロードして共有するためのフォーム。
 * ファイルサイズ制限、フォーマット検証、アップロード進捗表示を実装。
 * 
 * 主な機能:
 * - 動画ファイルの選択とプレビュー
 * - ファイルサイズ・フォーマット検証
 * - カテゴリー別分類
 * - アップロード進捗表示
 * - エラーハンドリング
 */

import React, { useState, useRef } from 'react'
import './VideoForm.css'

/**
 * 動画投稿フォームコンポーネント
 * 
 * @param {Object} props
 * @param {Function} props.onSubmit - 動画投稿時のコールバック関数
 */
function VideoForm({ onSubmit }) {
  /**
   * フォームの状態管理
   * - title: 動画タイトル
   * - description: 動画の説明
   * - category: 動画カテゴリー
   * - file: 選択されたファイルオブジェクト
   * - fileUrl: プレビュー用のObject URL
   */
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'form-check',
    file: null,
    fileUrl: null
  })
  
  // アップロード状態管理
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [error, setError] = useState('')
  
  // ファイル入力要素の参照（リセット用）
  const fileInputRef = useRef(null)

  /**
   * 動画カテゴリーの定義
   * 各カテゴリーにラベルとアイコンを設定
   */
  const videoCategories = {
    'form-check': { label: 'フォーム確認', icon: '📹' },
    'practice': { label: '練習風景', icon: '🎥' },
    'game': { label: '試合ハイライト', icon: '🏆' },
    'technique': { label: '技術解説', icon: '📚' }
  }

  // ファイル制限の定数
  const MAX_FILE_SIZE = 100 * 1024 * 1024 // 100MB
  const ALLOWED_FORMATS = ['video/mp4', 'video/webm', 'video/quicktime'] // MP4, WebM, MOV

  /**
   * フォーム入力値の更新ハンドラー
   * 汎用的な入力変更処理
   * 
   * @param {string} field - 更新するフィールド名
   * @param {any} value - 新しい値
   */
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  /**
   * ファイル選択ハンドラー
   * ファイルのフォーマットとサイズを検証
   * 
   * @param {Event} e - ファイル入力イベント
   */
  const handleFileSelect = (e) => {
    const file = e.target.files[0]
    if (!file) return

    // フォーマット検証: MP4, WebM, MOVのみ許可
    if (!ALLOWED_FORMATS.includes(file.type)) {
      setError('対応していない動画形式です。MP4、WebM、MOV形式をアップロードしてください。')
      return
    }

    // ファイルサイズ検証: 100MB以下
    if (file.size > MAX_FILE_SIZE) {
      setError('ファイルサイズが大きすぎます。100MB以下の動画をアップロードしてください。')
      return
    }

    setError('') // エラーをクリア
    
    // プレビュー用のURLを生成
    const fileUrl = URL.createObjectURL(file)
    
    setFormData(prev => ({
      ...prev,
      file,
      fileUrl
    }))
  }

  /**
   * 動画を削除するハンドラー
   * Object URLの解放とフォームのリセットを実行
   */
  const handleRemoveVideo = () => {
    // メモリリークを防ぐためObject URLを解放
    if (formData.fileUrl) {
      URL.revokeObjectURL(formData.fileUrl)
    }
    
    // フォームデータのリセット
    setFormData(prev => ({
      ...prev,
      file: null,
      fileUrl: null
    }))
    
    // ファイル入力要素の値をクリア
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  /**
   * アップロード処理のシミュレーション
   * 実際の本番環境ではサーバーへのアップロード処理を実装
   * 
   * @returns {Promise<Object>} アップロード結果オブジェクト
   */
  const simulateUpload = async () => {
    setIsUploading(true)
    
    // アップロード進捗のシミュレーション
    // 10%ごとに200ms遅延させて進捗を更新
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 200))
      setUploadProgress(i)
    }

    // アップロード完了後のデータを返す
    return {
      url: formData.fileUrl,      // 動画URL
      thumbnail: formData.fileUrl, // サムネイルURL
      duration: '2:30',           // 動画の長さ（ダミー）
      size: formData.file.size    // ファイルサイズ
    }
  }

  /**
   * フォーム送信ハンドラー
   * バリデーション、アップロード、送信処理を実行
   * 
   * @param {Event} e - フォームイベント
   */
  const handleSubmit = async (e) => {
    e.preventDefault()

    // バリデーション: ファイルの存在確認
    if (!formData.file) {
      setError('動画ファイルを選択してください')
      return
    }

    // バリデーション: タイトルの入力確認
    if (!formData.title.trim()) {
      setError('タイトルを入力してください')
      return
    }

    try {
      // アップロード処理を実行
      const uploadedData = await simulateUpload()
      
      // 親コンポーネントにデータを送信
      onSubmit({
        title: formData.title,
        description: formData.description,
        category: formData.category,
        videoUrl: uploadedData.url,
        thumbnail: uploadedData.thumbnail,
        duration: uploadedData.duration,
        fileSize: uploadedData.size
      })

      // 成功後のフォームリセット
      setFormData({
        title: '',
        description: '',
        category: 'form-check',
        file: null,
        fileUrl: null
      })
      setUploadProgress(0)
      
      // ファイル入力要素のクリア
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    } catch (err) {
      // エラーハンドリング
      setError('アップロードに失敗しました。もう一度お試しください。')
    } finally {
      // 最終処理: アップロード状態をリセット
      setIsUploading(false)
    }
  }

  // コンポーネントのレンダリング
  return (
    <form className="video-form" onSubmit={handleSubmit}>
      <h3>🎬 動画投稿</h3>

      {/* 動画ファイル選択セクション */}
      <div className="form-group">
        <label>動画ファイル</label>
        <div className="file-upload-area">
          {/* ファイル未選択時: アップロードエリアを表示 */}
          {!formData.file ? (
            <>
              {/* 非表示のファイル入力要素 */}
              <input
                ref={fileInputRef}
                type="file"
                accept="video/mp4,video/webm,video/quicktime"
                onChange={handleFileSelect}
                className="file-input"
                id="video-file"
              />
              {/* カスタムファイル選択ボタン */}
              <label htmlFor="video-file" className="file-label">
                <span className="upload-icon">📹</span>
                <span className="upload-text">動画を選択</span>
                <span className="upload-hint">MP4, WebM, MOV (最大100MB)</span>
              </label>
            </>
          ) : (
            // ファイル選択済み: 動画プレビューを表示
            <div className="video-preview">
              {/* HTML5動画プレーヤー */}
              <video 
                src={formData.fileUrl} 
                controls 
                className="preview-video"
              />
              {/* 動画削除ボタン */}
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

      {/* タイトル入力セクション */}
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
        {/* 文字数カウンター */}
        <span className="char-count">{formData.title.length} / 50</span>
      </div>

      {/* カテゴリー選択セクション */}
      <div className="form-group">
        <label>カテゴリー</label>
        <div className="category-selector">
          {/* カテゴリーボタンを動的に生成 */}
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

      {/* 説明入力セクション */}
      <div className="form-group">
        <label>説明（任意）</label>
        <textarea
          value={formData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          placeholder="動画の説明やポイントなど"
          rows="3"
          maxLength={200}
        />
        {/* 文字数カウンター */}
        <span className="char-count">{formData.description.length} / 200</span>
      </div>

      {/* エラーメッセージ表示 */}
      {error && (
        <div className="error-message">
          ⚠️ {error}
        </div>
      )}

      {/* アップロード進捗バー */}
      {isUploading && (
        <div className="upload-progress">
          <div className="progress-bar">
            {/* 進捗バーの塗りつぶし部分 */}
            <div 
              className="progress-fill"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
          <span className="progress-text">アップロード中... {uploadProgress}%</span>
        </div>
      )}

      {/* 送信ボタン */}
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