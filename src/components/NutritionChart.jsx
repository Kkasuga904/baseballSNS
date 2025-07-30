import React, { useState, useEffect } from 'react'
import './NutritionChart.css'

function NutritionChart({ meals = [], supplements = [] }) {
  // サプリメントの栄養データベース
  const supplementNutrition = {
    'プロテイン': { calories: 120, protein: 25, carbs: 3, fat: 1, unit: 'スクープ', defaultAmount: 30 },
    'ホエイプロテイン': { calories: 120, protein: 25, carbs: 3, fat: 1, unit: 'スクープ', defaultAmount: 30 },
    'BCAA': { calories: 20, protein: 5, carbs: 0, fat: 0, unit: 'g', defaultAmount: 10 },
    'EAA': { calories: 20, protein: 5, carbs: 0, fat: 0, unit: 'g', defaultAmount: 10 },
    'クレアチン': { calories: 0, protein: 0, carbs: 0, fat: 0, unit: 'g', defaultAmount: 5 },
    'マルトデキストリン': { calories: 380, protein: 0, carbs: 95, fat: 0, unit: 'g', defaultAmount: 100 },
    'グルタミン': { calories: 0, protein: 0, carbs: 0, fat: 0, unit: 'g', defaultAmount: 5 }
  }
  
  // サプリメントから栄養素を計算
  const calculateSupplementNutrition = (supplementRecord) => {
    const nutrition = { calories: 0, protein: 0, carbs: 0, fat: 0 }
    
    supplementRecord.supplements.forEach(supp => {
      const suppData = supplementNutrition[supp.name] || 
                      supplementNutrition[supp.name.replace(/\s/g, '')] || 
                      null
      
      if (suppData) {
        const ratio = supp.amount / suppData.defaultAmount
        nutrition.calories += suppData.calories * ratio
        nutrition.protein += suppData.protein * ratio
        nutrition.carbs += suppData.carbs * ratio
        nutrition.fat += suppData.fat * ratio
      }
    })
    
    return nutrition
  }
  
  // 日付ごとの栄養素を集計（食事＋サプリメント）
  const dailyNutrition = {}
  
  // 食事の栄養素を集計
  meals.forEach(meal => {
    const date = meal.date
    if (!dailyNutrition[date]) {
      dailyNutrition[date] = { calories: 0, protein: 0, carbs: 0, fat: 0 }
    }
    
    dailyNutrition[date].calories += meal.calories || 0
    dailyNutrition[date].protein += meal.protein || 0
    dailyNutrition[date].carbs += meal.carbs || 0
    dailyNutrition[date].fat += meal.fat || 0
  })
  
  // サプリメントの栄養素を集計
  supplements.forEach(suppRecord => {
    const date = suppRecord.date
    if (!dailyNutrition[date]) {
      dailyNutrition[date] = { calories: 0, protein: 0, carbs: 0, fat: 0 }
    }
    
    const suppNutrition = calculateSupplementNutrition(suppRecord)
    dailyNutrition[date].calories += suppNutrition.calories
    dailyNutrition[date].protein += suppNutrition.protein
    dailyNutrition[date].carbs += suppNutrition.carbs
    dailyNutrition[date].fat += suppNutrition.fat
  })
  
  // 今日の栄養素
  const today = new Date().toISOString().split('T')[0]
  const todayNutrition = dailyNutrition[today] || { calories: 0, protein: 0, carbs: 0, fat: 0 }
  
  // PFCバランスの計算
  const totalCalories = todayNutrition.protein * 4 + todayNutrition.carbs * 4 + todayNutrition.fat * 9
  const proteinRatio = totalCalories > 0 ? (todayNutrition.protein * 4 / totalCalories) * 100 : 0
  const carbsRatio = totalCalories > 0 ? (todayNutrition.carbs * 4 / totalCalories) * 100 : 0
  const fatRatio = totalCalories > 0 ? (todayNutrition.fat * 9 / totalCalories) * 100 : 0
  
  // 目標値を取得（カスタム設定または推奨値）
  const [targets, setTargets] = useState(() => {
    const saved = localStorage.getItem('baseballSNSNutritionTargets')
    if (saved) {
      return JSON.parse(saved)
    }
    // デフォルト値
    return {
      calories: 3000,
      protein: 150,
      carbs: 450,
      fat: 83
    }
  })
  
  // 目標値の更新を監視
  useEffect(() => {
    const handleStorageChange = () => {
      const saved = localStorage.getItem('baseballSNSNutritionTargets')
      if (saved) {
        setTargets(JSON.parse(saved))
      }
    }
    
    // storage イベントは他のタブでの変更を検知
    window.addEventListener('storage', handleStorageChange)
    
    // 同じタブ内での変更を検知するため、定期的にチェック
    const interval = setInterval(() => {
      handleStorageChange()
    }, 1000)
    
    return () => {
      window.removeEventListener('storage', handleStorageChange)
      clearInterval(interval)
    }
  }, [])
  
  // 円グラフの作成
  const createPieChart = (data, size = 200) => {
    const centerX = size / 2
    const centerY = size / 2
    const radius = size / 2 - 10
    
    let startAngle = -90 // 12時から開始
    const paths = []
    const total = data.reduce((sum, item) => sum + item.value, 0)
    
    data.forEach((item, index) => {
      if (item.value === 0) return
      
      const percentage = (item.value / total) * 100
      const angle = (percentage / 100) * 360
      const endAngle = startAngle + angle
      
      const startRad = (startAngle * Math.PI) / 180
      const endRad = (endAngle * Math.PI) / 180
      
      const x1 = centerX + radius * Math.cos(startRad)
      const y1 = centerY + radius * Math.sin(startRad)
      const x2 = centerX + radius * Math.cos(endRad)
      const y2 = centerY + radius * Math.sin(endRad)
      
      const largeArc = angle > 180 ? 1 : 0
      
      const pathData = [
        `M ${centerX} ${centerY}`,
        `L ${x1} ${y1}`,
        `A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}`,
        'Z'
      ].join(' ')
      
      paths.push(
        <path
          key={index}
          d={pathData}
          fill={item.color}
          stroke="white"
          strokeWidth="2"
        />
      )
      
      // ラベルの位置計算
      const labelAngle = startAngle + angle / 2
      const labelRad = (labelAngle * Math.PI) / 180
      const labelRadius = radius * 0.7
      const labelX = centerX + labelRadius * Math.cos(labelRad)
      const labelY = centerY + labelRadius * Math.sin(labelRad)
      
      if (percentage > 5) { // 5%以上の場合のみラベル表示
        paths.push(
          <text
            key={`label-${index}`}
            x={labelX}
            y={labelY}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="white"
            fontSize="14"
            fontWeight="bold"
          >
            {percentage.toFixed(0)}%
          </text>
        )
      }
      
      startAngle = endAngle
    })
    
    return (
      <svg width={size} height={size}>
        {paths}
      </svg>
    )
  }
  
  const pfcData = [
    { name: 'タンパク質', value: proteinRatio, color: '#ff6b6b' },
    { name: '炭水化物', value: carbsRatio, color: '#4ecdc4' },
    { name: '脂質', value: fatRatio, color: '#ffe66d' }
  ]
  
  // プログレスバーの作成
  const createProgressBar = (current, target, color) => {
    const percentage = Math.min((current / target) * 100, 100)
    return (
      <div className="progress-bar-container">
        <div className="progress-bar-background">
          <div 
            className="progress-bar-fill"
            style={{ width: `${percentage}%`, backgroundColor: color }}
          />
        </div>
        <span className="progress-text">{percentage.toFixed(0)}%</span>
      </div>
    )
  }
  
  return (
    <div className="nutrition-chart">
      <h3>📊 今日の栄養摂取状況</h3>
      
      <div className="nutrition-summary">
        <div className="summary-item">
          <span className="summary-label">総カロリー</span>
          <span className="summary-value">{todayNutrition.calories} kcal</span>
          {createProgressBar(todayNutrition.calories, targets.calories, '#2e7d46')}
        </div>
      </div>
      
      <div className="nutrition-grid">
        <div className="pfc-chart">
          <h4>PFCバランス</h4>
          {totalCalories > 0 ? (
            <>
              {createPieChart(pfcData)}
              <div className="pfc-legend">
                {pfcData.map((item, index) => (
                  <div key={index} className="legend-item">
                    <span className="legend-color" style={{ backgroundColor: item.color }} />
                    <span className="legend-label">{item.name}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <p className="no-data">データがありません</p>
          )}
        </div>
        
        <div className="nutrition-details">
          <h4>栄養素別摂取量</h4>
          <div className="nutrient-item">
            <div className="nutrient-header">
              <span className="nutrient-name">タンパク質</span>
              <span className="nutrient-value">{todayNutrition.protein.toFixed(1)}g / {targets.protein}g</span>
            </div>
            {createProgressBar(todayNutrition.protein, targets.protein, '#ff6b6b')}
          </div>
          
          <div className="nutrient-item">
            <div className="nutrient-header">
              <span className="nutrient-name">炭水化物</span>
              <span className="nutrient-value">{todayNutrition.carbs.toFixed(1)}g / {targets.carbs}g</span>
            </div>
            {createProgressBar(todayNutrition.carbs, targets.carbs, '#4ecdc4')}
          </div>
          
          <div className="nutrient-item">
            <div className="nutrient-header">
              <span className="nutrient-name">脂質</span>
              <span className="nutrient-value">{todayNutrition.fat.toFixed(1)}g / {targets.fat}g</span>
            </div>
            {createProgressBar(todayNutrition.fat, targets.fat, '#ffe66d')}
          </div>
        </div>
      </div>
      
      <div className="nutrition-advice">
        <h4>💡 アドバイス</h4>
        {todayNutrition.protein < targets.protein * 0.8 && (
          <p>タンパク質が不足しています。鶏胸肉や魚、プロテインの摂取を増やしましょう。</p>
        )}
        {todayNutrition.carbs < targets.carbs * 0.8 && (
          <p>炭水化物が不足しています。練習のエネルギー源として、ご飯やパンを十分に摂りましょう。</p>
        )}
        {todayNutrition.calories < targets.calories * 0.8 && (
          <p>総カロリーが不足しています。パフォーマンス維持のため、食事量を増やしましょう。</p>
        )}
        {todayNutrition.calories >= targets.calories * 0.8 && (
          <p>良いバランスで栄養を摂取できています。この調子を維持しましょう！</p>
        )}
      </div>
    </div>
  )
}

export default NutritionChart