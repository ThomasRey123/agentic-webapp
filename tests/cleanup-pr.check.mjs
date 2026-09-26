import assert from "node:assert/strict";
import { test } from "node:test";
import {
  branchCanBeDeleted,
  deletePreview,
  eligibleClosedPr,
  eligibleMergedPr,
  workerName,
} from "../scripts/cleanup-pr.mjs";

const repo = "ThomasRey123/agentic-webapp";
const sha = "a".repeat(40);
const pr = {
  number: 27,
  state: "closed",
  merged_at: "2026-09-26T00:00:00Z",
  merge_commit_sha: sha,
  base: { ref: "main", repo: { full_name: repo } },
  head: { ref: "agent/27-cleanup", sha: "b".repeat(40), repo: { full_name: repo } },
};

test("only the exact merged commit from this repository qualifies", () => {
  assert.equal(eligibleMergedPr(pr, repo, sha), true);
  assert.equal(eligibleMergedPr(pr, repo, "c".repeat(40)), false);
  assert.equal(
    eligibleMergedPr({ ...pr, head: { ...pr.head, repo: { full_name: "other/repo" } } }, repo, sha),
    false,
  );
  assert.equal(eligibleMergedPr({ ...pr, merged_at: null }, repo, sha), false);
});

test("a reopened, merged, or fork PR cannot be cleaned as unmerged", () => {
  const closed = { ...pr, merged_at: null };
  assert.equal(eligibleClosedPr(closed, repo, 27), true);
  assert.equal(eligibleClosedPr({ ...closed, state: "open" }, repo, 27), false);
  assert.equal(eligibleClosedPr(pr, repo, 27), false);
  assert.equal(
    eligibleClosedPr(
      { ...closed, head: { ...pr.head, repo: { full_name: "other/repo" } } },
      repo,
      27,
    ),
    false,
  );
});

test("branch names and preview names remain scoped to the PR", () => {
  assert.equal(branchCanBeDeleted(pr), true);
  assert.equal(branchCanBeDeleted({ ...pr, head: { ...pr.head, ref: "main" } }), false);
  assert.equal(branchCanBeDeleted({ ...pr, head: { ...pr.head, ref: "agent/26-cleanup" } }), false);
  assert.equal(workerName(27), "agentic-webapp-pr-27");
  assert.throws(() => workerName(0));
});

test("preview deletion targets only its numeric worker and treats 404 as already removed", async () => {
  const calls = [];
  await deletePreview(27, "a".repeat(32), "test-token", async (url, options) => {
    calls.push({ url, options });
    return { status: 404, ok: false };
  });
  assert.equal(
    calls[0].url,
    `https://api.cloudflare.com/client/v4/accounts/${"a".repeat(32)}/workers/scripts/agentic-webapp-pr-27`,
  );
  assert.equal(calls[0].options.method, "DELETE");
  await assert.rejects(
    deletePreview(27, "a".repeat(32), "test-token", async () => ({ status: 403, ok: false })),
    /HTTP 403/,
  );
});
