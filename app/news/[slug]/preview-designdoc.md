# ニュース記事ライブプレビュー実装方針

## 目的

- `app/news/articles/*.md` を編集しながら、`npm run dev` 中のブラウザでほぼ即時に反映を確認できるようにする
- 既存の `/news`、`/news/[slug]`、トップページ、`sitemap.xml` の本番向け静的生成フローは維持する
- Cloudflare Pages での `next build` / ホスティング時には、このプレビュー機構が挙動や成果物に影響しないようにする

## 現状整理

- 記事本体は `app/news/articles/*.md`
- 読み込みは `lib/news.ts` の `fs.readFileSync` + `gray-matter`
- 一覧は `getSortedArticlesData()`
- 詳細は `getArticleData(id)`
- 詳細ページ `app/news/[slug]/page.tsx` は `generateStaticParams()` + `dynamic = 'force-static'`

このため、本番要件には合っているが、Markdown ファイル更新を Next.js の通常 HMR が必ずしも監視しない。特に `force-static` な詳細ページは、開発中に「保存した Markdown が自動で画面へ反映される」体験に向かない。

## 方針

### 1. 本番ルートはそのまま残す

- `app/news/page.tsx`
- `app/page.tsx`
- `app/news/[slug]/page.tsx`
- `app/sitemap.xml/route.ts`

これらは今の Markdown 読み込みロジックを使い続ける。
本番では従来どおり、ビルド時点の `.md` 内容で静的生成する。

### 2. 開発専用のプレビュー経路を追加する

追加候補:

- `app/news/preview/[slug]/page.tsx`
- `app/api/news/preview/route.ts`

役割:

- `/news/preview/[slug]` は開発中の記事確認専用ページ
- `/api/news/preview?slug=...` は最新の Markdown を都度 `fs` で読み直して JSON を返す

この preview ルートは以下にする:

- `dynamic = 'force-dynamic'`
- `fetch(..., { cache: 'no-store' })` または route handler 側で no-store を明示
- `process.env.NODE_ENV !== 'development'` では 404 もしくはアクセス不可にする

これにより Cloudflare Pages 本番では preview 機構は実質無効化される。

## 反映方式

### 推奨: dev 限定のクライアント再取得

`/news/preview/[slug]` は client component を 1 つ噛ませ、一定間隔で preview API を再取得する。

- 初回表示時に記事を取得
- 以後 1000ms 前後で再取得
- 差分があれば再描画

これなら Next.js の HMR が Markdown ファイル自体を監視しなくても、保存した内容がブラウザへ自動反映される。

補足:

- これは厳密には「React Fast Refresh」ではなく「live preview / auto refresh」
- ただし目的である「記事を書きながら保存内容をすぐ確認する」は満たせる

### 代替案: `fs.watch` / SSE

よりリアルタイムにしたい場合は:

- `app/api/news/preview-events/route.ts`
- `fs.watch(app/news/articles)`
- `EventSource`

で push 通知も可能。
ただし実装が重く、開発用としては polling のほうが単純で壊れにくい。
最初の実装は polling を推奨する。

## ロジック分割案

`lib/news.ts` を少し整理する。

### 追加したい関数

- `getAllArticleSlugs()`
- `getArticleMetaFromFile(fileName: string)`
- `getArticleData(id: string, options?: { preview?: boolean })`

ただし preview 用に特殊処理を増やしすぎる必要はない。
基本は既存の `getSortedArticlesData()` / `getArticleData()` をそのまま route handler から呼べばよい。

必要なのは「どこで static に読むか」「どこで dynamic / no-store に読むか」を分離すること。

## 画面構成案

### `app/news/preview/[slug]/page.tsx`

- 開発専用ページ
- slug を受け取る
- `process.env.NODE_ENV !== 'development'` なら `notFound()`
- preview client component を描画

### `app/news/[slug]/PreviewArticleClient.tsx`

- `useEffect` で preview API を定期取得
- 取得した `title`, `date`, `author`, `excerpt`, `content` を state 管理
- Markdown 描画部分は既存の `app/news/[slug]/page.tsx` と同じ `ReactMarkdown` / `CodeBlock` 設定を使い回す

重複を避けるため、本文表示部分は共通 component 化してよい。

例:

- `app/news/_components/ArticleMarkdown.tsx`
- `app/news/_components/ArticleHeader.tsx`

## API 仕様案

### `GET /api/news/preview?slug={slug}`

レスポンス例:

```json
{
  "id": "2026-03-09-free-in-kanazawa",
  "title": "記事タイトル",
  "date": "2026-03-09",
  "author": "Digitart",
  "excerpt": "概要",
  "content": "# 本文"
}
```

要件:

- `NODE_ENV !== 'development'` では 404
- slug 未指定は 400
- 記事なしは 404
- `Cache-Control: no-store`

## Cloudflare Pages への影響

本番影響を避けるポイントは以下。

- 既存の公開ルート `/news/[slug]` は引き続き静的生成
- preview ルートは dev 以外で無効
- sitemap には preview ルートを載せない
- トップページや一覧ページの本番ロジックは変更しない

つまり、Cloudflare Pages 上では今までどおり:

- Markdown を追加
- `next build`
- 静的ページとして配信

のまま運用できる。

## 実装ステップ

1. `app/news/preview/[slug]/page.tsx` を追加する
2. `app/api/news/preview/route.ts` を追加する
3. 既存詳細ページから Markdown 描画部分を共通 component に切り出す
4. preview client component を作り、定期再取得で自動更新する
5. 開発時だけ preview への導線を出す

導線候補:

- 通常記事ページの上部に `開発用プレビューを開く` リンクを dev 限定表示
- 一覧ページで dev 時のみ `/news/preview/[slug]` への補助リンクを表示

## 非推奨案

### 既存 `/news/[slug]` を dev 時だけ dynamic に切り替える

避けたい理由:

- route segment config は静的に扱う前提が強い
- 本番用ページと開発用ページの責務が混ざる
- `generateStaticParams()` との関係が不明瞭になりやすい

本番ルートと preview ルートを分けたほうが安全。

## 結論

採用方針は以下。

- 公開用の `/news/[slug]` は今のまま static
- 開発専用の `/news/preview/[slug]` を追加
- preview は `force-dynamic` + `no-store` + 定期再取得
- production / Cloudflare Pages では preview を無効化

これが最も単純で、既存構成を壊さず、Markdown 執筆時の確認速度だけを改善できる。
