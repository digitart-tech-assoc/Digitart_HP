# 要件定義書 — Discord 認証 / 入部フォーム / D1 + Pages

最終更新: 2026-03-06（未解決項目 A1–A4・B1–B3 解決反映）

## 目的

- 役員が Bot コマンドで入会費支払い者を `paid_members` に登録し、入部申込フォームの入力・メール OTP による本人確認を経て Discord ロール付与を行う。
- ホスティングは Cloudflare Pages（Pages Functions）と Cloudflare D1 を中心に、Bot は既存の VPS/k8s 上で稼働。
- ロール付与は Bot が行い、Pages は DB（D1）への記録と Bot への通知（events アウトボックス）を実施する。
- データ削除は「匿名化（PII を消す）」を採用し、保持期間は在学生退会:30日、卒業生退会(OB-OG):1年。

## 対象範囲

- フロントエンド: Next.js（app）上の入部申込ページ、OTP 入力ページ、管理 UI。
- Backend: Cloudflare Pages Functions（フォーム受理、paid_members 照合、OTP 発行・送信・検証、D1 書き込み、events 生成）。
- DB: Cloudflare D1
- メール: Sendinblue（トランザクショナルメール）
- Bot: 既存 VPS/k8s 上で Discord Gateway 接続・events ポーリング・ロール付与・期限切れ処理。

---

## 高レベル要件

### 機能要件

- FR1: 入会資格確認（paid_members 照合）
  - フォーム送信時に `paid_members` テーブルで discord_id を照合する。
  - 未登録の場合: エラー「入会費が未確認のため登録できません。役員にお問い合わせください。」を返す。
  - `form_submitted = 1` の場合: エラー「すでに登録済みです。」を返す。
  - Discord OAuth を必須化し、`discord_id` は OAuth セッションから取得する。state は Cloudflare KV に保存（TTL: 10 分）。

- FR2: 入部フォーム
  - 収集項目: 学生番号（必須）、氏名（本名・必須）、ふりがな（必須）、性別（必須）、電話番号（必須）、同意チェック。Discord アカウントは Discord OAuth で事前ログインして取得され、フォームでは読み取り専用で表示される。
  - 学舎・学部学科は学生番号から自動表示（読み取り専用）。学年は entry_year と現在日付から自動算出。
  - 大学メールは学生番号から自動生成する（「学生番号・メールアドレス導出ルール」節参照）。
  - 送信時に `applications` レコードを作成し、大学メールへ OTP（6桁）を送信する。

- FR3: OTP 発行・送信
  - 6 桁数字コードを生成、アプリ層でハッシュ（HMAC-SHA256）を保存、期限は 10 分。
  - Sendinblue で大学メールに送信。

- FR4: OTP 検証と登録完了
  - OTP 検証成功で `applications.verified = 1`、`verified_at` を設定。
  - `users` レコードを作成（discord_id、email を設定）。
  - `student_infos` レコードを作成（学生番号から degree_code、entry_year、graduation_date を算出）。
  - `paid_members.form_submitted = 1` を更新。
  - `events` テーブルへ `verified` イベントを追加（payload: `{ user_id, application_id }`）。

- FR5: Bot 通知（events アウトボックス）
  - Pages は検証成功時に events テーブルへイベントを追加。
  - Bot は events をポーリングして未処理イベントを取得 → Discord REST API でロール付与 → events を更新。

- FR6: paid_members 事前登録（役員 Bot コマンド）
  - 役員が Discord サーバーで `/add member @mention <amount>` コマンドを実行する。
  - Bot はコマンド実行者が Discord の「役員」ロールを持つか確認する。**役員ロールを持たない場合はエラーメッセージを返して処理を中断する。**
  - Bot が `paid_members` に入会者の discord_id、徴収した役員の discord_id（`collected_by`）、入会費（`amount`）を記録する。
  - 登録後、入会者はサークル HP の登録フォームを提出できるようになる。

- FR7: paid_members 管理
  - `/add member` コマンド実行時に Bot が `paid_members` へ記録（discord_id、collected_by、amount）。
  - フォーム提出・OTP 検証成功後に `paid_members.form_submitted = 1` を更新する。
  - 管理 UI から手動で `paid_members` レコードを追加・削除できる。

- FR8: 大学院（進学）フロー
  - ユーザーが「学部 student_no」と「修士 grad_no」を入力し、`grad_no` の大学メールへ OTP を送信して検証が通れば自動で member 更新（管理者介在なし）。

- FR10: 管理 UI
  - 未処理申請一覧、個別申請詳細、学生情報手動修正、卒業日上書き、OB-OG フラグ付与/剥奪、退会即時匿名化操作、イベント再送／監査ログ閲覧。

### 非機能要件

- NFR1: ロール付与遅延を 1 分以内に収める（目標は数秒〜数十秒）。
- NFR2: サービスコストは月 1,000 円以下を目標（Pages+D1+Sendinblue の無料枠活用）。
- NFR3: PII は必要最小限のみ保存し、匿名化は不可逆的に行う。
- NFR4: 監査ログは D1 に保存するが、PII は含めない。
- NFR5: Secrets（Bot token, HMAC secret, Sendinblue key, Bot API shared secret）は Cloudflare Secrets で管理。

---

## セキュリティ要件

