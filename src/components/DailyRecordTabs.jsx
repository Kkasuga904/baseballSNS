import React, { useState } from 'react'
import PracticeForm from './PracticeForm'
import VideoForm from './VideoForm'
import ScheduleForm from './ScheduleForm'
import MealForm from './MealForm'
import SupplementForm from './SupplementForm'
import GoalsForm from './GoalsForm'
import SleepForm from './SleepForm'
import ReminderSettings from './ReminderSettings'
import './DailyRecordTabs.css'

function DailyRecordTabs({ selectedDate, onAddPractice, onAddVideo, onAddSchedule, onAddMeal, onAddSupplement, onAddSleep }) {
  const [activeTab, setActiveTab] = useState('practice')

  const tabs = [
    { id: 'practice', label: '練習記録', icon: '📝' },
    { id: 'video', label: '動画記録', icon: '🎬' },
    { id: 'schedule', label: '予定', icon: '📅' },
    { id: 'meal', label: '食事', icon: '🍽️' },
    { id: 'supplement', label: 'サプリ', icon: '💊' },
    { id: 'sleep', label: '睡眠', icon: '😴' },
    { id: 'goals', label: '目標設定', icon: '🎯' },
    { id: 'reminder', label: 'リマインダー', icon: '🔔' }
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
        
        {activeTab === 'meal' && (
          <div className="simplified-form">
            <MealForm 
              onSubmit={(data) => onAddMeal({
                ...data,
                date: selectedDate,
                isPrivate: true
              })}
            />
          </div>
        )}
        
        {activeTab === 'supplement' && (
          <div className="simplified-form">
            <SupplementForm 
              onSubmit={(data) => onAddSupplement({
                ...data,
                date: selectedDate,
                isPrivate: true
              })}
            />
          </div>
        )}
        
        {activeTab === 'sleep' && (
          <div className="simplified-form">
            <SleepForm 
              onSubmit={(data) => onAddSleep({
                ...data,
                date: selectedDate,
                isPrivate: true
              })}
            />
          </div>
        )}
        
        {activeTab === 'goals' && (
          <div className="simplified-form">
            <GoalsForm />
          </div>
        )}
        
        {activeTab === 'reminder' && (
          <div className="simplified-form">
            <ReminderSettings />
          </div>
        )}
      </div>
    </div>
  )
}

export default DailyRecordTabs