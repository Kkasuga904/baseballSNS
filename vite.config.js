/**
 * vite.config.js - Viteビルドツールの設定ファイル
 * 
 * Viteは高速な開発サーバーと最適化されたビルドを提供する
 * 次世代のフロントエンドビルドツールです。
 * 
 * このファイルでは以下の設定を行っています：
 * - React プラグインの設定
 * - 開発サーバーの設定
 * - 本番ビルドの最適化
 * - コード分割設定
 * - Vercel向けの最適化
 */

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Viteの設定をエクスポート
export default defineConfig({
  /**
   * プラグイン設定
   * @vitejs/plugin-react: ReactのJSX変換とFast Refreshを有効化
   */
  plugins: [react()],
  
  /**
   * 開発サーバーの設定
   */
  server: {
    port: 3000, // 開発サーバーのポート番号（デフォルト: 5173から変更）
    
    /**
     * Service Worker関連のヘッダー設定
     * 開発環境でもService WorkerのMIMEタイプを正しく設定
     */
    headers: {
      '/sw.js': {
        'Content-Type': 'application/javascript',
      },
      '/sw-dev.js': {
        'Content-Type': 'application/javascript',
      }
    }
  },
  
  /**
   * ビルド設定
   * 本番環境向けの最適化オプション
   */
  build: {
    /**
     * Service Workerファイルの処理設定
     * publicディレクトリのファイルはそのままコピー
     */
    assetsInlineLimit: 0, // インライン化を無効化
    /**
     * Rollupのオプション
     * Rollupは内部で使用されるバンドラー
     */
    rollupOptions: {
      output: {
        /**
         * 手動チャンク分割設定
         * ベンダーライブラリを別ファイルに分離してキャッシュ効率を向上
         * 
         * react-vendor.js: React関連のライブラリをまとめる
         * - react: Reactコアライブラリ
         * - react-dom: ReactのDOM操作ライブラリ
         * - react-router-dom: ルーティングライブラリ
         * 
         * これによりアプリケーションコードを変更しても
         * Reactライブラリのキャッシュが有効に保たれる
         */
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
        },
      },
    },
    
    /**
     * Vercel向けの最適化設定
     */
    // ビルドターゲット: 最新のJavaScript機能を使用
    target: 'esnext',
    
    // ミニファイ設定: Terserを使用（デフォルトはesbuild）
    minify: 'terser',
    
    /**
     * Terserの詳細設定
     * コード圧縮とデバッグコードの削除
     */
    terserOptions: {
      compress: {
        drop_console: true,    // console.log()を削除（本番環境でのログ出力防止）
        drop_debugger: true,   // debugger文を削除
      },
    },
  },
  
  /**
   * グローバル定数の定義
   * process.envを空オブジェクトとして定義
   * （一部のライブラリがNode.js環境変数を参照するため）
   */
  define: {
    'process.env': {},
  },
  
  /**
   * モジュール解決の設定
   * インポートパスのエイリアス設定
   */
  resolve: {
    alias: {
      '@': '/src', // @/components/... のように使用可能
    },
  },
  
  /**
   * 静的アセットディレクトリの指定
   * publicディレクトリ内のファイルは/から直接アクセス可能
   * 例: /icon.svg, /manifest.json など
   */
  publicDir: 'public',
  
  /**
   * 最適化設定
   */
  optimizeDeps: {
    // Service Workerファイルを最適化から除外
    exclude: ['sw.js', 'sw-dev.js']
  }
})

/**
 * 補足情報:
 * 
 * 1. Fast Refresh（高速リフレッシュ）
 *    React プラグインにより、コンポーネントの状態を保持したまま
 *    コードの変更が即座に反映される
 * 
 * 2. ESモジュール
 *    Viteは開発時にESモジュールをネイティブに使用し、
 *    バンドル不要で高速な開発体験を提供
 * 
 * 3. 本番ビルド
 *    Rollupを使用して最適化されたバンドルを生成
 *    Tree-shaking、コード分割、圧縮などが自動で適用される
 * 
 * 4. Vercelデプロイ
 *    この設定はVercelのビルド環境に最適化されており、
 *    自動的にキャッシュやCDN配信が行われる
 */