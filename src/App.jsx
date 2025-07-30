import React, { useState } from 'react'
import PostList from './components/PostList'
import PostForm from './components/PostForm'
import './App.css'

function App() {
  const [posts, setPosts] = useState([
    {
      id: 1,
      content: '今日は素晴らしい試合でした！9回裏の逆転サヨナラホームランは鳥肌ものでした！',
      author: '野球太郎',
      timestamp: new Date('2025-01-30T15:00:00'),
      likes: 42,
      comments: 5
    },
    {
      id: 2,
      content: '明日の先発投手は誰だろう？エースの調子が心配です。',
      author: '応援団長',
      timestamp: new Date('2025-01-30T14:30:00'),
      likes: 15,
      comments: 3
    }
  ])

  const addPost = (content) => {
    const newPost = {
      id: posts.length + 1,
      content,
      author: 'ゲストユーザー',
      timestamp: new Date(),
      likes: 0,
      comments: 0
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
        <PostForm onSubmit={addPost} />
        <PostList posts={posts} />
      </main>
    </div>
  )
}

export default App