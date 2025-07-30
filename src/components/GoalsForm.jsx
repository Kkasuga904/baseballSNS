import React, { useState, useEffect } from 'react'
import NutritionTargets from './NutritionTargets'
import './GoalsForm.css'

function GoalsForm() {
  const [goals, setGoals] = useState(() => {
    const savedGoals = localStorage.getItem('baseballSNSGoals')
    return savedGoals ? JSON.parse(savedGoals) : {
      shortTerm: '',
      longTerm: '',
      dailyPractice: '',
      physicalGoal: '',
      academicGoal: '',
      personalGoal: ''
    }
  })

  const handleGoalChange = (type, value) => {
    const newGoals = { ...goals, [type]: value }
    setGoals(newGoals)
    localStorage.setItem('baseballSNSGoals', JSON.stringify(newGoals))
  }

  return (
    <div className="goals-form">
      <div className="form-description">
        <p>目標を設定して、日々の練習のモチベーションを保ちましょう！</p>
      </div>
      
      <div className="goals-grid">
        <div className="goal-item">
          <label>
            <span className="goal-icon">🎯</span>
            短期目標（1ヶ月）
          </label>
          <textarea
            value={goals.shortTerm}
            onChange={(e) => handleGoalChange('shortTerm', e.target.value)}
            placeholder="例：素振りを毎日200回、打率3割達成"
            rows="3"
          />
        </div>
        
        <div className="goal-item">
          <label>
            <span className="goal-icon">🏆</span>
            長期目標（1年）
          </label>
          <textarea
            value={goals.longTerm}
            onChange={(e) => handleGoalChange('longTerm', e.target.value)}
            placeholder="例：レギュラー獲得、県大会出場"
            rows="3"
          />
        </div>
        
        <div className="goal-item">
          <label>
            <span className="goal-icon">💪</span>
            毎日の練習目標
          </label>
          <textarea
            value={goals.dailyPractice}
            onChange={(e) => handleGoalChange('dailyPractice', e.target.value)}
            placeholder="例：素振り、ティーバッティング、ランニング"
            rows="3"
          />
        </div>
        
        <div className="goal-item">
          <label>
            <span className="goal-icon">🏋️</span>
            フィジカル目標
          </label>
          <textarea
            value={goals.physicalGoal}
            onChange={(e) => handleGoalChange('physicalGoal', e.target.value)}
            placeholder="例：体重5kg増量、ベンチプレス100kg、50m走6.5秒"
            rows="3"
          />
        </div>
        
        <div className="goal-item">
          <label>
            <span className="goal-icon">📚</span>
            学業・仕事目標
          </label>
          <textarea
            value={goals.academicGoal}
            onChange={(e) => handleGoalChange('academicGoal', e.target.value)}
            placeholder="例：成績平均4.0以上、資格取得、プロジェクト完成"
            rows="3"
          />
        </div>
        
        <div className="goal-item">
          <label>
            <span className="goal-icon">🌟</span>
            個人成長目標
          </label>
          <textarea
            value={goals.personalGoal}
            onChange={(e) => handleGoalChange('personalGoal', e.target.value)}
            placeholder="例：読書月3冊、新しいスキル習得、人間関係改善"
            rows="3"
          />
        </div>
      </div>
      
      <div className="goals-tips">
        <h4>💡 目標設定のコツ</h4>
        <ul>
          <li>具体的で測定可能な目標を立てる</li>
          <li>達成可能だが挑戦的な目標にする</li>
          <li>定期的に見直して更新する</li>
          <li>野球だけでなく人生全体のバランスを考える</li>
        </ul>
      </div>
      
      <div className="nutrition-section">
        <NutritionTargets />
      </div>
    </div>
  )
}

export default GoalsForm