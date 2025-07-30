import React, { useState } from 'react'
import PracticeForm from './PracticeForm'
import VideoForm from './VideoForm'
import ScheduleForm from './ScheduleForm'
import './DailyRecordTabs.css'

function DailyRecordTabs({ selectedDate, onAddPractice, onAddVideo, onAddSchedule }) {
  const [activeTab, setActiveTab] = useState('practice')

  const tabs = [
    { id: 'practice', label: '練習記録', icon: '📝' },
    { id: 'video', label: '動画記録', icon: '🎬' },
    { id: 'schedule', label: '予定', icon: '📅' }
  ]

  return (
    <div className="daily-record-tabs">
      <div className="tabs-header">
        <h3>📌 {selectedDate} の記録</h3>
        <div className="tabs-nav">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="tab-icon">{tab.icon}</span>
              <span className="tab-label">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="tab-content">
        {activeTab === 'practice' && (
          <div className="simplified-form">
            <PracticeForm 
              onSubmit={(data) => onAddPractice({
                ...data,
                date: selectedDate,
                isPrivate: true
              })}
            />
          </div>
        )}
        
        {activeTab === 'video' && (
          <div className="simplified-form">
            <VideoForm 
              onSubmit={(data) => onAddVideo({
                ...data,
                date: selectedDate,
                isPrivate: true
              })}
            />
          </div>
        )}
        
        {activeTab === 'schedule' && (
          <ScheduleForm 
            selectedDate={selectedDate}
            onSubmit={onAddSchedule}
          />
        )}
      </div>
    </div>
  )
}

export default DailyRecordTabs