- Discord OAuth を必須化する。フロントは `GET /auth/discord/start` で OAuth を開始し、state を Cloudflare KV に保存する（TTL: 10 分）。コールバックで Pages が `access_token` と `discord_id` を取得し、セッション（署名付き Cookie）に `discord_id` を保存する。
- 院進フロー本人確認: リクエスト内の `discord_id` と、`undergrad_no` に紐づく `users.discord_id` を比較して本人確認を行う。不一致の場合は HTTP 403 を返す。
- Bot コマンド認可: `/add member` は Discord の「役員」ロールを持つメンバーのみ実行可能。役員以外が実行した場合は Bot がエラーメッセージを返して処理を中断する。
- Bot → D1 アクセス: Bot（VPS/k8s）から D1 を直接操作せず、**Cloudflare Worker のプロキシエンドポイント経由**でアクセスする。プロキシ呼び出し時は `Authorization: Bearer <SHARED_SECRET>` ヘッダーで認証し、SHARED_SECRET は Cloudflare Secrets で管理する。これにより Claim トランザクションの原子性を保証する。
- Webhook/通知: events 流用のため Pages→Bot の直接公開 webhook は不要。ただし将来の拡張で webhook を使う場合は HMAC-SHA256 署名とタイムスタンプで検証。
- OTP: ハッシュ保存（HMAC-SHA256）、有効期限 10 分。リトライ制限は discord_id ベースで 5 回まで（`applications.otp_attempts`）。超過時は `applications.otp_locked = 1` を立ててアカウントをロックし、管理者による手動解除が必要。時間経過によるロック解除は行わない。
- 記録の最小化: PII にアクセスできる管理者は限定し、監査ログは PII を含めない。

---

## 学生番号・メールアドレス導出ルール

### 学生番号フォーマット

学生番号は 8 文字: `[学位コード(1)][学部・学科コード(2)][入学年度(2)][idx(3)]`

例: `15724012` → 学位コード `1`（学部）、学部・学科コード `57`（理工学部）、入学年度 `24`（2024年入学）、idx `012`

### 学位コード

| コード | 区分 | 修業年限 | 卒業日推定 |
|--------|------|----------|-----------|
| 1 | 学部 | 4年 | entry_year + 4 の 3/31 |
| 3 | 修士 | 2年 | entry_year + 2 の 3/31 |

> 将来のコード追加に備え、コード `1`〜`9` は `a`〜`i` に順次マッピングする（1=a, 2=b, 3=c, 4=d, 5=e, 6=f, 7=g, 8=h, 9=i）。現時点で確認されているのは 1（学部）と 3（修士）のみ。

### 学部・学科コード一覧

| コード | 学部 | キャンパス |
|--------|------|-----------|
| 113–119 | 文学部 | 青山 |
| 121, 122 | 経済学部 | 青山 |
| 131, 132 | 法学部 | 青山 |
| 141, 142 | 経営学部 | 青山 |
| 151–159, 15A | 理工学部 | 相模原 |
| 161–164 | 国際政治経済学部 | 青山 |
| 171 | 総合文化政策学部 | 青山 |
| 181 | 社会情報学部 | 相模原 |
| 191, 192 | 教育人間科学部 | 青山 |
| 1A1 | 地球社会共生学部 | 相模原 |
| 1B1 | コミュニティ人間科学部 | 相模原 |

> 学部・学科コードに `A`, `B` 等の英字が含まれる場合（`15A`, `1A1`, `1B1`）も、そのままの形式で照合する。

### 大学メールアドレス導出ルール

学生番号の先頭 1 文字（学位コード）を上記マッピングでアルファベットに変換し、残りの文字列を連結してドメインを付与する。

**変換式:** `email = degree_letter + student_no.slice(1) + "@aoyama.jp"`

例: `15724012` → `a5724012@aoyama.jp`

> コード `0` および英字（`A`, `B` 等）で始まる学生番号は現時点では存在しないため、入力された場合は HTTP 400 エラー（「無効な学生番号です」）を返す。

---

## D1 スキーマ（概要）

> 実装は D1（SQLite 互換）を想定。以下は CREATE TABLE の概略。

- `users`

```
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  discord_id TEXT UNIQUE,
  email TEXT,
  is_alumni INTEGER DEFAULT 0,
  withdrawn_at TEXT NULL,
  data_retention_until TEXT NULL,
  deleted INTEGER DEFAULT 0,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);
```

- `student_infos`（users に対して複数持てる。PII の永続保存先）

```
CREATE TABLE student_infos (
  id TEXT PRIMARY KEY,
  user_id TEXT REFERENCES users(id),
  student_no TEXT NOT NULL,
  name TEXT,
  furigana TEXT,
  gender TEXT,
  phone TEXT,
  degree_code INTEGER,
  entry_year INTEGER,
  graduation_date TEXT,
  expires_at TEXT,
  is_current INTEGER DEFAULT 1,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);
```

- `applications`

```
CREATE TABLE applications (
  id TEXT PRIMARY KEY,
  user_id TEXT REFERENCES users(id),  -- OTP 検証完了後に設定
  discord_id TEXT NOT NULL,
  student_no TEXT NOT NULL,
  name TEXT,
  furigana TEXT,
  gender TEXT,
  phone TEXT,
  email TEXT,                          -- 大学メールアドレス（学生番号から自動生成）
  otp_hash TEXT,
  otp_expires_at TEXT,
  otp_attempts INTEGER DEFAULT 0,
  otp_locked INTEGER DEFAULT 0,
  verified INTEGER DEFAULT 0,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  verified_at TEXT
);
```

- `paid_members`（役員 Bot コマンドで書き込み）

