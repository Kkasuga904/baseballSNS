import React, { useState, useEffect } from 'react'
import SimpleTextEditor from './SimpleTextEditor'
import MobileTextEditor from './MobileTextEditor2'
import { useAutoSaveForm } from '../hooks/useAutoSave'
import './SimpleDiaryForm.css'

function SimpleDiaryForm({ onSave, onCancel, selectedDate }) {
  const [content, setContent] = useState('')
  const [isMobile, setIsMobile] = useState(false)
  
  // モバイル検出
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768 || /iPhone|iPad|iPod|Android/i.test(navigator.userAgent))
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])
  
  // 選択された日付または現在の日時を取得
  const now = new Date()
  const targetDate = selectedDate ? new Date(selectedDate) : now
  
  // フォームIDを生成（日付ベース）
  const formId = `diary_${selectedDate || now.toISOString().split('T')[0]}`
  
  // 自動保存フックを使用
  const { save: autoSave, loadDraft, clearDraft } = useAutoSaveForm(formId, { content }, 2000)
  
  // コンポーネントマウント時に下書きを読み込む
  useEffect(() => {
    const draft = loadDraft()
    if (draft && draft.content) {
      setContent(draft.content)
    }
  }, [])
  
  // 日付表示用の文字列を生成（日本語表記）
  const year = targetDate.getFullYear()
  const month = targetDate.getMonth() + 1
  const day = targetDate.getDate()
  const weekdays = ['日', '月', '火', '水', '木', '金', '土']
  const weekday = weekdays[targetDate.getDay()]
  const hour = now.getHours()
  const minute = now.getMinutes().toString().padStart(2, '0')
  
  const dateStr = `${year}年${month}月${day}日(${weekday}) ${hour}:${minute}`

  const handleSave = () => {
    if (content.trim()) {
      // 選択された日付がある場合は、その日付の現在時刻を設定
      const saveDate = selectedDate ? new Date(selectedDate) : now
      if (selectedDate) {
        // 選択された日付の場合、現在の時刻を設定
        saveDate.setHours(now.getHours())
        saveDate.setMinutes(now.getMinutes())
        saveDate.setSeconds(now.getSeconds())
      }
      
      onSave({
        id: Date.now(),
        date: selectedDate || now.toISOString().split('T')[0],
        content: content.trim(),
        createdAt: saveDate.toISOString()
      })
      
      // 保存後は下書きをクリア
      clearDraft()
    }
  }
  
  const handleCancel = () => {
    // キャンセル時も下書きをクリア（保存された内容なので）
    clearDraft()
    onCancel()
  }

  return (
    <div className="simple-diary-form">
      <div className="diary-form-header">
        <button className="back-button" onClick={handleCancel}>
          <span className="back-arrow">←</span>
          <span className="back-text">戻る</span>
        </button>
        <div className="diary-date-info">
          {dateStr}
        </div>
        <button 
          className="done-button"
          onClick={handleSave}
          disabled={!content.trim()}
        >
          Done
        </button>
      </div>
      
      <div className="diary-content-area">
        {isMobile ? (
          <MobileTextEditor
            content={content}
            onChange={setContent}
            placeholder="今日の練習内容を記録..."
          />
        ) : (
          <SimpleTextEditor
            content={content}
            onChange={setContent}
            placeholder="今日の練習内容を記録..."
          />
        )}
      </div>
    </div>
  )
}

export default SimpleDiaryForm