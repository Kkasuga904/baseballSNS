import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../App'
import './ProfileSetup.css'

function ProfileSetup() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [formData, setFormData] = useState({
    sport: '', // baseball or softball
    throwingHand: '', // right or left
    battingHand: '', // right or left
    positions: [], // 複数ポジション
    nickname: '',
    category: '', // カテゴリ
    grade: '', // 学年
    pitcherTypes: [], // 投手タイプ（複数）
    height: '', // 身長
    weight: '', // 体重
    maxSpeed: '', // 最高球速
    pitchTypes: [] // 球種
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // ポジションが選択されているか確認
    if (formData.positions.length === 0) {
      alert('最低1つのポジションを選択してください')
      return
    }
    
    // ピッチャーが選択されている場合、投手タイプが選択されているか確認
    if (formData.positions.includes('pitcher') && formData.pitcherTypes.length === 0) {
      alert('最低1つの投手タイプを選択してください')
      return
    }
    
    // ローカルストレージにプロフィール情報を保存
    const profileKey = `baseballSNSProfile_${user?.email || 'guest'}`
    localStorage.setItem(profileKey, JSON.stringify({
      ...formData,
      setupCompleted: true,
      createdAt: new Date().toISOString()
    }))
    
    // ホーム画面へ遷移
    navigate('/')
  }

  const positions = {
    baseball: [
      { value: 'pitcher', label: '投手' },
      { value: 'catcher', label: '捕手' },
      { value: 'first', label: '一塁手' },
      { value: 'second', label: '二塁手' },
      { value: 'third', label: '三塁手' },
      { value: 'shortstop', label: '遊撃手' },
      { value: 'left', label: '左翼手' },
      { value: 'center', label: '中堅手' },
      { value: 'right', label: '右翼手' },
      { value: 'dh', label: '指名打者' }
    ],
    softball: [
      { value: 'pitcher', label: '投手' },
      { value: 'catcher', label: '捕手' },
      { value: 'first', label: '一塁手' },
      { value: 'second', label: '二塁手' },
      { value: 'third', label: '三塁手' },
      { value: 'shortstop', label: '遊撃手' },
      { value: 'left', label: '左翼手' },
      { value: 'center', label: '中堅手' },
      { value: 'right', label: '右翼手' },
      { value: 'dp', label: 'DP' }
    ]
  }

  return (
    <div className="profile-setup-container">
      <div className="profile-setup-card">
        <h2>⚾ プロフィール設定</h2>
        <p className="setup-subtitle">あなたの野球情報を教えてください</p>
        
        <form onSubmit={handleSubmit} className="profile-setup-form">
          <div className="form-section">
            <h3>スポーツ選択</h3>
            <div className="sport-selection">
              <label className={`sport-option ${formData.sport === 'baseball' ? 'selected' : ''}`}>
                <input
                  type="radio"
                  name="sport"
                  value="baseball"
                  checked={formData.sport === 'baseball'}
                  onChange={(e) => setFormData({ ...formData, sport: e.target.value, positions: [] })}
                />
                <span className="sport-icon">⚾</span>
                <span className="sport-label">野球</span>
              </label>
              
              <label className={`sport-option ${formData.sport === 'softball' ? 'selected' : ''}`}>
                <input
                  type="radio"
                  name="sport"
                  value="softball"
                  checked={formData.sport === 'softball'}
                  onChange={(e) => setFormData({ ...formData, sport: e.target.value, positions: [] })}
                />
                <span className="sport-icon">🥎</span>
                <span className="sport-label">ソフトボール</span>
              </label>
            </div>
          </div>

          <div className="form-section">
            <h3>投球・打撃</h3>
            <div className="hand-selection">
              <div className="hand-group">
                <label>投げ</label>
                <div className="hand-options">
                  <label className={`hand-option ${formData.throwingHand === 'right' ? 'selected' : ''}`}>
                    <input
                      type="radio"
                      name="throwingHand"
                      value="right"
                      checked={formData.throwingHand === 'right'}
                      onChange={(e) => setFormData({ ...formData, throwingHand: e.target.value })}
                      required
                    />
                    <span>右投げ</span>
                  </label>
                  <label className={`hand-option ${formData.throwingHand === 'left' ? 'selected' : ''}`}>
                    <input
                      type="radio"
                      name="throwingHand"
                      value="left"
                      checked={formData.throwingHand === 'left'}
                      onChange={(e) => setFormData({ ...formData, throwingHand: e.target.value })}
                      required
                    />
                    <span>左投げ</span>
                  </label>
                </div>
              </div>

              <div className="hand-group">
                <label>打ち</label>
                <div className="hand-options">
                  <label className={`hand-option ${formData.battingHand === 'right' ? 'selected' : ''}`}>
                    <input
                      type="radio"
                      name="battingHand"
                      value="right"
                      checked={formData.battingHand === 'right'}
                      onChange={(e) => setFormData({ ...formData, battingHand: e.target.value })}
                      required
                    />
                    <span>右打ち</span>
                  </label>
                  <label className={`hand-option ${formData.battingHand === 'left' ? 'selected' : ''}`}>
                    <input
                      type="radio"
                      name="battingHand"
                      value="left"
                      checked={formData.battingHand === 'left'}
                      onChange={(e) => setFormData({ ...formData, battingHand: e.target.value })}
                      required
                    />
                    <span>左打ち</span>
                  </label>
                  <label className={`hand-option ${formData.battingHand === 'switch' ? 'selected' : ''}`}>
                    <input
                      type="radio"
                      name="battingHand"
                      value="switch"
                      checked={formData.battingHand === 'switch'}
                      onChange={(e) => setFormData({ ...formData, battingHand: e.target.value })}
                      required
                    />
                    <span>両打ち</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3>ポジション（複数選択可）</h3>
            <div className="position-grid">
              {(positions[formData.sport || 'baseball']).map(pos => (
                  <label key={pos.value} className={`position-option ${formData.positions.includes(pos.value) ? 'selected' : ''}`}>
                    <input
                      type="checkbox"
                      value={pos.value}
                      checked={formData.positions.includes(pos.value)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFormData({ ...formData, positions: [...formData.positions, pos.value] })
                        } else {
                          setFormData({ ...formData, positions: formData.positions.filter(p => p !== pos.value), pitcherTypes: [] })
                        }
                      }}
                    />
                    <span>{pos.label}</span>
                  </label>
                ))}
              </div>
            {formData.positions.length === 0 && (
              <p className="position-hint">最低1つのポジションを選択してください</p>
            )}
          </div>

          {formData.positions.includes('pitcher') && (
            <div className="form-section">
              <h3>投手タイプ（複数選択可）</h3>
              <div className="pitcher-type-grid">
                <label className={`pitcher-type-option ${formData.pitcherTypes.includes('starter') ? 'selected' : ''}`}>
                  <input
                    type="checkbox"
                    value="starter"
                    checked={formData.pitcherTypes.includes('starter')}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFormData({ ...formData, pitcherTypes: [...formData.pitcherTypes, 'starter'] })
                      } else {
                        setFormData({ ...formData, pitcherTypes: formData.pitcherTypes.filter(t => t !== 'starter') })
                      }
                    }}
                  />
                  <span className="pitcher-type-icon">🏃</span>
                  <span>先発</span>
                </label>
                
                <label className={`pitcher-type-option ${formData.pitcherTypes.includes('middle') ? 'selected' : ''}`}>
                  <input
                    type="checkbox"
                    value="middle"
                    checked={formData.pitcherTypes.includes('middle')}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFormData({ ...formData, pitcherTypes: [...formData.pitcherTypes, 'middle'] })
                      } else {
                        setFormData({ ...formData, pitcherTypes: formData.pitcherTypes.filter(t => t !== 'middle') })
                      }
                    }}
                  />
                  <span className="pitcher-type-icon">🔄</span>
                  <span>中継ぎ</span>
                </label>
                
                <label className={`pitcher-type-option ${formData.pitcherTypes.includes('closer') ? 'selected' : ''}`}>
                  <input
                    type="checkbox"
                    value="closer"
                    checked={formData.pitcherTypes.includes('closer')}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFormData({ ...formData, pitcherTypes: [...formData.pitcherTypes, 'closer'] })
                      } else {
                        setFormData({ ...formData, pitcherTypes: formData.pitcherTypes.filter(t => t !== 'closer') })
                      }
                    }}
                  />
                  <span className="pitcher-type-icon">🔥</span>
                  <span>抑え</span>
                </label>
                
                <label className={`pitcher-type-option ${formData.pitcherTypes.includes('other') ? 'selected' : ''}`}>
                  <input
                    type="checkbox"
                    value="other"
                    checked={formData.pitcherTypes.includes('other')}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFormData({ ...formData, pitcherTypes: [...formData.pitcherTypes, 'other'] })
                      } else {
                        setFormData({ ...formData, pitcherTypes: formData.pitcherTypes.filter(t => t !== 'other') })
                      }
                    }}
                  />
                  <span className="pitcher-type-icon">⚾</span>
                  <span>その他</span>
                </label>
              </div>
              {formData.pitcherTypes.length === 0 && (
                <p className="position-hint">最低1つの投手タイプを選択してください</p>
              )}
            </div>
          )}

          <div className="form-section">
            <h3>ニックネーム</h3>
            <input
              type="text"
              value={formData.nickname}
              onChange={(e) => setFormData({ ...formData, nickname: e.target.value })}
              placeholder="野球太郎"
              className="nickname-input"
              required
            />
          </div>

          <div className="form-section">
            <h3>カテゴリ</h3>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value, grade: '' })}
              className="category-select"
              required
            >
              <option value="">カテゴリを選択</option>
              <option value="middle">中学</option>
              <option value="high">高校</option>
              <option value="university">大学</option>
              <option value="serious">社会人（本気）</option>
              <option value="amateur">草野球</option>
              <option value="youth">少年野球</option>
              <option value="pro">プロ・独立</option>
              <option value="other">その他</option>
            </select>
          </div>

          {['middle', 'high', 'university'].includes(formData.category) && (
            <div className="form-section">
              <h3>学年（任意）</h3>
              <select
                value={formData.grade}
                onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                className="grade-select"
              >
                <option value="">学年を選択</option>
                <option value="1">1年</option>
                <option value="2">2年</option>
                <option value="3">3年</option>
                {formData.category === 'university' && <option value="4">4年</option>}
              </select>
            </div>
          )}

          <div className="form-section">
            <h3>身体情報（任意）</h3>
            <div className="physical-info-grid">
              <div className="physical-info-item">
                <label htmlFor="height">身長 (cm)</label>
                <input
                  id="height"
                  type="number"
                  min="100"
                  max="250"
                  step="0.1"
                  value={formData.height}
                  onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                  placeholder="170.5"
                  className="physical-input"
                />
              </div>
              <div className="physical-info-item">
                <label htmlFor="weight">体重 (kg)</label>
                <input
                  id="weight"
                  type="number"
                  min="30"
                  max="200"
                  step="0.1"
                  value={formData.weight}
                  onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                  placeholder="65.5"
                  className="physical-input"
                />
              </div>
            </div>
          </div>

          {formData.positions.includes('pitcher') && (
            <div className="form-section">
              <h3>投手情報（任意）</h3>
              <div className="pitcher-info">
                <div className="pitcher-info-item">
                  <label htmlFor="maxSpeed">最高球速 (km/h)</label>
                  <input
                    id="maxSpeed"
                    type="number"
                    min="50"
                    max="200"
                    value={formData.maxSpeed}
                    onChange={(e) => setFormData({ ...formData, maxSpeed: e.target.value })}
                    placeholder="140"
                    className="physical-input"
                  />
                </div>
                <div className="pitch-types-section">
                  <label>球種（複数選択可）</label>
                  <div className="pitch-types-grid">
                    {[
                      'ストレート',
                      'カーブ',
                      'スライダー',
                      'フォーク',
                      'チェンジアップ',
                      'カットボール',
                      'シュート',
                      'シンカー',
                      'スプリット',
                      'ナックル'
                    ].map(pitch => (
                      <label key={pitch} className={`pitch-type-option ${formData.pitchTypes.includes(pitch) ? 'selected' : ''}`}>
                        <input
                          type="checkbox"
                          value={pitch}
                          checked={formData.pitchTypes.includes(pitch)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFormData({ ...formData, pitchTypes: [...formData.pitchTypes, pitch] })
                            } else {
                              setFormData({ ...formData, pitchTypes: formData.pitchTypes.filter(p => p !== pitch) })
                            }
                          }}
                        />
                        <span>{pitch}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          <button type="submit" className="setup-submit-button">
            プロフィールを保存
          </button>
        </form>
      </div>
    </div>
  )
}

export default ProfileSetup