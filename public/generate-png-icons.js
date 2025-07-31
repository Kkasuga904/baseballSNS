/**
 * SVGアイコンからPNGアイコンを生成するスクリプト
 * Node.jsで実行: node generate-png-icons.js
 */

const fs = require('fs');
const { createCanvas, loadImage } = require('canvas');
const path = require('path');

// アイコンサイズの定義（Safari PWA対応）
const sizes = [
  { size: 192, name: 'icon-192x192.png' },
  { size: 512, name: 'icon-512x512.png' },
  { size: 180, name: 'apple-touch-icon.png' }, // iOS用
  { size: 167, name: 'icon-167x167.png' }, // iPad Pro用
  { size: 152, name: 'icon-152x152.png' }, // iPad用
  { size: 120, name: 'icon-120x120.png' }, // iPhone用
];

async function generatePNGIcons() {
  try {
    // SVGファイルを読み込む
    const svgPath = path.join(__dirname, 'icon.svg');
    const svgContent = fs.readFileSync(svgPath, 'utf8');
    
    console.log('SVGアイコンからPNGアイコンを生成中...');
    
    for (const { size, name } of sizes) {
      const canvas = createCanvas(size, size);
      const ctx = canvas.getContext('2d');
      
      // 背景を緑色に設定
      ctx.fillStyle = '#2e7d46';
      ctx.fillRect(0, 0, size, size);
      
      // 簡易的な野球ボールとBBテキストを描画
      // 白い円（野球ボール）
      ctx.fillStyle = 'white';
      ctx.beginPath();
      ctx.arc(size * 0.39, size * 0.5, size * 0.176, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = 'black';
      ctx.lineWidth = size * 0.012;
      ctx.stroke();
      
      // 赤い縫い目
      ctx.strokeStyle = '#ff4444';
      ctx.lineWidth = size * 0.01;
      ctx.beginPath();
      // 左側の縫い目
      ctx.moveTo(size * 0.33, size * 0.35);
      ctx.quadraticCurveTo(size * 0.35, size * 0.4, size * 0.35, size * 0.45);
      ctx.quadraticCurveTo(size * 0.35, size * 0.5, size * 0.33, size * 0.55);
      ctx.quadraticCurveTo(size * 0.35, size * 0.6, size * 0.35, size * 0.65);
      ctx.stroke();
      
      // 右側の縫い目
      ctx.beginPath();
      ctx.moveTo(size * 0.45, size * 0.35);
      ctx.quadraticCurveTo(size * 0.43, size * 0.4, size * 0.43, size * 0.45);
      ctx.quadraticCurveTo(size * 0.43, size * 0.5, size * 0.45, size * 0.55);
      ctx.quadraticCurveTo(size * 0.43, size * 0.6, size * 0.43, size * 0.65);
      ctx.stroke();
      
      // BBテキスト
      ctx.fillStyle = 'white';
      ctx.font = `bold ${size * 0.176}px Arial`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('BB', size * 0.68, size * 0.74);
      
      // PNGファイルとして保存
      const buffer = canvas.toBuffer('image/png');
      fs.writeFileSync(path.join(__dirname, name), buffer);
      console.log(`✓ ${name} (${size}x${size}) を生成しました`);
    }
    
    console.log('\n全てのPNGアイコンの生成が完了しました！');
    console.log('manifest.jsonを更新してください。');
    
  } catch (error) {
    console.error('エラーが発生しました:', error);
    console.log('\n手動でPNGアイコンを作成する必要があります。');
    console.log('オンラインツールを使用してicon.svgをPNGに変換してください。');
  }
}

// 簡易版：HTMLを使用してPNGアイコンを生成する方法を提示
console.log('Canvas パッケージがインストールされていない場合は、');
console.log('generate-icons.htmlをブラウザで開いてPNGアイコンを生成してください。');