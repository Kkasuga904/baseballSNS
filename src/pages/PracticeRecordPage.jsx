import React, { useEffect, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import PracticeForm from '../components/PracticeForm'
import SimplifiedPracticeForm from '../components/SimplifiedPracticeForm'
import { useAuth } from '../App'
import './PracticeRecordPage.css'

function PracticeRecordPage({ addPost, myPageData, setMyPageData }) {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const selectedDate = searchParams.get('date') || new Date().toISOString().split('T')[0]
  const [useSimpleForm, setUseSimpleForm] = useState(true) // デフォルトで簡易フォームを使用
  
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
        {/* フォーム切り替えボタン */}
        <div className="form-toggle">
          <button
            className={`toggle-btn ${useSimpleForm ? 'active' : ''}`}
            onClick={() => setUseSimpleForm(true)}
          >
            シンプル入力
          </button>
          <button
            className={`toggle-btn ${!useSimpleForm ? 'active' : ''}`}
            onClick={() => setUseSimpleForm(false)}
          >
            詳細入力
          </button>
        </div>
        
        {/* フォーム表示 */}
        {useSimpleForm ? (
          <SimplifiedPracticeForm 
            onSubmit={handleAddPractice}
            selectedDate={selectedDate}
            onClose={handleClose}
          />
        ) : (
          <PracticeForm
            selectedDate={selectedDate}
            onClose={handleClose}
            onSubmit={handleAddPractice}
          />
        )}
      </div>
    </div>
  )
}

export default PracticeRecordPage