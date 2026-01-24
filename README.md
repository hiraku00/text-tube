# TextTube — YouTube 動画を「読む」体験へ

YouTube の長尺動画の内容を効率的に把握するための、要約・スクリプト閲覧サイトです。動画の文字データを抽出し、整理されたテキストとして閲覧することで、**「必要な情報だけを短時間で取り出す」**タイパ（タイムパフォーマンス）を重視した視聴体験を提供します。

本プロジェクトは、[everything-claude-code](https://github.com/affaan-m/everything-claude-code) の設計思想をベースに、開発者自身が Antigravity 環境での利用に最適化させた [Antigravity Starter Kit](https://github.com/hiraku00/antigravity-starter-kit) を基盤として構築されています。AI エージェントを介した設計・実装プロセスを活用し、一貫した品質での開発を実現しています。

## 解決する課題

- **時間の節約**: 長尺動画を短時間で読める要約テキストに変換し、内容把握を高速化します。
- **情報の再利用性**: 動画内容がテキストとして整理されるため、検索やナレッジベースへの蓄積が容易になります。
- **外部ツールとの連携**: 文字取得や要約生成は既存の LLM サービスやブラウザ拡張機能で行い、そのアウトプットを「価値ある資産」として管理・閲覧するための専用 UI を提供します。

## 主な特徴

- **YouTube クローン UI**: ダークモードを基調とした、直感的で馴染みのあるナビゲーション。
- **自動読了目安計算**: テキストのボリュームから「読むのにかかる時間」を算出し、視聴（読書）の負荷を可視化。
- **コンテンツ・スタジオ**: 要約テキストや動画プロパティ（タイトル、URL、サムネイル）を効率的に追加・管理。
- **モダンなデータ基盤**: Supabase (PostgreSQL) による高速かつセキュアなデータ管理。

## 技術スタック

- **Frontend**: Next.js 15 (App Router / Turbopack)
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
- **Database**: Supabase (PostgreSQL)
- **Infrastructure**: Vercel

## 自動運用と CI/CD (Zero Config)

本プロジェクトは Vercel と GitHub の連携により、開発者の手間を最小限に抑えた以下の運用フローが適用されます。

- **Production 自動デプロイ**: `main` ブランチへの push をトリガーにビルドが実行され、成功時のみ本番環境へデプロイされます。
- **Preview デプロイ**: プルリクエスト（PR）ごとに、本番反映前の動作確認ができる独立したプレビューURLが自動生成されます。
- **ビルド時検証**: TypeScript の型チェックがビルドプロセスに含まれており、安全性が担保された状態でのみリリースが行われます。

## セットアップ手順

1. **初期設定**: `npm install`
2. **環境変数**: `.env.local.example` を参考に `.env.local` を作成し接続情報を設定。
3. **DB準備**: `supabase/schema.sql` を Supabase 上で実行。
4. **起動**: `npm run dev`

## ライセンス

MIT License
