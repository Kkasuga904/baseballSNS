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

import React, { useState, useRef } from 'react'
import StarRating from './StarRating'
import PitchingPracticeForm from './PitchingPracticeForm'
import PitchingChart from './PitchingChart'
import SimpleGameResultForm from './SimpleGameResultForm'
import './PracticeForm.css'

/**
 * 練習記録フォームコンポーネント
 * 
 * @param {Object} props
 * @param {Function} props.onSubmit - フォーム送信時のコールバック関数
 */
function PracticeForm({ onSubmit }) {
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
    date: new Date().toISOString().split('T')[0], // 今日の日付をデフォルトに
    startTime: '',
    endTime: '',
    category: 'batting',
    trainingPart: '',
    condition: 3,
    intensity: 3,
    menu: [{ name: '', value: '', unit: '回' }],
    pitchingData: [],
    maxVelocity: '',
    gameResultData: null,
    note: '',
    videoFile: null,
    videoUrl: null
  })
  
  // 動画入力フィールドへの参照（リセット用）
  const videoInputRef = useRef(null)

  /**
   * 練習カテゴリーの定義
   * 各カテゴリーにラベルとアイコンを設定
   */
  const practiceCategories = {
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
    
    if (filteredMenu.length === 0 && formData.category !== 'pitching' && formData.category !== 'game') {
      alert('練習メニューを少なくとも1つ入力してください')
      return
    }
    
    // 送信データの準備
    onSubmit({
      ...formData,
      menu: filteredMenu
    })
  }

  // JSXレンダリング部分
  return (
    <form className="practice-form" onSubmit={handleSubmit}>
      {/* 日付と時間の入力セクション */}
      <div className="form-row">
        <div className="form-group">
          <label>日付</label>
          <input
            type="date"
            value={formData.date}
            onChange={(e) => handleInputChange('date', e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>開始時刻</label>
          <input
            type="time"
            value={formData.startTime}
            onChange={(e) => handleInputChange('startTime', e.target.value)}
            required={formData.category !== 'rest'}
          />
        </div>
        <div className="form-group">
          <label>終了時刻</label>
          <input
            type="time"
            value={formData.endTime}
            onChange={(e) => handleInputChange('endTime', e.target.value)}
            required={formData.category !== 'rest'}
          />
        </div>
      </div>

      {/* 練習カテゴリー選択セクション */}
      <div className="form-group">
        <label>練習カテゴリー</label>
        <div className="category-grid">
          {Object.entries(practiceCategories).map(([key, category]) => (
            <button
              key={key}
              type="button"
              className={`category-button ${formData.category === key ? 'active' : ''}`}
              onClick={() => handleCategoryChange(key)}
            >
              <span className="category-icon">{category.icon}</span>
              <span className="category-label">{category.label}</span>
            </button>
          ))}
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

      {/* 休養日以外の場合：コンディションと強度の評価 */}
      {formData.category !== 'rest' && (
        <>
          <div className="form-row">
            <div className="form-group">
              <label>コンディション</label>
              <StarRating
                value={formData.condition}
                onChange={(value) => handleInputChange('condition', value)}
              />
            </div>
            <div className="form-group">
              <label>練習強度</label>
              <StarRating
                value={formData.intensity}
                onChange={(value) => handleInputChange('intensity', value)}
              />
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

          {/* 投球練習と試合以外：通常の練習メニュー入力 */}
          {formData.category !== 'pitching' && formData.category !== 'game' && (
            <div className="form-group">
              <label>練習メニュー</label>
              
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
        </>
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

      {/* メモ・備考入力セクション */}
      <div className="form-group">
        <label>メモ・備考</label>
        <textarea
          value={formData.note}
          onChange={(e) => handleInputChange('note', e.target.value)}
          rows="3"
          placeholder="練習の感想や気づいたことなど"
        />
      </div>

      {/* 送信ボタン */}
      <button type="submit" className="submit-button">
        練習を記録
      </button>
    </form>
  )
}

export default PracticeForm