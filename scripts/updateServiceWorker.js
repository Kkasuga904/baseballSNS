/**
 * Service Workerのバージョンを自動更新するスクリプト
 * ビルド時に実行して、デプロイごとに新しいバージョンを生成
 * 
 * 使用方法:
 * - npm run build 時に自動実行（prebuildスクリプト）
 * - 手動実行: npm run update-sw
 */

// CommonJS形式でインポート（Node.jsの標準的な方法）
const fs = require('fs');
const path = require('path');

const swPath = path.join(__dirname, '../public/sw.js');

// 現在の日時をバージョンとして使用
const version = new Date().toISOString().replace(/[:.]/g, '-');

// Service Workerファイルを読み込み
let swContent = fs.readFileSync(swPath, 'utf-8');

// CACHE_VERSIONを更新
swContent = swContent.replace(
  /const CACHE_VERSION = ['"].*['"]/,
  `const CACHE_VERSION = '${version}'`
);

// ファイルを書き込み
fs.writeFileSync(swPath, swContent);

console.log(`Service Worker version updated to: ${version}`);