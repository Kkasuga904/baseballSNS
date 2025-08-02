import React, { useState, useEffect } from 'react'
import './CustomPracticeItems.css'

function CustomPracticeItems({ category, onItemsChange, userId }) {
  const [customItems, setCustomItems] = useState([])
  const [isEditing, setIsEditing] = useState(false)
  const [newItemName, setNewItemName] = useState('')
  const [newItemUnit, setNewItemUnit] = useState('回')
  
  // カスタム項目のキー
  const storageKey = `customPracticeItems_${userId}_${category}`
  
  // デフォルトの練習項目
  const defaultItems = {
    batting: [
      { name: '素振り', unit: '回' },
      { name: 'ティーバッティング', unit: '球' },
      { name: 'フリーバッティング', unit: '球' },
      { name: 'バント練習', unit: '本' }
    ],
    pitching: [
      { name: 'キャッチボール', unit: '球' },
      { name: 'ブルペン', unit: '球' },
      { name: 'シャドーピッチング', unit: '回' }
    ],
    fielding: [
      { name: 'ノック', unit: '本' },
      { name: 'ゴロ捕球', unit: '本' },
      { name: 'フライ捕球', unit: '本' },
      { name: '送球練習', unit: '本' }
    ],
    running: [
      { name: 'ベースランニング', unit: '本' },
      { name: 'スタートダッシュ', unit: '本' },
      { name: 'スライディング', unit: '回' }
    ],
    training: [
      { name: 'ベンチプレス', unit: 'セット' },
      { name: 'スクワット', unit: 'セット' },
      { name: 'デッドリフト', unit: 'セット' }
    ],
    stretch: [
      { name: '動的ストレッチ', unit: '分' },
      { name: '静的ストレッチ', unit: '分' },
      { name: 'フォームローラー', unit: '分' }
    ]
  }
  
  // 単位オプション
  const unitOptions = ['回', '球', '本', '分', 'セット', 'km', 'm']
  
  // 初期読み込み
  useEffect(() => {
    const saved = localStorage.getItem(storageKey)
    if (saved) {
      setCustomItems(JSON.parse(saved))
    } else if (defaultItems[category]) {
      setCustomItems(defaultItems[category])
    }
  }, [category, storageKey])
  
  // アイテムが変更されたら親コンポーネントに通知
  useEffect(() => {
    if (onItemsChange) {
      onItemsChange(customItems)
    }
  }, [customItems, onItemsChange])
  
  // カスタム項目を保存
  const saveItems = (items) => {
    setCustomItems(items)
    localStorage.setItem(storageKey, JSON.stringify(items))
  }
  
  // 新しい項目を追加
  const addItem = () => {
    if (!newItemName.trim()) {
      alert('項目名を入力してください')
      return
    }
    
    if (customItems.some(item => item.name === newItemName)) {
      alert('同じ名前の項目が既に存在します')
      return
    }
    
    const newItems = [...customItems, { name: newItemName, unit: newItemUnit }]
    saveItems(newItems)
    setNewItemName('')
    setNewItemUnit('回')
  }
  
  // 項目を削除
  const removeItem = (index) => {
    if (window.confirm(`「${customItems[index].name}」を削除しますか？`)) {
      const newItems = customItems.filter((_, i) => i !== index)
      saveItems(newItems)
    }
  }
  
  // 項目を上に移動
  const moveUp = (index) => {
    if (index === 0) return
    const newItems = [...customItems]
    ;[newItems[index - 1], newItems[index]] = [newItems[index], newItems[index - 1]]
    saveItems(newItems)
  }
  
  // 項目を下に移動
  const moveDown = (index) => {
    if (index === customItems.length - 1) return
    const newItems = [...customItems]
    ;[newItems[index], newItems[index + 1]] = [newItems[index + 1], newItems[index]]
    saveItems(newItems)
  }
  
  // デフォルトに戻す
  const resetToDefault = () => {
    if (window.confirm('デフォルトの項目に戻しますか？カスタム項目は削除されます。')) {
      if (defaultItems[category]) {
        saveItems(defaultItems[category])
      }
    }
  }
  
  return (
    <div className="custom-practice-items">
      <div className="custom-items-header">
        <h4>練習項目</h4>
        <button
          type="button"
          className="edit-items-btn"
          onClick={() => setIsEditing(!isEditing)}
        >
          {isEditing ? '完了' : '編集'}
        </button>
      </div>
      
      {isEditing ? (
        <div className="edit-mode">
          <div className="items-list">
            {customItems.map((item, index) => (
              <div key={index} className="item-row">
                <div className="item-info">
                  <span className="item-name">{item.name}</span>
                  <span className="item-unit">({item.unit})</span>
                </div>
                <div className="item-actions">
                  <button
                    type="button"
                    onClick={() => moveUp(index)}
                    disabled={index === 0}
                    className="move-btn"
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    onClick={() => moveDown(index)}
                    disabled={index === customItems.length - 1}
                    className="move-btn"
                  >
                    ↓
                  </button>
                  <button
                    type="button"
                    onClick={() => removeItem(index)}
                    className="remove-btn"
                  >
                    ×
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="add-item-form">
            <input
              type="text"
              placeholder="新しい項目名"
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              className="item-name-input"
            />
            <select
              value={newItemUnit}
              onChange={(e) => setNewItemUnit(e.target.value)}
              className="unit-select"
            >
              {unitOptions.map(unit => (
                <option key={unit} value={unit}>{unit}</option>
              ))}
            </select>
            <button
              type="button"
              onClick={addItem}
              className="add-btn"
            >
              追加
            </button>
          </div>
          
          <button
            type="button"
            onClick={resetToDefault}
            className="reset-btn"
          >
            デフォルトに戻す
          </button>
        </div>
      ) : (
        <div className="quick-select">
          {customItems.map((item, index) => (
            <button
              key={index}
              type="button"
              className="quick-item"
              onClick={() => {
                if (onItemsChange) {
                  onItemsChange([{ ...item, value: '' }])
                }
              }}
            >
              {item.name}
              <span className="unit-badge">{item.unit}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default CustomPracticeItems