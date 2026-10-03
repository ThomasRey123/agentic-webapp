import { expect, test } from "@playwright/test";

test("loads the project workflow with its primary links", async ({ page }) => {
  await page.goto("/");

  await expect(page).toHaveTitle("Agentic Web App");
  await expect(page.locator('meta[name="description"]')).toHaveAttribute(
    "content",
    "A learning project for controlled agentic software delivery from ChatGPT to verified DEV deployments.",
  );

  await expect(page.getByRole("heading", { level: 1, name: "Agentic Web App" })).toBeVisible();
  await expect(
    page.getByRole("heading", {
      level: 2,
      name: /controlled agentic software delivery/i,
    }),
  ).toBeVisible();

  await expect(page.getByText("ChatGPT request")).toBeVisible();
  await expect(page.getByText("Verified stable DEV deployment")).toBeVisible();

  const cloudTest = page.getByRole("button", { name: "Cloud-Test" });
  const cloudConfirmation = page.getByText("Der Cloud-Agent funktioniert.");
  await expect(cloudTest).toBeVisible();
  await expect(cloudConfirmation).toBeHidden();
  await cloudTest.focus();
  await expect(cloudTest).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(cloudConfirmation).toBeVisible();

  const repository = page.getByRole("link", { name: "View repository" });
  await expect(repository).toBeVisible();
  await expect(repository).toHaveAttribute(
    "href",
    "https://github.com/ThomasRey123/agentic-webapp",
  );
  await expect(repository).toHaveAttribute("target", "_blank");
  await expect(repository).toHaveAttribute("rel", /noopener/);

  const stableDev = page.getByRole("link", { name: "Open stable DEV" });
  await expect(stableDev).toBeVisible();
  await expect(stableDev).toHaveAttribute(
    "href",
    "https://agentic-webapp-dev.tr-config-place.workers.dev/",
  );

  await repository.focus();
  await expect(repository).toBeFocused();
});
