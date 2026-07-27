# Cloudflare移行用スクリプト

Supabaseの動画データを、Cloudflareポータルの移行CLIで取り込めるJSONに出力します。

```bash
set -a; source .env.local; set +a
node scripts/export-for-cloudflare.mjs > /tmp/text-tube-export.json
node /Users/hiraku/Practice/watch-list/scripts/import-text-tube.mjs /tmp/text-tube-export.json https://portal.example.com
```

本文は移行時にポータルのR2へ保存されます。エクスポートファイルは移行完了後に不要なら削除してください。