```
CREATE TABLE paid_members (
  id TEXT PRIMARY KEY,
  discord_id TEXT UNIQUE NOT NULL,
  collected_by TEXT NOT NULL,       -- 徴収した役員の Discord ID
  amount INTEGER NOT NULL,          -- 入会費（円）
  note TEXT,                        -- 備考（任意）
  form_submitted INTEGER DEFAULT 0, -- 登録フォーム提出・OTP 検証済みフラグ
  recorded_at TEXT DEFAULT CURRENT_TIMESTAMP
);
```

- `upgrade_requests`（大学院進学のための OTP 管理）

```
CREATE TABLE upgrade_requests (
  id TEXT PRIMARY KEY,
  user_id TEXT REFERENCES users(id),
  undergrad_no TEXT,
  grad_no TEXT,
  otp_hash_grad TEXT,
  otp_expires_at TEXT,
  status TEXT DEFAULT 'pending',
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  completed_at TEXT
);
```

- `audit_logs`

```
CREATE TABLE audit_logs (
  id TEXT PRIMARY KEY,
  action TEXT NOT NULL,        -- 操作種別: 'apply'|'verify'|'add_member'|'anonymize'|'otp_lock'|'otp_unlock'|'role_grant'|'role_revoke'|'grad_migrate'|'event_retry'
  actor_id TEXT,               -- 操作者の discord_id（システム自動処理の場合は 'system'）
  target_id TEXT,              -- 対象リソースの ID（user_id, application_id 等。PII は含めない）
  target_type TEXT,            -- 対象リソース種別: 'user'|'application'|'paid_member'|'event'
  details TEXT,                -- 補足情報（JSON）。PII を含めないこと
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_audit_logs_actor_created_at ON audit_logs(actor_id, created_at);
CREATE INDEX idx_audit_logs_target ON audit_logs(target_type, target_id);
```

**`audit_logs` 記録ルール:**
- `actor_id` は操作者の `discord_id` を設定する。Bot や CronJob による自動処理の場合は `'system'` とする。
- `target_id` は対象リソースの ID（`user_id`, `application_id` 等）のみ。メール・氏名・電話番号等の PII を含めないこと。
- `details` は JSON 文字列。追加情報（例: `{"amount": 3000, "reason": "manual"}`）を格納する。

**記録対象イベント一覧:**

| action | actor_id | target_type | 記録タイミング |
|--------|----------|-------------|----------------|
| `apply` | `'system'` | `application` | フォーム提出・applications 作成時 |
| `verify` | `'system'` | `application` | OTP 検証成功・member 登録完了時 |
| `otp_lock` | `'system'` | `application` | OTP 5回失敗でロック時 |
| `otp_unlock` | 管理者 discord_id | `application` | 管理者がロック解除時 |
| `add_member` | 役員 discord_id | `paid_member` | `/add member` コマンド実行時 |
| `role_grant` | `'system'` | `user` | Bot がロール付与成功時 |
| `role_revoke` | `'system'` | `user` | Bot がロール剥奪時 |
| `grad_migrate` | `'system'` | `user` | 院進更新完了時 |
| `anonymize` | `'system'` | `user` | 匿名化処理実行時 |
| `event_retry` | 管理者 discord_id | `event` | 管理 UI からイベント再送時 |

> 実際の D1 用 SQL（CREATE TABLE 文）は別途ファイルで出力可能。

---

## フロー詳細

---

### フロー 1: 入会費登録（役員操作）

```
役員                         Discord Bot                        D1
 |                               |                               |
 |-- /add member @user <amount> →|                               |
 |                               |-- paid_members で discord_id  |
 |                               |   重複チェック ──────────────→|
 |                               |←── 結果 ─────────────────────|
 |                               |                               |
 |                               | [重複あり]                    |
 |←── 「すでに登録済みです」 ────|                               |
 |                               |                               |
 |                               | [重複なし]                    |
 |                               |-- INSERT paid_members ───────→|
 |                               |   (discord_id, collected_by,  |
 |                               |    amount, note)              |
 |←── 「登録しました」 ──────────|                               |
```

**ユーザー側（役員）の操作:**
1. Discord サーバーの役員専用チャンネルで `/add member @対象ユーザー <入会費>` を入力する。
2. Bot から「登録しました。対象者にサークル HP での手続きを案内してください。」と返答が来ることを確認する。

**サーバー側（Bot）の処理:**
1. メンション先の `discord_id` を Discord API から取得する。
2. `paid_members` テーブルで `discord_id` の重複を確認する。
   - 重複あり → エラーメッセージを返して終了。
3. `paid_members` に INSERT する（`discord_id`, `collected_by`=実行者の discord_id, `amount`, `note`）。
4. 成功メッセージを返す。`audit_logs` に記録する。

---

### フロー 2: 入会登録フォーム提出と OTP 発行

```
入会者（ブラウザ）          Cloudflare Pages /api/apply        D1
 |                               |                               |
 |-- GET /join ─────────────────→|                               |
 |←── 登録フォーム画面 ──────────|                               |
 |                               |                               |
 | [フォーム入力]                |                               |
 | ・(Discord: OAuth セッションで自動取得) |                               |
 | ・学生番号                    |                               |
 | ・氏名・ふりがな              |                               |
 | ・性別・電話番号              |                               |
 | ・同意チェック                |                               |
 |                               |                               |
 |-- POST /api/apply ───────────→|                               |
 |                               |-- SELECT paid_members ───────→|
 |                               |   WHERE discord_id = ?        |
 |                               |←── 結果 ─────────────────────|
 |                               |                               |
 |                               | [未登録]                      |
 |←── 400「入会費未確認」 ────────|                               |
 |                               |                               |
 |                               | [form_submitted=1]            |
 |←── 400「登録済み」 ───────────|                               |
 |                               |                               |
 |                               | [照合成功]                    |
 |                               |-- 学生番号をパース            |
 |                               |   → メールアドレス導出        |
 |                               |-- OTP 生成（6桁）             |
 |                               |   HMAC-SHA256 でハッシュ化    |
 |                               |-- INSERT applications ───────→|
 |                               |   (discord_id, student_no,    |
 |                               |    name, furigana, gender,    |
 |                               |    phone, email, otp_hash,    |
 |                               |    otp_expires_at)            |
 |                               |-- Sendinblue API で OTP 送信  |
 |←── 201「OTP を送信しました」 ─|                               |
 |── OTP 入力画面へ遷移 ─────────|                               |
```

