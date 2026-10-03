import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { HomePage } from "../components/home-page";

describe("HomePage", () => {
  it("renders the project purpose and delivery workflow", () => {
    render(<HomePage />);

    expect(
      screen.getByRole("heading", { level: 1, name: "Agentic Web App" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        level: 2,
        name: /controlled agentic software delivery/i,
      }),
    ).toBeInTheDocument();
    expect(screen.getByText("ChatGPT request")).toBeInTheDocument();
    expect(screen.getByText("Verified stable DEV deployment")).toBeInTheDocument();
  });

  it("links to the repository and stable DEV environment", () => {
    render(<HomePage />);

    expect(screen.getByRole("link", { name: "View repository" })).toHaveAttribute(
      "href",
      "https://github.com/ThomasRey123/agentic-webapp",
    );
    expect(screen.getByRole("link", { name: "Open stable DEV" })).toHaveAttribute(
      "href",
      "https://agentic-webapp-dev.tr-config-place.workers.dev/",
    );
  });
});
