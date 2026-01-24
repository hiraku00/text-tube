# MCP Configurations

このフォルダに含まれる `mcp-servers.json` は、外部ツール（Model Context Protocol サーバー）の**接続設定カタログ**です。

## ⚠️ 重要：Antigravity での動作について
**このファイルは自動的には読み込まれません。**
フォルダに入っているだけでは、Antigravity はこれらのツール（GitHub, Supabase 等）に接続できません。

**このファイルの目的：**
Antigravity にツールを追加したい時に、「どのようなコマンドや引数設定が必要か」を調べるための**設定メモ（カンニングペーパー）**です。

---

## JSON ファイルの読み方

`mcp-servers.json` の中身は、「ツール名」と「起動コマンド」のリストになっています。

```json
{
  "github": {                                  // ① ツール名
    "command": "npx",                          // ② 実行コマンド
    "args": ["-y", "@modelcontextprotocol/..."] // ③ 必要な引数（パッケージ名など）
  },
  "supabase": {
    "command": "npx",
    "args": ["...", "--project-ref=YOUR_REF"]   // ④ プロジェクトIDなどの設定
  }
}
```

### 各項目の意味
- **command**: MCP サーバーを起動するためのコマンド（通常は `npx` や `docker`）。
- **args**: サーバー起動時に渡す引数。ここにパッケージ名やオプションが含まれます。
- **env**: （ある場合）APIキーなどの環境変数設定。

## どうやって使うの？（活用例）

Antigravity で「GitHub と連携したい」と思った場合：

1. このフォルダの `mcp-servers.json` を開きます。
2. `"github"` の項目を探します。
   ```json
   "github": { "command": "npx", "args": ["-y", "@modelcontextprotocol/server-github"] }
   ```
3. この情報を元に、Antigravity 側でツール追加の操作を行います（Antigravity の MCP 追加コマンドや設定画面で、上記の `npx ...` コマンドを入力します）。

**つまり、ここは「設定値の保管場所」として利用してください。**
