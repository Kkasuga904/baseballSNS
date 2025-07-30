import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navigation from './components/Navigation'
import Timeline from './pages/Timeline'
import MyPage from './pages/MyPage'
import './App.css'

function App() {
  // マイページ専用データ
  const [myPageData, setMyPageData] = useState(() => {
    const savedData = localStorage.getItem('baseballSNSMyPageData')
    return savedData ? JSON.parse(savedData) : {
      practices: [],
      videos: [],
      schedules: []
    }
  })
  
  const [posts, setPosts] = useState(() => {
    const savedPosts = localStorage.getItem('baseballSNSPosts')
    return savedPosts ? JSON.parse(savedPosts) : [
    {
      id: 1,
      type: 'normal',
      content: '今日は素晴らしい試合でした！9回裏の逆転サヨナラホームランは鳥肌ものでした！',
      author: '野球太郎',
      timestamp: '2025-01-30T15:00:00',
      likes: 42,
      comments: 5
    },
    {
      id: 2,
      type: 'practice',
      author: '練習マニア',
      timestamp: '2025-01-30T14:00:00',
      likes: 23,
      comments: 8,
      practiceData: {
        date: '2025-01-30',
        startTime: '15:00',
        endTime: '17:30',
        category: 'batting',
        condition: 4,
        menu: [
          { name: '素振り', value: 200, unit: '回' },
          { name: 'ティーバッティング', value: 150, unit: '球' },
          { name: 'フリーバッティング', value: 80, unit: '球' }
        ],
        note: '今日はスイングの軌道を意識して練習。特にインコースの対応を重点的に行った。'
      }
    },
    {
      id: 3,
      type: 'normal',
      content: '明日の先発投手は誰だろう？エースの調子が心配です。',
      author: '応援団長',
      timestamp: '2025-01-30T13:30:00',
      likes: 15,
      comments: 3
    }
  ]})

  useEffect(() => {
    localStorage.setItem('baseballSNSPosts', JSON.stringify(posts))
  }, [posts])
  
  useEffect(() => {
    localStorage.setItem('baseballSNSMyPageData', JSON.stringify(myPageData))
  }, [myPageData])

  const addPost = (content) => {
    const newPost = {
      id: Date.now(),
      type: 'normal',
      content,
      author: 'ゲストユーザー',
      timestamp: new Date().toISOString(),
      likes: 0,
      comments: 0
    }
    setPosts([newPost, ...posts])
  }

  const addPracticeRecord = (practiceData) => {
    const newPost = {
      id: Date.now(),
      type: 'practice',
      author: 'ゲストユーザー',
      timestamp: new Date().toISOString(),
      likes: 0,
      comments: 0,
      practiceData
    }
    setPosts([newPost, ...posts])
  }

  const addVideoPost = (videoData) => {
    const newPost = {
      id: Date.now(),
      type: 'video',
      author: 'ゲストユーザー',
      timestamp: new Date().toISOString(),
      likes: 0,
      comments: 0,
      videoData
    }
    setPosts([newPost, ...posts])
  }

  return (
    <Router>
      <div className="app">
        <header className="app-header">
          <h1>⚾ 野球SNS</h1>
          <p>野球ファンのためのコミュニティ</p>
        </header>
        
        <Navigation />
        
        <main className="app-main">
          <Routes>
            <Route 
              path="/" 
              element={
                <Timeline 
                  posts={posts}
                  addPost={addPost}
                  addPracticeRecord={addPracticeRecord}
                  addVideoPost={addVideoPost}
                />
              } 
            />
            <Route 
              path="/mypage" 
              element={
                <MyPage 
                  posts={posts.filter(post => post.type === 'practice' && post.author === 'ゲストユーザー')}
                  myPageData={myPageData}
                  setMyPageData={setMyPageData}
                />
              } 
            />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App