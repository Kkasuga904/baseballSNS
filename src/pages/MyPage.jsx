/**
 * MyPage.jsx - マイページコンポーネント
 * 
 * ユーザー個人の練習記録、統計、スケジュールなどを管理・表示するダッシュボード。
 * 野球練習の振り返りと成長の記録を一元管理します。
 * 
 * 主な機能:
 * - 日別の練習記録管理
 * - 週次・月次の統計表示
 * - 身体測定データのグラフ化
 * - 栄養管理（食事・サプリメント）
 * - スケジュール管理
 * - ルーティントラッカー
 * - 練習動画の管理
 */

import React, { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../App'
import { useTeam } from '../contexts/TeamContext'
import PracticeStats from '../components/PracticeStats'
import PracticeRecord from '../components/PracticeRecord'
import WeeklySummary from '../components/WeeklySummary'
import DailyRecordTabs from '../components/DailyRecordTabs'
import DailyRecords from '../components/DailyRecords'
import NutritionChart from '../components/NutritionChart'
import ScheduleItem from '../components/ScheduleItem'
import RoutineTracker from '../components/RoutineTracker'
import BodyMetricsChart from '../components/BodyMetricsChart'
import MonthlyStats from '../components/MonthlyStats'
import TeamManagement from '../components/TeamManagement'
import DiaryForm from '../components/DiaryForm'
import DiaryList from '../components/DiaryList'
import DiaryView from '../components/DiaryView'
import GameRecord from '../components/GameRecord'
import GameRecordList from '../components/GameRecordList'
import PerformanceChart from '../components/PerformanceChart'
import PracticeCalendar from '../components/PracticeCalendar'
import PracticeForm from '../components/PracticeForm'
import { TeamRoleLabels } from '../models/team'
import './MyPage.css'

/**
 * マイページコンポーネント
 * 
 * @param {Object} props
 * @param {Array} props.posts - タイムラインの投稿データ（練習記録含む）
 * @param {Object} props.myPageData - マイページ専用データ
 *   - practices: 練習記録の配列
 *   - videos: 練習動画の配列
 *   - schedules: スケジュールの配列
 *   - meals: 食事記録の配列
 *   - supplements: サプリメント記録の配列
 *   - sleep: 睡眠記録の配列
 *   - games: 試合記録の配列
 * @param {Function} props.setMyPageData - マイページデータを更新する関数
 * @param {string} props.selectedDate - 選択中の日付（YYYY-MM-DD形式）
 * @param {Function} props.setSelectedDate - 選択日付を更新する関数
 */
function MyPage({ posts, myPageData, setMyPageData, selectedDate, setSelectedDate, addPost }) {
  // 認証情報を取得
  const { user } = useAuth()
  const navigate = useNavigate()
  const { getUserTeams, isInitialized } = useTeam()
  const [showTeamManagement, setShowTeamManagement] = useState(false)
  const [showDiaryForm, setShowDiaryForm] = useState(false)
  const [editingDiary, setEditingDiary] = useState(null)
  const [viewingDiary, setViewingDiary] = useState(null)
  const [showGameRecord, setShowGameRecord] = useState(false)
  const [editingGame, setEditingGame] = useState(null)
  const [showPracticeForm, setShowPracticeForm] = useState(false)
  
  // ユーザーの所属チーム一覧を取得（ユーザー情報を明示的に渡す）
  const userTeams = React.useMemo(() => {
    if (!isInitialized || !user) {
      return [];
    }
    return getUserTeams(user);
  }, [user, getUserTeams, isInitialized]);
  
  // 選択日付が未設定の場合は今日の日付を設定
  // useEffectを使用してレンダリング中の状態更新を避ける
  React.useEffect(() => {
    if (!selectedDate) {
      setSelectedDate(new Date().toISOString().split('T')[0])
    }
  }, [selectedDate, setSelectedDate])

  /**
   * 選択日付の練習記録をフィルタリング
   * タイムラインの投稿から練習記録のみを抽出
   */
  const practicesOnSelectedDate = selectedDate
    ? posts.filter(post => 
        post.type === 'practice' && 
        post.practiceData.date === selectedDate
      )
    : []
  
  /**
   * マイページ専用データの日付別フィルタリング
   * useMemoで最適化：依存配列の値が変わらない限り再計算しない
   * 
   * 各データタイプ（練習、動画、スケジュール等）を選択日付でフィルタリング
   * オプショナルチェイニングで存在しないデータに対する安全性を確保
   */
  const selectedDateData = useMemo(() => {
    if (!selectedDate) return { practices: [], videos: [], schedules: [], meals: [], supplements: [], sleep: [], diaries: [] }
    
    return {
      practices: (myPageData.practices || []).filter(p => p && p.date === selectedDate),
      videos: (myPageData.videos || []).filter(v => v && v.date === selectedDate),
      schedules: (myPageData.schedules || []).filter(s => s && s.date === selectedDate),
      meals: (myPageData.meals || []).filter(m => m && m.date === selectedDate),
      supplements: (myPageData.supplements || []).filter(s => s && s.date === selectedDate),
      sleep: (myPageData.sleep || []).filter(s => s && s.date === selectedDate),
      diaries: (myPageData.diaries || [])
    }
  }, [selectedDate, myPageData])
  
  /**
   * 練習記録を追加するハンドラー
   * 新しい練習データにユニークIDを付与して保存
   * 
   * @param {Object} practiceData - 練習データ
   */
  const handleAddPractice = (practiceData) => {
    console.log('handleAddPractice called with:', practiceData)
    
    // MyPageDataに追加
    setMyPageData(prev => {
      const newData = {
        ...prev,
        practices: [...(prev.practices || []), { ...practiceData, id: Date.now() }]
      }
      console.log('Updated myPageData:', newData)
      return newData
    })
    
    // タイムラインにも追加（練習記録として投稿）
    if (addPost) {
      const practiceCategories = {
        batting: '打撃練習',
        pitching: '投球練習',
        fielding: '守備練習',
        running: '走塁練習',
        training: 'トレーニング',
        stretch: 'ストレッチ',
        game: '試合',
        rest: '休養日'
      }
      
      addPost({
        type: 'practice',
        content: `${practiceData.category ? practiceCategories[practiceData.category] || '練習' : '練習'}を記録しました`,
        practiceData: practiceData
      })
    }
  }
  
  /**
   * 動画を追加するハンドラー
   * 
   * @param {Object} videoData - 動画データ（URL、タイトル、説明など）
   */
  const handleAddVideo = (videoData) => {
    setMyPageData(prev => ({
      ...prev,
      videos: [...prev.videos, { ...videoData, id: Date.now() }]
    }))
  }
  
  /**
   * スケジュールを追加するハンドラー
   * scheduleDataには既にIDが含まれているため、そのまま追加
   * 
   * @param {Object} scheduleData - スケジュールデータ
   */
  const handleAddSchedule = (scheduleData) => {
    setMyPageData(prev => ({
      ...prev,
      schedules: [...prev.schedules, scheduleData]
    }))
  }
  
  /**
   * 食事記録を追加するハンドラー
   * 初期状態でmealsが存在しない場合を考慮
   * 
   * @param {Object} mealData - 食事データ（カロリー、栄養素など）
   */
  const handleAddMeal = (mealData) => {
    setMyPageData(prev => ({
      ...prev,
      meals: [...(prev.meals || []), { ...mealData, id: Date.now() }]
    }))
  }
  
  /**
   * サプリメント記録を追加するハンドラー
   * 
   * @param {Object} supplementData - サプリメントデータ
   */
  const handleAddSupplement = (supplementData) => {
    setMyPageData(prev => ({
      ...prev,
      supplements: [...(prev.supplements || []), { ...supplementData, id: Date.now() }]
    }))
  }
  
  /**
   * 睡眠記録を追加するハンドラー
   * 
   * @param {Object} sleepData - 睡眠データ（就寝時間、起床時間、質など）
   */
  const handleAddSleep = (sleepData) => {
    setMyPageData(prev => ({
      ...prev,
      sleep: [...(prev.sleep || []), { ...sleepData, id: Date.now() }]
    }))
  }
  
  /**
   * 身体測定データを追加するハンドラー
   * 実際の保存はBodyMetricsFormコンポーネント内でLocalStorageに行われる
   * ここではログ出力のみ（将来的な拡張用）
   * 
   * @param {Object} metricsData - 身体測定データ（体重、体脂肪率など）
   */
  const handleAddBodyMetrics = (metricsData) => {
    // BodyMetricsFormコンポーネント内でlocalStorageに保存済み
    // ここでは必要に応じて追加の処理を行う
    console.log('Body metrics recorded:', metricsData)
  }

  /**
   * 日記関連のハンドラー
   */
  const handleSaveDiary = (diaryData) => {
    setMyPageData(prev => {
      const diaries = prev.diaries || []
      if (editingDiary) {
        // 編集の場合
        return {
          ...prev,
          diaries: diaries.map(d => d.id === diaryData.id ? diaryData : d)
        }
      } else {
        // 新規作成の場合
        return {
          ...prev,
          diaries: [...diaries, diaryData]
        }
      }
    })
    setShowDiaryForm(false)
    setEditingDiary(null)
  }

  const handleEditDiary = (diary) => {
    setEditingDiary(diary)
    setShowDiaryForm(true)
    setViewingDiary(null)
  }

  const handleDeleteDiary = (diaryId) => {
    setMyPageData(prev => ({
      ...prev,
      diaries: (prev.diaries || []).filter(d => d.id !== diaryId)
    }))
  }

  const handleViewDiary = (diary) => {
    setViewingDiary(diary)
  }

  /**
   * 試合記録関連のハンドラー
   */
  const handleSaveGame = (gameData) => {
    setMyPageData(prev => {
      const games = prev.games || []
      if (editingGame) {
        // 編集の場合
        return {
          ...prev,
          games: games.map(g => g.id === gameData.id ? gameData : g)
        }
      } else {
        // 新規作成の場合
        return {
          ...prev,
          games: [...games, gameData]
        }
      }
    })
    setShowGameRecord(false)
    setEditingGame(null)
  }

  const handleEditGame = (game) => {
    setEditingGame(game)
    setShowGameRecord(true)
  }

  const handleDeleteGame = (gameId) => {
    if (window.confirm('この試合記録を削除しますか？')) {
      setMyPageData(prev => ({
        ...prev,
        games: (prev.games || []).filter(g => g.id !== gameId)
      }))
    }
  }

  // コンポーネントのレンダリング
  return (
    <div className="mypage">
      <h2>📝 マイページ - 練習記録</h2>
      
      <div className="mypage-layout">
        <div className="mypage-main">
          {/* 練習カレンダー: 月間の練習記録表示 - 最上部に配置 */}
          <div className="practice-calendar-section">
            <h3>📅 練習カレンダー</h3>
            <PracticeCalendar
              practices={posts}
              onDateClick={(date) => {
                setSelectedDate(date)
                setShowPracticeForm(true)
              }}
              schedules={myPageData.schedules || []}
            />
          </div>
          
          
          {/* 所属チーム一覧 */}
          <div className="my-teams-section">
            <div className="section-header">
              <h3>🏟️ 所属チーム</h3>
              <button
                onClick={() => setShowTeamManagement(true)}
                className="btn-secondary"
              >
                チーム作成・参加
              </button>
            </div>
            
            {userTeams.length > 0 ? (
              <div className="teams-grid">
                {userTeams.map((teamData) => (
                  <div
                    key={teamData.id}
                    className="team-card"
                    onClick={() => {
                      console.log('Team card clicked:', teamData.name);
                      navigate('/teams');
                    }}
                  >
                    <h4>{teamData.name}</h4>
                    {teamData.description && (
                      <p className="team-description">{teamData.description}</p>
                    )}
                    <span className="team-role">
                      {TeamRoleLabels[teamData.membership.role]}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-teams">
                <p>まだチームに所属していません</p>
                <button
                  onClick={() => setShowTeamManagement(true)}
                  className="btn-primary"
                >
                  チームに参加する
                </button>
              </div>
            )}
          </div>
          
          {/* ルーティントラッカー: 日々の習慣を記録 */}
          <RoutineTracker />
          
          {/* 週次サマリー: 1週間の練習概要 */}
          <WeeklySummary practices={posts} />
          
          {/* 練習統計: 練習内容の集計・分析 */}
          <PracticeStats practices={posts} />
          
          {/* 身体測定チャート: 体重・体脂肪率等の推移 */}
          <BodyMetricsChart />
          
          {/* 月次統計: 月間の成績サマリー */}
          <MonthlyStats />
          
          {/* 栄養チャート: 食事・サプリメントの栄養分析 */}
          {/* データが存在する場合のみ表示（条件付きレンダリング） */}
          {((myPageData.meals && myPageData.meals.length > 0) || 
            (myPageData.supplements && myPageData.supplements.length > 0)) && (
            <NutritionChart 
              meals={myPageData.meals || []} 
              supplements={myPageData.supplements || []} 
            />
          )}
          
          {/* 選択日付の全記録: 日別の詳細データ表示 */}
          {selectedDate && (
            <div className="selected-date-records">
              <h3>{selectedDate} の記録</h3>
              <DailyRecords
                date={selectedDate}
                practices={selectedDateData.practices}
                videos={selectedDateData.videos}
                schedules={selectedDateData.schedules}
                meals={selectedDateData.meals}
                supplements={selectedDateData.supplements}
                sleep={selectedDateData.sleep}
              />
            </div>
          )}
          
          {/* 今後の予定: 未来のスケジュール一覧 */}
          <div className="upcoming-schedules">
            <h3>📅 今後の予定</h3>
            {(() => {
              // 今日の日付を取得（時刻を0:00にリセット）
              const today = new Date()
              today.setHours(0, 0, 0, 0)
              
              /**
               * 今後の予定をフィルタリング・ソート・制限
               * 1. 今日以降の予定のみ抽出
               * 2. 日付順（昇順）でソート
               * 3. 最大10件に制限
               */
              const upcomingSchedules = myPageData.schedules
                .filter(schedule => {
                  const scheduleDate = new Date(schedule.date || schedule.startDate)
                  return scheduleDate >= today
                })
                .sort((a, b) => {
                  const dateA = new Date(a.date || a.startDate)
                  const dateB = new Date(b.date || b.startDate)
                  return dateA - dateB // 日付の早い順
                })
                .slice(0, 10) // 最大10件
              
              // 予定がない場合のメッセージ
              if (upcomingSchedules.length === 0) {
                return <p className="no-schedules">予定がありません</p>
              }
              
              // 予定一覧の表示
              return (
                <div className="schedule-list">
                  {upcomingSchedules.map(schedule => (
                    <div key={schedule.id} className="schedule-list-item">
                      {/* 日付表示（日本語フォーマット） */}
                      <div className="schedule-date">
                        {new Date(schedule.date || schedule.startDate).toLocaleDateString('ja-JP', {
                          month: 'long',  // 「1月」のような表示
                          day: 'numeric', // 日付の数字
                          weekday: 'short' // 「月」「火」などの曜日
                        })}
                      </div>
                      {/* スケジュール詳細コンポーネント */}
                      <ScheduleItem schedule={schedule} />
                    </div>
                  ))}
                </div>
              )
            })()}
          </div>
          
          {/* 最近の練習記録: タイムラインからの最新5件 */}
          <div className="recent-practices">
            <h3>最近の練習記録</h3>
            {posts.length > 0 ? (
              // 最新5件の練習記録を表示
              posts.slice(0, 5).map(practice => (
                <div key={practice.id} className="practice-detail">
                  <PracticeRecord practiceData={practice.practiceData} />
                </div>
              ))
            ) : (
              // 練習記録がない場合の案内メッセージ
              <p className="no-practices">
                まだ練習記録がありません。
                <br />
                タイムラインから練習記録を投稿してみましょう！
              </p>
            )}
          </div>
          
          {/* 日記セクション */}
          <div className="diary-section">
            <div className="section-header">
              <h3>📓 野球日記</h3>
              <button
                onClick={() => {
                  setEditingDiary(null)
                  setShowDiaryForm(true)
                }}
                className="btn-primary"
              >
                日記を書く
              </button>
            </div>
            
            <DiaryList
              diaries={selectedDateData.diaries}
              onEdit={handleEditDiary}
              onDelete={handleDeleteDiary}
              onView={handleViewDiary}
            />
          </div>
          
          {/* 試合記録セクション */}
          <div className="game-record-section">
            <div className="section-header">
              <h3>⚾ 試合記録</h3>
              <button
                onClick={() => {
                  setEditingGame(null)
                  setShowGameRecord(true)
                }}
                className="btn-primary"
              >
                試合記録を追加
              </button>
            </div>
            
            <GameRecordList
              records={myPageData.games || []}
              onEdit={handleEditGame}
              onDelete={handleDeleteGame}
            />
          </div>
          
          {/* 成績推移グラフ */}
          <PerformanceChart
            games={myPageData.games || []}
            practices={myPageData.practices || []}
          />
        </div>
      </div>
      
      {/* チーム管理モーダル */}
      {showTeamManagement && (
        <TeamManagement
          onClose={() => setShowTeamManagement(false)}
          onTeamCreated={(newTeam) => {
            setShowTeamManagement(false)
            // 成功メッセージを表示
            if (newTeam) {
              alert(`チーム「${newTeam.name}」を作成しました！\n招待コード: ${newTeam.inviteCode}`)
            }
            // チーム一覧を更新
            setTimeout(() => {
              window.location.reload()
            }, 100)
          }}
        />
      )}
      
      {/* 日記フォームモーダル */}
      {showDiaryForm && (
        <div className="modal-overlay" onClick={() => setShowDiaryForm(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <DiaryForm
              onSave={handleSaveDiary}
              onCancel={() => {
                setShowDiaryForm(false)
                setEditingDiary(null)
              }}
              editingDiary={editingDiary}
            />
          </div>
        </div>
      )}
      
      {/* 試合記録フォームモーダル */}
      {showGameRecord && (
        <div className="modal-overlay" onClick={() => setShowGameRecord(false)}>
          <div className="modal-content game-record-modal" onClick={(e) => e.stopPropagation()}>
            <GameRecord
              onSave={handleSaveGame}
              onCancel={() => {
                setShowGameRecord(false)
                setEditingGame(null)
              }}
              initialData={editingGame}
            />
          </div>
        </div>
      )}
      
      {/* 練習記録フォームモーダル */}
      {showPracticeForm && (
        <div className="modal-overlay" onClick={() => setShowPracticeForm(false)}>
          <div className="modal-content practice-form-modal" onClick={(e) => e.stopPropagation()}>
            <PracticeForm
              selectedDate={selectedDate}
              onClose={() => setShowPracticeForm(false)}
              onSubmit={(practiceData) => {
                handleAddPractice(practiceData)
                setShowPracticeForm(false)
              }}
            />
          </div>
        </div>
      )}
      
      
      {/* 日記詳細モーダル */}
      {viewingDiary && (
        <DiaryView
          diary={viewingDiary}
          onClose={() => setViewingDiary(null)}
          onEdit={handleEditDiary}
        />
      )}
    </div>
  )
}

export default MyPage