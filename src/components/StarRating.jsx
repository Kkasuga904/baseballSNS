import React from 'react'
import './StarRating.css'

function StarRating({ value, onChange, label }) {
  const stars = [1, 2, 3, 4, 5]

  return (
    <div className="star-rating">
      {label && <label className="star-rating-label">{label}</label>}
      <div className="stars">
        {stars.map((star) => (
          <button
            key={star}
            type="button"
            className={`star ${star <= value ? 'filled' : ''}`}
            onClick={() => onChange(star)}
          >
            ★
          </button>
        ))}
        <span className="condition-text">
          {value === 1 && '不調'}
          {value === 2 && 'やや不調'}
          {value === 3 && '普通'}
          {value === 4 && '好調'}
          {value === 5 && '絶好調'}
        </span>
      </div>
    </div>
  )
}

export default StarRating