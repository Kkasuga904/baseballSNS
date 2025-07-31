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
        // キャッシュバスティング用のファイル名設定
        entryFileNames: 'assets/[name].[hash].js',
        chunkFileNames: 'assets/[name].[hash].js',
        assetFileNames: 'assets/[name].[hash].[ext]'
      },
    },
    
    /**
     * Vercel向けの最適化設定
     */
    // ビルドターゲット: Safari 11以降をサポート
    target: ['es2015', 'safari11'],
    
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
   * Safari互換性のための環境変数定義
   */
  define: {
    'process.env': {},
    // Safari対応: import.meta.envの代替定義
    'import.meta.env.DEV': JSON.stringify(process.env.NODE_ENV === 'development'),
    'import.meta.env.PROD': JSON.stringify(process.env.NODE_ENV === 'production'),
    // Supabase環境変数のフォールバック（Safari対応）
    'import.meta.env.VITE_SUPABASE_URL': JSON.stringify(process.env.VITE_SUPABASE_URL || 'https://xyzcompanyprojectid.supabase.co'),
    'import.meta.env.VITE_SUPABASE_ANON_KEY': JSON.stringify(process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsYWNlaG9sZGVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE2MDAwMDAwMDAsImV4cCI6MTcwMDAwMDAwMH0.placeholder'),
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