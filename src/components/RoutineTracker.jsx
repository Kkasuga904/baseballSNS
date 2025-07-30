import React, { useState, useEffect } from 'react'
import { useAuth } from '../App'
import './RoutineTracker.css'

function RoutineTracker() {
  const { user } = useAuth()
  const userKey = user?.email || 'guest'
  
  const [selectedRoutines, setSelectedRoutines] = useState(() => {
    const saved = localStorage.getItem(`baseballSNSRoutines_${userKey}`)
    return saved ? JSON.parse(saved) : []
  })

  const [routineSchedules, setRoutineSchedules] = useState(() => {
    const saved = localStorage.getItem(`baseballSNSRoutineSchedules_${userKey}`)
    return saved ? JSON.parse(saved) : {}
  })

  const [completedToday, setCompletedToday] = useState(() => {
    const saved = localStorage.getItem(`baseballSNSCompletedRoutines_${userKey}`)
    const today = new Date().toDateString()
    const data = saved ? JSON.parse(saved) : {}
    return data[today] || []
  })

  const [showRoutineSelector, setShowRoutineSelector] = useState(false)
  const [showTimeSettings, setShowTimeSettings] = useState(false)
  const [editingRoutineTime, setEditingRoutineTime] = useState(null)

  const today = new Date().toDateString()

  // 固定のルーティン選択肢
  const fixedRoutines = [
    { id: 'stretch', title: '朝のストレッチ', category: 'warmup' },
    { id: 'swings', title: '素振り100回', category: 'practice' },
    { id: 'running', title: 'ランニング', category: 'training' },
    { id: 'core', title: '体幹トレーニング', category: 'training' },
    { id: 'protein', title: 'プロテイン摂取', category: 'nutrition' },
    { id: 'meal-record', title: '食事記録', category: 'record' },
    { id: 'sleep-record', title: '睡眠記録', category: 'record' },
    { id: 'weight', title: '体重測定', category: 'health' },
    { id: 'flexibility', title: '柔軟体操', category: 'warmup' },
    { id: 'catch', title: 'キャッチボール', category: 'practice' },
    { id: 'batting', title: 'バッティング練習', category: 'practice' },
    { id: 'pitching', title: 'ピッチング練習', category: 'practice' },
    { id: 'fielding', title: 'フィールディング練習', category: 'practice' },
    { id: 'base-running', title: 'ベースランニング', category: 'practice' },
    { id: 'tee-batting', title: 'ティーバッティング', category: 'practice' },
    { id: 'soft-toss', title: 'ソフトトス', category: 'practice' },
    { id: 'bullpen', title: 'ブルペン投球', category: 'practice' },
    { id: 'live-batting', title: 'ライブバッティング', category: 'practice' },
    { id: 'bunt-practice', title: 'バント練習', category: 'practice' },
    { id: 'infield-practice', title: 'ノック練習', category: 'practice' },
    { id: 'meditation', title: '瞑想・メンタルケア', category: 'mental' },
    { id: 'video-review', title: '動画でフォーム確認', category: 'analysis' },
    { id: 'massage', title: 'マッサージ・ケア', category: 'recovery' }
  ]

  const categoryLabels = {
    morning: '朝',
    warmup: 'ウォームアップ',
    practice: '練習',
    training: 'トレーニング',
    nutrition: '栄養',
    meal: '食事',
    record: '記録',
    health: '健康管理',
    mental: 'メンタル',
    analysis: '分析',
    recovery: 'リカバリー',
    evening: '夜',
    other: 'その他'
  }

  // ルーティンを保存
  const saveRoutines = (updatedRoutines) => {
    setSelectedRoutines(updatedRoutines)
    localStorage.setItem(`baseballSNSRoutines_${userKey}`, JSON.stringify(updatedRoutines))
  }

  // ルーティンスケジュールを保存
  const saveRoutineSchedules = (updatedSchedules) => {
    setRoutineSchedules(updatedSchedules)
    localStorage.setItem(`baseballSNSRoutineSchedules_${userKey}`, JSON.stringify(updatedSchedules))
  }

  // 完了状態を保存
  const saveCompleted = (completedIds) => {
    setCompletedToday(completedIds)
    
    const saved = localStorage.getItem(`baseballSNSCompletedRoutines_${userKey}`)
    const data = saved ? JSON.parse(saved) : {}
    data[today] = completedIds
    
    // 古いデータを削除（30日以上前）
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - 30)
    Object.keys(data).forEach(date => {
      if (new Date(date) < cutoffDate) {
        delete data[date]
      }
    })
    
    localStorage.setItem(`baseballSNSCompletedRoutines_${userKey}`, JSON.stringify(data))
  }

  // ルーティンを追加
  const toggleRoutine = (routineId) => {
    if (selectedRoutines.includes(routineId)) {
      saveRoutines(selectedRoutines.filter(id => id !== routineId))
      saveCompleted(completedToday.filter(id => id !== routineId))
    } else {
      saveRoutines([...selectedRoutines, routineId])
    }
  }

  // 完了状態を切り替え
  const toggleComplete = (id) => {
    if (completedToday.includes(id)) {
      saveCompleted(completedToday.filter(cId => cId !== id))
    } else {
      saveCompleted([...completedToday, id])
    }
  }

  // 達成率を計算
  const completionRate = selectedRoutines.length > 0 
    ? Math.round((completedToday.length / selectedRoutines.length) * 100)
    : 0

  // 連続達成日数を計算
  const getStreak = () => {
    const saved = localStorage.getItem(`baseballSNSCompletedRoutines_${userKey}`)
    if (!saved) return 0
    
    const data = JSON.parse(saved)
    let streak = 0
    let checkDate = new Date()
    
    while (true) {
      const dateStr = checkDate.toDateString()
      const completed = data[dateStr] || []
      
      // その日にルーティンが設定されていて、全て完了していたか
      if (selectedRoutines.length > 0 && completed.length === selectedRoutines.length) {
        streak++
        checkDate.setDate(checkDate.getDate() - 1)
      } else if (dateStr === today) {
        // 今日はまだカウントしない
        checkDate.setDate(checkDate.getDate() - 1)
      } else {
        break
      }
    }
    
    return streak
  }
  
  // カスタムルーティンと固定ルーティンを統合
  const [allRoutines, setAllRoutines] = useState(fixedRoutines)
  
  // カスタムルーティンを読み込む
  useEffect(() => {
    const savedCustomRoutines = localStorage.getItem(`baseballSNSRoutines_${userKey}`)
    if (savedCustomRoutines) {
      const customRoutines = JSON.parse(savedCustomRoutines)
      // アクティブなルーティンのみ表示
      const activeCustomRoutines = customRoutines.filter(r => r.isActive !== false)
      setAllRoutines([...fixedRoutines, ...activeCustomRoutines])
    }
  }, [userKey])
  
  // 選択されたルーティンの詳細を取得
  const getSelectedRoutineDetails = () => {
    return allRoutines.filter(r => selectedRoutines.includes(r.id))
  }

  // 時間設定を保存
  const saveTimeForRoutine = (routineId, time) => {
    const updatedSchedules = {
      ...routineSchedules,
      [routineId]: time
    }
    saveRoutineSchedules(updatedSchedules)
    setEditingRoutineTime(null)
    setShowTimeSettings(false)
  }


  // 時間順にソートされたルーティンを取得
  const getSortedRoutines = () => {
    const routines = getSelectedRoutineDetails()
    return routines.sort((a, b) => {
      const timeA = routineSchedules[a.id] || '23:59'
      const timeB = routineSchedules[b.id] || '23:59'
      return timeA.localeCompare(timeB)
    })
  }

  return (
    <div className="routine-tracker">
      <div className="tracker-header">
        <h3>📋 今日のルーティン</h3>
        <div className="tracker-stats">
          <div className="stat">
            <span className="stat-value">{completionRate}%</span>
            <span className="stat-label">達成率</span>
          </div>
          <div className="stat">
            <span className="stat-value">{getStreak()}日</span>
            <span className="stat-label">連続達成</span>
          </div>
        </div>
      </div>

      <div className="progress-bar">
        <div 
          className="progress-fill"
          style={{ width: `${completionRate}%` }}
        />
      </div>

      <div className="routines-list">
        {getSortedRoutines().length === 0 ? (
          <p className="no-routines-message">
            ルーティンが設定されていません。<br />
            下のボタンから日課を選択してください。
          </p>
        ) : (
          getSortedRoutines().map(routine => (
            <div 
              key={routine.id} 
              className={`routine-item ${completedToday.includes(routine.id) ? 'completed' : ''}`}
            >
              <label className="routine-label">
                <input
                  type="checkbox"
                  checked={completedToday.includes(routine.id)}
                  onChange={() => toggleComplete(routine.id)}
                />
                <span className="routine-checkbox"></span>
                <div className="routine-content">
                  <span className="routine-title">{routine.title}</span>
                  <span className="routine-time">
                    {routineSchedules[routine.id] ? (
                      `⏰ ${routineSchedules[routine.id]}`
                    ) : (
                      <span className="no-time">時間未設定</span>
                    )}
                  </span>
                </div>
              </label>
              <button
                className="time-setting-btn"
                onClick={() => {
                  setEditingRoutineTime(routine.id)
                  setShowTimeSettings(true)
                }}
              >
                🕐
              </button>
            </div>
          ))
        )}
      </div>

      <button
        className="add-routine-btn"
        onClick={() => setShowRoutineSelector(!showRoutineSelector)}
      >
        ⚙️ ルーティンを編集
      </button>

      {showRoutineSelector && (
        <div className="routine-selector">
          <h4>日課を選択</h4>
          <div className="routine-categories">
            {Object.entries(categoryLabels).map(([categoryId, categoryLabel]) => {
              const categoryRoutines = allRoutines.filter(r => r.category === categoryId)
              if (categoryRoutines.length === 0) return null
              
              return (
                <div key={categoryId} className="routine-category">
                  <h5>{categoryLabel}</h5>
                  <div className="routine-options">
                    {categoryRoutines.map(routine => (
                      <label key={routine.id} className="routine-option">
                        <input
                          type="checkbox"
                          checked={selectedRoutines.includes(routine.id)}
                          onChange={() => toggleRoutine(routine.id)}
                        />
                        <span className="routine-option-checkbox"></span>
                        <span className="routine-option-title">
                          {routine.title}
                          {routine.isCustom && <span className="custom-badge">カスタム</span>}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
          <button
            className="close-selector-btn"
            onClick={() => setShowRoutineSelector(false)}
          >
            完了
          </button>
        </div>
      )}

      {showTimeSettings && editingRoutineTime && (
        <div className="time-setting-modal">
          <div className="modal-overlay" onClick={() => setShowTimeSettings(false)} />
          <div className="modal-content">
            <h4>
              {fixedRoutines.find(r => r.id === editingRoutineTime)?.title}の時間設定
            </h4>
            <input
              type="time"
              defaultValue={routineSchedules[editingRoutineTime] || ''}
              onChange={(e) => {
                if (e.target.value) {
                  saveTimeForRoutine(editingRoutineTime, e.target.value)
                }
              }}
              autoFocus
            />
            <div className="time-setting-actions">
              <button
                className="clear-time-btn"
                onClick={() => {
                  const updatedSchedules = { ...routineSchedules }
                  delete updatedSchedules[editingRoutineTime]
                  saveRoutineSchedules(updatedSchedules)
                  setEditingRoutineTime(null)
                  setShowTimeSettings(false)
                }}
              >
                時間をクリア
              </button>
              <button
                className="close-time-btn"
                onClick={() => {
                  setEditingRoutineTime(null)
                  setShowTimeSettings(false)
                }}
              >
                閉じる
              </button>
            </div>
          </div>
        </div>
      )}

      {completionRate === 100 && selectedRoutines.length > 0 && (
        <div className="completion-message">
          🎉 今日のルーティン完了！素晴らしい！
        </div>
      )}
    </div>
  )
}

export default RoutineTracker