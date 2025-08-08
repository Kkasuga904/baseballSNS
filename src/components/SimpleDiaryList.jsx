import React, { useState, useMemo } from 'react'
import './SimpleDiaryList.css'

/**
 * SimpleDiaryList - 日記一覧表示コンポーネント
 * 
 * @param {Array} diaries - 日記データの配列
 * @param {Function} onDelete - 日記削除時に呼ばれる関数
 */
function SimpleDiaryList({ diaries = [], onDelete }) {
  // 検索キーワードを管理するステート
  const [searchQuery, setSearchQuery] = useState('')
  // 検索入力欄への参照（フォーカス制御用）
  const searchInputRef = React.useRef(null)
  // 検索フィルタリング
  // useMemo: 依存配列の値が変わらない限り再計算しない（パフォーマンス向上）
  const filteredDiaries = useMemo(() => {
    // 検索キーワードが空の場合は全件表示
    if (!searchQuery.trim()) return diaries
    
    // 大文字小文字を区別しない検索
    const query = searchQuery.toLowerCase()
    return diaries.filter(diary => 
      diary.content.toLowerCase().includes(query)
    )
  }, [diaries, searchQuery]) // diariesまたはsearchQueryが変更されたときのみ再計算
  
  // 日付でグループ化
  // reduce: 配列を一つの値（ここではオブジェクト）にまとめる
  const groupedDiaries = filteredDiaries.reduce((groups, diary) => {
    // 日記の日付をDateオブジェクトに変換
    const date = new Date(diary.date)
    // YYYY-MM-DD形式の文字列をキーとして使用
    const key = date.toISOString().split('T')[0]
    
    // その日付のグループがまだない場合は作成
    if (!groups[key]) {
      groups[key] = {
        date: date,
        items: []
      }
    }
    
    // 該当する日付のグループに日記を追加
    groups[key].items.push(diary)
    return groups
  }, {}) // {}は初期値（空のオブジェクト）
  
  // 日付順にソート（新しい順）
  // Object.values: オブジェクトの値を配列に変換
  // sort: 配列を並び替え（b.date - a.date で降順）
  const sortedGroups = Object.values(groupedDiaries).sort((a, b) => b.date - a.date)

  return (
    <div className="simple-diary-list">
      {/* 検索ヘッダー */}
      <div className="diary-search-header">
        <input
          ref={searchInputRef} // ReactからDOM要素を直接操作するための参照
          type="text"
          className="diary-search-input-header"
          placeholder="Diary"
          value={searchQuery} // 入力値をstateと同期（制御コンポーネント）
          onChange={(e) => {
            // 入力値が変更されたらstateを更新
            setSearchQuery(e.target.value)
          }}
          onFocus={(e) => {
            // フォーカス時の処理
            if (!searchQuery) {
              e.target.placeholder = "日記を検索..."
            }
            e.target.select() // テキストを全選択
          }}
          onBlur={(e) => {
            // フォーカスが外れた時の処理
            if (!searchQuery) {
              e.target.placeholder = "Diary"
            }
          }}
        />
        <button 
          className="search-icon-btn"
          type="button"
          onClick={() => {
            // 検索アイコンクリックで入力欄にフォーカス
            if (searchInputRef.current) {
              searchInputRef.current.focus()
            }
          }}
        >
          🔍
        </button>
      </div>
      {/* 日記がない場合の表示 */}
      {sortedGroups.length === 0 ? (
        // 検索中かどうかで表示を切り替え
        searchQuery ? (
          // 検索結果が0件の場合
          <div className="no-diaries">
            <p>「{searchQuery}」に一致する日記が見つかりません</p>
          </div>
        ) : (
          // 日記が一つもない場合
        <div className="no-diaries">
          <p className="no-diaries-title">まだ日記がありません</p>
          <p className="no-diaries-hint">✏️ 右下のボタンから新しい日記を書きましょう</p>
        </div>
        )
      ) : (
        // 日付グループごとに表示
        sortedGroups.map(group => (
          <div key={group.date.toISOString()} className="diary-date-group">
            {/* 日付ヘッダー（例: 8月 2025年） */}
            <div className="diary-date-header">
              <span className="date-month">{group.date.getMonth() + 1}月</span>
              <span className="date-year">{group.date.getFullYear()}年</span>
            </div>
            
            {/* 各日記アイテムの表示 */}
            {group.items.map(diary => {
              // 日記の作成日時を取得
              const createdAt = new Date(diary.createdAt || diary.date)
              // 曜日の配列（getDay()は0=日曜日から6=土曜日を返す）
              const weekdays = ['日', '月', '火', '水', '木', '金', '土']
              const dayOfWeek = weekdays[createdAt.getDay()]
              const dayOfMonth = createdAt.getDate() // 日付を取得
              // 時刻を日本語形式でフォーマット
              const time = createdAt.toLocaleTimeString('ja-JP', {
                hour: 'numeric',
                minute: '2-digit',
                hour12: false // 24時間表示
              })
              
              return (
                <div key={diary.id} className="diary-item">
                  <div className="diary-item-header">
                    <div className="diary-day-info">
                      <div className="day-of-week">{dayOfWeek}曜日</div>
                      <div className="day-of-month">{dayOfMonth}</div>
                    </div>
                    <div className="diary-content-preview">
                      <div className="diary-text">
                        {/* HTMLタグが含まれる場合はHTMLとしてレンダリング */}
                        {diary.content && diary.content.includes('<') ? (
                          <div 
                            // dangerouslySetInnerHTML: HTML文字列をそのままHTMLとして表示
                            // 注意: XSS攻撃のリスクがあるため、信頼できるデータのみ使用
                            dangerouslySetInnerHTML={{ __html: diary.content }} 
                            className="diary-rich-content"
                          />
                        ) : (
                          // プレーンテキストの場合はそのまま表示
                          diary.content
                        )}
                      </div>
                      <div className="diary-time">{time}</div>
                    </div>
                  </div>
                  
                  {/* Delete ボタンを一時的にコメントアウト */}
                  {/* {onDelete && (
                    <button
                      className="diary-delete-btn"
                      onClick={(e) => {
                        e.stopPropagation()
                        onDelete(diary.id)
                      }}
                    >
                      Delete
                    </button>
                  )} */}
                </div>
              )
            })}
          </div>
        ))
      )}
    </div>
  )
}

export default SimpleDiaryList