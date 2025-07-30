# 野球SNSアプリ

野球ファンのためのSNSアプリケーション。練習記録、動画投稿、スケジュール管理などの機能を提供します。

## 機能

- 📝 タイムライン投稿（通常投稿、練習記録、動画投稿）
- 🏋️ 練習記録管理（カテゴリ別、強度記録、動画付き）
- 📊 マイページ（個人記録、カレンダー表示）
- 🎥 動画アップロード機能
- 📅 スケジュール管理（iCalendarエクスポート対応）
- 🔐 ユーザー認証（メール/パスワード）

## セットアップ

### 1. 依存関係のインストール

```bash
npm install
```

### 2. Supabaseの設定

1. [Supabase](https://app.supabase.com/)でプロジェクトを作成
2. プロジェクトの設定から`API URL`と`anon key`を取得
3. `.env`ファイルを作成し、以下の内容を設定：

```env
VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

### 3. Supabaseでの認証設定

1. Supabaseダッシュボードの`Authentication`セクションへ移動
2. `Providers`でEmail認証を有効化
3. `Email Templates`で必要に応じてメールテンプレートをカスタマイズ

### 4. アプリケーションの起動

```bash
npm run dev
```

## 使用技術

- React (Vite)
- React Router
- Supabase Auth
- LocalStorage（データ永続化）

## 主要コンポーネント

### 認証関連
- `Login.jsx` - ログイン画面
- `Signup.jsx` - 新規登録画面
- `ForgotPassword.jsx` - パスワードリセット
- `AuthContext.jsx` - 認証状態管理

### 投稿機能
- `PostForm.jsx` - 通常投稿フォーム
- `PracticeForm.jsx` - 練習記録フォーム
- `VideoForm.jsx` - 動画投稿フォーム

### 表示機能
- `Timeline.jsx` - タイムライン表示
- `MyPage.jsx` - マイページ
- `PracticeCalendar.jsx` - カレンダー表示

## 開発時の注意事項

- Supabaseの認証情報は必ず環境変数で管理してください
- `.env`ファイルはGitにコミットしないでください
- 本番環境では適切なCORS設定を行ってください