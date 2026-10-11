import { appendFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

export function isCurrentPreview(pr, repository, number, sha) {
  return (
    pr?.number === number &&
    pr.state === "open" &&
    pr.base?.ref === "main" &&
    pr.base?.repo?.full_name === repository &&
    pr.head?.repo?.full_name === repository &&
    pr.head?.sha === sha
  );
}

export function previewUrl(value, number) {
  const url = new URL(value);
  if (
    url.protocol !== "https:" ||
    !url.hostname.startsWith(`agentic-webapp-pr-${number}.`) ||
    !url.hostname.endsWith(".workers.dev") ||
    url.username ||
    url.password ||
    url.port ||
    url.search ||
    url.hash ||
    url.pathname !== "/"
  )
    throw new Error("Expected the isolated PR Worker URL");
  return url.href;
}

function validate(repository, number, sha) {
  if (
    !/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(repository) ||
    !Number.isSafeInteger(number) ||
    number < 1 ||
    !/^[a-f0-9]{40}$/i.test(sha)
  ) {
    throw new Error("Invalid preview identity");
  }
}

export async function createPreviewDeployment({ repository, number, sha, runUrl }, api) {
  validate(repository, number, sha);
  const pr = await api(`pulls/${number}`);
  if (!isCurrentPreview(pr, repository, number, sha)) {
    throw new Error("The verified commit is no longer the open PR head");
  }
  const deployment = await api("deployments", {
    method: "POST",
    body: {
      ref: sha,
      auto_merge: false,
      required_contexts: [],
      environment: `pr-${number}`,
      transient_environment: true,
      production_environment: false,
      description: `Verified preview for PR #${number}`,
    },
  });
  if (!Number.isSafeInteger(deployment.id)) throw new Error("Missing deployment ID");
  await api(`deployments/${deployment.id}/statuses`, {
    method: "POST",
    body: { state: "in_progress", log_url: runUrl, auto_inactive: false },
  });
  return deployment.id;
}

export async function reportPreviewDeployment(
  { repository, number, sha, deploymentId, result, url, runUrl },
  api,
) {
  validate(repository, number, sha);
  if (!Number.isSafeInteger(deploymentId) || deploymentId < 1) {
    throw new Error("Invalid deployment ID");
  }
  const deployment = await api(`deployments/${deploymentId}`);
  if (deployment.sha !== sha || deployment.environment !== `pr-${number}`) {
    throw new Error("Deployment identity mismatch");
  }
  const pr = await api(`pulls/${number}`);
  const current = isCurrentPreview(pr, repository, number, sha);
  const state = !current ? "inactive" : result === "success" ? "success" : "failure";
  const body = {
    state,
    log_url: runUrl,
    auto_inactive: true,
    description:
      state === "success"
        ? "Smoke and browser checks passed"
        : state === "inactive"
          ? "PR closed or commit superseded"
          : "Preview verification failed",
  };
  if (state === "success") body.environment_url = previewUrl(url, number);
  await api(`deployments/${deploymentId}/statuses`, { method: "POST", body });
  return state;
}

async function main() {
  const repository = process.env.GITHUB_REPOSITORY;
  const api = async (path, { method = "GET", body } = {}) => {
    const response = await fetch(`https://api.github.com/repos/${repository}/${path}`, {
      method,
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${process.env.GH_TOKEN}`,
        "X-GitHub-Api-Version": "2022-11-28",
        "Content-Type": "application/json",
      },
      body: body ? JSON.stringify(body) : undefined,
      signal: AbortSignal.timeout(30_000),
    });
    if (!response.ok) throw new Error(`Deployment API failed (HTTP ${response.status})`);
    return response.json();
  };
  const input = {
    repository,
    number: Number(process.env.PR_NUMBER),
    sha: process.env.VERIFIED_SHA,
    runUrl: process.env.PREVIEW_RUN_URL,
  };
  if (!process.env.GH_TOKEN) throw new Error("GitHub authentication is required");
  if (process.argv[2] === "start") {
    const id = await createPreviewDeployment(input, api);
    appendFileSync(process.env.GITHUB_OUTPUT, `id=${id}\n`);
  } else if (process.argv[2] === "finish") {
    const state = await reportPreviewDeployment(
      {
        ...input,
        deploymentId: Number(process.env.PREVIEW_DEPLOYMENT_ID),
        result: process.env.PREVIEW_RESULT,
        url: process.env.DEV_URL,
      },
      api,
    );
    console.log(`Preview deployment status: ${state}`);
  } else throw new Error("Expected start or finish");
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
}
