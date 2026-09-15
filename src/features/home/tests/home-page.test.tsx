import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { HomePage } from "../components/home-page";

describe("HomePage", () => {
  it("renders the primary getting-started content", () => {
    render(<HomePage />);

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: /to get started, edit the home-page\.tsx file/i,
      }),
    ).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "Next.js logo" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Documentation" })).toHaveAttribute(
      "href",
      expect.stringContaining("nextjs.org/docs"),
    );
  });
});
