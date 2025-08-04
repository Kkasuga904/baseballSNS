/**
 * TeamsPage.jsx - チーム一覧・管理ページ
 * 
 * ユーザーの所属チーム一覧を表示し、各チームの詳細情報や機能にアクセスできるページです。
 */

import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../App'
import { useTeam } from '../contexts/TeamContext'
import { TeamRoleLabels } from '../models/team'
import TeamManagement from '../components/TeamManagement'
import './TeamsPage.css'

function TeamsPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { getUserTeams, isInitialized, forceReload, updateTeamWiki } = useTeam()
  const [showTeamManagement, setShowTeamManagement] = useState(false)
  const [selectedTeam, setSelectedTeam] = useState(null)
  const [editingWiki, setEditingWiki] = useState(false)
  const [wikiContent, setWikiContent] = useState('')

  // ページ読み込み時にデータを強制更新
  React.useEffect(() => {
    console.log('[TeamsPage] Force reloading team data...')
    forceReload()
  }, [])

  // selectedTeamの変化を監視
  React.useEffect(() => {
    console.log('[TeamsPage] selectedTeam changed:', selectedTeam)
  }, [selectedTeam])

  // ユーザーの所属チーム一覧を取得
  const userTeams = React.useMemo(() => {
    console.log('[TeamsPage] Getting user teams...', { user, isInitialized })
    if (!isInitialized || !user) {
      return []
    }
    const teams = getUserTeams(user) || []
    console.log('[TeamsPage] User teams:', teams)
    
    // テスト用: チームがない場合はダミーデータを追加
    if (teams.length === 0) {
      console.log('[TeamsPage] No teams found, adding dummy data for testing')
      return [
        {
          id: 'dummy_team_1',
          name: '新神田ウイングス',
          description: '東京都千代田区を拠点とする社会人野球チーム',
          membership: {
            role: 'coach',
            joinedAt: '2024-01-01T00:00:00.000Z'
          },
          inviteCode: 'WINGS123',
          wikiText: `# 新神田ウイングス Wiki

## 📅 今月のスケジュール
### 練習予定
- 毎週土曜日 9:00-12:00 @千代田区総合グラウンド
- 毎週日曜日 13:00-16:00 @皇居外苑球場

### 試合予定
- 8/10(土) 10:00 vs 港区イーグルス @千代田区総合グラウンド
- 8/17(土) 14:00 vs 新宿ファイターズ @新宿中央公園球場
- 8/24(土) 10:00 vs 品川シャークス @品川区民球場

## 🎯 今月の目標
- [ ] チーム打率 .280以上
- [ ] 守備率 .960以上
- [ ] 盗塁成功率 75%以上

## 📋 役割分担

### 🏟️ 設営・撤収
**グラウンド準備係**
- 田中太郎（メイン）
- 佐藤次郎（サブ）

**荷物運搬係** 
- 山田三郎（道具一式担当）
- 鈴木四郎（救急セット・飲み物担当）
- 高橋五郎（バット・ボール担当）

### ⚾ 練習・試合運営
**スコアラー**
- 伊藤花子（メイン）
- 渡辺美咲（サブ）

**審判係**
- 中村健一
- 小林誠二

### 📢 連絡・広報
**連絡係**
- 加藤里美（LINE管理）
- 木村真司（メール配信）

## 📝 サイン・戦術メモ

### 攻撃サイン
- 右手を帽子に → バント
- 左手を胸に → エンドラン
- 両手を組む → ヒットエンドラン
- ベルトを触る → 盗塁

### 守備サイン
- 右手を上げる → 前進守備
- 左手を上げる → 後進守備
- 両手でバツ → バント警戒
- 手を叩く → ダブルプレー狙い

### ベンチサイン
- 帽子を取る → 代打準備
- タオルを振る → 代走準備
- 手を叩く → 投手交代

## 💡 注意事項・ルール
- 練習開始30分前集合厳守
- 用具の後片付けは全員で協力
- 怪我の場合は即座に監督・コーチに報告
- 雨天中止の連絡は前日20時までにLINEで
- 駐車場は第2駐車場を利用

## 📞 緊急連絡先
- 監督（田中）: 090-1234-5678
- コーチ（佐藤）: 080-9876-5432
- マネージャー（伊藤）: 070-1111-2222
- 救急: 119
- 千代田区総合グラウンド管理事務所: 03-1234-5678`
        },
        {
          id: 'dummy_team_2',
          name: '星稜大野球部',
          description: '金沢市を拠点とする大学野球チーム',
          membership: {
            role: 'admin',
            joinedAt: '2024-01-01T00:00:00.000Z'
          },
          inviteCode: 'SEIRYO24',
          wikiText: `# 星稜大野球部 Wiki

## 📅 今月のスケジュール
### 練習予定
- 月〜金 16:00-19:00 @星稜大学野球場
- 土日 9:00-17:00 @星稜大学野球場

### 試合予定（北陸大学野球リーグ）
- 8/11(日) 13:00 vs 金沢大学 @石川県立野球場
- 8/18(日) 10:00 vs 福井工業大学 @福井県営球場
- 8/25(日) 13:00 vs 富山大学 @富山市民球場

## 📋 役割分担

### 荷物運搬当番（週替わり）
**今週（8/5-8/11）**
- 1年生A班: ボール・バット
- 1年生B班: キャッチャー道具・審判道具
- 2年生: 救急セット・飲み物

**来週（8/12-8/18）**
- 1年生B班: ボール・バット
- 1年生C班: キャッチャー道具・審判道具
- 2年生: 救急セット・飲み物

## 💡 部則・ルール
- 練習開始1時間前にグラウンド整備
- 学業優先（単位不足者は練習制限）
- 寮生は22時門限厳守
- 部室の清掃は1年生が担当`
        }
      ]
    }
    
    return teams
  }, [getUserTeams, user, isInitialized])

  // チーム統計を取得（ダミーデータ）
  const getTeamStats = (teamId) => {
    return {
      totalMembers: Math.floor(Math.random() * 20) + 5,
      practicesThisWeek: Math.floor(Math.random() * 5),
      gamesThisMonth: Math.floor(Math.random() * 4),
      lastActivity: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toLocaleDateString('ja-JP')
    }
  }

  // Wiki編集開始
  const handleEditWiki = () => {
    setWikiContent(selectedTeam.wikiText || getDefaultWikiContent())
    setEditingWiki(true)
  }

  // Wiki保存
  const handleSaveWiki = async () => {
    try {
      await updateTeamWiki(selectedTeam.id, wikiContent)
      setEditingWiki(false)
      // チームデータを更新
      const updatedTeam = { ...selectedTeam, wikiText: wikiContent }
      setSelectedTeam(updatedTeam)
      alert('Wikiを更新しました！')
    } catch (error) {
      alert('Wiki更新に失敗しました: ' + error.message)
    }
  }

  // デフォルトWikiコンテンツ
  const getDefaultWikiContent = () => {
    return `# ${selectedTeam?.name || 'チーム'} Wiki

## 📅 今月のスケジュール
### 練習予定
- 毎週土曜日 9:00-12:00 @○○グラウンド
- 毎週日曜日 13:00-16:00 @○○球場

### 試合予定
- 8/15(土) 10:00 vs ○○チーム @○○球場
- 8/22(土) 14:00 vs △△チーム @△△グラウンド

## 🎯 今月の目標
- [ ] チーム打率 .300以上
- [ ] 守備率 .950以上
- [ ] 全員出席率 80%以上

## 📋 役割分担

### 🏟️ 設営・撤収
**グラウンド準備係**
- 田中さん（メイン）
- 佐藤さん（サブ）

**荷物運搬係** 
- 山田さん（道具一式）
- 鈴木さん（救急セット・飲み物）

### ⚾ 練習・試合運営
**スコアラー**
- 高橋さん（メイン）
- 渡辺さん（サブ）

**審判係**
- 伊藤さん
- 加藤さん

### 📢 連絡・広報
**連絡係**
- 中村さん（LINE管理）
- 小林さん（メール配信）

## 📝 サイン・戦術メモ

### 攻撃サイン
- 右手を帽子に → バント
- 左手を胸に → エンドラン
- 両手を組む → ヒットエンドラン

### 守備サイン
- 右手を上げる → 前進守備
- 左手を上げる → 後進守備
- 両手でバツ → バント警戒

### ベンチサイン
- 帽子を取る → 代打
- タオルを振る → 代走
- 手を叩く → 投手交代

## 💡 注意事項・ルール
- 練習開始30分前集合
- 用具の後片付けは全員で
- 怪我の場合は即座に報告
- 雨天中止の連絡は前日20時まで

## 📞 緊急連絡先
- 監督: 090-1234-5678
- コーチ: 080-9876-5432
- 救急: 119

---
*最終更新: ${new Date().toLocaleDateString('ja-JP')}*`
  }

  // ダミースケジュールデータ
  const getTeamSchedule = () => {
    const today = new Date()
    const schedules = []
    
    // 今後2週間のスケジュールを生成
    for (let i = 1; i <= 14; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() + i)
      
      // 土日に練習・試合を設定
      if (date.getDay() === 0 || date.getDay() === 6) {
        const isGame = Math.random() > 0.7 // 30%の確率で試合
        schedules.push({
          id: `schedule_${i}`,
          date: date.toISOString().split('T')[0],
          type: isGame ? 'game' : 'practice',
          title: isGame ? `vs ${['○○チーム', '△△チーム', '□□チーム'][Math.floor(Math.random() * 3)]}` : '練習',
          time: isGame ? '10:00-' : '9:00-12:00',
          location: isGame ? '○○球場' : '○○グラウンド',
          description: isGame ? '公式戦' : '基礎練習・実戦練習'
        })
      }
    }
    
    return schedules
  }

  return (
    <div className="teams-page">
      <div className="teams-container">
        <div className="page-header">
          <h1>🏟️ チーム</h1>
          <p className="page-description">
            所属チームの管理と詳細情報を確認できます
          </p>
        </div>

        {/* チーム作成・参加ボタン */}
        <div className="team-actions-header">
          <button
            onClick={() => setShowTeamManagement(true)}
            className="btn-primary create-team-btn"
          >
            ➕ チーム作成・参加
          </button>
        </div>

        {/* 所属チーム一覧 */}
        {console.log('[TeamsPage] Rendering teams. Count:', userTeams.length, 'Teams:', userTeams)}
        {userTeams.length > 0 ? (
          <div className="teams-grid">
            {userTeams.map((teamData) => {
              const stats = getTeamStats(teamData.id)
              return (
                <div key={teamData.id} className="team-card-large">
                  <div className="team-card-header">
                    <div className="team-info">
                      <h3>{teamData.name}</h3>
                      {teamData.description && (
                        <p className="team-description">{teamData.description}</p>
                      )}
                    </div>
                    <div className="team-role-badge">
                      {TeamRoleLabels[teamData.membership.role]}
                    </div>
                  </div>

                  <div className="team-stats">
                    <div className="stat-item">
                      <span className="stat-value">{stats.totalMembers}</span>
                      <span className="stat-label">メンバー</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-value">{stats.practicesThisWeek}</span>
                      <span className="stat-label">今週の練習</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-value">{stats.gamesThisMonth}</span>
                      <span className="stat-label">今月の試合</span>
                    </div>
                  </div>

                  <div className="team-actions">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        console.log('チーム統計ボタンがクリックされました:', teamData.name)
                        setSelectedTeam(teamData)
                        console.log('selectedTeamを設定しました:', teamData)
                      }}
                      className="team-action-btn primary"
                    >
                      📊 チーム統計
                    </button>
                    <button
                      onClick={() => navigate(`/team/${teamData.id}/members`)}
                      className="team-action-btn"
                    >
                      👥 メンバー
                    </button>
                    <button
                      onClick={() => navigate(`/team/${teamData.id}/schedule`)}
                      className="team-action-btn"
                    >
                      📅 スケジュール
                    </button>
                    <button
                      onClick={() => navigate(`/team/${teamData.id}/practice`)}
                      className="team-action-btn"
                    >
                      ⚾ 練習記録
                    </button>
                    {(teamData.membership.role === 'admin' || teamData.membership.role === 'coach') && (
                      <button
                        onClick={() => navigate(`/team/${teamData.id}/manage`)}
                        className="team-action-btn admin"
                      >
                        ⚙️ 管理
                      </button>
                    )}
                  </div>

                  <div className="team-meta">
                    <span className="join-date">
                      参加日: {new Date(teamData.membership.joinedAt).toLocaleDateString('ja-JP')}
                    </span>
                    <span className="last-activity">
                      最終活動: {stats.lastActivity}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="no-teams">
            <div className="no-teams-content">
              <span className="no-teams-icon">🏟️</span>
              <h3>まだチームに参加していません</h3>
              <p>チームを作成するか、既存のチームに参加してみましょう</p>
              <button
                onClick={() => setShowTeamManagement(true)}
                className="btn-primary"
              >
                チーム作成・参加
              </button>
            </div>
          </div>
        )}

        {/* チーム詳細セクション */}
        {selectedTeam && (
          console.log('[TeamsPage] Rendering team details for:', selectedTeam.name),
          <div className="team-details-expanded">
            <div className="section-header">
              <h2>🏟️ {selectedTeam.name} チーム詳細</h2>
              <button
                onClick={() => setSelectedTeam(null)}
                className="close-btn"
              >
                ×
              </button>
            </div>
            
            <div className="team-details-content">
              {/* チーム基本情報 */}
              <div className="team-info-section">
                <h3>📋 基本情報</h3>
                <div className="info-grid">
                  <div className="info-item">
                    <label>チーム名:</label>
                    <span>{selectedTeam.name}</span>
                  </div>
                  {selectedTeam.description && (
                    <div className="info-item">
                      <label>説明:</label>
                      <span>{selectedTeam.description}</span>
                    </div>
                  )}
                  <div className="info-item">
                    <label>あなたの役割:</label>
                    <span className="role-badge">
                      {TeamRoleLabels[selectedTeam.membership.role]}
                    </span>
                  </div>
                  <div className="info-item">
                    <label>参加日:</label>
                    <span>
                      {new Date(selectedTeam.membership.joinedAt).toLocaleDateString('ja-JP')}
                    </span>
                  </div>
                  <div className="info-item">
                    <label>招待コード:</label>
                    <span className="invite-code">{selectedTeam.inviteCode}</span>
                  </div>
                </div>
              </div>
              
              {/* チーム統計詳細 */}
              <div className="team-stats-detailed">
                <h3>📊 詳細統計</h3>
                <div className="stats-grid-detailed">
                  <div className="stat-card">
                    <div className="stat-header">
                      <span className="stat-icon">👥</span>
                      <span className="stat-title">メンバー構成</span>
                    </div>
                    <div className="stat-content">
                      <div className="stat-row">
                        <span>総メンバー数:</span>
                        <span className="stat-number">{getTeamStats(selectedTeam.id).totalMembers}</span>
                      </div>
                      <div className="stat-row">
                        <span>アクティブメンバー:</span>
                        <span className="stat-number">{Math.floor(getTeamStats(selectedTeam.id).totalMembers * 0.8)}</span>
                      </div>
                      <div className="stat-row">
                        <span>コーチ・スタッフ:</span>
                        <span className="stat-number">{Math.floor(getTeamStats(selectedTeam.id).totalMembers * 0.1)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="stat-card">
                    <div className="stat-header">
                      <span className="stat-icon">⚾</span>
                      <span className="stat-title">練習・活動</span>
                    </div>
                    <div className="stat-content">
                      <div className="stat-row">
                        <span>今週の練習回数:</span>
                        <span className="stat-number">{getTeamStats(selectedTeam.id).practicesThisWeek}</span>
                      </div>
                      <div className="stat-row">
                        <span>今月の練習回数:</span>
                        <span className="stat-number">{getTeamStats(selectedTeam.id).practicesThisWeek * 4}</span>
                      </div>
                      <div className="stat-row">
                        <span>平均練習時間:</span>
                        <span className="stat-number">2.5時間</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="stat-card">
                    <div className="stat-header">
                      <span className="stat-icon">🏆</span>
                      <span className="stat-title">試合成績</span>
                    </div>
                    <div className="stat-content">
                      <div className="stat-row">
                        <span>今月の試合数:</span>
                        <span className="stat-number">{getTeamStats(selectedTeam.id).gamesThisMonth}</span>
                      </div>
                      <div className="stat-row">
                        <span>勝利数:</span>
                        <span className="stat-number">{Math.floor(getTeamStats(selectedTeam.id).gamesThisMonth * 0.6)}</span>
                      </div>
                      <div className="stat-row">
                        <span>勝率:</span>
                        <span className="stat-number">60%</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="stat-card">
                    <div className="stat-header">
                      <span className="stat-icon">📈</span>
                      <span className="stat-title">パフォーマンス</span>
                    </div>
                    <div className="stat-content">
                      <div className="stat-row">
                        <span>チーム打率:</span>
                        <span className="stat-number">.285</span>
                      </div>
                      <div className="stat-row">
                        <span>チーム防御率:</span>
                        <span className="stat-number">3.42</span>
                      </div>
                      <div className="stat-row">
                        <span>最終活動:</span>
                        <span className="stat-number">{getTeamStats(selectedTeam.id).lastActivity}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* チーム機能アクセス */}
              <div className="team-functions">
                <h3>🛠️ チーム機能</h3>
                <div className="function-grid">
                  <button
                    onClick={() => navigate(`/team/${selectedTeam.id}/members`)}
                    className="function-btn"
                  >
                    <span className="function-icon">👥</span>
                    <div className="function-info">
                      <span className="function-title">メンバー管理</span>
                      <span className="function-desc">メンバー一覧・役割変更</span>
                    </div>
                  </button>
                  
                  <button
                    onClick={() => navigate(`/team/${selectedTeam.id}/schedule`)}
                    className="function-btn"
                  >
                    <span className="function-icon">📅</span>
                    <div className="function-info">
                      <span className="function-title">スケジュール</span>
                      <span className="function-desc">練習・試合予定管理</span>
                    </div>
                  </button>
                  
                  <button
                    onClick={() => navigate(`/team/${selectedTeam.id}/practice`)}
                    className="function-btn"
                  >
                    <span className="function-icon">⚾</span>
                    <div className="function-info">
                      <span className="function-title">練習記録</span>
                      <span className="function-desc">チーム練習データ分析</span>
                    </div>
                  </button>
                  
                  <button
                    onClick={() => navigate(`/team/${selectedTeam.id}/games`)}
                    className="function-btn"
                  >
                    <span className="function-icon">🏆</span>
                    <div className="function-info">
                      <span className="function-title">試合記録</span>
                      <span className="function-desc">試合結果・戦績管理</span>
                    </div>
                  </button>
                  
                  {(selectedTeam.membership.role === 'admin' || selectedTeam.membership.role === 'coach') && (
                    <button
                      onClick={() => navigate(`/team/${selectedTeam.id}/manage`)}
                      className="function-btn admin"
                    >
                      <span className="function-icon">⚙️</span>
                      <div className="function-info">
                        <span className="function-title">チーム管理</span>
                        <span className="function-desc">設定・権限管理</span>
                      </div>
                    </button>
                  )}
                </div>
              </div>
              
              {/* チームスケジュール */}
              <div className="team-schedule">
                <h3>📅 チームスケジュール</h3>
                <div className="schedule-list">
                  {getTeamSchedule().slice(0, 5).map(schedule => (
                    <div key={schedule.id} className={`schedule-item ${schedule.type}`}>
                      <div className="schedule-date">
                        <span className="date-text">
                          {new Date(schedule.date).toLocaleDateString('ja-JP', {
                            month: 'short',
                            day: 'numeric',
                            weekday: 'short'
                          })}
                        </span>
                      </div>
                      <div className="schedule-content">
                        <div className="schedule-header">
                          <span className={`schedule-type ${schedule.type}`}>
                            {schedule.type === 'game' ? '🏆 試合' : '⚾ 練習'}
                          </span>
                          <span className="schedule-time">{schedule.time}</span>
                        </div>
                        <div className="schedule-title">{schedule.title}</div>
                        <div className="schedule-location">📍 {schedule.location}</div>
                        <div className="schedule-description">{schedule.description}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => navigate(`/team/${selectedTeam.id}/schedule`)}
                  className="view-more-btn"
                >
                  全スケジュールを見る
                </button>
              </div>

              {/* チームWiki */}
              <div className="team-wiki">
                <div className="wiki-header">
                  <h3>📚 チームWiki</h3>
                  {(selectedTeam.membership.role === 'admin' || selectedTeam.membership.role === 'coach') && (
                    <button
                      onClick={handleEditWiki}
                      className="edit-wiki-btn"
                    >
                      ✏️ 編集
                    </button>
                  )}
                </div>
                
                {editingWiki ? (
                  <div className="wiki-editor">
                    <textarea
                      value={wikiContent}
                      onChange={(e) => setWikiContent(e.target.value)}
                      className="wiki-textarea"
                      placeholder="Wikiの内容をMarkdown形式で入力してください..."
                      rows={20}
                    />
                    <div className="wiki-editor-actions">
                      <button onClick={handleSaveWiki} className="save-btn">
                        💾 保存
                      </button>
                      <button onClick={() => setEditingWiki(false)} className="cancel-btn">
                        ❌ キャンセル
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="wiki-content">
                    <pre className="wiki-text">
                      {selectedTeam.wikiText || getDefaultWikiContent()}
                    </pre>
                  </div>
                )}
              </div>

              {/* 最近の活動 */}
              <div className="recent-activities">
                <h3>📋 最近の活動</h3>
                <div className="activity-list">
                  <div className="activity-item">
                    <span className="activity-icon">⚾</span>
                    <div className="activity-content">
                      <span className="activity-title">練習記録が追加されました</span>
                      <span className="activity-time">2時間前</span>
                    </div>
                  </div>
                  <div className="activity-item">
                    <span className="activity-icon">👥</span>
                    <div className="activity-content">
                      <span className="activity-title">新しいメンバーが参加しました</span>
                      <span className="activity-time">1日前</span>
                    </div>
                  </div>
                  <div className="activity-item">
                    <span className="activity-icon">🏆</span>
                    <div className="activity-content">
                      <span className="activity-title">試合結果が更新されました</span>
                      <span className="activity-time">3日前</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* チーム管理モーダル */}
      {showTeamManagement && (
        <div className="modal-overlay" onClick={() => setShowTeamManagement(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <TeamManagement onClose={() => setShowTeamManagement(false)} />
          </div>
        </div>
      )}
    </div>
  )
}

export default TeamsPage