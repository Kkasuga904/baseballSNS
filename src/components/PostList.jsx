/**
 * PostList.jsx - 投稿一覧コンポーネント
 * 
 * タイムラインやマイページで投稿を一覧表示するコンポーネント。
 * 個々の投稿の表示はPostItemコンポーネントに委譲。
 * 
 * 主な機能:
 * - 投稿の一覧表示
 * - 投稿がない場合のメッセージ表示
 * - ハッシュタグクリックイベントの伝播
 * - ユーザークリックイベントの伝播
 */

import React from 'react'
import PostItem from './PostItem'
import './PostList.css'

/**
 * 投稿一覧コンポーネント
 * 
 * @param {Object} props
 * @param {Array} props.posts - 表示する投稿の配列
 * @param {Function} props.onHashtagClick - ハッシュタグクリック時のハンドラー
 * @param {Function} props.onUserClick - ユーザー名クリック時のハンドラー
 */
function PostList({ posts, onHashtagClick, onUserClick }) {
  // デバッグ: 重複IDを確認
  const postIds = posts.map(p => p.id);
  const duplicateIds = postIds.filter((id, index) => postIds.indexOf(id) !== index);
  if (duplicateIds.length > 0) {
    console.warn('重複している投稿ID:', duplicateIds);
    console.warn('全ての投稿ID:', postIds);
  }

  return (
    <div className="post-list">
      <h2>最新の投稿</h2>
      {/* 投稿が0件の場合はメッセージを表示 */}
      {posts.length === 0 ? (
        <p className="no-posts">まだ投稿がありません</p>
      ) : (
        // 投稿をmap関数で展開
        // keyプロパティにはpost.idとインデックスの組み合わせを使用（重複対策）
        posts.map((post, index) => (
          <PostItem 
            key={`${post.id}-${index}`} 
            post={post} 
            onHashtagClick={onHashtagClick}
            onUserClick={onUserClick}
          />
        ))
      )}
    </div>
  )
}

export default PostList