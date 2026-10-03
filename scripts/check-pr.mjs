import { spawnSync } from "node:child_process";

const pnpm = process.platform === "win32" ? "pnpm.cmd" : "pnpm";

function run(label, args, extraEnv = {}) {
  console.log(`\n==> ${label}\n`);

  const result = spawnSync(pnpm, args, {
    stdio: "inherit",
    env: {
      ...process.env,
      ...extraEnv,
    },
  });

  if (result.error) {
    console.error(`Unable to run ${label}: ${result.error.message}`);
    process.exit(1);
  }

  if (result.status !== 0) {
    console.error(`${label} failed with exit code ${result.status ?? "unknown"}.`);
    process.exit(result.status ?? 1);
  }
}

run("Repository completion gate", ["check"]);
run(
  "Local browser regression suite",
  ["exec", "playwright", "test"],
  {
    DEV_URL: "http://127.0.0.1:3000",
    PLAYWRIGHT_LOCAL_SERVER: "1",
  },
);

console.log("\nPre-PR verification passed.\n");
