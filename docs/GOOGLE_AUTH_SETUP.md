# Google認証の設定方法

BaseLogでGoogle認証を有効にするには、以下の手順で設定を行ってください。

## 1. Google Cloud Consoleでの設定

1. [Google Cloud Console](https://console.cloud.google.com/)にアクセス
2. 新しいプロジェクトを作成、または既存のプロジェクトを選択
3. 「APIとサービス」→「認証情報」に移動
4. 「認証情報を作成」→「OAuthクライアントID」を選択
5. アプリケーションの種類：「ウェブアプリケーション」を選択
6. 以下の情報を入力：
   - 名前：`BaseLog`
   - 承認済みのJavaScriptオリジン：
     - `http://localhost:3000`（開発用）
     - `https://your-domain.com`（本番用）
   - 承認済みのリダイレクトURI：
     - `https://your-project-id.supabase.co/auth/v1/callback`

## 2. Supabaseでの設定

1. [Supabaseダッシュボード](https://app.supabase.com/)にログイン
2. プロジェクトを選択
3. 左メニューから「Authentication」→「Providers」を選択
4. 「Google」を有効化
5. Google Cloud ConsoleからコピーしたクライアントIDとクライアントシークレットを入力
6. 「Save」をクリック

## 3. リダイレクトURLの設定

Supabaseダッシュボードの「Authentication」→「URL Configuration」で以下を設定：

- Site URL: `http://localhost:3000`（開発用）または `https://your-domain.com`（本番用）
- Redirect URLs: 
  - `http://localhost:3000/auth/callback`
  - `https://your-domain.com/auth/callback`

## 4. 動作確認

1. BaseLogにアクセス
2. 「Googleで新規登録」または「Googleでログイン」をクリック
3. Googleアカウントの選択画面が表示される
4. アカウントを選択すると、BaseLogに自動的にリダイレクトされる
5. 初回ログイン時はプロフィール設定画面が表示される

## トラブルシューティング

### エラー：「Google認証が設定されていません」
- Supabaseの環境変数が正しく設定されているか確認
- `.env`ファイルに`VITE_SUPABASE_URL`と`VITE_SUPABASE_ANON_KEY`が設定されているか確認

### エラー：「リダイレクトURIが一致しません」
- Google Cloud ConsoleとSupabaseの両方で、正しいリダイレクトURIが設定されているか確認
- HTTPSとHTTPの違いに注意

### エラー：「認証に失敗しました」
- Google Cloud ConsoleでOAuth同意画面が設定されているか確認
- テストユーザーとして自分のメールアドレスが追加されているか確認（開発中の場合）