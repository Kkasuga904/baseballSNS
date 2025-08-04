import React, { useState, useEffect } from 'react'
import { useAuth } from '../App'
import { useLocation } from 'react-router-dom'
import './Measurements.css'

function Measurements() {
  const { user } = useAuth()
  const location = useLocation()
  
  // 全体的なクリックイベントを防ぐ
  useEffect(() => {
    // 測定ページでない場合は何もしない
    if (location.pathname !== '/measurements') return
    
    const handleClick = (e) => {
      // カレンダー関連の要素のみブロック
      if (e.target.closest('.practice-calendar') || 
          e.target.closest('.calendar') ||
          e.target.closest('.react-calendar') ||
          e.target.closest('[class*="calendar"]')) {
        // 測定ページ内であればカレンダーをブロック
        const measurementPage = e.target.closest('.measurements-page')
        if (measurementPage) {
          e.preventDefault()
          e.stopPropagation()
          e.stopImmediatePropagation()
          return false
        }
      }
    }
    
    // キャプチャフェーズで処理
    document.addEventListener('click', handleClick, true)
    window.addEventListener('click', handleClick, true)
    
    return () => {
      document.removeEventListener('click', handleClick, true)
      window.removeEventListener('click', handleClick, true)
    }
  }, [location.pathname])
  
  // 測定データの状態管理
  const [measurements, setMeasurements] = useState(() => {
    const userKey = (user && user.email) || 'guest'
    const saved = localStorage.getItem(`baseballSNSMeasurements_${userKey}`)
    return saved ? JSON.parse(saved) : {
      athletic: [],  // 運動能力測定
      baseball: []   // 野球技術測定
    }
  })
  
  // 新規測定データ入力用
  const [newMeasurement, setNewMeasurement] = useState({
    date: new Date().toISOString().split('T')[0],
    category: 'athletic',
    items: {},
    rms: {} // RM値を格納
  })
  
  // 測定項目の定義（カスタマイズ可能）
  const [measurementItems, setMeasurementItems] = useState(() => {
    const userKey = (user && user.email) || 'guest'
    const saved = localStorage.getItem(`baseballSNSMeasurementItems_${userKey}`)
    
    // 保存データがある場合、RM設定を確認して更新
    if (saved) {
      try {
        const parsedItems = JSON.parse(saved)
        // RM設定がない古いデータの場合、デフォルト値を追加
        if (parsedItems.athletic) {
          if (parsedItems.athletic.deadlift && !('hasRM' in parsedItems.athletic.deadlift)) {
            parsedItems.athletic.deadlift.hasRM = true
          }
          if (parsedItems.athletic.benchPress && !('hasRM' in parsedItems.athletic.benchPress)) {
            parsedItems.athletic.benchPress.hasRM = true
          }
          if (parsedItems.athletic.squat && !('hasRM' in parsedItems.athletic.squat)) {
            parsedItems.athletic.squat.hasRM = true
          }
          if (parsedItems.athletic.clean && !('hasRM' in parsedItems.athletic.clean)) {
            parsedItems.athletic.clean.hasRM = true
          }
        }
        return parsedItems
      } catch (e) {
        console.error('Failed to parse saved measurement items:', e)
      }
    }
    
    // デフォルト値を返す
    return {
      athletic: {
        sprint10m: { label: '10m走', unit: '秒', icon: '🏃', hasRM: false },
        pulldownSpeed: { label: 'プルダウン球速', unit: 'km/h', icon: '⚡', hasRM: false },
        deadlift: { label: 'デッドリフト', unit: 'kg', icon: '🏋️', hasRM: true },
        benchPress: { label: 'ベンチプレス', unit: 'kg', icon: '💪', hasRM: true },
        tripleJump: { label: '3段跳び', unit: 'cm', icon: '🦘', hasRM: false },
        longJump: { label: '立ち幅跳び', unit: 'cm', icon: '🦵', hasRM: false },
        squat: { label: 'スクワット', unit: 'kg', icon: '🦵', hasRM: true },
        hipSplit: { label: '股割り', unit: 'cm', icon: '🧘', hasRM: false },
        mbThrow: { label: 'MBスロー', unit: 'm', icon: '🏐', hasRM: false },
        clean: { label: 'クリーン', unit: 'kg', icon: '🏋️', hasRM: true },
        pitchSpeed: { label: '球速', unit: 'km/h', icon: '⚾', hasRM: false }
      },
      baseball: {
        battingSpeed: { label: '打球速度', unit: 'km/h', icon: '⚾' },
        pitchSpeed: { label: '球速', unit: 'km/h', icon: '⚾' },
        baseRunning: { label: '塁間走', unit: '秒', icon: '🏃' },
        homeRunDistance: { label: '飛距離', unit: 'm', icon: '🚀' }
      }
    }
  })
  
  // データ保存
  useEffect(() => {
    const userKey = (user && user.email) || 'guest'
    localStorage.setItem(`baseballSNSMeasurements_${userKey}`, JSON.stringify(measurements))
  }, [measurements, user])
  
  // 測定項目の保存
  useEffect(() => {
    const userKey = (user && user.email) || 'guest'
    localStorage.setItem(`baseballSNSMeasurementItems_${userKey}`, JSON.stringify(measurementItems))
  }, [measurementItems, user])
  
  // 測定データ追加
  const addMeasurement = () => {
    const hasData = Object.keys(newMeasurement.items).some(key => newMeasurement.items[key])
    if (!hasData) {
      alert('測定データを入力してください')
      return
    }
    
    const updatedMeasurements = {
      ...measurements,
      [newMeasurement.category]: [
        ...measurements[newMeasurement.category],
        {
          id: Date.now(),
          date: newMeasurement.date,
          items: { ...newMeasurement.items },
          rms: { ...newMeasurement.rms }
        }
      ].sort((a, b) => new Date(b.date) - new Date(a.date))
    }
    
    setMeasurements(updatedMeasurements)
    
    // フォームリセット
    setNewMeasurement({
      date: new Date().toISOString().split('T')[0],
      category: newMeasurement.category,
      items: {},
      rms: {}
    })
    
    // 通知を表示
    setNotification('測定データを追加しました！')
    setTimeout(() => setNotification(null), 3000)
  }
  
  // 測定データ削除
  const deleteMeasurement = (category, id) => {
    if (window.confirm('この測定データを削除しますか？')) {
      setMeasurements({
        ...measurements,
        [category]: measurements[category].filter(m => m.id !== id)
      })
    }
  }
  
  // カテゴリータブ切り替え
  const [activeCategory, setActiveCategory] = useState('athletic')
  
  // 測定項目をリセット
  const resetMeasurementItems = () => {
    if (window.confirm('測定項目を初期設定に戻しますか？カスタマイズした項目は失われます。')) {
      const defaultItems = {
        athletic: {
          sprint10m: { label: '10m走', unit: '秒', icon: '🏃', hasRM: false },
          pulldownSpeed: { label: 'プルダウン球速', unit: 'km/h', icon: '⚡', hasRM: false },
          deadlift: { label: 'デッドリフト', unit: 'kg', icon: '🏋️', hasRM: true },
          benchPress: { label: 'ベンチプレス', unit: 'kg', icon: '💪', hasRM: true },
          tripleJump: { label: '3段跳び', unit: 'cm', icon: '🦘', hasRM: false },
          longJump: { label: '立ち幅跳び', unit: 'cm', icon: '🦵', hasRM: false },
          squat: { label: 'スクワット', unit: 'kg', icon: '🦵', hasRM: true },
          hipSplit: { label: '股割り', unit: 'cm', icon: '🧘', hasRM: false },
          mbThrow: { label: 'MBスロー', unit: 'm', icon: '🏐', hasRM: false },
          clean: { label: 'クリーン', unit: 'kg', icon: '🏋️', hasRM: true },
          pitchSpeed: { label: '球速', unit: 'km/h', icon: '⚾', hasRM: false }
        },
        baseball: {
          battingSpeed: { label: '打球速度', unit: 'km/h', icon: '⚾', hasRM: false },
          pitchSpeed: { label: '球速', unit: 'km/h', icon: '⚾', hasRM: false },
          baseRunning: { label: '塁間走', unit: '秒', icon: '🏃', hasRM: false },
          homeRunDistance: { label: '飛距離', unit: 'm', icon: '🚀', hasRM: false }
        }
      }
      setMeasurementItems(defaultItems)
      const userKey = (user && user.email) || 'guest'
      localStorage.setItem(`baseballSNSMeasurementItems_${userKey}`, JSON.stringify(defaultItems))
    }
  }
  
  // 表示モード切り替え（入力 or 履歴）
  const [viewMode, setViewMode] = useState('input') // 'input' or 'history'
  
  // 選択された測定項目（グラフ表示用）
  const [selectedItem, setSelectedItem] = useState(null)
  
  // 編集モード
  const [editMode, setEditMode] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [newItemForm, setNewItemForm] = useState({ key: '', label: '', unit: '', icon: '📊', hasRM: false })
  
  // 通知表示
  const [notification, setNotification] = useState(null)
  
  // 測定履歴を日付順にソート
  const getSortedHistory = (category) => {
    return [...measurements[category]].sort((a, b) => new Date(b.date) - new Date(a.date))
  }
  
  // 測定項目の追加
  const addMeasurementItem = (category) => {
    if (!newItemForm.key || !newItemForm.label || !newItemForm.unit) {
      alert('項目名、ラベル、単位を入力してください')
      return
    }
    
    const key = newItemForm.key.replace(/\s/g, '_').toLowerCase()
    if (measurementItems[category][key]) {
      alert('この項目は既に存在します')
      return
    }
    
    setMeasurementItems({
      ...measurementItems,
      [category]: {
        ...measurementItems[category],
        [key]: {
          label: newItemForm.label,
          unit: newItemForm.unit,
          icon: newItemForm.icon || '📊',
          hasRM: newItemForm.hasRM || false
        }
      }
    })
    
    setNewItemForm({ key: '', label: '', unit: '', icon: '📊', hasRM: false })
  }
  
  // 測定項目の削除
  const deleteMeasurementItem = (category, key) => {
    if (window.confirm(`「${measurementItems[category][key].label}」を削除しますか？`)) {
      const newItems = { ...measurementItems }
      delete newItems[category][key]
      setMeasurementItems(newItems)
    }
  }
  
  // 測定項目の編集
  const updateMeasurementItem = (category, key, updates) => {
    setMeasurementItems({
      ...measurementItems,
      [category]: {
        ...measurementItems[category],
        [key]: {
          ...measurementItems[category][key],
          ...updates
        }
      }
    })
    setEditingItem(null)
  }
  
  // 特定の測定項目の履歴を取得
  const getItemHistory = (category, itemKey) => {
    return measurements[category]
      .filter(m => m.items[itemKey])
      .map(m => ({
        date: m.date,
        value: parseFloat(m.items[itemKey])
      }))
      .sort((a, b) => new Date(a.date) - new Date(b.date))
  }
  
  return (
    <>
      {/* 通知 */}
      {notification && (
        <div className="notification">
          {notification}
        </div>
      )}
      
      <div className="measurements-page" onClick={(e) => e.stopPropagation()}>
        <div className="measurements-container">
          <h1>測定結果</h1>
        
        {/* 表示モード切り替え */}
        <div className="view-mode-tabs" onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            className={`view-mode-tab ${viewMode === 'input' ? 'active' : ''}`}
            onClick={(e) => {
              e.stopPropagation()
              setViewMode('input')
              setEditMode(false)
            }}
          >
            📝 データ入力
          </button>
          <button
            type="button"
            className={`view-mode-tab ${viewMode === 'history' ? 'active' : ''}`}
            onClick={(e) => {
              e.stopPropagation()
              setViewMode('history')
              setEditMode(false)
            }}
          >
            📊 測定履歴
          </button>
          <button
            type="button"
            className={`view-mode-tab ${editMode ? 'active' : ''}`}
            onClick={(e) => {
              e.stopPropagation()
              setEditMode(!editMode)
              setViewMode(null)
            }}
          >
            ⚙️ 項目編集
          </button>
        </div>
        
        {/* カテゴリータブ */}
        <div className="category-tabs">
          <button
            type="button"
            className={`category-tab ${activeCategory === 'athletic' ? 'active' : ''}`}
            onClick={() => {
              setActiveCategory('athletic')
              setNewMeasurement({
                ...newMeasurement,
                category: 'athletic',
                items: {}
              })
            }}
          >
            🏃 運動能力
          </button>
          <button
            type="button"
            className={`category-tab ${activeCategory === 'baseball' ? 'active' : ''}`}
            onClick={() => {
              setActiveCategory('baseball')
              setNewMeasurement({
                ...newMeasurement,
                category: 'baseball',
                items: {}
              })
            }}
          >
            ⚾ 野球技術
          </button>
        </div>
        
        {/* 項目編集モード */}
        {editMode && (
          <div className="measurement-edit-mode">
            <div className="edit-mode-header">
              <h2>測定項目の編集</h2>
              <button
                type="button"
                onClick={resetMeasurementItems}
                className="reset-button"
              >
                初期設定に戻す
              </button>
            </div>
            
            {/* 新規項目追加フォーム */}
            <div className="add-item-form">
              <h3>新規項目追加</h3>
              <div className="form-row">
                <input
                  type="text"
                  placeholder="項目名（英語）"
                  value={newItemForm.key}
                  onChange={(e) => setNewItemForm({ ...newItemForm, key: e.target.value })}
                  className="item-input"
                />
                <input
                  type="text"
                  placeholder="表示名"
                  value={newItemForm.label}
                  onChange={(e) => setNewItemForm({ ...newItemForm, label: e.target.value })}
                  className="item-input"
                />
                <input
                  type="text"
                  placeholder="単位"
                  value={newItemForm.unit}
                  onChange={(e) => setNewItemForm({ ...newItemForm, unit: e.target.value })}
                  className="item-input"
                />
                <input
                  type="text"
                  placeholder="アイコン"
                  value={newItemForm.icon}
                  onChange={(e) => setNewItemForm({ ...newItemForm, icon: e.target.value })}
                  className="item-input icon-input"
                />
                <label className="rm-checkbox">
                  <input
                    type="checkbox"
                    checked={newItemForm.hasRM || false}
                    onChange={(e) => setNewItemForm({ ...newItemForm, hasRM: e.target.checked })}
                  />
                  RM記録
                </label>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    addMeasurementItem(activeCategory)
                  }}
                  className="add-item-button"
                >
                  追加
                </button>
              </div>
            </div>
            
            {/* 既存項目の編集 */}
            <div className="existing-items">
              <h3>既存項目</h3>
              <div className="items-list">
                {Object.entries(measurementItems[activeCategory]).map(([key, item]) => (
                  <div key={key} className="edit-item">
                    {editingItem === key ? (
                      <div className="edit-form">
                        <input
                          type="text"
                          value={item.label}
                          onChange={(e) => updateMeasurementItem(activeCategory, key, { label: e.target.value })}
                          className="item-input"
                        />
                        <input
                          type="text"
                          value={item.unit}
                          onChange={(e) => updateMeasurementItem(activeCategory, key, { unit: e.target.value })}
                          className="item-input"
                        />
                        <input
                          type="text"
                          value={item.icon}
                          onChange={(e) => updateMeasurementItem(activeCategory, key, { icon: e.target.value })}
                          className="item-input icon-input"
                        />
                        <label className="rm-checkbox">
                          <input
                            type="checkbox"
                            checked={item.hasRM || false}
                            onChange={(e) => updateMeasurementItem(activeCategory, key, { hasRM: e.target.checked })}
                          />
                          RM
                        </label>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            setEditingItem(null)
                          }}
                          className="save-button"
                        >
                          保存
                        </button>
                      </div>
                    ) : (
                      <div className="item-display">
                        <span className="item-icon">{item.icon}</span>
                        <span className="item-label">{item.label}</span>
                        <span className="item-unit">({item.unit})</span>
                        {item.hasRM && <span className="rm-badge">RM対応</span>}
                        <div className="item-actions">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault()
                              e.stopPropagation()
                              setEditingItem(key)
                            }}
                            className="edit-button"
                          >
                            編集
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault()
                              e.stopPropagation()
                              deleteMeasurementItem(activeCategory, key)
                            }}
                            className="delete-item-button"
                          >
                            削除
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        
        {/* データ入力モード */}
        {viewMode === 'input' && !editMode && (
          <div className="new-measurement-form" onClick={(e) => e.stopPropagation()}>
          <h2>新規測定データ入力</h2>
          
          <div className="form-row">
            <label>
              測定日:
              <input
                type="date"
                value={newMeasurement.date}
                onClick={(e) => e.stopPropagation()}
                onChange={(e) => {
                  e.stopPropagation()
                  setNewMeasurement({
                    ...newMeasurement,
                    date: e.target.value
                  })
                }}
                className="date-input"
              />
            </label>
          </div>
          
          <div className="measurement-inputs" onClick={(e) => e.stopPropagation()}>
            {Object.entries(measurementItems[activeCategory]).map(([key, item]) => {
              console.log(`${key}: hasRM = ${item.hasRM}`) // デバッグ用
              return (
              <div key={key} className="measurement-input-item" onClick={(e) => e.stopPropagation()}>
                <label onClick={(e) => e.stopPropagation()}>
                  <div className="label-row">
                    <span className="item-icon">{item.icon}</span>
                    <span>{item.label}</span>
                  </div>
                  <div className="input-row">
                    <input
                      type="number"
                      step="0.1"
                      value={newMeasurement.items[key] || ''}
                      onClick={(e) => e.stopPropagation()}
                      onFocus={(e) => e.stopPropagation()}
                      onChange={(e) => {
                        e.stopPropagation()
                        setNewMeasurement({
                          ...newMeasurement,
                          category: activeCategory,
                          items: {
                            ...newMeasurement.items,
                            [key]: e.target.value
                          }
                        })
                      }}
                      placeholder={`${item.unit}`}
                      className="measurement-input"
                    />
                    <span className="unit">{item.unit}</span>
                    {item.hasRM && (
                      <>
                        <span className="rm-separator">×</span>
                        <input
                          type="number"
                          step="1"
                          value={newMeasurement.rms[key] || ''}
                          onClick={(e) => e.stopPropagation()}
                          onFocus={(e) => e.stopPropagation()}
                          onChange={(e) => {
                            e.stopPropagation()
                            setNewMeasurement({
                              ...newMeasurement,
                              rms: {
                                ...newMeasurement.rms,
                                [key]: e.target.value
                              }
                            })
                          }}
                          placeholder="回数"
                          className="rm-input"
                        />
                        <span className="unit">RM</span>
                      </>
                    )}
                  </div>
                </label>
              </div>
            )})}
          </div>
          
          <button type="button" onClick={addMeasurement} className="add-button">
            測定データを追加
          </button>
          </div>
        )}
        
        {/* 測定履歴モード */}
        {viewMode === 'history' && !editMode && (
          <div className="measurement-history" onClick={(e) => e.stopPropagation()}>
          <h2>測定履歴</h2>
          
          {/* 測定項目ごとの最新値表示 */}
          <div className="latest-values">
            <h3>最新測定値</h3>
            <div className="latest-values-grid">
              {Object.entries(measurementItems[activeCategory]).map(([key, item]) => {
                const history = getItemHistory(activeCategory, key)
                const latestValue = history.length > 0 ? history[history.length - 1] : null
                
                return (
                  <div key={key} className="latest-value-card">
                    <div className="value-header">
                      <span className="value-icon">{item.icon}</span>
                      <span className="value-label">{item.label}</span>
                    </div>
                    <div className="value-content">
                      {latestValue ? (
                        <>
                          <div className="value-number">
                            {latestValue.value} {item.unit}
                          </div>
                          <div className="value-date">{latestValue.date}</div>
                        </>
                      ) : (
                        <div className="no-value">データなし</div>
                      )}
                    </div>
                    <button
                      type="button"
                      className="history-button"
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        console.log('History button clicked for:', key)
                        setSelectedItem(key)
                      }}
                    >
                      履歴を見る
                    </button>
                  </div>
                )
              })}
            </div>
          </div>
          
          {/* 全履歴リスト */}
          <div className="all-history">
            <h3>全測定記録</h3>
            {getSortedHistory(activeCategory).length === 0 ? (
              <p className="no-data">まだ測定データがありません</p>
            ) : (
              <div className="history-list">
                {getSortedHistory(activeCategory).map((measurement) => (
                <div key={measurement.id} className="history-item">
                  <div className="history-header">
                    <span className="history-date">{measurement.date}</span>
                    <button
                      onClick={() => deleteMeasurement(activeCategory, measurement.id)}
                      className="delete-button"
                    >
                      削除
                    </button>
                  </div>
                  <div className="history-data">
                    {Object.entries(measurement.items).map(([key, value]) => {
                      if (!value) return null
                      const item = measurementItems[activeCategory][key]
                      const rmValue = measurement.rms && measurement.rms[key]
                      return (
                        <div key={key} className="data-item">
                          <span className="data-icon">{item.icon}</span>
                          <span className="data-label">{item.label}:</span>
                          <span className="data-value">
                            {value} {item.unit}
                            {rmValue && ` (${rmValue}RM)`}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              ))}
              </div>
            )}
            </div>
          </div>
        )}
        
        </div>
      </div>
      
      {/* 個別項目の履歴モーダル（ページの外に配置） */}
      {selectedItem && (
        <div className="history-modal-overlay" onClick={() => setSelectedItem(null)}>
          <div className="history-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>
              {measurementItems[activeCategory] && measurementItems[activeCategory][selectedItem] ? (
                <>
                  {measurementItems[activeCategory][selectedItem].icon} 
                  {measurementItems[activeCategory][selectedItem].label}の履歴
                </>
              ) : (
                '履歴'
              )}
            </h3>
            <button type="button" onClick={() => setSelectedItem(null)} className="close-button">×</button>
          </div>
          <div className="modal-content">
            {getItemHistory(activeCategory, selectedItem).length === 0 ? (
              <p className="no-data">データがありません</p>
            ) : (
              <>
                {/* グラフ表示 */}
                <div className="graph-container">
                  <h4>推移グラフ</h4>
                  <div className="simple-graph">
                    {(() => {
                      const history = getItemHistory(activeCategory, selectedItem)
                      const maxValue = Math.max(...history.map(h => parseFloat(h.value)))
                      const minValue = Math.min(...history.map(h => parseFloat(h.value)))
                      const range = maxValue - minValue || 1
                      
                      return (
                        <div className="graph-area">
                          <div className="y-axis">
                            <span>{maxValue}</span>
                            <span>{((maxValue + minValue) / 2).toFixed(1)}</span>
                            <span>{minValue}</span>
                          </div>
                          <div className="graph-points">
                            {history.map((record, index) => {
                              const percentage = ((parseFloat(record.value) - minValue) / range) * 100
                              const isImproved = index > 0 && parseFloat(record.value) > parseFloat(history[index - 1].value)
                              
                              return (
                                <div key={index} className="graph-point-container" style={{ left: `${(index / (history.length - 1)) * 100}%` }}>
                                  <div 
                                    className={`graph-point ${isImproved ? 'improved' : ''}`}
                                    style={{ bottom: `${percentage}%` }}
                                    title={`${record.date}: ${record.value}`}
                                  >
                                    <span className="point-value">{record.value}</span>
                                  </div>
                                  {index < history.length - 1 && (
                                    <svg className="graph-line" style={{ bottom: `${percentage}%` }}>
                                      <line
                                        x1="50%"
                                        y1="50%"
                                        x2={`${((index + 1) / (history.length - 1) - index / (history.length - 1)) * 100 * (history.length - 1)}%`}
                                        y2={`${50 - (((parseFloat(history[index + 1].value) - minValue) / range * 100) - percentage)}%`}
                                        stroke={isImproved ? '#4caf50' : '#ff9800'}
                                        strokeWidth="2"
                                      />
                                    </svg>
                                  )}
                                  <span className="graph-date">{record.date.split('-').slice(1).join('/')}</span>
                                </div>
                              )
                            })}
                          </div>
                        </div>
                      )
                    })()}
                  </div>
                </div>
                
                {/* 履歴リスト */}
                <div className="item-history-list">
                  <h4>測定履歴</h4>
                  {getItemHistory(activeCategory, selectedItem).reverse().map((record, index) => (
                    <div key={index} className="item-history-entry">
                      <span className="entry-date">{record.date}</span>
                      <span className="entry-value">
                        {record.value} {measurementItems[activeCategory] && measurementItems[activeCategory][selectedItem] ? measurementItems[activeCategory][selectedItem].unit : ''}
                      </span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    )}
    </>
  )
}

export default Measurements