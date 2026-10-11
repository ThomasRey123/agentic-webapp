import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { mkdir, writeFile } from "node:fs/promises";
import { dirname } from "node:path";

const scope = 'nav[aria-label="Project links"]';
const tags = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"];

for (const theme of ["light", "dark"] as const) {
  for (const state of ["idle", "pending", "success", "error"] as const) {
    test(`FR-005: ${theme}/${state} scoped accessibility audit`, async ({ page }, testInfo) => {
      await page.addInitScript((theme) => {
        localStorage.setItem("theme", theme);
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
      }, theme);
      await page.goto("/");
      await expect(page.locator("html")).toHaveAttribute("data-theme", theme);
      const region = page.locator(scope);
      await expect(region).toBeVisible();
      const button = region.getByRole("button", { name: "Copy DEV link", exact: true });
      const status = region.getByRole("status", { name: "DEV link copy status" });
      await expect(status).toBeEmpty();
      await region.getByRole("link", { name: "Open stable DEV" }).focus();
      await page.keyboard.press("Tab");
      await expect(button).toBeFocused();
      expect(await button.evaluate((element) => getComputedStyle(element).outlineStyle)).toBe(
        "solid",
      );
      expect(
        await button.evaluate((element) => parseFloat(getComputedStyle(element).outlineWidth)),
      ).toBeGreaterThan(0);

      if (state !== "idle") {
        await page.keyboard.press("Enter");
        await expect(status).toHaveText("Copying the DEV link…");
        await expect(button).toBeFocused();
        if (state !== "pending") {
          await page.evaluate((success) => window.copyTest.settle(success), state === "success");
          if (state === "success") await expect(status).toHaveText("DEV link copied.");
          else await expect(status).toContainText("copy its address manually");
        }
      }
      await expect(button).toBeFocused();
      await expect(button).toHaveAttribute("aria-disabled", String(state === "pending"));

      // Inspect Chromium's computed accessibility semantics, not audible output.
      const session = await page.context().newCDPSession(page);
      try {
        const { root } = await session.send("DOM.getDocument");
        const { nodeId } = await session.send("DOM.querySelector", {
          nodeId: root.nodeId,
          selector: `${scope} [role="status"]`,
        });
        const { nodes } = await session.send("Accessibility.getPartialAXTree", {
          nodeId,
          fetchRelatives: false,
        });
        const node = nodes.find((node) => node.role?.value === "status");
        expect(node).toBeDefined();
        expect(node?.properties).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              name: "live",
              value: expect.objectContaining({ value: "polite" }),
            }),
            expect.objectContaining({
              name: "atomic",
              value: expect.objectContaining({ value: true }),
            }),
          ]),
        );
      } finally {
        await session.detach();
      }

      const results = await new AxeBuilder({ page }).include(scope).withTags(tags).analyze();
      const report = {
        requirement: "FR-005",
        theme,
        state,
        scope,
        tags,
        screenReaderAnnouncements: "not tested (optional)",
        incompleteDisposition: "Unverified; requires review, not a pass or audible evidence.",
        results,
      };
      const path = testInfo.outputPath(`copy-accessibility-${theme}-${state}.json`);
      await mkdir(dirname(path), { recursive: true });
      await writeFile(path, JSON.stringify(report, null, 2));
      await testInfo.attach("copy-accessibility", { path, contentType: "application/json" });
      console.log(
        `axe ${results.testEngine.version} ${theme}/${state}: ${results.violations.length} violations; incomplete: ${results.incomplete.map((rule) => rule.id).join(", ") || "none"}`,
      );
      expect(results.passes.length).toBeGreaterThan(0);
      expect(results.violations, JSON.stringify(results.violations, null, 2)).toEqual([]);
    });
  }
}
