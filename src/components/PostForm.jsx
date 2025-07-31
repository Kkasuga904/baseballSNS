/**
 * PostForm.jsx - 通常投稿フォームコンポーネント
 * 
 * テキストベースの通常投稿を作成するためのフォーム。
 * 文字数制限（280文字）とリアルタイムカウンターを実装。
 * 
 * 主な機能:
 * - テキスト入力エリア
 * - 文字数カウンター（280文字制限）
 * - 空文字投稿の防止
 * - 投稿後の自動クリア
 */

import React, { useState } from 'react'
import './PostForm.css'

/**
 * 通常投稿フォームコンポーネント
 * 
 * @param {Object} props
 * @param {Function} props.onSubmit - 投稿送信時のコールバック関数（contentを引数に受け取る）
 */
function PostForm({ onSubmit }) {
  // 投稿内容の状態管理
  const [content, setContent] = useState('')

  /**
   * フォーム送信ハンドラー
   * 
   * @param {Event} e - フォームイベント
   */
  const handleSubmit = (e) => {
    e.preventDefault() // ページリロードを防ぐ
    
    // 空文字（スペースのみ含む）のチェック
    if (content.trim()) {
      onSubmit(content)
      setContent('') // 投稿後は入力欄をクリア
    }
  }

  // コンポーネントのレンダリング
  return (
    <form className="post-form" onSubmit={handleSubmit}>
      <h3>新しい投稿</h3>
      
      {/* テキストエリア: 投稿内容の入力 */}
      <textarea
        className="post-textarea"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="今日の試合はどうでしたか？感想を共有しよう！"
        rows="4"
      />
      
      <div className="form-actions">
        {/* 文字数カウンター: 現在の文字数/最大文字数 */}
        <span className="char-count">{content.length} / 280</span>
        
        {/* 投稿ボタン: 空文字または280文字超過時は無効化 */}
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