import { appendFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const api = "https://api.github.com";

export function eligibleMergedPr(pr, repository, verifiedSha) {
  return (
    pr?.state === "closed" &&
    Boolean(pr.merged_at) &&
    pr.merge_commit_sha === verifiedSha &&
    pr.base?.ref === "main" &&
    pr.base?.repo?.full_name === repository &&
    pr.head?.repo?.full_name === repository
  );
}

export function eligibleClosedPr(pr, repository, number) {
  return (
    pr?.number === number &&
    pr.state === "closed" &&
    !pr.merged_at &&
    pr.base?.ref === "main" &&
    pr.base?.repo?.full_name === repository &&
    pr.head?.repo?.full_name === repository
  );
}

export function workerName(number) {
  if (!Number.isSafeInteger(number) || number < 1) {
    throw new Error("Expected a positive PR number");
  }
  return `agentic-webapp-pr-${number}`;
}

export function branchCanBeDeleted(pr) {
  return (
    /^(agent|feature|fix)\/[0-9]+-[a-z0-9-]+$/.test(pr.head?.ref ?? "") &&
    pr.head.ref.split("/")[1].startsWith(`${pr.number}-`) &&
    /^[a-f0-9]{40}$/i.test(pr.head?.sha ?? "")
  );
}

export async function deletePreview(number, accountId, token, request = fetch) {
  if (!/^[a-f0-9]{32}$/i.test(accountId ?? "") || !token) {
    throw new Error("Cloudflare credentials are missing or invalid");
  }
  const name = workerName(number);
  const response = await request(
    `https://api.cloudflare.com/client/v4/accounts/${accountId}/workers/scripts/${name}`,
    {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    },
  );
  if (response.status === 404) {
    console.log(`Preview ${name} was already absent`);
    return;
  }
  if (!response.ok) {
    throw new Error(`Could not delete preview ${name} (HTTP ${response.status})`);
  }
  console.log(`Deleted preview ${name}`);
}

async function github(path, options = {}) {
  const response = await fetch(`${api}/repos/${process.env.GITHUB_REPOSITORY}/${path}`, {
    ...options,
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${process.env.GH_TOKEN}`,
      "X-GitHub-Api-Version": "2022-11-28",
    },
  });
  if (response.status === 404 && options.allowMissing) return null;
  if (!response.ok) throw new Error(`GitHub request failed (HTTP ${response.status})`);
  if (response.status === 204) return null;
  return response.json();
}

async function removeUnchangedBranch(pr) {
  if (!branchCanBeDeleted(pr)) {
    console.log(`Skipping branch cleanup for PR #${pr.number}: unexpected branch name or SHA`);
    return;
  }
  const path = `git/ref/heads/${pr.head.ref}`;
  const current = await github(path, { allowMissing: true });
  if (!current) {
    console.log(`Branch for PR #${pr.number} was already absent`);
    return;
  }
  if (current.object?.sha !== pr.head.sha) {
    console.log(`Skipping changed branch for PR #${pr.number}`);
    return;
  }
  const deleted = await github(`git/refs/heads/${pr.head.ref}`, {
    method: "DELETE",
    allowMissing: true,
  });
  console.log(
    deleted === null
      ? `Branch ${pr.head.ref} was removed or already absent`
      : `Removed merged branch ${pr.head.ref}`,
  );
}

async function main() {
  const mode = process.argv[2];
  const repository = process.env.GITHUB_REPOSITORY;
  if (!/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(repository ?? "") || !process.env.GH_TOKEN) {
    throw new Error("GitHub repository or token is missing");
  }

  let pr;
  if (mode === "merged" || mode === "resolve") {
    const sha = process.env.VERIFIED_SHA;
    if (!/^[a-f0-9]{40}$/i.test(sha ?? "")) throw new Error("Verified SHA is missing");
    const associated = await github(`commits/${sha}/pulls?per_page=100`);
    pr = associated.find((candidate) => eligibleMergedPr(candidate, repository, sha));
  } else if (mode === "closed") {
    const number = Number(process.env.PR_NUMBER);
    workerName(number);
    const current = await github(`pulls/${number}`);
    pr = eligibleClosedPr(current, repository, number) ? current : undefined;
  } else {
    throw new Error("Expected cleanup mode: merged or closed");
  }

  if (!pr) {
    console.log("No eligible PR to clean up");
    return;
  }
  if (mode === "resolve") {
    if (!process.env.GITHUB_OUTPUT || /[\r\n]/.test(pr.head.ref)) {
      throw new Error("Invalid GitHub output or PR branch");
    }
    appendFileSync(process.env.GITHUB_OUTPUT, `head_ref=${pr.head.ref}\n`);
    console.log(`Found merged PR #${pr.number}`);
    return;
  }
  await deletePreview(
    pr.number,
    process.env.CLOUDFLARE_ACCOUNT_ID,
    process.env.CLOUDFLARE_API_TOKEN,
  );
  if (mode === "merged") await removeUnchangedBranch(pr);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
}
