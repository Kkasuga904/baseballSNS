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
import { useAuth } from '../App'
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
 * @param {Function} props.setMyPageData - マイページデータを更新する関数
 * @param {string} props.selectedDate - 選択中の日付（YYYY-MM-DD形式）
 * @param {Function} props.setSelectedDate - 選択日付を更新する関数
 */
function MyPage({ posts, myPageData, setMyPageData, selectedDate, setSelectedDate }) {
  // 認証情報を取得
  const { user } = useAuth()
  
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
    if (!selectedDate) return { practices: [], videos: [], schedules: [], meals: [], supplements: [], sleep: [] }
    
    return {
      practices: (myPageData.practices || []).filter(p => p && p.date === selectedDate),
      videos: (myPageData.videos || []).filter(v => v && v.date === selectedDate),
      schedules: (myPageData.schedules || []).filter(s => s && s.date === selectedDate),
      meals: (myPageData.meals || []).filter(m => m && m.date === selectedDate),
      supplements: (myPageData.supplements || []).filter(s => s && s.date === selectedDate),
      sleep: (myPageData.sleep || []).filter(s => s && s.date === selectedDate)
    }
  }, [selectedDate, myPageData])
  
  /**
   * 練習記録を追加するハンドラー
   * 新しい練習データにユニークIDを付与して保存
   * 
   * @param {Object} practiceData - 練習データ
   */
  const handleAddPractice = (practiceData) => {
    setMyPageData(prev => ({
      ...prev,
      practices: [...prev.practices, { ...practiceData, id: Date.now() }]
    }))
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

  // コンポーネントのレンダリング
  return (
    <div className="mypage">
      <h2>📝 マイページ - 練習記録</h2>
      
      <div className="mypage-layout">
        <div className="mypage-main">
          {/* ルーティントラッカー: 日々の習慣を記録 */}
          <RoutineTracker />
          
          {/* 日別記録タブ: 各種データの入力フォーム */}
          {selectedDate && (
            <DailyRecordTabs
              selectedDate={selectedDate}
              onAddPractice={handleAddPractice}
              onAddVideo={handleAddVideo}
              onAddSchedule={handleAddSchedule}
              onAddMeal={handleAddMeal}
              onAddSupplement={handleAddSupplement}
              onAddSleep={handleAddSleep}
              onAddBodyMetrics={handleAddBodyMetrics}
            />
          )}
          
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
        </div>
      </div>
    </div>
  )
}

export default MyPage