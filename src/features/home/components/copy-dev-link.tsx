"use client";

import { useRef, useState } from "react";

import { stableDevUrl } from "../stable-dev-url";
import styles from "./copy-dev-link.module.css";

type CopyStatus = "idle" | "pending" | "success" | "error";

const messages: Record<CopyStatus, string> = {
  idle: "",
  pending: "Copying the DEV link…",
  success: "DEV link copied.",
  error:
    "Could not copy the DEV link. Select and copy the address below, or use “Open stable DEV” and copy its address manually.",
};

export function CopyDevLink() {
  const [status, setStatus] = useState<CopyStatus>("idle");
  const inFlight = useRef(false);

  async function copyLink() {
    if (inFlight.current) return;
    inFlight.current = true;
    setStatus("pending");

    try {
      if (!navigator.clipboard?.writeText) {
        setStatus("error");
        return;
      }
      await navigator.clipboard.writeText(stableDevUrl);
      setStatus("success");
    } catch {
      setStatus("error");
    } finally {
      inFlight.current = false;
    }
  }

  return (
    <>
      <button
        type="button"
        className={styles.button}
        aria-disabled={status === "pending"}
        onClick={copyLink}
      >
        Copy DEV link
      </button>
      <p
        className={styles.status}
        role="status"
        aria-label="DEV link copy status"
        aria-atomic="true"
      >
        {messages[status]}
      </p>
      {status === "error" && (
        <label className={styles.recovery}>
          Stable DEV address
          <textarea
            className={styles.address}
            readOnly
            value={stableDevUrl}
            rows={2}
            spellCheck={false}
          />
        </label>
      )}
    </>
  );
}
