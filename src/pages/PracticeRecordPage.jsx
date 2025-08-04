import React, { useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import PracticeForm from '../components/PracticeForm'
import { useAuth } from '../App'
import './PracticeRecordPage.css'

function PracticeRecordPage({ addPost, myPageData, setMyPageData }) {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const selectedDate = searchParams.get('date') || new Date().toISOString().split('T')[0]
  
  // 練習記録を追加するハンドラー
  const handleAddPractice = (practiceData) => {
    console.log('handleAddPractice called with:', practiceData)
    
    // MyPageDataに追加
    setMyPageData(prev => {
      const newData = {
        ...prev,
        practices: [...(prev.practices || []), { ...practiceData, id: Date.now() }]
      }
      console.log('Updated myPageData:', newData)
      return newData
    })
    
    // タイムラインにも追加（練習記録として投稿）
    if (addPost) {
      const practiceCategories = {
        batting: '打撃練習',
        pitching: '投球練習',
        fielding: '守備練習',
        running: '走塁練習',
        training: 'トレーニング',
        stretch: 'ストレッチ',
        game: '試合',
        rest: '休養日'
      }
      
      addPost({
        type: 'practice',
        content: `${practiceData.category ? practiceCategories[practiceData.category] || '練習' : '練習'}を記録しました`,
        practiceData: practiceData
      })
    }
    
    // 保存後、マイページに戻る
    navigate('/mypage')
  }
  
  const handleClose = () => {
    navigate('/mypage')
  }
  
  return (
    <div className="practice-record-page">
      <div className="practice-record-container">
        <PracticeForm
          selectedDate={selectedDate}
          onClose={handleClose}
          onSubmit={handleAddPractice}
        />
      </div>
    </div>
  )
}

export default PracticeRecordPage