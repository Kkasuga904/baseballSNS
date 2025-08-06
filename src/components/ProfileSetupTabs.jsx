import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../App'
import './ProfileSetupTabs.css'

function ProfileSetupTabs() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('basic')
  const [formData, setFormData] = useState({
    sport: '', // baseball or softball
    throwingHand: '', // right or left
    battingHand: '', // right or left
    positions: [''], // 複数ポジション（初期状態で1つ）
    nickname: '',
    realName: '', // 本名
    category: '', // カテゴリ
    grade: '', // 学年
    pitcherTypes: [], // 投手タイプ（複数）
    height: '', // 身長
    weight: '', // 体重
    maxSpeed: '', // 最高球速
    pitchTypes: [], // 球種
    birthDate: '', // 生年月日
    birthDateInput: '', // 生年月日入力フィールド
    birthYear: '', // 生年
    birthMonth: '', // 生月
    birthDay: '', // 生日
    bodyFat: '' // 体脂肪率
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
    const profileData = {
      ...formData,
      setupCompleted: true,
      createdAt: new Date().toISOString()
    }
    
    // 管理者アカウントの場合は専用のキーに保存
    if (user?.email === 'over9131120@gmail.com') {
      localStorage.setItem('baseballSNSAdminProfile', JSON.stringify(profileData))
    } else {
      const profileKey = `baseballSNSProfile_${user?.email || 'guest'}`
      localStorage.setItem(profileKey, JSON.stringify(profileData))
    }
    
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

  const tabs = [
    { id: 'basic', label: '基本情報', icon: '👤' },
    { id: 'baseball', label: '野球情報', icon: '⚾' },
    { id: 'physical', label: '身体情報', icon: '💪' },
    { id: 'pitcher', label: '投手情報', icon: '🔥', condition: formData.positions.includes('pitcher') }
  ]

  return (
    <div className="profile-setup-container">
      <div className="profile-setup-card">
        <h2>⚾ プロフィール設定</h2>
        <p className="setup-subtitle">あなたの野球情報を教えてください</p>
        
        <form onSubmit={handleSubmit} className="profile-setup-form">
          <div className="setup-tabs-container">
            <div className="setup-tabs-header">
              {tabs.filter(tab => tab.condition !== false).map(tab => (
                <button
                  key={tab.id}
                  type="button"
                  className={`setup-tab ${activeTab === tab.id ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <span className="tab-icon">{tab.icon}</span>
                  <span className="tab-label">{tab.label}</span>
                </button>
              ))}
            </div>

            <div className="setup-tab-content">
              {/* 基本情報タブ */}
              {activeTab === 'basic' && (
                <div className="tab-panel">
                  {/* デバッグ情報 */}
                  <div style={{background: '#fffbeb', padding: '10px', marginBottom: '20px', border: '1px solid #fbbf24', borderRadius: '4px'}}>
                    <p style={{margin: '5px 0', fontSize: '14px', color: '#92400e'}}>
                      <strong>【デバッグ情報】</strong>
                    </p>
                    <p style={{margin: '5px 0', fontSize: '12px', color: '#78350f'}}>
                      現在のタブ: "{activeTab}"
                    </p>
                    <p style={{margin: '5px 0', fontSize: '12px', color: '#78350f'}}>
                      birthDateInput値: "{formData.birthDateInput || '空'}" (長さ: {(formData.birthDateInput || '').length})
                    </p>
                    <p style={{margin: '5px 0', fontSize: '12px', color: '#78350f'}}>
                      birthDate値: "{formData.birthDate || '空'}"
                    </p>
                  </div>
                  
                  <div className="form-section">
                    <h3>スポーツ選択</h3>
                    <select
                      value={formData.sport}
                      onChange={(e) => setFormData({ ...formData, sport: e.target.value, positions: [] })}
                      className="sport-select"
                      required
                    >
                      <option value="">スポーツを選択してください</option>
                      <option value="baseball">⚾ 野球</option>
                      <option value="softball">🥎 ソフトボール</option>
                    </select>
                  </div>

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
                    <h3>本名（任意）</h3>
                    <input
                      type="text"
                      value={formData.realName}
                      onChange={(e) => setFormData({ ...formData, realName: e.target.value })}
                      placeholder="山田太郎"
                      className="realname-input"
                    />
                    <p className="privacy-note">※本名は公開されません</p>
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
                    <h3>生年月日（任意）</h3>
                    <div style={{marginBottom: '20px', padding: '10px', background: '#ffebee', border: '2px dashed #f44336', borderRadius: '4px'}}>
                      <p style={{color: '#d32f2f', fontSize: '14px', marginBottom: '10px'}}>
                        【テスト用シンプル入力フィールド】
                      </p>
                      <input
                        type="text"
                        value={formData.birthDateInput || ''}
                        onChange={(e) => {
                          console.log('テスト onChange:', e.target.value);
                          setFormData(prev => ({...prev, birthDateInput: e.target.value}));
                        }}
                        onFocus={() => console.log('テスト フォーカス')}
                        onClick={() => console.log('テスト クリック')}
                        placeholder="テスト入力 - ここに入力できるか確認"
                        style={{
                          width: '100%',
                          padding: '10px',
                          border: '3px solid red',
                          fontSize: '16px',
                          backgroundColor: 'white',
                          color: 'black',
                          outline: 'none',
                          boxSizing: 'border-box'
                        }}
                      />
                      <p style={{color: '#757575', fontSize: '12px', marginTop: '5px'}}>
                        入力値: "{formData.birthDateInput || '空'}"
                      </p>
                    </div>
                    
                    <div className="birth-date-single-input">
                      <p style={{fontSize: '12px', color: '#666', marginBottom: '5px'}}>
                        【本来の入力フィールド（デバッグ中）】
                      </p>
                      <input
                        type="text"
                        placeholder="19951225 (年月日で8桁)"
                        maxLength="8"
                        value={formData.birthDateInput || ''}
                        onChange={(e) => {
                          const input = e.target.value.replace(/\D/g, '');
                          console.log('本番 onChange:', input);
                          if (input.length <= 8) {
                            setFormData(prev => ({...prev, birthDateInput: input}));
                          }
                        }}
                        className="birth-single-input"
                      />
                      <div className="birth-format-hint">
                        例: 1995年12月25日 → 19951225
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 野球情報タブ */}
              {activeTab === 'baseball' && (
                <div className="tab-panel">
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
                    <h3>メインポジション</h3>
                    <div className="positions-container">
                      {formData.positions.map((position, index) => (
                        <div key={index} className="position-item">
                          <select
                            value={position}
                            onChange={(e) => {
                              const newPositions = [...formData.positions];
                              const newValue = e.target.value;
                              if (newValue) {
                                newPositions[index] = newValue;
                              } else {
                                newPositions.splice(index, 1);
                              }
                              setFormData({ 
                                ...formData, 
                                positions: newPositions,
                                // ピッチャーが選択されていない場合は投手タイプをクリア
                                pitcherTypes: newPositions.includes('pitcher') ? formData.pitcherTypes : []
                              });
                            }}
                            className="position-select"
                          >
                            <option value="">ポジションを選択</option>
                            {(positions[formData.sport || 'baseball']).map(pos => (
                              <option 
                                key={pos.value} 
                                value={pos.value}
                                disabled={formData.positions.includes(pos.value) && pos.value !== position}
                              >
                                {pos.label}
                              </option>
                            ))}
                          </select>
                          {formData.positions.length > 1 && (
                            <button
                              type="button"
                              onClick={() => {
                                const newPositions = formData.positions.filter((_, i) => i !== index);
                                setFormData({ 
                                  ...formData, 
                                  positions: newPositions,
                                  pitcherTypes: newPositions.includes('pitcher') ? formData.pitcherTypes : []
                                });
                              }}
                              className="remove-position-btn"
                              title="削除"
                            >
                              ✕
                            </button>
                          )}
                        </div>
                      ))}
                      
                      {/* ポジション追加ボタン */}
                      {formData.positions.length < (positions[formData.sport || 'baseball']).length && (
                        <button
                          type="button"
                          onClick={() => {
                            setFormData({ 
                              ...formData, 
                              positions: [...formData.positions, ''] 
                            });
                          }}
                          className="add-position-btn"
                        >
                          <span className="plus-icon">＋</span>
                          <span>ポジションを追加</span>
                        </button>
                      )}
                    </div>
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
                </div>
              )}

              {/* 身体情報タブ */}
              {activeTab === 'physical' && (
                <div className="tab-panel">
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
                      <div className="physical-info-item">
                        <label htmlFor="bodyFat">体脂肪率 (%)</label>
                        <input
                          id="bodyFat"
                          type="number"
                          min="3"
                          max="50"
                          step="0.1"
                          value={formData.bodyFat}
                          onChange={(e) => setFormData({ ...formData, bodyFat: e.target.value })}
                          placeholder="12.5"
                          className="physical-input"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 投手情報タブ */}
              {activeTab === 'pitcher' && formData.positions.includes('pitcher') && (
                <div className="tab-panel">
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
                </div>
              )}
            </div>
          </div>

          <button type="submit" className="setup-submit-button">
            プロフィールを保存
          </button>
        </form>
      </div>
    </div>
  )
}

export default ProfileSetupTabs