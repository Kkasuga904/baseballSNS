import React from 'react'

// ハッシュタグを抽出する関数
export function extractHashtags(text) {
  if (!text) return []
  
  // 日本語・英語のハッシュタグに対応
  const hashtagRegex = /#([a-zA-Z0-9\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF\u3400-\u4DBF_]+)/g
  const matches = text.match(hashtagRegex)
  
  if (!matches) return []
  
  // #を除いて重複を削除
  return [...new Set(matches.map(tag => tag.slice(1)))]
}

// テキスト内のハッシュタグをリンク化する関数
export function renderTextWithHashtags(text, onHashtagClick) {
  if (!text) return null
  
  const hashtagRegex = /#([a-zA-Z0-9\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF\u3400-\u4DBF_]+)/g
  const parts = []
  let lastIndex = 0
  let match
  
  while ((match = hashtagRegex.exec(text)) !== null) {
    // ハッシュタグ前のテキスト
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index))
    }
    
    // ハッシュタグ
    const hashtag = match[1]
    parts.push(
      <span
        key={match.index}
        className="hashtag-link"
        onClick={() => onHashtagClick && onHashtagClick(hashtag)}
        style={{
          color: '#1565c0',
          cursor: 'pointer',
          fontWeight: '500'
        }}
      >
        #{hashtag}
      </span>
    )
    
    lastIndex = match.index + match[0].length
  }
  
  // 最後の部分
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex))
  }
  
  return parts
}

// 検索クエリに基づいて投稿をフィルタリングする関数
export function filterPostsBySearch(posts, searchQuery) {
  if (!searchQuery || !searchQuery.trim()) return posts
  
  const query = searchQuery.toLowerCase().trim()
  
  return posts.filter(post => {
    // 投稿内容を検索
    if (post.content && post.content.toLowerCase().includes(query)) {
      return true
    }
    
    // ハッシュタグを検索（#付きまたは#なしで検索可能）
    const hashtags = extractHashtags(post.content)
    const searchTag = query.startsWith('#') ? query.slice(1) : query
    if (hashtags.some(tag => tag.toLowerCase().includes(searchTag))) {
      return true
    }
    
    // 練習データの検索
    if (post.practiceData) {
      const practiceText = JSON.stringify(post.practiceData).toLowerCase()
      if (practiceText.includes(query)) {
        return true
      }
    }
    
    // 動画データの検索
    if (post.videoData) {
      const videoText = JSON.stringify(post.videoData).toLowerCase()
      if (videoText.includes(query)) {
        return true
      }
    }
    
    // 作者名の検索
    if (post.author && post.author.toLowerCase().includes(query)) {
      return true
    }
    
    return false
  })
}

// 人気のハッシュタグを取得する関数
export function getPopularHashtags(posts, limit = 10) {
  const hashtagCount = {}
  
  posts.forEach(post => {
    if (post.content) {
      const hashtags = extractHashtags(post.content)
      hashtags.forEach(tag => {
        hashtagCount[tag] = (hashtagCount[tag] || 0) + 1
      })
    }
  })
  
  // カウント順にソートして上位を返す
  return Object.entries(hashtagCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([tag, count]) => ({ tag, count }))
}