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

import React, { useState, useMemo, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
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
import SimpleDiaryForm from '../components/SimpleDiaryForm'
import SimpleDiaryList from '../components/SimpleDiaryList'
import GameRecord from '../components/GameRecord'
import storageService from '../services/storageService'
import GameRecordList from '../components/GameRecordList'
import PerformanceChart from '../components/PerformanceChart'
import PracticeCalendar from '../components/PracticeCalendar'
import PracticeForm from '../components/PracticeForm'
import MeasurementsContent from '../components/MeasurementsContent'
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
  const { user } = useAuth() // signOutは不要
  const navigate = useNavigate()
  const location = useLocation()
  const { getUserTeams, isInitialized } = useTeam()
  const [showTeamManagement, setShowTeamManagement] = useState(false)
  const [showDiaryForm, setShowDiaryForm] = useState(false)
  const [showGameRecord, setShowGameRecord] = useState(false)
  const [editingGame, setEditingGame] = useState(null)
  const [showPracticeForm, setShowPracticeForm] = useState(false)
  const [activeTab, setActiveTab] = useState(() => {
    // 初期タブをURLパラメータから設定
    const params = new URLSearchParams(location.search)
    const tab = params.get('tab')
    if (tab === 'home' || tab === 'install') {
      return 'home'
    } else if (tab) {
      return tab
    }
    return 'diary'
  })
  
  // URLパラメータからタブを設定
  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const tab = params.get('tab')
    if (tab === 'home' || tab === 'install') {
      setActiveTab('home')
    } else if (tab) {
      setActiveTab(tab)
    } else {
      setActiveTab('diary')
    }
  }, [location.search])
  
  // コンポーネントマウント時にLocalStorageからデータを読み込む
  useEffect(() => {
    const loadedDiaries = storageService.loadDiaries()
    const loadedPracticeRecords = storageService.loadPracticeRecords()
    
    setMyPageData(prev => ({
      ...prev,
      diaries: loadedDiaries,
      practiceRecords: loadedPracticeRecords
    }))
  }, [])
  
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
   * ログアウト処理（デバイス認証では不要）
   */
  /*
  const handleSignOut = async () => {
    await signOut()
    navigate('/login')
  }
  */
  
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
    
    // MyPageDataに追加
    setMyPageData(prev => {
      const newPractice = { ...practiceData, id: Date.now() }
      const updatedPractices = [...(prev.practices || []), newPractice]
      
      // LocalStorageに保存（日付ごとの練習記録として）
      if (practiceData.date) {
        storageService.savePracticeRecord(practiceData.date, newPractice)
      }
      
      const newData = {
        ...prev,
        practices: updatedPractices
      }
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
  }

  /**
   * 日記関連のハンドラー
   */
  const handleSaveDiary = (diaryData) => {
    setMyPageData(prev => {
      const diaries = prev.diaries || []
      const updatedDiaries = [...diaries, diaryData]
      
      // LocalStorageに保存
      storageService.saveDiaries(updatedDiaries)
      
      return {
        ...prev,
        diaries: updatedDiaries
      }
    })
    setShowDiaryForm(false)
  }

  const handleDeleteDiary = (diaryId) => {
    if (window.confirm('この日記を削除しますか？')) {
      setMyPageData(prev => {
        const updatedDiaries = (prev.diaries || []).filter(d => d.id !== diaryId)
        
        // LocalStorageから削除
        storageService.deleteDiary(diaryId)
        
        return {
          ...prev,
          diaries: updatedDiaries
        }
      })
    }
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
      {/* タブナビゲーション */}
      <div className="tab-navigation">
        <button 
          className={`tab-button ${activeTab === 'diary' ? 'active' : ''}`}
          onClick={() => setActiveTab('diary')}
        >
          📝 Diary
        </button>
        <button 
          className={`tab-button ${activeTab === 'calendar' ? 'active' : ''}`}
          onClick={() => setActiveTab('calendar')}
        >
          📅 Calendar
        </button>
        <button 
          className={`tab-button ${activeTab === 'stats' ? 'active' : ''}`}
          onClick={() => setActiveTab('stats')}
        >
          📊 身体測定・記録管理
        </button>
        <button 
          className={`tab-button ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          ⚙️ 設定
        </button>
      </div>
      
      <div className="mypage-layout">
        <div className="mypage-main">
          {/* タブコンテンツ */}
          {activeTab === 'home' && (
            <div className="home-section">
              <div className="install-guide">
                <h2>📱 ホーム画面に追加</h2>
                <p className="install-subtitle">BaseLogをアプリのように使えます</p>
                
                <div className="install-instructions">
                  <h3>ホーム画面に追加するには：</h3>
                  <ol className="install-steps">
                    <li>下部の共有ボタン <span className="icon-box">□↑</span> をタップ</li>
                    <li>「ホーム画面に追加」を選択</li>
                    <li>「追加」をタップ</li>
                  </ol>
                  
                  <div className="install-note">
                    <p>※ Safariブラウザでアクセスしてください</p>
                    <p>※ Androidの場合はChromeのメニュー <span className="icon-box">⋮</span> から追加できます</p>
                  </div>
                  
                  <div className="install-benefits">
                    <h4>✨ メリット</h4>
                    <ul>
                      <li>アプリアイコンから直接起動</li>
                      <li>全画面表示で使いやすい</li>
                      <li>通知機能対応（今後実装予定）</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'diary' && (
            <>
              {/* 練習記録フォームへのボタン - 日記アプリなので非表示 */}
              {/* <div className="diary-section">
                <div className="section-header">
                  <h3>📝 練習記録</h3>
                  <button 
                    onClick={() => setShowPracticeForm(true)}
                    className="btn-primary"
                  >
                    ＋ 新しい練習を記録
                  </button>
                </div>
                
                <div className="recent-practices">
                  <h4>最近の練習記録</h4>
                  {posts.filter(p => p.type === 'practice').length > 0 ? (
                    posts
                      .filter(p => p.type === 'practice')
                      .slice(0, 5)
                      .map(practice => (
                        <div key={practice.id} className="practice-detail">
                          <PracticeRecord practiceData={practice.practiceData} />
                        </div>
                      ))
                  ) : (
                    <p>練習記録がありません</p>
                  )}
                </div>
              </div> */}
              
              {/* 日記リスト */}
              <SimpleDiaryList
                diaries={myPageData.diaries || []}
                onDelete={handleDeleteDiary}
              />
              
              {/* フローティングアクションボタン */}
              <button
                className="diary-fab"
                onClick={() => setShowDiaryForm(true)}
                title="日記を書く"
              >
                <span className="fab-icon">✏️</span>
              </button>
              
              {/* 試合記録セクション - 日記アプリなので非表示 */}
              {/* <div className="game-record-section">
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
              </div> */}
            </>
          )}
          
          {activeTab === 'calendar' && (
            <div className="practice-calendar-section">
              <h3>📅 練習カレンダー</h3>
              <PracticeCalendar
                practices={posts}
                onDateClick={(date) => {
                  setSelectedDate(date)
                  setShowDiaryForm(true)
                }}
                schedules={myPageData.schedules || []}
              />
            </div>
          )}
          
          {activeTab === 'stats' && (
            <div className="stats-section">
              <MeasurementsContent />
            </div>
          )}
          
          {activeTab === 'settings' && (
            <div className="settings-section">
              <h3>⚙️ 設定</h3>
              <div className="settings-content">
                <div className="setting-item">
                  <h4>📱 ホーム画面に追加</h4>
                  <p>BaseLogをアプリのように使えます</p>
                  <button 
                    className="btn-primary"
                    onClick={() => navigate('/install')}
                  >
                    インストール方法を見る
                  </button>
                </div>
                <div className="setting-item">
                  <h4>アカウント設定</h4>
                  <p>メールアドレス: {user?.email}</p>
                </div>
                <div className="setting-item">
                  <h4>データエクスポート</h4>
                  <button className="btn-secondary">
                    練習データをダウンロード
                  </button>
                </div>
                {/* デバイス認証では、ログアウトは不要 */}
                {/* 
                <div className="setting-item">
                  <h4>ログアウト</h4>
                  <button 
                    onClick={handleSignOut}
                    className="btn-danger"
                  >
                    ログアウト
                  </button>
                </div>
                */}
              </div>
            </div>
          )}
          
          
          {/* 所属チーム一覧 - MVP段階では不要 */}
          {/* <div className="my-teams-section">
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
          </div> */}
          
          {/* ルーティントラッカー: 日々の習慣を記録 - MVP段階では不要 */}
          {/* <RoutineTracker /> */}
          
          {/* 週次サマリー: 1週間の練習概要 - MVP段階では不要 */}
          {/* <WeeklySummary practices={posts} /> */}
          
          {/* 練習統計: 練習内容の集計・分析 - MVP段階では不要 */}
          {/* <PracticeStats practices={posts} /> */}
          
          {/* 身体測定チャート: 体重・体脂肪率等の推移 - MVP段階では不要 */}
          {/* <BodyMetricsChart /> */}
          
          {/* 月次統計: 月間の成績サマリー - MVP段階では不要 */}
          {/* <MonthlyStats /> */}
          
          {/* 栄養チャート: 食事・サプリメントの栄養分析 - MVP段階では不要 */}
          {/* {((myPageData.meals && myPageData.meals.length > 0) || 
            (myPageData.supplements && myPageData.supplements.length > 0)) && (
            <NutritionChart 
              meals={myPageData.meals || []} 
              supplements={myPageData.supplements || []} 
            />
          )} */}
          
          {/* 選択日付の全記録: 日別の詳細データ表示 - MVP段階では不要 */}
          {/* {selectedDate && (
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
          )} */}
          
          {/* 今後の予定: 未来のスケジュール一覧 - MVP段階では不要 */}
          {/* <div className="upcoming-schedules">
            <h3>📅 今後の予定</h3>
            {(() => {
              // 今日の日付を取得（時刻を0:00にリセット）
              const today = new Date()
              today.setHours(0, 0, 0, 0)
              
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
                      <div className="schedule-date">
                        {new Date(schedule.date || schedule.startDate).toLocaleDateString('ja-JP', {
                          month: 'long',  // 「1月」のような表示
                          day: 'numeric', // 日付の数字
                          weekday: 'short' // 「月」「火」などの曜日
                        })}
                      </div>
                      <ScheduleItem schedule={schedule} />
                    </div>
                  ))}
                </div>
              )
            })()}
          </div> */}
          
          {/* 最近の練習記録: タイムラインからの最新5件 - MVP段階では不要 */}
          {/* <div className="recent-practices">
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
          </div> */}
          
          {/* 日記セクション - MVP段階では不要 */}
          {/* <div className="diary-section">
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
          </div> */}
          
          {/* 試合記録セクション - MVP段階では不要 */}
          {/* <div className="game-record-section">
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
          </div> */}
          
          {/* 成績推移グラフ - MVP段階では不要 */}
          {/* <PerformanceChart
            games={myPageData.games || []}
            practices={myPageData.practices || []}
          /> */}
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
      
      {/* 日記フォーム */}
      {showDiaryForm && (
        <SimpleDiaryForm
          onSave={handleSaveDiary}
          onCancel={() => setShowDiaryForm(false)}
          selectedDate={selectedDate}
        />
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
    </div>
  )
}

export default MyPage