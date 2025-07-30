import React, { useState, useEffect } from 'react'
import { useAuth } from '../App'
import './BodyMetricsChart.css'

function BodyMetricsChart() {
  const { user } = useAuth()
  const [metrics, setMetrics] = useState([])
  const [viewMode, setViewMode] = useState('week') // week, month, all
  
  useEffect(() => {
    if (user) {
      const userKey = user.email || 'guest'
      const metricsKey = `baseballSNSBodyMetrics_${userKey}`
      const savedMetrics = localStorage.getItem(metricsKey)
      
      if (savedMetrics) {
        const allMetrics = JSON.parse(savedMetrics)
        setMetrics(allMetrics.sort((a, b) => new Date(a.date) - new Date(b.date)))
      }
    }
  }, [user])
  
  // フィルタリングされたデータを取得
  const getFilteredData = () => {
    if (!metrics.length) return []
    
    const now = new Date()
    let startDate = new Date()
    
    switch (viewMode) {
      case 'week':
        startDate.setDate(now.getDate() - 7)
        break
      case 'month':
        startDate.setMonth(now.getMonth() - 1)
        break
      case 'all':
        return metrics
      default:
        return metrics
    }
    
    return metrics.filter(m => new Date(m.date) >= startDate)
  }
  
  const filteredData = getFilteredData()
  
  if (!filteredData.length) {
    return (
      <div className="body-metrics-chart">
        <div className="chart-header">
          <h3>📊 体重・体脂肪率の推移</h3>
        </div>
        <div className="no-data-message">
          <p>まだデータがありません。</p>
          <small>体重・体脂肪タブから記録を始めましょう。</small>
        </div>
      </div>
    )
  }
  
  // 最大値・最小値を計算（グラフのスケール用）
  const weightMin = Math.min(...filteredData.map(d => d.weight)) - 2
  const weightMax = Math.max(...filteredData.map(d => d.weight)) + 2
  const bodyFatMin = Math.min(...filteredData.map(d => d.bodyFat)) - 2
  const bodyFatMax = Math.max(...filteredData.map(d => d.bodyFat)) + 2
  
  const weightRange = weightMax - weightMin
  const bodyFatRange = bodyFatMax - bodyFatMin
  
  // グラフの高さ
  const chartHeight = 250
  const chartWidth = filteredData.length * 60 + 40 // データポイント間隔
  
  // データポイントをSVGパスに変換
  const createPath = (data, key, min, range) => {
    return data.map((d, i) => {
      const x = i * 60 + 50
      const y = chartHeight - ((d[key] - min) / range * (chartHeight - 50)) - 20
      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`
    }).join(' ')
  }
  
  const weightPath = createPath(filteredData, 'weight', weightMin, weightRange)
  const bodyFatPath = createPath(filteredData, 'bodyFat', bodyFatMin, bodyFatRange)
  
  return (
    <div className="body-metrics-chart">
      <div className="chart-header">
        <h3>📊 体重・体脂肪率の推移</h3>
        <div className="view-mode-selector">
          <button
            className={viewMode === 'week' ? 'active' : ''}
            onClick={() => setViewMode('week')}
          >
            週間
          </button>
          <button
            className={viewMode === 'month' ? 'active' : ''}
            onClick={() => setViewMode('month')}
          >
            月間
          </button>
          <button
            className={viewMode === 'all' ? 'active' : ''}
            onClick={() => setViewMode('all')}
          >
            全期間
          </button>
        </div>
      </div>
      
      <div className="chart-container">
        <div className="chart-scroll-wrapper">
          <svg width={chartWidth} height={chartHeight + 40} className="metrics-svg">
            {/* 背景グリッド */}
            <defs>
              <pattern id="grid" width="60" height="50" patternUnits="userSpaceOnUse">
                <path d="M 60 0 L 0 0 0 50" fill="none" stroke="#f0f0f0" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width={chartWidth} height={chartHeight} fill="url(#grid)" />
            
            {/* 体重の線 */}
            <path
              d={weightPath}
              fill="none"
              stroke="#2196F3"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            
            {/* 体脂肪率の線 */}
            <path
              d={bodyFatPath}
              fill="none"
              stroke="#FF9800"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            
            {/* データポイント */}
            {filteredData.map((d, i) => {
              const x = i * 60 + 50
              const weightY = chartHeight - ((d.weight - weightMin) / weightRange * (chartHeight - 50)) - 20
              const bodyFatY = chartHeight - ((d.bodyFat - bodyFatMin) / bodyFatRange * (chartHeight - 50)) - 20
              
              return (
                <g key={i}>
                  {/* 体重ポイント */}
                  <circle
                    cx={x}
                    cy={weightY}
                    r="5"
                    fill="#2196F3"
                    stroke="white"
                    strokeWidth="2"
                  />
                  <text
                    x={x}
                    y={weightY - 10}
                    textAnchor="middle"
                    fontSize="12"
                    fill="#2196F3"
                    fontWeight="600"
                  >
                    {d.weight}
                  </text>
                  
                  {/* 体脂肪率ポイント */}
                  <circle
                    cx={x}
                    cy={bodyFatY}
                    r="5"
                    fill="#FF9800"
                    stroke="white"
                    strokeWidth="2"
                  />
                  <text
                    x={x}
                    y={bodyFatY + 20}
                    textAnchor="middle"
                    fontSize="12"
                    fill="#FF9800"
                    fontWeight="600"
                  >
                    {d.bodyFat}%
                  </text>
                  
                  {/* 日付 */}
                  <text
                    x={x}
                    y={chartHeight + 20}
                    textAnchor="middle"
                    fontSize="11"
                    fill="#666"
                    transform={`rotate(-45 ${x} ${chartHeight + 20})`}
                  >
                    {new Date(d.date).toLocaleDateString('ja-JP', { 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </text>
                </g>
              )
            })}
          </svg>
        </div>
      </div>
      
      <div className="chart-legend">
        <div className="legend-item">
          <span className="legend-color" style={{ background: '#2196F3' }}></span>
          <span>体重 (kg)</span>
        </div>
        <div className="legend-item">
          <span className="legend-color" style={{ background: '#FF9800' }}></span>
          <span>体脂肪率 (%)</span>
        </div>
      </div>
      
      {/* 統計情報 */}
      <div className="metrics-stats">
        <div className="stat-card">
          <h4>体重</h4>
          <div className="stat-value">
            {filteredData[filteredData.length - 1].weight} kg
          </div>
          <div className="stat-change">
            {(() => {
              const change = filteredData[filteredData.length - 1].weight - filteredData[0].weight
              return (
                <span className={change > 0 ? 'increase' : 'decrease'}>
                  {change > 0 ? '+' : ''}{change.toFixed(1)} kg
                </span>
              )
            })()}
          </div>
        </div>
        <div className="stat-card">
          <h4>体脂肪率</h4>
          <div className="stat-value">
            {filteredData[filteredData.length - 1].bodyFat}%
          </div>
          <div className="stat-change">
            {(() => {
              const change = filteredData[filteredData.length - 1].bodyFat - filteredData[0].bodyFat
              return (
                <span className={change > 0 ? 'increase' : 'decrease'}>
                  {change > 0 ? '+' : ''}{change.toFixed(1)}%
                </span>
              )
            })()}
          </div>
        </div>
      </div>
    </div>
  )
}

export default BodyMetricsChart