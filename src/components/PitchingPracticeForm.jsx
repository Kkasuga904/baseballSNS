import React, { useState } from 'react'
import './PitchingPracticeForm.css'

function PitchingPracticeForm({ pitchingData = [], onChange }) {
  const [pitchTypes] = useState([
    { id: 'fastball', name: 'ストレート', color: '#ff4444' },
    { id: 'slider', name: 'スライダー', color: '#4444ff' },
    { id: 'curve', name: 'カーブ', color: '#44ff44' },
    { id: 'fork', name: 'フォーク', color: '#ff44ff' },
    { id: 'changeup', name: 'チェンジアップ', color: '#ffaa44' },
    { id: 'cutter', name: 'カッター', color: '#44ffff' },
    { id: 'sinker', name: 'シンカー', color: '#aa44ff' },
    { id: 'other', name: 'その他', color: '#888888' }
  ])

  const [customPitchName, setCustomPitchName] = useState('')
  const [showAddCustom, setShowAddCustom] = useState(false)

  // 初期データ作成
  const initializePitchingData = () => {
    if (pitchingData.length === 0) {
      return pitchTypes.slice(0, 4).map(type => ({
        pitchType: type.id,
        pitchName: type.name,
        color: type.color,
        strikes: 0,
        balls: 0,
        total: 0
      }))
    }
    return pitchingData
  }

  const [data, setData] = useState(initializePitchingData())

  const handlePitchDataChange = (index, field, value) => {
    const newData = [...data]
    // 先頭の0を削除
    let cleanValue = value.replace(/^0+/, '')
    if (cleanValue === '') cleanValue = '0'
    const numValue = parseInt(cleanValue) || 0
    
    if (field === 'strikes' || field === 'balls') {
      newData[index][field] = numValue
      newData[index].total = newData[index].strikes + newData[index].balls
    }
    
    setData(newData)
    onChange(newData)
  }

  const addPitchType = (pitchType) => {
    const existingIndex = data.findIndex(d => d.pitchType === pitchType.id)
    if (existingIndex === -1) {
      const newPitch = {
        pitchType: pitchType.id,
        pitchName: pitchType.name,
        color: pitchType.color,
        strikes: 0,
        balls: 0,
        total: 0
      }
      const newData = [...data, newPitch]
      setData(newData)
      onChange(newData)
    }
  }

  const addCustomPitch = () => {
    if (customPitchName.trim()) {
      const customId = `custom_${Date.now()}`
      const newPitch = {
        pitchType: customId,
        pitchName: customPitchName,
        color: '#' + Math.floor(Math.random()*16777215).toString(16),
        strikes: 0,
        balls: 0,
        total: 0
      }
      const newData = [...data, newPitch]
      setData(newData)
      onChange(newData)
      setCustomPitchName('')
      setShowAddCustom(false)
    }
  }

  const removePitchType = (index) => {
    const newData = data.filter((_, i) => i !== index)
    setData(newData)
    onChange(newData)
  }

  const calculateStrikeRate = (strikes, total) => {
    if (total === 0) return 0
    return Math.round((strikes / total) * 100)
  }

  const totalStrikes = data.reduce((sum, d) => sum + d.strikes, 0)
  const totalBalls = data.reduce((sum, d) => sum + d.balls, 0)
  const totalPitches = totalStrikes + totalBalls
  const overallStrikeRate = calculateStrikeRate(totalStrikes, totalPitches)

  return (
    <div className="pitching-practice-form">
      <div className="pitch-types-section">
        <h4>球種別記録</h4>
        
        <div className="pitch-records">
          {data.map((pitch, index) => (
            <div key={pitch.pitchType} className="pitch-record-item">
              <div className="pitch-header">
                <span 
                  className="pitch-color-indicator" 
                  style={{ backgroundColor: pitch.color }}
                />
                <span className="pitch-name">{pitch.pitchName}</span>
                <button 
                  type="button"
                  className="remove-pitch-btn"
                  onClick={() => removePitchType(index)}
                >
                  ✕
                </button>
              </div>
              
              <div className="pitch-counts">
                <div className="count-input">
                  <label>ストライク</label>
                  <input
                    type="number"
                    min="0"
                    value={pitch.strikes || ''}
                    onChange={(e) => handlePitchDataChange(index, 'strikes', e.target.value)}
                    placeholder="0"
                  />
                </div>
                
                <div className="count-input">
                  <label>ボール</label>
                  <input
                    type="number"
                    min="0"
                    value={pitch.balls || ''}
                    onChange={(e) => handlePitchDataChange(index, 'balls', e.target.value)}
                    placeholder="0"
                  />
                </div>
                
                <div className="pitch-stats">
                  <span className="total-count">合計: {pitch.total}球</span>
                  <span className="strike-rate">
                    ストライク率: {calculateStrikeRate(pitch.strikes, pitch.total)}%
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="add-pitch-section">
          <h5>球種を追加</h5>
          <div className="available-pitch-types">
            {pitchTypes
              .filter(type => !data.some(d => d.pitchType === type.id))
              .map(type => (
                <button
                  key={type.id}
                  type="button"
                  className="add-pitch-type-btn"
                  onClick={() => addPitchType(type)}
                  style={{ borderColor: type.color }}
                >
                  <span 
                    className="pitch-color-dot" 
                    style={{ backgroundColor: type.color }}
                  />
                  {type.name}
                </button>
              ))}
          </div>
          
          {!showAddCustom ? (
            <button
              type="button"
              className="add-custom-pitch-btn"
              onClick={() => setShowAddCustom(true)}
            >
              + カスタム球種を追加
            </button>
          ) : (
            <div className="custom-pitch-input">
              <input
                type="text"
                value={customPitchName}
                onChange={(e) => setCustomPitchName(e.target.value)}
                placeholder="球種名を入力"
                maxLength="10"
              />
              <button type="button" onClick={addCustomPitch}>追加</button>
              <button type="button" onClick={() => {
                setShowAddCustom(false)
                setCustomPitchName('')
              }}>キャンセル</button>
            </div>
          )}
        </div>
      </div>

      <div className="pitching-summary">
        <h4>投球サマリー</h4>
        <div className="summary-stats">
          <div className="stat-item">
            <span className="stat-label">総球数</span>
            <span className="stat-value">{totalPitches}球</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">ストライク</span>
            <span className="stat-value">{totalStrikes}球</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">ボール</span>
            <span className="stat-value">{totalBalls}球</span>
          </div>
          <div className="stat-item highlight">
            <span className="stat-label">全体ストライク率</span>
            <span className="stat-value">{overallStrikeRate}%</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PitchingPracticeForm