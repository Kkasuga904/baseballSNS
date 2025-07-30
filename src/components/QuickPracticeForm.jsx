import React, { useState } from 'react'
import { useAuth } from '../App'
import './QuickPracticeForm.css'

function QuickPracticeForm({ onSubmit }) {
  const { user } = useAuth()
  const [selectedCategory, setSelectedCategory] = useState('')
  const [showSuccess, setShowSuccess] = useState(false)

  const practiceCategories = [
    { id: 'batting', label: 'バッティング', icon: '🏏', color: '#ff6b6b' },
    { id: 'pitching', label: 'ピッチング', icon: '⚾', color: '#4c6ef5' },
    { id: 'fielding', label: 'フィールディング', icon: '🧤', color: '#fab005' },
    { id: 'running', label: 'ランニング', icon: '🏃', color: '#51cf66' },
    { id: 'training', label: 'トレーニング', icon: '💪', color: '#ff8787' },
    { id: 'stretch', label: 'ストレッチ', icon: '🧘', color: '#91a7ff' },
    { id: 'catch', label: 'キャッチボール', icon: '🤾', color: '#ffd43b' },
    { id: 'game', label: '試合', icon: '⚔️', color: '#f06595' },
    { id: 'rest', label: '休養', icon: '😴', color: '#868e96' }
  ]

  const handleQuickSave = (category) => {
    const practiceData = {
      date: new Date().toISOString().split('T')[0],
      category: category.id,
      quickEntry: true,
      timestamp: new Date().toISOString()
    }

    onSubmit(practiceData)
    setSelectedCategory(category.id)
    setShowSuccess(true)

    // 2秒後に成功メッセージを非表示
    setTimeout(() => {
      setShowSuccess(false)
      setSelectedCategory('')
    }, 2000)
  }

  return (
    <div className="quick-practice-form">
      <div className="quick-form-header">
        <h3>⚡ クイック練習記録</h3>
        <p>タップするだけで今日の練習を記録</p>
      </div>

      <div className="practice-categories-grid">
        {practiceCategories.map(category => (
          <button
            key={category.id}
            className={`category-quick-button ${selectedCategory === category.id ? 'selected' : ''}`}
            onClick={() => handleQuickSave(category)}
            style={{
              '--category-color': category.color
            }}
          >
            <span className="category-quick-icon">{category.icon}</span>
            <span className="category-quick-label">{category.label}</span>
            {selectedCategory === category.id && showSuccess && (
              <span className="success-checkmark">✓</span>
            )}
          </button>
        ))}
      </div>

      {showSuccess && (
        <div className="success-message">
          <span className="success-icon">✅</span>
          練習を記録しました！
        </div>
      )}

      <div className="quick-form-hint">
        💡 詳細を記録したい場合は「練習記録」タブから入力してください
      </div>
    </div>
  )
}

export default QuickPracticeForm