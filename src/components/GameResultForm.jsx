import React, { useState, useEffect } from 'react'
import { useAuth } from '../App'
import './GameResultForm.css'

function GameResultForm({ gameSchedule, onSubmit, onClose }) {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('team')
  
  // チーム結果
  const [teamResult, setTeamResult] = useState({
    ourScore: '',
    opponentScore: '',
    result: '', // win, lose, draw
    innings: '9',
    gameNote: ''
  })
  
  // 個人成績（野手）
  const [battingStats, setBattingStats] = useState({
    atBats: '',
    hits: '',
    doubles: '',
    triples: '',
    homeRuns: '',
    rbis: '',
    runs: '',
    stolenBases: '',
    walks: '',
    strikeouts: '',
    sacrifices: '',
    errors: '',
    battingNote: ''
  })
  
  // 個人成績（投手）
  const [pitchingStats, setPitchingStats] = useState({
    isPitcher: false,
    inningsPitched: '',
    hitsAllowed: '',
    runsAllowed: '',
    earnedRuns: '',
    walksAllowed: '',
    strikeoutsThrown: '',
    homeRunsAllowed: '',
    pitchCount: '',
    isWin: false,
    isLose: false,
    isSave: false,
    isHold: false,
    pitchingNote: ''
  })

  useEffect(() => {
    // 既存の結果がある場合は読み込み
    if (gameSchedule && gameSchedule.gameResult) {
      const result = gameSchedule.gameResult
      if (result.teamResult) setTeamResult(result.teamResult)
      if (result.battingStats) setBattingStats(result.battingStats)
      if (result.pitchingStats) setPitchingStats(result.pitchingStats)
    }
  }, [gameSchedule])

  // 試合結果を自動判定
  useEffect(() => {
    if (teamResult.ourScore !== '' && teamResult.opponentScore !== '') {
      const our = parseInt(teamResult.ourScore)
      const opp = parseInt(teamResult.opponentScore)
      if (our > opp) {
        setTeamResult(prev => ({ ...prev, result: 'win' }))
      } else if (our < opp) {
        setTeamResult(prev => ({ ...prev, result: 'lose' }))
      } else {
        setTeamResult(prev => ({ ...prev, result: 'draw' }))
      }
    }
  }, [teamResult.ourScore, teamResult.opponentScore])

  // 打率計算
  const calculateAverage = () => {
    if (battingStats.atBats && battingStats.hits) {
      const avg = (parseInt(battingStats.hits) / parseInt(battingStats.atBats)).toFixed(3)
      return avg.substring(1) // .を除いて表示
    }
    return '---'
  }

  // 防御率計算
  const calculateERA = () => {
    if (pitchingStats.inningsPitched && pitchingStats.earnedRuns) {
      const innings = parseFloat(pitchingStats.inningsPitched)
      const er = parseInt(pitchingStats.earnedRuns)
      if (innings > 0) {
        return ((er * 9) / innings).toFixed(2)
      }
    }
    return '---'
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    const resultData = {
      gameId: gameSchedule.id,
      date: gameSchedule.date || gameSchedule.startDate,
      teamResult,
      battingStats,
      pitchingStats: pitchingStats.isPitcher ? pitchingStats : null,
      recordedAt: new Date().toISOString()
    }
    
    onSubmit(resultData)
  }

  return (
    <div className="game-result-form">
      <div className="form-header">
        <h3>⚾ 試合結果入力</h3>
        <p className="game-info">
          {new Date(gameSchedule.date || gameSchedule.startDate).toLocaleDateString('ja-JP', {
            month: 'long',
            day: 'numeric'
          })} - {gameSchedule.opponent || gameSchedule.title}
        </p>
      </div>

      <div className="result-tabs">
        <button
          className={`tab-button ${activeTab === 'team' ? 'active' : ''}`}
          onClick={() => setActiveTab('team')}
        >
          チーム結果
        </button>
        <button
          className={`tab-button ${activeTab === 'batting' ? 'active' : ''}`}
          onClick={() => setActiveTab('batting')}
        >
          打撃成績
        </button>
        <button
          className={`tab-button ${activeTab === 'pitching' ? 'active' : ''}`}
          onClick={() => setActiveTab('pitching')}
        >
          投手成績
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        {activeTab === 'team' && (
          <div className="team-result-section">
            <div className="score-input">
              <div className="team-score">
                <label>自チーム</label>
                <input
                  type="number"
                  min="0"
                  max="99"
                  value={teamResult.ourScore}
                  onChange={(e) => setTeamResult({...teamResult, ourScore: e.target.value})}
                  className="score-field"
                  required
                />
              </div>
              <div className="vs-separator">VS</div>
              <div className="team-score">
                <label>相手チーム</label>
                <input
                  type="number"
                  min="0"
                  max="99"
                  value={teamResult.opponentScore}
                  onChange={(e) => setTeamResult({...teamResult, opponentScore: e.target.value})}
                  className="score-field"
                  required
                />
              </div>
            </div>

            {teamResult.result && (
              <div className={`result-display ${teamResult.result}`}>
                {teamResult.result === 'win' ? '🎉 勝利！' : 
                 teamResult.result === 'lose' ? '😔 敗北' : '🤝 引き分け'}
              </div>
            )}

            <div className="form-group">
              <label>イニング数</label>
              <select
                value={teamResult.innings}
                onChange={(e) => setTeamResult({...teamResult, innings: e.target.value})}
              >
                <option value="7">7回</option>
                <option value="9">9回</option>
                <option value="延長">延長</option>
                <option value="コールド">コールド</option>
              </select>
            </div>

            <div className="form-group">
              <label>試合メモ</label>
              <textarea
                value={teamResult.gameNote}
                onChange={(e) => setTeamResult({...teamResult, gameNote: e.target.value})}
                placeholder="試合の状況、ポイントなど"
                rows="3"
              />
            </div>
          </div>
        )}

        {activeTab === 'batting' && (
          <div className="batting-stats-section">
            <div className="stats-grid">
              <div className="stat-input">
                <label>打数</label>
                <input
                  type="number"
                  min="0"
                  max="10"
                  value={battingStats.atBats}
                  onChange={(e) => setBattingStats({...battingStats, atBats: e.target.value})}
                />
              </div>
              <div className="stat-input">
                <label>安打</label>
                <input
                  type="number"
                  min="0"
                  max="10"
                  value={battingStats.hits}
                  onChange={(e) => setBattingStats({...battingStats, hits: e.target.value})}
                />
              </div>
              <div className="stat-input">
                <label>二塁打</label>
                <input
                  type="number"
                  min="0"
                  max="5"
                  value={battingStats.doubles}
                  onChange={(e) => setBattingStats({...battingStats, doubles: e.target.value})}
                />
              </div>
              <div className="stat-input">
                <label>三塁打</label>
                <input
                  type="number"
                  min="0"
                  max="3"
                  value={battingStats.triples}
                  onChange={(e) => setBattingStats({...battingStats, triples: e.target.value})}
                />
              </div>
              <div className="stat-input">
                <label>本塁打</label>
                <input
                  type="number"
                  min="0"
                  max="5"
                  value={battingStats.homeRuns}
                  onChange={(e) => setBattingStats({...battingStats, homeRuns: e.target.value})}
                />
              </div>
              <div className="stat-input">
                <label>打点</label>
                <input
                  type="number"
                  min="0"
                  max="15"
                  value={battingStats.rbis}
                  onChange={(e) => setBattingStats({...battingStats, rbis: e.target.value})}
                />
              </div>
              <div className="stat-input">
                <label>得点</label>
                <input
                  type="number"
                  min="0"
                  max="10"
                  value={battingStats.runs}
                  onChange={(e) => setBattingStats({...battingStats, runs: e.target.value})}
                />
              </div>
              <div className="stat-input">
                <label>盗塁</label>
                <input
                  type="number"
                  min="0"
                  max="5"
                  value={battingStats.stolenBases}
                  onChange={(e) => setBattingStats({...battingStats, stolenBases: e.target.value})}
                />
              </div>
              <div className="stat-input">
                <label>四球</label>
                <input
                  type="number"
                  min="0"
                  max="10"
                  value={battingStats.walks}
                  onChange={(e) => setBattingStats({...battingStats, walks: e.target.value})}
                />
              </div>
              <div className="stat-input">
                <label>三振</label>
                <input
                  type="number"
                  min="0"
                  max="10"
                  value={battingStats.strikeouts}
                  onChange={(e) => setBattingStats({...battingStats, strikeouts: e.target.value})}
                />
              </div>
              <div className="stat-input">
                <label>犠打</label>
                <input
                  type="number"
                  min="0"
                  max="5"
                  value={battingStats.sacrifices}
                  onChange={(e) => setBattingStats({...battingStats, sacrifices: e.target.value})}
                />
              </div>
              <div className="stat-input">
                <label>失策</label>
                <input
                  type="number"
                  min="0"
                  max="5"
                  value={battingStats.errors}
                  onChange={(e) => setBattingStats({...battingStats, errors: e.target.value})}
                />
              </div>
            </div>

            {battingStats.atBats && (
              <div className="batting-summary">
                <div className="summary-stat">
                  <span className="stat-label">今日の打率</span>
                  <span className="stat-value">{calculateAverage()}</span>
                </div>
              </div>
            )}

            <div className="form-group">
              <label>打撃メモ</label>
              <textarea
                value={battingStats.battingNote}
                onChange={(e) => setBattingStats({...battingStats, battingNote: e.target.value})}
                placeholder="打席内容、課題など"
                rows="2"
              />
            </div>
          </div>
        )}

        {activeTab === 'pitching' && (
          <div className="pitching-stats-section">
            <label className="pitcher-toggle">
              <input
                type="checkbox"
                checked={pitchingStats.isPitcher}
                onChange={(e) => setPitchingStats({...pitchingStats, isPitcher: e.target.checked})}
              />
              <span>投手として出場</span>
            </label>

            {pitchingStats.isPitcher && (
              <>
                <div className="stats-grid">
                  <div className="stat-input">
                    <label>投球回</label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="15"
                      value={pitchingStats.inningsPitched}
                      onChange={(e) => setPitchingStats({...pitchingStats, inningsPitched: e.target.value})}
                    />
                  </div>
                  <div className="stat-input">
                    <label>被安打</label>
                    <input
                      type="number"
                      min="0"
                      max="30"
                      value={pitchingStats.hitsAllowed}
                      onChange={(e) => setPitchingStats({...pitchingStats, hitsAllowed: e.target.value})}
                    />
                  </div>
                  <div className="stat-input">
                    <label>失点</label>
                    <input
                      type="number"
                      min="0"
                      max="20"
                      value={pitchingStats.runsAllowed}
                      onChange={(e) => setPitchingStats({...pitchingStats, runsAllowed: e.target.value})}
                    />
                  </div>
                  <div className="stat-input">
                    <label>自責点</label>
                    <input
                      type="number"
                      min="0"
                      max="20"
                      value={pitchingStats.earnedRuns}
                      onChange={(e) => setPitchingStats({...pitchingStats, earnedRuns: e.target.value})}
                    />
                  </div>
                  <div className="stat-input">
                    <label>与四球</label>
                    <input
                      type="number"
                      min="0"
                      max="15"
                      value={pitchingStats.walksAllowed}
                      onChange={(e) => setPitchingStats({...pitchingStats, walksAllowed: e.target.value})}
                    />
                  </div>
                  <div className="stat-input">
                    <label>奪三振</label>
                    <input
                      type="number"
                      min="0"
                      max="20"
                      value={pitchingStats.strikeoutsThrown}
                      onChange={(e) => setPitchingStats({...pitchingStats, strikeoutsThrown: e.target.value})}
                    />
                  </div>
                  <div className="stat-input">
                    <label>被本塁打</label>
                    <input
                      type="number"
                      min="0"
                      max="5"
                      value={pitchingStats.homeRunsAllowed}
                      onChange={(e) => setPitchingStats({...pitchingStats, homeRunsAllowed: e.target.value})}
                    />
                  </div>
                  <div className="stat-input">
                    <label>球数</label>
                    <input
                      type="number"
                      min="0"
                      max="200"
                      value={pitchingStats.pitchCount}
                      onChange={(e) => setPitchingStats({...pitchingStats, pitchCount: e.target.value})}
                    />
                  </div>
                </div>

                <div className="pitcher-results">
                  <label>
                    <input
                      type="checkbox"
                      checked={pitchingStats.isWin}
                      onChange={(e) => setPitchingStats({
                        ...pitchingStats, 
                        isWin: e.target.checked,
                        isLose: false
                      })}
                    />
                    <span>勝利投手</span>
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      checked={pitchingStats.isLose}
                      onChange={(e) => setPitchingStats({
                        ...pitchingStats, 
                        isLose: e.target.checked,
                        isWin: false
                      })}
                    />
                    <span>敗戦投手</span>
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      checked={pitchingStats.isSave}
                      onChange={(e) => setPitchingStats({...pitchingStats, isSave: e.target.checked})}
                    />
                    <span>セーブ</span>
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      checked={pitchingStats.isHold}
                      onChange={(e) => setPitchingStats({...pitchingStats, isHold: e.target.checked})}
                    />
                    <span>ホールド</span>
                  </label>
                </div>

                {pitchingStats.inningsPitched && pitchingStats.earnedRuns !== '' && (
                  <div className="pitching-summary">
                    <div className="summary-stat">
                      <span className="stat-label">防御率</span>
                      <span className="stat-value">{calculateERA()}</span>
                    </div>
                  </div>
                )}

                <div className="form-group">
                  <label>投球メモ</label>
                  <textarea
                    value={pitchingStats.pitchingNote}
                    onChange={(e) => setPitchingStats({...pitchingStats, pitchingNote: e.target.value})}
                    placeholder="球種の状態、課題など"
                    rows="2"
                  />
                </div>
              </>
            )}
          </div>
        )}

        <div className="form-actions">
          <button type="submit" className="submit-btn">
            試合結果を保存
          </button>
          <button type="button" onClick={onClose} className="cancel-btn">
            キャンセル
          </button>
        </div>
      </form>
    </div>
  )
}

export default GameResultForm