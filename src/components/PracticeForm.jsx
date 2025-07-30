import React, { useState, useRef } from 'react'
import StarRating from './StarRating'
import './PracticeForm.css'

function PracticeForm({ onSubmit }) {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    startTime: '',
    endTime: '',
    category: 'batting',
    trainingPart: '',
    condition: 3,
    intensity: 3,
    menu: [{ name: '', value: '', unit: '回' }],
    note: '',
    videoFile: null,
    videoUrl: null
  })
  const videoInputRef = useRef(null)

  const practiceCategories = {
    batting: { label: '打撃練習', icon: '🏏' },
    pitching: { label: '投球練習', icon: '⚾' },
    fielding: { label: '守備練習', icon: '🧤' },
    running: { label: '走塁練習', icon: '🏃' },
    training: { label: 'トレーニング', icon: '💪' },
    rest: { label: '休養日', icon: '😴' }
  }

  const trainingParts = {
    chest: { label: '胸', icon: '🫁' },
    back: { label: '背中', icon: '🔙' },
    biceps: { label: '二頭筋', icon: '💪' },
    triceps: { label: '三頭筋', icon: '🦾' },
    legs: { label: '下半身', icon: '🦵' },
    abs: { label: '腹筋', icon: '🎯' },
    shoulders: { label: '肩', icon: '🤸' }
  }

  const commonUnits = ['回', '球', '本', '分', 'セット']

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }
  
  const handleVideoSelect = (e) => {
    const file = e.target.files[0]
    if (!file) return
    
    if (!file.type.startsWith('video/')) {
      alert('動画ファイルを選択してください')
      return
    }
    
    if (file.size > 100 * 1024 * 1024) {
      alert('ファイルサイズが大きすぎます。100MB以下の動画をアップロードしてください。')
      return
    }
    
    const url = URL.createObjectURL(file)
    setFormData(prev => ({
      ...prev,
      videoFile: file,
      videoUrl: url
    }))
  }
  
  const removeVideo = () => {
    if (formData.videoUrl) {
      URL.revokeObjectURL(formData.videoUrl)
    }
    setFormData(prev => ({
      ...prev,
      videoFile: null,
      videoUrl: null
    }))
    if (videoInputRef.current) {
      videoInputRef.current.value = ''
    }
  }

  const handleMenuChange = (index, field, value) => {
    const newMenu = [...formData.menu]
    newMenu[index] = { ...newMenu[index], [field]: value }
    setFormData(prev => ({
      ...prev,
      menu: newMenu
    }))
  }

  const addMenuItem = () => {
    setFormData(prev => ({
      ...prev,
      menu: [...prev.menu, { name: '', value: '', unit: '回' }]
    }))
  }

  const removeMenuItem = (index) => {
    if (formData.menu.length > 1) {
      const newMenu = formData.menu.filter((_, i) => i !== index)
      setFormData(prev => ({
        ...prev,
        menu: newMenu
      }))
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (formData.category === 'rest') {
      onSubmit({
        ...formData,
        menu: [],
        startTime: '00:00',
        endTime: '00:00'
      })
    } else {
      const validMenu = formData.menu.filter(item => item.name && item.value)
      if (validMenu.length === 0) {
        alert('練習メニューを少なくとも1つ入力してください')
        return
      }

      if (!formData.startTime || !formData.endTime) {
        alert('練習時間を入力してください')
        return
      }

      onSubmit({
        ...formData,
        menu: validMenu,
        videoData: formData.videoFile ? {
          url: formData.videoUrl,
          fileName: formData.videoFile.name,
          fileSize: formData.videoFile.size
        } : null
      })
    }


    if (formData.videoUrl) {
      URL.revokeObjectURL(formData.videoUrl)
    }
    setFormData({
      date: new Date().toISOString().split('T')[0],
      startTime: '',
      endTime: '',
      category: 'batting',
      condition: 3,
      intensity: 3,
      menu: [{ name: '', value: '', unit: '回' }],
      note: '',
      videoFile: null,
      videoUrl: null
    })
    if (videoInputRef.current) {
      videoInputRef.current.value = ''
    }
  }

  return (
    <form className="practice-form" onSubmit={handleSubmit}>
      <h3>📝 練習・休養記録</h3>
      
      <div className="form-row">
        <div className="form-group">
          <label>日付</label>
          <input
            type="date"
            value={formData.date}
            onChange={(e) => handleInputChange('date', e.target.value)}
            required
          />
        </div>
        
        {formData.category !== 'rest' && (
        <>
        <div className="form-group">
          <label>開始時間</label>
          <input
            type="time"
            value={formData.startTime}
            onChange={(e) => handleInputChange('startTime', e.target.value)}
            required
          />
        </div>
        
        <div className="form-group">
          <label>終了時間</label>
          <input
            type="time"
            value={formData.endTime}
            onChange={(e) => handleInputChange('endTime', e.target.value)}
            required
          />
        </div>
        </>
        )}
      </div>

      <div className="form-group">
        <label>練習カテゴリー</label>
        <div className="category-selector">
          {Object.entries(practiceCategories).map(([key, { label, icon }]) => (
            <button
              key={key}
              type="button"
              className={`category-button ${formData.category === key ? 'active' : ''}`}
              onClick={() => handleInputChange('category', key)}
            >
              <span className="category-icon">{icon}</span>
              <span className="category-label">{label}</span>
            </button>
          ))}
        </div>
      </div>

      {formData.category === 'training' && (
        <div className="form-group">
          <label>トレーニング部位</label>
          <div className="training-parts-selector">
            {Object.entries(trainingParts).map(([key, { label, icon }]) => (
              <button
                key={key}
                type="button"
                className={`part-button ${formData.trainingPart === key ? 'active' : ''}`}
                onClick={() => handleInputChange('trainingPart', key)}
              >
                <span className="part-icon">{icon}</span>
                <span className="part-label">{label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      <StarRating
        label="体調"
        value={formData.condition}
        onChange={(value) => handleInputChange('condition', value)}
      />

      {formData.category !== 'rest' && (
        <StarRating
          label="練習強度"
          value={formData.intensity}
          onChange={(value) => handleInputChange('intensity', value)}
        />
      )}

      {formData.category !== 'rest' && (
        <>
        <div className="form-group">
          <label>練習動画（任意）</label>
          <div className="video-upload-area">
            {!formData.videoFile ? (
              <>
                <input
                  ref={videoInputRef}
                  type="file"
                  accept="video/*"
                  onChange={handleVideoSelect}
                  className="video-input"
                  id="practice-video"
                />
                <label htmlFor="practice-video" className="video-label">
                  <span className="upload-icon">🎥</span>
                  <span className="upload-text">動画を追加</span>
                  <span className="upload-hint">フォーム確認や練習風景の動画</span>
                </label>
              </>
            ) : (
              <div className="video-preview">
                <video 
                  src={formData.videoUrl} 
                  controls 
                  className="preview-video"
                />
                <button
                  type="button"
                  onClick={removeVideo}
                  className="remove-video-btn"
                >
                  ✕ 動画を削除
                </button>
              </div>
            )}
          </div>
        </div>
        
        <div className="form-group">
          <label>練習メニュー</label>
        <div className="menu-items">
          {formData.menu.map((item, index) => (
            <div key={index} className="menu-item">
              <input
                type="text"
                placeholder="メニュー名"
                value={item.name}
                onChange={(e) => handleMenuChange(index, 'name', e.target.value)}
                className="menu-name"
              />
              <input
                type="number"
                placeholder="数値"
                value={item.value}
                onChange={(e) => handleMenuChange(index, 'value', e.target.value)}
                className="menu-value"
                min="0"
              />
              <select
                value={item.unit}
                onChange={(e) => handleMenuChange(index, 'unit', e.target.value)}
                className="menu-unit"
              >
                {commonUnits.map(unit => (
                  <option key={unit} value={unit}>{unit}</option>
                ))}
              </select>
              {formData.menu.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeMenuItem(index)}
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
          onClick={addMenuItem}
          className="add-menu-button"
        >
          + メニューを追加
        </button>
        </div>
        </>
      )}

      <div className="form-group">
        <label>メモ・感想</label>
        <textarea
          value={formData.note}
          onChange={(e) => handleInputChange('note', e.target.value)}
          placeholder="今日の練習で気づいたこと、改善点など"
          rows="4"
          className="note-textarea"
        />
      </div>

      <button type="submit" className="submit-button">
        練習記録を投稿
      </button>
    </form>
  )
}

export default PracticeForm