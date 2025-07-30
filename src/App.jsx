import React, { useState } from 'react'
import PostList from './components/PostList'
import PostForm from './components/PostForm'
import PracticeForm from './components/PracticeForm'
import PostTypeSelector from './components/PostTypeSelector'
import './App.css'

function App() {
  const [postType, setPostType] = useState('normal')
  const [posts, setPosts] = useState([
    {
      id: 1,
      type: 'normal',
      content: '今日は素晴らしい試合でした！9回裏の逆転サヨナラホームランは鳥肌ものでした！',
      author: '野球太郎',
      timestamp: new Date('2025-01-30T15:00:00'),
      likes: 42,
      comments: 5
    },
    {
      id: 2,
      type: 'practice',
      author: '練習マニア',
      timestamp: new Date('2025-01-30T14:00:00'),
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
      timestamp: new Date('2025-01-30T13:30:00'),
      likes: 15,
      comments: 3
    }
  ])

  const addPost = (content) => {
    const newPost = {
      id: posts.length + 1,
      type: 'normal',
      content,
      author: 'ゲストユーザー',
      timestamp: new Date(),
      likes: 0,
      comments: 0
    }
    setPosts([newPost, ...posts])
  }

  const addPracticeRecord = (practiceData) => {
    const newPost = {
      id: posts.length + 1,
      type: 'practice',
      author: 'ゲストユーザー',
      timestamp: new Date(),
      likes: 0,
      comments: 0,
      practiceData
    }
    setPosts([newPost, ...posts])
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>⚾ 野球SNS</h1>
        <p>野球ファンのためのコミュニティ</p>
      </header>
      
      <main className="app-main">
        <PostTypeSelector 
          postType={postType} 
          onTypeChange={setPostType} 
        />
        
        {postType === 'normal' ? (
          <PostForm onSubmit={addPost} />
        ) : (
          <PracticeForm onSubmit={addPracticeRecord} />
        )}
        
        <PostList posts={posts} />
      </main>
    </div>
  )
}

export default App