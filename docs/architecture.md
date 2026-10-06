# アーキテクチャとディレクトリ構成

このドキュメントは「どこに何があるか」「新しいコードをどこに置くか」を迷わず判断できるようにするためのものです。
コードを書き始める前に一度読んでください。

## 基本方針

1. **`app/` はルーティング専用**: URL とファイルを対応させる場所です。ページの中身は `features/` に書き、`page.tsx` は薄く保ちます。
2. **機能（feature）単位でまとめる**: 「ニュース」「イベント」など機能ごとに、部品・データ読み込み・型を 1 つのディレクトリに集めます。
3. **依存の向きは一方通行**: 下の図の矢印の向きにしか `import` できません。ESLint が自動でチェックします。

```
app  →  features  →  components / lib
```

## ディレクトリ構成

```
.
├── app/                 # ルーティング専用（page.tsx / layout.tsx / route.ts など）
│   ├── (site)/          # 公開サイト。Header / Footer を持つレイアウト
│   └── (admin)/admin/   # 管理画面。専用レイアウト・認証あり
├── features/            # 機能単位のコード。普段の開発はほぼここ
│   └── <機能名>/
│       ├── components/  # その機能でだけ使う部品
│       ├── actions.ts   # Server Actions（'use server'）
│       ├── schema.ts    # 型・zod スキーマ・定数
│       ├── *.ts         # データ読み込み・外部 API 呼び出しなど
│       └── <サブ機能>/  # 大きな機能は分けてよい（例: features/news/editor/ は記事エディタ）
├── components/          # 機能に依存しない共通 UI
│   ├── ui/              # Button / SectionHeading などの汎用部品
│   ├── layout/          # Header / Footer
│   ├── sections/        # 複数ページで使うセクション（PageHero / JoinUsSection など）
│   ├── markdown/        # Markdown の表示
│   └── seo/             # 構造化データなど
├── lib/                 # ドメイン知識を持たない汎用処理（サイト定数・メタデータ・日付など）
├── content/             # コードではないもの（記事 Markdown・イベント JSON・規約など）
├── public/images/       # 画像。URL で参照する
└── docs/                # ドキュメント
```

### 依存ルール

| import する側 | import してよいもの |
|---|---|
| `app/` | `features/` `components/` `lib/` |
| `features/<A>/` | 同じ `features/<A>/` 内、`components/` `lib/` |
| `components/` | `components/` `lib/` |
| `lib/` | `lib/` のみ |

- **機能同士（`features/A` → `features/B`）は import できません。** 2 つ以上の機能で使いたくなったら `components/` か `lib/` に移してください。
- 親ディレクトリへの相対 import（`../`）は禁止です。`@/` から始まるパスで書いてください（同じディレクトリ内の `./` は OK）。

## どこに何を置くか

| 追加したいもの | 置き場所 |
|---|---|
| 新しいページ | `app/(site)/<パス>/page.tsx`（中身は `features/` 側に書く） |
| ニュース記事 | `content/news/YYYY-MM-DD-<slug>.md` |
| 記事内の画像 | `public/images/articles/<公開日>/`（管理画面から投稿すると自動で置かれる） |
| ページで使う画像 | `public/images/<ページ・機能名>/`（例: `public/images/works/`）。コードからは `/images/works/xxx.png` の文字列で参照する |
| イベント・制作物などのデータ | `content/*.json`（型とスキーマは `features/<機能>/schema.ts`。下の「データを追加・変更する」を参照） |
| 1 つの機能でだけ使う部品 | `features/<機能>/components/` |
| 2 つ以上の機能で使う部品 | `components/ui/` など |
| フォーム送信などのサーバー処理 | `features/<機能>/actions.ts` |
| 外部 API の呼び出し | `features/<機能>/<サービス名>.ts`（先頭に `import "server-only";`） |
| 色・余白などのデザイン値 | `app/globals.css` の `@theme` |

## データを追加・変更する

更新することが多いデータは、コードではなく `content/` の JSON に置いています。項目を 1 件追加するだけなら、JSON を編集するだけで済みます。

