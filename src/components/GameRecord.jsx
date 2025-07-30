import React from 'react'
import './GameRecord.css'

function GameRecord({ practiceData }) {
  const { date, gameResultData, note } = practiceData
  
  if (!gameResultData) {
    return null
  }
  
  const { individual, gameInfo } = gameResultData
  
  const calculateBattingAverage = () => {
    if (!individual || !individual.atBats || !individual.hits) return '.000'
    const atBats = parseInt(individual.atBats) || 0
    const hits = parseInt(individual.hits) || 0
    if (atBats === 0) return '.000'
    const avg = (hits / atBats).toFixed(3)
    return avg.startsWith('0') ? avg.substring(1) : avg
  }
  
  
  const getPositionName = (position) => {
    const positions = {
      'P': '投手',
      'C': '捕手',
      '1B': '一塁手',
      '2B': '二塁手',
      '3B': '三塁手',
      'SS': '遊撃手',
      'LF': '左翼手',
      'CF': '中堅手',
      'RF': '右翼手',
      'DH': '指名打者',
      'PH': '代打',
      'PR': '代走'
    }
    return positions[position] || position
  }
  
  const getGameTypeName = (type) => {
    const types = {
      'practice': '練習試合',
      'official': '公式戦',
      'tournament': 'トーナメント',
      'league': 'リーグ戦',
      'friendly': '親善試合'
    }
    return types[type] || type
  }

  return (
    <div className="game-record">
      <div className="game-header">
        <h4>🏟️ 試合記録</h4>
        <span className="game-date">{new Date(date).toLocaleDateString('ja-JP')}</span>
      </div>
      
      {gameInfo && (
        <div className="game-info-card">
          <div className="info-header">
            <span className="game-type">{getGameTypeName(gameInfo.gameType)}</span>
            {gameInfo.opponentName && (
              <span className="opponent-name">vs {gameInfo.opponentName}</span>
            )}
          </div>
        </div>
      )}
      
      {individual && (individual.atBats || individual.pitchingInnings) && (
        <div className="individual-result-card">
          <h5>📊 個人成績</h5>
          
          {individual.position && (
            <div className="position-info">
              <span className="position">{getPositionName(individual.position)}</span>
              {individual.battingOrder && (
                <span className="batting-order">{individual.battingOrder}番</span>
              )}
            </div>
          )}
          
          {individual.atBats && (
            <div className="batting-summary">
              <div className="stat-line">
                <span className="stat-label">打撃成績:</span>
                <span className="stat-value">
                  {individual.hits} / {individual.atBats} 
                  ({calculateBattingAverage()})
                </span>
              </div>
              
              <div className="detailed-stats">
                {individual.homeRuns > 0 && (
                  <span className="stat-item">本塁打: {individual.homeRuns}</span>
                )}
                {individual.rbis > 0 && (
                  <span className="stat-item">打点: {individual.rbis}</span>
                )}
                {individual.runs > 0 && (
                  <span className="stat-item">得点: {individual.runs}</span>
                )}
                {individual.stolenBases > 0 && (
                  <span className="stat-item">盗塁: {individual.stolenBases}</span>
                )}
                {individual.walks > 0 && (
                  <span className="stat-item">四球: {individual.walks}</span>
                )}
                {individual.strikeouts > 0 && (
                  <span className="stat-item">三振: {individual.strikeouts}</span>
                )}
                {individual.strikes > 0 && (
                  <span className="stat-item">ストライク: {individual.strikes}</span>
                )}
                {individual.errors > 0 && (
                  <span className="stat-item error">失策: {individual.errors}</span>
                )}
              </div>
            </div>
          )}
          
          {individual.position === 'P' && individual.pitchingInnings && (
            <div className="pitching-summary">
              <div className="stat-line">
                <span className="stat-label">投球成績:</span>
                <span className="stat-value">
                  {individual.pitchingInnings}回 {individual.pitchingRuns}失点
                </span>
              </div>
              
              <div className="detailed-stats">
                {individual.pitchingStrikeouts > 0 && (
                  <span className="stat-item">奪三振: {individual.pitchingStrikeouts}</span>
                )}
                {individual.pitchingWalks > 0 && (
                  <span className="stat-item">与四球: {individual.pitchingWalks}</span>
                )}
                {individual.pitchingHits > 0 && (
                  <span className="stat-item">被安打: {individual.pitchingHits}</span>
                )}
              </div>
            </div>
          )}
          
          {individual.memo && (
            <div className="individual-memo">
              <p>{individual.memo}</p>
            </div>
          )}
        </div>
      )}
      
      {note && (
        <div className="game-note">
          <h5>📝 メモ</h5>
          <p>{note}</p>
        </div>
      )}
    </div>
  )
}

export default GameRecord