**ユーザー側（入会者）の操作:**
1. サークル HP の `/join` ページにアクセスする。
2. 以下を入力する:
  - Discord ID（OAuth セッションで自動取得）
   - 学生番号（8文字・必須）→ 学部学科・学年がリアルタイムで自動表示される
   - 氏名（本名・必須）、ふりがな（必須）、性別（必須）、電話番号（必須）
   - 個人情報の取り扱いへの同意チェック
3. 「送信」をクリックする。
4. OTP 入力画面に遷移し、大学メール（`@aoyama.jp`）に届いた6桁コードを確認する。

**サーバー側（Pages `/api/apply`）の処理:**
1. リクエストボディをバリデーションする（必須項目の欠如・学生番号フォーマット不正を検査）。
2. `paid_members` テーブルで `discord_id` を照合する。
   - 未登録 → HTTP 400 を返す。
   - `form_submitted = 1` → HTTP 400「すでに登録済みです」を返す。
3. 学生番号をパースして大学メールアドレスを導出する。
4. 暗号論的に安全な乱数で OTP（6桁）を生成し、`HMAC-SHA256(key=HMAC_SECRET, msg=application_id+":"+otp)` でハッシュ化する。
5. `applications` に INSERT する。
6. Sendinblue API で大学メールへ OTP メールを送信する。
7. HTTP 201 と `application_id` を返す。

---

### フロー 3: OTP 検証と登録完了

```
入会者（ブラウザ）        Pages /api/verify-otp          D1             Bot
 |                               |                      |               |
 |-- POST /api/verify-otp ──────→|                      |               |
 |   {application_id, otp}       |                      |               |
 |                               |-- SELECT applications→|               |
 |                               |←── レコード ─────────|               |
 |                               |                      |               |
 |                               | [otp_locked=1]       |               |
 |←── 403「ロック済み」 ──────────|                      |               |
 |                               |                      |               |
 |                               | [期限切れ]            |               |
 |←── 400「有効期限切れ」 ────────|                      |               |
 |                               |                      |               |
 |                               | HMAC 照合            |               |
 |                               | [不一致]             |               |
 |                               |-- UPDATE otp_attempts+1 ────────────→|
 |                               |   (5回以上でotp_locked=1)            |
 |←── 401「コードが違います」 ────|                      |               |
 |                               |                      |               |
 |                               | [一致] BEGIN TRANSACTION             |
 |                               |-- UPDATE applications ──────────────→|
 |                               |   verified=1, verified_at            |
 |                               |-- INSERT users ──────────────────────→|
 |                               |   (discord_id, email)                |
 |                               |-- INSERT student_infos ─────────────→|
 |                               |   (user_id, student_no, name,        |
 |                               |    furigana, gender, phone,          |
 |                               |    degree_code, entry_year,          |
 |                               |    graduation_date, expires_at)      |
 |                               |-- UPDATE paid_members ───────────────→|
 |                               |   form_submitted=1                   |
 |                               |-- INSERT events ─────────────────────→|
 |                               |   (type='verified',                  |
 |                               |    payload={user_id,application_id}) |
 |                               | COMMIT                |               |
 |←── 200「登録完了」 ────────────|                      |               |
 |                               |                      |               |
 |                               |                      |-- poll events →|
 |                               |                      |←── verified ──|
 |                               |                      |               |-- Discord API
 |                               |                      |               |   member ロール付与
 |                               |                      |-- UPDATE events status='processed'
```

**ユーザー側（入会者）の操作:**
1. 大学メールに届いた6桁コードを OTP 入力欄に入力する。
2. 「確認」をクリックする。
3. 登録完了画面が表示されたことを確認する。数秒〜1分以内に Discord でメンバーロールが付与される。
4. エラー時:
   - 「コードが違います（残り N 回）」→ 再入力する。
   - 「有効期限切れ」→ 再送信ボタンから OTP を再発行する。
   - 「ロックされています」→ 役員に連絡して管理 UI からロック解除を依頼する。

**サーバー側（Pages `/api/verify-otp`）の処理:**
1. `application_id` と `otp` を受け取り、`applications` レコードを取得する。
2. `otp_locked = 1` なら HTTP 403 を返す。
3. `otp_expires_at` が過去なら HTTP 400 を返す。
4. `HMAC-SHA256(key=HMAC_SECRET, msg=application_id+":"+otp)` を計算し `otp_hash` と比較する。
   - 不一致 → `otp_attempts` をインクリメントする。5回以上なら `otp_locked = 1` を設定。HTTP 401 を返す。
   - 一致 → トランザクションを開始:
     1. `applications`: `verified = 1`, `verified_at = now()` を更新。
     2. `users`: INSERT（`discord_id`, `email`）。
     3. `student_infos`: INSERT（`user_id`, `student_no`, `degree_code`, `entry_year`, `graduation_date`, `expires_at`, `name`, `furigana`, `gender`, `phone`, `is_current = 1`）。
     4. `paid_members`: `form_submitted = 1` を更新。
     5. `events`: INSERT（`event_type = 'verified'`, `payload = {"user_id": "...", "application_id": "..."}`）。
     6. COMMIT。
