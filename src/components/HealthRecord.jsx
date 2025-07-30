import React from 'react'
import './HealthRecord.css'

function HealthRecord({ healthData }) {
  const { date, sleep, meals, supplements, water, note } = healthData

  const calculateTotalCalories = () => {
    return meals.reduce((total, meal) => {
      return total + (parseInt(meal.calories) || 0)
    }, 0)
  }

  const getSleepQualityEmoji = (quality) => {
    switch(quality) {
      case 1: return '😫'
      case 2: return '😣'
      case 3: return '😐'
      case 4: return '😊'
      case 5: return '😴'
      default: return '😐'
    }
  }

  return (
    <div className="health-record">
      <div className="health-header">
        <div className="health-date">
          <span className="date-icon">📅</span>
          <span className="date-text">{date}</span>
        </div>
        <div className="health-type-badge">
          <span className="badge-icon">🏥</span>
          <span className="badge-text">健康記録</span>
        </div>
      </div>

      <div className="health-sections">
        {/* 睡眠セクション */}
        <div className="health-section sleep-section">
          <h4>😴 睡眠</h4>
          <div className="sleep-info">
            <div className="sleep-times">
              <span className="sleep-label">就寝:</span>
              <span className="sleep-value">{sleep.bedTime}</span>
              <span className="sleep-arrow">→</span>
              <span className="sleep-label">起床:</span>
              <span className="sleep-value">{sleep.wakeTime}</span>
            </div>
            {sleep.duration && (
              <div className="sleep-duration">
                <span className="duration-value">{sleep.duration.toFixed(1)}</span>
                <span className="duration-unit">時間</span>
              </div>
            )}
            <div className="sleep-quality">
              <span className="quality-label">睡眠の質:</span>
              <span className="quality-emoji">{getSleepQualityEmoji(sleep.quality)}</span>
            </div>
          </div>
        </div>

        {/* 食事セクション */}
        <div className="health-section meals-section">
          <h4>🍽️ 食事</h4>
          <div className="meals-list">
            {meals.filter(meal => meal.time || meal.content).map((meal, index) => (
              <div key={index} className="meal-item">
                <div className="meal-header">
                  <span className="meal-type">
                    {meal.type === 'breakfast' ? '朝食' : meal.type === 'lunch' ? '昼食' : '夕食'}
                  </span>
                  {meal.time && <span className="meal-time">{meal.time}</span>}
                  {meal.calories && <span className="meal-calories">{meal.calories} kcal</span>}
                </div>
                {meal.content && (
                  <div className="meal-content">{meal.content}</div>
                )}
              </div>
            ))}
            <div className="total-calories">
              <span className="total-label">合計カロリー:</span>
              <span className="total-value">{calculateTotalCalories()} kcal</span>
            </div>
          </div>
        </div>

        {/* サプリメントセクション */}
        {supplements.filter(s => s.name).length > 0 && (
          <div className="health-section supplements-section">
            <h4>💊 サプリメント</h4>
            <div className="supplements-list">
              {supplements.filter(s => s.name).map((supplement, index) => (
                <div key={index} className="supplement-item">
                  <span className="supplement-name">{supplement.name}</span>
                  {supplement.amount && <span className="supplement-amount">{supplement.amount}</span>}
                  {supplement.timing && <span className="supplement-timing">{supplement.timing}</span>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 水分摂取セクション */}
        {water && (
          <div className="health-section water-section">
            <h4>💧 水分摂取</h4>
            <div className="water-info">
              <span className="water-value">{water}</span>
              <span className="water-unit">L</span>
            </div>
          </div>
        )}

        {/* メモセクション */}
        {note && (
          <div className="health-section note-section">
            <h4>📝 メモ</h4>
            <p className="note-text">{note}</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default HealthRecord