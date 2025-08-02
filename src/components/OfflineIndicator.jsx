import React from 'react'
import './OfflineIndicator.css'

function OfflineIndicator({ isOnline, pendingCount = 0 }) {
  if (isOnline && pendingCount === 0) return null
  
  return (
    <div className={`offline-indicator ${!isOnline ? 'offline' : 'syncing'}`}>
      <div className="indicator-content">
        {!isOnline ? (
          <>
            <span className="indicator-icon">📡</span>
            <span className="indicator-text">オフラインモード</span>
          </>
        ) : (
          <>
            <span className="indicator-icon syncing">🔄</span>
            <span className="indicator-text">
              同期中... ({pendingCount}件)
            </span>
          </>
        )}
      </div>
    </div>
  )
}

export default OfflineIndicator