5. HTTP 200 を返す。

**サーバー側（Bot / events ポーリング）の処理:**
1. 10〜20秒間隔でポーリングし、`status = 'pending'` の events を claim する（Claim トランザクション）。
2. `event_type = 'verified'` の場合:
   1. `payload.application_id` で `applications` から `discord_id` を取得する。
   2. Discord REST API で対象ユーザーに `member` ロールを付与する。
   3. `events.status = 'processed'`, `processed_at = now()` を更新する。
3. 失敗時: `retry_count` をインクリメントし、閾値（例: 3回）超過で `status = 'failed'` に設定して `audit_logs` に記録する。

---

### フロー 4: 大学院進学（自動メンバー更新）

```
入会者（ブラウザ）         Pages /api/upgrade-to-grad           D1             Bot
 |                               |                               |               |
 |-- POST /api/upgrade-to-grad ─→|                               |               |
 |   {discord_id,                |                               |               |
 |    undergrad_no, grad_no}     |                               |               |
 |                               |-- student_no で users 検索 ──→|               |
 |                               |←── user レコード ─────────────|               |
 |                               |                               |               |
 |                               | [ユーザー未発見]              |               |
 |←── 404 ──────────────────────|                               |               |
 |                               |                               |               |
 |                               | [discord_id 不一致]           |               |
 |←── 403「本人確認失敗」 ────────|                               |               |
 |                               |                               |               |
 |                               | [grad_no が他の現役ユーザに割当済]            |
 |←── 409「競合。役員に連絡」 ───|                               |               |
 |                               |                               |               |
 |                               | grad_no → 修士メール導出      |               |
 |                               | OTP 生成・HMAC 保存            |               |
 |                               |-- INSERT upgrade_requests ───→|               |
 |                               |-- Sendinblue で OTP 送信      |               |
 |←── 201「OTP 送信」 ───────────|                               |               |
 |                               |                               |               |
 |-- POST /api/upgrade-verify ──→|                               |               |
 |   {upgrade_id, otp}           |-- HMAC 照合                   |               |
 |                               |                               |               |
 |                               | BEGIN TRANSACTION             |               |
 |                               |-- UPDATE 旧 student_infos ───→|               |
 |                               |   is_current=0                |               |
 |                               |-- INSERT 新 student_infos ───→|               |
 |                               |   (修士情報, is_current=1)    |               |
 |                               |-- UPDATE users is_alumni=0 ──→|               |
 |                               |-- UPDATE upgrade_requests ───→|               |
 |                               |   status='completed'          |               |
 |                               |-- INSERT events ─────────────→|               |
 |                               |   type='graduate_migration'   |               |
 |                               | COMMIT                        |               |
 |←── 200「院進更新完了」 ────────|                               |               |
 |                               |                               |-- poll events →|
 |                               |                               |←─ graduate_  ─|
 |                               |                               |   migration    |
 |                               |                               |               |-- Discord:
 |                               |                               |               |  OB-OGロール削除
 |                               |                               |               |  memberロール付与
```

**ユーザー側（院進者）の操作:**
1. サークル HP の院進手続きページにアクセスする。
2. OAuth でログインした状態で、学部時代の学生番号（`undergrad_no`）と修士の学生番号（`grad_no`）を入力する。
3. `grad_no` に対応する修士メール（`@aoyama.jp`）に届いた OTP を入力する。
4. 完了画面を確認し、Discord のロールが更新されることを待つ。

**サーバー側（Pages `/api/upgrade-to-grad`）の処理:**
1. セッションから `discord_id` を取得し、リクエストボディから `undergrad_no`、`grad_no` を取得する。
2. `undergrad_no` で `student_infos` → `users` を検索する。未発見なら HTTP 404。
3. 発見した `users.discord_id` と、リクエストで送られた `discord_id` を比較する。**一致しない場合は HTTP 403 を返す**（本人確認失敗）。
4. `grad_no` が他の現役ユーザー（`is_current = 1`）の `student_infos` にすでに存在する場合 → HTTP 409 を返す（管理 UI で解決）。
5. `grad_no` からメールを導出し OTP を生成・送信、`upgrade_requests` に INSERT する。

**サーバー側（Pages `/api/upgrade-verify`）の処理（トランザクション）:**
1. HMAC 照合を行い、不一致なら HTTP 401。
2. `student_infos` の旧レコード（`is_current = 1`）を `is_current = 0` に更新する。
3. `student_infos` に修士レコードを INSERT する（`degree_code=3`, `entry_year`, `graduation_date`, `expires_at` を算出）。
4. `users.is_alumni = 0` に更新する。
5. `upgrade_requests.status = 'completed'` に更新する。
6. `events` に `graduate_migration` を INSERT する（`payload: { user_id, discord_id, new_student_no, prev_student_no }`）。

**サーバー側（Bot）の処理（`graduate_migration` イベント）:**
1. `payload` から `discord_id` を取得する。
2. Discord REST API で OB-OG ロールを削除し、`member` ロールを付与する。
3. `events.status = 'processed'` を更新する。

---

### フロー 5: 自動匿名化（k8s CronJob）

