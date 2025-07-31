import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../App'
import ProfileTabs from '../components/ProfileTabs'
import './Profile.css'

function Profile() {
  const { user } = useAuth()
  const { userId } = useParams()
  const navigate = useNavigate()
  
  // 表示するユーザーを判定（自分 or 他のユーザー）
  const isOwnProfile = !userId || userId === user?.id || userId === user?.email
  const displayUserId = isOwnProfile ? (user?.email || 'guest') : userId
  
  const [isEditing, setIsEditing] = useState(false)
  const [profile, setProfile] = useState(() => {
    const profileKey = `baseballSNSProfile_${displayUserId}`
    const savedProfile = localStorage.getItem(profileKey)
    return savedProfile ? JSON.parse(savedProfile) : null
  })
  
  const [editData, setEditData] = useState({})
  
  // 生年月日を年月日に分解する関数
  const parseBirthDate = (dateString) => {
    if (!dateString) return { year: '', month: '', day: '' }
    const [year, month, day] = dateString.split('-')
    return {
      year: year || '',
      month: parseInt(month) || '',
      day: parseInt(day) || ''
    }
  }
  const [avatarPreview, setAvatarPreview] = useState(null)
  
  useEffect(() => {
    if (!user) {
      navigate('/login')
    }
  }, [user, navigate])
  
  const handleEdit = () => {
    const editDataWithParsedDate = profile || {}
    if (editDataWithParsedDate.birthDate) {
      const { year, month, day } = parseBirthDate(editDataWithParsedDate.birthDate)
      editDataWithParsedDate.birthYear = year
      editDataWithParsedDate.birthMonth = month
      editDataWithParsedDate.birthDay = day
      editDataWithParsedDate.birthDateInput = `${year}${String(month).padStart(2, '0')}${String(day).padStart(2, '0')}`
    }
    setEditData(editDataWithParsedDate)
    setAvatarPreview(null)
    setIsEditing(true)
  }
  
  const handleSave = () => {
    const profileKey = `baseballSNSProfile_${displayUserId}`
    localStorage.setItem(profileKey, JSON.stringify(editData))
    setProfile(editData)
    setAvatarPreview(null)
    setIsEditing(false)
  }
  
  const handleCancel = () => {
    setEditData({})
    setAvatarPreview(null)
    setIsEditing(false)
  }
  
  const handleAvatarChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      // ファイルサイズチェック（5MB以下）
      if (file.size > 5 * 1024 * 1024) {
        alert('画像サイズは5MB以下にしてください')
        return
      }
      
      // 画像タイプチェック
      if (!file.type.startsWith('image/')) {
        alert('画像ファイルを選択してください')
        return
      }
      
      const reader = new FileReader()
      reader.onload = (event) => {
        const imageUrl = event.target.result
        setAvatarPreview(imageUrl)
        setEditData({...editData, avatar: imageUrl})
      }
      reader.readAsDataURL(file)
    }
  }
  
  const getHandLabel = (throwingHand, battingHand) => {
    const throwLabel = throwingHand === 'right' ? '右投' : '左投'
    const batLabel = battingHand === 'right' ? '右打' : battingHand === 'left' ? '左打' : '両打'
    return `${throwLabel}${batLabel}`
  }
  
  const getPositionLabels = (positionArray, sport, pitcherTypes) => {
    const positions = {
      baseball: {
        pitcher: '投手', catcher: '捕手', first: '一塁手', second: '二塁手',
        third: '三塁手', shortstop: '遊撃手', left: '左翼手', center: '中堅手',
        right: '右翼手', dh: '指名打者'
      },
      softball: {
        pitcher: '投手', catcher: '捕手', first: '一塁手', second: '二塁手',
        third: '三塁手', shortstop: '遊撃手', left: '左翼手', center: '中堅手',
        right: '右翼手', dp: 'DP'
      }
    }
    
    const pitcherTypeLabels = {
      starter: '先発', middle: '中継ぎ', closer: '抑え', other: 'その他'
    }
    
    return positionArray.map(pos => {
      if (pos === 'pitcher' && pitcherTypes && pitcherTypes.length > 0) {
        const types = pitcherTypes.map(t => pitcherTypeLabels[t]).join('・')
        return `${positions[sport] && positions[sport][pos]}(${types})`
      }
      return (positions[sport] && positions[sport][pos]) || pos
    }).join('・')
  }
  
  const getCategoryLabel = (category) => {
    const categories = {
      middle: '中学', high: '高校', university: '大学',
      serious: '社会人（本気）', amateur: '草野球', youth: '少年野球',
      pro: 'プロ・独立', other: 'その他'
    }
    return categories[category] || category
  }
  
  const positionOptions = {
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
  
  if (!profile && !isEditing) {
    return (
      <div className="profile-page">
        <div className="profile-container">
          <h1>プロフィール</h1>
          <div className="no-profile">
            <p>プロフィールが設定されていません。</p>
            <button className="btn-primary" onClick={() => navigate('/profile-setup')}>
              プロフィールを設定する
            </button>
          </div>
        </div>
      </div>
    )
  }
  
  return (
    <div className="profile-page">
      <div className="profile-container">
        <div className="profile-header">
          <h1>プロフィール</h1>
          {!isEditing && isOwnProfile && (
            <button className="btn-edit" onClick={handleEdit}>
              編集
            </button>
          )}
        </div>
        
        {!isEditing ? (
          <div className="profile-content">
            <div className="profile-avatar-section">
              <div className="avatar-display">
                {profile.avatar ? (
                  <img src={profile.avatar} alt={profile.nickname} className="profile-avatar" />
                ) : (
                  <div className="avatar-placeholder">
                    <span className="avatar-icon">👤</span>
                  </div>
                )}
              </div>
              <div className="profile-name">
                <h2>{profile.nickname}</h2>
                <p>{user && user.email}</p>
              </div>
            </div>
            
            <ProfileTabs 
              profile={profile}
              user={user}
              isOwnProfile={isOwnProfile}
              getCategoryLabel={getCategoryLabel}
              getPositionLabels={getPositionLabels}
              getHandLabel={getHandLabel}
            />
          </div>
        ) : (
          <div className="profile-edit">
            <div className="profile-section">
              <h2>プロフィール画像</h2>
              <div className="avatar-upload-section">
                <div className="avatar-preview">
                  {avatarPreview || editData.avatar ? (
                    <img 
                      src={avatarPreview || editData.avatar} 
                      alt="プロフィール画像" 
                      className="profile-avatar-preview" 
                    />
                  ) : (
                    <div className="avatar-placeholder">
                      <span className="avatar-icon">👤</span>
                    </div>
                  )}
                </div>
                <div className="avatar-upload-controls">
                  <label htmlFor="avatar-upload" className="avatar-upload-label">
                    <span className="upload-icon">📷</span>
                    画像を選択
                  </label>
                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    style={{ display: 'none' }}
                  />
                  {(avatarPreview || editData.avatar) && (
                    <button 
                      type="button"
                      className="avatar-remove-btn"
                      onClick={() => {
                        setAvatarPreview(null)
                        setEditData({...editData, avatar: null})
                      }}
                    >
                      画像を削除
                    </button>
                  )}
                  <p className="avatar-help-text">
                    5MB以下の画像ファイルを選択してください
                  </p>
                </div>
              </div>
            </div>
            
            <div className="profile-section">
              <h2>基本情報</h2>
              <div className="form-field">
                <label>🎂 生年月日</label>
                <div className="birth-date-single-input">
                  <input
                    type="text"
                    placeholder="19951225 (年月日で8桁)"
                    maxLength="8"
                    value={editData.birthDateInput || ''}
                    onChange={(e) => {
                      const input = e.target.value.replace(/\D/g, '') // 数字のみ
                      if (input.length <= 8) {
                        setEditData(prev => {
                          const newData = { ...prev, birthDateInput: input }
                          
                          // 8桁入力された場合、自動的に分解
                          if (input.length === 8) {
                            const year = input.substring(0, 4)
                            const month = input.substring(4, 6)
                            const day = input.substring(6, 8)
                            
                            // 有効な日付かチェック
                            const currentYear = new Date().getFullYear()
                            if (year >= 1900 && year <= currentYear && 
                                month >= 1 && month <= 12 && 
                                day >= 1 && day <= 31) {
                              newData.birthYear = year
                              newData.birthMonth = parseInt(month)
                              newData.birthDay = parseInt(day)
                              newData.birthDate = `${year}-${month}-${day}`
                            }
                          }
                          
                          return newData
                        })
                      }
                    }}
                    className="birth-single-input"
                  />
                  <div className="birth-format-hint">
                    例: 1995年12月25日 → 19951225
                  </div>
                </div>
                <div className="birth-date-alternative">
                  <label className="date-picker-label">
                    📅 または日付選択:
                    <input
                      type="date"
                      value={editData.birthDate || ''}
                      onChange={(e) => {
                        const date = e.target.value
                        if (date) {
                          const [year, month, day] = date.split('-')
                          setEditData(prev => ({
                            ...prev,
                            birthDate: date,
                            birthYear: year,
                            birthMonth: parseInt(month),
                            birthDay: parseInt(day),
                            birthDateInput: `${year}${month}${day}`
                          }))
                        }
                      }}
                      className="birth-date-picker"
                    />
                  </label>
                </div>
              </div>
              <div className="form-field">
                <label>ニックネーム</label>
                <input
                  type="text"
                  value={editData.nickname || ''}
                  onChange={(e) => setEditData({...editData, nickname: e.target.value})}
                  placeholder="ニックネームを入力"
                />
              </div>
              <div className="form-field">
                <label>スポーツ</label>
                <select
                  value={editData.sport || ''}
                  onChange={(e) => setEditData({...editData, sport: e.target.value})}
                >
                  <option value="">選択してください</option>
                  <option value="baseball">野球</option>
                  <option value="softball">ソフトボール</option>
                </select>
              </div>
              <div className="form-field">
                <label>カテゴリー</label>
                <select
                  value={editData.category || ''}
                  onChange={(e) => setEditData({...editData, category: e.target.value})}
                >
                  <option value="">選択してください</option>
                  <option value="youth">少年野球</option>
                  <option value="middle">中学</option>
                  <option value="high">高校</option>
                  <option value="university">大学</option>
                  <option value="serious">社会人（本気）</option>
                  <option value="amateur">草野球</option>
                  <option value="pro">プロ・独立</option>
                  <option value="other">その他</option>
                </select>
              </div>
              {['middle', 'high', 'university'].includes(editData.category) && (
                <div className="form-field">
                  <label>学年</label>
                  <select
                    value={editData.grade || ''}
                    onChange={(e) => setEditData({...editData, grade: e.target.value})}
                  >
                    <option value="">選択してください</option>
                    <option value="1">1年</option>
                    <option value="2">2年</option>
                    <option value="3">3年</option>
                    {editData.category === 'university' && <option value="4">4年</option>}
                  </select>
                </div>
              )}
            </div>
            
            <div className="profile-section">
              <h2>出身校情報</h2>
              <div className="privacy-note">
                ※ 各項目の公開・非公開を選択できます
              </div>
              
              <div className="form-field">
                <label>出身中学校</label>
                <div className="school-input-group">
                  <input
                    type="text"
                    value={editData.middleSchool || ''}
                    onChange={(e) => setEditData({...editData, middleSchool: e.target.value})}
                    placeholder="中学校名を入力"
                  />
                  <div className="privacy-toggle">
                    <label className="privacy-checkbox">
                      <input
                        type="checkbox"
                        checked={editData.middleSchoolPublic !== false}
                        onChange={(e) => setEditData({...editData, middleSchoolPublic: e.target.checked})}
                      />
                      公開
                    </label>
                  </div>
                </div>
              </div>
              
              <div className="form-field">
                <label>出身高校</label>
                <div className="school-input-group">
                  <input
                    type="text"
                    value={editData.highSchool || ''}
                    onChange={(e) => setEditData({...editData, highSchool: e.target.value})}
                    placeholder="高校名を入力"
                  />
                  <div className="privacy-toggle">
                    <label className="privacy-checkbox">
                      <input
                        type="checkbox"
                        checked={editData.highSchoolPublic !== false}
                        onChange={(e) => setEditData({...editData, highSchoolPublic: e.target.checked})}
                      />
                      公開
                    </label>
                  </div>
                </div>
              </div>
              
              <div className="form-field">
                <label>出身大学</label>
                <div className="school-input-group">
                  <input
                    type="text"
                    value={editData.university || ''}
                    onChange={(e) => setEditData({...editData, university: e.target.value})}
                    placeholder="大学名を入力"
                  />
                  <div className="privacy-toggle">
                    <label className="privacy-checkbox">
                      <input
                        type="checkbox"
                        checked={editData.universityPublic !== false}
                        onChange={(e) => setEditData({...editData, universityPublic: e.target.checked})}
                      />
                      公開
                    </label>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="profile-section">
              <h2>野球情報</h2>
              <div className="form-field">
                <label>ポジション（複数選択可）</label>
                <div className="position-grid">
                  {(positionOptions[editData.sport] || positionOptions.baseball).map(pos => (
                    <label key={pos.value} className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={(editData.positions || []).includes(pos.value)}
                        onChange={(e) => {
                          const positions = editData.positions || []
                          if (e.target.checked) {
                            setEditData({...editData, positions: [...positions, pos.value]})
                          } else {
                            setEditData({...editData, positions: positions.filter(p => p !== pos.value)})
                          }
                        }}
                      />
                      {pos.label}
                    </label>
                  ))}
                </div>
              </div>
              
              {(editData.positions || []).includes('pitcher') && (
                <div className="form-field">
                  <label>投手タイプ（複数選択可）</label>
                  <div className="pitcher-types">
                    {[
                      { value: 'starter', label: '先発' },
                      { value: 'middle', label: '中継ぎ' },
                      { value: 'closer', label: '抑え' },
                      { value: 'other', label: 'その他' }
                    ].map(type => (
                      <label key={type.value} className="checkbox-label">
                        <input
                          type="checkbox"
                          checked={(editData.pitcherTypes || []).includes(type.value)}
                          onChange={(e) => {
                            const types = editData.pitcherTypes || []
                            if (e.target.checked) {
                              setEditData({...editData, pitcherTypes: [...types, type.value]})
                            } else {
                              setEditData({...editData, pitcherTypes: types.filter(t => t !== type.value)})
                            }
                          }}
                        />
                        {type.label}
                      </label>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="form-field">
                <label>投げる手</label>
                <div className="radio-group">
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="throwingHand"
                      value="right"
                      checked={editData.throwingHand === 'right'}
                      onChange={(e) => setEditData({...editData, throwingHand: e.target.value})}
                    />
                    右投げ
                  </label>
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="throwingHand"
                      value="left"
                      checked={editData.throwingHand === 'left'}
                      onChange={(e) => setEditData({...editData, throwingHand: e.target.value})}
                    />
                    左投げ
                  </label>
                </div>
              </div>
              
              <div className="form-field">
                <label>打つ手</label>
                <div className="radio-group">
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="battingHand"
                      value="right"
                      checked={editData.battingHand === 'right'}
                      onChange={(e) => setEditData({...editData, battingHand: e.target.value})}
                    />
                    右打ち
                  </label>
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="battingHand"
                      value="left"
                      checked={editData.battingHand === 'left'}
                      onChange={(e) => setEditData({...editData, battingHand: e.target.value})}
                    />
                    左打ち
                  </label>
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="battingHand"
                      value="switch"
                      checked={editData.battingHand === 'switch'}
                      onChange={(e) => setEditData({...editData, battingHand: e.target.value})}
                    />
                    両打ち
                  </label>
                </div>
              </div>
            </div>
            
            <div className="profile-section">
              <h2>身体情報</h2>
              <div className="form-field">
                <label>身長 (cm)</label>
                <input
                  type="number"
                  value={editData.height || ''}
                  onChange={(e) => setEditData({...editData, height: e.target.value})}
                  placeholder="170"
                  min="100"
                  max="250"
                />
              </div>
              <div className="form-field">
                <label>体重 (kg)</label>
                <input
                  type="number"
                  value={editData.weight || ''}
                  onChange={(e) => setEditData({...editData, weight: e.target.value})}
                  placeholder="70"
                  min="30"
                  max="200"
                  step="0.1"
                />
              </div>
              <div className="form-field">
                <label>💪 体脂肪率 (%)</label>
                <input
                  type="number"
                  value={editData.bodyFat || ''}
                  onChange={(e) => setEditData({...editData, bodyFat: e.target.value})}
                  placeholder="12.5"
                  min="3"
                  max="50"
                  step="0.1"
                />
              </div>
            </div>
            
            {(editData.positions || []).includes('pitcher') && (
              <div className="profile-section">
                <h2>投手情報</h2>
                <div className="form-field">
                  <label>最高球速 (km/h)</label>
                  <input
                    type="number"
                    value={editData.maxSpeed || ''}
                    onChange={(e) => setEditData({...editData, maxSpeed: e.target.value})}
                    placeholder="140"
                    min="50"
                    max="200"
                  />
                </div>
                <div className="form-field">
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
                      'ナックル',
                      'スローカーブ',
                      'パワーカーブ',
                      'スラーブ',
                      'ツーシーム',
                      'フォーシーム',
                      'その他'
                    ].map(pitch => (
                      <label key={pitch} className="checkbox-label">
                        <input
                          type="checkbox"
                          checked={(editData.pitchTypes || []).includes(pitch)}
                          onChange={(e) => {
                            const types = editData.pitchTypes || []
                            if (e.target.checked) {
                              setEditData({...editData, pitchTypes: [...types, pitch]})
                            } else {
                              setEditData({...editData, pitchTypes: types.filter(t => t !== pitch)})
                            }
                          }}
                        />
                        {pitch}
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}
            
            <div className="profile-actions">
              <button className="btn-primary" onClick={handleSave}>
                保存
              </button>
              <button className="btn-secondary" onClick={handleCancel}>
                キャンセル
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Profile