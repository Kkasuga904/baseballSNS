import React, { useState, useMemo } from 'react'
import { useAuth } from '../App'
import PracticeStats from '../components/PracticeStats'
import PracticeRecord from '../components/PracticeRecord'
import WeeklySummary from '../components/WeeklySummary'
import DailyRecordTabs from '../components/DailyRecordTabs'
import DailyRecords from '../components/DailyRecords'
import NutritionChart from '../components/NutritionChart'
import ScheduleItem from '../components/ScheduleItem'
import RoutineTracker from '../components/RoutineTracker'
import BodyMetricsChart from '../components/BodyMetricsChart'
import MonthlyStats from '../components/MonthlyStats'
import './MyPage.css'

function MyPage({ posts, myPageData, setMyPageData, selectedDate, setSelectedDate }) {
  const { user } = useAuth()
  if (!selectedDate) {
    setSelectedDate(new Date().toISOString().split('T')[0])
  }

  const practicesOnSelectedDate = selectedDate
    ? posts.filter(post => 
        post.type === 'practice' && 
        post.practiceData.date === selectedDate
      )
    : []
  
  // マイページ専用データの日付別フィルタリング
  const selectedDateData = useMemo(() => {
    if (!selectedDate) return { practices: [], videos: [], schedules: [], meals: [], supplements: [], sleep: [] }
    
    return {
      practices: myPageData.practices.filter(p => p.date === selectedDate),
      videos: myPageData.videos.filter(v => v.date === selectedDate),
      schedules: myPageData.schedules.filter(s => s.date === selectedDate),
      meals: (myPageData.meals || []).filter(m => m.date === selectedDate),
      supplements: (myPageData.supplements || []).filter(s => s.date === selectedDate),
      sleep: (myPageData.sleep || []).filter(s => s.date === selectedDate)
    }
  }, [selectedDate, myPageData])
  
  const handleAddPractice = (practiceData) => {
    setMyPageData(prev => ({
      ...prev,
      practices: [...prev.practices, { ...practiceData, id: Date.now() }]
    }))
  }
  
  const handleAddVideo = (videoData) => {
    setMyPageData(prev => ({
      ...prev,
      videos: [...prev.videos, { ...videoData, id: Date.now() }]
    }))
  }
  
  const handleAddSchedule = (scheduleData) => {
    setMyPageData(prev => ({
      ...prev,
      schedules: [...prev.schedules, scheduleData]
    }))
  }
  
  const handleAddMeal = (mealData) => {
    setMyPageData(prev => ({
      ...prev,
      meals: [...(prev.meals || []), { ...mealData, id: Date.now() }]
    }))
  }
  
  const handleAddSupplement = (supplementData) => {
    setMyPageData(prev => ({
      ...prev,
      supplements: [...(prev.supplements || []), { ...supplementData, id: Date.now() }]
    }))
  }
  
  const handleAddSleep = (sleepData) => {
    setMyPageData(prev => ({
      ...prev,
      sleep: [...(prev.sleep || []), { ...sleepData, id: Date.now() }]
    }))
  }
  
  const handleAddBodyMetrics = (metricsData) => {
    // BodyMetricsFormコンポーネント内でlocalStorageに保存済み
    // ここでは必要に応じて追加の処理を行う
    console.log('Body metrics recorded:', metricsData)
  }

  return (
    <div className="mypage">
      <h2>📝 マイページ - 練習記録</h2>
      
      <div className="mypage-layout">
        <div className="mypage-main">
          <RoutineTracker />
          
          {selectedDate && (
            <DailyRecordTabs
              selectedDate={selectedDate}
              onAddPractice={handleAddPractice}
              onAddVideo={handleAddVideo}
              onAddSchedule={handleAddSchedule}
              onAddMeal={handleAddMeal}
              onAddSupplement={handleAddSupplement}
              onAddSleep={handleAddSleep}
              onAddBodyMetrics={handleAddBodyMetrics}
            />
          )}
          
          <WeeklySummary practices={posts} />
          
          <PracticeStats practices={posts} />
          
          <BodyMetricsChart />
          
          <MonthlyStats />
          
          {((myPageData.meals && myPageData.meals.length > 0) || 
            (myPageData.supplements && myPageData.supplements.length > 0)) && (
            <NutritionChart 
              meals={myPageData.meals || []} 
              supplements={myPageData.supplements || []} 
            />
          )}
          
          {selectedDate && (
            <div className="selected-date-records">
              <h3>{selectedDate} の記録</h3>
              <DailyRecords
                date={selectedDate}
                practices={selectedDateData.practices}
                videos={selectedDateData.videos}
                schedules={selectedDateData.schedules}
                meals={selectedDateData.meals}
                supplements={selectedDateData.supplements}
                sleep={selectedDateData.sleep}
              />
            </div>
          )}
          
          <div className="upcoming-schedules">
            <h3>📅 今後の予定</h3>
            {(() => {
              const today = new Date()
              today.setHours(0, 0, 0, 0)
              const upcomingSchedules = myPageData.schedules
                .filter(schedule => {
                  const scheduleDate = new Date(schedule.date || schedule.startDate)
                  return scheduleDate >= today
                })
                .sort((a, b) => {
                  const dateA = new Date(a.date || a.startDate)
                  const dateB = new Date(b.date || b.startDate)
                  return dateA - dateB
                })
                .slice(0, 10)
              
              if (upcomingSchedules.length === 0) {
                return <p className="no-schedules">予定がありません</p>
              }
              
              return (
                <div className="schedule-list">
                  {upcomingSchedules.map(schedule => (
                    <div key={schedule.id} className="schedule-list-item">
                      <div className="schedule-date">
                        {new Date(schedule.date || schedule.startDate).toLocaleDateString('ja-JP', {
                          month: 'long',
                          day: 'numeric',
                          weekday: 'short'
                        })}
                      </div>
                      <ScheduleItem schedule={schedule} />
                    </div>
                  ))}
                </div>
              )
            })()}
          </div>
          
          <div className="recent-practices">
            <h3>最近の練習記録</h3>
            {posts.length > 0 ? (
              posts.slice(0, 5).map(practice => (
                <div key={practice.id} className="practice-detail">
                  <PracticeRecord practiceData={practice.practiceData} />
                </div>
              ))
            ) : (
              <p className="no-practices">
                まだ練習記録がありません。
                <br />
                タイムラインから練習記録を投稿してみましょう！
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default MyPage