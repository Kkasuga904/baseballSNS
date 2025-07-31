/**
 * PostItem.jsx - 個別投稿コンポーネント
 * 
 * 各投稿の表示を担当するコンポーネント。
 * 投稿タイプ（通常、練習記録、動画、健康記録）に応じて異なる表示を行う。
 * 
 * 主な機能:
 * - 投稿タイプに応じた表示切り替え
 * - 相対時間表示（○分前、○時間前など）
 * - ハッシュタグのリンク化
 * - ユーザーアイコンとプロフィールへのリンク
 * - いいね、コメント、シェアボタン（UI表示のみ）
 */

import React from 'react'
import PracticeRecord from './PracticeRecord'
import VideoPost from './VideoPost'
import HealthRecord from './HealthRecord'
import { renderTextWithHashtags } from '../utils/hashtagUtils.jsx'
import './PostItem.css'

/**
 * 個別投稿コンポーネント
 * 
 * @param {Object} props
 * @param {Object} props.post - 投稿データオブジェクト
 *   - id: 投稿ID
 *   - type: 投稿タイプ（normal/practice/video/health）
 *   - author: 投稿者名
 *   - userId: ユーザーID
 *   - userIcon: ユーザーアイコン（絵文字）
 *   - timestamp: 投稿時刻
 *   - content: 投稿内容（通常投稿の場合）
 *   - practiceData: 練習記録データ（練習投稿の場合）
 *   - videoData: 動画データ（動画投稿の場合）
 *   - healthData: 健康記録データ（健康投稿の場合）
 *   - likes: いいね数
 *   - comments: コメント数
 * @param {Function} props.onHashtagClick - ハッシュタグクリック時のハンドラー
 * @param {Function} props.onUserClick - ユーザー名/アイコンクリック時のハンドラー
 */
function PostItem({ post, onHashtagClick, onUserClick }) {
  /**
   * タイムスタンプを相対時間表示に変換
   * 例: 5分前、3時間前、2日前など
   * 
   * @param {number} timestamp - Unix タイムスタンプ
   * @returns {string} 相対時間文字列
   */
  const formatDate = (timestamp) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diff = now - date // ミリ秒単位の差分
    
    // 各単位に変換
    const minutes = Math.floor(diff / 60000)     // 1分 = 60,000ミリ秒
    const hours = Math.floor(diff / 3600000)     // 1時間 = 3,600,000ミリ秒
    const days = Math.floor(diff / 86400000)     // 1日 = 86,400,000ミリ秒

    // 時間差に応じて適切な表示を返す
    if (minutes < 1) return 'たった今'
    if (minutes < 60) return `${minutes}分前`
    if (hours < 24) return `${hours}時間前`
    return `${days}日前`
  }

  // 投稿タイプの判定
  const isPracticePost = post.type === 'practice'  // 練習記録投稿
  const isVideoPost = post.type === 'video'        // 動画投稿
  const isHealthPost = post.type === 'health'      // 健康記録投稿

  /**
   * 投稿タイプに応じたアイコンを取得
   * 投稿者名の横に表示されるタイプアイコン
   * 
   * @returns {string|null} アイコン絵文字またはnull
   */
  const getPostTypeIcon = () => {
    if (isPracticePost) return '📝'  // 練習記録
    if (isVideoPost) return '🎬'     // 動画
    if (isHealthPost) return '🏥'    // 健康記録
    return null                      // 通常投稿の場合はアイコンなし
  }

  // コンポーネントのレンダリング
  return (
    // 投稿タイプに応じてCSSクラスを動的に適用
    <div className={`post-item ${isPracticePost ? 'practice-post' : ''} ${isVideoPost ? 'video-post' : ''} ${isHealthPost ? 'health-post' : ''}`}>
      {/* 投稿ヘッダー: ユーザー情報と投稿時刻 */}
      <div className="post-header">
        <div className="post-author-section">
          {/* ユーザーアイコン（クリック可能） */}
          <div 
            className="post-author-icon" 
            onClick={() => onUserClick && onUserClick(post.userId || post.author)}
          >
            <span className="user-icon">{post.userIcon || '👤'}</span>
          </div>
          {/* 投稿者名と投稿タイプアイコン */}
          <span className="post-author">
            {getPostTypeIcon() && <span className="post-type-icon">{getPostTypeIcon()}</span>}
            {post.author}
          </span>
        </div>
        {/* 投稿時刻（相対時間表示） */}
        <span className="post-time">{formatDate(post.timestamp)}</span>
      </div>
      
      {/* 投稿本文: 投稿タイプに応じて異なるコンポーネントを表示 */}
      
      {/* 練習記録投稿の場合 */}
      {isPracticePost && (
        <PracticeRecord practiceData={post.practiceData} />
      )}
      
      {/* 動画投稿の場合 */}
      {isVideoPost && (
        <VideoPost videoData={post.videoData} />
      )}
      
      {/* 健康記録投稿の場合 */}
      {isHealthPost && (
        <HealthRecord healthData={post.healthData} />
      )}
      
      {/* 通常投稿の場合: ハッシュタグをリンク化して表示 */}
      {!isPracticePost && !isVideoPost && !isHealthPost && (
        <div className="post-content">
          {renderTextWithHashtags(post.content, onHashtagClick)}
        </div>
      )}
      
      {/* アクションボタン: いいね、コメント、シェア */}
      {/* 現在はUI表示のみ（機能は未実装） */}
      <div className="post-actions">
        {/* いいねボタン */}
        <button className="action-button">
          <span className="heart">♥</span> {post.likes}
        </button>
        
        {/* コメントボタン */}
        <button className="action-button">
          <span className="comment">💬</span> {post.comments}
        </button>
        
        {/* シェアボタン */}
        <button className="action-button">
          <span className="share">🔗</span> シェア
        </button>
      </div>
    </div>
  )
}

export default PostItem