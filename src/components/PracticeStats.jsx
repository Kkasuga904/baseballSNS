import React, { useMemo } from 'react'
import './PracticeStats.css'

function PracticeStats({ practices = [] }) {
  const stats = useMemo(() => {
    const categoryStats = {
      batting: { count: 0, icon: '🏏', label: '打撃' },
      pitching: { count: 0, icon: '⚾', label: '投球' },
      fielding: { count: 0, icon: '🧤', label: '守備' },
      running: { count: 0, icon: '🏃', label: '走塁' },
      training: { count: 0, icon: '💪', label: 'トレーニング' }
    }

    let totalPractices = 0
    let totalMinutes = 0
    let currentStreak = 0
    let maxStreak = 0
    let lastDate = null

    // 日付順にソート（practiceDataが存在するもののみ）
    const sortedPractices = [...practices]
      .filter(p => p && p.practiceData && p.practiceData.date)
      .sort((a, b) => 
        new Date(a.practiceData.date) - new Date(b.practiceData.date)
      )

    sortedPractices.forEach(practice => {
      if (practice.practiceData) {
        totalPractices++
        
        // カテゴリー別カウント
        const category = practice.practiceData.category
        if (categoryStats[category]) {
          categoryStats[category].count++
        }

        // 練習時間の計算
        const start = new Date(`2000-01-01 ${practice.practiceData.startTime}`)
        const end = new Date(`2000-01-01 ${practice.practiceData.endTime}`)
        const diff = (end - start) / 60000 // 分単位
        totalMinutes += diff

        // 連続日数の計算
        const currentDate = new Date(practice.practiceData.date)
        if (lastDate) {
          const dayDiff = Math.floor((currentDate - lastDate) / 86400000)
          if (dayDiff === 1) {
            currentStreak++
          } else {
            maxStreak = Math.max(maxStreak, currentStreak)
            currentStreak = 1
          }
        } else {
          currentStreak = 1
        }
        lastDate = currentDate
      }
    })

    maxStreak = Math.max(maxStreak, currentStreak)

    // 今日までの連続日数を確認
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    if (lastDate) {
      const daysSinceLastPractice = Math.floor((today - lastDate) / 86400000)
      if (daysSinceLastPractice > 1) {
        currentStreak = 0
      }
    }

    return {
      totalPractices,
      totalHours: Math.floor(totalMinutes / 60),
      totalMinutes: totalMinutes % 60,
      currentStreak,
      maxStreak,
      categoryStats,
      averageMinutesPerPractice: totalPractices > 0 ? Math.round(totalMinutes / totalPractices) : 0
    }
  }, [practices])

  return (
    <div className="practice-stats">
      <h3>📊 練習統計</h3>
      
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{stats.totalPractices}</div>
          <div className="stat-label">総練習回数</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-value">
            {stats.totalHours}時間{stats.totalMinutes > 0 && `${stats.totalMinutes}分`}
          </div>
          <div className="stat-label">総練習時間</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-value">{stats.currentStreak}日</div>
          <div className="stat-label">現在の連続日数</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-value">{stats.maxStreak}日</div>
          <div className="stat-label">最長連続日数</div>
        </div>
      </div>

      <div className="category-stats">
        <h4>カテゴリー別練習回数</h4>
        <div className="category-grid">
          {Object.entries(stats.categoryStats).map(([key, data]) => (
            <div key={key} className="category-stat">
              <span className="category-icon">{data.icon}</span>
              <span className="category-label">{data.label}</span>
              <span className="category-count">{data.count}回</span>
            </div>
          ))}
        </div>
      </div>

      {stats.averageMinutesPerPractice > 0 && (
        <div className="average-time">
          平均練習時間: {Math.floor(stats.averageMinutesPerPractice / 60)}時間
          {stats.averageMinutesPerPractice % 60}分
        </div>
      )}
    </div>
  )
}

export default PracticeStats