import React from 'react'
import { Link } from 'react-router-dom'
import './Footer.css'

function Footer() {
  return (
    <footer className="app-footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>BaseLog</h3>
          <p>野球の記録と交流をひとつに</p>
        </div>
        
        <div className="footer-section">
          <h4>リンク</h4>
          <ul className="footer-links">
            <li><Link to="/">ホーム</Link></li>
            <li><Link to="/mypage">マイページ</Link></li>
            <li><Link to="/calendar">カレンダー</Link></li>
            <li><Link to="/disclaimer">免責事項</Link></li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h4>サポート</h4>
          <ul className="footer-links">
            <li><Link to="/disclaimer#contact">お問い合わせ</Link></li>
            <li><Link to="/privacy">プライバシーポリシー</Link></li>
            <li><Link to="/terms">利用規約</Link></li>
          </ul>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; 2025 BaseLog. All rights reserved.</p>
      </div>
    </footer>
  )
}

export default Footer