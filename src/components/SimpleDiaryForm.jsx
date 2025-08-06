import React, { useState } from 'react'
import './SimpleDiaryForm.css'

function SimpleDiaryForm({ onSave, onCancel, selectedDate }) {
  const [content, setContent] = useState('')
  
  // 現在の日時を取得
  const now = new Date()
  const dateStr = selectedDate || now.toLocaleDateString('en-US', {
    month: 'numeric',
    day: 'numeric',
    year: 'numeric'
  })
  const dayStr = now.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase()
  const timeStr = now.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  })

  const handleSave = () => {
    if (content.trim()) {
      onSave({
        id: Date.now(),
        date: selectedDate || now.toISOString().split('T')[0],
        content: content.trim(),
        createdAt: now.toISOString()
      })
    }
  }

  return (
    <div className="simple-diary-form">
      <div className="diary-form-header">
        <button className="back-button" onClick={onCancel}>
          <span className="back-arrow">‹</span>
        </button>
        <div className="diary-date-info">
          {dateStr}({dayStr}) {timeStr}
        </div>
        <button 
          className="done-button"
          onClick={handleSave}
          disabled={!content.trim()}
        >
          Done
        </button>
      </div>
      
      <div className="diary-content-area">
        <textarea
          className="diary-textarea"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="今日の練習内容を記録..."
          autoFocus
        />
      </div>
    </div>
  )
}

export default SimpleDiaryForm