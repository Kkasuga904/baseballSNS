import React from 'react'
import PracticeRecord from './PracticeRecord'
import VideoPost from './VideoPost'
import ScheduleItem from './ScheduleItem'
import './DailyRecords.css'

function DailyRecords({ date, practices, videos, schedules }) {
  const hasRecords = practices.length > 0 || videos.length > 0 || schedules.length > 0

  if (!hasRecords) {
    return (
      <div className="daily-records empty">
        <p>この日の記録はまだありません</p>
      </div>
    )
  }

  return (
    <div className="daily-records">
      {schedules.length > 0 && (
        <div className="record-section">
          <h4>📅 予定</h4>
          {schedules.map(schedule => (
            <ScheduleItem key={schedule.id} schedule={schedule} />
          ))}
        </div>
      )}

      {practices.length > 0 && (
        <div className="record-section">
          <h4>📝 練習記録</h4>
          {practices.map(practice => (
            <PracticeRecord key={practice.id} practiceData={practice} />
          ))}
        </div>
      )}

      {videos.length > 0 && (
        <div className="record-section">
          <h4>🎬 動画記録</h4>
          {videos.map(video => (
            <VideoPost key={video.id} videoData={video} />
          ))}
        </div>
      )}
    </div>
  )
}

export default DailyRecords