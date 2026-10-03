import { ThemeToggle } from "@/features/theme";

import styles from "./home-page.module.css";

const deliverySteps = [
  "ChatGPT request",
  "Scoped branch and pull request",
  "Quality, security, and browser checks",
  "Isolated PR preview",
  "Human review and merge",
  "Verified stable DEV deployment",
];

export function HomePage() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <header className={styles.header}>
          <div>
            <p className={styles.eyebrow}>Agentisches Programmieren · Phase 3</p>
            <h1>Agentic Web App</h1>
          </div>
          <ThemeToggle />
        </header>

        <section className={styles.intro} aria-labelledby="project-purpose">
          <h2 id="project-purpose">A learning project for controlled agentic software delivery</h2>
          <p>
            This app demonstrates how a feature request can move from ChatGPT to a reviewed,
            independently verified DEV deployment while keeping the human merge as an explicit
            control point.
          </p>
        </section>

        <section className={styles.workflow} aria-labelledby="delivery-workflow">
          <h2 id="delivery-workflow">Delivery workflow</h2>
          <ol className={styles.steps}>
            {deliverySteps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </section>

        <nav className={styles.links} aria-label="Project links">
          <a
            className={styles.primary}
            href="https://github.com/ThomasRey123/agentic-webapp"
            target="_blank"
            rel="noopener noreferrer"
          >
            View repository
          </a>
          <a
            className={styles.secondary}
            href="https://agentic-webapp-dev.tr-config-place.workers.dev/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Open stable DEV
          </a>
        </nav>
      </main>
    </div>
  );
}
