import React, { useState } from 'react'
import './DiaryList.css'

function DiaryList({ diaries, onEdit, onDelete, onView }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterMood, setFilterMood] = useState('')
  const [sortBy, setSortBy] = useState('date-desc')

  const moods = {
    excellent: { emoji: '😄', label: '最高' },
    good: { emoji: '😊', label: '良い' },
    normal: { emoji: '😐', label: '普通' },
    bad: { emoji: '😔', label: '悪い' },
    terrible: { emoji: '😢', label: '最悪' }
  }

  const weathers = {
    sunny: '☀️',
    cloudy: '☁️',
    rainy: '🌧️',
    snowy: '❄️',
    windy: '💨'
  }

  // フィルタリングと検索
  const filteredDiaries = diaries.filter(diary => {
    const matchesSearch = diary.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         diary.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         diary.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesMood = !filterMood || diary.mood === filterMood
    
    return matchesSearch && matchesMood
  })

  // ソート
  const sortedDiaries = [...filteredDiaries].sort((a, b) => {
    switch (sortBy) {
      case 'date-desc':
        return new Date(b.date) - new Date(a.date)
      case 'date-asc':
        return new Date(a.date) - new Date(b.date)
      case 'title':
        return a.title.localeCompare(b.title)
      default:
        return 0
    }
  })

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)
    
    if (date.toDateString() === today.toDateString()) {
      return '今日'
    } else if (date.toDateString() === yesterday.toDateString()) {
      return '昨日'
    } else {
      return date.toLocaleDateString('ja-JP', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'short'
      })
    }
  }

  const truncateContent = (content, maxLength = 100) => {
    if (content.length <= maxLength) return content
    return content.substring(0, maxLength) + '...'
  }

  return (
    <div className="diary-list">
      <div className="diary-filters">
        <div className="search-wrapper">
          <input
            type="text"
            placeholder="日記を検索..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <span className="search-icon">🔍</span>
        </div>

        <div className="filter-controls">
          <select
            value={filterMood}
            onChange={(e) => setFilterMood(e.target.value)}
            className="mood-filter"
          >
            <option value="">すべての気分</option>
            {Object.entries(moods).map(([value, { emoji, label }]) => (
              <option key={value} value={value}>{emoji} {label}</option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="sort-select"
          >
            <option value="date-desc">新しい順</option>
            <option value="date-asc">古い順</option>
            <option value="title">タイトル順</option>
          </select>
        </div>
      </div>

      {sortedDiaries.length === 0 ? (
        <div className="no-diaries">
          <p>📝 まだ日記がありません</p>
          <p>新しい日記を書いてみましょう！</p>
        </div>
      ) : (
        <div className="diary-grid">
          {sortedDiaries.map(diary => (
            <div key={diary.id} className="diary-card">
              <div className="diary-header">
                <div className="diary-date">{formatDate(diary.date)}</div>
                <div className="diary-indicators">
                  <span className="mood-indicator" title={moods[diary.mood]?.label}>
                    {moods[diary.mood]?.emoji}
                  </span>
                  <span className="weather-indicator">
                    {weathers[diary.weather]}
                  </span>
                </div>
              </div>

              <h3 className="diary-title" onClick={() => onView(diary)}>
                {diary.title}
              </h3>

              <p className="diary-preview">
                {truncateContent(diary.content)}
              </p>

              {diary.tags && diary.tags.length > 0 && (
                <div className="diary-tags">
                  {diary.tags.map(tag => (
                    <span key={tag} className="diary-tag">#{tag}</span>
                  ))}
                </div>
              )}

              <div className="diary-actions">
                <button
                  onClick={() => onView(diary)}
                  className="view-button"
                  title="詳細を見る"
                >
                  📖
                </button>
                <button
                  onClick={() => onEdit(diary)}
                  className="edit-button"
                  title="編集"
                >
                  ✏️
                </button>
                <button
                  onClick={() => {
                    if (window.confirm('この日記を削除しますか？')) {
                      onDelete(diary.id)
                    }
                  }}
                  className="delete-button"
                  title="削除"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default DiaryList