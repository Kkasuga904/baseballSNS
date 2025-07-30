import React, { useState } from 'react'
import { getPopularHashtags } from '../utils/hashtagUtils.jsx'
import './SearchBar.css'

function SearchBar({ posts, onSearch }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)
  
  const popularHashtags = getPopularHashtags(posts, 5)

  const handleSearch = (e) => {
    e.preventDefault()
    onSearch(searchQuery)
  }

  const handleHashtagClick = (hashtag) => {
    setSearchQuery(`#${hashtag}`)
    onSearch(`#${hashtag}`)
    setShowSuggestions(false)
  }

  const handleClear = () => {
    setSearchQuery('')
    onSearch('')
  }

  return (
    <div className="search-bar-container">
      <form onSubmit={handleSearch} className="search-form">
        <div className="search-input-wrapper">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            placeholder="投稿やハッシュタグを検索..."
            className="search-input"
          />
          {searchQuery && (
            <button 
              type="button" 
              onClick={handleClear}
              className="clear-button"
            >
              ✕
            </button>
          )}
        </div>
        <button type="submit" className="search-button">
          検索
        </button>
      </form>

      {showSuggestions && popularHashtags.length > 0 && (
        <div className="search-suggestions">
          <p className="suggestions-title">人気のハッシュタグ</p>
          <div className="hashtag-suggestions">
            {popularHashtags.map(({ tag, count }) => (
              <button
                key={tag}
                className="hashtag-suggestion"
                onClick={() => handleHashtagClick(tag)}
              >
                <span className="hashtag-text">#{tag}</span>
                <span className="hashtag-count">{count}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default SearchBar