import React, { useState } from 'react'
import './SupplementForm.css'

function SupplementForm({ onSubmit }) {
  // 固定サプリメントの設定を取得
  const [fixedSupplements, setFixedSupplements] = useState(() => {
    const saved = localStorage.getItem('baseballSNSFixedSupplements')
    return saved ? JSON.parse(saved) : []
  })
  
  const [showFixedSettings, setShowFixedSettings] = useState(false)
  
  // 今日の記録用サプリメント（固定サプリメントで初期化）
  const [supplements, setSupplements] = useState(() => {
    return fixedSupplements.length > 0 
      ? [...fixedSupplements]
      : [{ name: '', amount: '', unit: 'g', timing: 'morning' }]
  })

  const handleSupplementChange = (index, field, value) => {
    const newSupplements = [...supplements]
    newSupplements[index][field] = value
    setSupplements(newSupplements)
  }

  const addSupplement = () => {
    setSupplements([...supplements, { name: '', amount: '', unit: 'g', timing: 'morning' }])
  }

  const removeSupplement = (index) => {
    if (supplements.length > 1) {
      setSupplements(supplements.filter((_, i) => i !== index))
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const validSupplements = supplements.filter(s => s.name && s.amount)
    if (validSupplements.length > 0) {
      onSubmit({
        supplements: validSupplements.map(s => ({
          ...s,
          amount: parseFloat(s.amount)
        })),
        timestamp: new Date().toISOString()
      })
      
      // フォームをリセット
      setSupplements([{ name: '', amount: '', unit: 'g', timing: 'morning' }])
    }
  }

  const timingOptions = [
    { value: 'morning', label: '朝' },
    { value: 'pre-training', label: '練習前' },
    { value: 'post-training', label: '練習後' },
    { value: 'evening', label: '夜' },
    { value: 'before-bed', label: '就寝前' }
  ]

  const unitOptions = ['g', 'mg', '錠', 'カプセル', 'ml', 'スクープ']
  
  const commonSupplements = [
    { value: '', label: '選択してください' },
    { value: 'プロテイン', label: 'プロテイン' },
    { value: 'クレアチン', label: 'クレアチン' },
    { value: 'グルタミン', label: 'グルタミン' },
    { value: 'マルチビタミン', label: 'マルチビタミン' },
    { value: 'BCAA', label: 'BCAA' },
    { value: 'EAA', label: 'EAA' },
    { value: 'HMB', label: 'HMB' },
    { value: 'ビタミンC', label: 'ビタミンC' },
    { value: 'ビタミンD', label: 'ビタミンD' },
    { value: '亜鉛', label: '亜鉛' },
    { value: 'マグネシウム', label: 'マグネシウム' },
    { value: 'カルシウム', label: 'カルシウム' },
    { value: 'オメガ3', label: 'オメガ3' },
    { value: 'グルコサミン', label: 'グルコサミン' },
    { value: 'コンドロイチン', label: 'コンドロイチン' },
    { value: 'other', label: 'その他（入力）' }
  ]
  
  // 固定サプリメントを保存
  const saveFixedSupplements = () => {
    const validSupplements = supplements.filter(s => s.name && s.amount)
    setFixedSupplements(validSupplements)
    localStorage.setItem('baseballSNSFixedSupplements', JSON.stringify(validSupplements))
    setShowFixedSettings(false)
  }
  
  // 固定サプリメントを読み込み
  const loadFixedSupplements = () => {
    if (fixedSupplements.length > 0) {
      setSupplements([...fixedSupplements])
    }
  }

  return (
    <form className="supplement-form" onSubmit={handleSubmit}>
      <div className="fixed-supplements-section">
        <button
          type="button"
          className="fixed-settings-btn"
          onClick={() => setShowFixedSettings(!showFixedSettings)}
        >
          ⚙️ 固定サプリメント設定
        </button>
        
        {fixedSupplements.length > 0 && !showFixedSettings && (
          <button
            type="button"
            className="load-fixed-btn"
            onClick={loadFixedSupplements}
          >
            📋 固定サプリメントを読み込む
          </button>
        )}
        
        {showFixedSettings && (
          <div className="fixed-settings-panel">
            <p className="fixed-settings-info">
              毎日飲むサプリメントを設定しておくと、次回から自動で入力されます
            </p>
            <button
              type="button"
              className="save-fixed-btn"
              onClick={saveFixedSupplements}
            >
              💾 現在の内容を固定サプリメントとして保存
            </button>
          </div>
        )}
      </div>
      <div className="supplements-list">
        {supplements.map((supplement, index) => (
          <div key={index} className="supplement-item">
            <div className="supplement-header">
              <h4>サプリメント {index + 1}</h4>
              {supplements.length > 1 && (
                <button
                  type="button"
                  className="remove-supplement-btn"
                  onClick={() => removeSupplement(index)}
                >
                  ✕
                </button>
              )}
            </div>
            
            <div className="supplement-fields">
              <div className="form-group">
                <label>サプリメント名</label>
                <select
                  value={supplement.selectedType || ''}
                  onChange={(e) => {
                    const value = e.target.value
                    if (value === 'other') {
                      handleSupplementChange(index, 'selectedType', value)
                      handleSupplementChange(index, 'name', '')
                    } else {
                      handleSupplementChange(index, 'selectedType', value)
                      handleSupplementChange(index, 'name', value)
                    }
                  }}
                  required
                >
                  {commonSupplements.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {supplement.selectedType === 'other' && (
                  <input
                    type="text"
                    value={supplement.name}
                    onChange={(e) => handleSupplementChange(index, 'name', e.target.value)}
                    placeholder="サプリメント名を入力"
                    className="other-supplement-input"
                    required
                  />
                )}
              </div>

              <div className="amount-unit-group">
                <div className="form-group">
                  <label>摂取量</label>
                  <input
                    type="number"
                    value={supplement.amount}
                    onChange={(e) => handleSupplementChange(index, 'amount', e.target.value)}
                    placeholder="30"
                    min="0"
                    step="0.1"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>単位</label>
                  <select
                    value={supplement.unit}
                    onChange={(e) => handleSupplementChange(index, 'unit', e.target.value)}
                  >
                    {unitOptions.map(unit => (
                      <option key={unit} value={unit}>{unit}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>摂取タイミング</label>
                <select
                  value={supplement.timing}
                  onChange={(e) => handleSupplementChange(index, 'timing', e.target.value)}
                >
                  {timingOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        className="add-supplement-btn"
        onClick={addSupplement}
      >
        + サプリメントを追加
      </button>

      <button type="submit" className="submit-button">
        サプリメントを記録
      </button>
    </form>
  )
}

export default SupplementForm