```
CronJob                          Cloudflare Worker (proxy)              D1
 |                               |                                        |
 |-- POST /internal/anonymize ──→|                                        |
 |   {Authorization: SharedSecret}                                        |
 |                               |-- SELECT users WHERE                   |
 |                               |   deleted=0 AND                        |
 |                               |   data_retention_until < now() ───────→|
 |                               |←── 対象ユーザー一覧 ──────────────────|
 |                               |                                        |
 |                               | 各ユーザーに対して BEGIN TRANSACTION   |
 |                               |-- UPDATE users:                        |
 |                               |   email=NULL, deleted=1 ──────────────→|
 |                               |-- UPDATE student_infos:                |
 |                               |   name=NULL, furigana=NULL,            |
 |                               |   gender=NULL, phone=NULL ────────────→|
 |                               |-- UPDATE applications:                 |
 |                               |   name=NULL, furigana=NULL,            |
 |                               |   phone=NULL ─────────────────────────→|
 |                               |-- INSERT audit_logs:                   |
 |                               |   (type='anonymized',                  |
 |                               |    details={user_id}) ────────────────→|
 |                               | COMMIT                                 |
 |←── 200「処理件数」 ────────────|                                        |
```

**処理ルール:**
- 対象: `deleted = 0` かつ `data_retention_until < now()` のレコード。
- 在学生退会: `data_retention_until = withdrawn_at + 30 days`。
- 卒業生: `data_retention_until = graduation_date + 1 year`。
- 匿名化対象フィールド: `users.email`、`student_infos.(name, furigana, gender, phone)`、`applications.(name, furigana, phone)` を NULL に設定し `deleted = 1` を立てる。
- `audit_logs` に `user_id` のみを記録する（PII は含めない）。
- CronJob は Cloudflare Worker への HTTP リクエストを介して D1 を操作する（Bot から直接 D1 を操作しない。「レビューコメント 2-1: D1 アクセス設計」参照）。

---

## 管理 UI 要件（概要）

- 認証: Cloudflare Access を採用する。
- 機能:
  - 未処理申請一覧 / ステータス更新
  - 個別申請の詳細表示（PII はマスク）
  - 学生情報の手動編集（graduation_date 上書き）
  - OB-OG フラグ付与/剥奪
  - 退会の即時匿名化（復元不可）
  - OTP ロックされたアカウントの解除
  - イベントの再送（events の再処理）
  - 監査ログ検索・ダウンロード

---

## 運用と監視

- ロギング: 主要イベントは `audit_logs` に記録。エラーは別途ログ集約サービスへ転送可。
- バックアップ: D1 のバックアップ方針を定める（手動エクスポート or 自動化スクリプト）。
- 障害時: Bot 側が events を処理できない場合は Pages が再試行可能な状態を残す（events を残す）。管理 UI で失敗イベントの再送操作を提供。

---

## 業務ルール・ポリシー

- PII 保存期間は上記ルールに従う。退会申請により即時匿名化を行うオプションを管理 UI で提供。
- 監査ログは削除対象ユーザの PII を含めずに残す。
- OB-OG 判定は自動（卒業到達）＋管理者による手動上書きを許容。

---

## 開発ステップ（推奨順）

1. D1 スキーマのマイグレーション SQL 作成とデプロイ準備。
2. Pages Functions のエンドポイント設計と雛形実装（/api/apply, /api/verify-otp, /api/upgrade-to-grad）。
3. Sendinblue テンプレート準備と Secrets 登録。
4. Bot の events ポーリング実装（10–20 秒間隔）とロール付与ロジック。
5. 自動削除・匿名化ジョブ（k8s CronJob で Node スクリプト）。
6. 管理 UI 実装と Cloudflare Access 設定。

---

## events.payload スキーマ定義

`events.payload` は JSON 文字列。PII を含めず、識別子のみを格納する。event_type ごとの許可フィールドは以下の通り。

| event_type | payload フィールド | 説明 |
|---|---|---|
| `verified` | `user_id`, `application_id` | 入会 OTP 検証完了。Bot がメンバーロールを付与する |
| `graduate_migration` | `user_id`, `discord_id`, `new_student_no`, `prev_student_no` | 院進更新完了。Bot が OB-OG ロール削除・member ロール付与を行う |
| `role_revoke` | `user_id`, `discord_id`, `reason` | 退会・期限切れ等によるロール剥奪指示 |

> フィールドを追加する場合は必ずこの表を更新し、PII（氏名・メール・電話番号等）が含まれていないことをコードレビューで確認すること。

## Bot → D1 アクセス設計（Worker プロキシ）

Bot（VPS/k8s）は D1 バインディングを直接使用できないため、Cloudflare Worker をプロキシとして経由する。

```
Bot (VPS/k8s)
  |
  | POST https://<worker>.workers.dev/internal/events/poll
  | Authorization: Bearer <SHARED_SECRET>
  |
  ▼
Cloudflare Worker (proxy)
  |
  | D1 binding（Claim トランザクション）
  |
  ▼
Cloudflare D1
```

**プロキシエンドポイント:**

| メソッド | パス | 説明 |
|---|---|---|
| `POST` | `/internal/events/poll` | Claim トランザクションを実行し、claimed イベントを返す |
| `POST` | `/internal/events/:id/complete` | イベントを `processed` に更新する |
| `POST` | `/internal/events/:id/fail` | `retry_count` をインクリメント、閾値超過で `failed` に設定する |
| `POST` | `/internal/paid-members` | `/add member` コマンドで paid_members に INSERT する |

**認証:** 全エンドポイントで `Authorization: Bearer <SHARED_SECRET>` を必須とする。SHARED_SECRET は Cloudflare Secrets で管理し、Bot 側は環境変数として注入する。一致しない場合は HTTP 401 を返す。

## アーキテクチャ再構成（強化ポーリングを採用）

