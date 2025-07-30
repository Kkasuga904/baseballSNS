import React, { useState, useMemo } from 'react'
import './PracticeCalendar.css'

function PracticeCalendar({ practices, onDateClick }) {
  const [currentDate, setCurrentDate] = useState(new Date())

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
      const isToday = 
        day === new Date().getDate() && 
        monthYear.month === new Date().getMonth() && 
        monthYear.year === new Date().getFullYear()
      
      days.push(
        <div
          key={day}
          className={`calendar-day ${hasPractice ? 'has-practice' : ''} ${isToday ? 'today' : ''}`}
          onClick={() => hasPractice && onDateClick(dateStr)}
        >
          <span className="day-number">{day}</span>
          {hasPractice && <span className="practice-marker">⚾</span>}
        </div>
      )
    }
    
    return days
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
    </div>
  )
}

export default PracticeCalendar