import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { CopyDevLink } from "../components/copy-dev-link";

const originalClipboard = Object.getOwnPropertyDescriptor(navigator, "clipboard");
const url = "https://agentic-webapp-dev.tr-config-place.workers.dev/";
const button = () => screen.getByRole("button", { name: "Copy DEV link" });
const status = () => screen.getByRole("status", { name: "DEV link copy status" });

function clipboard(writeText: ReturnType<typeof vi.fn> | undefined) {
  Object.defineProperty(navigator, "clipboard", {
    configurable: true,
    value: writeText ? { writeText } : undefined,
  });
}

afterEach(() => {
  if (originalClipboard) Object.defineProperty(navigator, "clipboard", originalClipboard);
  else Reflect.deleteProperty(navigator, "clipboard");
});

describe("CopyDevLink", () => {
  it("FR-001/002: stays idle until activation, writes the exact URL and waits for completion", async () => {
    const attempt = Promise.withResolvers<void>();
    const write = vi.fn(() => attempt.promise);
    clipboard(write);
    render(<CopyDevLink />);
    expect(write).not.toHaveBeenCalled();
    expect(status()).toBeEmptyDOMElement();
    fireEvent.click(button());
    expect(write).toHaveBeenCalledWith(url);
    expect(status()).toHaveTextContent("Copying the DEV link…");
    expect(button()).toHaveAttribute("aria-disabled", "true");
    fireEvent.click(button());
    expect(write).toHaveBeenCalledTimes(1);
    await act(async () => attempt.resolve());
    expect(status()).toHaveTextContent("DEV link copied.");
    expect(button()).toHaveAttribute("aria-disabled", "false");
  });

  it("FR-003: rejected writes show manual recovery without leaking exception details", async () => {
    clipboard(vi.fn().mockRejectedValue(new Error("private exception details")));
    render(<CopyDevLink />);
    await act(async () => fireEvent.click(button()));
    expect(status()).toHaveTextContent("Could not copy the DEV link.");
    expect(status()).toHaveTextContent("Open stable DEV");
    expect(status()).toHaveTextContent("copy its address manually");
    expect(status()).not.toHaveTextContent("private exception details");
    expect(status()).not.toHaveTextContent("DEV link copied.");
  });

  it("FR-003: an unavailable clipboard has the same recovery", () => {
    clipboard(undefined);
    render(<CopyDevLink />);
    fireEvent.click(button());
    expect(status()).toHaveTextContent("Could not copy the DEV link.");
    expect(status()).toHaveTextContent("copy its address manually");
  });

  it("FR-003: a clipboard without writeText has the same recovery", () => {
    Object.defineProperty(navigator, "clipboard", { configurable: true, value: {} });
    render(<CopyDevLink />);
    fireEvent.click(button());
    expect(status()).toHaveTextContent("Could not copy the DEV link.");
  });

  it("FR-003: synchronous clipboard failures are handled", () => {
    clipboard(
      vi.fn(() => {
        throw new Error("blocked");
      }),
    );
    render(<CopyDevLink />);
    fireEvent.click(button());
    expect(status()).toHaveTextContent("Could not copy the DEV link.");
  });

  it("FR-004: retry replaces error with pending then success, and success with pending then error", async () => {
    const retry = Promise.withResolvers<void>();
    const last = Promise.withResolvers<void>();
    const write = vi
      .fn()
      .mockRejectedValueOnce(new Error("denied"))
      .mockImplementationOnce(() => retry.promise)
      .mockImplementationOnce(() => last.promise);
    clipboard(write);
    render(<CopyDevLink />);
    await act(async () => fireEvent.click(button()));
    expect(status()).toHaveTextContent("Could not copy");
    fireEvent.click(button());
    expect(status()).toHaveTextContent("Copying");
    expect(status()).not.toHaveTextContent("Could not copy");
    await act(async () => retry.resolve());
    expect(status()).toHaveTextContent("DEV link copied.");
    fireEvent.click(button());
    expect(status()).toHaveTextContent("Copying");
    expect(status()).not.toHaveTextContent("DEV link copied.");
    await act(async () => last.reject(new Error("denied again")));
    expect(status()).toHaveTextContent("Could not copy");
    expect(write).toHaveBeenCalledTimes(3);
  });
});
