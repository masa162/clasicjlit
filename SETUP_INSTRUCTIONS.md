# セットアップ手順 / Setup Instructions

このドキュメントは、プロジェクトのセットアップ手順を詳しく説明します。

---

## 📋 前提条件 / Prerequisites

- Node.js 18以上
- npm または yarn
- Cloudflareアカウント
- Git

---

## 🚀 初回セットアップ

### 1. リポジトリのクローン

```bash
cd D:\github\clasicjlit
```

### 2. 依存関係のインストール

```bash
npm install
```

### 3. Wrangler（Cloudflare CLI）のインストールと認証

```bash
# グローバルインストール（推奨）
npm install -g wrangler

# Cloudflareアカウントでログイン
wrangler login
```

### 4. 環境変数の設定

プロジェクトルートに `.env.local` ファイルを作成：

```env
BASIC_AUTH_USER=admin
BASIC_AUTH_PASS=your-secure-password-here
NODE_ENV=development
```

### 5. Cloudflare D1 データベースのセットアップ

```bash
# データベースが存在しない場合は作成
npx wrangler d1 create clasicjlit-db

# 出力されたdatabase_idをwrangler.tomlに設定（既に設定済みの場合はスキップ）

# マイグレーションの実行（ローカル）
npx wrangler d1 migrations apply clasicjlit-db --local

# マイグレーションの実行（リモート/本番）
npx wrangler d1 migrations apply clasicjlit-db --remote
```

### 6. Cloudflare R2 ストレージのセットアップ

```bash
# R2バケットが存在しない場合は作成
npx wrangler r2 bucket create clasicjlit-audio
npx wrangler r2 bucket create clasicjlit-audio-preview

# バケット名をwrangler.tomlに設定（既に設定済み）
```

---

## 💻 開発環境の起動

### オプション1: 通常のNext.js開発サーバー（推奨しない）

```bash
npm run dev
```

⚠️ この方法ではCloudflareバインディング（D1、R2）が利用できません。

### オプション2: Wranglerを使用した開発サーバー（推奨）

```bash
# ビルドしてプレビュー
npm run preview

# または個別に
npm run pages:build
npx wrangler pages dev .vercel/output/static
```

✅ Cloudflareバインディングが正しく動作します。

---

## 📊 データベース操作

### マイグレーションファイルの作成

```bash
# 新しいマイグレーションファイルを作成
# db/migrations/ に手動で作成し、番号を増やす
# 例: 0001_add_featured_column.sql
```

### データベースの確認

```bash
# ローカルDBの内容を確認
npx wrangler d1 execute clasicjlit-db --local --command "SELECT * FROM works"

# リモートDBの内容を確認
npx wrangler d1 execute clasicjlit-db --remote --command "SELECT * FROM works"
```

### データベースのリセット（注意）

```bash
# ローカルDBをリセット
rm -rf .wrangler/state/v3/d1/

# マイグレーションを再実行
npx wrangler d1 migrations apply clasicjlit-db --local
```

---

## 🎨 開発時のヒント

### TypeScript型チェック

```bash
npx tsc --noEmit
```

### リンターの実行

```bash
npm run lint
```

### フォーマッター（推奨: Prettier）

```bash
# Prettierをインストール（オプション）
npm install -D prettier
npx prettier --write "src/**/*.{ts,tsx}"
```

---

## 🚢 デプロイ

### Cloudflare Pagesへのデプロイ

```bash
# ビルドとデプロイ
npm run deploy

# または手動で
npm run pages:build
npx wrangler pages deploy .vercel/output/static --project-name=clasicjlit
```

### GitHub連携の設定

1. Cloudflare Pagesダッシュボードにアクセス
2. "Create a project" → "Connect to Git"
3. リポジトリを選択
4. ビルド設定:
   - Build command: `npm run pages:build`
   - Build output directory: `.vercel/output/static`
5. 環境変数を設定:
   - `BASIC_AUTH_USER`
   - `BASIC_AUTH_PASS`

---

## 🔧 トラブルシューティング

### 問題: D1バインディングが見つからない

**解決策:**
- `wrangler pages dev` を使用していることを確認
- `wrangler.toml` のバインディング設定を確認

### 問題: R2にアップロードできない

**解決策:**
- R2バケットが作成されているか確認
- `wrangler.toml` のR2バインディングを確認
- Cloudflareアカウントの権限を確認

### 問題: マイグレーションが失敗する

**解決策:**
```bash
# マイグレーション履歴を確認
npx wrangler d1 migrations list clasicjlit-db --local

# 必要に応じてローカルDBをリセット
rm -rf .wrangler/state/v3/d1/
npx wrangler d1 migrations apply clasicjlit-db --local
```

---

## 📚 参考リンク

- [Next.js Documentation](https://nextjs.org/docs)
- [Cloudflare Pages](https://developers.cloudflare.com/pages)
- [Cloudflare D1](https://developers.cloudflare.com/d1)
- [Cloudflare R2](https://developers.cloudflare.com/r2)
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler)

---

## 💡 追加情報

### サンプルデータの投入

開発用のサンプルデータを投入する場合は、`db/seeds/` ディレクトリを作成して
SQLファイルを配置し、以下のコマンドで実行：

```bash
npx wrangler d1 execute clasicjlit-db --local --file=db/seeds/sample_data.sql
```

### カスタムドメインの設定

Cloudflare Pagesダッシュボードから:
1. プロジェクトを選択
2. "Custom domains" タブ
3. ドメインを追加してDNS設定を行う

---

**サポートが必要な場合は、プロジェクトドキュメント（`docs/`）を参照してください。**

