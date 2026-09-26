import assert from "node:assert/strict";
import { test } from "node:test";
import { planResources } from "../scripts/reconcile-pr-resources.mjs";

const repository = "ThomasRey123/agentic-webapp";
const sha = "a".repeat(40);
function pr(number, branch, { state = "closed", merged = true, repo = repository } = {}) {
  return {
    number,
    state,
    merged_at: merged ? "2026-09-26T00:00:00Z" : null,
    base: { ref: "main", repo: { full_name: repository } },
    head: { ref: branch, sha, repo: { full_name: repo } },
  };
}

test("inventory only selects closed PR Workers and unchanged merged branches", () => {
  const prs = [
    pr(28, "agent/27-pr-lifecycle-cleanup"),
    pr(32, "agent/31-unmerged-cleanup-probe", { merged: false }),
    pr(34, "agent/33-open-feature", { state: "open" }),
    pr(36, "agent/35-fork", { repo: "other/fork" }),
  ];
  const branches = [
    { name: "agent/27-pr-lifecycle-cleanup", sha },
    { name: "agent/31-unmerged-cleanup-probe", sha },
    { name: "agent/33-open-feature", sha },
    { name: "main", sha },
  ];
  const workers = [
    "agentic-webapp-dev",
    "agentic-webapp-pr-28",
    "agentic-webapp-pr-32",
    "agentic-webapp-pr-34",
    "agentic-webapp-pr-36",
    "agentic-webapp-pr-999",
    "other-worker",
  ];
  assert.deepEqual(planResources(prs, branches, workers, repository), {
    previews: [
      { name: "agentic-webapp-pr-28", number: 28 },
      { name: "agentic-webapp-pr-32", number: 32 },
    ],
    mergedBranches: [{ name: "agent/27-pr-lifecycle-cleanup", sha, number: 28 }],
  });
});

test("a moved branch or branch reused by an open PR is never selected", () => {
  const original = pr(20, "agent/19-chat-to-dev");
  const shared = pr(21, "agent/19-chat-to-dev", { state: "open" });
  assert.deepEqual(
    planResources([original, shared], [{ name: original.head.ref, sha }], [], repository)
      .mergedBranches,
    [],
  );
  assert.deepEqual(
    planResources([original], [{ name: original.head.ref, sha: "b".repeat(40) }], [], repository)
      .mergedBranches,
    [],
  );
});
