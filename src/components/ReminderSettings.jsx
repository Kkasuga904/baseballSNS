import React, { useState, useEffect } from 'react'
import './ReminderSettings.css'

function ReminderSettings() {
  // ユーザーごとのキーを作成
  const userKey = localStorage.getItem('baseballSNSUserKey') || 'guest'
  
  const [reminders, setReminders] = useState(() => {
    const saved = localStorage.getItem(`baseballSNSReminders_${userKey}`)
    return saved ? JSON.parse(saved) : []
  })

  const [showAddForm, setShowAddForm] = useState(false)
  const [newReminder, setNewReminder] = useState({
    title: '',
    time: '',
    frequency: 'daily',
    customDays: [],
    enabled: true,
    lastNotified: null
  })

  const [notificationPermission, setNotificationPermission] = useState(
    'Notification' in window ? Notification.permission : 'unsupported'
  )

  // 通知権限をリクエスト
  const requestNotificationPermission = async () => {
    if ('Notification' in window && notificationPermission === 'default') {
      const permission = await Notification.requestPermission()
      setNotificationPermission(permission)
    }
  }

  // リマインダーを保存
  const saveReminders = (updatedReminders) => {
    setReminders(updatedReminders)
    localStorage.setItem(`baseballSNSReminders_${userKey}`, JSON.stringify(updatedReminders))
  }

  // リマインダーを追加
  const addReminder = () => {
    if (!newReminder.title || !newReminder.time) {
      alert('タイトルと時間を入力してください')
      return
    }

    const reminder = {
      ...newReminder,
      id: Date.now(),
      createdAt: new Date().toISOString()
    }

    saveReminders([...reminders, reminder])
    setNewReminder({
      title: '',
      time: '',
      frequency: 'daily',
      customDays: [],
      enabled: true,
      lastNotified: null
    })
    setShowAddForm(false)
  }

  // リマインダーを削除
  const deleteReminder = (id) => {
    if (confirm('このリマインダーを削除しますか？')) {
      saveReminders(reminders.filter(r => r.id !== id))
    }
  }

  // リマインダーの有効/無効を切り替え
  const toggleReminder = (id) => {
    saveReminders(reminders.map(r => 
      r.id === id ? { ...r, enabled: !r.enabled } : r
    ))
  }

  // 曜日選択
  const toggleDay = (day) => {
    const days = newReminder.customDays
    if (days.includes(day)) {
      setNewReminder({
        ...newReminder,
        customDays: days.filter(d => d !== day)
      })
    } else {
      setNewReminder({
        ...newReminder,
        customDays: [...days, day]
      })
    }
  }

  // リマインダーチェック
  useEffect(() => {
    const checkReminders = () => {
      const now = new Date()
      const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
      const currentDay = now.getDay()
      const today = now.toDateString()

      reminders.forEach(reminder => {
        if (!reminder.enabled) return

        // 時間が一致するかチェック
        if (reminder.time !== currentTime) return

        // 今日既に通知したかチェック
        if (reminder.lastNotified === today) return

        // 頻度チェック
        let shouldNotify = false
        
        if (reminder.frequency === 'daily') {
          shouldNotify = true
        } else if (reminder.frequency === 'custom' && reminder.customDays.length > 0) {
          shouldNotify = reminder.customDays.includes(currentDay)
        }

        if (shouldNotify) {
          showNotification(reminder)
          
          // 最終通知日を更新
          saveReminders(reminders.map(r => 
            r.id === reminder.id ? { ...r, lastNotified: today } : r
          ))
        }
      })
    }

    // 1分ごとにチェック
    const interval = setInterval(checkReminders, 60000)
    
    // 初回チェック
    checkReminders()

    return () => clearInterval(interval)
  }, [reminders])

  // 通知を表示
  const showNotification = (reminder) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('⚾ Baseball SNS リマインダー', {
        body: reminder.title,
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        tag: `reminder-${reminder.id}`,
        requireInteraction: true
      })
    } else {
      // ブラウザ通知が使えない場合はアラート
      alert(`リマインダー: ${reminder.title}`)
    }
  }

  const frequencyOptions = [
    { value: 'daily', label: '毎日' },
    { value: 'custom', label: 'カスタム（曜日指定）' }
  ]

  const dayLabels = ['日', '月', '火', '水', '木', '金', '土']

  const commonReminders = [
    '朝のストレッチ',
    '素振り',
    'プロテイン摂取',
    'トレーニング',
    '栄養記録',
    '睡眠記録',
    '体重測定',
    'ランニング'
  ]

  return (
    <div className="reminder-settings">
      <div className="reminder-header">
        <h3>🔔 リマインダー設定</h3>
        <button
          className="add-reminder-btn"
          onClick={() => setShowAddForm(!showAddForm)}
        >
          + 新規追加
        </button>
      </div>

      {notificationPermission === 'default' && (
        <div className="notification-prompt">
          <p>リマインダー通知を受け取るには許可が必要です</p>
          <button onClick={requestNotificationPermission}>
            通知を許可する
          </button>
        </div>
      )}

      {showAddForm && (
        <div className="add-reminder-form">
          <div className="form-group">
            <label>リマインダー内容</label>
            <input
              type="text"
              value={newReminder.title}
              onChange={(e) => setNewReminder({...newReminder, title: e.target.value})}
              placeholder="例：素振り100回"
              list="reminder-suggestions"
            />
            <datalist id="reminder-suggestions">
              {commonReminders.map(item => (
                <option key={item} value={item} />
              ))}
            </datalist>
          </div>

          <div className="form-group">
            <label>通知時間</label>
            <input
              type="time"
              value={newReminder.time}
              onChange={(e) => setNewReminder({...newReminder, time: e.target.value})}
              required
            />
          </div>

          <div className="form-group">
            <label>頻度</label>
            <select
              value={newReminder.frequency}
              onChange={(e) => setNewReminder({...newReminder, frequency: e.target.value})}
            >
              {frequencyOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {newReminder.frequency === 'custom' && (
            <div className="form-group">
              <label>曜日選択</label>
              <div className="day-selector">
                {dayLabels.map((day, index) => (
                  <button
                    key={index}
                    type="button"
                    className={`day-btn ${newReminder.customDays.includes(index) ? 'active' : ''}`}
                    onClick={() => toggleDay(index)}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="form-actions">
            <button
              className="save-btn"
              onClick={addReminder}
            >
              保存
            </button>
            <button
              className="cancel-btn"
              onClick={() => {
                setShowAddForm(false)
                setNewReminder({
                  title: '',
                  time: '',
                  frequency: 'daily',
                  customDays: [],
                  enabled: true,
                  lastNotified: null
                })
              }}
            >
              キャンセル
            </button>
          </div>
        </div>
      )}

      <div className="reminders-list">
        {reminders.length === 0 ? (
          <p className="no-reminders">リマインダーが設定されていません</p>
        ) : (
          reminders.map(reminder => (
            <div key={reminder.id} className={`reminder-item ${!reminder.enabled ? 'disabled' : ''}`}>
              <div className="reminder-info">
                <h4>{reminder.title}</h4>
                <div className="reminder-details">
                  <span className="reminder-time">⏰ {reminder.time}</span>
                  <span className="reminder-frequency">
                    {reminder.frequency === 'daily' ? '毎日' : 
                     `${reminder.customDays.map(d => dayLabels[d]).join('・')}`}
                  </span>
                </div>
              </div>
              <div className="reminder-actions">
                <button
                  className="toggle-btn"
                  onClick={() => toggleReminder(reminder.id)}
                >
                  {reminder.enabled ? 'ON' : 'OFF'}
                </button>
                <button
                  className="delete-btn"
                  onClick={() => deleteReminder(reminder.id)}
                >
                  削除
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="reminder-tips">
        <h4>💡 ヒント</h4>
        <ul>
          <li>スマホでプッシュ通知を受け取るには、ブラウザの通知を許可してください</li>
          <li>毎日のルーティーンは「毎日」を選択</li>
          <li>特定の曜日だけの活動は「カスタム」で曜日を選択</li>
          <li>通知時間になると自動でリマインダーが表示されます</li>
        </ul>
      </div>
    </div>
  )
}

export default ReminderSettings