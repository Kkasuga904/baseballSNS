/**
 * hashtagUtils.jsx - ハッシュタグ関連のユーティリティ関数
 * 
 * SNS機能の中核となるハッシュタグ処理を提供します。
 * 日本語・英語の両方のハッシュタグに対応し、
 * 抽出、レンダリング、検索、集計などの機能を実装。
 * 
 * 主な機能:
 * - ハッシュタグの抽出
 * - テキスト内のハッシュタグをクリッカブルリンクに変換
 * - ハッシュタグによる投稿検索
 * - 人気ハッシュタグの集計
 */

import React from 'react'

/**
 * テキストからハッシュタグを抽出する関数
 * 
 * @param {string} text - ハッシュタグを含むテキスト
 * @returns {string[]} 抽出されたハッシュタグの配列（#を除いた文字列）
 * 
 * @example
 * extractHashtags("今日は #野球 の練習！ #甲子園 目指して頑張る")
 * // => ["野球", "甲子園"]
 */
export function extractHashtags(text) {
  // 空文字やnullの場合は空配列を返す
  if (!text) return []
  
  /**
   * ハッシュタグ抽出用の正規表現
   * 対応文字:
   * - a-zA-Z0-9: 英数字
   * - \u3040-\u309F: ひらがな
   * - \u30A0-\u30FF: カタカナ
   * - \u4E00-\u9FAF: 漢字（CJK統合漢字）
   * - \u3400-\u4DBF: 漢字（CJK統合漢字拡張A）
   * - _: アンダースコア
   * 
   * 例: #野球部, #baseball2024, #甲子園への道
   */
  const hashtagRegex = /#([a-zA-Z0-9\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF\u3400-\u4DBF_]+)/g
  const matches = text.match(hashtagRegex)
  
  if (!matches) return []
  
  // #を除去し、重複を削除（Setを使用）
  // 例: ["#野球", "#野球"] => ["野球"]
  return [...new Set(matches.map(tag => tag.slice(1)))]
}

/**
 * テキスト内のハッシュタグをクリッカブルなReact要素に変換する関数
 * 
 * @param {string} text - 変換対象のテキスト
 * @param {Function} onHashtagClick - ハッシュタグクリック時のコールバック関数
 * @returns {React.ReactNode[]} テキストとハッシュタグリンクの配列
 * 
 * @example
 * renderTextWithHashtags(
 *   "今日は #野球 の練習！", 
 *   (tag) => console.log(`${tag}がクリックされました`)
 * )
 * // => ["今日は ", <span>野球</span>, " の練習！"]
 */
export function renderTextWithHashtags(text, onHashtagClick) {
  if (!text) return null
  
  // 上記と同じ正規表現を使用
  const hashtagRegex = /#([a-zA-Z0-9\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF\u3400-\u4DBF_]+)/g
  const parts = [] // 最終的に返すReact要素の配列
  let lastIndex = 0 // 前回のマッチ位置を記録
  let match
  
  // exec()を使って全てのマッチを順番に処理
  // exec()は呼び出すたびに次のマッチを返す
  while ((match = hashtagRegex.exec(text)) !== null) {
    // ハッシュタグ前の通常テキストを追加
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index))
    }
    
    // ハッシュタグをクリッカブルなspan要素として追加
    const hashtag = match[1] // キャプチャグループ（#を除いた部分）
    parts.push(
      <span
        key={match.index} // Reactのkey属性（一意性を保証）
        className="hashtag-link"
        onClick={() => onHashtagClick && onHashtagClick(hashtag)}
        style={{
          color: '#1565c0', // 青色でリンクっぽく
          cursor: 'pointer', // マウスカーソルを指に
          fontWeight: '500' // 少し太字に
        }}
      >
        #{hashtag}
      </span>
    )
    
    // 次の検索開始位置を更新
    lastIndex = match.index + match[0].length
  }
  
  // 最後のハッシュタグ以降のテキストを追加
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex))
  }
  
  return parts
}

