import React, { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../App'
import ScheduleForm from '../components/ScheduleForm'
import ScheduleItem from '../components/ScheduleItem'
import './CalendarView.css'

function CalendarView({ posts = [], myPageData = { schedules: [] }, setMyPageData }) {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(null)
  const [showScheduleForm, setShowScheduleForm] = useState(false)
  const [showDayModal, setShowDayModal] = useState(false)
  const [viewMode, setViewMode] = useState('month') // month, week, day

  const monthYear = useMemo(() => {
    return {
      month: currentDate.getMonth(),
      year: currentDate.getFullYear()
    }
  }, [currentDate])

  // 練習記録がある日付を集計
  const practiceDates = useMemo(() => {
    const dates = new Map()
    posts.forEach(post => {
      if (post && post.type === 'practice' && post.practiceData && post.practiceData.date) {
        const date = post.practiceData.date
        if (!dates.has(date)) {
          dates.set(date, [])
        }
        dates.get(date).push(post)
      }
    })
    return dates
  }, [posts])
  
  // 予定がある日付を集計
  const scheduleDates = useMemo(() => {
    const dateMap = new Map()
    const schedules = myPageData?.schedules || []
    
    schedules.forEach(schedule => {
      const dateStr = schedule.date || schedule.startDate
      if (!dateStr) return
      
      if (!dateMap.has(dateStr)) {
        dateMap.set(dateStr, [])
      }
      dateMap.get(dateStr).push(schedule)
      
      // 日をまたぐ予定の場合、期間中のすべての日に追加
      if (schedule.isMultiDay && schedule.endDate) {
        const start = new Date(schedule.startDate)
        const end = new Date(schedule.endDate)
        const current = new Date(start)
        
        while (current <= end) {
          const currentDateStr = current.toISOString().split('T')[0]
          if (!dateMap.has(currentDateStr)) {
            dateMap.set(currentDateStr, [])
          }
          if (currentDateStr !== dateStr) {
            dateMap.get(currentDateStr).push({...schedule, isMiddleDay: true})
          }
          current.setDate(current.getDate() + 1)
        }
      }
    })
    return dateMap
  }, [myPageData?.schedules])

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const changeMonth = (increment) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev)
      newDate.setMonth(prev.getMonth() + increment)
      return newDate
    })
  }

  const handleDayClick = (dateStr) => {
    setSelectedDate(dateStr)
    setShowDayModal(true)
  }
  
  const handleAddSchedule = () => {
    setShowScheduleForm(true)
    setShowDayModal(false)
  }
  
  const handleScheduleSubmit = (scheduleData) => {
    setMyPageData(prev => ({
      ...prev,
      schedules: [...prev.schedules, scheduleData]
    }))
    setShowScheduleForm(false)
    setShowDayModal(false)
  }

  const getScheduleIcon = (type) => {
    const icons = {
      practice: '🏋️',
      game: '⚾',
      meeting: '👥',
      event: '🎉',
      other: '📌'
    }
    return icons[type] || icons.other
  }

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentDate)
    const firstDay = getFirstDayOfMonth(currentDate)
    const days = []
    
    // 空白の日
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>)
    }
    
    // 月の日付
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${monthYear.year}-${String(monthYear.month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
      const practices = practiceDates.get(dateStr) || []
      const schedules = scheduleDates.get(dateStr) || []
      const isToday = 
        day === new Date().getDate() && 
        monthYear.month === new Date().getMonth() && 
        monthYear.year === new Date().getFullYear()
      
      days.push(
        <div
          key={day}
          className={`calendar-day ${practices.length > 0 ? 'has-practice' : ''} ${schedules.length > 0 ? 'has-schedule' : ''} ${isToday ? 'today' : ''}`}
          onClick={() => handleDayClick(dateStr)}
        >
          <div className="day-header">
            <span className="day-number">{day}</span>
            {practices.length > 0 && <span className="practice-count">⚾ {practices.length}</span>}
          </div>
          
          <div className="day-content">
            {schedules.slice(0, 3).map((schedule, idx) => (
              <div key={idx} className="mini-schedule">
                <span className="schedule-icon">{getScheduleIcon(schedule.type)}</span>
                <span className="schedule-title">{schedule.title}</span>
              </div>
            ))}
            {schedules.length > 3 && (
              <div className="more-schedules">他 {schedules.length - 3} 件</div>
            )}
          </div>
        </div>
      )
    }
    
    return days
  }

  const monthNames = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']

  return (
    <div className="calendar-view">
      <div className="calendar-view-header">
        <button className="back-button" onClick={() => navigate('/mypage')}>
          ← マイページに戻る
        </button>
        <h2>📅 練習カレンダー</h2>
        <button className="add-schedule-btn" onClick={() => setShowScheduleForm(true)}>
          + 予定を追加
        </button>
      </div>

      <div className="calendar-controls">
        <div className="month-navigation">
          <button className="month-nav-btn" onClick={() => changeMonth(-1)}>
            <span>前月</span>
          </button>
          <h3 className="current-month">{monthYear.year}年 {monthNames[monthYear.month]}</h3>
          <button className="month-nav-btn" onClick={() => changeMonth(1)}>
            <span>翌月</span>
          </button>
        </div>
        
        <button className="today-btn" onClick={() => setCurrentDate(new Date())}>
          今日
        </button>
      </div>

      <div className="calendar-weekdays">
        <div className="weekday sunday">日</div>
        <div className="weekday">月</div>
        <div className="weekday">火</div>
        <div className="weekday">水</div>
        <div className="weekday">木</div>
        <div className="weekday">金</div>
        <div className="weekday saturday">土</div>
      </div>
      
      <div className="calendar-grid">
        {renderCalendar()}
      </div>

      {/* 日付詳細モーダル */}
      {showDayModal && selectedDate && (
        <div className="modal-overlay" onClick={() => setShowDayModal(false)}>
          <div className="day-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{new Date(selectedDate).toLocaleDateString('ja-JP', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                weekday: 'long'
              })}</h3>
              <button className="modal-close" onClick={() => setShowDayModal(false)}>✕</button>
            </div>
            
            <div className="modal-content">
              <div className="day-actions">
                <button className="action-btn" onClick={handleAddSchedule}>
                  + この日に予定を追加
                </button>
                <button className="action-btn" onClick={() => {
                  navigate('/mypage')
                  setTimeout(() => {
                    const element = document.querySelector('.daily-record-tabs')
                    if (element) element.scrollIntoView({ behavior: 'smooth' })
                  }, 100)
                }}>
                  📝 練習を記録
                </button>
              </div>
              
              <div className="day-schedules">
                <h4>予定</h4>
                {(scheduleDates.get(selectedDate) || []).map((schedule, idx) => (
                  <ScheduleItem key={idx} schedule={schedule} />
                ))}
                {(!scheduleDates.get(selectedDate) || scheduleDates.get(selectedDate).length === 0) && (
                  <p className="no-items">予定なし</p>
                )}
              </div>
              
              <div className="day-practices">
                <h4>練習記録</h4>
                {(practiceDates.get(selectedDate) || []).map((practice, idx) => (
                  <div key={idx} className="practice-summary">
                    <span className="practice-category">
                      {practice.practiceData.category === 'batting' && '🏏 打撃練習'}
                      {practice.practiceData.category === 'pitching' && '⚾ 投球練習'}
                      {practice.practiceData.category === 'fielding' && '🧤 守備練習'}
                      {practice.practiceData.category === 'running' && '🏃 走塁練習'}
                      {practice.practiceData.category === 'training' && '💪 トレーニング'}
                    </span>
                    <span className="practice-time">
                      {practice.practiceData.startTime} - {practice.practiceData.endTime}
                    </span>
                  </div>
                ))}
                {(!practiceDates.get(selectedDate) || practiceDates.get(selectedDate).length === 0) && (
                  <p className="no-items">練習記録なし</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 予定追加フォーム */}
      {showScheduleForm && (
        <div className="modal-overlay" onClick={() => setShowScheduleForm(false)}>
          <div className="schedule-form-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>予定を追加</h3>
              <button className="modal-close" onClick={() => setShowScheduleForm(false)}>✕</button>
            </div>
            <div className="modal-content">
              <ScheduleForm 
                selectedDate={selectedDate || new Date().toISOString().split('T')[0]}
                onSubmit={handleScheduleSubmit}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CalendarView