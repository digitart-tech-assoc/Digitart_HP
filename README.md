# Digitart テクノロジー愛好会 公式サイト

青山学院大学公認学生団体「Digitart テクノロジー愛好会」の公式サイト（<https://www.digitart.jp>）のリポジトリです。
Next.js（App Router）で作り、Cloudflare Pages で公開しています。

## ドキュメント

| ドキュメント | 内容 |
|---|---|
| [docs/architecture.md](docs/architecture.md) | ディレクトリ構成・依存ルール・コーディング規約・テスト。**コードを書く前に読んでください** |
| [docs/requirements.md](docs/requirements.md) | サイトの要件定義・実装仕様（画面・機能・データ・セキュリティ・運用） |

## セットアップ

必要なもの：Node.js 24（CI と同じバージョン）・npm 11

```bash
npm ci
npm run dev
```

<http://localhost:3000> で確認できます。

> [!NOTE]
> `package-lock.json` は npm 11 で更新しています。古い npm（7 など）で `npm install` すると lockfile の形式が変わり、大きな差分が出ます。`npm -v` を確認するか、`npx npm@11 install <パッケージ>` を使ってください。

### 環境変数

公開ページの表示だけなら不要です。管理画面（記事投稿）を動かすときは、`.env.local` に次を設定します。

| 変数 | 必須 | 内容 |
|---|---|---|
| `ADMIN_PASSWORD` | 管理画面を使うとき | ログイン用の共有パスワード（本番では毎週自動で変わります） |
| `ADMIN_SESSION_SECRET` | 管理画面を使うとき | ログイン Cookie の署名鍵。32 文字以上のランダムな文字列（例：`openssl rand -base64 48`） |
| `GITHUB_TOKEN` | 記事を投稿するとき | 記事の PR を作るための Fine-grained Personal Access Token |
| `GITHUB_OWNER` | 記事を投稿するとき | リポジトリの所有者（`digitart-tech-assoc`） |
| `GITHUB_REPO` | 記事を投稿するとき | リポジトリ名（`Digitart_HP`） |
| `GITHUB_BRANCH` | 任意 | PR のベースブランチ（未設定なら `main`） |

`GITHUB_TOKEN` は、このリポジトリだけを対象にし、権限を **Contents: Read and write** と **Pull requests: Read and write** だけにしてください。Workflows の権限は付けません（理由は [docs/requirements.md](docs/requirements.md) の「8. セキュリティ要件」）。

## よく使うコマンド

| コマンド | 内容 |
|---|---|
| `npm run dev` | 開発サーバーを起動 |
| `npm run format` | Prettier で整形（Tailwind のクラス順も並べ替え） |
| `npm run lint` | ESLint |
| `npm run typecheck` | 型チェック |
| `npm test` | ユニットテスト（Vitest） |
| `npm run build` | 本番ビルド（記事の frontmatter や `content/*.json` の検証もここで行われる） |
| `npm run test:e2e` | E2E のスモークテスト（Playwright）。先に `npm run build` が必要 |

PR を出すと、GitHub Actions で整形・lint・型チェック・テスト・ビルド・E2E が実行されます。すべて通るまでマージしないでください。

## 記事の投稿

### 管理画面から投稿する（おすすめ）

1. サイトの「お知らせ」ページの「記事を書く」から、管理画面（`/admin/news/login`）を開く
2. Discord で共有されているパスワードでログインする（パスワードは毎週日曜に自動で変わり、Discord に通知されます）
3. タイトル・著者・公開日・カテゴリ・ファイル名・概要を入力し、Markdown で本文を書く。画像は貼り付け・ドラッグ＆ドロップで挿入できる
4. 右側のプレビューで見た目を確認して投稿する
5. GitHub に記事の PR が自動で作られる。幹部がレビューしてマージすると、サイトに公開される

### Markdown ファイルを直接追加する

1. `content/news/YYYY-MM-DD-<英小文字・数字・ハイフン>.md` を作る
2. 先頭に frontmatter を書く

   ```yaml
   ---
   title: "記事タイトル"
   date: "2026-10-01"
   author: "著者名"
   excerpt: "一覧に表示する概要"
   category: "notice" # notice（お知らせ）または column（コラム）
   image: "/images/articles/2026-10-01/thumbnail.png" # 任意
   ---
   ```

3. 画像は `public/images/articles/<公開日>/` に置き、本文からは `/images/articles/<公開日>/<ファイル名>` で参照する
4. ブランチを作って PR を出す。frontmatter の書き間違いは CI のビルドで検出されます

## その他のコンテンツの更新

| 更新したいもの | ファイル |
|---|---|
| トップページの「直近のイベント」 | `content/events.json` |
| サークル規約 | `content/bylaws.md` |
| 年間行事・定例活動 | `content/annual-events.json`・`content/regular-activities.json` |
| 制作物・団体の歩み・活動データ・役員紹介 | `content/works.json`・`history.json`・`stats.json`・`supporters.json` |
| ナビゲーション・SNS のリンク | `lib/constants.ts` |

JSON の書き方と確認方法は、[docs/architecture.md](docs/architecture.md) の「データを追加・変更する」を見てください。

## 画像を追加するとき

画像は大きいままコミットせず、縮小・WebP 化してから追加してください。PR で 500KB を超える画像を追加すると、CI に警告が出ます。

```bash
node scripts/optimize-images.mjs          # 変換の見込みを表示する
node scripts/optimize-images.mjs --write  # 長辺 2000px までに縮小して WebP にし、コード・記事の参照も書き換える
```

記事の `image`（SNS で共有したときのサムネイル）は、WebP に対応していないサービスがあるため変換しません。管理画面から投稿した画像は、ブラウザで自動的に縮小・WebP 化されます。

## デプロイ

- Cloudflare Pages の Git 連携で、`main` へのマージ時に自動でビルド・公開されます（PR ごとにプレビュー環境も作られます）
- ビルドには `@cloudflare/next-on-pages` を使っています（設定は `wrangler.toml`）
- 管理画面のパスワード（`ADMIN_PASSWORD`）は、GitHub Actions（`.github/workflows/rotate-password.yml`）が毎週日曜 0 時（UTC）に自動で変更し、再デプロイして Discord に通知します。手動で変えたいときは、このワークフローを手動実行してください
- 上記のワークフローには、リポジトリのシークレット `CLOUDFLARE_API_TOKEN`・`CLOUDFLARE_ACCOUNT_ID`・`DISCORD_WEBHOOK` が必要です