- 結論: 公開ドメインがない前提では「Bot 側のアウトバウンド接続（ポーリング）」を第一選択とする。Pages/Cloudflare 側は events をアウトボックスとして D1 に書き込み、Bot は短間隔でバッチ取得して処理する。遅延目標（<1 分）はポーリング間隔を 5–15 秒に設定すれば容易に達成できる。
- 代替（将来的な改善）: Cloudflare Tunnel（cloudflared）や Relay（Durable Object / 外部 Pub/Sub）を導入して Push を実現すると遅延をさらに短縮可能だが、運用コストと可用性管理が増える。

## D1: `events` テーブル（推奨スキーマ）

アウトボックスの信頼性と安全な排他を確保するため、`events` テーブルに状態管理・ロック用カラムを追加することを推奨します（D1/SQLite 互換 SQL）。

```
CREATE TABLE events (
  id TEXT PRIMARY KEY,
  event_type TEXT NOT NULL,
  payload TEXT NOT NULL,
  priority INTEGER DEFAULT 0,
  status TEXT DEFAULT 'pending', -- 'pending'|'claimed'|'processed'|'failed'
  claimed_by TEXT NULL,
  claim_expires_at TEXT NULL,
  retry_count INTEGER DEFAULT 0,
  last_error TEXT NULL,
  processed_at TEXT NULL,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_events_status_priority_created_at ON events(status, priority, created_at);
```

設計方針:
- `payload` は PII を含めない（`user_id` や `application_id` 等の識別子のみ）。
- `claimed_by` と `claim_expires_at` によって Bot 間の競合を防止し、失敗時には再クレーム可能にする。

## ポーリング実装指針（Bot 側）

- 推奨パラメータ: `poll_interval = 10s`（負荷に応じて 5s〜30s のレンジで可変）。
- バッチサイズ: `limit = 50`（1 回のトランザクションで複数行を claim することでクエリ数を低減）。
- Claim トランザクション（概念）:

```
BEGIN;
-- 1) 対象を原子的に claim
UPDATE events
SET status='claimed', claimed_by='bot-1', claim_expires_at=datetime('now', '+30 seconds')
WHERE id IN (
  SELECT id FROM events
  WHERE status='pending'
  ORDER BY priority DESC, created_at
  LIMIT 50
);

-- 2) 取得して処理対象を確定
SELECT * FROM events WHERE claimed_by='bot-1' AND status='claimed';
COMMIT;
```

- 各イベント処理後は成功なら `status='processed', processed_at=now()` を更新。失敗時は `retry_count` を増やし、閾値超過で `status='failed'` として管理 UI に通知。
- `claim_expires_at` を過ぎたイベントは他の Bot が再クレームできる。これにより Bot のクラッシュ対策になる。

## コスト見積りと低減策（強化ポーリング前提）

- 主要コスト要素: D1 のクエリ/ストレージ、Pages/Workers のリクエスト実行、Bot（VPS/k8s）インスタンス、Sendinblue（メール送信）。
- 概算式（概念）:
  - PollsPerMonth ≈ 2,592,000 / interval_seconds
  - DBQueriesPerMonth ≈ PollsPerMonth * queries_per_poll + EventsInsertedPerMonth * queries_per_event_write

- 参考シナリオ（仮定単価での試算）:
  - `interval = 10s`、`queries_per_poll ≈ 4` の場合、DB クエリは月 1M 前後になることが多く、D1/Worker の料金は一般的にごく小額（数十〜数百円/月相当）になる見込み。

- 低減策（実装推奨）:
  - バッチ化: 1 トランザクションで複数イベントを claim して処理する。
  - Adaptive polling: backlog が小さいときは間隔を伸ばし、大きいときは短くする。
  - Payload 最小化: `events.payload` は識別子のみ、PII は含めない。
  - 優先度制御: 高優先度イベントのみ即時処理し、残りはバッチ処理する。
  - Claim TTL の適切設定: 短めにして迅速に再クレーム可能にする（例: 30s）。

## 開発ステップ（更新）

1. D1 スキーマのマイグレーション SQL 作成（上記 `events` スキーマを含む）。
2. Pages Functions: `/api/apply`（paid_members 照合・OTP 発行）、`/api/verify-otp`（HMAC 検証・users/student_infos 作成・events 生成）を実装。
3. Sendinblue テンプレート準備と Secrets 登録（Cloudflare Secrets）。
4. Bot 側: events ポーリング実装（claim トランザクション、バッチ処理、リトライ戦略、監査ログ記録）。
5. 運用: モニタリング（events backlog、処理遅延、retry_count）、アラート、匿名化ジョブ。
6. Optional: 将来的に Cloudflare Tunnel / Relay を導入して Push モードを実装（必要に応じてフェーズ 2 として実施）。

---

追記: 本書の他のセクション（セキュリティ、保持ルール、監査ログ要件）は変更ありませんが、`events.payload` に PII を含めない点を厳守してください。

---

## 確認済み事項

