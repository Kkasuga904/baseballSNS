import React, { useState, useMemo } from 'react'
import './PracticeCalendar.css'

function PracticeCalendar({ practices, onDateClick, schedules = [] }) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [showScheduleModal, setShowScheduleModal] = useState(false)
  const [selectedDateSchedules, setSelectedDateSchedules] = useState([])

  const monthYear = useMemo(() => {
    return {
      month: currentDate.getMonth(),
      year: currentDate.getFullYear()
    }
  }, [currentDate])

  const practiceDates = useMemo(() => {
    const dates = new Set()
    practices.forEach(practice => {
      if (practice.practiceData && practice.practiceData.date) {
        dates.add(practice.practiceData.date)
      }
    })
    return dates
  }, [practices])
  
  // 予定がある日付を集計
  const scheduleDates = useMemo(() => {
    const dateMap = new Map()
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
  }, [schedules])

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
      const hasPractice = practiceDates.has(dateStr)
      const daySchedules = scheduleDates.get(dateStr) || []
      const isToday = 
        day === new Date().getDate() && 
        monthYear.month === new Date().getMonth() && 
        monthYear.year === new Date().getFullYear()
      
      const handleDayClick = () => {
        if (daySchedules.length > 0) {
          setSelectedDateSchedules(daySchedules)
          setShowScheduleModal(true)
        }
        onDateClick(dateStr)
      }
      
      days.push(
        <div
          key={day}
          className={`calendar-day ${hasPractice ? 'has-practice' : ''} ${daySchedules.length > 0 ? 'has-schedule' : ''} ${isToday ? 'today' : ''}`}
          onClick={handleDayClick}
        >
          <span className="day-number">{day}</span>
          {hasPractice && <span className="practice-marker">⚾</span>}
          {daySchedules.length > 0 && (
            <div className="schedule-indicators">
              <span className="schedule-indicator">{getScheduleIcon(daySchedules[0].type)}</span>
              {daySchedules.length > 1 && <span className="schedule-more">+{daySchedules.length - 1}</span>}
            </div>
          )}
        </div>
      )
    }
    
    return days
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
  
  const formatScheduleTime = (schedule) => {
    if (schedule.isAllDay) return '終日'
    if (schedule.isMultiDay && schedule.isMiddleDay) return '継続中'
    if (schedule.startTime) return schedule.startTime
    return ''
  }

  const monthNames = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']

  return (
    <div className="practice-calendar">
      <div className="calendar-header">
        <button className="month-nav" onClick={() => changeMonth(-1)}>‹</button>
        <h3>{monthYear.year}年 {monthNames[monthYear.month]}</h3>
        <button className="month-nav" onClick={() => changeMonth(1)}>›</button>
      </div>
      
      <div className="calendar-weekdays">
        <div>日</div>
        <div>月</div>
        <div>火</div>
        <div>水</div>
        <div>木</div>
        <div>金</div>
        <div>土</div>
      </div>
      
      <div className="calendar-grid">
        {renderCalendar()}
      </div>
      
      {showScheduleModal && (
        <div className="schedule-modal-overlay" onClick={() => setShowScheduleModal(false)}>
          <div className="schedule-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>予定一覧</h3>
              <button className="modal-close" onClick={() => setShowScheduleModal(false)}>✕</button>
            </div>
            <div className="modal-content">
              {selectedDateSchedules.map((schedule, idx) => (
                <div key={idx} className="modal-schedule-item">
                  <div className="schedule-type-icon">{getScheduleIcon(schedule.type)}</div>
                  <div className="schedule-details">
                    <h4>{schedule.title}</h4>
                    <div className="schedule-time">{formatScheduleTime(schedule)}</div>
                    {schedule.location && <div className="schedule-location">📍 {schedule.location}</div>}
                    {schedule.description && <div className="schedule-description">{schedule.description}</div>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default PracticeCalendar