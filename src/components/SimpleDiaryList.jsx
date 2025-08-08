import React, { useState, useMemo } from 'react'
import './SimpleDiaryList.css'

function SimpleDiaryList({ diaries = [], onDelete }) {
  const [searchQuery, setSearchQuery] = useState('')
  const searchInputRef = React.useRef(null)
  // 検索フィルタリング
  const filteredDiaries = useMemo(() => {
    if (!searchQuery.trim()) return diaries
    
    const query = searchQuery.toLowerCase()
    return diaries.filter(diary => 
      diary.content.toLowerCase().includes(query)
    )
  }, [diaries, searchQuery])
  
  // 日付でグループ化
  const groupedDiaries = filteredDiaries.reduce((groups, diary) => {
    const date = new Date(diary.date)
    const key = date.toISOString().split('T')[0]
    
    if (!groups[key]) {
      groups[key] = {
        date: date,
        items: []
      }
    }
    
    groups[key].items.push(diary)
    return groups
  }, {})
  
  // 日付順にソート（新しい順）
  const sortedGroups = Object.values(groupedDiaries).sort((a, b) => b.date - a.date)

  return (
    <div className="simple-diary-list">
      {/* 検索ヘッダー */}
      <div className="diary-search-header">
        <input
          ref={searchInputRef}
          type="text"
          className="diary-search-input-header"
          placeholder="Diary"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value)
          }}
          onFocus={(e) => {
            if (!searchQuery) {
              e.target.placeholder = "日記を検索..."
            }
            e.target.select()
          }}
          onBlur={(e) => {
            if (!searchQuery) {
              e.target.placeholder = "Diary"
            }
          }}
        />
        <button 
          className="search-icon-btn"
          type="button"
          onClick={() => {
            if (searchInputRef.current) {
              searchInputRef.current.focus()
            }
          }}
        >
          🔍
        </button>
      </div>
      {sortedGroups.length === 0 ? (
        searchQuery ? (
          <div className="no-diaries">
            <p>「{searchQuery}」に一致する日記が見つかりません</p>
          </div>
        ) : (
        <div className="no-diaries">
          <p className="no-diaries-title">まだ日記がありません</p>
          <p className="no-diaries-hint">✏️ 右下のボタンから新しい日記を書きましょう</p>
        </div>
        )
      ) : (
        sortedGroups.map(group => (
          <div key={group.date.toISOString()} className="diary-date-group">
            <div className="diary-date-header">
              <span className="date-month">{group.date.getMonth() + 1}月</span>
              <span className="date-year">{group.date.getFullYear()}年</span>
            </div>
            
            {group.items.map(diary => {
              const createdAt = new Date(diary.createdAt || diary.date)
              const weekdays = ['日', '月', '火', '水', '木', '金', '土']
              const dayOfWeek = weekdays[createdAt.getDay()]
              const dayOfMonth = createdAt.getDate()
              const time = createdAt.toLocaleTimeString('ja-JP', {
                hour: 'numeric',
                minute: '2-digit',
                hour12: false
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
                        {diary.content && diary.content.includes('<') ? (
                          <div 
                            dangerouslySetInnerHTML={{ __html: diary.content }} 
                            className="diary-rich-content"
                          />
                        ) : (
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