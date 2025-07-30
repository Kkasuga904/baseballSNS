import React, { useState, useEffect } from 'react'
import { useAuth } from '../App'
import './MonthlyStats.css'

function MonthlyStats() {
  const { user } = useAuth()
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date()
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  })
  const [monthlyStats, setMonthlyStats] = useState(null)
  const [gameResults, setGameResults] = useState([])

  useEffect(() => {
    if (user) {
      loadGameResults()
    }
  }, [user, selectedMonth])

  const loadGameResults = () => {
    const userKey = user?.email || 'guest'
    const savedResults = localStorage.getItem(`baseballSNSGameResults_${userKey}`)
    
    if (savedResults) {
      const allResults = JSON.parse(savedResults)
      const [year, month] = selectedMonth.split('-')
      
      // 選択月の試合結果をフィルタリング
      const monthResults = allResults.filter(result => {
        const resultDate = new Date(result.date)
        return resultDate.getFullYear() === parseInt(year) && 
               resultDate.getMonth() + 1 === parseInt(month)
      })
      
      setGameResults(monthResults)
      calculateMonthlyStats(monthResults)
    }
  }

  const calculateMonthlyStats = (results) => {
    if (results.length === 0) {
      setMonthlyStats(null)
      return
    }

    // チーム成績
    const teamStats = {
      games: 0,
      wins: 0,
      losses: 0,
      draws: 0,
      totalRuns: 0,
      totalRunsAllowed: 0
    }

    // 打撃成績
    const battingStats = {
      games: 0,
      atBats: 0,
      hits: 0,
      doubles: 0,
      triples: 0,
      homeRuns: 0,
      rbis: 0,
      runs: 0,
      walks: 0,
      strikeouts: 0,
      stolenBases: 0,
      sacrifices: 0,
      errors: 0
    }

    // 投手成績
    const pitchingStats = {
      games: 0,
      wins: 0,
      losses: 0,
      saves: 0,
      holds: 0,
      inningsPitched: 0,
      hitsAllowed: 0,
      earnedRuns: 0,
      walksAllowed: 0,
      strikeoutsThrown: 0,
      homeRunsAllowed: 0
    }

    results.forEach(result => {
      // チーム成績集計
      if (result.teamResult) {
        teamStats.games++
        if (result.teamResult.result === 'win') teamStats.wins++
        else if (result.teamResult.result === 'lose') teamStats.losses++
        else if (result.teamResult.result === 'draw') teamStats.draws++
        
        teamStats.totalRuns += parseInt(result.teamResult.ourScore) || 0
        teamStats.totalRunsAllowed += parseInt(result.teamResult.opponentScore) || 0
      }

      // 打撃成績集計
      if (result.battingStats && result.battingStats.atBats) {
        battingStats.games++
        battingStats.atBats += parseInt(result.battingStats.atBats) || 0
        battingStats.hits += parseInt(result.battingStats.hits) || 0
        battingStats.doubles += parseInt(result.battingStats.doubles) || 0
        battingStats.triples += parseInt(result.battingStats.triples) || 0
        battingStats.homeRuns += parseInt(result.battingStats.homeRuns) || 0
        battingStats.rbis += parseInt(result.battingStats.rbis) || 0
        battingStats.runs += parseInt(result.battingStats.runs) || 0
        battingStats.walks += parseInt(result.battingStats.walks) || 0
        battingStats.strikeouts += parseInt(result.battingStats.strikeouts) || 0
        battingStats.stolenBases += parseInt(result.battingStats.stolenBases) || 0
        battingStats.sacrifices += parseInt(result.battingStats.sacrifices) || 0
        battingStats.errors += parseInt(result.battingStats.errors) || 0
      }

      // 投手成績集計
      if (result.pitchingStats && result.pitchingStats.isPitcher) {
        pitchingStats.games++
        if (result.pitchingStats.isWin) pitchingStats.wins++
        if (result.pitchingStats.isLose) pitchingStats.losses++
        if (result.pitchingStats.isSave) pitchingStats.saves++
        if (result.pitchingStats.isHold) pitchingStats.holds++
        
        pitchingStats.inningsPitched += parseFloat(result.pitchingStats.inningsPitched) || 0
        pitchingStats.hitsAllowed += parseInt(result.pitchingStats.hitsAllowed) || 0
        pitchingStats.earnedRuns += parseInt(result.pitchingStats.earnedRuns) || 0
        pitchingStats.walksAllowed += parseInt(result.pitchingStats.walksAllowed) || 0
        pitchingStats.strikeoutsThrown += parseInt(result.pitchingStats.strikeoutsThrown) || 0
        pitchingStats.homeRunsAllowed += parseInt(result.pitchingStats.homeRunsAllowed) || 0
      }
    })

    // 計算値
    const battingAverage = battingStats.atBats > 0 
      ? (battingStats.hits / battingStats.atBats).toFixed(3).substring(1)
      : '.000'
    
    const onBasePercentage = (battingStats.atBats + battingStats.walks) > 0
      ? ((battingStats.hits + battingStats.walks) / (battingStats.atBats + battingStats.walks)).toFixed(3).substring(1)
      : '.000'
    
    const totalBases = battingStats.hits + battingStats.doubles + (battingStats.triples * 2) + (battingStats.homeRuns * 3)
    const sluggingPercentage = battingStats.atBats > 0
      ? (totalBases / battingStats.atBats).toFixed(3).substring(1)
      : '.000'
    
    const era = pitchingStats.inningsPitched > 0
      ? ((pitchingStats.earnedRuns * 9) / pitchingStats.inningsPitched).toFixed(2)
      : '0.00'
    
    const whip = pitchingStats.inningsPitched > 0
      ? ((pitchingStats.walksAllowed + pitchingStats.hitsAllowed) / pitchingStats.inningsPitched).toFixed(2)
      : '0.00'

    const winPercentage = teamStats.games > 0
      ? (teamStats.wins / teamStats.games).toFixed(3).substring(1)
      : '.000'

    setMonthlyStats({
      team: {
        ...teamStats,
        winPercentage
      },
      batting: {
        ...battingStats,
        average: battingAverage,
        obp: onBasePercentage,
        slg: sluggingPercentage,
        ops: (parseFloat('0' + onBasePercentage) + parseFloat('0' + sluggingPercentage)).toFixed(3).substring(1)
      },
      pitching: {
        ...pitchingStats,
        era,
        whip
      }
    })
  }

  const handleMonthChange = (e) => {
    setSelectedMonth(e.target.value)
  }

  const generateMonthOptions = () => {
    const options = []
    const now = new Date()
    const currentYear = now.getFullYear()
    const currentMonth = now.getMonth()
    
    // 過去1年分の月を生成
    for (let i = 0; i < 12; i++) {
      const date = new Date(currentYear, currentMonth - i, 1)
      const value = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
      const label = date.toLocaleDateString('ja-JP', { year: 'numeric', month: 'long' })
      options.push({ value, label })
    }
    
    return options
  }

  return (
    <div className="monthly-stats">
      <div className="stats-header">
        <h3>📊 月間成績</h3>
        <select value={selectedMonth} onChange={handleMonthChange} className="month-selector">
          {generateMonthOptions().map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {!monthlyStats ? (
        <div className="no-stats">
          <p>選択した月の試合記録がありません</p>
        </div>
      ) : (
        <div className="stats-content">
          {/* チーム成績 */}
          <div className="stats-section">
            <h4>🏆 チーム成績</h4>
            <div className="team-stats-grid">
              <div className="stat-card">
                <div className="stat-title">試合数</div>
                <div className="stat-value">{monthlyStats.team.games}</div>
              </div>
              <div className="stat-card">
                <div className="stat-title">勝利</div>
                <div className="stat-value win">{monthlyStats.team.wins}</div>
              </div>
              <div className="stat-card">
                <div className="stat-title">敗北</div>
                <div className="stat-value lose">{monthlyStats.team.losses}</div>
              </div>
              <div className="stat-card">
                <div className="stat-title">勝率</div>
                <div className="stat-value">{monthlyStats.team.winPercentage}</div>
              </div>
              <div className="stat-card">
                <div className="stat-title">得点</div>
                <div className="stat-value">{monthlyStats.team.totalRuns}</div>
              </div>
              <div className="stat-card">
                <div className="stat-title">失点</div>
                <div className="stat-value">{monthlyStats.team.totalRunsAllowed}</div>
              </div>
            </div>
          </div>

          {/* 打撃成績 */}
          {monthlyStats.batting.games > 0 && (
            <div className="stats-section">
              <h4>🏏 打撃成績</h4>
              <div className="batting-stats-main">
                <div className="main-stat">
                  <div className="stat-label">打率</div>
                  <div className="stat-big">{monthlyStats.batting.average}</div>
                </div>
                <div className="main-stat">
                  <div className="stat-label">本塁打</div>
                  <div className="stat-big">{monthlyStats.batting.homeRuns}</div>
                </div>
                <div className="main-stat">
                  <div className="stat-label">打点</div>
                  <div className="stat-big">{monthlyStats.batting.rbis}</div>
                </div>
                <div className="main-stat">
                  <div className="stat-label">OPS</div>
                  <div className="stat-big">{monthlyStats.batting.ops}</div>
                </div>
              </div>
              <div className="batting-stats-detail">
                <div className="detail-row">
                  <span>試合: {monthlyStats.batting.games}</span>
                  <span>打数: {monthlyStats.batting.atBats}</span>
                  <span>安打: {monthlyStats.batting.hits}</span>
                  <span>得点: {monthlyStats.batting.runs}</span>
                </div>
                <div className="detail-row">
                  <span>二塁打: {monthlyStats.batting.doubles}</span>
                  <span>三塁打: {monthlyStats.batting.triples}</span>
                  <span>四球: {monthlyStats.batting.walks}</span>
                  <span>三振: {monthlyStats.batting.strikeouts}</span>
                </div>
                <div className="detail-row">
                  <span>盗塁: {monthlyStats.batting.stolenBases}</span>
                  <span>犠打: {monthlyStats.batting.sacrifices}</span>
                  <span>出塁率: {monthlyStats.batting.obp}</span>
                  <span>長打率: {monthlyStats.batting.slg}</span>
                </div>
              </div>
            </div>
          )}

          {/* 投手成績 */}
          {monthlyStats.pitching.games > 0 && (
            <div className="stats-section">
              <h4>⚾ 投手成績</h4>
              <div className="pitching-stats-main">
                <div className="main-stat">
                  <div className="stat-label">防御率</div>
                  <div className="stat-big">{monthlyStats.pitching.era}</div>
                </div>
                <div className="main-stat">
                  <div className="stat-label">勝利</div>
                  <div className="stat-big">{monthlyStats.pitching.wins}</div>
                </div>
                <div className="main-stat">
                  <div className="stat-label">奪三振</div>
                  <div className="stat-big">{monthlyStats.pitching.strikeoutsThrown}</div>
                </div>
                <div className="main-stat">
                  <div className="stat-label">WHIP</div>
                  <div className="stat-big">{monthlyStats.pitching.whip}</div>
                </div>
              </div>
              <div className="pitching-stats-detail">
                <div className="detail-row">
                  <span>登板: {monthlyStats.pitching.games}</span>
                  <span>投球回: {monthlyStats.pitching.inningsPitched.toFixed(1)}</span>
                  <span>被安打: {monthlyStats.pitching.hitsAllowed}</span>
                  <span>自責点: {monthlyStats.pitching.earnedRuns}</span>
                </div>
                <div className="detail-row">
                  <span>敗戦: {monthlyStats.pitching.losses}</span>
                  <span>セーブ: {monthlyStats.pitching.saves}</span>
                  <span>ホールド: {monthlyStats.pitching.holds}</span>
                  <span>与四球: {monthlyStats.pitching.walksAllowed}</span>
                </div>
              </div>
            </div>
          )}

          {/* 個別試合結果 */}
          <div className="stats-section">
            <h4>📅 試合結果一覧</h4>
            <div className="game-results-list">
              {gameResults.map((result, index) => (
                <div key={index} className="game-result-item">
                  <div className="game-date">
                    {new Date(result.date).toLocaleDateString('ja-JP', {
                      month: 'numeric',
                      day: 'numeric',
                      weekday: 'short'
                    })}
                  </div>
                  {result.teamResult && (
                    <div className={`game-score ${result.teamResult.result}`}>
                      {result.teamResult.ourScore} - {result.teamResult.opponentScore}
                      <span className="result-label">
                        {result.teamResult.result === 'win' ? '勝' : 
                         result.teamResult.result === 'lose' ? '負' : '分'}
                      </span>
                    </div>
                  )}
                  {result.battingStats && result.battingStats.atBats && (
                    <div className="game-batting">
                      {result.battingStats.hits}安打/{result.battingStats.atBats}打数
                    </div>
                  )}
                  {result.pitchingStats && result.pitchingStats.isPitcher && (
                    <div className="game-pitching">
                      {result.pitchingStats.inningsPitched}回 {result.pitchingStats.earnedRuns}失点
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default MonthlyStats