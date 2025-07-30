import React from 'react'
import './ScheduleItem.css'

function ScheduleItem({ schedule }) {
  const { title, type, startTime, endTime, location, description, reminder } = schedule

  const scheduleTypes = {
    practice: { label: '練習予定', icon: '🏋️', color: '#2e7d46' },
    game: { label: '試合', icon: '⚾', color: '#ff6b6b' },
    meeting: { label: 'ミーティング', icon: '👥', color: '#4c6ef5' },
    event: { label: 'イベント', icon: '🎉', color: '#fab005' },
    other: { label: 'その他', icon: '📌', color: '#868e96' }
  }

  const typeInfo = scheduleTypes[type] || scheduleTypes.other

  return (
    <div className="schedule-item" style={{ borderLeftColor: typeInfo.color }}>
      <div className="schedule-header">
        <div className="schedule-type">
          <span className="type-icon">{typeInfo.icon}</span>
          <span className="type-label">{typeInfo.label}</span>
        </div>
        <div className="schedule-time">
          {startTime}
          {endTime && ` - ${endTime}`}
        </div>
      </div>

      <h5 className="schedule-title">{title}</h5>

      {location && (
        <div className="schedule-location">
          📍 {location}
        </div>
      )}

      {description && (
        <div className="schedule-description">
          {description}
        </div>
      )}

      {reminder && (
        <div className="reminder-badge">
          🔔 リマインダー設定済み
        </div>
      )}
    </div>
  )
}

export default ScheduleItem