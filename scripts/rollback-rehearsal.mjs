import { spawnSync } from "node:child_process";
import { appendFileSync, mkdtempSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

export function probeName(runId, attempt) {
  if (!/^[1-9][0-9]*$/.test(runId ?? "") || !/^[1-9][0-9]*$/.test(attempt ?? "")) {
    throw new Error("Expected a GitHub run identity");
  }
  const name = `agentic-webapp-rollback-${runId}-${attempt}`;
  if (name.length > 63) throw new Error("Probe name is too long");
  return name;
}

export function latestVersion(versions) {
  if (!Array.isArray(versions) || !versions.length) throw new Error("No Worker versions found");
  const sorted = [...versions].sort((a, b) =>
    String(a.metadata?.created_on).localeCompare(String(b.metadata?.created_on)),
  );
  const id = sorted.at(-1).id;
  if (!/^[a-f0-9]{8}(-[a-f0-9]{4}){3}-[a-f0-9]{12}$/i.test(id ?? "")) {
    throw new Error("Invalid Worker version ID");
  }
  return id;
}

export async function verifyProbe(
  url,
  marker,
  request = fetch,
  wait = (ms) => new Promise((r) => setTimeout(r, ms)),
) {
  for (let attempt = 0; attempt < 6; attempt++) {
    try {
      const response = await request(url, {
        signal: AbortSignal.timeout(15_000),
        cache: "no-store",
      });
      if (response.ok && (await response.text()) === marker) return;
    } catch {
      // Initial Worker propagation can temporarily fail; the final attempt still fails the check.
    }
    if (attempt < 5) await wait(5_000);
  }
  throw new Error(`Probe did not serve the expected marker: ${marker}`);
}

export async function probeApi(accountId, token, name, method, request = fetch) {
  if (
    !/^[a-f0-9]{32}$/i.test(accountId ?? "") ||
    !token ||
    !/^agentic-webapp-rollback-[1-9][0-9]*-[1-9][0-9]*$/.test(name) ||
    !["GET", "DELETE"].includes(method)
  )
    throw new Error("Invalid isolated probe request");
  return request(
    `https://api.cloudflare.com/client/v4/accounts/${accountId}/workers/scripts/${name}`,
    {
      method,
      headers: { Authorization: `Bearer ${token}` },
      signal: AbortSignal.timeout(30_000),
    },
  );
}

async function main() {
  if (process.env.GITHUB_REF !== "refs/heads/main") throw new Error("Run only from trusted main");
  const name = probeName(process.env.GITHUB_RUN_ID, process.env.GITHUB_RUN_ATTEMPT);
  const account = process.env.CLOUDFLARE_ACCOUNT_ID;
  const token = process.env.CLOUDFLARE_API_TOKEN;
  const existing = await probeApi(account, token, name, "GET");
  if (existing.status !== 404)
    throw new Error("Probe must be absent before this run; refusing to overwrite");
  const directory = mkdtempSync(join(tmpdir(), "rollback-rehearsal-"));
  const assets = join(directory, "assets");
  mkdirSync(assets);
  const config = join(directory, "wrangler.json");
  const compatibilityDate = readFileSync("wrangler.jsonc", "utf8").match(
    /"compatibility_date":\s*"([0-9-]+)"/,
  )?.[1];
  if (!compatibilityDate) throw new Error("Missing repository compatibility date");
  writeFileSync(
    config,
    JSON.stringify({ name, compatibility_date: compatibilityDate, assets: { directory: assets } }),
  );
  const require = createRequire(import.meta.url);
  const wrangler = join(dirname(require.resolve("wrangler/package.json")), "bin/wrangler.js");
  const cli = (args) => {
    const result = spawnSync(process.execPath, [wrangler, ...args, "--config", config], {
      encoding: "utf8",
      env: { ...process.env, WRANGLER_SEND_METRICS: "false" },
    });
    if (result.error || result.status !== 0)
      throw new Error(`Wrangler ${args[0]} failed (exit ${result.status ?? "unknown"})`);
    return result.stdout;
  };
  let failure;
  try {
    writeFileSync(join(assets, "index.html"), "rollback-probe-baseline");
    const deployed = cli(["deploy", "--message", "Isolated rollback baseline"]);
    const url = deployed.match(new RegExp(`https://${name}\\.[a-z0-9-]+\\.workers\\.dev`))?.[0];
    if (!url) throw new Error("Missing isolated Worker deployment URL");
    const baseline = latestVersion(JSON.parse(cli(["versions", "list", "--json"])));
    await verifyProbe(url, "rollback-probe-baseline");
    writeFileSync(join(assets, "index.html"), "rollback-probe-candidate");
    cli(["deploy", "--message", "Isolated rollback candidate"]);
    const candidate = latestVersion(JSON.parse(cli(["versions", "list", "--json"])));
    if (candidate === baseline) throw new Error("Candidate must create a distinct version");
    await verifyProbe(url, "rollback-probe-candidate");
    cli(["rollback", baseline, "--yes", "--message", "Isolated rehearsal restore"]);
    await verifyProbe(url, "rollback-probe-baseline");
    if (process.env.GITHUB_STEP_SUMMARY)
      appendFileSync(
        process.env.GITHUB_STEP_SUMMARY,
        `Rollback rehearsal passed for ${name}. Baseline ${baseline}, candidate ${candidate}; baseline content verified again after rollback.\n`,
      );
  } catch (error) {
    failure = error;
  }
  try {
    const removed = await probeApi(account, token, name, "DELETE");
    if (!removed.ok && removed.status !== 404)
      throw new Error(`Probe cleanup failed (HTTP ${removed.status})`);
    if (process.env.GITHUB_STEP_SUMMARY)
      appendFileSync(
        process.env.GITHUB_STEP_SUMMARY,
        "Isolated probe Worker removed. Stable DEV and PROD were not changed.\n",
      );
  } catch (error) {
    failure = new Error(`${failure ? `${failure.message}; ` : ""}${error.message}`);
  }
  if (failure) throw failure;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
}
