const devUrl = process.env.DEV_URL;
const maxAttempts = 5;
const retryDelayMs = 5_000;
const requestTimeoutMs = 10_000;

function wait(durationMs) {
  return new Promise((resolve) => setTimeout(resolve, durationMs));
}

function describeError(error) {
  return error instanceof Error ? error.message : String(error);
}

async function smokeTest() {
  if (!devUrl) {
    throw new Error("DEV_URL must contain the deployed application URL.");
  }

  const url = new URL(devUrl);

  if (url.protocol !== "https:" && url.hostname !== "localhost") {
    throw new Error("DEV_URL must use HTTPS unless it targets localhost.");
  }

  let lastError;

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      const response = await fetch(url, {
        headers: {
          "user-agent": "agentic-webapp-dev-smoke-test",
        },
        redirect: "follow",
        signal: AbortSignal.timeout(requestTimeoutMs),
      });

      if (!response.ok) {
        throw new Error(`received HTTP ${response.status}`);
      }

      const contentType = response.headers.get("content-type") ?? "";
      const body = await response.text();

      if (!contentType.toLowerCase().includes("text/html")) {
        throw new Error(`expected HTML but received ${contentType || "no content type"}`);
      }

      if (!/<html(?:\s|>)/i.test(body)) {
        throw new Error("response body does not contain an HTML document");
      }

      console.log(`DEV smoke test passed for ${response.url}`);
      return;
    } catch (error) {
      lastError = error;

      if (attempt < maxAttempts) {
        console.warn(
          `DEV smoke test attempt ${attempt}/${maxAttempts} failed: ${describeError(error)}. Retrying...`,
        );
        await wait(retryDelayMs);
      }
    }
  }

  throw new Error(
    `DEV smoke test failed after ${maxAttempts} attempts: ${describeError(lastError)}`,
  );
}

try {
  await smokeTest();
} catch (error) {
  console.error(describeError(error));
  process.exitCode = 1;
}
