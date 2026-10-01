# アーキテクチャとディレクトリ構成

このドキュメントは「どこに何があるか」「新しいコードをどこに置くか」を迷わず判断できるようにするためのものです。
コードを書き始める前に一度読んでください。

> **移行中の注意**
> 現在、リポジトリは下記の構成へ段階的に移行しています。まだ移行していない部分は旧来の場所（`app/` 配下の記事や画像、`components/home` など）に残っています。
> 新しく書くコードは、このドキュメントの構成に従ってください。

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
│       └── *.ts         # データ読み込み・外部 API 呼び出しなど
├── components/          # 機能に依存しない共通 UI
│   ├── ui/              # Button / SectionHeading などの汎用部品
│   ├── layout/          # Header / Footer
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
| イベント・制作物などのデータ | `content/*.json`（型とスキーマは `features/<機能>/schema.ts`） |
| 1 つの機能でだけ使う部品 | `features/<機能>/components/` |
| 2 つ以上の機能で使う部品 | `components/ui/` など |
| フォーム送信などのサーバー処理 | `features/<機能>/actions.ts` |
| 外部 API の呼び出し | `features/<機能>/<サービス名>.ts`（先頭に `import "server-only";`） |
| 色・余白などのデザイン値 | `app/globals.css` の `@theme` |

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

エディタで保存時に Prettier が走るよう設定しておくと楽です。改行コードは `.gitattributes` と `.editorconfig` で LF に統一しています。
