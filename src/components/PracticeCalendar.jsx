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

import React, { useState, useMemo, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './PracticeCalendar.css'

/**
 * 練習カレンダーコンポーネント
 * 
 * @param {Object} props
 * @param {Array} props.practices - 練習記録の配列
 * @param {Function} props.onDateClick - 日付クリック時のコールバック
 * @param {Array} props.schedules - スケジュール（予定）の配列
 */
function PracticeCalendar({ practices = [], onDateClick, schedules = [] }) {
  const navigate = useNavigate()
  
  // 現在表示中の年月を管理
  const [currentDate, setCurrentDate] = useState(() => {
    const date = new Date()
    return date
  })
  
  // スケジュール詳細モーダルの表示状態
  const [showScheduleModal, setShowScheduleModal] = useState(false)
  
  // 選択された日付のスケジュール一覧
  const [selectedDateSchedules, setSelectedDateSchedules] = useState([])
  
  // モーダルで表示する日付
  const [selectedModalDate, setSelectedModalDate] = useState('')
  
  // スワイプ処理用のref
  const calendarRef = useRef(null)
  const touchStartX = useRef(0)
  const touchEndX = useRef(0)
  const [isTransitioning, setIsTransitioning] = useState(false)

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
    if (!date || !(date instanceof Date)) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Invalid date passed to getDaysInMonth:', date)
      }
      return 31 // デフォルト値
    }
    const result = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
    return result
  }

  /**
   * 指定月の1日の曜日を取得
   * 
   * @param {Date} date - 対象の日付
   * @returns {number} 曜日（0:日曜〜6:土曜）
   */
  const getFirstDayOfMonth = (date) => {
    if (!date || !(date instanceof Date)) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Invalid date passed to getFirstDayOfMonth:', date)
      }
      return 0 // デフォルト値（日曜日）
    }
    const result = new Date(date.getFullYear(), date.getMonth(), 1).getDay()
    return result
  }

  /**
   * 表示月を変更
   * 
   * @param {number} increment - 変更する月数（-1: 前月、1: 翌月）
   */
  const changeMonth = (increment) => {
    if (isTransitioning) {
      return
    }
    
    setIsTransitioning(true)
    setCurrentDate(prev => {
      const newDate = new Date(prev)
      newDate.setMonth(prev.getMonth() + increment)
      return newDate
    })
    
    // アニメーション終了後にフラグをリセット
    setTimeout(() => {
      setIsTransitioning(false)
    }, 200) // より速いレスポンスのため時間を短縮
  }
  
  /**
   * タッチ開始時の処理
   */
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX
  }
  
  /**
   * タッチ移動時の処理
   */
  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX
  }
  
  /**
   * タッチ終了時の処理
   */
  const handleTouchEnd = (e) => {
    // 日付セル上でのタッチ終了の場合は処理しない
    if (e.target.closest('.calendar-day')) {
      return
    }
    
    const swipeThreshold = 50 // スワイプ判定の閾値を上げる
    const diff = touchStartX.current - touchEndX.current
    
    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        // 左スワイプ → 翌月へ
        changeMonth(1)
      } else {
        // 右スワイプ → 前月へ
        changeMonth(-1)
      }
    }
    
    // リセット
    touchStartX.current = 0
    touchEndX.current = 0
  }
  
  // マウスホイールでの月切り替えは無効化
  // ユーザビリティの観点から、誤操作を防ぐため削除

  /**
   * カレンダーの日付セルをレンダリング
   * 
   * @returns {Array} カレンダーセルのReact要素配列
   */
  const renderCalendar = () => {
    try {
    
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
      const handleDayClick = (e) => {
        e.preventDefault()
        e.stopPropagation()
        
        // タッチイベントの伝播を防ぐ
        if (e.nativeEvent) {
          e.nativeEvent.stopImmediatePropagation()
        }
        
        
        // PC・モバイル共に日記フォームを開く
        if (onDateClick) {
          onDateClick(dateStr)
        }
        
        // その日の練習記録をフィルタリング
        const practicesOnDate = practices.filter(p => 
          p.practiceData && p.practiceData.date === dateStr
        )
        
        // 予定がある場合はモーダルも表示
        if (daySchedules.length > 0 || practicesOnDate.length > 0) {
          setSelectedDateSchedules(daySchedules)
          setSelectedModalDate(dateStr)
          setShowScheduleModal(true)
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
          `}
          style={{
            WebkitTransform: 'translateZ(0)',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'translateZ(0)'
          }}
          onClick={handleDayClick}
          onTouchStart={(e) => {
            e.stopPropagation()
            // タッチ開始位置を記録してスワイプ判定を改善
            const touch = e.touches[0]
            e.currentTarget.dataset.touchStartX = touch.clientX
            e.currentTarget.dataset.touchStartY = touch.clientY
          }}
          onTouchEnd={(e) => {
            e.stopPropagation()
            
            // タッチ終了位置を取得
            const touch = e.changedTouches[0]
            const startX = parseFloat(e.currentTarget.dataset.touchStartX || '0')
            const startY = parseFloat(e.currentTarget.dataset.touchStartY || '0')
            const diffX = Math.abs(touch.clientX - startX)
            const diffY = Math.abs(touch.clientY - startY)
            
            // 移動が小さい場合のみクリックとして処理（タップ判定）
            if (diffX < 10 && diffY < 10) {
              handleDayClick(e)
            }
          }}
        >
          <span className="day-number">{day}</span>
          
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
    
    
    // デバッグ用：days配列が空の場合はダミーデータを返す
    if (days.length === 0) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('No days created! Returning dummy data')
      }
      const dummyDays = []
      for (let i = 1; i <= 31; i++) {
        dummyDays.push(
          <div 
            key={`dummy-${i}`} 
            className="calendar-day bg-white border border-gray-300 flex items-center justify-center"
            style={{
              WebkitTransform: 'translateZ(0)',
              WebkitBackfaceVisibility: 'hidden',
              transform: 'translateZ(0)'
            }}
          >
            <span 
              className="text-red-500 text-base font-bold"
              style={{ 
                color: '#ef4444', 
                fontSize: '16px', 
                fontWeight: 'bold',
                display: 'block',
                lineHeight: '1.2',
                zIndex: 10,
                position: 'relative',
                WebkitTextFillColor: '#ef4444',
                WebkitTextStrokeWidth: '0px'
              }}
            >
              {i}
            </span>
          </div>
        )
      }
      return dummyDays
    }
    
    return days
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('renderCalendar error:', error)
      }
      // エラー時は空の配列を返す
      return []
    }
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
    <div 
      className="practice-calendar"
      ref={calendarRef}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* カレンダーヘッダー：年月表示と月切り替えボタン */}
      <div className="calendar-header">
        <button 
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            changeMonth(-1)
          }}
          onTouchStart={(e) => {
            e.stopPropagation()
          }}
          onTouchEnd={(e) => {
            e.preventDefault()
            e.stopPropagation()
            changeMonth(-1)
          }}
          className="month-nav prev"
        >
          ‹
        </button>
        <h3>{monthYear.year}年{monthYear.month + 1}月</h3>
        <button 
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            changeMonth(1)
          }}
          onTouchStart={(e) => {
            e.stopPropagation()
          }}
          onTouchEnd={(e) => {
            e.preventDefault()
            e.stopPropagation()
            changeMonth(1)
          }}
          className="month-nav next"
        >
          ›
        </button>
      </div>
      
      {/* 曜日とカレンダーを統合したグリッド */}
      <div className="calendar-grid">
        {/* 曜日ヘッダー */}
        {['日', '月', '火', '水', '木', '金', '土'].map((day, i) => (
          <div key={`weekday-${i}`} className="weekday">{day}</div>
        ))}
        {/* カレンダー本体 */}
        {renderCalendar()}
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