- 大学メールの導出ルール: 「学生番号・メールアドレス導出ルール」節参照。
- 学位コード: 1（学部）, 3（修士）確認済。1–9 を a–i にマッピング。
- 学部コードに英字（`A`, `B`）を含む場合（`15A`, `1A1`, `1B1`）: そのまま照合・メール生成に使用する。
- 学位コードが `0` または英字始まりの学生番号: 現時点で存在しないため HTTP 400 エラーを返す。
- OTP 有効期限: 10 分。リトライ上限: discord_id ベースで 5 回。超過時は管理者解除が必要なロック（時間解除なし）。
- OB-OG 自動判定: 学位コード別の卒業日推定（「学生番号・メールアドレス導出ルール」節参照）。
- events スキーマ: 強化スキーマ（`status`/`claimed_by` 方式）に一本化。旧スキーマ廃止。
- events.payload スキーマ: event_type ごとに定義済み（「events.payload スキーマ定義」節参照）。PII 禁止。
- upgrade_requests.otp_hash_under: 廃止（旧仕様の名残のため削除）。
- 連絡先メール: 大学メールのみ。別途連絡先メールは収集しない。
- Discord OAuth を必須化する。将来にわたりセキュリティの観点から OAuth による本人確認（state: Cloudflare KV, TTL:10分）を必須とする。
- 院進フロー本人確認: リクエスト内の `discord_id` と `undergrad_no` に紐づく `users.discord_id` を比較する（不一致で HTTP 403）。
- Bot → D1 アクセス: Cloudflare Worker プロキシ経由（「Bot → D1 アクセス設計」節参照）。SHARED_SECRET で認証。
- `/add member` コマンド実行権限: Discord の「役員」ロール所持者のみ。役員以外はエラーを返す。
- Bot イベントポーリング方式: 確定（events アウトボックス）。
- audit_logs スキーマ: `actor_id`・`action`・`target_id`・`target_type` を追加済み（「D1 スキーマ」節参照）。
- メール送信: Sendinblue。
- 監査ログ: D1 に保存。
- 管理 UI: 必要。認証方式は Cloudflare Access。
- 保持期間: 退会在学生=30日、卒業生/OB-OG=1年。

## 未解決項目

現時点で未解決の事項はありません。

---

## 次に欲しい出力（選択可能）

- D1 用の完全な CREATE TABLE / ALTER SQL（マイグレーション）
- Pages Functions 各エンドポイントの詳細設計とサンプル実装（Node/JS）
- Bot のポーリング処理と各イベントハンドラの擬似コード
- 管理 UI の API 仕様とワイヤーフレーム

---
 
## 各テーブルの使用タイミングとサンプルデータ

以下は各テーブルがいつ使われるかと、理解のためのサンプル行（JSON表記）です。実装時は環境に合わせて ID 生成方法を統一してください。

- `users` — 使用タイミング: OTP 検証成功後に永続ユーザーを作成し、Bot がロール操作する対象とする。
  サンプル:
  ```json
  { "id":"000001","discord_id":"123456789012345678","email":"a5724012@aoyama.jp","is_alumni":0,"deleted":0,"created_at":"2026-03-06T12:00:00Z" }
  ```

- `student_infos` — 使用タイミング: `users` に紐づく学籍情報を保存（学部→院進の履歴保持、卒業判定、expires_at 管理）。
  サンプル:
  ```json
  { "id":"si_001","user_id":"000001","student_no":"15724012","name":"山田太郎","furigana":"やまだ たろう","gender":"M","phone":"090-1111-2222","degree_code":1,"entry_year":24,"graduation_date":"2028-03-31","expires_at":"2029-03-31","is_current":1,"created_at":"2026-03-06T12:01:00Z" }
  ```

- `applications` — 使用タイミング: フォーム提出直後に作られる一時レコード。OTP発行・検証対象。検証成功後は `users`/`student_infos` を作成する。
  サンプル:
  ```json
  { "id":"app_001","user_id":null,"discord_id":"123456789012345678","student_no":"15724012","name":"山田太郎","furigana":"やまだ たろう","gender":"M","phone":"090-1111-2222","email":"a5724012@aoyama.jp","otp_hash":"HMAC_SHA256(...)","otp_expires_at":"2026-03-06T12:10:00Z","otp_attempts":0,"otp_locked":0,"verified":0,"created_at":"2026-03-06T12:02:00Z" }
  ```

- `paid_members` — 使用タイミング: 役員が `/add member` で入会費を確認した段階で記録。フォーム提出時に照合する。`form_submitted` で登録完了を追跡。
  サンプル:
  ```json
  { "id":"pm_001","discord_id":"123456789012345678","collected_by":"876543210987654321","amount":3000,"note":"入会費徴収：2026-03-05","form_submitted":0,"recorded_at":"2026-03-05T18:00:00Z" }
  ```

- `upgrade_requests` — 使用タイミング: 院進手続きで `grad_no` の OTP を送付・検証するための一時レコード。完了後に student_infos を追加。
  サンプル:
  ```json
  { "id":"up_001","user_id":"000001","undergrad_no":"15724012","grad_no":"35726001","otp_hash_grad":"HMAC_SHA256(...)","otp_expires_at":"2026-03-07T12:00:00Z","status":"pending","created_at":"2026-03-06T13:00:00Z" }
  ```

- `events` — 使用タイミング: Pages 側の重要な状態変化（例: `verified`, `graduate_migration`）を Bot に通知するアウトボックス。Bot がポーリングして処理する。
  サンプル:
  ```json
  { "id":"evt_001","event_type":"verified","payload":"{\"user_id\":\"000001\",\"application_id\":\"app_001\"}","priority":0,"status":"pending","retry_count":0,"created_at":"2026-03-06T12:03:00Z" }
  ```

- `audit_logs` — 使用タイミング: 監査目的で主要操作を記録。PII を含めずに、誰が何をいつ行ったかを追跡する。
  サンプル:
  ```json
  { "id":"al_001","action":"add_member","actor_id":"876543210987654321","target_id":"pm_001","target_type":"paid_member","details":"{\"amount\":3000}","created_at":"2026-03-05T18:00:10Z" }
  ```

---

