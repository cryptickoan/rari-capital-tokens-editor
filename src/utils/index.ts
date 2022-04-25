import { Octokit } from "@octokit/rest"

export const uploadToRepo = async (
    octo: Octokit,
    owner: string,
    repo: string,
    branch: string = `master`,
    content: string,
    tokenAddress: string,
    commitMessage: string,
    branchTitle: string
  ) => {
    // 1. Get latest commit from the base branch.
    const currentCommit = await getCurrentCommit(octo, owner, repo, branch)

    // 2. Create a new branch from base branch.
    await createBranch(octo, owner, repo, `refs/heads/${branchTitle}`, currentCommit.commitSha)

    // 3. Create blobs for files
    const filesBlobs = await createBlobForFile(octo, owner, repo, content)
    
    // 4. Path in repo where the newly created blobs will be placed.
    const pathsForBlobs = `src/${tokenAddress}/info.json`

    // 5. Create new tree.
    const newTree = await createNewTree(
      octo,
      owner,
      repo,
      filesBlobs,
      pathsForBlobs,
      currentCommit.treeSha
    )

    // 6. Create commit for the new tree.
    const newCommit = await createNewCommit(
      octo,
      owner,
      repo,
      commitMessage,
      newTree.sha,
      currentCommit.commitSha
    )

    // 7. Commit to branch.
    await setBranchToCommit(octo, owner, repo, branchTitle, newCommit.sha)

    // 8. Open PR.
    await openPR(octo, owner, repo, branchTitle, branchTitle, branch)
  }

  const openPR = async (
    octo: Octokit,
    owner: string,
    repo: string,
    title: string,
    head: string,
    base: string
  ) => octo.rest.pulls.create({
    owner,
    repo,
    title,
    head,
    base,
  });

  const createNewTree = async (
    octo: Octokit,
    owner: string,
    repo: string,
    blob: any, //Octokit.GitCreateBlobResponse[],
    path: string,
    parentTreeSha: string
  ) => {
    // My custom config. Could be taken as parameters
    const tree = [{
      path: path,
      mode: "100644",
      type: `blob`,
      sha: blob.sha,
    }] as any[]

    const { data } = await octo.git.createTree({
      owner,
      repo,
      tree,
      base_tree: parentTreeSha,
    })
    return data
  }

  const createBlobForFile = async (octo: Octokit, org: string, repo: string, content: string) => {
    const blobData = await octo.git.createBlob({
      owner: org,
      repo,
      content,
      encoding: 'utf-8',
    })

    return blobData.data
  }

  const getCurrentCommit = async (
    octo: Octokit,
    org: string,
    repo: string,
    branch: string = 'master'
  ) => {
    const { data: refData } = await octo.git.getRef({
      owner: org,
      repo,
      ref: `heads/${branch}`,
    })

    const commitSha = refData.object.sha
    const { data: commitData } = await octo.git.getCommit({
      owner: org,
      repo,
      commit_sha: commitSha,
    })
    return {
      commitSha,
      treeSha: commitData.tree.sha,
      ref: refData.ref
    }
  }

  const createBranch = async (
    octo: Octokit,
    owner: string,
    repo: string,
    ref: string,
    sha: string
  ) => (
    await octo.git.createRef({
      owner,
      repo,
      ref,
      sha
    })
  )

  const setBranchToCommit = (
    octo: Octokit,
    org: string,
    repo: string,
    branch: string = `master`,
    commitSha: string
  ) =>
    octo.git.updateRef({
      owner: org,
      repo,
      ref: `heads/${branch}`,
      sha: commitSha,
    })

  const createNewCommit = async (
    octo: Octokit,
    org: string,
    repo: string,
    message: string,
    currentTreeSha: string,
    currentCommitSha: string
  ) =>
    (await octo.git.createCommit({
      owner: org,
      repo,
      message,
      tree: currentTreeSha,
      parents: [currentCommitSha],
    })).data