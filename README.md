# TextTube

YouTube 動画の内容を「テキスト」で効率的に消費するための、YouTube 風要約閲覧サイトです。
Antigravity Starter Kit をベースに構築されており、AI 駆動型開発によって爆速で実装されました。

## 主な機能

- **YouTube 風 UI**: ダークモード、グリッドレイアウト、レスポンシブデザイン。
- **要約・スクリプト閲覧**: 動画プレイヤーの代わりに要約を表示する「読む動画」体験。
- **スタジオ機能**: 手動での要約・詳細スクリプトの登録・管理。
- **Supabase 連携**: 高速かつ堅牢なデータ保存。

## 技術スタック

- **Frontend**: Next.js 15 (App Router), Tailwind CSS v4, Lucide React
- **Backend/DB**: Supabase (PostgreSQL)
- **Deployment**: Vercel

## セットアップ手順

1. **リポジトリの準備**:
   ```bash
   git clone <your-repository-url>
   cd texttube
   ```

2. **依存関係のインストール**:
   ```bash
   npm install
   ```

3. **Supabase の設定**:
   - `supabase/schema.sql` を実行してテーブルを作成。
   - `.env.local.example` を参考に `.env.local` を作成し、プロジェクト情報を入力。

4. **開発サーバーの起動**:
   ```bash
   npm run dev
   ```

## ライセンス

MIT
