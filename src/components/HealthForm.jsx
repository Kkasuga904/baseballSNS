import React, { useState } from 'react'
import './HealthForm.css'

function HealthForm({ onSubmit }) {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    sleep: {
      bedTime: '',
      wakeTime: '',
      quality: 3
    },
    meals: [
      { type: 'breakfast', time: '', content: '', calories: '' },
      { type: 'lunch', time: '', content: '', calories: '' },
      { type: 'dinner', time: '', content: '', calories: '' }
    ],
    supplements: [
      { name: '', amount: '', timing: '' }
    ],
    water: '',
    note: ''
  })

  const mealLabels = {
    breakfast: '朝食',
    lunch: '昼食',
    dinner: '夕食'
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSleepChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      sleep: {
        ...prev.sleep,
        [field]: value
      }
    }))
  }

  const handleMealChange = (index, field, value) => {
    const newMeals = [...formData.meals]
    newMeals[index] = { ...newMeals[index], [field]: value }
    setFormData(prev => ({
      ...prev,
      meals: newMeals
    }))
  }

  const handleSupplementChange = (index, field, value) => {
    const newSupplements = [...formData.supplements]
    newSupplements[index] = { ...newSupplements[index], [field]: value }
    setFormData(prev => ({
      ...prev,
      supplements: newSupplements
    }))
  }

  const addSupplement = () => {
    setFormData(prev => ({
      ...prev,
      supplements: [...prev.supplements, { name: '', amount: '', timing: '' }]
    }))
  }

  const removeSupplement = (index) => {
    if (formData.supplements.length > 1) {
      const newSupplements = formData.supplements.filter((_, i) => i !== index)
      setFormData(prev => ({
        ...prev,
        supplements: newSupplements
      }))
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // 睡眠時間の計算
    if (formData.sleep.bedTime && formData.sleep.wakeTime) {
      const bedTime = new Date(`2000-01-01 ${formData.sleep.bedTime}`)
      let wakeTime = new Date(`2000-01-01 ${formData.sleep.wakeTime}`)
      
      // 翌日起床の場合の処理
      if (wakeTime < bedTime) {
        wakeTime = new Date(`2000-01-02 ${formData.sleep.wakeTime}`)
      }
      
      const sleepDuration = (wakeTime - bedTime) / (1000 * 60 * 60) // 時間に変換
      formData.sleep.duration = sleepDuration
    }

    onSubmit(formData)

    // フォームリセット
    setFormData({
      date: new Date().toISOString().split('T')[0],
      sleep: {
        bedTime: '',
        wakeTime: '',
        quality: 3
      },
      meals: [
        { type: 'breakfast', time: '', content: '', calories: '' },
        { type: 'lunch', time: '', content: '', calories: '' },
        { type: 'dinner', time: '', content: '', calories: '' }
      ],
      supplements: [
        { name: '', amount: '', timing: '' }
      ],
      water: '',
      note: ''
    })
  }

  return (
    <form className="health-form" onSubmit={handleSubmit}>
      <h3>🏥 健康記録</h3>

      <div className="form-group">
        <label>日付</label>
        <input
          type="date"
          value={formData.date}
          onChange={(e) => handleInputChange('date', e.target.value)}
          required
        />
      </div>

      <div className="health-section">
        <h4>😴 睡眠</h4>
        <div className="form-row">
          <div className="form-group">
            <label>就寝時間</label>
            <input
              type="time"
              value={formData.sleep.bedTime}
              onChange={(e) => handleSleepChange('bedTime', e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>起床時間</label>
            <input
              type="time"
              value={formData.sleep.wakeTime}
              onChange={(e) => handleSleepChange('wakeTime', e.target.value)}
              required
            />
          </div>
        </div>
        <div className="form-group">
          <label>睡眠の質</label>
          <div className="quality-selector">
            {[1, 2, 3, 4, 5].map(num => (
              <button
                key={num}
                type="button"
                className={`quality-button ${formData.sleep.quality === num ? 'active' : ''}`}
                onClick={() => handleSleepChange('quality', num)}
              >
                {num === 1 ? '😫' : num === 2 ? '😣' : num === 3 ? '😐' : num === 4 ? '😊' : '😴'}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="health-section">
        <h4>🍽️ 食事</h4>
        {formData.meals.map((meal, index) => (
          <div key={meal.type} className="meal-item">
            <h5>{mealLabels[meal.type]}</h5>
            <div className="form-row">
              <div className="form-group">
                <label>時間</label>
                <input
                  type="time"
                  value={meal.time}
                  onChange={(e) => handleMealChange(index, 'time', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>カロリー</label>
                <input
                  type="number"
                  placeholder="kcal"
                  value={meal.calories}
                  onChange={(e) => handleMealChange(index, 'calories', e.target.value)}
                />
              </div>
            </div>
            <div className="form-group">
              <label>内容</label>
              <textarea
                placeholder="食事内容を記入"
                value={meal.content}
                onChange={(e) => handleMealChange(index, 'content', e.target.value)}
                rows="2"
              />
            </div>
          </div>
        ))}
      </div>

      <div className="health-section">
        <h4>💊 サプリメント</h4>
        <div className="supplements-list">
          {formData.supplements.map((supplement, index) => (
            <div key={index} className="supplement-item">
              <input
                type="text"
                placeholder="サプリ名"
                value={supplement.name}
                onChange={(e) => handleSupplementChange(index, 'name', e.target.value)}
                className="supplement-name"
              />
              <input
                type="text"
                placeholder="量"
                value={supplement.amount}
                onChange={(e) => handleSupplementChange(index, 'amount', e.target.value)}
                className="supplement-amount"
              />
              <input
                type="text"
                placeholder="タイミング"
                value={supplement.timing}
                onChange={(e) => handleSupplementChange(index, 'timing', e.target.value)}
                className="supplement-timing"
              />
              {formData.supplements.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeSupplement(index)}
                  className="remove-button"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addSupplement}
          className="add-supplement-button"
        >
          + サプリメントを追加
        </button>
      </div>

      <div className="form-group">
        <label>💧 水分摂取量（L）</label>
        <input
          type="number"
          step="0.1"
          placeholder="1.5"
          value={formData.water}
          onChange={(e) => handleInputChange('water', e.target.value)}
        />
      </div>

      <div className="form-group">
        <label>メモ</label>
        <textarea
          value={formData.note}
          onChange={(e) => handleInputChange('note', e.target.value)}
          placeholder="体調や気づいたことなど"
          rows="3"
        />
      </div>

      <button type="submit" className="submit-button">
        健康記録を保存
      </button>
    </form>
  )
}

export default HealthForm