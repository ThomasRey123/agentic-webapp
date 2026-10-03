"use client";

import { useState } from "react";

import styles from "./home-page.module.css";

export function CloudTest() {
  const [hasRun, setHasRun] = useState(false);

  return (
    <div className={styles.cloudTest}>
      <button type="button" onClick={() => setHasRun(true)}>
        Cloud-Test
      </button>
      {hasRun && <p role="status">Der Cloud-Agent funktioniert.</p>}
    </div>
  );
}
