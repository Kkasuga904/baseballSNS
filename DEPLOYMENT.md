# 🚀 BaseLog デプロイメントガイド

## 📋 目次
1. [環境構成](#環境構成)
2. [初期セットアップ](#初期セットアップ)
3. [開発フロー](#開発フロー)
4. [デプロイプロセス](#デプロイプロセス)
5. [環境変数](#環境変数)
6. [トラブルシューティング](#トラブルシューティング)

## 環境構成

| 環境 | URL | ブランチ | 用途 |
|------|-----|---------|------|
| Production | https://baselog.jp | `main` | 本番環境 |
| Staging | https://staging.baselog.jp | `staging` | ステージング環境（Basic認証付き） |
| Preview | PR毎に自動生成 | PRブランチ | レビュー用（Basic認証付き） |
| Local | http://localhost:3000 | - | ローカル開発 |

## 初期セットアップ

### 1. リポジトリのクローン
```bash
git clone https://github.com/Kkasuga904/baseballSNS.git
cd baseballSNS
```

### 2. 依存関係のインストール
```bash
npm install
```

### 3. 環境変数の設定
```bash
# .env.localファイルを作成（.env.exampleを参考に）
cp .env.example .env.local
# 必要な値を設定
```

### 4. 開発サーバーの起動
```bash
# 通常の開発
npm run dev

# LAN内からアクセス可能にする（モバイル実機テスト用）
npm run dev:lan

# トンネル経由で外部公開（共有用）
npm run tunnel
```

## 開発フロー

### 1. 新機能の開発

```bash
# 最新のmainを取得
git checkout main
git pull origin main

# feature ブランチを作成
git checkout -b feature/your-feature-name

# 開発・テスト
npm run dev
npm run test

# コミット
git add .
git commit -m "feat: 機能の説明"

# プッシュ
git push origin feature/your-feature-name
```

### 2. Pull Request作成

1. GitHubでPRを作成
2. テンプレートに従って内容を記載
3. 自動でプレビューURLが生成される
4. レビュアーを指定

### 3. ステージング環境への反映

```bash
# stagingブランチにマージ
git checkout staging
git merge feature/your-feature-name
git push origin staging
```

→ 自動でステージング環境にデプロイされる

### 4. 本番環境への反映

```bash
# mainブランチにマージ（PR経由）
# GitHub上でPRを作成し、承認後マージ
```

→ 自動で本番環境にデプロイされる

## デプロイプロセス

### GitHub Actions CI/CD

1. **PR作成時**
   - Lint実行
   - テスト実行
   - ビルド確認
   - プレビューデプロイ

2. **stagingブランチへのpush**
   - 全テスト実行
   - ステージング環境へデプロイ
   - Slack通知

3. **mainブランチへのpush**
   - 全テスト実行
   - 本番環境へデプロイ
   - Slack通知

## 環境変数

### Vercel設定

#### 1. プロジェクト環境変数（Vercel Dashboard）

**Production環境:**
```
REACT_APP_ENV=production
REACT_APP_API_URL=https://api.baselog.jp
REACT_APP_FIREBASE_API_KEY=[本番用キー]
REACT_APP_ENABLE_ANALYTICS=true
REACT_APP_ENABLE_SENTRY=true
REACT_APP_SHOW_ENV_BADGE=false
```

**Staging環境:**
```
REACT_APP_ENV=staging
REACT_APP_API_URL=https://api-staging.baselog.jp
REACT_APP_FIREBASE_API_KEY=[ステージング用キー]
REACT_APP_ENABLE_ANALYTICS=false
REACT_APP_ENABLE_SENTRY=true
REACT_APP_SHOW_ENV_BADGE=true
BASIC_AUTH_USER=admin
BASIC_AUTH_PASSWORD=[パスワード]
```

#### 2. GitHub Secrets設定

```
VERCEL_TOKEN         # Vercelのアクセストークン
VERCEL_ORG_ID        # VercelのOrganization ID
VERCEL_PROJECT_ID    # VercelのProject ID
SLACK_WEBHOOK        # Slack通知用Webhook URL
```

### Basic認証（Staging/Preview）

Vercelの環境変数に設定:
- `BASIC_AUTH_USER`: ユーザー名
- `BASIC_AUTH_PASSWORD`: パスワード

## モバイル実機テスト

### iOS実機テスト

1. **同一ネットワーク接続**
```bash
# LANモードで起動
npm run dev:lan

# 表示されるIPアドレスにアクセス
# 例: http://192.168.1.100:3000
```

2. **外部公開（トンネル）**
```bash
# localtunnelで公開
npm run tunnel

# 生成されたURLをモバイルで開く
```

### Android実機テスト

1. **USB接続の場合**
```bash
# ADBでポートフォワード
adb reverse tcp:3000 tcp:3000

# ChromeでアクセA
http://localhost:3000
```

2. **ネットワーク経由**
```bash
npm run dev:lan
# 表示されるIPアドレスにアクセス
```

## ブランチ保護ルール

### mainブランチ
- 直接pushを禁止
- PRレビュー必須（1人以上）
- 必須ステータスチェック:
  - build
  - test
  - lint
- 管理者も規則に従う

### stagingブランチ
- 直接pushを許可（開発チームのみ）
- CIチェック必須

## トラブルシューティング

### ビルドエラー

```bash
# キャッシュクリア
rm -rf node_modules package-lock.json
npm install
npm run build
```

### 環境変数が反映されない

1. Vercelダッシュボードで確認
2. 再デプロイを実行
```bash
vercel --prod --force
```

### Service Workerの問題

```bash
# キャッシュクリア
npm run update-sw
```

### モバイルでアクセスできない

1. ファイアウォール設定を確認
2. 同一ネットワークにあることを確認
3. ポート3000が開いていることを確認

## 📞 サポート

問題が発生した場合:
1. このドキュメントを確認
2. GitHubのIssuesを検索
3. Slackの#dev-supportチャンネルで質問

---

最終更新: 2025年1月