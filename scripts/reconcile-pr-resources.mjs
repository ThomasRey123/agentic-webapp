import { appendFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { branchCanBeDeleted, deletePreview, workerName } from "./cleanup-pr.mjs";

const workerPattern = /^agentic-webapp-pr-([1-9][0-9]*)$/;
const api = "https://api.github.com";

function sameRepositoryPr(pr, repository) {
  return (
    pr?.base?.ref === "main" &&
    pr.base?.repo?.full_name === repository &&
    pr.head?.repo?.full_name === repository
  );
}

export function planResources(prs, branches, workers, repository) {
  const openRefs = new Set(
    prs
      .filter((pr) => pr.state === "open" && sameRepositoryPr(pr, repository))
      .map((pr) => pr.head.ref),
  );
  const closed = prs.filter((pr) => pr.state === "closed" && sameRepositoryPr(pr, repository));
  const closedByNumber = new Map(closed.map((pr) => [pr.number, pr]));
  const previews = workers.flatMap((name) => {
    const match = workerPattern.exec(name);
    const number = Number(match?.[1]);
    const pr = closedByNumber.get(number);
    return pr && Number.isSafeInteger(number) && workerName(pr.number) === name
      ? [{ name, number }]
      : [];
  });
  const mergedBranches = branches.flatMap(({ name, sha }) => {
    if (openRefs.has(name)) return [];
    const matches = closed.filter(
      (pr) => pr.merged_at && pr.head.ref === name && pr.head.sha === sha && branchCanBeDeleted(pr),
    );
    return matches.length === 1 ? [{ name, sha, number: matches[0].number }] : [];
  });
  return { previews, mergedBranches };
}

async function github(path, { method = "GET", allowMissing = false } = {}) {
  const response = await fetch(`${api}/repos/${process.env.GITHUB_REPOSITORY}/${path}`, {
    method,
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${process.env.GH_TOKEN}`,
      "X-GitHub-Api-Version": "2022-11-28",
    },
  });
  if (allowMissing && response.status === 404) return null;
  if (!response.ok) throw new Error(`GitHub ${method} failed (HTTP ${response.status})`);
  return response.status === 204 ? null : response.json();
}

async function githubPages(path) {
  const items = [];
  for (let page = 1; page <= 10; page++) {
    const separator = path.includes("?") ? "&" : "?";
    const batch = await github(`${path}${separator}per_page=100&page=${page}`);
    if (!Array.isArray(batch)) throw new Error("Unexpected GitHub list response");
    items.push(...batch);
    if (batch.length < 100) return items;
  }
  throw new Error("GitHub inventory exceeds 1,000 items; review pagination before cleanup");
}

async function listWorkers(accountId, token) {
  if (!/^[a-f0-9]{32}$/i.test(accountId ?? "") || !token) {
    throw new Error("Cloudflare credentials are missing or invalid");
  }
  const response = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${accountId}/workers/scripts`,
    { headers: { Authorization: `Bearer ${token}` } },
  );
  if (!response.ok) throw new Error(`Cloudflare Worker inventory failed (HTTP ${response.status})`);
  const body = await response.json();
  if (body.success !== true || !Array.isArray(body.result)) {
    throw new Error("Cloudflare Worker inventory has an unexpected shape");
  }
  if (body.result_info?.total_count > body.result.length) {
    throw new Error("Cloudflare Worker inventory is incomplete");
  }
  return body.result.map((worker) => worker.id).filter((id) => typeof id === "string");
}

function report(line) {
  console.log(line);
  if (process.env.GITHUB_STEP_SUMMARY) {
    appendFileSync(process.env.GITHUB_STEP_SUMMARY, `${line}\n`);
  }
}

async function main() {
  const repository = process.env.GITHUB_REPOSITORY;
  if (!/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(repository ?? "") || !process.env.GH_TOKEN) {
    throw new Error("GitHub repository or token is missing");
  }
  const [prs, branches, workers] = await Promise.all([
    githubPages("pulls?state=all"),
    githubPages("branches"),
    listWorkers(process.env.CLOUDFLARE_ACCOUNT_ID, process.env.CLOUDFLARE_API_TOKEN),
  ]);
  const plan = planResources(
    prs,
    branches.map((branch) => ({ name: branch.name, sha: branch.commit.sha })),
    workers,
    repository,
  );
  report("## PR resource inventory");
  report(
    `- GitHub branches: ${branches.length}; PR preview Workers: ${workers.filter((name) => workerPattern.test(name)).length}`,
  );
  report(
    `- Candidate closed-PR Workers: ${plan.previews.map((item) => item.name).join(", ") || "none"}`,
  );
  report(
    `- Candidate merged branches: ${plan.mergedBranches.map((item) => item.name).join(", ") || "none"}`,
  );
  report("- Other Workers, open PRs, closed unmerged branches, and main are excluded.");

  for (const candidate of plan.previews) {
    const current = await github(`pulls/${candidate.number}`);
    if (current.state !== "closed" || !sameRepositoryPr(current, repository)) {
      report(`- Skipped changed PR #${candidate.number}`);
      continue;
    }
    await deletePreview(
      candidate.number,
      process.env.CLOUDFLARE_ACCOUNT_ID,
      process.env.CLOUDFLARE_API_TOKEN,
    );
    report(`- Removed closed PR Worker ${candidate.name}`);
  }

  for (const candidate of plan.mergedBranches) {
    const current = await github(`pulls/${candidate.number}`);
    if (
      current.state !== "closed" ||
      !current.merged_at ||
      !sameRepositoryPr(current, repository) ||
      current.head.ref !== candidate.name ||
      current.head.sha !== candidate.sha ||
      !branchCanBeDeleted(current)
    ) {
      report(`- Skipped changed PR branch ${candidate.name}`);
      continue;
    }
    const open = await githubPages("pulls?state=open");
    if (open.some((pr) => pr.head?.ref === candidate.name && sameRepositoryPr(pr, repository))) {
      report(`- Skipped branch used by an open PR: ${candidate.name}`);
      continue;
    }
    const ref = await github(`git/ref/heads/${candidate.name}`, { allowMissing: true });
    if (!ref || ref.object?.sha !== candidate.sha) {
      report(`- Skipped absent or changed branch ${candidate.name}`);
      continue;
    }
    await github(`git/refs/heads/${candidate.name}`, { method: "DELETE", allowMissing: true });
    report(`- Removed merged branch ${candidate.name}`);
  }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
}
