/**
 * SimplifiedPracticeForm.jsx - 簡素化された練習記録フォーム
 * 
 * ユーザビリティを重視し、必須項目を明確にした練習記録フォーム
 * 段階的な入力により、ユーザーの負担を軽減
 */

import React, { useState, useEffect } from 'react'
import StarRating from './StarRating'
import LoadingSpinner from './LoadingSpinner'
import { useAuth } from '../App'
import './SimplifiedPracticeForm.css'

function SimplifiedPracticeForm({ onSubmit, selectedDate, onClose }) {
  const { user } = useAuth()
  
  // 初期フォームデータ（必須項目のみ）
  const [formData, setFormData] = useState({
    date: selectedDate || new Date().toISOString().split('T')[0],
    category: '',
    condition: 3,
    note: '',
    // オプション項目
    menu: [],
    startTime: '',
    endTime: '',
    intensity: 3
  })
  
  // 入力ステップの管理
  const [currentStep, setCurrentStep] = useState(1)
  const [showOptionalFields, setShowOptionalFields] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [validationErrors, setValidationErrors] = useState({})
  
  // カテゴリー定義（簡素化）
  const categories = [
    { value: 'batting', label: '打撃', icon: '⚾' },
    { value: 'pitching', label: '投球', icon: '🎯' },
    { value: 'fielding', label: '守備', icon: '🧤' },
    { value: 'running', label: '走塁', icon: '🏃' },
    { value: 'training', label: 'トレーニング', icon: '💪' },
    { value: 'game', label: '試合', icon: '🏆' },
    { value: 'other', label: 'その他', icon: '📝' }
  ]
  
  // よく使う練習メニュー（カテゴリー別）
  const commonMenuItems = {
    batting: ['素振り', 'ティーバッティング', 'フリーバッティング', 'バント練習'],
    pitching: ['キャッチボール', 'ピッチング', 'シャドーピッチング', '投球フォーム確認'],
    fielding: ['ノック', 'ゴロ捕球', 'フライ捕球', '送球練習'],
    running: ['ベースランニング', 'ダッシュ', '盗塁練習', 'スライディング'],
    training: ['筋トレ', 'ストレッチ', '体幹トレーニング', 'ランニング'],
    game: ['練習試合', '公式戦', '紅白戦'],
    other: ['ミーティング', 'ビデオ分析', 'メンタルトレーニング']
  }
  
  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }
  
  const handleAddMenuItem = (item) => {
    if (!formData.menu.includes(item)) {
      handleInputChange('menu', [...formData.menu, item])
    }
  }
  
  const handleRemoveMenuItem = (item) => {
    handleInputChange('menu', formData.menu.filter(m => m !== item))
  }
  
  const validateStep = (step) => {
    const errors = {}
    
    if (step >= 1) {
      if (!formData.date) {
        errors.date = '練習日を選択してください'
      }
      if (!formData.category) {
        errors.category = '練習カテゴリーを選択してください'
      }
    }
    
    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // 全ステップのバリデーション
    if (!validateStep(3)) {
      alert('必須項目を入力してください')
      return
    }
    
    setIsSubmitting(true)
    
    try {
      // 送信データの整形
      const submitData = {
        ...formData,
        userId: user?.id || 'anonymous',
        timestamp: new Date().toISOString()
      }
      
      // 送信処理（シミュレートのため少し待つ）
      await new Promise(resolve => setTimeout(resolve, 500))
      
      onSubmit(submitData)
    } catch (error) {
      alert('保存に失敗しました。もう一度お試しください。')
    } finally {
      setIsSubmitting(false)
    }
  }
  
  const nextStep = () => {
    if (validateStep(currentStep) && currentStep < 3) {
      setCurrentStep(currentStep + 1)
    }
  }
  
  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1)
  }
  
  return (
    <div className="simplified-practice-form">
      {/* ヘッダー */}
      <div className="form-header">
        <button
          type="button"
          className="back-button"
          onClick={onClose}
          aria-label="戻る"
        >
          ←
        </button>
        <h2>練習記録</h2>
        <div className="step-indicator">
          {[1, 2, 3].map(step => (
            <span
              key={step}
              className={`step ${currentStep >= step ? 'active' : ''}`}
            />
          ))}
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="form-content">
        {/* ステップ1: 基本情報 */}
        {currentStep === 1 && (
          <div className="form-step">
            <h3>基本情報</h3>
            
            {/* 日付（必須） */}
            <div className="form-group">
              <label className="required">練習日</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => {
                  handleInputChange('date', e.target.value)
                  if (validationErrors.date) {
                    setValidationErrors(prev => ({ ...prev, date: null }))
                  }
                }}
                className={validationErrors.date ? 'error' : ''}
                required
              />
              {validationErrors.date && (
                <span className="error-message">{validationErrors.date}</span>
              )}
            </div>
            
            {/* カテゴリー（必須） */}
            <div className="form-group">
              <label className="required">練習カテゴリー</label>
              <div className="category-grid">
                {categories.map(cat => (
                  <button
                    key={cat.value}
                    type="button"
                    className={`category-button ${formData.category === cat.value ? 'selected' : ''}`}
                    onClick={() => {
                      handleInputChange('category', cat.value)
                      if (validationErrors.category) {
                        setValidationErrors(prev => ({ ...prev, category: null }))
                      }
                    }}
                  >
                    <span className="category-icon">{cat.icon}</span>
                    <span className="category-label">{cat.label}</span>
                  </button>
                ))}
              </div>
              {validationErrors.category && (
                <span className="error-message">{validationErrors.category}</span>
              )}
            </div>
            
            <button
              type="button"
              className="next-button"
              onClick={nextStep}
              disabled={!formData.category}
            >
              次へ →
            </button>
          </div>
        )}
        
        {/* ステップ2: 練習内容 */}
        {currentStep === 2 && (
          <div className="form-step">
            <h3>練習内容</h3>
            
            {/* コンディション（必須） */}
            <div className="form-group">
              <label className="required">今日のコンディション</label>
              <StarRating
                rating={formData.condition}
                onRatingChange={(rating) => handleInputChange('condition', rating)}
              />
            </div>
            
            {/* 練習メニュー（オプション） */}
            <div className="form-group">
              <label>練習メニュー（複数選択可）</label>
              <div className="menu-chips">
                {commonMenuItems[formData.category]?.map(item => (
                  <button
                    key={item}
                    type="button"
                    className={`menu-chip ${formData.menu.includes(item) ? 'selected' : ''}`}
                    onClick={() => 
                      formData.menu.includes(item) 
                        ? handleRemoveMenuItem(item)
                        : handleAddMenuItem(item)
                    }
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
            
            {/* 詳細設定の表示/非表示 */}
            <button
              type="button"
              className="toggle-optional"
              onClick={() => setShowOptionalFields(!showOptionalFields)}
            >
              {showOptionalFields ? '詳細設定を隠す' : '詳細設定を表示'}
            </button>
            
            {showOptionalFields && (
              <div className="optional-fields">
                <div className="form-group">
                  <label>開始時刻</label>
                  <input
                    type="time"
                    value={formData.startTime}
                    onChange={(e) => handleInputChange('startTime', e.target.value)}
                  />
                </div>
                
                <div className="form-group">
                  <label>終了時刻</label>
                  <input
                    type="time"
                    value={formData.endTime}
                    onChange={(e) => handleInputChange('endTime', e.target.value)}
                  />
                </div>
                
                <div className="form-group">
                  <label>練習強度</label>
                  <StarRating
                    rating={formData.intensity}
                    onRatingChange={(rating) => handleInputChange('intensity', rating)}
                  />
                </div>
              </div>
            )}
            
            <div className="button-group">
              <button type="button" className="prev-button" onClick={prevStep}>
                ← 戻る
              </button>
              <button type="button" className="next-button" onClick={nextStep}>
                次へ →
              </button>
            </div>
          </div>
        )}
        
        {/* ステップ3: メモと確認 */}
        {currentStep === 3 && (
          <div className="form-step">
            <h3>メモ・振り返り</h3>
            
            {/* メモ（オプション） */}
            <div className="form-group">
              <label>今日の振り返り・メモ</label>
              <textarea
                value={formData.note}
                onChange={(e) => handleInputChange('note', e.target.value)}
                placeholder="今日の練習で気づいたこと、改善点など..."
                rows={4}
              />
            </div>
            
            {/* 入力内容の確認 */}
            <div className="summary">
              <h4>入力内容の確認</h4>
              <dl>
                <dt>日付:</dt>
                <dd>{formData.date}</dd>
                <dt>カテゴリー:</dt>
                <dd>{categories.find(c => c.value === formData.category)?.label}</dd>
                <dt>コンディション:</dt>
                <dd>{'⭐'.repeat(formData.condition)}</dd>
                {formData.menu.length > 0 && (
                  <>
                    <dt>練習メニュー:</dt>
                    <dd>{formData.menu.join('、')}</dd>
                  </>
                )}
              </dl>
            </div>
            
            <div className="button-group">
              <button type="button" className="prev-button" onClick={prevStep}>
                ← 戻る
              </button>
              <button 
                type="submit" 
                className="submit-button"
                disabled={isSubmitting}
              >
                {isSubmitting ? <LoadingSpinner size="small" /> : '記録を保存'}
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  )
}

export default SimplifiedPracticeForm