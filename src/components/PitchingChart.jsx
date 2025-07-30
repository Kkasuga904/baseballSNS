import React from 'react'
import './PitchingChart.css'

function PitchingChart({ pitchingData }) {
  // 総球数とストライク率の計算
  const totalStrikes = pitchingData.reduce((sum, d) => sum + d.strikes, 0)
  const totalBalls = pitchingData.reduce((sum, d) => sum + d.balls, 0)
  const totalPitches = totalStrikes + totalBalls

  const calculateStrikeRate = (strikes, total) => {
    if (total === 0) return 0
    return Math.round((strikes / total) * 100)
  }

  const overallStrikeRate = calculateStrikeRate(totalStrikes, totalPitches)

  // 円グラフ用のデータ作成
  const createPieChart = (data, centerText, size = 120) => {
    let currentAngle = -90 // 12時の位置から開始

    const paths = data.map((item, index) => {
      const startAngle = currentAngle
      const angle = (item.value / 100) * 360
      const endAngle = startAngle + angle
      currentAngle = endAngle

      // 角度が0の場合はスキップ
      if (angle === 0) return null

      const startRad = (startAngle * Math.PI) / 180
      const endRad = (endAngle * Math.PI) / 180

      const x1 = 50 + 35 * Math.cos(startRad)
      const y1 = 50 + 35 * Math.sin(startRad)
      const x2 = 50 + 35 * Math.cos(endRad)
      const y2 = 50 + 35 * Math.sin(endRad)

      const largeArc = angle > 180 ? 1 : 0

      return (
        <path
          key={index}
          d={`M 50 50 L ${x1} ${y1} A 35 35 0 ${largeArc} 1 ${x2} ${y2} Z`}
          fill={item.color}
          stroke="white"
          strokeWidth="1.5"
        />
      )
    }).filter(Boolean)

    return (
      <div className="pie-chart-container" style={{ width: size, height: size }}>
        <svg viewBox="0 0 100 100" className="pie-chart">
          <circle cx="50" cy="50" r="35" fill="none" stroke="#e0e0e0" strokeWidth="1" />
          {paths}
        </svg>
        <div className="chart-center-text">{centerText}</div>
      </div>
    )
  }

  // 球種別円グラフデータ
  const pitchTypeChartData = pitchingData
    .filter(d => d.total > 0)
    .map(d => ({
      name: d.pitchName,
      value: (d.total / totalPitches) * 100,
      color: d.color,
      count: d.total
    }))

  // ストライク/ボール円グラフデータ
  const strikeBalllChartData = [
    { name: 'ストライク', value: overallStrikeRate, color: '#4caf50' },
    { name: 'ボール', value: 100 - overallStrikeRate, color: '#f44336' }
  ]

  if (totalPitches === 0) {
    return (
      <div className="pitching-chart no-data">
        <p>投球データがありません</p>
      </div>
    )
  }

  return (
    <div className="pitching-chart">
      <div className="chart-section">
        <h4>球種別割合</h4>
        {createPieChart(pitchTypeChartData, `${totalPitches}球`, 140)}
        <div className="chart-legend">
          {pitchTypeChartData.map((item, index) => (
            <div key={index} className="legend-item">
              <span 
                className="legend-color" 
                style={{ backgroundColor: item.color }}
              />
              <span className="legend-label">
                {item.name} ({item.count}球 - {Math.round(item.value)}%)
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="chart-section">
        <h4>全体ストライク率</h4>
        {createPieChart(strikeBalllChartData, `${overallStrikeRate}%`, 140)}
        <div className="chart-stats">
          <div className="stat-row">
            <span className="stat-label">ストライク:</span>
            <span className="stat-value strike">{totalStrikes}球</span>
          </div>
          <div className="stat-row">
            <span className="stat-label">ボール:</span>
            <span className="stat-value ball">{totalBalls}球</span>
          </div>
        </div>
      </div>

      <div className="pitch-type-details">
        <h4>球種別ストライク率</h4>
        <div className="strike-rate-bars">
          {pitchingData
            .filter(d => d.total > 0)
            .map((pitch, index) => {
              const strikeRate = calculateStrikeRate(pitch.strikes, pitch.total)
              return (
                <div key={index} className="strike-rate-item">
                  <div className="pitch-info">
                    <span 
                      className="pitch-color-dot" 
                      style={{ backgroundColor: pitch.color }}
                    />
                    <span className="pitch-name">{pitch.pitchName}</span>
                  </div>
                  <div className="rate-bar-container">
                    <div 
                      className="rate-bar"
                      style={{ 
                        width: `${strikeRate}%`,
                        backgroundColor: pitch.color 
                      }}
                    />
                    <span className="rate-text">{strikeRate}%</span>
                  </div>
                  <div className="pitch-counts">
                    S: {pitch.strikes} / B: {pitch.balls}
                  </div>
                </div>
              )
            })}
        </div>
      </div>
    </div>
  )
}

export default PitchingChart