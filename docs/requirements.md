# Digitart.jp 要件定義書・実装仕様書

最終更新: 2026-09-23  
対象: `Digitart_HP`   
対象サイト: [Digitart テクノロジー愛好会](https://www.digitart.jp)

## 1. 文書の目的

本書は、青山学院大学公認学生団体「Digitart テクノロジー愛好会」の公式Webサイトについて、サイトの目的、利用者、画面要件、コンテンツ構造、システム構成、運用方法を一つにまとめた要件定義書・実装仕様書である。

実装と本書が異なる場合は、変更内容を確認したうえで、同一の変更単位で本書も更新する。

## 2. サイト概要

### 2.1 目的

- Digitartの活動内容、作品、イベント、沿革、活動データを学内外へ伝える
- 入会を検討する学生に、活動内容・参加方法・問い合わせ方法先を提供する
- 団体の最新情報をニュース記事として発信する
- 公式SNS、問い合わせフォーム、入会フローへの導線を集約する
- 検索エンジンやSNSで共有された際に、団体情報が正しく伝わるようにする

### 2.2 想定利用者

| 利用者 | 主な目的 |
| --- | --- |
| 入会検討者・一般 | 概要、活動内容、団体情報、イベント、入会方法の確認 |
| 在籍メンバー |  概要、活動内容、団体情報、イベント、ニュース投稿|
| 大学・外部関係者 | 団体の概要、実績、連絡先を確認する |

### 2.3 サイト基本情報

- サイト名: `Digitart テクノロジー愛好会`
- 所属: 青山学院大学公認学生団体
- 主な活動領域: プログラミング、ゲーム開発、AI/機械学習、デザイン、ハードウェア
- 正式URL: `https://www.digitart.jp`
- 対応言語: 日本語を基本とする
- 外部導線: 問い合わせ・入会フォーム、X、Instagram

## 3. サイトマップ・画面要件

### 3.1 公開画面

| パス | タイトル | 主な内容 |
| --- | --- | --- |
| `/` | - | ヒーロー、直近イベント、トピックス、最新ニュース、入会導線 |
| `/about` | Digitartについて | 団体概要、活動領域、下位ページへのナビゲーション |
| `/about/events` | 年間行事 | 年間行事、定例活動、活動場所、月別イベント状況 |
| `/about/works` | 作品紹介 | メンバー制作のゲーム・Webアプリ・作品紹介、技術スタック、外部リンク |
| `/about/history` | 団体のあゆみ | 2019年の設立から現在までの沿革タイムライン |
| `/about/data` | 活動データ | メンバー数、創立年数、活動回数、イベント数、Discord関連の統計、内訳グラフ |
| `/about/supporter` | 幹部紹介 | 第7期役員のプロフィール、役職、所属、コメント、FAQ |
| `/news` | お知らせ | ニュース一覧、カテゴリ切替、記事作成画面への導線 |
| `/news/[slug]` | （記事タイトル） | Markdown記事の本文、日付、著者、コード、数式、画像、関連記事導線 |
| `/join` | Join Us | 仮入会から正式入会までの手順、入会費、問い合わせ先、活動概要 |
| `/bylaws` | Digitart テクノロジー愛好会 規約 | `app/bylaws/bylaws.md` を描画した団体規約 |

### 3.2 管理画面

| パス | 画面 | 要件 |
| --- | --- | --- |
| `/admin/news/login` | メンバー確認 | `ADMIN_PASSWORD` と入力値を照合し、成功時に認証Cookieを発行する |
| `/admin/news/new` | 記事作成 | 記事メタデータ入力、Markdown編集、画像挿入、プレビュー、投稿リクエスト送信 |

管理画面は一般公開サイトのヘッダー・フッターを表示しない。`/admin` 配下はMiddlewareで保護し、ログイン画面以外への未認証アクセスを `/admin/news/login` にリダイレクトする。

### 3.3 共通UI

- ヘッダー: サイトロゴ、サイト名、ドロワー形式のナビゲーション
- ナビゲーション: Home、About、News、Join Us、Bylaws、外部Contact
- About配下は子ページを折りたたみ表示する
- ホームではスクロール位置に応じてヘッダーの表示状態を切り替える
- フッター: 団体名、サイトマップ、SNS、メールアドレス、コピーライト
- 管理画面では共通ヘッダー・フッターを非表示にする

## 4. 機能要件

### 4.1 ホーム

- ヒーロー表示から団体の印象と活動領域を伝える
- `lib/events.json` のイベントから直近イベントを表示する
- About、Works、News、Join Usへのピックアップ導線を表示する
- ニュースを新しい順に表示し、ホームでは最大5件ずつ表示する
- 入会案内セクションを表示する

### 4.2 About

- 活動領域としてプログラミング、ゲーム開発、デザインを表示する
- 5つの案内カードからEvents、Works、History、Data、Supporterへ遷移できる
- モバイルでは案内カードを横スクロールでき、一定間隔で自動送りする
- スクロール表示時にMotionによるフェード・スライド演出を行う

### 4.3 イベント

- 年間行事を月・学期・説明・画像で表示する
- 対面活動、活動場所、Discord活動の概要を表示する
- 月別のイベント数に応じてカレンダー上の色を変える
- 月の範囲表記（例: `4-5月`）を解釈して集計する

### 4.4 作品

- 作品名、説明、カテゴリ、技術スタック、画像を表示する
- 外部公開URLがある作品は新しいタブで開く
- URLがない内部向け作品は画像・概要のみ表示する

### 4.5 ニュース

- `app/news/articles/*.md` を記事データとして読み込む
- ファイル名から拡張子を除いた値をslugとして使用する
- frontmatterの日付の降順で記事を並べる
- カテゴリは `notice`（お知らせ）または `column`（コラム）とする
- 記事本文はGitHub Flavored Markdown、HTML、数式、コードブロックに対応する
- 外部リンクは新しいタブで開き、内部リンクはNext.jsのLinkを使用する
- 存在しないslugは404とする
- 記事ごとにタイトル、概要、画像、パスを使用してメタデータを生成する

### 4.6 入会案内

- 仮入会フォームへの外部リンクを提供する
- Discord参加を仮入会完了までの手順として説明する
- 正式入会時の入会費を1,000円、一度きりの支払い、年会費なしとして表示する
- AuthWebAppの問い合わせフォーム、X、Instagramを問い合わせ窓口として表示する
- 活動の詳細をAboutページへ誘導する

### 4.7 ニュース投稿

1. メンバーがログイン画面でパスワードを入力する
2. サーバー側で `ADMIN_PASSWORD` と照合する
3. 成功時、`admin_auth=true` のHTTP Only Cookieを7日間発行する
4. 記事作成画面でタイトル、著者、日付、カテゴリ、slug、概要、Markdown本文を入力する
5. 画像をファイル選択、貼り付け、ドラッグ＆ドロップで本文へ挿入する
6. 左側の編集欄と右側のMarkdownプレビューを表示する
7. 投稿時にMarkdownファイルと画像をGitHub APIへ送信する
8. 記事追加用ブランチとPull Requestを作成し、管理者の承認後に公開する

投稿データのslugは、日付を接頭辞にした `{date}-{slug}` 形式で生成する。入力slugは半角英小文字、数字、ハイフンのみ許可する。

## 5. データ仕様

### 5.1 ニュース記事frontmatter

```yaml
---
title: "記事タイトル"
date: "2026-09-23"
author: "著者名"
excerpt: "一覧表示用の概要"
category: "notice"
image: "/images/articles/2026-09-23/example.png"
---
```

必須項目は `title`、`date`、`author`、`category`、本文、slug。`excerpt`、`image` は任意とする。実装では `gray-matter` でfrontmatterを分離し、本文を `react-markdown` で描画する。

### 5.2 イベントデータ

イベントは `lib/events.json` に配列として保持する。

| フィールド | 型 | 内容 |
| --- | --- | --- |
| `date` | string | `YYYY-MM-DD`形式の日付 |
| `title` | string | イベント名 |
| `type` | string | `info`、`activity`、`study`、`event`、`etc`等 |
| `time` | string | 開催時間 |
| `location` | string | 開催場所 |

### 5.3 静的コンテンツ

- ページ固有のイベント、作品、沿革、役員、統計は各ページの定数として保持する
- 規約本文は `app/bylaws/bylaws.md` に保持する
- 記事本文は `app/news/articles/` に保持する
- 記事画像・ページ画像は `app/about/assets/` または `public/images/` に保持する
- サイト名、URL、SNS、ナビゲーションは `lib/constants.ts` に集約する

## 6. システムアーキテクチャ

### 6.1 技術スタック

| 分類 | 採用技術 |
| --- | --- |
| Framework | Next.js 16.1.6 / App Router |
| UI | React 19.2.3 |
| Language | TypeScript |
| Styling | Tailwind CSS 4 / PostCSS |
| Animation | Motion |
| Icons | lucide-react |
| Markdown | gray-matter、react-markdown、remark-gfm、rehype-raw |
| 数式 | remark-math、rehype-katex |
| Code表示 | react-syntax-highlighter |
| Image | next/image、ImageWithFallback |
| Hosting | Cloudflare Pages / `@cloudflare/next-on-pages` |
| Analytics | Cloudflare Web Analytics |
| 外部連携 | GitHub REST API |

### 6.2 レイヤー構成

```text
app/                    ルーティング、ページ、Server Action、記事データ
components/             共通UI・ページUI・レイアウト部品
lib/                    定数、記事取得、GitHub連携、メタデータ生成
public/                 静的公開アセット
types/                  TypeScript型定義
docs/                   要件定義書・実装仕様書
```

### 6.3 リクエストとデータフロー

#### 公開ページ

```text
ブラウザ
  -> Next.js App Router
  -> ページコンポーネント
  -> lib/constants.ts / lib/events.json / Markdown / 画像
  -> HTML・静的アセット
```

#### ニュース投稿

```text
メンバー
  -> /admin/news/login
  -> Server ActionでADMIN_PASSWORD照合
  -> admin_auth Cookie
  -> /admin/news/new
  -> publishArticleAction
  -> GitHub REST API
  -> 記事Markdown・画像を含むブランチとPull Request
  -> 管理者がレビュー・マージ
  -> 次回ビルドでニュースを静的生成
```

現時点で `app/api` 配下に実装済みの公開APIエンドポイントはない。データ取得は原則としてビルド時のファイル読み込みで行う。

## 7. SEO・アクセシビリティ・表示要件

- `<html lang="ja">` を設定する
- サイト名、説明、キーワード、Open Graph、Twitterカードを設定する
- 記事ページは記事タイトル・概要・画像・パスから個別メタデータを生成する
- Organization JSON-LDを出力する
- Breadcrumb JSON-LDを出力する
- 画像には用途に応じたaltを設定する
- メニュー開閉ボタンに`aria-label`と`aria-expanded`を設定する
- キーボードフォーカス時の表示を確保する
- 内部リンクと外部リンクを区別し、外部リンクは`noopener noreferrer`を付ける
- モバイル幅で横スクロール・カード表示・画像・長いタイトルが破綻しないこと
- 公開ページは静的生成を基本とし、ニュース一覧・記事詳細は`force-static`を使用する

## 8. セキュリティ要件

- 管理用パスワード、GitHubアクセストークン等の秘密情報をリポジトリにコミットしない
- `ADMIN_PASSWORD` はサーバー側でのみ参照する
- `GITHUB_TOKEN` はServer Actionおよびサーバー側GitHub連携からのみ参照する
- 管理画面はMiddlewareで認証Cookieを検査する
- 認証CookieはHTTP Only、ProductionではSecure、Path `/`、有効期限7日とする
- 記事本文のHTMLを許可する箇所は、Markdown描画の仕様と信頼できる投稿者の運用を前提にする
- GitHub APIのエラーは利用者向けの投稿失敗として処理し、秘密情報をエラーメッセージに含めない

## 9. 環境変数・外部サービス

| 変数 | 必須 | 用途 |
| --- | --- | --- |
| `ADMIN_PASSWORD` | 管理画面利用時 | メンバー確認用パスワード |
| `GITHUB_TOKEN` | 投稿機能利用時 | GitHub API認証 |
| `GITHUB_OWNER` | 投稿機能利用時 | GitHubリポジトリ所有者 |
| `GITHUB_REPO` | 投稿機能利用時 | 記事を追加するリポジトリ |
| `GITHUB_BRANCH` | 任意 | Pull Requestのベースブランチ。未設定時は`main` |

外部サービスのURLは、サイト内の導線と組織情報に利用する。

- Contact: `https://auth.digitart.jp/contact`
- 仮入会: `https://auth.digitart.jp/join/form`
- X: `https://x.com/PiedPiper_AGU`
- Instagram: `https://www.instagram.com/piedpiper_aoyama`

## 10. ビルド・デプロイ要件

### 10.1 ローカル開発

```bash
npm install
npm run dev
```

### 10.2 検証

```bash
npm run lint
npm run build
```

### 10.3 Cloudflare Pages

- Next.jsを`@cloudflare/next-on-pages`でCloudflare Pages向けに変換する
- Pages出力先は`.vercel/output/static`
- Worker名は`digitart-hp-worker`
- Node.js互換フラグを有効にする
- デプロイ先の環境変数に管理用秘密情報を設定する
- GitHub APIを使う投稿機能は、デプロイ環境のServer Actionから外部通信できることを前提とする

## 11. 運用・更新規約

- 公開文言、イベント、作品、沿革、役員、統計を変更した場合は、対応するページ実装と本書の対象箇所を確認する
- ニュース追加は管理画面からPull Requestを作成し、レビュー・マージ後に公開する
- 記事のslugは既存記事と重複させない
- イベント追加・変更時は`lib/events.json`を更新する
- サイト全体の名称、SNS、ナビゲーション変更時は`lib/constants.ts`と本書を更新する
- ルート追加時はサイトマップ、ナビゲーション、フッター、本書を更新する
- 環境変数追加・変更時はデプロイ設定と本書の一覧を更新する
- 外部リンク変更時は、公開ページ、定数、JSON-LD、本文中のリンクを横断して確認する
- 仕様と実装の差分を見つけた場合は、修正または「既知の制約」に記録する

## 12. 既知の制約と今後の検討事項

- ニュース、イベント、作品、統計の多くはCMSやDBではなくソースコード・ファイルで管理する
- イベントの入力値には将来日付や「未定」を含むため、表示時の年月・開催状態の扱いを運用で確認する
- 管理画面の認証は共有パスワード方式であり、個人単位のアカウント・権限管理は行わない
- 投稿の公開はPull Requestのマージと再ビルドに依存するため、即時公開ではない
- ニュース投稿画面は画像をBase64としてServer Actionへ渡すため、画像サイズ・リクエストサイズの上限に注意する
- `app/api` に公開APIはないため、外部からのイベント取得や会員情報更新が必要になった場合はAPI設計を別途定義する
- 統計値はページ内定数であり、更新日時と集計根拠を合わせて更新する必要がある

## 13. 変更時チェックリスト

- [ ] 対応するApp Routerのページまたはコンポーネントを更新した
- [ ] 必要な画像・Markdown・JSONを追加または更新した
- [ ] ナビゲーション、フッター、サイトマップへの影響を確認した
- [ ] メタデータ、JSON-LD、外部リンクへの影響を確認した
- [ ] モバイル表示と管理画面認証への影響を確認した
- [ ] `npm run lint` を実行した
- [ ] `npm run build` を実行した
- [ ] 本書の該当箇所を更新した