import assert from "node:assert/strict";
import { test } from "node:test";
import {
  createPreviewDeployment,
  reportPreviewDeployment,
  previewUrl,
} from "../scripts/preview-deployment.mjs";

const repository = "ThomasRey123/agentic-webapp";
const sha = "a".repeat(40);
const input = {
  repository,
  number: 83,
  sha,
  runUrl: "https://github.com/ThomasRey123/agentic-webapp/actions/runs/1",
};
const pr = {
  number: 83,
  state: "open",
  base: { ref: "main", repo: { full_name: repository } },
  head: { sha, repo: { full_name: repository } },
};

test("creates a non-production deployment for the exact verified PR commit", async () => {
  const calls = [];
  const api = async (path, options) => {
    calls.push({ path, options });
    return path.startsWith("pulls/") ? pr : { id: 9 };
  };
  assert.equal(await createPreviewDeployment(input, api), 9);
  assert.equal(calls[1].options.body.ref, sha);
  assert.equal(calls[1].options.body.production_environment, false);
  assert.equal(calls[1].options.body.auto_merge, false);
  assert.equal(calls[2].options.body.state, "in_progress");
});

test("refuses closed, moved, fork and wrong-base PRs before creating deployments", async () => {
  for (const changed of [
    { ...pr, state: "closed" },
    { ...pr, head: { ...pr.head, sha: "b".repeat(40) } },
    { ...pr, head: { ...pr.head, repo: { full_name: "other/repo" } } },
    { ...pr, base: { ...pr.base, ref: "other" } },
  ]) {
    let calls = 0;
    await assert.rejects(
      createPreviewDeployment(input, async () => {
        calls++;
        return changed;
      }),
    );
    assert.equal(calls, 1);
  }
});

test("publishes a URL only after successful verification of the current commit", async () => {
  for (const [currentPr, result, expected] of [
    [pr, "success", "success"],
    [pr, "failure", "failure"],
    [{ ...pr, state: "closed" }, "success", "inactive"],
    [{ ...pr, head: { ...pr.head, sha: "b".repeat(40) } }, "success", "inactive"],
  ]) {
    let status;
    const api = async (path, options) => {
      if (options) {
        status = options.body;
        return {};
      }
      return path.startsWith("pulls/") ? currentPr : { sha, environment: "pr-83" };
    };
    assert.equal(
      await reportPreviewDeployment(
        {
          ...input,
          deploymentId: 9,
          result,
          url: "https://agentic-webapp-pr-83.example.workers.dev/",
        },
        api,
      ),
      expected,
    );
    assert.equal(Boolean(status.environment_url), expected === "success");
  }
});

test("rejects mismatched deployment identity and foreign URLs", async () => {
  await assert.rejects(
    reportPreviewDeployment({ ...input, deploymentId: 9 }, async () => ({
      sha,
      environment: "production",
    })),
  );
  for (const url of [
    "http://agentic-webapp-pr-83.example.workers.dev/",
    "https://agentic-webapp-dev.example.workers.dev/",
    "https://agentic-webapp-pr-83.evil.test/",
    "https://user:pass@agentic-webapp-pr-83.example.workers.dev/",
  ])
    assert.throws(() => previewUrl(url, 83));
});
