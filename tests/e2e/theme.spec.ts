import { expect, test } from "@playwright/test";

test("remembers a chosen theme after a page reload", async ({ page }) => {
  await page.goto("/");

  const toggle = page.getByRole("button", { name: "Theme wechseln" });
  await expect(toggle).toBeVisible();

  // Start from a known state, regardless of the runner's color preference.
  await page.evaluate(() => localStorage.setItem("theme", "light"));
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");

  await toggle.click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await expect(toggle).toContainText("Helles Design");
  await expect.poll(() => page.evaluate(() => localStorage.getItem("theme"))).toBe("dark");

  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await expect(toggle).toContainText("Helles Design");

  await toggle.click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
});
