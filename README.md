# Digitart テクノロジー愛好会 公式サイト

青山学院大学公認学生団体「Digitart テクノロジー愛好会」の公式サイト（<https://www.digitart.jp>）のリポジトリです。
Next.js（App Router）で作り、Cloudflare Pages で公開しています。

## ドキュメント

| ドキュメント | 内容 |
|---|---|
| [docs/architecture.md](docs/architecture.md) | ディレクトリ構成・依存ルール・コーディング規約・静的チェック。**コードを書く前に読んでください** |
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
| `npm run build` | 本番ビルド（記事の frontmatter や `content/events.json` の検証もここで行われる） |

PR を出すと、GitHub Actions で整形・lint・型チェック・ビルドと、秘密情報の検出（Gitleaks）が実行されます。すべて通るまでマージしないでください。

## 記事の投稿

### 管理画面から投稿する（おすすめ）

1. サイトの「お知らせ」ページの「記事を書く」から、管理画面（`/admin/news/login`）を開く
2. Discord で共有されているパスワードでログインする（パスワードは毎週日曜に自動で変わり、Discord に通知されます）
3. タイトル・著者・公開日・カテゴリ・ファイル名・概要を入力し、Markdown で本文を書く。画像は貼り付け・ドラッグ＆ドロップで挿入できる
4. 右側のプレビューで見た目を確認して投稿する
5. GitHub に記事の PR が自動で作られる。幹部がレビューしてマージすると、サイトに公開される

### Markdown ファイルを直接追加する

GitHub のアカウントがあり、Git を使えるメンバー向けの方法です。

1. リポジトリをクローンし、記事用のブランチを作る（ブランチ名は `<自分の名前>/<内容>` の形にそろえています）

   ```bash
   git clone https://github.com/digitart-tech-assoc/Digitart_HP.git
   cd Digitart_HP
   npm ci
   git switch -c <自分の名前>/article-<slug>
   ```

2. `content/news/YYYY-MM-DD-<英小文字・数字・ハイフン>.md` を作る。ファイル名（拡張子を除く）が記事の URL（`/news/<ファイル名>`）になるので、既存の記事と重ならないようにする
3. 先頭に frontmatter を書く

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

4. 画像は `public/images/articles/<公開日>/` に置き、本文からは `/images/articles/<公開日>/<ファイル名>` で参照する
5. `npm run dev` で <http://localhost:3000/news> を開き、表示を確認する
6. コミットして push し、`main` に向けて PR を出す。コミットメッセージは `add: 記事「<タイトル>」を追加` のようにする。frontmatter の書き間違いは CI のビルドで検出されます

   ```bash
   git add content/news public/images/articles
   git commit -m "add: 記事「<タイトル>」を追加"
   git push -u origin <自分の名前>/article-<slug>
   ```

### レビューからマージまで

どちらの方法で投稿しても、公開されるのは PR がマージされたあとです。

1. PR が作られると、GitHub Actions のチェックと Cloudflare Pages のプレビュー環境のビルドが自動で始まる。PR の「Cloudflare Pages」のコメントにあるプレビュー URL から、公開後と同じ見た目を確認できる
2. 幹部が内容（誤字・表現・画像・個人情報の写り込みなど）を確認し、コメントや修正の依頼をする
3. 修正を頼まれたら、次のどちらかで直す
   - Git を使える場合：同じブランチで修正をコミットして push する（PR に自動で反映される）
   - 管理画面から投稿した場合：PR の「Files changed」から該当ファイルの「…」→「Edit file」で直接直すか、幹部に修正を頼む。管理画面から投稿し直すと別の PR になるので、元の PR は閉じてもらう
4. チェックがすべて通り、幹部が承認したら、幹部がマージする
5. `main` へのマージで Cloudflare Pages が自動でビルドし、数分後にサイトに公開される

## その他のコンテンツの更新

| 更新したいもの | ファイル |
|---|---|
| トップページの「直近のイベント」 | `content/events.json` |
| サークル規約 | `content/bylaws.md` |
| 制作物・沿革・幹部・活動データなど | `features/<機能>/data.ts` |
| ナビゲーション・SNS のリンク | `lib/constants.ts` |

詳しくは [docs/architecture.md](docs/architecture.md) の「どこに何を置くか」を見てください。

## デプロイ

- Cloudflare Pages の Git 連携で、`main` へのマージ時に自動でビルド・公開されます（PR ごとにプレビュー環境も作られます）
- ビルドには `@cloudflare/next-on-pages` を使っています（設定は `wrangler.toml`）
- 管理画面のパスワード（`ADMIN_PASSWORD`）は、GitHub Actions（`.github/workflows/rotate-password.yml`）が毎週日曜 0 時（UTC）に自動で変更し、再デプロイが終わってから Discord に通知します。手動で変えたいときは、このワークフローを手動実行してください。更新に失敗したときは Discord に失敗の通知が届くので、Actions のログを確認して手動実行し直してください
- 上記のワークフローには、リポジトリのシークレット `CLOUDFLARE_API_TOKEN`・`CLOUDFLARE_ACCOUNT_ID`・`DISCORD_WEBHOOK` が必要です