| データ | ファイル | スキーマ |
|---|---|---|
| トップページの「直近のイベント」 | `content/events.json` | `features/events/schema.ts` |
| 年間行事 | `content/annual-events.json` | `features/events/schema.ts` |
| 定例活動 | `content/regular-activities.json` | `features/events/schema.ts` |
| 制作物 | `content/works.json` | `features/works/schema.ts` |
| 団体の歩み | `content/history.json` | `features/history/schema.ts` |
| 活動データ | `content/stats.json` | `features/stats/schema.ts` |
| 役員紹介・よくある質問 | `content/supporters.json` | `features/supporters/schema.ts` |

1. 画像を使う場合は `public/images/<ページ名>/` に置き、JSON には `/images/<ページ名>/<ファイル名>` と書く
2. JSON に 1 件追加する（使える項目と書き方は、各スキーマのコメントを参照）
3. `npm test` か `npm run build` を実行する。形式の間違いや存在しない画像があると、`content/works.json の形式が不正です → at [3].url` のように、どのファイルの何件目（0 始まり）のどの項目が違うかが表示される

- アイコンや色などの見た目は JSON に書かず、文字列のキー（例：定例活動の `"icon": "calendar"`、年間行事の `"season"`）からコンポーネント側で決めます。新しいキーを使うときは、スキーマとコンポーネントの対応表の両方に追加してください
- 新しく JSON を追加するときは、`features/<機能>/schema.ts` にスキーマを書き、`server-only` のファイルから `lib/content.ts` の `parseContent` で読み込みます
- About・トップページの案内カードなど、見た目と一体になっているデータは `features/<機能>/data.ts` に残しています

## コーディング規約

| 項目 | ルール |
|---|---|
| export | `page.tsx` / `layout.tsx` など Next.js が要求するもの以外は **named export** |
| barrel ファイル | `index.ts` での再 export は作らない。ファイルを直接 import する |
| Server / Client | ページとレイアウトは Server Component。`"use client"` は操作が必要な小さな部品にだけ付ける |
| サーバー専用コード | ファイル読み込みや API トークンを扱うファイルは先頭に `import "server-only";` |
| ファイル名 | コンポーネントは `PascalCase.tsx`、それ以外は `camelCase.ts`、画像などは `kebab-case` |
| import | `@/` から始めるパスで書く。並び順は ESLint が自動で整える |
| 型 | `any` は使わない。外部から来るデータは zod で検証してから使う |
| コメント | 日本語で書く。「何をしているか」より「なぜそうしているか」を書く |

## 整形と静的チェック

| コマンド | 内容 |
|---|---|
| `npm run format` | Prettier で全ファイルを整形（Tailwind のクラス順も自動で並べ替え） |
| `npm run format:check` | 整形漏れがないか確認 |
| `npm run lint` / `npm run lint:fix` | ESLint によるチェック / 自動修正 |
| `npm run typecheck` | TypeScript の型チェック |
| `npm test` / `npm run test:watch` | ユニットテスト（Vitest）を 1 回実行 / 変更を監視して実行 |
| `npm run test:e2e` | E2E のスモークテスト（Playwright）。先に `npm run build` が必要。初回は `npx playwright install chromium` でブラウザを入れる |

PR と main への push では、GitHub Actions（`.github/workflows/ci.yml`）が `format:check`・`lint`・`typecheck`・`test`・`build`・`test:e2e` を順に実行します。lint は警告も失敗扱いです。同時に Gitleaks で、追加されたコミットにトークンなどの秘密情報が含まれていないかも検査します。ビルドでは記事の frontmatter も検証されるので、記事の PR もここで確認できます。依存パッケージの更新 PR は Dependabot が毎月作成します。

エディタで保存時に Prettier が走るよう設定しておくと楽です。改行コードは `.gitattributes` と `.editorconfig` で LF に統一しています。

## テスト

| 種類 | 置き場所 | 内容 |
|---|---|---|
| ユニットテスト（Vitest） | テスト対象と同じディレクトリに `*.test.ts(x)` | 入力の検証・データの読み込み・認証などのロジック |
| E2E（Playwright） | `e2e/*.spec.ts` | ビルドしたアプリを起動し、主要ページの表示や画面の操作を確認する |

- `server-only` を import しているファイルも、Vitest ではそのまま import できます（`vitest.config.mts` で空のモジュールに置き換えています）
- ファイルを読むコード（`features/news/articles.ts` など）は、一時ディレクトリにファイルを作り、`process.cwd()` をそこに向けてテストします
