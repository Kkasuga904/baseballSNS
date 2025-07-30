import React, { useState } from 'react'
import './ScheduleForm.css'

function ScheduleForm({ selectedDate, onSubmit }) {
  const [formData, setFormData] = useState({
    title: '',
    type: 'practice',
    startDate: selectedDate,
    endDate: selectedDate,
    startTime: '',
    endTime: '',
    location: '',
    description: '',
    reminder: true,
    isMultiDay: false,
    isAllDay: false
  })

  const scheduleTypes = {
    practice: { label: '練習予定', icon: '🏋️', color: '#2e7d46' },
    game: { label: '試合', icon: '⚾', color: '#ff6b6b' },
    meeting: { label: 'ミーティング', icon: '👥', color: '#4c6ef5' },
    event: { label: 'イベント', icon: '🎉', color: '#fab005' },
    study: { label: '学業・仕事', icon: '📚', color: '#7950f2' },
    personal: { label: 'プライベート', icon: '🏠', color: '#f06595' },
    medical: { label: '通院・健康', icon: '🏥', color: '#20c997' },
    other: { label: 'その他', icon: '📌', color: '#868e96' }
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!formData.title.trim()) {
      alert('予定のタイトルを入力してください')
      return
    }

    if (!formData.isMultiDay && !formData.isAllDay && !formData.startTime) {
      alert('開始時間を入力してください')
      return
    }

    onSubmit({
      ...formData,
      date: formData.startDate,
      id: Date.now(),
      createdAt: new Date().toISOString()
    })

    // フォームをリセット
    setFormData({
      title: '',
      type: 'practice',
      startDate: selectedDate,
      endDate: selectedDate,
      startTime: '',
      endTime: '',
      location: '',
      description: '',
      reminder: true,
      isMultiDay: false,
      isAllDay: false
    })
  }

  const generateICalEvent = () => {
    const event = formData
    const startDateTime = formData.isAllDay || !formData.startTime
      ? new Date(`${formData.startDate}T00:00:00`)
      : new Date(`${formData.startDate}T${formData.startTime}`)
    
    const endDateTime = formData.isMultiDay
      ? formData.endTime
        ? new Date(`${formData.endDate}T${formData.endTime}`)
        : new Date(`${formData.endDate}T23:59:59`)
      : formData.isAllDay
        ? new Date(`${formData.startDate}T23:59:59`)
        : formData.endTime 
          ? new Date(`${formData.startDate}T${formData.endTime}`)
          : new Date(startDateTime.getTime() + 60 * 60 * 1000) // 1時間後

    const icalContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Baseball SNS//Event//EN
BEGIN:VEVENT
UID:${Date.now()}@baseball-sns
DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')}Z
DTSTART:${startDateTime.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')}
DTEND:${endDateTime.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')}
SUMMARY:${event.title}
DESCRIPTION:${event.description}
LOCATION:${event.location}
END:VEVENT
END:VCALENDAR`

    const blob = new Blob([icalContent], { type: 'text/calendar' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `baseball-event-${selectedDate}.ics`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <form className="schedule-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label>予定のタイトル</label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => handleInputChange('title', e.target.value)}
          placeholder="例: バッティング練習"
          maxLength={50}
          required
        />
      </div>

      <div className="form-group">
        <label>種類</label>
        <div className="type-selector">
          {Object.entries(scheduleTypes).map(([key, { label, icon }]) => (
            <button
              key={key}
              type="button"
              className={`type-button ${formData.type === key ? 'active' : ''}`}
              onClick={() => handleInputChange('type', key)}
              style={{
                borderColor: formData.type === key ? scheduleTypes[key].color : '#e0e0e0',
                backgroundColor: formData.type === key ? `${scheduleTypes[key].color}20` : 'white'
              }}
            >
              <span className="type-icon">{icon}</span>
              <span className="type-label">{label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="schedule-options">
        <div className="form-group checkbox-group">
          <label>
            <input
              type="checkbox"
              checked={formData.isAllDay}
              onChange={(e) => {
                handleInputChange('isAllDay', e.target.checked)
                if (e.target.checked) {
                  handleInputChange('isMultiDay', false)
                }
              }}
            />
            <span className="checkbox-label">
              ☀️ 終日予定
            </span>
          </label>
        </div>

        <div className="form-group checkbox-group">
          <label>
            <input
              type="checkbox"
              checked={formData.isMultiDay}
              onChange={(e) => {
                handleInputChange('isMultiDay', e.target.checked)
                if (e.target.checked) {
                  handleInputChange('isAllDay', false)
                }
              }}
            />
            <span className="checkbox-label">
              📅 日をまたぐ予定（合宿・遠征など）
            </span>
          </label>
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>{formData.isMultiDay ? '開始日' : '日付'}</label>
          <input
            type="date"
            value={formData.startDate}
            onChange={(e) => handleInputChange('startDate', e.target.value)}
            required
          />
        </div>
        
        {formData.isMultiDay && (
          <div className="form-group">
            <label>終了日</label>
            <input
              type="date"
              value={formData.endDate}
              onChange={(e) => handleInputChange('endDate', e.target.value)}
              min={formData.startDate}
              required
            />
          </div>
        )}
      </div>

      {!formData.isAllDay && (
        <div className="form-row">
          <div className="form-group">
            <label>開始時間{formData.isMultiDay ? '（任意）' : ''}</label>
            <input
              type="time"
              value={formData.startTime}
              onChange={(e) => handleInputChange('startTime', e.target.value)}
              required={!formData.isMultiDay && !formData.isAllDay}
            />
          </div>
          
          <div className="form-group">
            <label>{formData.isMultiDay ? '終了時間（最終日・任意）' : '終了時間（任意）'}</label>
            <input
              type="time"
              value={formData.endTime}
              onChange={(e) => handleInputChange('endTime', e.target.value)}
            />
          </div>
        </div>
      )}

      <div className="form-group">
        <label>場所（任意）</label>
        <input
          type="text"
          value={formData.location}
          onChange={(e) => handleInputChange('location', e.target.value)}
          placeholder="例: 市民球場"
          maxLength={50}
        />
      </div>

      <div className="form-group">
        <label>メモ（任意）</label>
        <textarea
          value={formData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          placeholder="持ち物や注意事項など"
          rows="3"
          maxLength={200}
        />
      </div>

      <div className="form-group checkbox-group">
        <label>
          <input
            type="checkbox"
            checked={formData.reminder}
            onChange={(e) => handleInputChange('reminder', e.target.checked)}
          />
          <span className="checkbox-label">
            🔔 リマインダーを設定（カレンダーアプリに通知）
          </span>
        </label>
      </div>

      <div className="form-actions">
        <button type="submit" className="submit-button">
          予定を保存
        </button>
        
        {formData.title && (formData.startTime || formData.isMultiDay || formData.isAllDay) && (
          <button
            type="button"
            onClick={generateICalEvent}
            className="export-button"
          >
            📤 カレンダーに追加
          </button>
        )}
      </div>

      <div className="calendar-hint">
        💡 「カレンダーに追加」ボタンでiPhoneやGoogleカレンダーに予定を追加できます
      </div>
    </form>
  )
}

export default ScheduleForm