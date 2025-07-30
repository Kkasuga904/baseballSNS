import React, { useMemo } from 'react'
import './WeeklySummary.css'

function WeeklySummary({ practices }) {
  const weekData = useMemo(() => {
    const today = new Date()
    const oneWeekAgo = new Date(today)
    oneWeekAgo.setDate(today.getDate() - 6)
    
    // 週の日付を生成
    const days = []
    for (let i = 0; i < 7; i++) {
      const date = new Date(oneWeekAgo)
      date.setDate(oneWeekAgo.getDate() + i)
      days.push({
        date: date.toISOString().split('T')[0],
        dayName: ['日', '月', '火', '水', '木', '金', '土'][date.getDay()],
        isToday: date.toDateString() === today.toDateString()
      })
    }

    // 各日の練習データを集計
    const weekSummary = days.map(day => {
      const dayPractices = practices.filter(p => 
        p.practiceData && p.practiceData.date === day.date
      )

      if (dayPractices.length === 0) {
        return { ...day, status: 'none', intensity: 0, isRest: false }
      }

      const isRest = dayPractices.some(p => p.practiceData.category === 'rest')
      if (isRest) {
        return { ...day, status: 'rest', intensity: 0, isRest: true }
      }

      // 練習強度の平均を計算
      const avgIntensity = dayPractices.reduce((sum, p) => 
        sum + (p.practiceData.intensity || 3), 0
      ) / dayPractices.length

      return {
        ...day,
        status: 'practice',
        intensity: avgIntensity,
        isRest: false,
        practiceCount: dayPractices.length
      }
    })

    // 週間統計
    const stats = {
      totalPracticeDays: weekSummary.filter(d => d.status === 'practice').length,
      totalRestDays: weekSummary.filter(d => d.status === 'rest').length,
      avgIntensity: weekSummary
        .filter(d => d.status === 'practice')
        .reduce((sum, d) => sum + d.intensity, 0) / 
        (weekSummary.filter(d => d.status === 'practice').length || 1)
    }

    return { weekSummary, stats }
  }, [practices])

  const getStatusIcon = (status) => {
    switch (status) {
      case 'practice': return '💪'
      case 'rest': return '😴'
      default: return '－'
    }
  }

  const getIntensityColor = (intensity) => {
    if (intensity >= 4) return '#ff6b6b'
    if (intensity >= 3) return '#ffa94d'
    if (intensity >= 2) return '#51cf66'
    return '#868e96'
  }

  return (
    <div className="weekly-summary">
      <h3>📅 今週の練習状況</h3>
      
      <div className="week-grid">
        {weekData.weekSummary.map((day, index) => (
          <div 
            key={index}
            className={`day-card ${day.status} ${day.isToday ? 'today' : ''}`}
          >
            <div className="day-name">{day.dayName}</div>
            <div className="day-status">{getStatusIcon(day.status)}</div>
            {day.status === 'practice' && (
              <div 
                className="intensity-bar"
                style={{
                  height: `${day.intensity * 20}%`,
                  backgroundColor: getIntensityColor(day.intensity)
                }}
              />
            )}
          </div>
        ))}
      </div>

      <div className="week-stats">
        <div className="stat">
          <span className="stat-label">練習日数</span>
          <span className="stat-value">{weekData.stats.totalPracticeDays}日</span>
        </div>
        <div className="stat">
          <span className="stat-label">休養日数</span>
          <span className="stat-value">{weekData.stats.totalRestDays}日</span>
        </div>
        <div className="stat">
          <span className="stat-label">平均強度</span>
          <span className="stat-value">
            {'★'.repeat(Math.round(weekData.stats.avgIntensity))}
          </span>
        </div>
      </div>

      {weekData.stats.totalPracticeDays >= 6 && (
        <div className="alert warning">
          ⚠️ 今週は練習が多めです。適度な休養を心がけましょう。
        </div>
      )}
      
      {weekData.stats.totalRestDays === 0 && weekData.stats.totalPracticeDays > 0 && (
        <div className="alert danger">
          🚨 今週は休養日がありません。オーバートレーニングに注意！
        </div>
      )}
      
      {weekData.stats.avgIntensity >= 4 && (
        <div className="alert info">
          💡 高強度の練習が続いています。回復にも注意を払いましょう。
        </div>
      )}
    </div>
  )
}

export default WeeklySummary