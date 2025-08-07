import React, { useState } from 'react';
import './ProfileTabs.css';

function ProfileTabs({ profile, user, isOwnProfile, getCategoryLabel, getPositionLabels, getHandLabel }) {
  const [activeTab, setActiveTab] = useState('timeline');
  const [profileTab, setProfileTab] = useState('basic');
  const [isEditing, setIsEditing] = useState(false);
  const [editableProfile, setEditableProfile] = useState(profile);
  
  // ポジションオプション
  const positionOptions = [
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
  ];
  
  const handleSave = () => {
    // ここで実際の保存処理を実装
    console.log('保存:', editableProfile);
    setIsEditing(false);
  };
  
  const handleCancel = () => {
    setEditableProfile(profile);
    setIsEditing(false);
  };
  
  return (
    <div className="profile-tabs-container">
      {/* メインタブ切り替え */}
      <div className="main-tabs">
        <button
          className={`main-tab ${activeTab === 'timeline' ? 'active' : ''}`}
          onClick={() => setActiveTab('timeline')}
        >
          <span className="tab-icon">📊</span>
          タイムライン
        </button>
        <button
          className={`main-tab ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          <span className="tab-icon">👤</span>
          リアル部活
        </button>
        <button
          className={`main-tab ${activeTab === 'measurements' ? 'active' : ''}`}
          onClick={() => setActiveTab('measurements')}
        >
          <span className="tab-icon">📊</span>
          身体測定記録
        </button>
      </div>

      {/* プロフィールタブのサブタブ */}
      {activeTab === 'profile' && (
        <div className="profile-tabs-header">
          <button
            className={`profile-tab ${profileTab === 'basic' ? 'active' : ''}`}
            onClick={() => setProfileTab('basic')}
          >
            <span className="tab-icon">👤</span>
            基本情報
          </button>
          <button
            className={`profile-tab ${profileTab === 'baseball' ? 'active' : ''}`}
            onClick={() => setProfileTab('baseball')}
          >
            <span className="tab-icon">⚾</span>
            野球情報
          </button>
          <button
            className={`profile-tab ${profileTab === 'physical' ? 'active' : ''}`}
            onClick={() => setProfileTab('physical')}
          >
            <span className="tab-icon">💪</span>
            身体情報
          </button>
          <button
            className={`profile-tab ${profileTab === 'school' ? 'active' : ''}`}
            onClick={() => setProfileTab('school')}
          >
            <span className="tab-icon">🏫</span>
            出身校
          </button>
        </div>
      )}
      
      {/* タブコンテンツ */}
      <div className="profile-tab-content">
        {/* タイムラインタブ */}
        {activeTab === 'timeline' && (
          <div className="timeline-section">
            <div className="timeline-placeholder">
              <h3>📊 練習記録タイムライン</h3>
              <p>練習の記録や成果がここに表示されます</p>
              <p className="coming-soon">Coming Soon...</p>
            </div>
          </div>
        )}
        
        {/* 身体測定記録タブ */}
        {activeTab === 'measurements' && (
          <div className="measurements-section">
            <div className="measurements-placeholder">
              <h3>📊 身体測定・記録管理</h3>
              <p>身体測定記録を管理します</p>
              <p className="coming-soon">この機能はマイページの「身体測定・記録管理」タブでご利用ください</p>
            </div>
          </div>
        )}

        {/* リアル部活タブの中の基本情報タブ */}
        {activeTab === 'profile' && profileTab === 'basic' && (
          <div className="profile-section">
            <div className="profile-field">
              <label>ニックネーム</label>
              <div className="field-value">{profile.nickname}</div>
            </div>
            <div className="profile-field">
              <label>メールアドレス</label>
              <div className="field-value">{user && user.email}</div>
            </div>
            <div className="profile-field">
              <label>スポーツ</label>
              <div className="field-value">
                {profile.sport === 'baseball' ? '⚾ 野球' : '🥎 ソフトボール'}
              </div>
            </div>
            <div className="profile-field">
              <label>カテゴリー</label>
              <div className="field-value">
                {getCategoryLabel(profile.category)}
                {profile.grade && ` ${profile.grade}年`}
              </div>
            </div>
            {profile.birthDate && (
              <div className="profile-field">
                <label>🎂 年齢</label>
                <div className="field-value age-display">
                  {(() => {
                    const today = new Date()
                    const birthDate = new Date(profile.birthDate)
                    let age = today.getFullYear() - birthDate.getFullYear()
                    const monthDiff = today.getMonth() - birthDate.getMonth()
                    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                      age--
                    }
                    return `${age}歳`
                  })()}
                </div>
              </div>
            )}
          </div>
        )}
        
        {/* リアル部活タブの中の野球情報タブ */}
        {activeTab === 'profile' && profileTab === 'baseball' && (
          <div className="profile-section">
            {isOwnProfile && (
              <div className="profile-edit-controls">
                {!isEditing ? (
                  <button className="btn-edit" onClick={() => setIsEditing(true)}>
                    ✏️ 編集
                  </button>
                ) : (
                  <div className="edit-buttons">
                    <button className="btn-save" onClick={handleSave}>
                      ✅ 保存
                    </button>
                    <button className="btn-cancel" onClick={handleCancel}>
                      ❌ キャンセル
                    </button>
                  </div>
                )}
              </div>
            )}
            <div className="profile-field">
              <label>ポジション</label>
              {isEditing ? (
                <select 
                  className="position-select"
                  value={editableProfile.position || ''}
                  onChange={(e) => setEditableProfile({...editableProfile, position: e.target.value})}
                >
                  <option value="">選択してください</option>
                  {positionOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              ) : (
                <div className="field-value">
                  {getPositionLabels(
                    profile.positions || [profile.position], 
                    profile.sport, 
                    profile.pitcherTypes || (profile.pitcherType ? [profile.pitcherType] : [])
                  )}
                </div>
              )}
            </div>
            <div className="profile-field">
              <label>投打</label>
              <div className="field-value">
                {getHandLabel(profile.throwingHand, profile.battingHand)}
              </div>
            </div>
            <div className="profile-field">
              <label>背番号</label>
              <div className="field-value">{profile.uniformNumber || '---'}</div>
            </div>
            <div className="profile-field">
              <label>打席</label>
              <div className="field-value">{profile.battingOrder || '---'}</div>
            </div>
          </div>
        )}
        
        {/* リアル部活タブの中の身体情報タブ */}
        {activeTab === 'profile' && profileTab === 'physical' && (
          <div className="profile-section">
            <div className="profile-field">
              <label>身長</label>
              <div className="field-value">{profile.height || '---'} cm</div>
            </div>
            <div className="profile-field">
              <label>体重</label>
              <div className="field-value">{profile.weight || '---'} kg</div>
            </div>
            <div className="profile-field">
              <label>体脂肪率</label>
              <div className="field-value">{profile.bodyFat ? `${profile.bodyFat}%` : '---'}</div>
            </div>
            <div className="profile-field">
              <label>最高球速</label>
              <div className="field-value">{profile.maxSpeed ? `${profile.maxSpeed} km/h` : '---'}</div>
            </div>
          </div>
        )}
        
        {/* リアル部活タブの中の出身校タブ */}
        {activeTab === 'profile' && profileTab === 'school' && (
          <div className="profile-section">
            <div className="profile-field">
              <label>出身中学校</label>
              <div className={`field-value ${
                profile.middleSchool && profile.middleSchoolPublic !== false 
                  ? '' 
                  : (profile.middleSchool && profile.middleSchoolPublic === false 
                      ? 'private-info' 
                      : 'unset-info')
              }`}>
                {profile.middleSchool && profile.middleSchoolPublic !== false 
                  ? profile.middleSchool 
                  : profile.middleSchool && profile.middleSchoolPublic === false 
                    ? '🔒 非公開' 
                    : '--- 未設定 ---'}
              </div>
            </div>
            <div className="profile-field">
              <label>出身高校</label>
              <div className={`field-value ${
                profile.highSchool && profile.highSchoolPublic !== false 
                  ? '' 
                  : (profile.highSchool && profile.highSchoolPublic === false 
                      ? 'private-info' 
                      : 'unset-info')
              }`}>
                {profile.highSchool && profile.highSchoolPublic !== false 
                  ? profile.highSchool 
                  : profile.highSchool && profile.highSchoolPublic === false 
                    ? '🔒 非公開' 
                    : '--- 未設定 ---'}
              </div>
            </div>
            <div className="profile-field">
              <label>出身大学</label>
              <div className={`field-value ${
                profile.university && profile.universityPublic !== false 
                  ? '' 
                  : (profile.university && profile.universityPublic === false 
                      ? 'private-info' 
                      : 'unset-info')
              }`}>
                {profile.university && profile.universityPublic !== false 
                  ? profile.university 
                  : profile.university && profile.universityPublic === false 
                    ? '🔒 非公開' 
                    : '--- 未設定 ---'}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProfileTabs;