import React from 'react'
import PracticeRecord from './PracticeRecord'
import VideoPost from './VideoPost'
import ScheduleItem from './ScheduleItem'
import './DailyRecords.css'

function DailyRecords({ date, practices, videos, schedules, meals = [], supplements = [], sleep = [] }) {
  const hasRecords = practices.length > 0 || videos.length > 0 || schedules.length > 0 || meals.length > 0 || supplements.length > 0 || sleep.length > 0

  if (!hasRecords) {
    return (
      <div className="daily-records empty">
        <p>この日の記録はまだありません</p>
      </div>
    )
  }

  return (
    <div className="daily-records">
      {schedules.length > 0 && (
        <div className="record-section">
          <h4>📅 予定</h4>
          {schedules.map(schedule => (
            <ScheduleItem key={schedule.id} schedule={schedule} />
          ))}
        </div>
      )}

      {practices.length > 0 && (
        <div className="record-section">
          <h4>📝 練習記録</h4>
          {practices.map(practice => (
            <PracticeRecord key={practice.id} practiceData={practice} />
          ))}
        </div>
      )}

      {videos.length > 0 && (
        <div className="record-section">
          <h4>🎬 動画記録</h4>
          {videos.map(video => (
            <VideoPost key={video.id} videoData={video} />
          ))}
        </div>
      )}

      {meals.length > 0 && (
        <div className="record-section">
          <h4>🍽️ 食事記録</h4>
          {meals.map(meal => (
            <div key={meal.id} className="meal-record">
              <div className="meal-header">
                <span className="meal-type">{getMealTypeLabel(meal.mealType)}</span>
                <span className="meal-time">{new Date(meal.timestamp).toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
              {meal.imageUrl && (
                <img src={meal.imageUrl} alt="食事写真" className="meal-image" />
              )}
              <p className="meal-description">{meal.description}</p>
              {(meal.calories || meal.protein || meal.carbs || meal.fat) && (
                <div className="meal-nutrition">
                  {meal.calories && <span>カロリー: {meal.calories}kcal</span>}
                  {meal.protein && <span>P: {meal.protein}g</span>}
                  {meal.carbs && <span>C: {meal.carbs}g</span>}
                  {meal.fat && <span>F: {meal.fat}g</span>}
                </div>
              )}
              {meal.notes && <p className="meal-notes">{meal.notes}</p>}
            </div>
          ))}
        </div>
      )}

      {supplements.length > 0 && (
        <div className="record-section">
          <h4>💊 サプリメント記録</h4>
          {supplements.map(record => (
            <div key={record.id} className="supplement-record">
              <div className="supplement-time">
                {new Date(record.timestamp).toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })}
              </div>
              {record.supplements.map((supp, index) => (
                <div key={index} className="supplement-item">
                  <span className="supplement-name">{supp.name}</span>
                  <span className="supplement-amount">{supp.amount}{supp.unit}</span>
                  <span className="supplement-timing">{getTimingLabel(supp.timing)}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}

      {sleep.length > 0 && (
        <div className="record-section">
          <h4>😴 睡眠記録</h4>
          {sleep.map(record => (
            <div key={record.id} className="sleep-record">
              <div className="sleep-times">
                <span className="sleep-label">就寝</span>
                <span className="sleep-time">{record.bedTime}</span>
                <span className="sleep-arrow">→</span>
                <span className="sleep-label">起床</span>
                <span className="sleep-time">{record.wakeTime}</span>
              </div>
              <div className="sleep-duration">
                睡眠時間: <strong>{record.sleepDuration.toFixed(1)}時間</strong>
              </div>
              <div className="sleep-quality">
                睡眠の質: {getQualityStars(record.quality)} {getQualityLabel(record.quality)}
              </div>
              {record.memo && <p className="sleep-memo">{record.memo}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function getMealTypeLabel(type) {
  const labels = {
    breakfast: '朝食',
    lunch: '昼食',
    dinner: '夕食',
    snack: '間食',
    'pre-training': '練習前',
    'post-training': '練習後',
    'supplement-meal': '補食'
  }
  return labels[type] || type
}

function getTimingLabel(timing) {
  const labels = {
    morning: '朝',
    'pre-training': '練習前',
    'post-training': '練習後',
    evening: '夜',
    'before-bed': '就寝前'
  }
  return labels[timing] || timing
}

function getQualityStars(quality) {
  return '⭐'.repeat(quality)
}

function getQualityLabel(quality) {
  const labels = {
    1: 'とても悪い',
    2: '悪い',
    3: '普通',
    4: '良い',
    5: 'とても良い'
  }
  return labels[quality] || ''
}

export default DailyRecords