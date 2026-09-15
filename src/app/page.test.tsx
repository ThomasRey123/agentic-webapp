import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import Home from "./page";

vi.mock("@/features/home", () => ({
  HomePage: () => <div data-testid="home-feature" />,
}));

describe("Home", () => {
  it("composes the Home feature", () => {
    render(<Home />);

    expect(screen.getByTestId("home-feature")).toBeInTheDocument();
  });
});
