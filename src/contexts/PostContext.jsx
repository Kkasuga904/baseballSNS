import React, { createContext, useState, useContext, useEffect } from 'react';

const PostContext = createContext();

export const usePosts = () => {
  const context = useContext(PostContext);
  if (!context) {
    throw new Error('usePosts must be used within PostProvider');
  }
  return context;
};

const POSTS_KEY = 'baseballSNSPosts';

export function PostProvider({ children }) {
  const [posts, setPosts] = useState(() => {
    const savedPosts = localStorage.getItem(POSTS_KEY);
    return savedPosts ? JSON.parse(savedPosts) : [];
  });

  // 投稿を保存
  useEffect(() => {
    localStorage.setItem(POSTS_KEY, JSON.stringify(posts));
  }, [posts]);

  // 投稿を追加
  const addPost = (postData) => {
    const newPost = {
      ...postData,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      likes: 0,
      comments: 0
    };
    setPosts([newPost, ...posts]);
    return newPost;
  };

  // 投稿を削除
  const deletePost = (postId) => {
    setPosts(posts.filter(post => post.id !== postId));
  };

  // 投稿を更新
  const updatePost = (postId, updates) => {
    setPosts(posts.map(post => 
      post.id === postId ? { ...post, ...updates } : post
    ));
  };

  const value = {
    posts,
    setPosts,
    addPost,
    deletePost,
    updatePost
  };

  return <PostContext.Provider value={value}>{children}</PostContext.Provider>;
}