/**
 * 検索クエリに基づいて投稿をフィルタリングする関数
 * 複数の検索対象（本文、ハッシュタグ、練習データなど）に対応
 * 
 * @param {Array} posts - フィルタリング対象の投稿配列
 * @param {string} searchQuery - 検索クエリ
 * @returns {Array} フィルタリングされた投稿配列
 * 
 * 検索対象:
 * - 投稿本文
 * - ハッシュタグ（#あり/なし両対応）
 * - 練習データ
 * - 動画データ
 * - 投稿者名
 */
export function filterPostsBySearch(posts, searchQuery) {
  // 検索クエリが空の場合は全件返す
  if (!searchQuery || !searchQuery.trim()) return posts
  
  // 検索を大文字小文字区別なしで行うため小文字に変換
  const query = searchQuery.toLowerCase().trim()
  
  return posts.filter(post => {
    // 1. 投稿内容を検索
    if (post.content && post.content.toLowerCase().includes(query)) {
      return true
    }
    
    // 2. ハッシュタグを検索
    // ユーザーが"#野球"でも"野球"でも検索できるように対応
    const hashtags = extractHashtags(post.content)
    const searchTag = query.startsWith('#') ? query.slice(1) : query
    if (hashtags.some(tag => tag.toLowerCase().includes(searchTag))) {
      return true
    }
    
    // 3. 練習データの検索
    // JSON.stringifyで練習データ全体を文字列化して検索
    // 例: 練習メニュー名、コメントなどが検索対象になる
    if (post.practiceData) {
      const practiceText = JSON.stringify(post.practiceData).toLowerCase()
      if (practiceText.includes(query)) {
        return true
      }
    }
    
    // 4. 動画データの検索
    // タイトル、説明文などが検索対象
    if (post.videoData) {
      const videoText = JSON.stringify(post.videoData).toLowerCase()
      if (videoText.includes(query)) {
        return true
      }
    }
    
    // 5. 作者名の検索
    if (post.author && post.author.toLowerCase().includes(query)) {
      return true
    }
    
    // どれにもマッチしない場合はfalse
    return false
  })
}

/**
 * 投稿全体から人気のハッシュタグを集計する関数
 * トレンド表示やハッシュタグサジェストに使用
 * 
 * @param {Array} posts - 集計対象の投稿配列
 * @param {number} limit - 取得する上位タグ数（デフォルト: 10）
 * @returns {Array<{tag: string, count: number}>} 人気順のハッシュタグ配列
 * 
 * @example
 * getPopularHashtags(posts, 5)
 * // => [
 * //   { tag: "野球", count: 25 },
 * //   { tag: "甲子園", count: 18 },
 * //   { tag: "練習", count: 15 },
 * //   ...
 * // ]
 */
export function getPopularHashtags(posts, limit = 10) {
  // ハッシュタグごとの出現回数を記録するオブジェクト
  const hashtagCount = {}
  
  // 全投稿を走査してハッシュタグをカウント
  posts.forEach(post => {
    if (post.content) {
      const hashtags = extractHashtags(post.content)
      hashtags.forEach(tag => {
        // 既存のカウントに1を加算、初回は0+1=1
        hashtagCount[tag] = (hashtagCount[tag] || 0) + 1
      })
    }
  })
  
  /**
   * カウント順にソートして上位を返す
   * 1. Object.entries()でオブジェクトを配列に変換
   *    例: { "野球": 25, "甲子園": 18 } => [["野球", 25], ["甲子園", 18]]
   * 2. sort()で出現回数の多い順（降順）にソート
   * 3. slice()で上位N件を取得
   * 4. map()で最終的な形式に変換
   */
  return Object.entries(hashtagCount)
    .sort((a, b) => b[1] - a[1]) // b[1] - a[1]で降順ソート
    .slice(0, limit)
    .map(([tag, count]) => ({ tag, count }))
}

/**
 * TODO: 今後追加したい機能
 * - ハッシュタグの自動補完機能
 * - 関連ハッシュタグの提案
 * - ハッシュタグのグループ化（カテゴリー分け）
 * - ハッシュタグ使用履歴の保存
 */