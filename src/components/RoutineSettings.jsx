import React, { useState, useEffect } from 'react'
import { useAuth } from '../App'
import './RoutineSettings.css'

function RoutineSettings() {
  const { user } = useAuth()
  const [routines, setRoutines] = useState([])
  const [editingRoutine, setEditingRoutine] = useState(null)
  const [newRoutine, setNewRoutine] = useState({ title: '', category: 'morning' })
  const [showAddForm, setShowAddForm] = useState(false)

  const categories = {
    morning: { label: '朝', icon: '🌅' },
    practice: { label: '練習', icon: '⚾' },
    meal: { label: '食事', icon: '🍽️' },
    evening: { label: '夜', icon: '🌙' },
    other: { label: 'その他', icon: '📌' }
  }

  useEffect(() => {
    if (user) {
      const userKey = user.email || 'guest'
      const savedRoutines = localStorage.getItem(`baseballSNSRoutines_${userKey}`)
      if (savedRoutines) {
        setRoutines(JSON.parse(savedRoutines))
      }
    }
  }, [user])

  const saveRoutines = (updatedRoutines) => {
    const userKey = user?.email || 'guest'
    localStorage.setItem(`baseballSNSRoutines_${userKey}`, JSON.stringify(updatedRoutines))
    setRoutines(updatedRoutines)
  }

  const handleAdd = () => {
    if (!newRoutine.title.trim()) return
    
    const routine = {
      id: `custom_${Date.now()}`,
      ...newRoutine,
      isCustom: true
    }
    
    saveRoutines([...routines, routine])
    setNewRoutine({ title: '', category: 'morning' })
    setShowAddForm(false)
  }

  const handleEdit = (routine) => {
    setEditingRoutine(routine)
  }

  const handleUpdate = () => {
    if (!editingRoutine.title.trim()) return
    
    const updatedRoutines = routines.map(r => 
      r.id === editingRoutine.id ? editingRoutine : r
    )
    saveRoutines(updatedRoutines)
    setEditingRoutine(null)
  }

  const handleDelete = (id) => {
    if (confirm('このルーティーンを削除しますか？')) {
      saveRoutines(routines.filter(r => r.id !== id))
    }
  }

  const handleToggleActive = (id) => {
    const updatedRoutines = routines.map(r => 
      r.id === id ? { ...r, isActive: !r.isActive } : r
    )
    saveRoutines(updatedRoutines)
  }

  // カテゴリー別にルーティーンをグループ化
  const groupedRoutines = Object.keys(categories).reduce((acc, category) => {
    acc[category] = routines.filter(r => r.category === category)
    return acc
  }, {})

  return (
    <div className="routine-settings">
      <div className="settings-header">
        <h3>🎯 ルーティーン管理</h3>
        <button 
          className="add-routine-btn"
          onClick={() => setShowAddForm(!showAddForm)}
        >
          + 新規追加
        </button>
      </div>

      {showAddForm && (
        <div className="add-routine-form">
          <input
            type="text"
            placeholder="ルーティーン名を入力"
            value={newRoutine.title}
            onChange={(e) => setNewRoutine({ ...newRoutine, title: e.target.value })}
            className="routine-input"
          />
          <select
            value={newRoutine.category}
            onChange={(e) => setNewRoutine({ ...newRoutine, category: e.target.value })}
            className="category-select"
          >
            {Object.entries(categories).map(([key, { label }]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
          <div className="form-actions">
            <button onClick={handleAdd} className="save-btn">追加</button>
            <button onClick={() => setShowAddForm(false)} className="cancel-btn">キャンセル</button>
          </div>
        </div>
      )}

      <div className="routines-list">
        {Object.entries(groupedRoutines).map(([category, categoryRoutines]) => (
          categoryRoutines.length > 0 && (
            <div key={category} className="category-group">
              <div className="category-header">
                <span className="category-icon">{categories[category].icon}</span>
                <span className="category-name">{categories[category].label}</span>
              </div>
              <div className="category-routines">
                {categoryRoutines.map(routine => (
                  <div key={routine.id} className="routine-item">
                    {editingRoutine?.id === routine.id ? (
                      <div className="edit-form">
                        <input
                          type="text"
                          value={editingRoutine.title}
                          onChange={(e) => setEditingRoutine({ ...editingRoutine, title: e.target.value })}
                          className="edit-input"
                        />
                        <select
                          value={editingRoutine.category}
                          onChange={(e) => setEditingRoutine({ ...editingRoutine, category: e.target.value })}
                          className="edit-select"
                        >
                          {Object.entries(categories).map(([key, { label }]) => (
                            <option key={key} value={key}>{label}</option>
                          ))}
                        </select>
                        <button onClick={handleUpdate} className="save-btn small">保存</button>
                        <button onClick={() => setEditingRoutine(null)} className="cancel-btn small">取消</button>
                      </div>
                    ) : (
                      <>
                        <div className="routine-content">
                          <label className="routine-checkbox">
                            <input
                              type="checkbox"
                              checked={routine.isActive !== false}
                              onChange={() => handleToggleActive(routine.id)}
                            />
                            <span className="routine-title">{routine.title}</span>
                          </label>
                          {routine.isCustom && (
                            <div className="routine-actions">
                              <button onClick={() => handleEdit(routine)} className="edit-btn">編集</button>
                              <button onClick={() => handleDelete(routine.id)} className="delete-btn">削除</button>
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )
        ))}
      </div>

      <div className="settings-info">
        <p>💡 ヒント: チェックを外したルーティーンは一時的に非表示になります</p>
      </div>
    </div>
  )
}

export default RoutineSettings