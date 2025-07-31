/**
 * HealthForm.jsx - 健康記録フォームコンポーネント
 * 
 * 野球選手の日々の健康状態を総合的に記録するフォーム。
 * 睡眠、食事、サプリメント、水分摂取量などを管理。
 * 
 * 主な機能:
 * - 睡眠記録（就寝・起床時間、質の評価）
 * - 食事記録（朝・昼・夕のカロリーと内容）
 * - サプリメント管理（動的追加・削除可能）
 * - 水分摂取量の記録
 * - 睡眠時間の自動計算
 */

import React, { useState } from 'react'
import './HealthForm.css'

/**
 * 健康記録フォームコンポーネント
 * 
 * @param {Object} props
 * @param {Function} props.onSubmit - 健康記録送信時のコールバック関数
 */
function HealthForm({ onSubmit }) {
  /**
   * フォームの状態管理
   * 初期値では今日の日付と空の入力フィールドを設定
   */
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0], // YYYY-MM-DD形式
    sleep: {
      bedTime: '',      // 就寝時間
      wakeTime: '',     // 起床時間
      quality: 3        // 睡眠の質（1-5の5段階評価）
    },
    meals: [
      { type: 'breakfast', time: '', content: '', calories: '' },
      { type: 'lunch', time: '', content: '', calories: '' },
      { type: 'dinner', time: '', content: '', calories: '' }
    ],
    supplements: [
      { name: '', amount: '', timing: '' } // サプリ名、量、摂取タイミング
    ],
    water: '',  // 水分摂取量（リットル）
    note: ''    // 自由記述メモ
  })

  /**
   * 食事タイプのラベル変換マップ
   */
  const mealLabels = {
    breakfast: '朝食',
    lunch: '昼食',
    dinner: '夕食'
  }

  /**
   * ルートレベルの入力変更ハンドラー
   * 
   * @param {string} field - 更新するフィールド名
   * @param {any} value - 新しい値
   */
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  /**
   * 睡眠データの変更ハンドラー
   * ネストされた睡眠オブジェクト内のフィールドを更新
   * 
   * @param {string} field - 睡眠オブジェクト内のフィールド名
   * @param {any} value - 新しい値
   */
  const handleSleepChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      sleep: {
        ...prev.sleep,
        [field]: value
      }
    }))
  }

  /**
   * 食事データの変更ハンドラー
   * 配列内の特定の食事オブジェクトを更新
   * 
   * @param {number} index - 食事配列のインデックス
   * @param {string} field - 更新するフィールド名
   * @param {any} value - 新しい値
   */
  const handleMealChange = (index, field, value) => {
    const newMeals = [...formData.meals]
    newMeals[index] = { ...newMeals[index], [field]: value }
    setFormData(prev => ({
      ...prev,
      meals: newMeals
    }))
  }

  /**
   * サプリメントデータの変更ハンドラー
   * 配列内の特定のサプリメントオブジェクトを更新
   * 
   * @param {number} index - サプリメント配列のインデックス
   * @param {string} field - 更新するフィールド名
   * @param {any} value - 新しい値
   */
  const handleSupplementChange = (index, field, value) => {
    const newSupplements = [...formData.supplements]
    newSupplements[index] = { ...newSupplements[index], [field]: value }
    setFormData(prev => ({
      ...prev,
      supplements: newSupplements
    }))
  }

  /**
   * サプリメントを追加するハンドラー
   * 空のサプリメントオブジェクトを配列に追加
   */
  const addSupplement = () => {
    setFormData(prev => ({
      ...prev,
      supplements: [...prev.supplements, { name: '', amount: '', timing: '' }]
    }))
  }

  /**
   * サプリメントを削除するハンドラー
   * 最低1つは残すように制御
   * 
   * @param {number} index - 削除するサプリメントのインデックス
   */
  const removeSupplement = (index) => {
    if (formData.supplements.length > 1) {
      const newSupplements = formData.supplements.filter((_, i) => i !== index)
      setFormData(prev => ({
        ...prev,
        supplements: newSupplements
      }))
    }
  }

  /**
   * フォーム送信ハンドラー
   * 睡眠時間の計算を行い、データを送信
   * 
   * @param {Event} e - フォームイベント
   */
  const handleSubmit = (e) => {
    e.preventDefault()
    
    // 睡眠時間の計算
    if (formData.sleep.bedTime && formData.sleep.wakeTime) {
      // 仮の日付を使用して時間差を計算
      const bedTime = new Date(`2000-01-01 ${formData.sleep.bedTime}`)
      let wakeTime = new Date(`2000-01-01 ${formData.sleep.wakeTime}`)
      
      // 翌日起床の場合の処理（例: 23:00就寝、6:00起床）
      if (wakeTime < bedTime) {
        wakeTime = new Date(`2000-01-02 ${formData.sleep.wakeTime}`)
      }
      
      // ミリ秒から時間に変換
      const sleepDuration = (wakeTime - bedTime) / (1000 * 60 * 60)
      formData.sleep.duration = sleepDuration
    }

    // 親コンポーネントにデータを送信
    onSubmit(formData)

    // フォームを初期状態にリセット
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

  // コンポーネントのレンダリング
  return (
    <form className="health-form" onSubmit={handleSubmit}>
      <h3>🏥 健康記録</h3>

      {/* 日付選択セクション */}
      <div className="form-group">
        <label>日付</label>
        <input
          type="date"
          value={formData.date}
          onChange={(e) => handleInputChange('date', e.target.value)}
          required
        />
      </div>

      {/* 睡眠記録セクション */}
      <div className="health-section">
        <h4>😴 睡眠</h4>
        {/* 就寝・起床時間の入力 */}
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
        
        {/* 睡眠の質評価（1-5の5段階） */}
        <div className="form-group">
          <label>睡眠の質</label>
          <div className="quality-selector">
            {/* 5段階評価ボタンを動的生成 */}
            {[1, 2, 3, 4, 5].map(num => (
              <button
                key={num}
                type="button"
                className={`quality-button ${formData.sleep.quality === num ? 'active' : ''}`}
                onClick={() => handleSleepChange('quality', num)}
              >
                {/* 評価に応じた絵文字を表示 */}
                {num === 1 ? '😫' : num === 2 ? '😣' : num === 3 ? '😐' : num === 4 ? '😊' : '😴'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 食事記録セクション */}
      <div className="health-section">
        <h4>🍽️ 食事</h4>
        {/* 朝・昼・夕の食事をそれぞれ表示 */}
        {formData.meals.map((meal, index) => (
          <div key={meal.type} className="meal-item">
            <h5>{mealLabels[meal.type]}</h5>
            {/* 時間とカロリーの入力横並び */}
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
            {/* 食事内容のテキストエリア */}
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

      {/* サプリメント記録セクション */}
      <div className="health-section">
        <h4>💊 サプリメント</h4>
        <div className="supplements-list">
          {/* サプリメントリストを動的表示 */}
          {formData.supplements.map((supplement, index) => (
            <div key={index} className="supplement-item">
              {/* サプリ名入力 */}
              <input
                type="text"
                placeholder="サプリ名"
                value={supplement.name}
                onChange={(e) => handleSupplementChange(index, 'name', e.target.value)}
                className="supplement-name"
              />
              {/* 量入力 */}
              <input
                type="text"
                placeholder="量"
                value={supplement.amount}
                onChange={(e) => handleSupplementChange(index, 'amount', e.target.value)}
                className="supplement-amount"
              />
              {/* 摂取タイミング入力 */}
              <input
                type="text"
                placeholder="タイミング"
                value={supplement.timing}
                onChange={(e) => handleSupplementChange(index, 'timing', e.target.value)}
                className="supplement-timing"
              />
              {/* 削除ボタン（最低1つは残す） */}
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
        {/* サプリメント追加ボタン */}
        <button
          type="button"
          onClick={addSupplement}
          className="add-supplement-button"
        >
          + サプリメントを追加
        </button>
      </div>

      {/* 水分摂取量入力 */}
      <div className="form-group">
        <label>💧 水分摂取量（L）</label>
        <input
          type="number"
          step="0.1"  // 0.1リットル単位で入力
          placeholder="1.5"
          value={formData.water}
          onChange={(e) => handleInputChange('water', e.target.value)}
        />
      </div>

      {/* 自由記述メモ欄 */}
      <div className="form-group">
        <label>メモ</label>
        <textarea
          value={formData.note}
          onChange={(e) => handleInputChange('note', e.target.value)}
          placeholder="体調や気づいたことなど"
          rows="3"
        />
      </div>

      {/* 送信ボタン */}
      <button type="submit" className="submit-button">
        健康記録を保存
      </button>
    </form>
  )
}

export default HealthForm