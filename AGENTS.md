# Digitart テクノロジー愛好会 公式サイト

<https://www.digitart.jp> のリポジトリ。Next.js（App Router / TypeScript / Tailwind CSS v4）で作り、`@cloudflare/next-on-pages` で Cloudflare Pages に公開している。人間向けの説明は [README.md](README.md)。

## Build & Test

コミット前に、次をすべて実行してパスすることを確認する。CI（`.github/workflows/ci.yml`）も同じ順で実行し、lint は警告も失敗扱い。

- 整形 `npm run format:check`（直すときは `npm run format`）
- Lint `npm run lint`
- 型チェック `npm run typecheck`
- ビルド `npm run build`（記事の frontmatter と `content/*.json` の zod による検証もここで行われる）
- 動作確認: `npm run dev` で <http://localhost:3000> を開く。UI の変更は実際の画面で確認する

依存は `npm ci` で入れる。Node.js は `.node-version`（24）、npm は 11 を使い、古い npm で `package-lock.json` を書き換えない。

## Architecture

- 依存の向きは `app → features → components / lib` の一方通行。`app/` はルーティング専用で、ページの中身は `features/<機能>/` に書く。
- 機能同士（`features/A` → `features/B`）の import、親ディレクトリへの相対 import（`../`）は禁止。ESLint が検査する。
- 詳しい構成・置き場所・共通部品・コーディング規約: [docs/architecture.md](docs/architecture.md)。コードを書く前に読む。
- 画面・機能・データ・セキュリティの仕様: [docs/requirements.md](docs/requirements.md)。

### コードと docs の関係

docs は、要件から先に書いたものではなく、現在の実装を説明したもの。

- docs と実装が食い違うときは、実装を現状の正として扱う。docs の記述だけを根拠に「実装が間違っている」と判断してコードを直さない。
- 食い違いは報告する。今の作業の範囲内なら docs を実装に合わせて直し、範囲外なら PR に書くか、requirements.md の「12. 既知の制約と今後の検討事項」に記録する。
- 仕様や運用を変える変更では、docs/requirements.md・docs/architecture.md・README.md の該当箇所を同じ PR で更新する（requirements.md の「11. 運用・更新規約」）。

## Issue から開発するとき

1. 実装の前に、issue の「課題とリスク」「提案内容」を関連ファイルの実装と照らし合わせ、起こしたい差分と実装方針が妥当かを確認する。方針が実装と合わない・的外れだと判断したら、実装を始める前に報告する。
2. 方針に沿って実装する。方針と意図的に違うことをした場合は、何をなぜ変えたかを PR に書く。
3. 既存のページ・部品と、書き方や品質がそろっているかを確認する。似た処理がすでにあれば、それに合わせる。

## Review

PR のレビューでは、次の観点で確認する。項目を細かく増やすより、変更全体が設計の中でどういう位置にあるかを見失わないことを優先する。

1. issue の方針に沿った実装になっているか。違う部分があれば、その理由が PR で説明されているか。
2. 他のページ・部品の実装や品質と乖離していないか（docs/architecture.md の規約・共通部品・デザイントークンを含む）。
3. 本番に出すうえでの懸念がないか（セキュリティ、表示崩れ、既存の記事・URL への影響など）。
4. 下の「Ask first」に当たる破壊的な変更が含まれていないか。含まれていれば、PR で明示されているか。

指摘は「何が問題か」「なぜか」「どう直すか」をそろえ、直すべき問題と好みの問題を分けて書く。

## Boundaries

### Always

- 応答・コメント・ドキュメント・コミットメッセージ・PR は日本語で書く。コードのコメントは「何をしているか」より「なぜそうしているか」を書く。
- 仕様や挙動を述べる前に、一次情報（実装コード / docs / 公式ドキュメント）を確認する。
- 確認できていないことは断定しない。仕様は「推定」、実行できなかった検証は「未実施」と明記する。
- docs・実装・ユーザーの指示の間で、どちらに合わせるか判断できない矛盾がある場合は、独断せずユーザーに確認する。
- 依頼範囲外の変更を混ぜない。無関係な問題を見つけたら、修正せず報告する。
- ブランチは `main` から切り、名前は `<ユーザー名>/<種別>-<内容>` にする（例: `mimisuke/fix-issue-212`、`mimisuke/add-agents-md`）。
- コミット: `feat:` `fix:` `refactor:` `docs:` `chore:` `add:`（記事の追加）のいずれかを先頭に付け、続けて日本語で「〜する」と書く。1 コミット = 1 つの論理的変更とする。
- PR: [`.github/pull_request_template.md`](.github/pull_request_template.md) を使い、関連する issue を `#<番号>` で書く。UI を変えたときは変更前後のスクリーンショットを付ける。
- ボタン・カードなどを作る前に、docs/architecture.md の「共通部品」が使えないか確認する。色は `app/globals.css` の `@theme` のトークン（`brand-*` など）を使う。
- 外部から来るデータは zod で検証する。`any` は使わない。
- 秘密情報を扱うファイル（`ADMIN_PASSWORD`・`GITHUB_TOKEN` など）は先頭に `import "server-only";` を付ける。

### Ask first

次の変更は影響が大きいので、実装の前に確認する。実装した場合は、PR の概要に破壊的な変更として明記する。

- 公開ページの URL の変更・削除（外部からのリンクと検索結果に影響する）。
- 記事の frontmatter・`content/*.json` のスキーマの変更（既存の記事と管理画面からの投稿に影響する）。
- npm パッケージの追加・削除・メジャーバージョンの更新。
- 環境変数の追加・変更（Cloudflare Pages と GitHub Actions の設定も変える必要がある）。
- 認証（`lib/adminSession.ts`・`features/auth/`）、記事 HTML の許可リスト（`components/markdown/sanitizeSchema.ts`）、セキュリティヘッダー（`lib/securityHeaders.ts`）の変更。
- `.github/workflows/` の変更、特に `permissions` の変更。
- ビルド・デプロイ設定（`next.config.ts`・`wrangler.toml`・`public/_headers`）の変更。
- 破壊的操作（ファイルの一括削除、外部サービスへの書き込み等）の実行。

### Never

- `.env.local` の読み取り、および API キー・トークン・パスワードなどのハードコード。秘密情報をログ・エラーメッセージに含めること（requirements.md の「8. セキュリティ要件」）。
- サイトですでに公開している情報以外の、メンバーの個人情報（氏名・メールアドレス・学生番号など）をコード・記事・コミットに含めること。
- 作業ブランチ以外（特に `main`）への直接 push / merge、`force push`、`--no-verify` による hook 回避。
- lint・型チェック・ビルドを通すためだけの、ルールの無効化（`eslint-disable`・`@ts-ignore` など）や検証の弱体化。
- デバッグ用の仮コードやログのコミット。
