import React from 'react'
import './PracticeRecord.css'

function PracticeRecord({ practiceData }) {
  const { date, startTime, endTime, category, condition, menu, note } = practiceData

  const categoryIcons = {
    batting: '🏏',
    pitching: '⚾',
    fielding: '🧤',
    running: '🏃',
    training: '💪'
  }

  const categoryLabels = {
    batting: '打撃練習',
    pitching: '投球練習',
    fielding: '守備練習',
    running: '走塁練習',
    training: 'トレーニング'
  }

  const calculateDuration = () => {
    const start = new Date(`2000-01-01 ${startTime}`)
    const end = new Date(`2000-01-01 ${endTime}`)
    const diff = end - start
    const hours = Math.floor(diff / 3600000)
    const minutes = Math.floor((diff % 3600000) / 60000)
    
    if (hours > 0) {
      return `${hours}時間${minutes > 0 ? minutes + '分' : ''}`
    }
    return `${minutes}分`
  }

  return (
    <div className="practice-record">
      <div className="practice-header">
        <div className="practice-category">
          <span className="category-icon">{categoryIcons[category]}</span>
          <span className="category-name">{categoryLabels[category]}</span>
        </div>
        <div className="practice-meta">
          <span className="practice-date">{date}</span>
          <span className="practice-time">
            {startTime} - {endTime} ({calculateDuration()})
          </span>
        </div>
      </div>

      <div className="practice-condition">
        <span className="condition-label">体調:</span>
        <div className="condition-stars">
          {[...Array(5)].map((_, i) => (
            <span key={i} className={`star ${i < condition ? 'filled' : ''}`}>
              ★
            </span>
          ))}
        </div>
      </div>

      <div className="practice-menu">
        <h4>練習メニュー</h4>
        <ul className="menu-list">
          {menu.map((item, index) => (
            <li key={index} className="menu-item">
              <span className="menu-name">{item.name}</span>
              <span className="menu-count">
                <strong>{item.value}</strong> {item.unit}
              </span>
            </li>
          ))}
        </ul>
        <div className="menu-summary">
          合計: {menu.reduce((sum, item) => sum + parseInt(item.value || 0), 0)} 
          {menu.length === 1 ? ` ${menu[0].unit}` : ' 項目'}
        </div>
      </div>

      {note && (
        <div className="practice-note">
          <h4>メモ</h4>
          <p>{note}</p>
        </div>
      )}
    </div>
  )
}

export default PracticeRecord