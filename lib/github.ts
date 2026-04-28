export async function createPullRequestForArticle(
  files: { path: string; content: string; encoding: 'utf-8' | 'base64' }[],
  commitMessage: string,
  branchName: string
) {
  const token = process.env.GITHUB_TOKEN;
  const owner = process.env.GITHUB_OWNER;
  const repo = process.env.GITHUB_REPO;
  const baseBranch = process.env.GITHUB_BRANCH || 'main';

  if (!token || !owner || !repo) {
    const availableKeys = Object.keys(process.env).join(', ');
    throw new Error(`GitHubの設定が見つかりません。現在の利用可能な環境変数: [${availableKeys}]。環境変数 GITHUB_TOKEN, GITHUB_OWNER, GITHUB_REPO を設定してください。`);
  }

  const baseUrl = `https://api.github.com/repos/${owner}/${repo}`;
  const headers = {
    Authorization: `Bearer ${token}`,
    Accept: 'application/vnd.github.v3+json',
    'X-GitHub-Api-Version': '2022-11-28',
  };

  // 1. Get the current reference of the base branch (main)
  const refRes = await fetch(`${baseUrl}/git/ref/heads/${baseBranch}`, { headers });
  if (!refRes.ok) throw new Error(`ブランチ情報の取得に失敗しました: ${await refRes.text()}`);
  const refData = await refRes.json();
  const latestCommitSha = refData.object.sha;

  // 2. Create a new branch from the base branch
  const createBranchRes = await fetch(`${baseUrl}/git/refs`, {
    method: 'POST',
    headers: { ...headers, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ref: `refs/heads/${branchName}`,
      sha: latestCommitSha,
    }),
  });
  if (!createBranchRes.ok) throw new Error(`新しいブランチの作成に失敗しました: ${await createBranchRes.text()}`);

  // 3. Get the commit data to find the tree SHA
  const commitRes = await fetch(`${baseUrl}/git/commits/${latestCommitSha}`, { headers });
  if (!commitRes.ok) throw new Error(`最新コミットの取得に失敗しました: ${await commitRes.text()}`);
  const commitData = await commitRes.json();
  const baseTreeSha = commitData.tree.sha;

  // 4. Create Blobs for each file and build the tree array
  const tree = [];
  for (const file of files) {
    const blobRes = await fetch(`${baseUrl}/git/blobs`, {
      method: 'POST',
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content: file.content,
        encoding: file.encoding,
      }),
    });
    if (!blobRes.ok) throw new Error(`ファイルのアップロード(blob作成)に失敗しました (${file.path}): ${await blobRes.text()}`);
    const blobData = await blobRes.json();
    tree.push({
      path: file.path,
      mode: '100644', // File mode
      type: 'blob',
      sha: blobData.sha,
    });
  }

  // 5. Create a new Tree
  const newTreeRes = await fetch(`${baseUrl}/git/trees`, {
    method: 'POST',
    headers: { ...headers, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      base_tree: baseTreeSha,
      tree: tree,
    }),
  });
  if (!newTreeRes.ok) throw new Error(`ツリーの作成に失敗しました: ${await newTreeRes.text()}`);
  const newTreeData = await newTreeRes.json();
  const newTreeSha = newTreeData.sha;

  // 6. Create a new Commit
  const newCommitRes = await fetch(`${baseUrl}/git/commits`, {
    method: 'POST',
    headers: { ...headers, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message: commitMessage,
      tree: newTreeSha,
      parents: [latestCommitSha],
    }),
  });
  if (!newCommitRes.ok) throw new Error(`コミットの作成に失敗しました: ${await newCommitRes.text()}`);
  const newCommitData = await newCommitRes.json();
  const newCommitSha = newCommitData.sha;

  // 7. Update the reference of the new branch
  const updateRefRes = await fetch(`${baseUrl}/git/refs/heads/${branchName}`, {
    method: 'PATCH',
    headers: { ...headers, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      sha: newCommitSha,
      force: true,
    }),
  });
  if (!updateRefRes.ok) throw new Error(`ブランチ参照の更新に失敗しました: ${await updateRefRes.text()}`);

  // 8. Create a Pull Request
  const prRes = await fetch(`${baseUrl}/pulls`, {
    method: 'POST',
    headers: { ...headers, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      title: commitMessage,
      head: branchName,
      base: baseBranch,
      body: `/admin/news/new より、記事「${commitMessage.replace('add: 記事「', '').replace('」を追加', '')}」の追加リクエストが作成されました。\n\n内容を確認し、問題なければマージしてください。`,
    }),
  });
  if (!prRes.ok) throw new Error(`プルリクエストの作成に失敗しました: ${await prRes.text()}`);
  const prData = await prRes.json();

  return prData.html_url; // Return PR URL if needed
}

