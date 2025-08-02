import React from 'react'
import './DiaryView.css'

function DiaryView({ diary, onClose, onEdit }) {
  const moods = {
    excellent: { emoji: '😄', label: '最高' },
    good: { emoji: '😊', label: '良い' },
    normal: { emoji: '😐', label: '普通' },
    bad: { emoji: '😔', label: '悪い' },
    terrible: { emoji: '😢', label: '最悪' }
  }

  const weathers = {
    sunny: { emoji: '☀️', label: '晴れ' },
    cloudy: { emoji: '☁️', label: '曇り' },
    rainy: { emoji: '🌧️', label: '雨' },
    snowy: { emoji: '❄️', label: '雪' },
    windy: { emoji: '💨', label: '風' }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    })
  }

  const formatTime = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString('ja-JP', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="diary-view-overlay" onClick={onClose}>
      <div className="diary-view-modal" onClick={(e) => e.stopPropagation()}>
        <div className="diary-view-header">
          <h2>{diary.title}</h2>
          <button
            onClick={onClose}
            className="close-button"
            aria-label="閉じる"
          >
            ×
          </button>
        </div>

        <div className="diary-view-meta">
          <div className="diary-view-date">
            <span className="date">{formatDate(diary.date)}</span>
            <span className="time">{formatTime(diary.date)}</span>
          </div>
          <div className="diary-view-indicators">
            <span className="mood" title={moods[diary.mood]?.label}>
              {moods[diary.mood]?.emoji} {moods[diary.mood]?.label}
            </span>
            <span className="weather" title={weathers[diary.weather]?.label}>
              {weathers[diary.weather]?.emoji} {weathers[diary.weather]?.label}
            </span>
          </div>
        </div>

        <div className="diary-view-content">
          {diary.content.split('\n').map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>

        {/* 振り返りセクション */}
        {(diary.todayGoods || diary.todayBads || diary.tomorrowGoals) && (
          <div className="diary-reflection-section">
            <h3 className="reflection-title">
              <span className="reflection-icon">📝</span>
              振り返り
            </h3>
            
            {diary.todayGoods && (
              <div className="reflection-item">
                <h4>
                  <span className="label-icon">✨</span>
                  今日良かったこと・できたこと
                </h4>
                <div className="reflection-content">
                  {diary.todayGoods.split('\n').map((line, index) => (
                    <p key={index}>{line}</p>
                  ))}
                </div>
              </div>
            )}
            
            {diary.todayBads && (
              <div className="reflection-item">
                <h4>
                  <span className="label-icon">💭</span>
                  改善が必要なこと・課題
                </h4>
                <div className="reflection-content">
                  {diary.todayBads.split('\n').map((line, index) => (
                    <p key={index}>{line}</p>
                  ))}
                </div>
              </div>
            )}
            
            {diary.tomorrowGoals && (
              <div className="reflection-item">
                <h4>
                  <span className="label-icon">🎯</span>
                  明日の目標・やることリスト
                </h4>
                <div className="reflection-content">
                  {diary.tomorrowGoals.split('\n').map((line, index) => (
                    <p key={index}>{line}</p>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {diary.tags && diary.tags.length > 0 && (
          <div className="diary-view-tags">
            {diary.tags.map(tag => (
              <span key={tag} className="tag">#{tag}</span>
            ))}
          </div>
        )}

        <div className="diary-view-actions">
          <button
            onClick={() => onEdit(diary)}
            className="edit-button"
          >
            編集する
          </button>
        </div>

        {diary.updatedAt && diary.updatedAt !== diary.date && (
          <div className="diary-view-updated">
            最終更新: {formatDate(diary.updatedAt)} {formatTime(diary.updatedAt)}
          </div>
        )}
      </div>
    </div>
  )
}

export default DiaryView