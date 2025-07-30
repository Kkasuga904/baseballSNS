import React, { useState, useEffect } from 'react'
import { useAuth } from '../App'
import './BodyMetricsForm.css'

function BodyMetricsForm({ selectedDate, onSubmit }) {
  const { user } = useAuth()
  const [formData, setFormData] = useState({
    weight: '',
    bodyFat: '',
    notes: ''
  })
  
  // 今日の記録があるか確認
  const [todayRecord, setTodayRecord] = useState(null)
  const [showHistory, setShowHistory] = useState(false)
  const [history, setHistory] = useState([])
  
  useEffect(() => {
    if (user && selectedDate) {
      const userKey = user.email || 'guest'
      const metricsKey = `baseballSNSBodyMetrics_${userKey}`
      const savedMetrics = localStorage.getItem(metricsKey)
      
      if (savedMetrics) {
        const allMetrics = JSON.parse(savedMetrics)
        setHistory(allMetrics.sort((a, b) => new Date(b.date) - new Date(a.date)))
        
        // 選択した日付の記録を探す
        const todayData = allMetrics.find(m => m.date === selectedDate)
        if (todayData) {
          setTodayRecord(todayData)
          setFormData({
            weight: todayData.weight,
            bodyFat: todayData.bodyFat,
            notes: todayData.notes || ''
          })
        }
      }
    }
  }, [user, selectedDate])
  
  const handleSubmit = (e) => {
    e.preventDefault()
    
    const newRecord = {
      date: selectedDate,
      weight: parseFloat(formData.weight),
      bodyFat: parseFloat(formData.bodyFat),
      notes: formData.notes,
      timestamp: new Date().toISOString()
    }
    
    // ローカルストレージに保存
    const userKey = user?.email || 'guest'
    const metricsKey = `baseballSNSBodyMetrics_${userKey}`
    const savedMetrics = localStorage.getItem(metricsKey)
    let allMetrics = savedMetrics ? JSON.parse(savedMetrics) : []
    
    // 同じ日付の記録があれば更新、なければ追加
    const existingIndex = allMetrics.findIndex(m => m.date === selectedDate)
    if (existingIndex >= 0) {
      allMetrics[existingIndex] = newRecord
    } else {
      allMetrics.push(newRecord)
    }
    
    localStorage.setItem(metricsKey, JSON.stringify(allMetrics))
    
    // コールバック実行
    if (onSubmit) {
      onSubmit(newRecord)
    }
    
    // フォームリセット
    setFormData({
      weight: '',
      bodyFat: '',
      notes: ''
    })
    setTodayRecord(newRecord)
    setHistory(allMetrics.sort((a, b) => new Date(b.date) - new Date(a.date)))
  }
  
  const calculateChange = (current, previous, metric) => {
    if (!previous || !previous[metric]) return null
    const change = current - previous[metric]
    return {
      value: change,
      percentage: ((change / previous[metric]) * 100).toFixed(1)
    }
  }
  
  // 直近の記録を取得
  const previousRecord = history.find(h => h.date < selectedDate)
  
  return (
    <form className="body-metrics-form" onSubmit={handleSubmit}>
      <div className="metrics-header">
        <h4>💪 体重・体脂肪率記録</h4>
        {todayRecord && (
          <span className="record-status">✅ 本日記録済み</span>
        )}
      </div>
      
      <div className="metrics-inputs">
        <div className="metric-input-group">
          <label>
            <span className="metric-icon">⚖️</span>
            体重 (kg)
          </label>
          <input
            type="number"
            step="0.1"
            min="30"
            max="200"
            value={formData.weight}
            onChange={(e) => setFormData({...formData, weight: e.target.value})}
            placeholder="65.5"
            required
          />
          {previousRecord && formData.weight && (
            <div className="metric-change">
              {(() => {
                const change = calculateChange(parseFloat(formData.weight), previousRecord, 'weight')
                if (!change) return null
                return (
                  <span className={`change-indicator ${change.value > 0 ? 'increase' : 'decrease'}`}>
                    {change.value > 0 ? '+' : ''}{change.value.toFixed(1)}kg ({change.percentage}%)
                  </span>
                )
              })()}
            </div>
          )}
        </div>
        
        <div className="metric-input-group">
          <label>
            <span className="metric-icon">📊</span>
            体脂肪率 (%)
          </label>
          <input
            type="number"
            step="0.1"
            min="3"
            max="50"
            value={formData.bodyFat}
            onChange={(e) => setFormData({...formData, bodyFat: e.target.value})}
            placeholder="12.5"
            required
          />
          {previousRecord && formData.bodyFat && (
            <div className="metric-change">
              {(() => {
                const change = calculateChange(parseFloat(formData.bodyFat), previousRecord, 'bodyFat')
                if (!change) return null
                return (
                  <span className={`change-indicator ${change.value > 0 ? 'increase' : 'decrease'}`}>
                    {change.value > 0 ? '+' : ''}{change.value.toFixed(1)}% ({change.percentage}%)
                  </span>
                )
              })()}
            </div>
          )}
        </div>
      </div>
      
      <div className="form-group">
        <label>メモ（任意）</label>
        <textarea
          value={formData.notes}
          onChange={(e) => setFormData({...formData, notes: e.target.value})}
          placeholder="体調や食事の状況など"
          rows="2"
        />
      </div>
      
      <button type="submit" className="submit-button">
        {todayRecord ? '更新する' : '記録する'}
      </button>
      
      <div className="history-section">
        <button
          type="button"
          className="history-toggle"
          onClick={() => setShowHistory(!showHistory)}
        >
          📈 履歴を見る {showHistory ? '▲' : '▼'}
        </button>
        
        {showHistory && (
          <div className="history-list">
            {history.length > 0 ? (
              history.slice(0, 7).map((record, idx) => (
                <div key={idx} className="history-item">
                  <div className="history-date">
                    {new Date(record.date).toLocaleDateString('ja-JP', {
                      month: 'short',
                      day: 'numeric',
                      weekday: 'short'
                    })}
                  </div>
                  <div className="history-metrics">
                    <span>⚖️ {record.weight}kg</span>
                    <span>📊 {record.bodyFat}%</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="no-history">まだ記録がありません</p>
            )}
          </div>
        )}
      </div>
    </form>
  )
}

export default BodyMetricsForm