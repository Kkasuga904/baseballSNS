import React, { useState, useMemo } from 'react'
import './TrainingCalendar.css'

/**
 * トレーニングカレンダーコンポーネント
 * 画像のようなUIデザインで練習記録を表示
 */
function TrainingCalendar({ practices = [], onDateClick, schedules = [] }) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [activeTab, setActiveTab] = useState('calendar')
  
  // 年月情報
  const monthYear = useMemo(() => ({
    month: currentDate.getMonth(),
    year: currentDate.getFullYear()
  }), [currentDate])

  // 練習日のセット
  const practiceDates = useMemo(() => {
    const dates = new Set()
    practices.forEach(practice => {
      if (practice.practiceData?.date) {
        dates.add(practice.practiceData.date)
      }
    })
    return dates
  }, [practices])

  // カレンダーのセルを生成
  const renderCalendar = () => {
    const daysInMonth = new Date(monthYear.year, monthYear.month + 1, 0).getDate()
    const firstDay = new Date(monthYear.year, monthYear.month, 1).getDay()
    const days = []
    
    // 空白セル
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-cell empty"></div>)
    }
    
    // 日付セル
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${monthYear.year}-${String(monthYear.month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
      const hasPractice = practiceDates.has(dateStr)
      const isToday = day === new Date().getDate() && 
                     monthYear.month === new Date().getMonth() && 
                     monthYear.year === new Date().getFullYear()
      
      days.push(
        <div
          key={day}
          className={`calendar-cell ${hasPractice ? 'has-practice' : ''} ${isToday ? 'today' : ''}`}
          onClick={() => onDateClick && onDateClick(dateStr)}
        >
          {day}
          {hasPractice && (
            <div className="practice-indicator">⚾</div>
          )}
        </div>
      )
    }
    
    return days
  }

  // 月を変更
  const changeMonth = (increment) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev)
      newDate.setMonth(prev.getMonth() + increment)
      return newDate
    })
  }

  // ノート一覧を表示
  const renderNoteList = () => {
    const noteSections = [
      { title: '本日の振り返り', color: 'green' },
      { title: '練習記録', color: 'green' },
      { title: 'もしやり直せるなら', color: 'green' },
      { title: 'コンディション', color: 'yellow' },
      { title: '明日の目標', color: 'red' }
    ]
    
    return (
      <div className="note-list">
        {noteSections.map((section, index) => (
          <div key={index} className={`note-item ${section.color}`}>
            <span className="note-title">{section.title}</span>
          </div>
        ))}
        
        <div className="note-memo">
          <label>自分メモ</label>
          <textarea placeholder="※コーチには送信されません" rows="3"></textarea>
        </div>
      </div>
    )
  }

  return (
    <div className="training-calendar">
      
      {/* タブ切り替え */}
      <div className="tab-switcher">
        <button 
          className={`tab-btn ${activeTab === 'calendar' ? 'active' : ''}`}
          onClick={() => setActiveTab('calendar')}
        >
          📅 カレンダー
        </button>
        <button 
          className={`tab-btn ${activeTab === 'list' ? 'active' : ''}`}
          onClick={() => setActiveTab('list')}
        >
          📋 リスト
        </button>
      </div>
      
      {/* カレンダータブ */}
      {activeTab === 'calendar' && (
        <div className="calendar-content">
          {/* 月の切り替え */}
          <div className="month-navigation">
            <button onClick={() => changeMonth(-1)} className="nav-btn">◀</button>
            <span className="current-month">
              {monthYear.year}年{monthYear.month + 1}月
            </span>
            <button onClick={() => changeMonth(1)} className="nav-btn">▶</button>
          </div>
          
          {/* 曜日ヘッダー */}
          <div className="weekday-header">
            {['日', '月', '火', '水', '木', '金', '土'].map((day, index) => (
              <div key={day} className={`weekday ${index === 0 ? 'sunday' : index === 6 ? 'saturday' : ''}`}>
                {day}
              </div>
            ))}
          </div>
          
          {/* カレンダーグリッド */}
          <div className="calendar-grid">
            {renderCalendar()}
          </div>
        </div>
      )}
      
      {/* ノートタブ */}
      {activeTab === 'list' && (
        <div className="list-content">
          <h3>ノート記入</h3>
          {renderNoteList()}
        </div>
      )}
    </div>
  )
}

export default TrainingCalendar