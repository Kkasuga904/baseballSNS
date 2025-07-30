import React, { useState } from 'react'
import './SleepForm.css'

function SleepForm({ onSubmit }) {
  const [formData, setFormData] = useState({
    bedTime: '',
    wakeTime: '',
    quality: 3,
    memo: ''
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // 睡眠時間を計算
    const bedDateTime = new Date(`2000-01-01T${formData.bedTime}`)
    const wakeDateTime = new Date(`2000-01-01T${formData.wakeTime}`)
    
    // 起床時間が就寝時間より早い場合は翌日として計算
    if (wakeDateTime < bedDateTime) {
      wakeDateTime.setDate(wakeDateTime.getDate() + 1)
    }
    
    const sleepDuration = (wakeDateTime - bedDateTime) / (1000 * 60 * 60) // 時間単位
    
    onSubmit({
      ...formData,
      sleepDuration,
      timestamp: new Date().toISOString()
    })
    
    // フォームをリセット
    setFormData({
      bedTime: '',
      wakeTime: '',
      quality: 3,
      memo: ''
    })
  }

  const qualityLabels = {
    1: '😴 とても悪い',
    2: '😪 悪い',
    3: '😐 普通',
    4: '😊 良い',
    5: '😄 とても良い'
  }

  return (
    <div className="sleep-form">
      <form onSubmit={handleSubmit}>
        <div className="form-description">
          <p>睡眠は体の回復とパフォーマンス向上に重要です。毎日の睡眠を記録しましょう。</p>
        </div>
        
        <div className="time-inputs">
          <div className="form-field">
            <label htmlFor="bedTime">
              <span className="field-icon">🛏️</span>
              就寝時間
            </label>
            <input
              id="bedTime"
              type="time"
              value={formData.bedTime}
              onChange={(e) => setFormData({...formData, bedTime: e.target.value})}
              required
            />
          </div>
          
          <div className="form-field">
            <label htmlFor="wakeTime">
              <span className="field-icon">⏰</span>
              起床時間
            </label>
            <input
              id="wakeTime"
              type="time"
              value={formData.wakeTime}
              onChange={(e) => setFormData({...formData, wakeTime: e.target.value})}
              required
            />
          </div>
        </div>
        
        <div className="form-field">
          <label>
            <span className="field-icon">⭐</span>
            睡眠の質
          </label>
          <div className="quality-selector">
            {[1, 2, 3, 4, 5].map(value => (
              <button
                key={value}
                type="button"
                className={`quality-btn ${formData.quality === value ? 'active' : ''}`}
                onClick={() => setFormData({...formData, quality: value})}
              >
                {value}
              </button>
            ))}
          </div>
          <div className="quality-label">{qualityLabels[formData.quality]}</div>
        </div>
        
        <div className="form-field">
          <label htmlFor="memo">
            <span className="field-icon">📝</span>
            メモ（任意）
          </label>
          <textarea
            id="memo"
            value={formData.memo}
            onChange={(e) => setFormData({...formData, memo: e.target.value})}
            placeholder="睡眠の状態や体調についてメモを残す"
            rows="3"
          />
        </div>
        
        <div className="sleep-tips">
          <h4>💤 良い睡眠のためのヒント</h4>
          <ul>
            <li>毎日同じ時間に寝起きする</li>
            <li>寝る前のスマホ使用を控える</li>
            <li>適度な運動を心がける</li>
            <li>7-9時間の睡眠を確保する</li>
          </ul>
        </div>
        
        <button type="submit" className="submit-button">
          睡眠を記録
        </button>
      </form>
    </div>
  )
}

export default SleepForm