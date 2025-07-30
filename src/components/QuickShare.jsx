import React, { useState } from 'react'
import './QuickShare.css'

function QuickShare({ onShare }) {
  const [showQuickShare, setShowQuickShare] = useState(false)
  const [shareContent, setShareContent] = useState('')
  const [shareType, setShareType] = useState('status')

  const shareTypes = [
    { id: 'status', label: '近況', icon: '💭' },
    { id: 'achievement', label: '達成報告', icon: '🎯' },
    { id: 'question', label: '質問', icon: '❓' },
    { id: 'tips', label: 'アドバイス', icon: '💡' }
  ]

  const templates = {
    achievement: [
      '今日のルーティン全て完了！',
      '素振り1000回達成！',
      '打率3割突破！',
      'ベンチプレス自己新記録！',
      '連続〇日練習継続中！'
    ],
    status: [
      '今日も頑張ります！',
      '調子が良い感じ！',
      'フォーム改善中',
      '新しい練習メニューに挑戦',
      '休養日でリフレッシュ'
    ],
    question: [
      'スイングスピードを上げるには？',
      'おすすめのトレーニングメニューは？',
      '投球フォームのアドバイスください',
      '栄養管理のコツを教えてください',
      'メンタル強化の方法は？'
    ],
    tips: [
      '〇〇を意識したら打率が上がった！',
      'このストレッチがおすすめ',
      'プロテインのタイミングは〇〇',
      'この練習メニューが効果的',
      'メンタルトレーニングのコツ'
    ]
  }

  const handleQuickShare = () => {
    if (!shareContent.trim()) {
      alert('投稿内容を入力してください')
      return
    }

    // タイムラインへの投稿データを作成
    const postData = {
      id: Date.now(),
      type: 'quickShare',
      shareType: shareType,
      content: shareContent,
      author: localStorage.getItem('baseballSNSUser') || 'ゲスト',
      timestamp: new Date().toISOString(),
      likes: 0,
      comments: []
    }

    // 親コンポーネントに投稿を渡す
    if (onShare) {
      onShare(postData)
    }

    // フォームをリセット
    setShareContent('')
    setShareType('status')
    setShowQuickShare(false)
  }

  return (
    <div className="quick-share-container">
      {!showQuickShare ? (
        <button
          className="quick-share-button"
          onClick={() => setShowQuickShare(true)}
        >
          ✏️ タイムラインに投稿
        </button>
      ) : (
        <div className="quick-share-form">
          <div className="share-types">
            {shareTypes.map(type => (
              <button
                key={type.id}
                className={`share-type-btn ${shareType === type.id ? 'active' : ''}`}
                onClick={() => setShareType(type.id)}
              >
                <span className="type-icon">{type.icon}</span>
                <span className="type-label">{type.label}</span>
              </button>
            ))}
          </div>

          <textarea
            value={shareContent}
            onChange={(e) => setShareContent(e.target.value)}
            placeholder={`${shareTypes.find(t => t.id === shareType)?.label}を入力...`}
            rows="3"
            className="share-textarea"
          />

          {templates[shareType] && (
            <div className="templates">
              <p className="templates-label">💡 テンプレート:</p>
              <div className="template-chips">
                {templates[shareType].map((template, index) => (
                  <button
                    key={index}
                    className="template-chip"
                    onClick={() => setShareContent(template)}
                  >
                    {template}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="share-actions">
            <button
              className="share-submit"
              onClick={handleQuickShare}
            >
              投稿する
            </button>
            <button
              className="share-cancel"
              onClick={() => {
                setShowQuickShare(false)
                setShareContent('')
                setShareType('status')
              }}
            >
              キャンセル
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default QuickShare