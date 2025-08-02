import React, { useState, useMemo } from 'react'
import './PerformanceChart.css'

function PerformanceChart({ games = [], practices = [] }) {
  const [chartType, setChartType] = useState('batting') // batting, practice, fielding
  const [dateRange, setDateRange] = useState('month') // week, month, season
  
  // 日付範囲に基づいてデータをフィルタリング
  const filteredData = useMemo(() => {
    const now = new Date()
    const startDate = new Date()
    
    switch (dateRange) {
      case 'week':
        startDate.setDate(now.getDate() - 7)
        break
      case 'month':
        startDate.setMonth(now.getMonth() - 1)
        break
      case 'season':
        startDate.setMonth(now.getMonth() - 6)
        break
    }
    
    return {
      games: games.filter(g => new Date(g.date) >= startDate),
      practices: practices.filter(p => new Date(p.date) >= startDate)
    }
  }, [games, practices, dateRange])
  
  // 打撃成績の計算
  const battingStats = useMemo(() => {
    return filteredData.games.map(game => {
      const stats = game.stats || {}
      return {
        date: game.date,
        average: parseFloat(stats.average || '0'),
        hits: stats.hits || 0,
        atBats: stats.atBats || 0,
        rbis: stats.rbis || 0,
        opponent: game.opponent
      }
    }).sort((a, b) => new Date(a.date) - new Date(b.date))
  }, [filteredData.games])
  
  // 練習量の集計
  const practiceStats = useMemo(() => {
    const dailyStats = {}
    
    filteredData.practices.forEach(practice => {
      const date = practice.date
      if (!dailyStats[date]) {
        dailyStats[date] = {
          date,
          totalMinutes: 0,
          batting: 0,
          pitching: 0,
          fielding: 0,
          running: 0
        }
      }
      
      const duration = practice.duration || 0
      dailyStats[date].totalMinutes += duration
      
      // カテゴリ別の練習時間（簡易的に均等配分）
      const category = practice.category
      if (category) {
        dailyStats[date][category] = (dailyStats[date][category] || 0) + duration
      }
    })
    
    return Object.values(dailyStats).sort((a, b) => new Date(a.date) - new Date(b.date))
  }, [filteredData.practices])
  
  // 守備成績の計算
  const fieldingStats = useMemo(() => {
    return filteredData.games.map(game => {
      const fielding = game.fieldingRecord || {}
      const totalChances = fielding.putouts + fielding.assists + fielding.errors
      const fieldingPct = totalChances > 0 
        ? ((fielding.putouts + fielding.assists) / totalChances) 
        : 1.0
      
      return {
        date: game.date,
        fieldingPct: fieldingPct,
        putouts: fielding.putouts || 0,
        assists: fielding.assists || 0,
        errors: fielding.errors || 0,
        opponent: game.opponent
      }
    }).sort((a, b) => new Date(a.date) - new Date(b.date))
  }, [filteredData.games])
  
  // 最大値の計算（グラフのスケール用）
  const maxValues = useMemo(() => {
    if (chartType === 'batting') {
      return {
        hits: Math.max(...battingStats.map(s => s.hits), 5),
        atBats: Math.max(...battingStats.map(s => s.atBats), 5)
      }
    } else if (chartType === 'practice') {
      return {
        minutes: Math.max(...practiceStats.map(s => s.totalMinutes), 300)
      }
    } else {
      return {
        chances: Math.max(...fieldingStats.map(s => s.putouts + s.assists + s.errors), 10)
      }
    }
  }, [chartType, battingStats, practiceStats, fieldingStats])
  
  // グラフデータの選択
  const chartData = chartType === 'batting' ? battingStats 
    : chartType === 'practice' ? practiceStats 
    : fieldingStats
  
  // 累積打率の計算
  const cumulativeAverage = useMemo(() => {
    let totalHits = 0
    let totalAtBats = 0
    
    return battingStats.map(stat => {
      totalHits += stat.hits
      totalAtBats += stat.atBats
      return totalAtBats > 0 ? (totalHits / totalAtBats).toFixed(3) : '.000'
    })
  }, [battingStats])
  
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return `${date.getMonth() + 1}/${date.getDate()}`
  }
  
  return (
    <div className="performance-chart">
      <div className="chart-header">
        <h3>📊 成績推移</h3>
        <div className="chart-controls">
          <select value={chartType} onChange={(e) => setChartType(e.target.value)}>
            <option value="batting">打撃成績</option>
            <option value="practice">練習量</option>
            <option value="fielding">守備成績</option>
          </select>
          <select value={dateRange} onChange={(e) => setDateRange(e.target.value)}>
            <option value="week">1週間</option>
            <option value="month">1ヶ月</option>
            <option value="season">シーズン</option>
          </select>
        </div>
      </div>
      
      {chartData.length === 0 ? (
        <div className="empty-chart">
          <p>この期間のデータがありません</p>
          <p className="empty-hint">試合記録や練習記録を追加すると、ここにグラフが表示されます</p>
        </div>
      ) : (
        <>
          {chartType === 'batting' && (
            <div className="chart-container">
              <div className="chart-legend">
                <span className="legend-item hits">● 安打数</span>
                <span className="legend-item average">● 打率</span>
                <span className="legend-item cumulative">● 累積打率</span>
              </div>
              
              <div className="chart-area">
                <div className="y-axis">
                  <span>{maxValues.hits}</span>
                  <span>{Math.floor(maxValues.hits * 0.75)}</span>
                  <span>{Math.floor(maxValues.hits * 0.5)}</span>
                  <span>{Math.floor(maxValues.hits * 0.25)}</span>
                  <span>0</span>
                </div>
                
                <div className="chart-content">
                  <svg className="chart-svg" viewBox="0 0 600 300">
                    {/* グリッド線 */}
                    {[0, 0.25, 0.5, 0.75, 1].map(ratio => (
                      <line
                        key={ratio}
                        x1="0"
                        y1={300 - ratio * 300}
                        x2="600"
                        y2={300 - ratio * 300}
                        stroke="#e0e0e0"
                        strokeWidth="1"
                      />
                    ))}
                    
                    {/* 安打数の棒グラフ */}
                    {battingStats.map((stat, index) => {
                      const x = (index / (battingStats.length - 1)) * 580 + 10
                      const height = (stat.hits / maxValues.hits) * 280
                      
                      return (
                        <g key={index}>
                          <rect
                            x={x - 15}
                            y={300 - height}
                            width="30"
                            height={height}
                            fill="#4CAF50"
                            opacity="0.6"
                          />
                          <text
                            x={x}
                            y={295 - height}
                            textAnchor="middle"
                            fontSize="12"
                            fill="#333"
                          >
                            {stat.hits}
                          </text>
                        </g>
                      )
                    })}
                    
                    {/* 打率の折れ線グラフ */}
                    <polyline
                      points={battingStats.map((stat, index) => {
                        const x = (index / (battingStats.length - 1)) * 580 + 10
                        const y = 300 - (stat.average * 300)
                        return `${x},${y}`
                      }).join(' ')}
                      fill="none"
                      stroke="#2196F3"
                      strokeWidth="2"
                    />
                    
                    {/* 累積打率の折れ線グラフ */}
                    <polyline
                      points={cumulativeAverage.map((avg, index) => {
                        const x = (index / (battingStats.length - 1)) * 580 + 10
                        const y = 300 - (parseFloat(avg) * 300)
                        return `${x},${y}`
                      }).join(' ')}
                      fill="none"
                      stroke="#FF5722"
                      strokeWidth="2"
                      strokeDasharray="5,5"
                    />
                    
                    {/* データポイント */}
                    {battingStats.map((stat, index) => {
                      const x = (index / (battingStats.length - 1)) * 580 + 10
                      const y = 300 - (stat.average * 300)
                      
                      return (
                        <circle
                          key={index}
                          cx={x}
                          cy={y}
                          r="4"
                          fill="#2196F3"
                          data-tooltip={`${formatDate(stat.date)}: ${stat.average} (${stat.hits}/${stat.atBats})`}
                        />
                      )
                    })}
                  </svg>
                  
                  <div className="x-axis">
                    {battingStats.map((stat, index) => (
                      <span key={index}>{formatDate(stat.date)}</span>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="chart-summary">
                <div className="summary-item">
                  <span className="summary-label">期間打率</span>
                  <span className="summary-value">
                    {cumulativeAverage[cumulativeAverage.length - 1] || '.000'}
                  </span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">総安打数</span>
                  <span className="summary-value">
                    {battingStats.reduce((sum, s) => sum + s.hits, 0)}
                  </span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">総打点</span>
                  <span className="summary-value">
                    {battingStats.reduce((sum, s) => sum + s.rbis, 0)}
                  </span>
                </div>
              </div>
            </div>
          )}
          
          {chartType === 'practice' && (
            <div className="chart-container">
              <div className="chart-legend">
                <span className="legend-item practice">● 練習時間（分）</span>
              </div>
              
              <div className="chart-area">
                <div className="chart-content practice-chart">
                  <svg className="chart-svg" viewBox="0 0 600 300">
                    {practiceStats.map((stat, index) => {
                      const x = (index / (practiceStats.length || 1)) * 580 + 10
                      const height = (stat.totalMinutes / maxValues.minutes) * 280
                      
                      return (
                        <g key={index}>
                          <rect
                            x={x - 20}
                            y={300 - height}
                            width="40"
                            height={height}
                            fill="#9C27B0"
                            opacity="0.7"
                          />
                          <text
                            x={x}
                            y={295 - height}
                            textAnchor="middle"
                            fontSize="12"
                            fill="#333"
                          >
                            {stat.totalMinutes}分
                          </text>
                        </g>
                      )
                    })}
                  </svg>
                  
                  <div className="x-axis">
                    {practiceStats.map((stat, index) => (
                      <span key={index}>{formatDate(stat.date)}</span>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="chart-summary">
                <div className="summary-item">
                  <span className="summary-label">総練習時間</span>
                  <span className="summary-value">
                    {Math.floor(practiceStats.reduce((sum, s) => sum + s.totalMinutes, 0) / 60)}時間
                    {practiceStats.reduce((sum, s) => sum + s.totalMinutes, 0) % 60}分
                  </span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">平均練習時間</span>
                  <span className="summary-value">
                    {practiceStats.length > 0 
                      ? Math.floor(practiceStats.reduce((sum, s) => sum + s.totalMinutes, 0) / practiceStats.length)
                      : 0}分/日
                  </span>
                </div>
              </div>
            </div>
          )}
          
          {chartType === 'fielding' && (
            <div className="chart-container">
              <div className="chart-legend">
                <span className="legend-item fielding">● 守備率</span>
                <span className="legend-item errors">● 失策数</span>
              </div>
              
              <div className="chart-area">
                <div className="chart-content">
                  <svg className="chart-svg" viewBox="0 0 600 300">
                    {/* 守備率の折れ線グラフ */}
                    <polyline
                      points={fieldingStats.map((stat, index) => {
                        const x = (index / (fieldingStats.length - 1)) * 580 + 10
                        const y = 300 - (stat.fieldingPct * 300)
                        return `${x},${y}`
                      }).join(' ')}
                      fill="none"
                      stroke="#00BCD4"
                      strokeWidth="2"
                    />
                    
                    {/* データポイント */}
                    {fieldingStats.map((stat, index) => {
                      const x = (index / (fieldingStats.length - 1)) * 580 + 10
                      const y = 300 - (stat.fieldingPct * 300)
                      
                      return (
                        <g key={index}>
                          <circle
                            cx={x}
                            cy={y}
                            r="4"
                            fill="#00BCD4"
                          />
                          {stat.errors > 0 && (
                            <text
                              x={x}
                              y={280}
                              textAnchor="middle"
                              fontSize="14"
                              fill="#F44336"
                              fontWeight="bold"
                            >
                              E{stat.errors}
                            </text>
                          )}
                        </g>
                      )
                    })}
                  </svg>
                  
                  <div className="x-axis">
                    {fieldingStats.map((stat, index) => (
                      <span key={index}>{formatDate(stat.date)}</span>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="chart-summary">
                <div className="summary-item">
                  <span className="summary-label">期間守備率</span>
                  <span className="summary-value">
                    {fieldingStats.length > 0
                      ? (fieldingStats.reduce((sum, s) => sum + s.putouts + s.assists, 0) /
                         fieldingStats.reduce((sum, s) => sum + s.putouts + s.assists + s.errors, 0)).toFixed(3)
                      : '.000'}
                  </span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">総失策数</span>
                  <span className="summary-value">
                    {fieldingStats.reduce((sum, s) => sum + s.errors, 0)}
                  </span>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default PerformanceChart