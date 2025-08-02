import React from 'react'
import './GameRecordList.css'

function GameRecordList({ records, onEdit, onDelete }) {
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric'
    })
  }

  const getResultEmoji = (result) => {
    const emojis = {
      win: '🏆',
      lose: '😔',
      draw: '🤝'
    }
    return emojis[result] || ''
  }

  const getGameTypeLabel = (type) => {
    const labels = {
      practice: '練習試合',
      official: '公式戦',
      tournament: '大会'
    }
    return labels[type] || type
  }

  if (records.length === 0) {
    return (
      <div className="empty-records">
        <p>まだ試合記録がありません</p>
        <p className="empty-hint">試合後に記録を追加しましょう！</p>
      </div>
    )
  }

  return (
    <div className="game-record-list">
      {records.map((record) => (
        <div key={record.id} className="game-record-item">
          <div className="record-header">
            <div className="record-date-type">
              <span className="record-date">{formatDate(record.date)}</span>
              <span className="record-type">{getGameTypeLabel(record.gameType)}</span>
            </div>
            <div className="record-result">
              <span className="result-emoji">{getResultEmoji(record.result)}</span>
              <span className="score">
                {record.score.us} - {record.score.them}
              </span>
            </div>
          </div>
          
          <div className="record-opponent">
            vs {record.opponent}
          </div>
          
          <div className="record-stats">
            <div className="stat-item">
              <span className="stat-label">打撃</span>
              <span className="stat-value">
                {record.stats?.hits || 0} / {record.stats?.atBats || 0}
              </span>
            </div>
            <div className="stat-item">
              <span className="stat-label">打率</span>
              <span className="stat-value">{record.stats?.average || '.000'}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">打点</span>
              <span className="stat-value">{record.stats?.rbis || 0}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">守備</span>
              <span className="stat-value">{record.position || '-'}</span>
            </div>
          </div>
          
          {record.reflection && (
            <div className="record-reflection">
              <p>{record.reflection.substring(0, 100)}...</p>
            </div>
          )}
          
          <div className="record-actions">
            <button className="edit-btn" onClick={() => onEdit(record)}>
              編集
            </button>
            <button className="delete-btn" onClick={() => onDelete(record.id)}>
              削除
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default GameRecordList