import assert from "node:assert/strict";
import { test } from "node:test";
import { latestVersion, probeApi, probeName, verifyProbe } from "../scripts/rollback-rehearsal.mjs";

test("probe identity cannot target stable DEV, PROD or arbitrary workers", async () => {
  assert.equal(probeName("123", "2"), "agentic-webapp-rollback-123-2");
  for (const invalid of ["", "0", "../dev", "1;rm"]) assert.throws(() => probeName(invalid, "1"));
  for (const name of ["agentic-webapp-dev", "agentic-webapp-prod", "other-worker"]) {
    await assert.rejects(
      probeApi("a".repeat(32), "test-token", name, "DELETE", () => assert.fail("must not request")),
    );
  }
});

test("selects the most recent valid version independently of response order", () => {
  const old = {
    id: "11111111-1111-1111-1111-111111111111",
    metadata: { created_on: "2026-10-01" },
  };
  const recent = {
    id: "22222222-2222-2222-2222-222222222222",
    metadata: { created_on: "2026-10-02" },
  };
  assert.equal(latestVersion([recent, old]), recent.id);
  assert.throws(() => latestVersion([]));
  assert.throws(() => latestVersion([{ id: "bad" }]));
});

test("rollback verification requires restored content, not only HTTP 200", async () => {
  let calls = 0;
  await verifyProbe(
    "https://example.workers.dev",
    "baseline",
    async () => ({ ok: true, text: async () => (++calls === 1 ? "candidate" : "baseline") }),
    async () => {},
  );
  assert.equal(calls, 2);
  await assert.rejects(
    verifyProbe(
      "https://example.workers.dev",
      "baseline",
      async () => ({ ok: true, text: async () => "candidate" }),
      async () => {},
    ),
  );
});

test("cleanup sends DELETE only to the run-specific probe", async () => {
  let call;
  await probeApi(
    "a".repeat(32),
    "test-token",
    probeName("123", "1"),
    "DELETE",
    async (url, options) => {
      call = { url, options };
      return { ok: true };
    },
  );
  assert.ok(call.url.endsWith("/workers/scripts/agentic-webapp-rollback-123-1"));
  assert.equal(call.options.method, "DELETE");
});

test("transient network failure retries and persistent failure is not passed", async () => {
  let calls = 0;
  await verifyProbe(
    "https://example.workers.dev",
    "baseline",
    async () => {
      if (++calls === 1) throw new Error("temporary connection failure");
      return { ok: true, text: async () => "baseline" };
    },
    async () => {},
  );
  assert.equal(calls, 2);
  await assert.rejects(
    verifyProbe(
      "https://example.workers.dev",
      "baseline",
      async () => {
        throw new Error("persistent connection failure");
      },
      async () => {},
    ),
  );
});
