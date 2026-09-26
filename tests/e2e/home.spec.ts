import { expect, test } from "@playwright/test";

test("loads the home page with its primary links and static logo", async ({ page }) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", {
      level: 1,
      name: /to get started, edit the home-page\.tsx file/i,
    }),
  ).toBeVisible();

  const logo = page.getByRole("img", { name: "Next.js logo" });
  await expect(logo).toBeVisible();
  await expect
    .poll(() =>
      logo.evaluate((image: HTMLImageElement) => image.complete && image.naturalWidth > 0),
    )
    .toBe(true);

  const documentation = page.getByRole("link", { name: "Documentation" });
  await expect(documentation).toBeVisible();
  await expect(documentation).toHaveAttribute("href", /^https:\/\/nextjs\.org\/docs/);
  await expect(documentation).toHaveAttribute("target", "_blank");
  await expect(documentation).toHaveAttribute("rel", /noopener/);

  await expect(page.getByRole("link", { name: "Deploy Now" })).toBeVisible();
  await documentation.focus();
  await expect(documentation).toBeFocused();
});
