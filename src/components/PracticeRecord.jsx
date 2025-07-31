import React from 'react'
import PitchingChart from './PitchingChart'
import GameRecord from './GameRecord'
import './PracticeRecord.css'

function PracticeRecord({ practiceData }) {
  // practiceDataが存在しない場合のデフォルト値
  if (!practiceData) {
    return (
      <div className="practice-record">
        <p>練習データがありません</p>
      </div>
    )
  }

  const { 
    date = '', 
    startTime = '', 
    endTime = '', 
    category = '', 
    trainingPart = '', 
    condition = '', 
    intensity = '', 
    menu = [], 
    maxVelocity = '', 
    note = '', 
    videoData = null, 
    quickEntry = false, 
    gameResultData = null 
  } = practiceData

  const categoryIcons = {
    batting: '🏏',
    pitching: '⚾',
    fielding: '🧤',
    running: '🏃',
    training: '💪',
    stretch: '🧘',
    catch: '🤾',
    game: '🏟️',
    rest: '😴'
  }

  const categoryLabels = {
    batting: '打撃練習',
    pitching: '投球練習',
    fielding: '守備練習',
    running: '走塁練習',
    training: 'トレーニング',
    stretch: 'ストレッチ',
    catch: 'キャッチボール',
    game: '試合',
    rest: '休養日'
  }

  const trainingPartLabels = {
    chest: '胸',
    back: '背中',
    biceps: '二頭筋',
    triceps: '三頭筋',
    legs: '下半身',
    abs: '腹筋',
    shoulders: '肩'
  }

  const calculateDuration = () => {
    if (!startTime || !endTime) {
      return '時間未記録'
    }
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

  if (category === 'rest') {
    return (
      <div className="practice-record rest-record">
        <div className="practice-header">
          <div className="practice-category">
            <span className="category-icon">{categoryIcons[category]}</span>
            <span className="category-name">{categoryLabels[category]}</span>
          </div>
          <div className="practice-meta">
            <span className="practice-date">{date}</span>
          </div>
        </div>

        <div className="rest-message">
          <p>🌿 今日はしっかり休養しました</p>
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

        {note && (
          <div className="practice-note">
            <h4>メモ</h4>
            <p>{note}</p>
          </div>
        )}
      </div>
    )
  }

  // クイック記録の場合
  if (quickEntry) {
    return (
      <div className="practice-record quick-record">
        <div className="practice-header">
          <div className="practice-category">
            <span className="category-icon">{categoryIcons[category]}</span>
            <span className="category-name">{categoryLabels[category]}</span>
            <span className="quick-badge">⚡ クイック記録</span>
          </div>
          <div className="practice-meta">
            <span className="practice-date">{date}</span>
          </div>
        </div>
        <div className="quick-message">
          <p>この日に{categoryLabels[category]}を行いました</p>
        </div>
      </div>
    )
  }

  // 試合記録の場合
  if (category === 'game' && gameResultData) {
    return <GameRecord practiceData={practiceData} />
  }

  return (
    <div className="practice-record">
      <div className="practice-header">
        <div className="practice-category">
          <span className="category-icon">{categoryIcons[category]}</span>
          <span className="category-name">
            {categoryLabels[category]}
            {category === 'training' && trainingPart && (
              <span className="training-part"> ({trainingPartLabels[trainingPart]})</span>
            )}
          </span>
        </div>
        <div className="practice-meta">
          <span className="practice-date">{date}</span>
          <span className="practice-time">
            {startTime} - {endTime} ({calculateDuration()})
          </span>
        </div>
      </div>

      <div className="practice-stats">
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
        
        {intensity && (
          <div className="practice-intensity">
            <span className="intensity-label">強度:</span>
            <div className="intensity-stars">
              {[...Array(5)].map((_, i) => (
                <span key={i} className={`star ${i < intensity ? 'filled' : ''}`}>
                  ★
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {category === 'pitching' && menu[0]?.pitchType ? (
        <>
          <PitchingChart pitchingData={menu} />
          {maxVelocity && (
            <div className="max-velocity-display">
              <span className="velocity-icon">🔥</span>
              <span className="velocity-label">最高球速:</span>
              <span className="velocity-value">{maxVelocity}km/h</span>
            </div>
          )}
        </>
      ) : (
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
      )}

      {videoData && (
        <div className="practice-video">
          <h4>練習動画</h4>
          <video 
            src={videoData.url} 
            controls 
            className="practice-video-player"
          />
        </div>
      )}
      
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