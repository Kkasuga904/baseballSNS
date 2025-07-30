import React, { useState, useEffect, useRef } from 'react'
import { searchFood } from '../data/foodDatabase'
import { useAuth } from '../App'
import './MealForm.css'

function MealForm({ onSubmit }) {
  const { user } = useAuth()
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [foodSuggestions, setFoodSuggestions] = useState([])
  const [selectedFoods, setSelectedFoods] = useState([])
  const [showQuickSelect, setShowQuickSelect] = useState(false)
  const fileInputRef = useRef(null)
  
  const [formData, setFormData] = useState({
    mealType: 'breakfast',
    description: '',
    calories: '',
    protein: '',
    carbs: '',
    fat: '',
    notes: '',
    imageUrl: '',
    imageFile: null,
    alcohol: false,
    alcoholAmount: '',
    alcoholType: ''
  })

  // ユーザーの年齢を取得して成人かどうか判定
  const [isAdult, setIsAdult] = useState(false)
  const [userProfile, setUserProfile] = useState(null)

  useEffect(() => {
    if (user) {
      const profileKey = `baseballSNSProfile_${user.email || 'guest'}`
      const savedProfile = localStorage.getItem(profileKey)
      if (savedProfile) {
        const profile = JSON.parse(savedProfile)
        setUserProfile(profile)
        
        // 年齢計算（生年月日が設定されている場合）
        if (profile.birthDate) {
          const today = new Date()
          const birthDate = new Date(profile.birthDate)
          let age = today.getFullYear() - birthDate.getFullYear()
          const monthDiff = today.getMonth() - birthDate.getMonth()
          if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--
          }
          setIsAdult(age >= 20)
        } else {
          // カテゴリーが社会人または大学4年以上の場合は成人と仮定
          const adultCategories = ['serious', 'amateur', 'pro']
          const isUniversityFourthYear = profile.category === 'university' && profile.grade === '4'
          setIsAdult(adultCategories.includes(profile.category) || isUniversityFourthYear)
        }
      }
    }
  }, [user])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // 食事内容が変更されたら食品を検索
    if (name === 'description' && value.length > 0) {
      const query = value.split(/[、,\s]/).pop() // 最後の単語を取得
      if (query.length > 0) {
        const suggestions = searchFood(query)
        setFoodSuggestions(suggestions)
        setShowSuggestions(suggestions.length > 0)
      }
    } else if (name === 'description' && value.length === 0) {
      setShowSuggestions(false)
      setSelectedFoods([])
    }
  }
  
  // 食品を選択したときの処理
  const selectFood = (food) => {
    const newFood = { ...food, quantity: 100 }
    setSelectedFoods([...selectedFoods, newFood])
    setShowSuggestions(false)
    
    // 栄養素を自動計算
    calculateNutrition([...selectedFoods, newFood])
  }
  
  // 選択した食品の量を変更
  const updateFoodQuantity = (index, quantity) => {
    const updatedFoods = [...selectedFoods]
    updatedFoods[index].quantity = parseFloat(quantity) || 0
    setSelectedFoods(updatedFoods)
    calculateNutrition(updatedFoods)
  }
  
  // 選択した食品を削除
  const removeFood = (index) => {
    const updatedFoods = selectedFoods.filter((_, i) => i !== index)
    setSelectedFoods(updatedFoods)
    calculateNutrition(updatedFoods)
  }
  
  // 栄養素を計算
  const calculateNutrition = (foods) => {
    const total = foods.reduce((acc, food) => {
      const ratio = (food.quantity || 100) / 100
      return {
        calories: acc.calories + (food.calories * ratio),
        protein: acc.protein + (food.protein * ratio),
        carbs: acc.carbs + (food.carbs * ratio),
        fat: acc.fat + (food.fat * ratio)
      }
    }, { calories: 0, protein: 0, carbs: 0, fat: 0 })
    
    setFormData(prev => ({
      ...prev,
      calories: Math.round(total.calories).toString(),
      protein: total.protein.toFixed(1),
      carbs: total.carbs.toFixed(1),
      fat: total.fat.toFixed(1)
    }))
  }

  // 画像選択処理
  const handleImageSelect = (e) => {
    const file = e.target.files[0]
    if (file) {
      const imageUrl = URL.createObjectURL(file)
      setFormData(prev => ({
        ...prev,
        imageFile: file,
        imageUrl
      }))
    }
  }
  
  // 画像削除処理
  const removeImage = () => {
    if (formData.imageUrl) {
      URL.revokeObjectURL(formData.imageUrl)
    }
    setFormData(prev => ({
      ...prev,
      imageFile: null,
      imageUrl: ''
    }))
  }
  
  // 主要な食品カテゴリー
  const quickFoodCategories = {
    '主食': [
      { food: 'ご飯（茶碗1杯150g）', calories: 252, protein: 3.8, carbs: 55.7, fat: 0.5 },
      { food: '食パン（6枚切り1枚）', calories: 158, protein: 5.6, carbs: 28.0, fat: 2.6 },
      { food: 'うどん（1玉230g）', calories: 242, protein: 6.0, carbs: 49.7, fat: 0.9 },
      { food: 'パスタ（乾麺100g）', calories: 379, protein: 12.2, carbs: 72.2, fat: 1.9 }
    ],
    'タンパク質': [
      { food: '鶏胸肉（100g）', calories: 108, protein: 22.3, carbs: 0, fat: 1.5 },
      { food: '卵（1個）', calories: 91, protein: 7.4, carbs: 0.2, fat: 6.2 },
      { food: '鮭（100g）', calories: 133, protein: 22.3, carbs: 0.1, fat: 4.1 },
      { food: '豆腐（1/2丁150g）', calories: 84, protein: 7.4, carbs: 3.0, fat: 4.5 }
    ],
    '野菜・その他': [
      { food: 'サラダ（1皿）', calories: 30, protein: 2.0, carbs: 5.0, fat: 0.5 },
      { food: '味噌汁（1杯）', calories: 40, protein: 3.0, carbs: 5.0, fat: 1.0 },
      { food: 'バナナ（1本）', calories: 86, protein: 1.1, carbs: 22.5, fat: 0.2 },
      { food: '牛乳（200ml）', calories: 134, protein: 6.6, carbs: 9.6, fat: 7.6 }
    ]
  }
  
  // クイック選択から食品を追加
  const addQuickFood = (food) => {
    const newFood = { ...food, quantity: 100 }
    setSelectedFoods([...selectedFoods, newFood])
    calculateNutrition([...selectedFoods, newFood])
    setShowQuickSelect(false)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit({
      ...formData,
      calories: formData.calories ? parseInt(formData.calories) : null,
      protein: formData.protein ? parseFloat(formData.protein) : null,
      carbs: formData.carbs ? parseFloat(formData.carbs) : null,
      fat: formData.fat ? parseFloat(formData.fat) : null,
      timestamp: new Date().toISOString()
    })
    
    // フォームをリセット
    if (formData.imageUrl) {
      URL.revokeObjectURL(formData.imageUrl)
    }
    setFormData({
      mealType: 'breakfast',
      description: '',
      calories: '',
      protein: '',
      carbs: '',
      fat: '',
      notes: '',
      imageUrl: '',
      imageFile: null,
      alcohol: false,
      alcoholAmount: '',
      alcoholType: ''
    })
    setSelectedFoods([])
  }

  return (
    <form className="meal-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label>食事タイプ</label>
        <select 
          name="mealType" 
          value={formData.mealType} 
          onChange={handleChange}
          required
        >
          <option value="breakfast">朝食</option>
          <option value="lunch">昼食</option>
          <option value="dinner">夕食</option>
          <option value="snack">間食</option>
          <option value="pre-training">練習前</option>
          <option value="post-training">練習後</option>
          <option value="supplement-meal">補食</option>
        </select>
      </div>

      <div className="form-group">
        <label>食事写真（任意）</label>
        <div className="image-upload-area">
          {!formData.imageUrl ? (
            <>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="image-input"
                id="meal-image"
              />
              <label htmlFor="meal-image" className="image-label">
                <span className="upload-icon">📷</span>
                <span className="upload-text">写真を追加</span>
                <span className="upload-hint">食事の写真を撮影または選択</span>
              </label>
            </>
          ) : (
            <div className="image-preview">
              <img src={formData.imageUrl} alt="食事写真" className="preview-image" />
              <button
                type="button"
                onClick={removeImage}
                className="remove-image-btn"
              >
                ✕ 写真を削除
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="form-group">
        <label>食事内容</label>
        <div className="quick-select-section">
          <button
            type="button"
            className="quick-select-toggle"
            onClick={() => setShowQuickSelect(!showQuickSelect)}
          >
            🍱 主要な食品から選択
          </button>
          
          {showQuickSelect && (
            <div className="quick-food-categories">
              {Object.entries(quickFoodCategories).map(([category, foods]) => (
                <div key={category} className="food-category">
                  <h5>{category}</h5>
                  <div className="quick-food-items">
                    {foods.map((food, index) => (
                      <button
                        key={index}
                        type="button"
                        className="quick-food-item"
                        onClick={() => addQuickFood(food)}
                      >
                        <span className="food-name">{food.food}</span>
                        <span className="food-calories">{food.calories}kcal</span>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="food-input-wrapper">
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="例：ご飯、鶏胸肉、サラダ、味噌汁"
            rows="3"
            required
          />
          
          {showSuggestions && (
            <div className="food-suggestions">
              {foodSuggestions.map((food, index) => (
                <div
                  key={index}
                  className="food-suggestion-item"
                  onClick={() => selectFood(food)}
                >
                  <span className="food-name">{food.food}</span>
                  <span className="food-nutrition">
                    {food.calories}kcal | P:{food.protein}g
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {selectedFoods.length > 0 && (
          <div className="selected-foods">
            <h4>選択した食品</h4>
            {selectedFoods.map((food, index) => (
              <div key={index} className="selected-food-item">
                <span className="food-name">{food.food}</span>
                <input
                  type="number"
                  value={food.quantity}
                  onChange={(e) => updateFoodQuantity(index, e.target.value)}
                  min="0"
                  step="10"
                  className="quantity-input"
                />
                <span className="unit">g</span>
                <button
                  type="button"
                  onClick={() => removeFood(index)}
                  className="remove-food-btn"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="nutrition-inputs">
        <div className="form-group">
          <label>カロリー (kcal)</label>
          <input
            type="number"
            name="calories"
            value={formData.calories}
            onChange={handleChange}
            placeholder="500"
            min="0"
          />
        </div>

        <div className="form-group">
          <label>タンパク質 (g)</label>
          <input
            type="number"
            name="protein"
            value={formData.protein}
            onChange={handleChange}
            placeholder="30"
            min="0"
            step="0.1"
          />
        </div>

        <div className="form-group">
          <label>炭水化物 (g)</label>
          <input
            type="number"
            name="carbs"
            value={formData.carbs}
            onChange={handleChange}
            placeholder="60"
            min="0"
            step="0.1"
          />
        </div>

        <div className="form-group">
          <label>脂質 (g)</label>
          <input
            type="number"
            name="fat"
            value={formData.fat}
            onChange={handleChange}
            placeholder="15"
            min="0"
            step="0.1"
          />
        </div>
      </div>

      <div className="form-group">
        <label>メモ</label>
        <textarea
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          placeholder="体調やトレーニングとの関係など"
          rows="2"
        />
      </div>

      {isAdult && (
        <div className="alcohol-section">
          <div className="form-group">
            <label className="alcohol-checkbox-label">
              <input
                type="checkbox"
                name="alcohol"
                checked={formData.alcohol}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  alcohol: e.target.checked,
                  alcoholAmount: e.target.checked ? prev.alcoholAmount : '',
                  alcoholType: e.target.checked ? prev.alcoholType : ''
                }))}
              />
              <span className="alcohol-icon">🍺</span>
              飲酒を記録する
            </label>
          </div>

          {formData.alcohol && (
            <div className="alcohol-details">
              <div className="alcohol-inputs">
                <div className="form-group">
                  <label>お酒の種類</label>
                  <select
                    name="alcoholType"
                    value={formData.alcoholType}
                    onChange={handleChange}
                    required={formData.alcohol}
                  >
                    <option value="">選択してください</option>
                    <option value="beer">ビール</option>
                    <option value="wine">ワイン</option>
                    <option value="sake">日本酒</option>
                    <option value="shochu">焼酎</option>
                    <option value="whiskey">ウイスキー</option>
                    <option value="cocktail">カクテル</option>
                    <option value="chuhai">チューハイ</option>
                    <option value="other">その他</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>飲酒量</label>
                  <div className="alcohol-amount-input">
                    <input
                      type="number"
                      name="alcoholAmount"
                      value={formData.alcoholAmount}
                      onChange={handleChange}
                      placeholder="1"
                      min="0"
                      step="0.5"
                      required={formData.alcohol}
                    />
                    <span className="amount-unit">
                      {formData.alcoholType === 'beer' && '本 (350ml)'}
                      {formData.alcoholType === 'wine' && 'グラス (150ml)'}
                      {formData.alcoholType === 'sake' && '合 (180ml)'}
                      {formData.alcoholType === 'shochu' && '杯 (60ml)'}
                      {formData.alcoholType === 'whiskey' && 'ショット (30ml)'}
                      {formData.alcoholType === 'cocktail' && '杯 (200ml)'}
                      {formData.alcoholType === 'chuhai' && '本 (350ml)'}
                      {formData.alcoholType === 'other' && '杯'}
                      {!formData.alcoholType && '杯'}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="alcohol-warning">
                <p>⚠️ 適度な飲酒を心がけ、トレーニングや体調管理に配慮しましょう</p>
              </div>
            </div>
          )}
        </div>
      )}

      <button type="submit" className="submit-button">
        食事を記録
      </button>
    </form>
  )
}

export default MealForm