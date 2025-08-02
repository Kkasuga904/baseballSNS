import React, { useState } from 'react'
import './DiaryForm.css'

function DiaryForm({ onSave, onCancel, editingDiary = null }) {
  const [title, setTitle] = useState(editingDiary?.title || '今日の振り返り')
  const [content, setContent] = useState(editingDiary?.content || '')
  const [mood, setMood] = useState(editingDiary?.mood || 'normal')
  const [weather, setWeather] = useState(editingDiary?.weather || 'sunny')
  const [tags, setTags] = useState(editingDiary?.tags || [])
  const [tagInput, setTagInput] = useState('')
  const [todayGoods, setTodayGoods] = useState(editingDiary?.todayGoods || '')
  const [todayBads, setTodayBads] = useState(editingDiary?.todayBads || '')
  const [tomorrowGoals, setTomorrowGoals] = useState(editingDiary?.tomorrowGoals || '')

  const moods = [
    { value: 'excellent', emoji: '😄', label: '最高' },
    { value: 'good', emoji: '😊', label: '良い' },
    { value: 'normal', emoji: '😐', label: '普通' },
    { value: 'bad', emoji: '😔', label: '悪い' },
    { value: 'terrible', emoji: '😢', label: '最悪' }
  ]

  const weathers = [
    { value: 'sunny', emoji: '☀️', label: '晴れ' },
    { value: 'cloudy', emoji: '☁️', label: '曇り' },
    { value: 'rainy', emoji: '🌧️', label: '雨' },
    { value: 'snowy', emoji: '❄️', label: '雪' },
    { value: 'windy', emoji: '💨', label: '風' }
  ]

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!title.trim() || !content.trim()) {
      alert('タイトルと内容を入力してください')
      return
    }

    const diaryData = {
      id: editingDiary?.id || Date.now().toString(),
      title: title.trim(),
      content: content.trim(),
      mood,
      weather,
      tags,
      todayGoods: todayGoods.trim(),
      todayBads: todayBads.trim(),
      tomorrowGoals: tomorrowGoals.trim(),
      date: editingDiary?.date || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    onSave(diaryData)
  }

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()])
      setTagInput('')
    }
  }

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove))
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAddTag()
    }
  }

  return (
    <div className="diary-form">
      <h3>{editingDiary ? '日記を編集' : '新しい日記を書く'}</h3>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="diary-title">タイトル</label>
          <input
            id="diary-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="今日の出来事"
            maxLength={100}
            required
          />
        </div>

        <div className="mood-weather-section">
          <div className="mood-section">
            <label>今日の気分</label>
            <div className="mood-options">
              {moods.map(m => (
                <button
                  key={m.value}
                  type="button"
                  className={`mood-option ${mood === m.value ? 'selected' : ''}`}
                  onClick={() => setMood(m.value)}
                  title={m.label}
                >
                  <span className="mood-emoji">{m.emoji}</span>
                  <span className="mood-label">{m.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="weather-section">
            <label>天気</label>
            <div className="weather-options">
              {weathers.map(w => (
                <button
                  key={w.value}
                  type="button"
                  className={`weather-option ${weather === w.value ? 'selected' : ''}`}
                  onClick={() => setWeather(w.value)}
                  title={w.label}
                >
                  <span className="weather-emoji">{w.emoji}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="diary-content">内容</label>
          <textarea
            id="diary-content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="今日はどんな一日でしたか？練習の内容、試合の結果、気づいたことなど..."
            rows={8}
            required
          />
          <div className="char-count">{content.length} / 2000文字</div>
        </div>

        {/* 1日の振り返りセクション */}
        <div className="reflection-section">
          <h3 className="reflection-title">
            <span className="reflection-icon">📝</span>
            今日の振り返り
          </h3>
          
          <div className="form-group">
            <label htmlFor="today-goods">
              <span className="label-icon">✨</span>
              今日良かったこと・できたこと
            </label>
            <textarea
              id="today-goods"
              value={todayGoods}
              onChange={(e) => setTodayGoods(e.target.value)}
              placeholder="・素振り100回達成した&#10;・守備練習でエラーなしだった&#10;・チームメイトと良いコミュニケーションが取れた"
              rows={4}
              className="reflection-textarea"
            />
          </div>

          <div className="form-group">
            <label htmlFor="today-bads">
              <span className="label-icon">💭</span>
              改善が必要なこと・課題
            </label>
            <textarea
              id="today-bads"
              value={todayBads}
              onChange={(e) => setTodayBads(e.target.value)}
              placeholder="・バッティングでタイミングが合わなかった&#10;・集中力が途切れることがあった&#10;・もっと声を出すべきだった"
              rows={4}
              className="reflection-textarea"
            />
          </div>

          <div className="form-group">
            <label htmlFor="tomorrow-goals">
              <span className="label-icon">🎯</span>
              明日の目標・やることリスト
            </label>
            <textarea
              id="tomorrow-goals"
              value={tomorrowGoals}
              onChange={(e) => setTomorrowGoals(e.target.value)}
              placeholder="・バッティング練習でタイミングを意識する&#10;・守備の基本動作を再確認&#10;・ストレッチを念入りに行う"
              rows={4}
              className="reflection-textarea"
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="diary-tags">タグ（任意）</label>
          <div className="tag-input-wrapper">
            <input
              id="diary-tags"
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="タグを追加（Enterキーで追加）"
            />
            <button
              type="button"
              onClick={handleAddTag}
              className="add-tag-button"
              disabled={!tagInput.trim()}
            >
              追加
            </button>
          </div>
          <div className="tags-list">
            {tags.map(tag => (
              <span key={tag} className="tag">
                {tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="remove-tag"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        <div className="form-actions">
          <button
            type="button"
            onClick={onCancel}
            className="cancel-button"
          >
            キャンセル
          </button>
          <button
            type="submit"
            className="submit-button"
          >
            {editingDiary ? '更新する' : '保存する'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default DiaryForm