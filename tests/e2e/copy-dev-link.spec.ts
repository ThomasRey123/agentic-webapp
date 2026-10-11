import { expect, test } from "@playwright/test";

const stableUrl = "https://agentic-webapp-dev.tr-config-place.workers.dev/";

declare global {
  interface Window {
    copyTest: {
      writes: string[];
      settle: (success: boolean) => void;
    };
  }
}

// Only the isolated browser harness controls permissions, writes and clipboard reads.
// Application code never reads the clipboard or changes permissions.
test("FR-001: real clipboard contains stable DEV, not the current preview address", async ({
  page,
  context,
}) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto("/");
  const before = page.url();
  await page.getByRole("button", { name: "Copy DEV link" }).click();
  await expect(page.getByRole("status", { name: "DEV link copy status" })).toHaveText(
    "DEV link copied.",
  );
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(stableUrl);
  expect(page.url()).toBe(before);
  expect(context.pages()).toHaveLength(1);
});

test("FR-001/002/004/005/006: pending, retries, keyboard, theme and reload preserve truthful feedback", async ({
  page,
}) => {
  await page.addInitScript(() => {
    window.copyTest = { writes: [], settle: () => {} };
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: {
        writeText: (text: string) => {
          window.copyTest.writes.push(text);
          return new Promise<void>((resolve, reject) => {
            window.copyTest.settle = (success) =>
              success ? resolve() : reject(new DOMException("denied", "NotAllowedError"));
          });
        },
      },
    });
  });
  await page.goto("/");
  const button = page.getByRole("button", { name: "Copy DEV link" });
  const status = page.getByRole("status", { name: "DEV link copy status" });
  await expect(status).toBeEmpty();
  const toggle = page.getByRole("button", { name: "Theme wechseln" });
  await toggle.click();
  expect(await page.evaluate(() => window.copyTest.writes)).toEqual([]);
  await page.getByRole("link", { name: "Open stable DEV" }).focus();
  await page.keyboard.press("Tab");
  await expect(button).toBeFocused();
  expect(await button.evaluate((element) => getComputedStyle(element).outlineStyle)).toBe("solid");
  await page.keyboard.press("Enter");
  await expect(status).toHaveText("Copying the DEV link…");
  await expect(button).toBeFocused();
  await page.keyboard.press("Space");
  expect(await page.evaluate(() => window.copyTest.writes)).toEqual([stableUrl]);
  await toggle.click();
  await expect(status).toHaveText("Copying the DEV link…");
  await page.locator("summary").first().click();
  await expect(page.locator("details").first()).toHaveAttribute("open", "");
  await expect(page.getByRole("link", { name: "Open stable DEV" })).toHaveAttribute(
    "href",
    stableUrl,
  );
  await page.evaluate(() => window.copyTest.settle(false));
  await expect(status).toContainText("copy its address manually");
  await button.focus();
  await page.keyboard.press("Space");
  await expect(status).toHaveText("Copying the DEV link…");
  await expect(button).toBeFocused();
  await page.evaluate(() => window.copyTest.settle(true));
  await expect(status).toHaveText("DEV link copied.");
  await expect(button).toBeFocused();
  await toggle.click();
  await expect(status).toHaveText("DEV link copied.");
  await button.click();
  await expect(status).toHaveText("Copying the DEV link…");
  await page.evaluate(() => window.copyTest.settle(false));
  await expect(status).toContainText("Could not copy");
  await expect(status).not.toContainText("DEV link copied.");
  expect(await page.evaluate(() => window.copyTest.writes)).toEqual([
    stableUrl,
    stableUrl,
    stableUrl,
  ]);
  await page.reload();
  await expect(status).toBeEmpty();
  expect(await page.evaluate(() => window.copyTest.writes)).toEqual([]);
});

for (const mode of ["missing", "denied"] as const) {
  test(`FR-003: ${mode} clipboard provides manual recovery without page errors`, async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.addInitScript((mode) => {
      Object.defineProperty(navigator, "clipboard", {
        configurable: true,
        value:
          mode === "missing"
            ? undefined
            : {
                writeText: () =>
                  Promise.reject(new DOMException("internal details", "NotAllowedError")),
              },
      });
    }, mode);
    await page.goto("/");
    await page.getByRole("button", { name: "Copy DEV link" }).click();
    const status = page.getByRole("status", { name: "DEV link copy status" });
    await expect(status).toContainText("copy its address manually");
    await expect(status).not.toContainText("internal details");
    await page.getByRole("button", { name: "Cloud-Test" }).click();
    await expect(page.getByText("Der Cloud-Agent funktioniert.")).toBeVisible();
    expect(errors).toEqual([]);
  });
}

for (const theme of ["light", "dark"]) {
  test(`FR-005: ${theme} mobile feedback is readable without overflow`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.addInitScript((theme) => {
      localStorage.setItem("theme", theme);
      Object.defineProperty(navigator, "clipboard", { configurable: true, value: undefined });
    }, theme);
    await page.goto("/");
    await page.getByRole("button", { name: "Copy DEV link" }).click();
    const status = page.getByRole("status", { name: "DEV link copy status" });
    await expect(status).toContainText("copy its address manually");
    await expect(status).toHaveAttribute("aria-atomic", "true");
    const box = await status.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.x + box!.width).toBeLessThanOrEqual(390);
    expect(await status.evaluate((element) => element.scrollWidth <= element.clientWidth)).toBe(
      true,
    );
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(
      390,
    );
  });
}

test("FR-006: no-JavaScript links remain usable and copying is never claimed", async ({
  browser,
}) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    baseURL: process.env.DEV_URL,
  });
  try {
    const page = await context.newPage();
    await context.route(stableUrl, (route) => route.fulfill({ body: "Stable DEV destination" }));
    await page.goto("/");
    const link = page.getByRole("link", { name: "Open stable DEV" });
    await expect(link).toHaveAttribute("href", stableUrl);
    await expect(page.getByRole("link", { name: "View repository" })).toHaveAttribute(
      "href",
      "https://github.com/ThomasRey123/agentic-webapp",
    );
    await page.getByRole("button", { name: "Copy DEV link" }).click();
    await expect(page.getByRole("status", { name: "DEV link copy status" })).toBeEmpty();
    const popup = page.waitForEvent("popup");
    await link.click();
    const opened = await popup;
    await opened.waitForLoadState("domcontentloaded");
    expect(opened.url()).toBe(stableUrl);
  } finally {
    await context.close();
  }
});
