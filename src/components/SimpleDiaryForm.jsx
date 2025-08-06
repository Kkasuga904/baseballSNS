import React, { useState } from 'react'
import RichTextEditor from './RichTextEditor'
import './SimpleDiaryForm.css'

function SimpleDiaryForm({ onSave, onCancel, selectedDate }) {
  const [content, setContent] = useState('')
  const [useRichText, setUseRichText] = useState(true)
  
  // 選択された日付または現在の日時を取得
  const now = new Date()
  const targetDate = selectedDate ? new Date(selectedDate) : now
  
  // 日付表示用の文字列を生成
  const dateStr = targetDate.toLocaleDateString('en-US', {
    month: 'numeric',
    day: 'numeric',
    year: 'numeric'
  })
  const dayStr = targetDate.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase()
  const timeStr = now.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  })

  const handleSave = () => {
    if (content.trim()) {
      // 選択された日付がある場合は、その日付の現在時刻を設定
      const saveDate = selectedDate ? new Date(selectedDate) : now
      if (selectedDate) {
        // 選択された日付の場合、現在の時刻を設定
        saveDate.setHours(now.getHours())
        saveDate.setMinutes(now.getMinutes())
        saveDate.setSeconds(now.getSeconds())
      }
      
      onSave({
        id: Date.now(),
        date: selectedDate || now.toISOString().split('T')[0],
        content: content.trim(),
        createdAt: saveDate.toISOString()
      })
    }
  }

  return (
    <div className="simple-diary-form">
      <div className="diary-form-header">
        <button className="back-button" onClick={onCancel}>
          <span className="back-arrow">←</span>
          <span className="back-text">戻る</span>
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
        {useRichText ? (
          <RichTextEditor
            content={content}
            onChange={setContent}
            placeholder="今日の練習内容を記録..."
          />
        ) : (
          <textarea
            className="diary-textarea"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="今日の練習内容を記録..."
            autoFocus
          />
        )}
      </div>
    </div>
  )
}

export default SimpleDiaryForm