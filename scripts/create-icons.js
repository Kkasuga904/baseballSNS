/**
 * 簡易的なアイコン生成スクリプト
 * Node.jsで実行して基本的なPNGアイコンを生成
 */

const fs = require('fs');
const path = require('path');

// 1x1ピクセルの緑色PNG画像（最小限のプレースホルダー）
const greenPixelPNG = Buffer.from([
  0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, // PNG signature
  0x00, 0x00, 0x00, 0x0D, 0x49, 0x48, 0x44, 0x52, // IHDR chunk
  0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
  0x08, 0x02, 0x00, 0x00, 0x00, 0x90, 0x77, 0x53,
  0xDE, 0x00, 0x00, 0x00, 0x0C, 0x49, 0x44, 0x41, // IDAT chunk
  0x54, 0x08, 0xD7, 0x63, 0x60, 0xA8, 0x36, 0x00,
  0x00, 0x00, 0x05, 0x00, 0x01, 0x0D, 0x0A, 0x2D,
  0xB4, 0x00, 0x00, 0x00, 0x00, 0x49, 0x45, 0x4E, // IEND chunk
  0x44, 0xAE, 0x42, 0x60, 0x82
]);

const publicDir = path.join(__dirname, '..', 'public');

// 必要なアイコンサイズ
const sizes = [
  '16x16', '32x32', '48x48', '72x72', '96x96', 
  '120x120', '144x144', '152x152', '167x167', 
  '180x180', '192x192', '512x512'
];

// 各サイズのプレースホルダーPNGを作成
sizes.forEach(size => {
  const filename = `icon-${size}.png`;
  const filepath = path.join(publicDir, filename);
  
  if (!fs.existsSync(filepath)) {
    fs.writeFileSync(filepath, greenPixelPNG);
    console.log(`Created: ${filename}`);
  }
});

// apple-touch-icon.pngも作成
const appleTouchIconPath = path.join(publicDir, 'apple-touch-icon.png');
if (!fs.existsSync(appleTouchIconPath)) {
  fs.writeFileSync(appleTouchIconPath, greenPixelPNG);
  console.log('Created: apple-touch-icon.png');
}

console.log('\n✅ アイコンプレースホルダーの作成が完了しました。');
console.log('実際のアイコンを生成するには、ブラウザで /generate-icons-safari.html を開いてください。');