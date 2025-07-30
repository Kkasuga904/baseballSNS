import React, { useState } from 'react'
import './SimpleGameResultForm.css'

function SimpleGameResultForm({ gameData, onChange }) {
  const [individualStats, setIndividualStats] = useState({
    position: '',
    battingOrder: '',
    atBats: '',
    hits: '',
    runs: '',
    rbis: '',
    strikeouts: '',
    strikes: '',
    walks: '',
    homeRuns: '',
    stolenBases: '',
    errors: '',
    pitchingInnings: '',
    pitchingRuns: '',
    pitchingHits: '',
    pitchingStrikeouts: '',
    pitchingWalks: '',
    memo: ''
  })
  
  const [gameInfo, setGameInfo] = useState({
    opponentName: '',
    gameType: 'practice',
    gameDate: new Date().toISOString().split('T')[0]
  })

  const positions = [
    { value: 'P', label: '投手' },
    { value: 'C', label: '捕手' },
    { value: '1B', label: '一塁手' },
    { value: '2B', label: '二塁手' },
    { value: '3B', label: '三塁手' },
    { value: 'SS', label: '遊撃手' },
    { value: 'LF', label: '左翼手' },
    { value: 'CF', label: '中堅手' },
    { value: 'RF', label: '右翼手' },
    { value: 'DH', label: '指名打者' },
    { value: 'PH', label: '代打' },
    { value: 'PR', label: '代走' }
  ]

  const gameTypes = [
    { value: 'practice', label: '練習試合' },
    { value: 'official', label: '公式戦' },
    { value: 'tournament', label: 'トーナメント' },
    { value: 'league', label: 'リーグ戦' },
    { value: 'friendly', label: '親善試合' }
  ]

  const handleIndividualChange = (field, value) => {
    const newStats = { ...individualStats, [field]: value }
    setIndividualStats(newStats)
    updateGameData(newStats, gameInfo)
  }

  const handleGameInfoChange = (field, value) => {
    const newGameInfo = { ...gameInfo, [field]: value }
    setGameInfo(newGameInfo)
    updateGameData(individualStats, newGameInfo)
  }

  const updateGameData = (individual, info) => {
    if (onChange) {
      onChange({
        individual,
        gameInfo: info
      })
    }
  }

  const calculateBattingAverage = () => {
    const atBats = parseInt(individualStats.atBats) || 0
    const hits = parseInt(individualStats.hits) || 0
    
    if (atBats === 0) return '.000'
    const avg = (hits / atBats).toFixed(3)
    return avg.startsWith('0') ? avg.substring(1) : avg
  }

  return (
    <div className="game-result-form">
      <h4>🏟️ 試合記録</h4>
      
      <div className="game-info-section">
        <div className="form-row">
          <div className="form-group">
            <label>対戦相手</label>
            <input
              type="text"
              value={gameInfo.opponentName}
              onChange={(e) => handleGameInfoChange('opponentName', e.target.value)}
              placeholder="相手チーム名"
            />
          </div>
          
          <div className="form-group">
            <label>試合種別</label>
            <select
              value={gameInfo.gameType}
              onChange={(e) => handleGameInfoChange('gameType', e.target.value)}
            >
              {gameTypes.map(type => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="individual-stats">
        <h5>🏏 個人成績入力</h5>
        
        <div className="form-row">
          <div className="form-group">
            <label>守備位置</label>
            <select
              value={individualStats.position}
              onChange={(e) => handleIndividualChange('position', e.target.value)}
            >
              <option value="">選択してください</option>
              {positions.map(pos => (
                <option key={pos.value} value={pos.value}>{pos.label}</option>
              ))}
            </select>
          </div>
          
          <div className="form-group">
            <label>打順</label>
            <select
              value={individualStats.battingOrder}
              onChange={(e) => handleIndividualChange('battingOrder', e.target.value)}
            >
              <option value="">選択</option>
              {[...Array(9)].map((_, i) => (
                <option key={i + 1} value={i + 1}>{i + 1}番</option>
              ))}
            </select>
          </div>
        </div>

        {individualStats.position === 'P' && (
          <div className="pitching-stats">
            <h5>⚾ 投手成績</h5>
            <div className="stats-grid">
              <div className="stat-item">
                <label>投球回</label>
                <input
                  type="text"
                  value={individualStats.pitchingInnings}
                  onChange={(e) => handleIndividualChange('pitchingInnings', e.target.value)}
                  placeholder="0.0"
                />
              </div>
              <div className="stat-item">
                <label>失点</label>
                <input
                  type="number"
                  value={individualStats.pitchingRuns}
                  onChange={(e) => handleIndividualChange('pitchingRuns', e.target.value)}
                  min="0"
                />
              </div>
              <div className="stat-item">
                <label>被安打</label>
                <input
                  type="number"
                  value={individualStats.pitchingHits}
                  onChange={(e) => handleIndividualChange('pitchingHits', e.target.value)}
                  min="0"
                />
              </div>
              <div className="stat-item">
                <label>奪三振</label>
                <input
                  type="number"
                  value={individualStats.pitchingStrikeouts}
                  onChange={(e) => handleIndividualChange('pitchingStrikeouts', e.target.value)}
                  min="0"
                />
              </div>
              <div className="stat-item">
                <label>与四球</label>
                <input
                  type="number"
                  value={individualStats.pitchingWalks}
                  onChange={(e) => handleIndividualChange('pitchingWalks', e.target.value)}
                  min="0"
                />
              </div>
            </div>
          </div>
        )}

        <div className="batting-stats">
          <h5>⚾ 打撃成績</h5>
          <div className="stats-grid">
            <div className="stat-item">
              <label>打数</label>
              <input
                type="number"
                value={individualStats.atBats}
                onChange={(e) => handleIndividualChange('atBats', e.target.value)}
                min="0"
                max="10"
              />
            </div>
            <div className="stat-item">
              <label>安打</label>
              <input
                type="number"
                value={individualStats.hits}
                onChange={(e) => handleIndividualChange('hits', e.target.value)}
                min="0"
                max="10"
              />
            </div>
            <div className="stat-item">
              <label>得点</label>
              <input
                type="number"
                value={individualStats.runs}
                onChange={(e) => handleIndividualChange('runs', e.target.value)}
                min="0"
                max="10"
              />
            </div>
            <div className="stat-item">
              <label>打点</label>
              <input
                type="number"
                value={individualStats.rbis}
                onChange={(e) => handleIndividualChange('rbis', e.target.value)}
                min="0"
                max="10"
              />
            </div>
            <div className="stat-item">
              <label>三振</label>
              <input
                type="number"
                value={individualStats.strikeouts}
                onChange={(e) => handleIndividualChange('strikeouts', e.target.value)}
                min="0"
                max="10"
              />
            </div>
            <div className="stat-item">
              <label>ストライク</label>
              <input
                type="number"
                value={individualStats.strikes}
                onChange={(e) => handleIndividualChange('strikes', e.target.value)}
                min="0"
                max="10"
              />
            </div>
            <div className="stat-item">
              <label>四球</label>
              <input
                type="number"
                value={individualStats.walks}
                onChange={(e) => handleIndividualChange('walks', e.target.value)}
                min="0"
                max="10"
              />
            </div>
            <div className="stat-item">
              <label>本塁打</label>
              <input
                type="number"
                value={individualStats.homeRuns}
                onChange={(e) => handleIndividualChange('homeRuns', e.target.value)}
                min="0"
                max="5"
              />
            </div>
            <div className="stat-item">
              <label>盗塁</label>
              <input
                type="number"
                value={individualStats.stolenBases}
                onChange={(e) => handleIndividualChange('stolenBases', e.target.value)}
                min="0"
                max="5"
              />
            </div>
            <div className="stat-item">
              <label>失策</label>
              <input
                type="number"
                value={individualStats.errors}
                onChange={(e) => handleIndividualChange('errors', e.target.value)}
                min="0"
                max="5"
              />
            </div>
          </div>
          
          {individualStats.atBats && individualStats.hits !== '' && (
            <div className="batting-average">
              <span>打率: </span>
              <strong>{calculateBattingAverage()}</strong>
            </div>
          )}
        </div>

        <div className="form-group">
          <label>個人メモ</label>
          <textarea
            value={individualStats.memo}
            onChange={(e) => handleIndividualChange('memo', e.target.value)}
            placeholder="今日のプレーの感想、改善点など"
            rows="3"
          />
        </div>
      </div>
    </div>
  )
}

export default SimpleGameResultForm