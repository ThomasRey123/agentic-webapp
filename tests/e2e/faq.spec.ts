import { expect, test } from "@playwright/test";

for (const theme of ["light", "dark"] as const) {
  test(`opens and closes FAQ answers with mouse and keyboard in ${theme} theme`, async ({
    page,
  }) => {
    await page.goto("/");
    await page.evaluate((value) => localStorage.setItem("theme", value), theme);
    await page.reload();
    await expect(page.locator("html")).toHaveAttribute("data-theme", theme);

    const faq = page.getByRole("region", { name: "Frequently asked questions" });
    const questions = faq.locator("summary");
    const answers = faq.locator("details > p");
    await expect(questions).toHaveCount(3);

    for (let index = 0; index < 3; index++) {
      await expect(questions.nth(index)).toBeVisible();
      await expect(answers.nth(index)).toBeHidden();
      await questions.nth(index).click();
      await expect(answers.nth(index)).toBeVisible();
      await questions.nth(index).click();
      await expect(answers.nth(index)).toBeHidden();
    }

    const toggle = page.getByRole("button", { name: "Theme wechseln" });
    await toggle.focus();
    await page.keyboard.press("Tab");

    for (let index = 0; index < 3; index++) {
      const question = questions.nth(index);
      await expect(question).toBeFocused();
      await expect(question).toHaveCSS("outline-style", "solid");
      await expect(question).toHaveCSS("outline-width", "2px");
      await page.keyboard.press("Enter");
      await expect(answers.nth(index)).toBeVisible();
      await page.keyboard.press("Space");
      await expect(answers.nth(index)).toBeHidden();
      await page.keyboard.press("Tab");
    }

    await expect(page.getByRole("link", { name: "View repository" })).toBeFocused();
    await questions.first().click();
    await toggle.click();
    await expect(page.locator("html")).toHaveAttribute(
      "data-theme",
      theme === "light" ? "dark" : "light",
    );
    await expect(answers.first()).toBeVisible();
    await questions.first().click();
    await expect(answers.first()).toBeHidden();
  });
}
