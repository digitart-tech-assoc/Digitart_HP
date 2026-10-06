import "server-only";

/** GitHub にコミットするファイル */
export type RepositoryFile = {
  /** リポジトリルートからのパス */
  path: string;
  content: string;
  /** テキストは utf-8、画像などのバイナリは base64 */
  encoding: "utf-8" | "base64";
};

/**
 * GitHub API の呼び出しに失敗したときのエラー。
 * message は利用者に見せてよい「何に失敗したか」だけにし、API のレスポンス本文は details に分ける（サーバーのログにだけ出す）。
 */
export class GitHubApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly details: string,
  ) {
    super(message);
    this.name = "GitHubApiError";
  }
}

type GitHubClient = {
  /** リポジトリ API のベース URL（https://api.github.com/repos/<owner>/<repo>） */
  baseUrl: string;
  headers: Record<string, string>;
  baseBranch: string;
};

/** 環境変数から GitHub API の接続情報を作る */
function createClient(): GitHubClient {
  const token = process.env.GITHUB_TOKEN;
  const owner = process.env.GITHUB_OWNER;
  const repo = process.env.GITHUB_REPO;
  const baseBranch = process.env.GITHUB_BRANCH || "main";

  if (!token || !owner || !repo) {
    throw new Error(
      "GitHubの設定が見つかりません。環境変数 GITHUB_TOKEN, GITHUB_OWNER, GITHUB_REPO を設定してください。",
    );
  }

  return {
    baseUrl: `https://api.github.com/repos/${owner}/${repo}`,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github.v3+json",
      "X-GitHub-Api-Version": "2022-11-28",
    },
    baseBranch,
  };
}

/**
 * GitHub API を呼び出し、レスポンスの JSON を返す。
 * 失敗したときは「何に失敗したか」とレスポンス本文を持つ GitHubApiError を投げる。
 */
async function request<T>(
  client: GitHubClient,
  path: string,
  failureMessage: string,
  options: { method?: "GET" | "POST" | "PATCH"; body?: unknown } = {},
): Promise<T> {
  const res = await fetch(`${client.baseUrl}${path}`, {
    method: options.method ?? "GET",
    headers:
      options.body === undefined
        ? client.headers
        : { ...client.headers, "Content-Type": "application/json" },
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
  });
  if (!res.ok) {
    throw new GitHubApiError(failureMessage, res.status, await res.text());
  }
  return res.json() as Promise<T>;
}

/** ベースブランチの最新コミットから作業ブランチを作り、そのコミットの SHA を返す */
async function createBranch(client: GitHubClient, branchName: string): Promise<string> {
  const ref = await request<{ object: { sha: string } }>(
    client,
    `/git/ref/heads/${client.baseBranch}`,
    "ブランチ情報の取得に失敗しました",
  );
  const latestCommitSha = ref.object.sha;

  await request(client, "/git/refs", "新しいブランチの作成に失敗しました", {
    method: "POST",
    body: { ref: `refs/heads/${branchName}`, sha: latestCommitSha },
  });

  return latestCommitSha;
}

/** ファイルをまとめて 1 つのコミットにし、作業ブランチに反映する */
async function commitFiles(
  client: GitHubClient,
  branchName: string,
  parentCommitSha: string,
  files: RepositoryFile[],
  commitMessage: string,
): Promise<void> {
  const parentCommit = await request<{ tree: { sha: string } }>(
    client,
    `/git/commits/${parentCommitSha}`,
    "最新コミットの取得に失敗しました",
  );

  const tree = [];
  for (const file of files) {
    const blob = await request<{ sha: string }>(
      client,
      "/git/blobs",
      `ファイルのアップロード(blob作成)に失敗しました (${file.path})`,
      { method: "POST", body: { content: file.content, encoding: file.encoding } },
    );
    tree.push({ path: file.path, mode: "100644", type: "blob", sha: blob.sha });
  }

  const newTree = await request<{ sha: string }>(
    client,
    "/git/trees",
    "ツリーの作成に失敗しました",
    {
      method: "POST",
      body: { base_tree: parentCommit.tree.sha, tree },
    },
  );

  const newCommit = await request<{ sha: string }>(
    client,
    "/git/commits",
    "コミットの作成に失敗しました",
    {
      method: "POST",
      body: { message: commitMessage, tree: newTree.sha, parents: [parentCommitSha] },
    },
  );

  await request(client, `/git/refs/heads/${branchName}`, "ブランチ参照の更新に失敗しました", {
    method: "PATCH",
    body: { sha: newCommit.sha, force: true },
  });
}

/** 作業ブランチからベースブランチへのプルリクエストを作り、その URL を返す */
async function openPullRequest(
  client: GitHubClient,
  branchName: string,
  title: string,
  body: string,
): Promise<string> {
  const pr = await request<{ html_url: string }>(
    client,
    "/pulls",
    "プルリクエストの作成に失敗しました",
    { method: "POST", body: { title, head: branchName, base: client.baseBranch, body } },
  );
  return pr.html_url;
}

/**
 * ファイルを新しいブランチにコミットし、プルリクエストを作成する。
 * @returns 作成したプルリクエストの URL
 */
export async function createPullRequestWithFiles({
  files,
  branchName,
  title,
  body,
}: {
  files: RepositoryFile[];
  branchName: string;
  /** コミットメッセージとプルリクエストのタイトルに使う */
  title: string;
  body: string;
}): Promise<string> {
  const client = createClient();
  const baseCommitSha = await createBranch(client, branchName);
  await commitFiles(client, branchName, baseCommitSha, files, title);
  return openPullRequest(client, branchName, title, body);
}
