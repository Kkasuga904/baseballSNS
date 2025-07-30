import React, { useState, useEffect } from 'react'
import { useAuth } from '../App'
import './NutritionTargets.css'

function NutritionTargets({ onTargetsUpdate }) {
  const { user } = useAuth()
  
  // プロフィール情報を取得
  const [profile, setProfile] = useState(() => {
    const profileKey = `baseballSNSProfile_${user?.email || 'guest'}`
    const savedProfile = localStorage.getItem(profileKey)
    return savedProfile ? JSON.parse(savedProfile) : null
  })
  
  const [customTargets, setCustomTargets] = useState(() => {
    const saved = localStorage.getItem('baseballSNSNutritionTargets')
    return saved ? JSON.parse(saved) : null
  })
  
  const [isEditing, setIsEditing] = useState(false)
  const [editValues, setEditValues] = useState({
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0
  })
  
  // 基礎代謝率の計算（ハリス・ベネディクト方程式）
  const calculateBMR = (height, weight, age = 18) => {
    // 男性の基礎代謝率（野球選手は主に男性なので男性の式を使用）
    return 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age)
  }
  
  // 活動レベルに基づく総カロリー必要量の計算
  const calculateTDEE = (bmr, activityLevel = 'high') => {
    const activityMultipliers = {
      sedentary: 1.2,      // 座りがち
      light: 1.375,        // 軽い運動
      moderate: 1.55,      // 中程度の運動
      high: 1.725,         // 高強度の運動（野球選手向け）
      veryHigh: 1.9        // 非常に高強度の運動
    }
    return bmr * activityMultipliers[activityLevel]
  }
  
  // 推奨栄養素の計算
  const calculateRecommendedNutrition = () => {
    if (!profile?.height || !profile?.weight) {
      return null
    }
    
    const height = parseFloat(profile.height)
    const weight = parseFloat(profile.weight)
    
    // 基礎代謝率の計算
    const bmr = calculateBMR(height, weight)
    
    // 総カロリー必要量（高強度の運動を想定）
    const tdee = calculateTDEE(bmr, 'high')
    
    // 栄養素の配分
    // タンパク質: 体重1kgあたり2.0-2.5g（アスリート向け）
    const proteinGrams = weight * 2.2
    const proteinCalories = proteinGrams * 4
    
    // 炭水化物: 総カロリーの55-60%（エネルギー源として重要）
    const carbsCalories = tdee * 0.55
    const carbsGrams = carbsCalories / 4
    
    // 脂質: 総カロリーの20-25%
    const fatCalories = tdee * 0.23
    const fatGrams = fatCalories / 9
    
    return {
      calories: Math.round(tdee),
      protein: Math.round(proteinGrams),
      carbs: Math.round(carbsGrams),
      fat: Math.round(fatGrams)
    }
  }
  
  const recommendedNutrition = calculateRecommendedNutrition()
  const currentTargets = customTargets || recommendedNutrition
  
  useEffect(() => {
    if (onTargetsUpdate && currentTargets) {
      onTargetsUpdate(currentTargets)
    }
  }, [currentTargets, onTargetsUpdate])
  
  const handleEdit = () => {
    setEditValues(currentTargets || {
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0
    })
    setIsEditing(true)
  }
  
  const handleSave = () => {
    const newTargets = {
      calories: parseInt(editValues.calories) || 0,
      protein: parseInt(editValues.protein) || 0,
      carbs: parseInt(editValues.carbs) || 0,
      fat: parseInt(editValues.fat) || 0
    }
    setCustomTargets(newTargets)
    localStorage.setItem('baseballSNSNutritionTargets', JSON.stringify(newTargets))
    setIsEditing(false)
  }
  
  const handleReset = () => {
    setCustomTargets(null)
    localStorage.removeItem('baseballSNSNutritionTargets')
    setIsEditing(false)
  }
  
  if (!profile?.height || !profile?.weight) {
    return (
      <div className="nutrition-targets">
        <div className="no-profile-data">
          <p>身長・体重が登録されていないため、推奨栄養素を計算できません。</p>
          <p>プロフィール設定から身長・体重を登録してください。</p>
        </div>
      </div>
    )
  }
  
  return (
    <div className="nutrition-targets">
      <div className="targets-header">
        <h3>🎯 栄養目標値</h3>
        <div className="targets-actions">
          {!isEditing && (
            <>
              <button className="edit-btn" onClick={handleEdit}>
                ✏️ カスタマイズ
              </button>
              {customTargets && (
                <button className="reset-btn" onClick={handleReset}>
                  🔄 推奨値に戻す
                </button>
              )}
            </>
          )}
        </div>
      </div>
      
      <div className="profile-info">
        <span>身長: {profile.height}cm</span>
        <span>体重: {profile.weight}kg</span>
        {customTargets && <span className="custom-badge">カスタム設定中</span>}
      </div>
      
      {isEditing ? (
        <div className="edit-form">
          <div className="edit-grid">
            <div className="edit-item">
              <label>カロリー (kcal)</label>
              <input
                type="number"
                value={editValues.calories}
                onChange={(e) => setEditValues({...editValues, calories: e.target.value})}
                placeholder={recommendedNutrition?.calories}
              />
              <span className="recommended">推奨: {recommendedNutrition?.calories}</span>
            </div>
            <div className="edit-item">
              <label>タンパク質 (g)</label>
              <input
                type="number"
                value={editValues.protein}
                onChange={(e) => setEditValues({...editValues, protein: e.target.value})}
                placeholder={recommendedNutrition?.protein}
              />
              <span className="recommended">推奨: {recommendedNutrition?.protein}</span>
            </div>
            <div className="edit-item">
              <label>炭水化物 (g)</label>
              <input
                type="number"
                value={editValues.carbs}
                onChange={(e) => setEditValues({...editValues, carbs: e.target.value})}
                placeholder={recommendedNutrition?.carbs}
              />
              <span className="recommended">推奨: {recommendedNutrition?.carbs}</span>
            </div>
            <div className="edit-item">
              <label>脂質 (g)</label>
              <input
                type="number"
                value={editValues.fat}
                onChange={(e) => setEditValues({...editValues, fat: e.target.value})}
                placeholder={recommendedNutrition?.fat}
              />
              <span className="recommended">推奨: {recommendedNutrition?.fat}</span>
            </div>
          </div>
          <div className="edit-actions">
            <button className="save-btn" onClick={handleSave}>保存</button>
            <button className="cancel-btn" onClick={() => setIsEditing(false)}>キャンセル</button>
          </div>
        </div>
      ) : (
        <div className="targets-display">
          <div className="target-item">
            <span className="target-label">カロリー</span>
            <span className="target-value">{currentTargets?.calories} kcal</span>
          </div>
          <div className="target-item">
            <span className="target-label">タンパク質</span>
            <span className="target-value">{currentTargets?.protein} g</span>
          </div>
          <div className="target-item">
            <span className="target-label">炭水化物</span>
            <span className="target-value">{currentTargets?.carbs} g</span>
          </div>
          <div className="target-item">
            <span className="target-label">脂質</span>
            <span className="target-value">{currentTargets?.fat} g</span>
          </div>
        </div>
      )}
      
      <div className="calculation-note">
        <p>※ 推奨値は以下の基準で計算されています：</p>
        <ul>
          <li>基礎代謝率（BMR）: ハリス・ベネディクト方程式</li>
          <li>活動レベル: 高強度（野球選手向け）</li>
          <li>タンパク質: 体重1kgあたり2.2g</li>
          <li>炭水化物: 総カロリーの55%</li>
          <li>脂質: 総カロリーの23%</li>
        </ul>
      </div>
    </div>
  )
}

export default NutritionTargets