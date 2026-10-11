import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { HomeFaq } from "../components/home-faq";

describe("HomeFaq", () => {
  it("initially hides all three answers", () => {
    render(<HomeFaq />);

    const faq = screen.getByRole("region", { name: "Frequently asked questions" });
    const questions = within(faq).getAllByText(/^(How|Who) /);
    expect(questions).toHaveLength(3);

    for (const question of questions) {
      expect(question).toBeVisible();
      expect(question.nextElementSibling).not.toBeVisible();
    }
  });

  it.each([
    "How does a request become a DEV preview?",
    "How are changes verified?",
    "Who approves a merge and deployment?",
  ])("opens and closes %s without opening another answer", (name) => {
    render(<HomeFaq />);

    const question = screen.getByText(name);
    const answer = question.nextElementSibling;
    expect(answer).not.toBeVisible();

    fireEvent.click(question);
    expect(answer).toBeVisible();
    for (const other of screen.getAllByText(/^(How|Who) /)) {
      if (other !== question) expect(other.nextElementSibling).not.toBeVisible();
    }

    fireEvent.click(question);
    expect(answer).not.toBeVisible();
  });
});
