import React, { useState, useMemo } from 'react'
import PracticeStats from '../components/PracticeStats'
import PracticeCalendar from '../components/PracticeCalendar'
import PracticeRecord from '../components/PracticeRecord'
import WeeklySummary from '../components/WeeklySummary'
import DailyRecordTabs from '../components/DailyRecordTabs'
import DailyRecords from '../components/DailyRecords'
import './MyPage.css'

function MyPage({ posts, myPageData, setMyPageData }) {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])

  const practicesOnSelectedDate = selectedDate
    ? posts.filter(post => 
        post.type === 'practice' && 
        post.practiceData.date === selectedDate
      )
    : []
  
  // マイページ専用データの日付別フィルタリング
  const selectedDateData = useMemo(() => {
    if (!selectedDate) return { practices: [], videos: [], schedules: [] }
    
    return {
      practices: myPageData.practices.filter(p => p.date === selectedDate),
      videos: myPageData.videos.filter(v => v.date === selectedDate),
      schedules: myPageData.schedules.filter(s => s.date === selectedDate)
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

  return (
    <div className="mypage">
      <h2>📝 マイページ - 練習記録</h2>
      
      {selectedDate && (
        <DailyRecordTabs
          selectedDate={selectedDate}
          onAddPractice={handleAddPractice}
          onAddVideo={handleAddVideo}
          onAddSchedule={handleAddSchedule}
        />
      )}
      
      <WeeklySummary practices={posts} />
      
      <PracticeStats practices={posts} />
      
      <PracticeCalendar 
        practices={posts} 
        onDateClick={setSelectedDate}
      />
      
      {selectedDate && (
        <div className="selected-date-records">
          <h3>{selectedDate} の記録</h3>
          <DailyRecords
            date={selectedDate}
            practices={selectedDateData.practices}
            videos={selectedDateData.videos}
            schedules={selectedDateData.schedules}
          />
        </div>
      )}
      
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
  )
}

export default MyPage