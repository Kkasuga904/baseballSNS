import React from 'react'
import './MeasurementChart.css'

/**
 * 測定データのグラフ表示コンポーネント
 * @param {Array} data - 測定データの配列 [{date: '2025-01-01', value: '18.5'}, ...]
 * @param {string} unit - 単位（kg、%、秒など）
 * @param {string} label - 項目名（体脂肪率、体重など）
 * @param {string} icon - アイコン絵文字
 */
function MeasurementChart({ data, unit, label, icon }) {
  // データが無い場合の表示
  if (!data || data.length === 0) {
    return (
      <div className="chart-container">
        <div className="no-chart-data">
          <span className="no-data-icon">📊</span>
          <p>データがありません</p>
        </div>
      </div>
    )
  }

  // ========== データ分析処理 ==========
  
  // 文字列の値を数値に変換（例: '18.5' → 18.5）
  const values = data.map(d => parseFloat(d.value))
  
  // 最大値と最小値を見つける
  const maxValue = Math.max(...values)  // スプレッド構文で配列を展開
  const minValue = Math.min(...values)
  const range = maxValue - minValue || 1  // 範囲が0の場合は1にする（ゼロ除算防止）

  // 平均値を計算（全ての値を足して個数で割る）
  const average = values.reduce((a, b) => a + b, 0) / values.length

  // 最新の値と前回からの変化を計算
  const latestValue = values[values.length - 1]  // 配列の最後の要素
  const previousValue = values.length > 1 ? values[values.length - 2] : null  // 最後から2番目
  const change = previousValue ? latestValue - previousValue : 0  // 差分
  const changePercent = previousValue ? ((change / Math.abs(previousValue)) * 100).toFixed(1) : 0  // 変化率

  // Y軸のスケールを計算（グラフの縦軸の目盛り）
  const yAxisSteps = 5  // 5段階の目盛り
  const stepSize = range / (yAxisSteps - 1)  // 各目盛りの間隔
  const yAxisValues = Array.from({ length: yAxisSteps }, (_, i) => 
    (minValue + stepSize * i).toFixed(1)  // 小数点1桁で丸める
  ).reverse()  // 上から下に表示するため反転

  return (
    <div className="chart-container">
      {/* ============ ① 上段：概要パネル ============ */}
      {/* 最新値や統計情報をまとめて表示 */}
      <div className="summary-panel">
        {/* メインの最新値表示エリア */}
        <div className="summary-main">
          <div className="summary-latest">
            {/* 大きく表示する最新の測定値 */}
            <div className="summary-value-large">
              {latestValue}
              <span className="summary-unit">{unit}</span>
            </div>
            <div className="summary-label">最新値</div>
          </div>
        </div>
        
        {/* 4つの統計情報を2x2のグリッド表示 */}
        <div className="summary-stats">
          {/* 前回からの変化 */}
          <div className="summary-stat">
            <div className="summary-stat-label">変化</div>
            <div className={`summary-stat-value ${change === 0 ? '' : change > 0 ? 'positive' : 'negative'}`}>
              {change >= 0 ? '+' : ''}{change.toFixed(1)}{unit}
              <span className="summary-stat-percent">({changePercent}%)</span>
            </div>
          </div>
          
          <div className="summary-stat">
            <div className="summary-stat-label">平均</div>
            <div className="summary-stat-value">{average.toFixed(1)}{unit}</div>
          </div>
          
          <div className="summary-stat">
            <div className="summary-stat-label">最高記録</div>
            <div className="summary-stat-value high">{maxValue}{unit}</div>
          </div>
          
          <div className="summary-stat">
            <div className="summary-stat-label">最低記録</div>
            <div className="summary-stat-value low">{minValue}{unit}</div>
          </div>
        </div>
      </div>

      {/* ============ ② 中段：折れ線グラフ ============ */}
      <div className="chart-section">
        <h4 className="chart-section-title">推移グラフ</h4>
        <div className="chart-body">
          <div className="chart-grid">
            {/* Y軸ラベル（縦軸の数値） */}
            <div className="y-axis-labels">
              {yAxisValues.map((value, index) => (
                <div key={index} className="y-label">{value}</div>
              ))}
            </div>

            {/* グラフを描画するエリア */}
            <div className="chart-area">
              {/* 背景の横線（グリッド線） */}
              <div className="grid-lines">
                {yAxisValues.map((_, index) => (
                  <div key={index} className="grid-line horizontal" />
                ))}
              </div>

              {/* SVGでグラフを描画 */}
              <svg className="chart-svg">
                {/* 折れ線の描画 */}
                <polyline
                  className="chart-line"
                  points={data.map((d, i) => {
                    // X座標の計算（横位置を0〜100%で配置）
                    const x = (i / (data.length - 1)) * 100
                    // Y座標の計算（値を0〜100%の位置に変換）
                    const y = 100 - ((parseFloat(d.value) - minValue) / range * 100)
                    return `${x},${y}`  // 「x座標,y座標」の形式
                  }).join(' ')}  // 全ての点を空白で結合
                  fill="none"  // 塗りつぶしなし
                  stroke="#2196F3"  // 線の色（青）
                  strokeWidth="2"  // 線の太さ
                />

                {/* 平均値を示す点線 */}
                <line
                  className="average-line"
                  x1="0"  // 線の開始X座標
                  y1={100 - ((average - minValue) / range * 100)}  // Y座標（平均値の位置）
                  x2="100"  // 線の終了X座標
                  y2={100 - ((average - minValue) / range * 100)}  // Y座標（同じ高さ）
                  stroke="#FF9800"  // オレンジ色
                  strokeWidth="2"
                  strokeDasharray="5,5"  // 点線（5px線、5px空白）
                  opacity="0.8"  // 少し透明に
                />
                {/* 平均値のラベル */}
                <text
                  x="102"  // グラフの右端
                  y={100 - ((average - minValue) / range * 100)}
                  className="average-label"
                  fill="#FF9800"
                  fontSize="10"
                  alignmentBaseline="middle"
                >
                  {average.toFixed(1)}
                </text>

                {/* 各測定点の丸印と数値 */}
                {data.map((d, i) => {
                  // 各点の座標を計算
                  const x = (i / (data.length - 1)) * 100
                  const y = 100 - ((parseFloat(d.value) - minValue) / range * 100)
                  const isLatest = i === data.length - 1  // 最新データかチェック

                  return (
                    <g key={i}>  {/* SVGのグループ要素 */}
                      {/* 丸印 */}
                      <circle
                        cx={x}  // 中心のX座標
                        cy={y}  // 中心のY座標
                        r={isLatest ? "6" : "4"}  // 半径（最新は大きく）
                        fill={isLatest ? '#4CAF50' : '#2196F3'}  // 塗りつぶし色
                        stroke="white"  // 枠線の色
                        strokeWidth="2"  // 枠線の太さ
                        className="chart-point"
                      >
                        {/* マウスオーバー時のツールチップ */}
                        <title>{`${d.date}: ${d.value} ${unit}`}</title>
                      </circle>
                      {/* 数値ラベル（全ての点に表示） */}
                      <text
                        x={x}  // テキストのX座標
                        y={y - 10}  // テキストのY座標（少し上に）
                        textAnchor="middle"  // 中央揃え
                        className="point-label"
                        fill={isLatest ? '#4CAF50' : '#666'}  // 文字色
                        fontSize={isLatest ? "12" : "10"}  // 文字サイズ
                        fontWeight={isLatest ? "bold" : "normal"}  // 太さ
                      >
                        {d.value}
                      </text>
                    </g>
                  )
                })}
            </svg>
          </div>
        </div>

          {/* X軸（横軸）の日付ラベル */}
          <div className="x-axis-labels">
            {data.map((d, i) => {
              // 表示する日付を選別（多すぎると重なるため）
              const showLabel = data.length <= 5 ||  // 5個以下なら全部表示
                                i === 0 ||  // 最初
                                i === data.length - 1 ||  // 最後
                                (data.length > 10 && i % Math.floor(data.length / 4) === 0)  // 10個以上なら4分の1ずつ
              if (!showLabel) return null  // 表示しない場合はnullを返す
              
              return (
                <div 
                  key={i} 
                  className="x-label"
                  style={{ left: `${(i / (data.length - 1)) * 100}%` }}  // 位置を計算
                >
                  {d.date.split('-').slice(1).join('/')}  // 2025-08-09 → 08/09
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* ============ ③ 下段：履歴表 ============ */}
      <div className="history-section">
        <h4 className="history-section-title">測定履歴</h4>
        <div className="history-table-wrapper">
          <table className="history-data-table">
            {/* テーブルヘッダー */}
            <thead>
              <tr>
                <th>日付</th>
                <th>{label}</th>
                <th>変化</th>
              </tr>
            </thead>
            {/* テーブル本体 */}
            <tbody>
              {/* 配列を反転して新しい順に表示 */}
              {data.slice().reverse().map((record, index) => {
                // 前回の値を取得して変化を計算
                const prevIndex = data.length - index - 2  // 反転前の前回インデックス
                const prevValue = prevIndex >= 0 ? parseFloat(data[prevIndex].value) : null
                const currentValue = parseFloat(record.value)
                const changeValue = prevValue !== null ? currentValue - prevValue : 0  // 変化量
                const changePercent = prevValue !== null && prevValue !== 0 ? 
                  ((changeValue / Math.abs(prevValue)) * 100).toFixed(1) : '0.0'  // 変化率
                
                return (
                  <tr key={index} className={index === 0 ? 'latest-row' : ''}>  {/* 最新行に特別なクラス */}
                    <td className="date-column">{record.date}</td>
                    <td className="value-column">{record.value}{unit}</td>
                    <td className={`change-column ${changeValue === 0 ? '' : changeValue > 0 ? 'positive' : 'negative'}`}>
                      {changeValue >= 0 ? '+' : ''}{changeValue.toFixed(1)}{unit}
                      <span className="change-percent">({changePercent}%)</span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default MeasurementChart