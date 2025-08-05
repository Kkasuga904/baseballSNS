import React from 'react'
import './LoadingSpinner.css'

/**
 * ローディングスピナーコンポーネント
 * @param {Object} props
 * @param {boolean} props.fullPage - フルページ表示するかどうか
 * @param {string} props.size - サイズ（small, medium, large）
 * @param {string} props.message - 表示するメッセージ
 */
function LoadingSpinner({ fullPage = false, size = 'medium', message = '' }) {
  const spinner = (
    <div className={`loading-spinner-container ${size}`}>
      <div className="loading-spinner">
        <div className="spinner-ring"></div>
        <div className="spinner-ring"></div>
        <div className="spinner-ring"></div>
      </div>
      {message && <p className="loading-message">{message}</p>}
    </div>
  )
  
  if (fullPage) {
    return (
      <div className="loading-overlay">
        {spinner}
      </div>
    )
  }
  
  return spinner
}

export default LoadingSpinner