import React, { useState, useRef, useEffect } from 'react'
import './DatePicker.css'

/**
 * カスタム日付ピッカーコンポーネント
 * カレンダー形式で日付を選択できる
 */
function DatePicker({ value, onChange, minDate, placeholder = '日付を選択' }) {
  const [isOpen, setIsOpen] = useState(false)
  const [currentMonth, setCurrentMonth] = useState(() => {
    const date = value ? new Date(value) : new Date()
    return new Date(date.getFullYear(), date.getMonth(), 1)
  })
  const pickerRef = useRef(null)

  // 外側クリックで閉じる
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // 月の日数を取得
  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  // 月の最初の曜日を取得
  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  // 日付フォーマット
  const formatDate = (date) => {
    if (!date) return ''
    const d = new Date(date)
    const year = d.getFullYear()
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  // 表示用日付フォーマット
  const formatDisplayDate = (date) => {
    if (!date) return placeholder
    const d = new Date(date)
    const year = d.getFullYear()
    const month = d.getMonth() + 1
    const day = d.getDate()
    const weekdays = ['日', '月', '火', '水', '木', '金', '土']
    const weekday = weekdays[d.getDay()]
    return `${year}年${month}月${day}日(${weekday})`
  }

  // 月変更
  const changeMonth = (increment) => {
    setCurrentMonth(prev => {
      const newDate = new Date(prev)
      newDate.setMonth(newDate.getMonth() + increment)
      return newDate
    })
  }

  // 日付選択
  const selectDate = (day) => {
    const selected = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
    onChange(formatDate(selected))
    setIsOpen(false)
  }

  // カレンダーの日付配列を生成
  const generateCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentMonth)
    const firstDay = getFirstDayOfMonth(currentMonth)
    const days = []

    // 前月の空白
    for (let i = 0; i < firstDay; i++) {
      days.push(null)
    }

    // 当月の日付
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i)
    }

    return days
  }

  // 日付が選択可能かチェック
  const isDateDisabled = (day) => {
    if (!minDate || !day) return false
    const checkDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
    const min = new Date(minDate)
    return checkDate < min
  }

  // 今日かどうかチェック
  const isToday = (day) => {
    if (!day) return false
    const today = new Date()
    return (
      currentMonth.getFullYear() === today.getFullYear() &&
      currentMonth.getMonth() === today.getMonth() &&
      day === today.getDate()
    )
  }

  // 選択された日かチェック
  const isSelected = (day) => {
    if (!day || !value) return false
    const selected = new Date(value)
    return (
      currentMonth.getFullYear() === selected.getFullYear() &&
      currentMonth.getMonth() === selected.getMonth() &&
      day === selected.getDate()
    )
  }

  const monthNames = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
  const weekDays = ['日', '月', '火', '水', '木', '金', '土']

  return (
    <div className="date-picker" ref={pickerRef}>
      <div 
        className="date-picker-input"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={value ? 'has-value' : 'placeholder'}>
          {formatDisplayDate(value)}
        </span>
        <span className="calendar-icon">📅</span>
      </div>

      {isOpen && (
        <div className="date-picker-dropdown">
          <div className="calendar-header">
            <button 
              className="month-nav prev"
              onClick={(e) => {
                e.stopPropagation()
                changeMonth(-1)
              }}
            >
              ‹
            </button>
            <div className="current-month">
              {currentMonth.getFullYear()}年 {monthNames[currentMonth.getMonth()]}
            </div>
            <button 
              className="month-nav next"
              onClick={(e) => {
                e.stopPropagation()
                changeMonth(1)
              }}
            >
              ›
            </button>
          </div>

          <div className="calendar-weekdays">
            {weekDays.map(day => (
              <div key={day} className={`weekday ${day === '日' ? 'sunday' : day === '土' ? 'saturday' : ''}`}>
                {day}
              </div>
            ))}
          </div>

          <div className="calendar-days">
            {generateCalendarDays().map((day, index) => (
              <div
                key={index}
                className={`calendar-day ${
                  !day ? 'empty' : ''
                } ${
                  isToday(day) ? 'today' : ''
                } ${
                  isSelected(day) ? 'selected' : ''
                } ${
                  isDateDisabled(day) ? 'disabled' : ''
                } ${
                  day && index % 7 === 0 ? 'sunday' : ''
                } ${
                  day && index % 7 === 6 ? 'saturday' : ''
                }`}
                onClick={() => day && !isDateDisabled(day) && selectDate(day)}
              >
                {day}
              </div>
            ))}
          </div>

          <div className="calendar-footer">
            <button 
              className="today-button"
              onClick={() => {
                const today = new Date()
                setCurrentMonth(new Date(today.getFullYear(), today.getMonth(), 1))
                onChange(formatDate(today))
                setIsOpen(false)
              }}
            >
              今日
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default DatePicker