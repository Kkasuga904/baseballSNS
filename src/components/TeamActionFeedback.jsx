import React, { useEffect } from 'react';
import './TeamActionFeedback.css';

function TeamActionFeedback({ isLoading, success, error, onClose }) {
  useEffect(() => {
    if (success) {
      // 成功音を再生（ブラウザが対応している場合）
      const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQoGAABgYGBgYGBgYGBgYGBg');
      audio.volume = 0.3;
      audio.play().catch(() => {}); // エラーは無視
      
      // 1.5秒後に自動的に閉じる
      const timer = setTimeout(() => {
        if (onClose) onClose();
      }, 1500);
      
      return () => clearTimeout(timer);
    }
  }, [success, onClose]);
  
  if (isLoading) {
    return (
      <div className="team-action-overlay">
        <div className="team-action-modal">
          <div className="loading-spinner"></div>
          <p className="loading-text">処理中...</p>
        </div>
      </div>
    );
  }
  
  if (success) {
    return (
      <div className="team-action-overlay">
        <div className="team-action-modal success">
          <div className="success-icon">✅</div>
          <h3 className="success-title">成功！</h3>
          <p className="success-message">{success}</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="team-action-overlay">
        <div className="team-action-modal error">
          <div className="error-icon">❌</div>
          <h3 className="error-title">エラー</h3>
          <p className="error-message">{error}</p>
          <button 
            onClick={onClose}
            className="error-close-btn"
          >
            閉じる
          </button>
        </div>
      </div>
    );
  }
  
  return null;
}

export default TeamActionFeedback;