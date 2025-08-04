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
      { name: 'バント練習', unit: '本' },
      { name: 'トスバッティング', unit: '球' },
      { name: 'マシン打撃', unit: '球' },
      { name: 'ペッパー', unit: '分' },
      { name: 'センター返し', unit: '球' },
      { name: '流し打ち', unit: '球' },
      { name: '引っ張り', unit: '球' },
      { name: 'ケースバッティング', unit: '球' },
      { name: 'スイングスピード測定', unit: '回' },
      { name: 'ロングティー', unit: '球' },
      { name: 'バスター練習', unit: '本' }
    ],
    pitching: [
      { name: 'キャッチボール', unit: '球' },
      { name: 'ブルペン', unit: '球' },
      { name: 'シャドーピッチング', unit: '回' },
      { name: '遠投', unit: '球' },
      { name: 'ネットスロー', unit: '球' },
      { name: '壁当て', unit: '球' },
      { name: 'タオルシャドー', unit: '回' },
      { name: 'プルダウン', unit: '球' },
      { name: 'ウエイトボール', unit: '球' },
      { name: 'リリース練習', unit: '回' },
      { name: 'ピッチングマシン調整', unit: '球' },
      { name: 'クイック練習', unit: '回' },
      { name: 'セットポジション', unit: '回' },
      { name: '牽制練習', unit: '回' }
    ],
    fielding: [
      { name: 'ノック', unit: '本' },
      { name: 'ゴロ捕球', unit: '本' },
      { name: 'フライ捕球', unit: '本' },
      { name: '送球練習', unit: '本' },
      { name: 'シートノック', unit: '本' },
      { name: 'ダブルプレー', unit: '回' },
      { name: 'ランダウンプレー', unit: '回' },
      { name: 'バント処理', unit: '本' },
      { name: 'タッチプレー', unit: '回' },
      { name: '中継プレー', unit: '回' },
      { name: 'ボール回し', unit: '分' },
      { name: 'グラブトス', unit: '回' },
      { name: 'ステップワーク', unit: '分' },
      { name: '逆シングル', unit: '本' },
      { name: 'ダイビングキャッチ', unit: '回' }
    ],
    running: [
      { name: 'ベースランニング', unit: '本' },
      { name: 'スタートダッシュ', unit: '本' },
      { name: 'スライディング', unit: '回' },
      { name: '塁間走', unit: '本' },
      { name: 'ホームイン', unit: '本' },
      { name: 'リード練習', unit: '回' },
      { name: '盗塁練習', unit: '回' },
      { name: 'ヒットエンドラン', unit: '回' },
      { name: 'タッチアップ', unit: '回' },
      { name: 'ランダウン走塁', unit: '回' },
      { name: '一塁駆け抜け', unit: '本' },
      { name: 'ベースコーチ練習', unit: '分' },
      { name: '周回走', unit: '周' },
      { name: 'インターバル走', unit: '本' }
    ],
    training: [
      // ウエイトトレーニング
      { name: 'ベンチプレス', unit: 'セット' },
      { name: 'スクワット', unit: 'セット' },
      { name: 'デッドリフト', unit: 'セット' },
      { name: 'クリーン', unit: 'セット' },
      { name: 'ショルダープレス', unit: 'セット' },
      { name: 'ラットプルダウン', unit: 'セット' },
      { name: 'レッグプレス', unit: 'セット' },
      { name: 'レッグカール', unit: 'セット' },
      { name: 'カーフレイズ', unit: 'セット' },
      // 体幹トレーニング
      { name: 'プランク', unit: '秒' },
      { name: 'サイドプランク', unit: '秒' },
      { name: '腹筋ローラー', unit: '回' },
      { name: 'レッグレイズ', unit: '回' },
      { name: 'バックエクステンション', unit: '回' },
      { name: 'ロシアンツイスト', unit: '回' },
      // 機能的トレーニング
      { name: 'メディシンボールスロー', unit: '回' },
      { name: 'バトルロープ', unit: '秒' },
      { name: 'ケトルベルスイング', unit: '回' },
      { name: 'ボックスジャンプ', unit: '回' },
      { name: 'バーピー', unit: '回' },
      // 野球特化トレーニング
      { name: 'リストカール', unit: 'セット' },
      { name: 'リストローラー', unit: '回' },
      { name: 'チューブトレーニング', unit: 'セット' },
      { name: 'バランスボール', unit: '分' },
      { name: 'ラダートレーニング', unit: '本' },
      { name: 'コーントレーニング', unit: '本' },
      // 有酸素運動
      { name: 'ランニング', unit: 'km' },
      { name: 'インターバル走', unit: '本' },
      { name: 'バイク', unit: '分' },
      { name: 'エアロバイク', unit: '分' },
      { name: '階段ダッシュ', unit: '本' }
    ],
    stretch: [
      // 基本ストレッチ
      { name: '動的ストレッチ', unit: '分' },
      { name: '静的ストレッチ', unit: '分' },
      { name: 'フォームローラー', unit: '分' },
      { name: 'ジョギング', unit: '分' },
      { name: 'ウォーキング', unit: '分' },
      // 肩関節ストレッチ
      { name: '肩回し', unit: '回' },
      { name: 'スリーパーストレッチ', unit: '秒' },
      { name: 'クロスボディストレッチ', unit: '秒' },
      { name: '肩甲骨ストレッチ', unit: '秒' },
      { name: 'アームサークル', unit: '回' },
      // 股関節ストレッチ
      { name: '股関節回し', unit: '回' },
      { name: '開脚ストレッチ', unit: '秒' },
      { name: 'ハムストリングストレッチ', unit: '秒' },
      { name: '腸腰筋ストレッチ', unit: '秒' },
      { name: '四股踏み', unit: '回' },
      // 体幹ストレッチ
      { name: '体側ストレッチ', unit: '秒' },
      { name: '腰ひねりストレッチ', unit: '秒' },
      { name: 'キャットカウ', unit: '回' },
      { name: '背筋ストレッチ', unit: '秒' },
      // 下半身ストレッチ
      { name: 'ふくらはぎストレッチ', unit: '秒' },
      { name: '太ももストレッチ', unit: '秒' },
      { name: 'アキレス腱ストレッチ', unit: '秒' },
      { name: '足首回し', unit: '回' },
      // 全身運動
      { name: 'ラジオ体操', unit: '回' },
      { name: 'マエケン体操', unit: '回' },
      { name: 'ダイナミックストレッチ', unit: '分' },
      { name: 'PNFストレッチ', unit: '分' }
    ],
    game: [
      // 打撃振り返り
      { name: '打数', unit: '回' },
      { name: '安打数', unit: '本' },
      { name: '打点', unit: '点' },
      { name: '得点', unit: '点' },
      { name: '四球', unit: '回' },
      { name: '三振', unit: '回' },
      { name: '盗塁', unit: '個' },
      { name: '盗塁死', unit: '回' },
      // 守備振り返り
      { name: '守備機会', unit: '回' },
      { name: 'エラー', unit: '回' },
      { name: 'アシスト', unit: '回' },
      { name: 'ダブルプレー', unit: '回' },
      // 投手振り返り
      { name: '投球回', unit: '回' },
      { name: '被安打', unit: '本' },
      { name: '奪三振', unit: '個' },
      { name: '与四球', unit: '個' },
      { name: '失点', unit: '点' },
      { name: '自責点', unit: '点' },
      // パフォーマンス評価
      { name: '調子', unit: '点' },
      { name: 'コンディション', unit: '点' },
      { name: '集中力', unit: '点' },
      { name: '積極性', unit: '点' },
      { name: 'チームワーク', unit: '点' },
      // 課題・改善点
      { name: '課題達成度', unit: '点' },
      { name: '新たな課題発見', unit: '個' },
      { name: '技術改善', unit: '点' },
      { name: '戦術理解', unit: '点' }
    ]
  }
  
  // 単位オプション
  const unitOptions = ['回', '球', '本', '分', '秒', 'セット', 'km', 'm', '周', '点', '個']
  
  // 初期読み込み
  useEffect(() => {
    const saved = localStorage.getItem(storageKey)
    if (saved) {
      try {
        const parsedItems = JSON.parse(saved)
        // gameカテゴリが新しく追加された場合、既存データがない可能性があるのでデフォルト値を使用
        if (parsedItems && parsedItems.length > 0) {
          setCustomItems(parsedItems)
        } else if (defaultItems[category]) {
          setCustomItems(defaultItems[category])
        }
      } catch (error) {
        console.error('Failed to parse saved items:', error)
        // パースエラーの場合はデフォルト値を使用
        if (defaultItems[category]) {
          setCustomItems(defaultItems[category])
        }
      }
    } else if (defaultItems[category]) {
      // 保存データがない場合はデフォルト値を使用
      setCustomItems(defaultItems[category])
    } else {
      // カテゴリが見つからない場合は空配列
      setCustomItems([])
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