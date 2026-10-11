import styles from "./home-faq.module.css";

export function HomeFaq() {
  return (
    <section className={styles.faq} aria-labelledby="project-faq">
      <h2 id="project-faq">Frequently asked questions</h2>
      <details>
        <summary>How does a request become a DEV preview?</summary>
        <p>
          A ChatGPT request becomes a scoped GitHub issue, a working branch, and a pull request.
          After automated checks pass, the pipeline deploys an isolated DEV preview for review.
        </p>
      </details>
      <details>
        <summary>How are changes verified?</summary>
        <p>
          The agent creates changes. The pipeline independently checks formatting, code quality,
          types, tests, and the production build. Browser tests and secret scanning are required;
          dependency audit findings are reported for review.
        </p>
      </details>
      <details>
        <summary>Who approves a merge and deployment?</summary>
        <p>
          A human reviews the pull request and tests its preview before merging. The verified main
          commit then deploys to stable DEV. Production deployment remains deferred, and the agent
          does not merge its own pull request.
        </p>
      </details>
    </section>
  );
}
