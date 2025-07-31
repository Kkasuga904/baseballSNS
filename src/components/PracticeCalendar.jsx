/**
 * PracticeCalendar.jsx - 練習カレンダーコンポーネント
 * 
 * 月間の練習記録と予定を視覚的に表示するカレンダーです。
 * 練習がある日は色付きで表示され、クリックで詳細を確認できます。
 * 
 * 機能:
 * - 月間カレンダー表示
 * - 練習日のハイライト表示
 * - 予定（スケジュール）の表示
 * - 複数日にまたがる予定の対応
 * - 日付クリックで詳細表示
 * - 月の切り替えナビゲーション
 */

import React, { useState, useMemo } from 'react'
import './PracticeCalendar.css'

/**
 * 練習カレンダーコンポーネント
 * 
 * @param {Object} props
 * @param {Array} props.practices - 練習記録の配列
 * @param {Function} props.onDateClick - 日付クリック時のコールバック
 * @param {Array} props.schedules - スケジュール（予定）の配列
 */
function PracticeCalendar({ practices, onDateClick, schedules = [] }) {
  // 現在表示中の年月を管理
  const [currentDate, setCurrentDate] = useState(new Date())
  
  // スケジュール詳細モーダルの表示状態
  const [showScheduleModal, setShowScheduleModal] = useState(false)
  
  // 選択された日付のスケジュール一覧
  const [selectedDateSchedules, setSelectedDateSchedules] = useState([])
  
  // モーダルで表示する日付
  const [selectedModalDate, setSelectedModalDate] = useState('')

  /**
   * 現在の年月情報をメモ化
   * currentDateが変更されたときのみ再計算
   */
  const monthYear = useMemo(() => {
    return {
      month: currentDate.getMonth(),
      year: currentDate.getFullYear()
    }
  }, [currentDate])

  /**
   * 練習がある日付のセットを作成
   * パフォーマンス最適化のためuseMemoでメモ化
   */
  const practiceDates = useMemo(() => {
    const dates = new Set()
    practices.forEach(practice => {
      // 練習データから日付を抽出
      if (practice.practiceData && practice.practiceData.date) {
        dates.add(practice.practiceData.date)
      }
    })
    return dates
  }, [practices])
  
  /**
   * 予定がある日付のマップを作成
   * 各日付に対して、その日の予定の配列を保持
   * 複数日にまたがる予定も処理
   */
  const scheduleDates = useMemo(() => {
    const dateMap = new Map()
    
    schedules.forEach(schedule => {
      // 予定の開始日を取得
      const dateStr = schedule.date || schedule.startDate
      if (!dateStr) return
      
      // 開始日に予定を追加
      if (!dateMap.has(dateStr)) {
        dateMap.set(dateStr, [])
      }
      dateMap.get(dateStr).push(schedule)
      
      // 複数日にまたがる予定の処理
      if (schedule.isMultiDay && schedule.endDate) {
        const start = new Date(schedule.startDate)
        const end = new Date(schedule.endDate)
        const current = new Date(start)
        
        // 開始日から終了日まで各日に予定を追加
        while (current <= end) {
          const currentDateStr = current.toISOString().split('T')[0]
          if (!dateMap.has(currentDateStr)) {
            dateMap.set(currentDateStr, [])
          }
          // 中間日フラグを追加（スタイリング用）
          if (currentDateStr !== dateStr) {
            dateMap.get(currentDateStr).push({...schedule, isMiddleDay: true})
          }
          current.setDate(current.getDate() + 1)
        }
      }
    })
    return dateMap
  }, [schedules])

  /**
   * 指定月の日数を取得
   * 
   * @param {Date} date - 対象の日付
   * @returns {number} その月の日数
   */
  const getDaysInMonth = (date) => {
    // 翌月の0日目 = 今月の最終日
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  /**
   * 指定月の1日の曜日を取得
   * 
   * @param {Date} date - 対象の日付
   * @returns {number} 曜日（0:日曜〜6:土曜）
   */
  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  /**
   * 表示月を変更
   * 
   * @param {number} increment - 変更する月数（-1: 前月、1: 翌月）
   */
  const changeMonth = (increment) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev)
      newDate.setMonth(prev.getMonth() + increment)
      return newDate
    })
  }

  /**
   * カレンダーの日付セルをレンダリング
   * 
   * @returns {Array} カレンダーセルのReact要素配列
   */
  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentDate)
    const firstDay = getFirstDayOfMonth(currentDate)
    const days = []
    
    // 月初めの空白セルを追加
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>)
    }
    
    // 各日付のセルを生成
    for (let day = 1; day <= daysInMonth; day++) {
      // YYYY-MM-DD形式の日付文字列を作成
      const dateStr = `${monthYear.year}-${String(monthYear.month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
      
      // その日に練習があるかチェック
      const hasPractice = practiceDates.has(dateStr)
      
      // その日の予定を取得
      const daySchedules = scheduleDates.get(dateStr) || []
      
      // 今日かどうかをチェック
      const isToday = 
        day === new Date().getDate() && 
        monthYear.month === new Date().getMonth() && 
        monthYear.year === new Date().getFullYear()
      
      /**
       * 日付セルクリック時の処理
       * 練習記録と予定の詳細を表示
       */
      const handleDayClick = () => {
        // その日の練習記録をフィルタリング
        const practicesOnDate = practices.filter(p => 
          p.practiceData && p.practiceData.date === dateStr
        )
        
        // 練習または予定がある場合
        if (practicesOnDate.length > 0 || daySchedules.length > 0) {
          // 親コンポーネントのコールバックを実行
          if (onDateClick) {
            onDateClick(dateStr)
          }
          
          // 予定がある場合はモーダルを表示
          if (daySchedules.length > 0) {
            setSelectedDateSchedules(daySchedules)
            setSelectedModalDate(dateStr)
            setShowScheduleModal(true)
          }
        }
      }
      
      // 日付セルのレンダリング
      days.push(
        <div
          key={day}
          className={`
            calendar-day 
            ${hasPractice ? 'has-practice' : ''} 
            ${isToday ? 'today' : ''}
            ${(hasPractice || daySchedules.length > 0) ? 'clickable' : ''}
          `}
          onClick={handleDayClick}
        >
          <div className="day-number">{day}</div>
          
          {/* 練習がある日のインジケーター */}
          {hasPractice && (
            <div className="practice-indicator" title="練習あり">●</div>
          )}
          
          {/* 予定がある日の表示 */}
          {daySchedules.length > 0 && (
            <div className="schedule-indicators">
              {daySchedules.slice(0, 3).map((schedule, index) => (
                <div
                  key={index}
                  className={`schedule-dot ${schedule.type || 'other'}`}
                  title={schedule.title}
                />
              ))}
              {/* 3件以上の予定がある場合は+表示 */}
              {daySchedules.length > 3 && (
                <div className="schedule-more">+{daySchedules.length - 3}</div>
              )}
            </div>
          )}
        </div>
      )
    }
    
    return days
  }

  /**
   * スケジュール詳細モーダルを閉じる
   */
  const closeScheduleModal = () => {
    setShowScheduleModal(false)
    setSelectedDateSchedules([])
    setSelectedModalDate('')
  }

  // コンポーネントのレンダリング
  return (
    <div className="practice-calendar">
      {/* カレンダーヘッダー：年月表示と月切り替えボタン */}
      <div className="calendar-header">
        <button onClick={() => changeMonth(-1)} className="month-nav">
          ‹
        </button>
        <h3>
          {monthYear.year}年{monthYear.month + 1}月
        </h3>
        <button onClick={() => changeMonth(1)} className="month-nav">
          ›
        </button>
      </div>
      
      {/* 曜日ヘッダー */}
      <div className="calendar-grid">
        <div className="calendar-weekdays">
          {['日', '月', '火', '水', '木', '金', '土'].map(day => (
            <div key={day} className="weekday">{day}</div>
          ))}
        </div>
        
        {/* カレンダー本体 */}
        <div className="calendar-days">
          {renderCalendar()}
        </div>
      </div>
      
      {/* スケジュール詳細モーダル */}
      {showScheduleModal && (
        <div className="schedule-modal-overlay" onClick={closeScheduleModal}>
          <div className="schedule-modal" onClick={(e) => e.stopPropagation()}>
            <div className="schedule-modal-header">
              <h3>{selectedModalDate} の予定</h3>
              <button onClick={closeScheduleModal} className="close-button">×</button>
            </div>
            <div className="schedule-modal-content">
              {selectedDateSchedules.map((schedule, index) => (
                <div key={index} className={`schedule-item ${schedule.type || 'other'}`}>
                  <div className="schedule-title">{schedule.title}</div>
                  {schedule.startTime && (
                    <div className="schedule-time">
                      {schedule.startTime}
                      {schedule.endTime && ` - ${schedule.endTime}`}
                    </div>
                  )}
                  {schedule.location && (
                    <div className="schedule-location">📍 {schedule.location}</div>
                  )}
                  {schedule.description && (
                    <div className="schedule-description">{schedule.description}</div>
                  )}
                  {schedule.isMiddleDay && (
                    <div className="schedule-note">※ 複数日にまたがる予定</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      
      {/* カレンダー凡例 */}
      <div className="calendar-legend">
        <div className="legend-item">
          <span className="legend-dot practice"></span>
          <span>練習あり</span>
        </div>
        <div className="legend-item">
          <span className="legend-dot today"></span>
          <span>今日</span>
        </div>
      </div>
    </div>
  )
}

export default PracticeCalendar