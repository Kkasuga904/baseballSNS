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
  const changePercent = previousValue ? ((change / Math.abs(previousValue)) * 100).toFixed(1) : 0

  // Y軸のスケールを計算（5段階）
  const yAxisSteps = 5
  const stepSize = range / (yAxisSteps - 1)
  const yAxisValues = Array.from({ length: yAxisSteps }, (_, i) => 
    (minValue + stepSize * i).toFixed(1)
  ).reverse()

  return (
    <div className="chart-container">
      {/* ① 上段：概要パネル */}
      <div className="summary-panel">
        <div className="summary-main">
          <div className="summary-latest">
            <div className="summary-value-large">
              {latestValue}
              <span className="summary-unit">{unit}</span>
            </div>
            <div className="summary-label">最新値</div>
          </div>
        </div>
        
        <div className="summary-stats">
          <div className="summary-stat">
            <div className="summary-stat-label">変化</div>
            <div className={`summary-stat-value ${change === 0 ? '' : change > 0 ? 'positive' : 'negative'}`}>
              {change >= 0 ? '+' : ''}{change.toFixed(1)}{unit}
              <span className="summary-stat-percent">({changePercent}%)</span>
            </div>
          </div>
          
          <div className="summary-stat">
            <div className="summary-stat-label">平均</div>
            <div className="summary-stat-value">{average.toFixed(1)}{unit}</div>
          </div>
          
          <div className="summary-stat">
            <div className="summary-stat-label">最高記録</div>
            <div className="summary-stat-value high">{maxValue}{unit}</div>
          </div>
          
          <div className="summary-stat">
            <div className="summary-stat-label">最低記録</div>
            <div className="summary-stat-value low">{minValue}{unit}</div>
          </div>
        </div>
      </div>

      {/* ② 中段：折れ線グラフ */}
      <div className="chart-section">
        <h4 className="chart-section-title">推移グラフ</h4>
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
                  stroke="#2196F3"
                  strokeWidth="2"
                />

              {/* 平均線（強調） */}
              <line
                className="average-line"
                x1="0"
                y1={100 - ((average - minValue) / range * 100)}
                x2="100"
                y2={100 - ((average - minValue) / range * 100)}
                stroke="#FF9800"
                strokeWidth="2"
                strokeDasharray="5,5"
                opacity="0.8"
              />
              <text
                x="102"
                y={100 - ((average - minValue) / range * 100)}
                className="average-label"
                fill="#FF9800"
                fontSize="10"
                alignmentBaseline="middle"
              >
                {average.toFixed(1)}
              </text>

                {/* データポイント */}
                {data.map((d, i) => {
                  const x = (i / (data.length - 1)) * 100
                  const y = 100 - ((parseFloat(d.value) - minValue) / range * 100)
                  const isLatest = i === data.length - 1

                  return (
                    <g key={i}>
                      <circle
                        cx={x}
                        cy={y}
                        r={isLatest ? "6" : "4"}
                        fill={isLatest ? '#4CAF50' : '#2196F3'}
                        stroke="white"
                        strokeWidth="2"
                        className="chart-point"
                      >
                        <title>{`${d.date}: ${d.value} ${unit}`}</title>
                      </circle>
                      {/* 全ての点に数値を表示 */}
                      <text
                        x={x}
                        y={y - 10}
                        textAnchor="middle"
                        className="point-label"
                        fill={isLatest ? '#4CAF50' : '#666'}
                        fontSize={isLatest ? "12" : "10"}
                        fontWeight={isLatest ? "bold" : "normal"}
                      >
                        {d.value}
                      </text>
                    </g>
                  )
                })}
            </svg>
          </div>
        </div>

          {/* X軸（日付）ラベル */}
          <div className="x-axis-labels">
            {data.map((d, i) => {
              // 最大5つまでのラベルを表示
              const showLabel = data.length <= 5 || 
                                i === 0 || 
                                i === data.length - 1 || 
                                (data.length > 10 && i % Math.floor(data.length / 4) === 0)
              if (!showLabel) return null
              
              return (
                <div 
                  key={i} 
                  className="x-label"
                  style={{ left: `${(i / (data.length - 1)) * 100}%` }}
                >
                  {d.date.split('-').slice(1).join('/')}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* ③ 下段：履歴表 */}
      <div className="history-section">
        <h4 className="history-section-title">測定履歴</h4>
        <div className="history-table-wrapper">
          <table className="history-data-table">
            <thead>
              <tr>
                <th>日付</th>
                <th>{label}</th>
                <th>変化</th>
              </tr>
            </thead>
            <tbody>
              {data.slice().reverse().map((record, index) => {
                const prevIndex = data.length - index - 2
                const prevValue = prevIndex >= 0 ? parseFloat(data[prevIndex].value) : null
                const currentValue = parseFloat(record.value)
                const changeValue = prevValue !== null ? currentValue - prevValue : 0
                const changePercent = prevValue !== null && prevValue !== 0 ? 
                  ((changeValue / Math.abs(prevValue)) * 100).toFixed(1) : '0.0'
                
                return (
                  <tr key={index} className={index === 0 ? 'latest-row' : ''}>
                    <td className="date-column">{record.date}</td>
                    <td className="value-column">{record.value}{unit}</td>
                    <td className={`change-column ${changeValue === 0 ? '' : changeValue > 0 ? 'positive' : 'negative'}`}>
                      {changeValue >= 0 ? '+' : ''}{changeValue.toFixed(1)}{unit}
                      <span className="change-percent">({changePercent}%)</span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default MeasurementChart