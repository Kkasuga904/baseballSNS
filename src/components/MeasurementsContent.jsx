import React, { useState, useEffect, memo, useCallback } from 'react'
import { useAuth } from '../App'
import MeasurementChart from './MeasurementChart'
import './MeasurementsContent.css'

const MeasurementsContent = memo(function MeasurementsContent() {
  const { user } = useAuth()
  
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
    if (saved) {
      try {
        return JSON.parse(saved)
      } catch (e) {
        console.error('Failed to parse saved measurement items:', e)
      }
    }
    // デフォルト項目
    return {
      athletic: {
        height: { label: '身長', unit: 'cm', icon: '📏' },
        weight: { label: '体重', unit: 'kg', icon: '⚖️' },
        bodyFat: { label: '体脂肪率', unit: '%', icon: '📊' },
        muscle: { label: '筋肉量', unit: 'kg', icon: '💪' },
        sprint50m: { label: '50m走', unit: '秒', icon: '🏃' },
        sprint30m: { label: '30m走', unit: '秒', icon: '🏃' },
        longJump: { label: '立ち幅跳び', unit: 'cm', icon: '🦵' },
        matawari: { label: '股割り', unit: 'cm', icon: '🧘' },
        mbThrow: { label: 'MBスロー', unit: 'm', icon: '⚾' },
        clean: { label: 'クリーン', unit: 'kg', icon: '🏋️', hasRM: true },
        benchPress: { label: 'ベンチプレス', unit: 'kg', icon: '💪', hasRM: true },
        squat: { label: 'スクワット', unit: 'kg', icon: '🦵', hasRM: true },
        deadlift: { label: 'デッドリフト', unit: 'kg', icon: '🏋️', hasRM: true },
        chinUp: { label: '懸垂', unit: '回', icon: '💪' },
        pushUp: { label: '腕立て伏せ', unit: '回', icon: '💪' }
      },
      baseball: {
        pitchSpeed: { label: '球速', unit: 'km/h', icon: '⚾' },
        battingSpeed: { label: '打球速度', unit: 'km/h', icon: '⚾' },
        throwingDistance: { label: '遠投', unit: 'm', icon: '🎯' },
        baseRunning: { label: '塁間走', unit: '秒', icon: '🏃' },
        homeToFirst: { label: '一塁到達', unit: '秒', icon: '🏃' }
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
  const addMeasurement = useCallback(() => {
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
  }, [measurements, newMeasurement])
  
  // 測定データ削除
  const deleteMeasurement = useCallback((category, id) => {
    if (window.confirm('この測定データを削除しますか？')) {
      setMeasurements({
        ...measurements,
        [category]: measurements[category].filter(m => m.id !== id)
      })
    }
  }, [measurements])
  
  // カテゴリータブ切り替え
  const [activeCategory, setActiveCategory] = useState('athletic')
  
  // 表示モード切り替え（入力 or 履歴 or 編集）
  const [viewMode, setViewMode] = useState('input')
  
  // 選択された測定項目（グラフ表示用）
  const [selectedItem, setSelectedItem] = useState(null)
  
  // 項目編集用の状態
  const [editMode, setEditMode] = useState(false)
  const [newItemForm, setNewItemForm] = useState({ label: '', unit: '', icon: '📊', hasRM: false })
  
  // 通知表示
  const [notification, setNotification] = useState(null)
  
  // 測定履歴を日付順にソート
  const getSortedHistory = (category) => {
    return [...measurements[category]].sort((a, b) => new Date(b.date) - new Date(a.date))
  }
  
  // 特定の測定項目の履歴を取得
  const getItemHistory = useCallback((category, itemKey) => {
    return measurements[category]
      .filter(m => m.items[itemKey])
      .map(m => ({
        date: m.date,
        value: parseFloat(m.items[itemKey])
      }))
      .sort((a, b) => new Date(a.date) - new Date(b.date))
  }, [measurements])
  
  // 測定項目の追加
  const addMeasurementItem = useCallback((category) => {
    if (!newItemForm.label || !newItemForm.unit) {
      alert('項目名と単位を入力してください')
      return
    }
    
    const key = newItemForm.label.replace(/\s/g, '_').toLowerCase() + '_' + Date.now()
    
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
    
    setNewItemForm({ label: '', unit: '', icon: '📊', hasRM: false })
    setNotification(`「${newItemForm.label}」を追加しました`)
    setTimeout(() => setNotification(null), 3000)
  }, [measurementItems, newItemForm])
  
  // 測定項目の削除
  const deleteMeasurementItem = useCallback((category, key) => {
    if (window.confirm(`「${measurementItems[category][key].label}」を削除しますか？`)) {
      const newItems = { ...measurementItems }
      delete newItems[category][key]
      setMeasurementItems(newItems)
      setNotification(`項目を削除しました`)
      setTimeout(() => setNotification(null), 3000)
    }
  }, [measurementItems])
  
  return (
    <>
      {/* 通知 */}
      {notification && (
        <div className="notification">
          {notification}
        </div>
      )}
      
      <div className="measurements-content">
        <h3>📊 身体測定・記録管理</h3>
        <p className="page-description">
          身体能力や野球技術の測定結果を記録・管理できます。
          定期的に測定することで、成長の推移をグラフで確認できます。
        </p>
        
        {/* 表示モード切り替え */}
        <div className="view-mode-tabs">
          <button
            type="button"
            className={`view-mode-tab ${viewMode === 'input' && !editMode ? 'active' : ''}`}
            onClick={() => {
              setViewMode('input')
              setEditMode(false)
            }}
          >
            📝 データ入力
          </button>
          <button
            type="button"
            className={`view-mode-tab ${viewMode === 'history' && !editMode ? 'active' : ''}`}
            onClick={() => {
              setViewMode('history')
              setEditMode(false)
            }}
          >
            📊 測定履歴
          </button>
          <button
            type="button"
            className={`view-mode-tab ${editMode ? 'active' : ''}`}
            onClick={() => setEditMode(!editMode)}
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
          <div className="item-edit-mode">
            <h4>測定項目の編集</h4>
            
            {/* 新規項目追加フォーム */}
            <div className="add-item-form">
              <h5>新規項目を追加</h5>
              <div className="item-form-row">
                <input
                  type="text"
                  placeholder="項目名"
                  value={newItemForm.label}
                  onChange={(e) => setNewItemForm({ ...newItemForm, label: e.target.value })}
                  className="item-input"
                />
                <input
                  type="text"
                  placeholder="単位（kg、秒など）"
                  value={newItemForm.unit}
                  onChange={(e) => setNewItemForm({ ...newItemForm, unit: e.target.value })}
                  className="item-input"
                />
                <input
                  type="text"
                  placeholder="アイコン"
                  value={newItemForm.icon}
                  onChange={(e) => setNewItemForm({ ...newItemForm, icon: e.target.value })}
                  className="item-input-icon"
                />
                <label className="rm-checkbox">
                  <input
                    type="checkbox"
                    checked={newItemForm.hasRM || false}
                    onChange={(e) => setNewItemForm({ ...newItemForm, hasRM: e.target.checked })}
                  />
                  RM対応
                </label>
                <button
                  type="button"
                  onClick={() => addMeasurementItem(activeCategory)}
                  className="add-item-button"
                >
                  追加
                </button>
              </div>
            </div>
            
            {/* 既存項目の一覧 */}
            <div className="existing-items">
              <h5>既存の項目</h5>
              <div className="items-list">
                {Object.entries(measurementItems[activeCategory]).map(([key, item]) => (
                  <div key={key} className="item-row">
                    <span className="item-icon">{item.icon}</span>
                    <span className="item-label">{item.label}</span>
                    <span className="item-unit">({item.unit})</span>
                    {item.hasRM && <span className="rm-badge">RM</span>}
                    <button
                      type="button"
                      onClick={() => deleteMeasurementItem(activeCategory, key)}
                      className="delete-item-button"
                    >
                      削除
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        
        {/* データ入力モード */}
        {viewMode === 'input' && !editMode && (
          <div className="new-measurement-form">
            <h4>新規測定データ入力</h4>
            
            <div className="form-row">
              <label onClick={(e) => e.stopPropagation()}>
                測定日:
                <input
                  type="date"
                  value={newMeasurement.date}
                  onClick={(e) => e.stopPropagation()}
                  onFocus={(e) => e.stopPropagation()}
                  onChange={(e) => {
                    e.stopPropagation()
                    setNewMeasurement({
                      ...newMeasurement,
                      date: e.target.value
                    })
                  }}
                  className="date-input"
                  max={new Date().toISOString().split('T')[0]}
                />
              </label>
            </div>
            
            <div className="measurement-inputs-mobile">
              {Object.entries(measurementItems[activeCategory]).map(([key, item]) => (
                <div key={key} className="measurement-input-card">
                  <div className="card-header">
                    <span className="card-icon">{item.icon}</span>
                    <span className="card-label">{item.label}</span>
                  </div>
                  <div className="card-input-wrapper">
                    {item.hasRM ? (
                      <div className="rm-input-group">
                        <input
                          type="number"
                          inputMode="decimal"
                          step="0.1"
                          value={newMeasurement.items[key] || ''}
                          onChange={(e) => {
                            setNewMeasurement({
                              ...newMeasurement,
                              category: activeCategory,
                              items: {
                                ...newMeasurement.items,
                                [key]: e.target.value
                              }
                            })
                          }}
                          placeholder="0"
                          className="card-input"
                        />
                        <span className="input-unit">{item.unit}</span>
                        <span className="rm-x">×</span>
                        <input
                          type="number"
                          inputMode="numeric"
                          step="1"
                          value={newMeasurement.rms[key] || ''}
                          onChange={(e) => {
                            setNewMeasurement({
                              ...newMeasurement,
                              rms: {
                                ...newMeasurement.rms,
                                [key]: e.target.value
                              }
                            })
                          }}
                          placeholder="0"
                          className="card-input rm-count"
                        />
                        <span className="input-unit">回</span>
                      </div>
                    ) : (
                      <div className="single-input-group">
                        <input
                          type="number"
                          inputMode="decimal"
                          step="0.1"
                          value={newMeasurement.items[key] || ''}
                          onChange={(e) => {
                            setNewMeasurement({
                              ...newMeasurement,
                              category: activeCategory,
                              items: {
                                ...newMeasurement.items,
                                [key]: e.target.value
                              }
                            })
                          }}
                          placeholder="0"
                          className="card-input"
                        />
                        <span className="input-unit">{item.unit}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            <button type="button" onClick={addMeasurement} className="add-button">
              測定データを追加
            </button>
          </div>
        )}
        
        {/* 測定履歴モード */}
        {viewMode === 'history' && !editMode && (
          <div className="measurement-history">
            <h4>測定履歴</h4>
            
            {/* 測定項目ごとの最新値表示 */}
            <div className="latest-values">
              <h5>最新測定値</h5>
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
                      {history.length > 0 && (
                        <button
                          type="button"
                          className="history-button"
                          onClick={() => setSelectedItem(key)}
                        >
                          履歴を見る
                        </button>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
            
            {/* 全履歴リスト */}
            <div className="all-history">
              <h5>全測定記録</h5>
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
      
      {/* 個別項目の履歴モーダル */}
      {selectedItem && (
        <div className="history-modal-overlay" onClick={() => setSelectedItem(null)}>
          <div className="history-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>
                {measurementItems[activeCategory][selectedItem].icon} 
                {measurementItems[activeCategory][selectedItem].label}の履歴
              </h3>
              <button type="button" onClick={() => setSelectedItem(null)} className="close-button">×</button>
            </div>
            <div className="modal-content">
              {getItemHistory(activeCategory, selectedItem).length === 0 ? (
                <p className="no-data">データがありません</p>
              ) : (
                <>
                  {/* グラフ表示 */}
                  <MeasurementChart
                    data={getItemHistory(activeCategory, selectedItem)}
                    unit={measurementItems[activeCategory][selectedItem].unit}
                    label={measurementItems[activeCategory][selectedItem].label}
                    icon={measurementItems[activeCategory][selectedItem].icon}
                  />
                  
                  {/* 履歴リスト */}
                  <div className="item-history-list">
                    <h4>測定履歴</h4>
                    {getItemHistory(activeCategory, selectedItem).reverse().map((record, index) => (
                      <div key={index} className="item-history-entry">
                        <span className="entry-date">{record.date}</span>
                        <span className="entry-value">
                          {record.value} {measurementItems[activeCategory][selectedItem].unit}
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
})

export default MeasurementsContent