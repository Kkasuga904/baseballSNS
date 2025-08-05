/**
 * PracticeForm.jsx - 練習記録フォームコンポーネント
 * 
 * 野球の練習内容を詳細に記録するためのフォームです。
 * 打撃、投球、守備、走塁、トレーニングなど様々な練習カテゴリーに対応。
 * 
 * 機能:
 * - 練習カテゴリー別の入力フォーム
 * - 練習メニューの動的追加/削除
 * - コンディション評価（5段階）
 * - 動画アップロード機能
 * - 投球練習専用の詳細記録
 * - 試合結果の記録
 */

import React, { useState, useRef, useEffect } from 'react'
import StarRating from './StarRating'
import PitchingPracticeForm from './PitchingPracticeForm'
import PitchingChart from './PitchingChart'
import SimpleGameResultForm from './SimpleGameResultForm'
import CustomPracticeItems from './CustomPracticeItems'
import { useAuth } from '../App'
import './PracticeForm.css'

/**
 * 練習記録フォームコンポーネント
 * 
 * @param {Object} props
 * @param {Function} props.onSubmit - フォーム送信時のコールバック関数
 */
function PracticeForm({ onSubmit, selectedDate, onClose }) {
  const { user } = useAuth()
  /**
   * フォームデータの状態管理
   * 
   * @property {string} date - 練習日
   * @property {string} startTime - 開始時刻
   * @property {string} endTime - 終了時刻
   * @property {string} category - 練習カテゴリー
   * @property {string} trainingPart - トレーニング部位（トレーニングカテゴリー選択時）
   * @property {number} condition - コンディション（1-5の5段階評価）
   * @property {number} intensity - 練習強度（1-5の5段階評価）
   * @property {Array} menu - 練習メニューの配列
   * @property {Array} pitchingData - 投球データ（投球練習時）
   * @property {string} maxVelocity - 最高球速（投球練習時）
   * @property {Object} gameResultData - 試合結果データ（試合カテゴリー時）
   * @property {string} note - メモ・備考
   * @property {File} videoFile - アップロードされた動画ファイル
   * @property {string} videoUrl - 動画のプレビューURL
   */
  const [formData, setFormData] = useState({
    date: selectedDate || new Date().toISOString().split('T')[0],
    yesterdayBedtime: '',
    todayWakeTime: '',
    todayGoals: [''],
    menu: [{ name: '', value: '', unit: '回', category: '' }],
    freeText: '',
    reflection: '',
    condition: 3,
    sleepTime: '',
    breakfast: '',
    lunch: '',
    dinner: '',
    supplements: '',
    tomorrowGoals: [''],
    startTime: '',
    endTime: '',
    category: '',
    trainingPart: '',
    intensity: 3,
    pitchingData: [],
    maxVelocity: '',
    gameResultData: null,
    note: '',
    videoFile: null,
    videoUrl: null
  })
  
  // すべてのカテゴリーを管理（デフォルト＋カスタム）
  const [practiceCategories, setPracticeCategories] = useState(() => {
    // ローカルストレージから保存されたカテゴリーを読み込む
    const saved = localStorage.getItem('allPracticeCategories')
    if (saved) {
      return JSON.parse(saved)
    }
    // デフォルトのカテゴリー
    return {
      batting: { label: '打撃練習', icon: '🏏' },
      pitching: { label: '投球練習', icon: '⚾' },
      fielding: { label: '守備練習', icon: '🧤' },
      running: { label: '走塁練習', icon: '🏃' },
      training: { label: 'トレーニング', icon: '💪' },
      stretch: { label: 'ストレッチ', icon: '🧘' },
      mbthrow: { label: 'MBスロー', icon: '🏐' },
      plyometrics: { label: 'プライオメトリックス', icon: '🦘' },
      sprint: { label: 'スプリント', icon: '💨' },
      game: { label: '試合', icon: '🏟️' },
      rest: { label: '休養日', icon: '😴' }
    }
  })
  
  
  // 動画入力フィールドへの参照（リセット用）
  const videoInputRef = useRef(null)

  // 練習カテゴリーが更新されたら再読み込み
  useEffect(() => {
    const handleStorageChange = () => {
      const saved = localStorage.getItem('allPracticeCategories')
      if (saved) {
        setPracticeCategories(JSON.parse(saved))
      }
    }
    
    // storage イベントをリッスン（他のタブでの変更を検知）
    window.addEventListener('storage', handleStorageChange)
    
    // フォーカス時にも再読み込み（同じタブでの変更を検知）
    window.addEventListener('focus', handleStorageChange)
    
    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('focus', handleStorageChange)
    }
  }, [])

  // 別タブからのメッセージを受信
  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data.type === 'updateFreeText') {
        setFormData(prev => ({
          ...prev,
          freeText: event.data.value
        }))
      }
    }
    
    window.addEventListener('message', handleMessage)
    
    return () => {
      window.removeEventListener('message', handleMessage)
    }
  }, [])

  /**
   * トレーニング部位の定義
   * トレーニングカテゴリー選択時に使用
   */
  const trainingParts = {
    chest: { label: '胸', icon: '🫁' },
    back: { label: '背中', icon: '🔙' },
    biceps: { label: '二頭筋', icon: '💪' },
    triceps: { label: '三頭筋', icon: '🦾' },
    legs: { label: '下半身', icon: '🦵' },
    abs: { label: '腹筋', icon: '🎯' },
    shoulders: { label: '肩', icon: '🤸' }
  }
  
  /**
   * 基礎トレーニング種目のプリセット
   * 各部位に対する一般的なトレーニング種目
   * ユーザーの入力を補助するための候補
   */
  const basicExercises = {
    chest: ['ベンチプレス', 'ダンベルプレス', 'プッシュアップ', 'ダンベルフライ', 'ケーブルクロスオーバー'],
    back: ['デッドリフト', 'ラットプルダウン', '懸垂', 'ベントオーバーロウ', 'シーテッドロウ'],
    biceps: ['バーベルカール', 'ダンベルカール', 'ハンマーカール', 'プリーチャーカール', 'ケーブルカール'],
    triceps: ['トライセプスエクステンション', 'ディップス', 'ケーブルプレスダウン', 'ダンベルキックバック', 'ナローグリップベンチプレス'],
    legs: ['スクワット', 'レッグプレス', 'ランジ', 'レッグカール', 'カーフレイズ', 'ブルガリアンスクワット'],
    abs: ['プランク', 'クランチ', 'レッグレイズ', 'ロシアンツイスト', 'アブローラー', 'マウンテンクライマー'],
    shoulders: ['ショルダープレス', 'サイドレイズ', 'フロントレイズ', 'リアレイズ', 'アップライトロウ']
  }

  // 練習メニューの単位（回数、球数、時間など）
  const commonUnits = ['回', '球', '本', '分', 'セット']

  /**
   * フォーム入力値の変更ハンドラー
   * 
   * @param {string} field - 変更するフィールド名
   * @param {any} value - 新しい値
   */
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  /**
   * 睡眠時間を計算
   * 
   * @param {string} bedtime - 就寝時間 (HH:MM形式)
   * @param {string} wakeTime - 起床時間 (HH:MM形式)
   * @returns {string} 睡眠時間の文字列
   */
  const calculateSleepDuration = (bedtime, wakeTime) => {
    const [bedHour, bedMin] = bedtime.split(':').map(Number)
    const [wakeHour, wakeMin] = wakeTime.split(':').map(Number)
    
    let totalMinutes = (wakeHour * 60 + wakeMin) - (bedHour * 60 + bedMin)
    
    // 日付をまたぐ場合の処理
    if (totalMinutes < 0) {
      totalMinutes += 24 * 60
    }
    
    const hours = Math.floor(totalMinutes / 60)
    const minutes = totalMinutes % 60
    
    return `${hours}時間${minutes}分`
  }
  
  /**
   * 動画ファイル選択ハンドラー
   * ファイルタイプとサイズのバリデーションを実行
   * 
   * @param {Event} e - ファイル選択イベント
   */
  const handleVideoSelect = (e) => {
    const file = e.target.files[0]
    if (!file) return
    
    // 動画ファイルかチェック
    if (!file.type.startsWith('video/')) {
      alert('動画ファイルを選択してください')
      return
    }
    
    // ファイルサイズチェック（100MB以下）
    if (file.size > 100 * 1024 * 1024) {
      alert('ファイルサイズが大きすぎます。100MB以下の動画をアップロードしてください。')
      return
    }
    
    // プレビュー用のURLを生成
    const url = URL.createObjectURL(file)
    setFormData(prev => ({
      ...prev,
      videoFile: file,
      videoUrl: url
    }))
  }
  
  /**
   * 動画削除ハンドラー
   * メモリリークを防ぐためObjectURLを解放
   */
  const removeVideo = () => {
    if (formData.videoUrl) {
      URL.revokeObjectURL(formData.videoUrl)
    }
    setFormData(prev => ({
      ...prev,
      videoFile: null,
      videoUrl: null
    }))
    // ファイル入力フィールドをリセット
    if (videoInputRef.current) {
      videoInputRef.current.value = ''
    }
  }

  /**
   * 練習メニュー項目の変更ハンドラー
   * 
   * @param {number} index - メニュー配列のインデックス
   * @param {string} field - 変更するフィールド（name/value/unit）
   * @param {string} value - 新しい値
   */
  const handleMenuChange = (index, field, value) => {
    const newMenu = [...formData.menu]
    newMenu[index] = { ...newMenu[index], [field]: value }
    setFormData(prev => ({
      ...prev,
      menu: newMenu
    }))
  }

  /**
   * 練習メニュー項目を追加
   */
  const addMenuItem = () => {
    setFormData(prev => ({
      ...prev,
      menu: [...prev.menu, { name: '', value: '', unit: '回' }]
    }))
  }

  /**
   * 練習メニュー項目を削除
   * 
   * @param {number} index - 削除する項目のインデックス
   */
  const removeMenuItem = (index) => {
    const newMenu = formData.menu.filter((_, i) => i !== index)
    setFormData(prev => ({
      ...prev,
      menu: newMenu
    }))
  }

  /**
   * 今日の目標を追加
   */
  const addTodayGoal = () => {
    setFormData(prev => ({
      ...prev,
      todayGoals: [...prev.todayGoals, '']
    }))
  }

  /**
   * 今日の目標を削除
   */
  const removeTodayGoal = (index) => {
    const newGoals = formData.todayGoals.filter((_, i) => i !== index)
    setFormData(prev => ({
      ...prev,
      todayGoals: newGoals.length === 0 ? [''] : newGoals
    }))
  }

  /**
   * 今日の目標を更新
   */
  const updateTodayGoal = (index, value) => {
    const newGoals = [...formData.todayGoals]
    newGoals[index] = value
    setFormData(prev => ({
      ...prev,
      todayGoals: newGoals
    }))
  }

  /**
   * 明日の目標を追加
   */
  const addTomorrowGoal = () => {
    setFormData(prev => ({
      ...prev,
      tomorrowGoals: [...prev.tomorrowGoals, '']
    }))
  }

  /**
   * 明日の目標を削除
   */
  const removeTomorrowGoal = (index) => {
    const newGoals = formData.tomorrowGoals.filter((_, i) => i !== index)
    setFormData(prev => ({
      ...prev,
      tomorrowGoals: newGoals.length === 0 ? [''] : newGoals
    }))
  }

  /**
   * 明日の目標を更新
   */
  const updateTomorrowGoal = (index, value) => {
    const newGoals = [...formData.tomorrowGoals]
    newGoals[index] = value
    setFormData(prev => ({
      ...prev,
      tomorrowGoals: newGoals
    }))
  }

  /**
   * 投球データの更新ハンドラー
   * PitchingPracticeFormから受け取ったデータを設定
   * 
   * @param {Array} data - 投球データの配列
   */
  const handlePitchingDataUpdate = (data) => {
    setFormData(prev => ({
      ...prev,
      pitchingData: data
    }))
  }

  /**
   * 試合結果データの更新ハンドラー
   * 
   * @param {Object} data - 試合結果データ
   */
  const handleGameResultUpdate = (data) => {
    setFormData(prev => ({
      ...prev,
      gameResultData: data
    }))
  }

  /**
   * カテゴリー変更時の処理
   * カテゴリーに応じて不要なデータをクリア
   * 
   * @param {string} category - 新しいカテゴリー
   */
  const handleCategoryChange = (category) => {
    const updates = { category }
    
    // トレーニング以外の場合は部位をクリア
    if (category !== 'training') {
      updates.trainingPart = ''
    }
    
    // 投球練習以外の場合は投球データをクリア
    if (category !== 'pitching') {
      updates.pitchingData = []
      updates.maxVelocity = ''
    }
    
    // 試合以外の場合は試合結果をクリア
    if (category !== 'game') {
      updates.gameResultData = null
    }
    
    handleInputChange('category', category)
  }
  

  /**
   * フォーム送信ハンドラー
   * バリデーションを実行してデータを親コンポーネントに送信
   * 
   * @param {Event} e - フォーム送信イベント
   */
  const handleSubmit = (e) => {
    e.preventDefault()
    
    // 休養日の場合は最小限のデータで送信
    if (formData.category === 'rest') {
      onSubmit({
        ...formData,
        menu: [],
        startTime: formData.startTime || '00:00',
        endTime: formData.endTime || '00:00'
      })
      return
    }
    
    // 試合カテゴリーの場合のバリデーション
    if (formData.category === 'game' && !formData.gameResultData) {
      alert('試合結果を入力してください')
      return
    }
    
    // フィルタリング：入力された練習メニューのみを送信
    const filteredMenu = formData.menu.filter(item => item.name && item.value)
    
    // 基本的なバリデーション
    if (!formData.date || !formData.startTime || !formData.endTime) {
      alert('日付、開始時刻、終了時刻を入力してください')
      return
    }
    
    if (filteredMenu.length === 0 && formData.category !== 'pitching') {
      if (formData.category === 'game') {
        // 試合の場合は振り返り項目が必須ではない（任意）
      } else {
        alert('練習メニューを少なくとも1つ入力してください')
        return
      }
    }
    
    // 送信データの準備
    onSubmit({
      ...formData,
      menu: filteredMenu
    })
  }

  // JSXレンダリング部分
  // タブの状態管理
  const [activeTab, setActiveTab] = useState('practice')
  
  return (
    <div className="practice-form modern-form">
      {/* モダンフォームヘッダー */}
      <div className="modern-form-header">
        <button
          type="button"
          className="back-button"
          onClick={onClose}
          aria-label="戻る"
        >
          ‹
        </button>
        <h2>Daily Record</h2>
        <div className="header-spacer"></div>
      </div>
      
      
      <form className="modern-form-content" onSubmit={handleSubmit}>
      
      {/* 日付入力セクション */}
      <div className="form-section date-section">
        <div className="section-icon">🗓</div>
        <label className="form-label">Date</label>
        <div className="date-input-wrapper" onClick={() => {
          const input = document.getElementById('date-input');
          if (input) {
            try {
              if (input.showPicker) {
                input.showPicker();
              } else {
                input.focus();
                input.click();
              }
            } catch (error) {
              // showPicker()が失敗した場合はfocus()にフォールバック
              input.focus();
            }
          }
        }}>
          <input
            id="date-input"
            type="date"
            value={formData.date}
            onChange={(e) => handleInputChange('date', e.target.value)}
            className="date-input"
            required
          />
          <span className="calendar-icon">📅</span>
        </div>
        
        {/* 睡眠時間 */}
        <div className="sleep-section-inline">
          <div className="section-icon">🛌</div>
          <label className="form-label">睡眠時間:</label>
          <div className="sleep-inputs-container">
            <div className="sleep-inputs-row">
              <div className="sleep-input-wrapper">
                <label className="sleep-label">昨日の就寝時間:</label>
                <div className="time-display">
                  <select
                    value={formData.yesterdayBedtime ? formData.yesterdayBedtime.split(':')[0] : ''}
                    onChange={(e) => {
                      const hour = e.target.value;
                      const min = formData.yesterdayBedtime ? formData.yesterdayBedtime.split(':')[1] : '00';
                      handleInputChange('yesterdayBedtime', hour ? `${hour}:${min}` : '');
                    }}
                    className="time-select hour-select"
                  >
                    <option value="">--</option>
                    {[...Array(24)].map((_, i) => (
                      <option key={i} value={String(i).padStart(2, '0')}>
                        {String(i).padStart(2, '0')}
                      </option>
                    ))}
                  </select>
                  <span className="time-separator">:</span>
                  <select
                    value={formData.yesterdayBedtime ? formData.yesterdayBedtime.split(':')[1] : ''}
                    onChange={(e) => {
                      const hour = formData.yesterdayBedtime ? formData.yesterdayBedtime.split(':')[0] : '00';
                      const min = e.target.value;
                      handleInputChange('yesterdayBedtime', hour ? `${hour}:${min}` : '');
                    }}
                    className="time-select minute-select"
                  >
                    <option value="">--</option>
                    {[0, 15, 30, 45].map((min) => (
                      <option key={min} value={String(min).padStart(2, '0')}>
                        {String(min).padStart(2, '0')}
                      </option>
                    ))}
                  </select>
                  <span className="time-icon">🕐</span>
                </div>
              </div>
              <div className="sleep-input-wrapper">
                <label className="sleep-label">今日の起床時間:</label>
                <div className="time-display">
                  <select
                    value={formData.todayWakeTime ? formData.todayWakeTime.split(':')[0] : ''}
                    onChange={(e) => {
                      const hour = e.target.value;
                      const min = formData.todayWakeTime ? formData.todayWakeTime.split(':')[1] : '00';
                      handleInputChange('todayWakeTime', hour ? `${hour}:${min}` : '');
                    }}
                    className="time-select hour-select"
                  >
                    <option value="">--</option>
                    {[...Array(24)].map((_, i) => (
                      <option key={i} value={String(i).padStart(2, '0')}>
                        {String(i).padStart(2, '0')}
                      </option>
                    ))}
                  </select>
                  <span className="time-separator">:</span>
                  <select
                    value={formData.todayWakeTime ? formData.todayWakeTime.split(':')[1] : ''}
                    onChange={(e) => {
                      const hour = formData.todayWakeTime ? formData.todayWakeTime.split(':')[0] : '00';
                      const min = e.target.value;
                      handleInputChange('todayWakeTime', hour ? `${hour}:${min}` : '');
                    }}
                    className="time-select minute-select"
                  >
                    <option value="">--</option>
                    {[0, 15, 30, 45].map((min) => (
                      <option key={min} value={String(min).padStart(2, '0')}>
                        {String(min).padStart(2, '0')}
                      </option>
                    ))}
                  </select>
                  <span className="time-icon">ℹ️</span>
                </div>
              </div>
            </div>
            {formData.yesterdayBedtime && formData.todayWakeTime && (
              <div className="sleep-duration">
                睡眠時間: {calculateSleepDuration(formData.yesterdayBedtime, formData.todayWakeTime)}
              </div>
            )}
          </div>
        </div>
        
        {/* タブ切り替え */}
        <div className="form-tabs">
          <button
            type="button"
            className={`tab-button ${activeTab === 'practice' ? 'active' : ''}`}
            onClick={() => setActiveTab('practice')}
          >
            Practice
          </button>
          <button
            type="button"
            className={`tab-button ${activeTab === 'game' ? 'active' : ''}`}
            onClick={() => setActiveTab('game')}
          >
            Game
          </button>
          <button
            type="button"
            className={`tab-button ${activeTab === 'training' ? 'active' : ''}`}
            onClick={() => setActiveTab('training')}
          >
            Training
          </button>
        </div>
      </div>
      
      {/* 今日の目標 */}
      <div className="form-section">
        <div className="section-icon">🎯</div>
        <label className="form-label">今日の目標:</label>
        <div className="goals-list">
          {formData.todayGoals.map((goal, index) => (
            <div key={index} className="goal-input-wrapper">
              <input
                type="text"
                value={goal}
                onChange={(e) => updateTodayGoal(index, e.target.value)}
                className="text-input goal-input"
                placeholder={index === 0 ? "例：バッティングフォームの改善" : "追加の目標"}
              />
              {formData.todayGoals.length > 1 && (
                <button
                  type="button"
                  className="remove-goal-button"
                  onClick={() => removeTodayGoal(index)}
                >
                  ×
                </button>
              )}
            </div>
          ))}
          <button 
            type="button" 
            className="add-goal-button" 
            onClick={addTodayGoal}
          >
            +目標を追加
          </button>
        </div>
      </div>

      {/* 実施内容（ドリル） */}
      <div className="form-section">
        <div className="section-icon">✅</div>
        <label className="form-label">実施内容（ドリル）:</label>
        <div className="drill-list">
          {formData.menu.map((item, index) => (
            <div key={index} className="drill-input-wrapper">
              <select
                className="drill-select"
                value={item.category || ''}
                onChange={(e) => {
                  const newMenu = [...formData.menu];
                  const category = e.target.value;
                  newMenu[index] = {
                    ...newMenu[index],
                    category: category,
                    name: practiceCategories[category]?.label || ''
                  };
                  setFormData(prev => ({ ...prev, menu: newMenu }));
                }}
              >
                <option value="">Select Drill</option>
                {Object.entries(practiceCategories).map(([key, category]) => (
                  <option key={key} value={key}>
                    {category.icon} {category.label}
                  </option>
                ))}
              </select>
              <input
                type="number"
                placeholder="Count"
                className="count-input"
                value={item.value || ''}
                onChange={(e) => {
                  const newMenu = [...formData.menu];
                  newMenu[index] = { ...newMenu[index], value: e.target.value };
                  setFormData(prev => ({ ...prev, menu: newMenu }));
                }}
              />
              {formData.menu.length > 1 && (
                <button
                  type="button"
                  className="remove-drill-button"
                  onClick={() => removeMenuItem(index)}
                >
                  ×
                </button>
              )}
            </div>
          ))}
          <button type="button" className="add-drill-button" onClick={addMenuItem}>+追加</button>
        </div>
      </div>
      

      {/* トレーニングカテゴリー選択時の部位選択 */}
      {formData.category === 'training' && (
        <div className="form-group">
          <label>トレーニング部位</label>
          <div className="training-parts-grid">
            {Object.entries(trainingParts).map(([key, part]) => (
              <button
                key={key}
                type="button"
                className={`part-button ${formData.trainingPart === key ? 'active' : ''}`}
                onClick={() => handleInputChange('trainingPart', key)}
              >
                <span className="part-icon">{part.icon}</span>
                <span className="part-label">{part.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 自由記入欄 */}
      <div className="form-section">
        <div className="section-icon">📝</div>
        <label className="form-label">練習内容・メモ:</label>
        <div className="free-text-header">
          <span className="free-text-hint">練習の詳細、気づき、改善点などを自由に記入</span>
          <button
            type="button"
            className="open-fullscreen-button"
            onClick={() => {
              const content = formData.freeText || '';
              const newTab = window.open('', '_blank');
              newTab.document.write(`
                <!DOCTYPE html>
                <html>
                <head>
                  <title>練習記録 - ${formData.date}</title>
                  <style>
                    body {
                      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                      padding: 20px;
                      max-width: 800px;
                      margin: 0 auto;
                      background: #f8f9fa;
                    }
                    textarea {
                      width: 100%;
                      min-height: 80vh;
                      padding: 20px;
                      font-size: 16px;
                      line-height: 1.6;
                      border: 1px solid #e0e0e0;
                      border-radius: 8px;
                      background: white;
                      resize: vertical;
                    }
                    .header {
                      display: flex;
                      justify-content: space-between;
                      align-items: center;
                      margin-bottom: 20px;
                    }
                    h1 {
                      color: #333;
                      margin: 0;
                    }
                    .save-button {
                      background: #4CAF50;
                      color: white;
                      padding: 10px 20px;
                      border: none;
                      border-radius: 6px;
                      font-size: 16px;
                      cursor: pointer;
                    }
                    .save-button:hover {
                      background: #45a049;
                    }
                  </style>
                </head>
                <body>
                  <div class="header">
                    <h1>練習記録 - ${formData.date}</h1>
                    <button class="save-button" onclick="window.close()">閉じる</button>
                  </div>
                  <textarea id="freeText" placeholder="練習内容を詳しく記入...">${content}</textarea>
                  <script>
                    const textarea = document.getElementById('freeText');
                    textarea.addEventListener('input', () => {
                      window.opener.postMessage({
                        type: 'updateFreeText',
                        value: textarea.value
                      }, '*');
                    });
                    textarea.focus();
                  </script>
                </body>
                </html>
              `);
            }}
          >
            📖 別タブで開く
          </button>
        </div>
        <textarea
          value={formData.freeText || ''}
          onChange={(e) => handleInputChange('freeText', e.target.value)}
          className="free-text-textarea"
          rows="10"
          placeholder="練習内容を詳しく記入..."
        />
      </div>

      {/* 振り返り・発見 */}
      <div className="form-section">
        <div className="section-icon">🧠</div>
        <label className="form-label">振り返り・発見:</label>
        <textarea
          value={formData.reflection || ''}
          onChange={(e) => handleInputChange('reflection', e.target.value)}
          className="reflection-textarea"
          rows="3"
          placeholder="今日の練習で気づいたこと、改善点など"
        />
      </div>
      
      {/* コンディション */}
      <div className="form-section">
        <div className="section-icon">😐</div>
        <label className="form-label">コンディション:</label>
        <div className="condition-buttons">
          <button
            type="button"
            className={`condition-button good ${formData.condition >= 4 ? 'active' : ''}`}
            onClick={() => handleInputChange('condition', 5)}
          >
            😀
          </button>
          <button
            type="button"
            className={`condition-button normal ${formData.condition === 3 ? 'active' : ''}`}
            onClick={() => handleInputChange('condition', 3)}
          >
            😐
          </button>
          <button
            type="button"
            className={`condition-button bad ${formData.condition <= 2 ? 'active' : ''}`}
            onClick={() => handleInputChange('condition', 1)}
          >
            😞
          </button>
        </div>
      </div>

          {/* 投球練習の場合：専用フォームを表示 */}
          {formData.category === 'pitching' && (
            <>
              <div className="form-group">
                <label>最高球速（km/h）</label>
                <input
                  type="number"
                  value={formData.maxVelocity}
                  onChange={(e) => handleInputChange('maxVelocity', e.target.value)}
                  placeholder="例：140"
                  min="0"
                  max="200"
                />
              </div>
              <PitchingPracticeForm 
                onDataUpdate={handlePitchingDataUpdate}
                initialData={formData.pitchingData}
              />
              {formData.pitchingData.length > 0 && (
                <PitchingChart data={formData.pitchingData} />
              )}
            </>
          )}

          {/* 試合の場合：試合結果フォームを表示 */}
          {formData.category === 'game' && (
            <SimpleGameResultForm 
              onDataUpdate={handleGameResultUpdate}
              initialData={formData.gameResultData}
            />
          )}

          {/* 投球練習以外：通常の練習メニュー入力（試合振り返りも含む） */}
          {formData.category !== 'pitching' && (
            <div className="form-group">
              <label>練習メニュー</label>
              
              {/* カスタム練習項目コンポーネント */}
              <CustomPracticeItems
                category={formData.category}
                userId={user?.email || 'guest'}
                onItemsChange={(items) => {
                  if (items.length === 1) {
                    // クイック選択された項目を最初の空欄に追加
                    const emptyIndex = formData.menu.findIndex(item => !item.name)
                    if (emptyIndex !== -1) {
                      handleMenuChange(emptyIndex, 'name', items[0].name)
                      handleMenuChange(emptyIndex, 'unit', items[0].unit)
                    } else {
                      // 空欄がない場合は新規追加
                      setFormData(prev => ({
                        ...prev,
                        menu: [...prev.menu, { name: items[0].name, value: '', unit: items[0].unit }]
                      }))
                    }
                  }
                }}
              />
              
              {/* トレーニング種目の候補表示 */}
              {formData.category === 'training' && formData.trainingPart && (
                <div className="exercise-suggestions">
                  <small>よく使う種目：</small>
                  <div className="suggestion-chips">
                    {basicExercises[formData.trainingPart]?.map(exercise => (
                      <button
                        key={exercise}
                        type="button"
                        className="suggestion-chip"
                        onClick={() => {
                          const emptyIndex = formData.menu.findIndex(item => !item.name)
                          if (emptyIndex !== -1) {
                            handleMenuChange(emptyIndex, 'name', exercise)
                          } else {
                            setFormData(prev => ({
                              ...prev,
                              menu: [...prev.menu, { name: exercise, value: '', unit: 'セット' }]
                            }))
                          }
                        }}
                      >
                        {exercise}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              {/* 練習メニュー入力フィールド */}
              {formData.menu.map((item, index) => (
                <div key={index} className="menu-item">
                  <input
                    type="text"
                    placeholder="メニュー名"
                    value={item.name}
                    onChange={(e) => handleMenuChange(index, 'name', e.target.value)}
                  />
                  <input
                    type="number"
                    placeholder="数値"
                    value={item.value}
                    onChange={(e) => handleMenuChange(index, 'value', e.target.value)}
                  />
                  <select
                    value={item.unit}
                    onChange={(e) => handleMenuChange(index, 'unit', e.target.value)}
                  >
                    {commonUnits.map(unit => (
                      <option key={unit} value={unit}>{unit}</option>
                    ))}
                  </select>
                  {formData.menu.length > 1 && (
                    <button
                      type="button"
                      className="remove-menu-item"
                      onClick={() => removeMenuItem(index)}
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                className="add-menu-item"
                onClick={addMenuItem}
              >
                + メニューを追加
              </button>
            </div>
          )}

      {/* 動画アップロードセクション */}
      <div className="form-group">
        <label>動画をアップロード</label>
        <div className="video-upload-container">
          {!formData.videoUrl ? (
            <div className="video-upload-area">
              <input
                ref={videoInputRef}
                type="file"
                accept="video/*"
                onChange={handleVideoSelect}
                className="video-input"
                id="video-upload"
              />
              <label htmlFor="video-upload" className="video-upload-label">
                <span className="upload-icon">📹</span>
                <span>動画を選択</span>
                <span className="upload-hint">最大100MBまで</span>
              </label>
            </div>
          ) : (
            <div className="video-preview-container">
              <video
                src={formData.videoUrl}
                controls
                className="video-preview"
              />
              <button
                type="button"
                className="remove-video"
                onClick={removeVideo}
              >
                動画を削除
              </button>
            </div>
          )}
        </div>
      </div>

      
      {/* 食べたもの */}
      <div className="form-section">
        <div className="section-icon">🍱</div>
        <label className="form-label">食べたもの:</label>
        <div className="meal-inputs">
          <div className="meal-item">
            <span className="meal-label">朝:</span>
            <input
              type="text"
              value={formData.breakfast || ''}
              onChange={(e) => handleInputChange('breakfast', e.target.value)}
              className="meal-input"
              placeholder="例：トースト、卵、サラダ"
            />
          </div>
          <div className="meal-item">
            <span className="meal-label">昼:</span>
            <input
              type="text"
              value={formData.lunch || ''}
              onChange={(e) => handleInputChange('lunch', e.target.value)}
              className="meal-input"
              placeholder="例：ラーメン、チャーハン"
            />
          </div>
          <div className="meal-item">
            <span className="meal-label">夜:</span>
            <input
              type="text"
              value={formData.dinner || ''}
              onChange={(e) => handleInputChange('dinner', e.target.value)}
              className="meal-input"
              placeholder="例：カレー、サラダ、スープ"
            />
          </div>
        </div>
      </div>
      
      {/* 飲んだサプリ */}
      <div className="form-section">
        <div className="section-icon">💊</div>
        <label className="form-label">飲んだサプリ:</label>
        <input
          type="text"
          value={formData.supplements || ''}
          onChange={(e) => handleInputChange('supplements', e.target.value)}
          className="text-input"
          placeholder="例：プロテイン、ビタミンC"
        />
      </div>
      
      {/* 明日の目標 */}
      <div className="form-section">
        <div className="section-icon">📌</div>
        <label className="form-label">明日の目標:</label>
        <div className="goals-list">
          {formData.tomorrowGoals.map((goal, index) => (
            <div key={index} className="goal-input-wrapper">
              <input
                type="text"
                value={goal}
                onChange={(e) => updateTomorrowGoal(index, e.target.value)}
                className="text-input goal-input"
                placeholder={index === 0 ? "例：ピッチング練習を中心に" : "追加の目標"}
              />
              {formData.tomorrowGoals.length > 1 && (
                <button
                  type="button"
                  className="remove-goal-button"
                  onClick={() => removeTomorrowGoal(index)}
                >
                  ×
                </button>
              )}
            </div>
          ))}
          <button 
            type="button" 
            className="add-goal-button" 
            onClick={addTomorrowGoal}
          >
            +目標を追加
          </button>
        </div>
      </div>

      {/* 送信ボタン */}
      <button type="submit" className="submit-button">
        Save
      </button>
    </form>
    </div>
  )
}

export default PracticeForm