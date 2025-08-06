import React from 'react'
import './MeasurementChart.css'

function MeasurementChart({ data, unit, label, icon }) {
  if (!data || data.length === 0) {
    return (
      <div className="chart-container">
        <div className="no-chart-data">
          <span className="no-data-icon">📊</span>
          <p>データがありません</p>
        </div>
      </div>
    )
  }

  // データの最大値・最小値を計算
  const values = data.map(d => parseFloat(d.value))
  const maxValue = Math.max(...values)
  const minValue = Math.min(...values)
  const range = maxValue - minValue || 1

  // 平均値を計算
  const average = values.reduce((a, b) => a + b, 0) / values.length

  // 最新の値と前回からの変化
  const latestValue = values[values.length - 1]
  const previousValue = values.length > 1 ? values[values.length - 2] : null
  const change = previousValue ? latestValue - previousValue : 0
  const changePercent = previousValue ? ((change / previousValue) * 100).toFixed(1) : 0

  // Y軸のスケールを計算（5段階）
  const yAxisSteps = 5
  const stepSize = range / (yAxisSteps - 1)
  const yAxisValues = Array.from({ length: yAxisSteps }, (_, i) => 
    (minValue + stepSize * i).toFixed(1)
  ).reverse()

  return (
    <div className="chart-container">
      <div className="chart-header">
        <div className="chart-title">
          <span className="chart-icon">{icon}</span>
          <h3>{label}</h3>
        </div>
        <div className="chart-stats">
          <div className="stat-item">
            <span className="stat-label">最新</span>
            <span className="stat-value">{latestValue} {unit}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">変化</span>
            <span className={`stat-value ${change >= 0 ? 'positive' : 'negative'}`}>
              {change >= 0 ? '+' : ''}{change.toFixed(1)} ({changePercent}%)
            </span>
          </div>
          <div className="stat-item">
            <span className="stat-label">平均</span>
            <span className="stat-value">{average.toFixed(1)} {unit}</span>
          </div>
        </div>
      </div>

      <div className="chart-body">
        <div className="chart-grid">
          {/* Y軸ラベル */}
          <div className="y-axis-labels">
            {yAxisValues.map((value, index) => (
              <div key={index} className="y-label">{value}</div>
            ))}
          </div>

          {/* グラフエリア */}
          <div className="chart-area">
            {/* 横線グリッド */}
            <div className="grid-lines">
              {yAxisValues.map((_, index) => (
                <div key={index} className="grid-line horizontal" />
              ))}
            </div>

            {/* データポイントと線 */}
            <svg className="chart-svg">
              {/* 折れ線 */}
              <polyline
                className="chart-line"
                points={data.map((d, i) => {
                  const x = (i / (data.length - 1)) * 100
                  const y = 100 - ((parseFloat(d.value) - minValue) / range * 100)
                  return `${x},${y}`
                }).join(' ')}
                fill="none"
                stroke="#4CAF50"
                strokeWidth="2"
              />

              {/* 平均線 */}
              <line
                className="average-line"
                x1="0"
                y1={100 - ((average - minValue) / range * 100)}
                x2="100"
                y2={100 - ((average - minValue) / range * 100)}
                stroke="#FF9800"
                strokeWidth="1"
                strokeDasharray="5,5"
              />

              {/* データポイント */}
              {data.map((d, i) => {
                const x = (i / (data.length - 1)) * 100
                const y = 100 - ((parseFloat(d.value) - minValue) / range * 100)
                const isLatest = i === data.length - 1
                const isHighest = parseFloat(d.value) === maxValue
                const isLowest = parseFloat(d.value) === minValue

                return (
                  <g key={i}>
                    <circle
                      cx={x}
                      cy={y}
                      r={isLatest ? "6" : "4"}
                      fill={isHighest ? '#4CAF50' : isLowest ? '#f44336' : '#2196F3'}
                      stroke="white"
                      strokeWidth="2"
                      className="chart-point"
                    >
                      <title>{`${d.date}: ${d.value} ${unit}`}</title>
                    </circle>
                    {(isLatest || isHighest || isLowest) && (
                      <text
                        x={x}
                        y={y - 10}
                        textAnchor="middle"
                        className="point-label"
                        fill={isHighest ? '#4CAF50' : isLowest ? '#f44336' : '#2196F3'}
                      >
                        {d.value}
                      </text>
                    )}
                  </g>
                )
              })}
            </svg>
          </div>
        </div>

        {/* X軸（日付）ラベル */}
        <div className="x-axis-labels">
          {data.map((d, i) => {
            // 最初、中間、最後のラベルのみ表示
            if (i === 0 || i === data.length - 1 || i === Math.floor(data.length / 2)) {
              return (
                <div 
                  key={i} 
                  className="x-label"
                  style={{ left: `${(i / (data.length - 1)) * 100}%` }}
                >
                  {d.date.split('-').slice(1).join('/')}
                </div>
              )
            }
            return null
          })}
        </div>
      </div>

      {/* 統計情報 */}
      <div className="chart-footer">
        <div className="chart-summary">
          <div className="summary-item">
            <span className="summary-icon">📈</span>
            <span className="summary-label">最高記録</span>
            <span className="summary-value">{maxValue} {unit}</span>
          </div>
          <div className="summary-item">
            <span className="summary-icon">📉</span>
            <span className="summary-label">最低記録</span>
            <span className="summary-value">{minValue} {unit}</span>
          </div>
          <div className="summary-item">
            <span className="summary-icon">📊</span>
            <span className="summary-label">測定回数</span>
            <span className="summary-value">{data.length}回</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MeasurementChart