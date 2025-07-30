import React, { useState } from 'react'
import PracticeStats from '../components/PracticeStats'
import PracticeCalendar from '../components/PracticeCalendar'
import PracticeRecord from '../components/PracticeRecord'
import './MyPage.css'

function MyPage({ posts }) {
  const [selectedDate, setSelectedDate] = useState(null)

  const practicesOnSelectedDate = selectedDate
    ? posts.filter(post => 
        post.type === 'practice' && 
        post.practiceData.date === selectedDate
      )
    : []

  return (
    <div className="mypage">
      <h2>📝 マイページ - 練習記録</h2>
      
      <PracticeStats practices={posts} />
      
      <PracticeCalendar 
        practices={posts} 
        onDateClick={setSelectedDate}
      />
      
      {selectedDate && (
        <div className="selected-date-practices">
          <h3>
            {selectedDate} の練習記録
            <button 
              className="close-button" 
              onClick={() => setSelectedDate(null)}
            >
              ✕
            </button>
          </h3>
          
          {practicesOnSelectedDate.length > 0 ? (
            practicesOnSelectedDate.map(practice => (
              <div key={practice.id} className="practice-detail">
                <PracticeRecord practiceData={practice.practiceData} />
              </div>
            ))
          ) : (
            <p className="no-practices">この日の練習記録はありません</p>
          )}
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