# Package.json ガイド

このファイルは `package.json` の各設定項目について説明します。
JSONファイルにはコメントを書けないため、このガイドを参照してください。

## 基本情報

```json
{
  "name": "baseball-sns-app",    // プロジェクト名
  "private": true,               // npm公開を防ぐ（プライベートプロジェクト）
  "version": "0.0.0",           // バージョン番号（セマンティックバージョニング）
  "type": "module"              // ESモジュールを使用（import/export構文）
}
```

## Scripts（npm/yarnコマンド）

```json
"scripts": {
  "dev": "vite",                // 開発サーバー起動（npm run dev）
  "build": "vite build",        // 本番用ビルド（npm run build）
  "lint": "eslint .",           // コード品質チェック（npm run lint）
  "preview": "vite preview"     // ビルド結果のプレビュー（npm run preview）
}
```

### 各コマンドの使い方：

- **npm run dev**: 開発時に使用。http://localhost:3000 で起動
- **npm run build**: デプロイ前に実行。distフォルダに最適化されたファイルを生成
- **npm run preview**: ビルド結果を確認。本番環境に近い状態でテスト

## Dependencies（本番依存関係）

アプリケーションの実行に必要なパッケージ：

```json
"dependencies": {
  "react": "^18.3.1",           // UIライブラリの中核
  "react-dom": "^18.3.1",       // ReactをDOMに描画
  "react-router-dom": "^6.28.0" // ページ遷移・ルーティング
}
```

### 各パッケージの役割：

- **react**: コンポーネント作成、状態管理、フックなど
- **react-dom**: ReactコンポーネントをHTMLに変換
- **react-router-dom**: SPA（シングルページアプリ）のルーティング

## DevDependencies（開発依存関係）

開発時のみ必要なパッケージ：

```json
"devDependencies": {
  "@eslint/js": "^9.17.0",                    // ESLintのコアルール
  "@types/react": "^18.3.17",                 // ReactのTypeScript型定義
  "@types/react-dom": "^18.3.5",              // React DOMの型定義
  "@vitejs/plugin-react": "^4.3.4",           // ViteのReactプラグイン
  "eslint": "^9.17.0",                        // コード品質チェックツール
  "eslint-plugin-react": "^7.37.2",           // React用ESLintルール
  "eslint-plugin-react-hooks": "^5.0.0",      // Reactフック用ルール
  "eslint-plugin-react-refresh": "^0.4.16",   // Fast Refresh用ルール
  "globals": "^15.14.0",                      // グローバル変数定義
  "vite": "^6.0.5"                           // ビルドツール
}
```

### 開発ツールの説明：

1. **ESLint関連**
   - コードの問題を自動検出
   - 一貫したコーディングスタイルを保証
   - バグの早期発見

2. **TypeScript型定義**
   - IDEの自動補完を改善
   - 型チェックによるバグ防止

3. **Vite**
   - 高速な開発サーバー
   - 最適化されたビルド
   - Hot Module Replacement（HMR）

## パッケージ管理のヒント

### 新しいパッケージの追加：

```bash
# 本番依存（アプリ実行に必要）
npm install パッケージ名

# 開発依存（開発時のみ必要）
npm install -D パッケージ名
```

### パッケージの更新：

```bash
# すべてのパッケージを更新
npm update

# 特定のパッケージを更新
npm update react
```

### バージョン記号の意味：

- `^18.3.1`: 18.x.xの最新版（メジャーバージョンは固定）
- `~18.3.1`: 18.3.xの最新版（マイナーバージョンは固定）
- `18.3.1`: 完全固定（推奨されない）

## よくある質問

**Q: package-lock.jsonとは？**
A: 依存関係の正確なバージョンを記録。チーム開発で重要。

**Q: node_modulesが巨大なのはなぜ？**
A: 全ての依存関係が含まれるため。.gitignoreに含めること。

**Q: npm installはいつ実行？**
A: 初回クローン時、package.json更新時、エラー時。