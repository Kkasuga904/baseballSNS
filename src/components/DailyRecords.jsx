import React, { useState } from 'react'
import PracticeRecord from './PracticeRecord'
import VideoPost from './VideoPost'
import ScheduleItem from './ScheduleItem'
import GameResultForm from './GameResultForm'
import { useAuth } from '../App'
import './DailyRecords.css'

function DailyRecords({ date, practices, videos, schedules, meals = [], supplements = [], sleep = [] }) {
  const { user } = useAuth()
  const [showGameResultForm, setShowGameResultForm] = useState(false)
  const [selectedGame, setSelectedGame] = useState(null)
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
            <div key={schedule.id} className="schedule-with-result">
              <ScheduleItem schedule={schedule} />
              {schedule.type === 'game' && (
                <>
                  {schedule.gameResult ? (
                    <div className="game-result-summary">
                      <div className="result-badge">
                        {schedule.gameResult.teamResult.result === 'win' ? '🎉 勝利' :
                         schedule.gameResult.teamResult.result === 'lose' ? '😔 敗北' : '🤝 引分'}
                        <span className="score">
                          {schedule.gameResult.teamResult.ourScore} - {schedule.gameResult.teamResult.opponentScore}
                        </span>
                      </div>
                      <button 
                        className="edit-result-btn"
                        onClick={() => {
                          setSelectedGame(schedule)
                          setShowGameResultForm(true)
                        }}
                      >
                        結果を編集
                      </button>
                    </div>
                  ) : (
                    <button 
                      className="add-result-btn"
                      onClick={() => {
                        setSelectedGame(schedule)
                        setShowGameResultForm(true)
                      }}
                    >
                      + 試合結果を入力
                    </button>
                  )}
                </>
              )}
            </div>
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
      
      {showGameResultForm && selectedGame && (
        <div className="modal-overlay" onClick={() => setShowGameResultForm(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <GameResultForm
              gameSchedule={selectedGame}
              onSubmit={(resultData) => {
                // 試合結果を保存
                const userKey = user?.email || 'guest'
                const resultsKey = `baseballSNSGameResults_${userKey}`
                const savedResults = localStorage.getItem(resultsKey)
                const allResults = savedResults ? JSON.parse(savedResults) : []
                
                // 既存の結果を更新または新規追加
                const existingIndex = allResults.findIndex(r => r.gameId === resultData.gameId)
                if (existingIndex >= 0) {
                  allResults[existingIndex] = resultData
                } else {
                  allResults.push(resultData)
                }
                
                localStorage.setItem(resultsKey, JSON.stringify(allResults))
                
                // スケジュールにも結果を保存
                selectedGame.gameResult = resultData
                
                setShowGameResultForm(false)
                window.location.reload() // 画面更新
              }}
              onClose={() => setShowGameResultForm(false)}
            />
          </div>
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