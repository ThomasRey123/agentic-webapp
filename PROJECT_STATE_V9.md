# Projektstand V9 – Übergabe an den nächsten ChatGPT-Worker

**Stand:** 3. Oktober 2026 · **Repository:** [ThomasRey123/agentic-webapp](https://github.com/ThomasRey123/agentic-webapp) · **Vorgänger:** [V8](PROJECT_STATE_V8.md)

> Diese Momentaufnahme bezieht sich auf `main` nach [PR #69](https://github.com/ThomasRey123/agentic-webapp/pull/69) bei Commit [`5dc9cdc`](https://github.com/ThomasRey123/agentic-webapp/commit/5dc9cdc9771826d34500750c846cd218781977f7). Vor neuer Arbeit den Live-Stand erneut prüfen. Diese Dokumentationsänderung selbst wird über [Issue #70](https://github.com/ThomasRey123/agentic-webapp/issues/70) und [PR #71](https://github.com/ThomasRey123/agentic-webapp/pull/71) eingereicht und gehört erst nach dessen Merge zu `main`.

## Auftrag und Vertrauensgrenzen

Der Nutzer beschreibt Features direkt in ChatGPT. Der Coding-Agent erstellt bei Bedarf ein GitHub-Issue, arbeitet auf einem eigenen Branch und öffnet einen Pull Request. GitHub ist die technische Source of Truth für Aufgaben, Commits, CI und Deployment-Nachweise. Der Agent merged seinen eigenen PR nicht. Erst nach menschlichem Review und Merge wird der verifizierte `main`-Commit automatisch auf das stabile Cloudflare-DEV-System ausgerollt. PROD ist weiterhin nicht eingerichtet und benötigt später eine ausdrückliche menschliche Freigabe mit separaten Credentials und Rollback-Regeln.

`quality` und `browser` sind die erforderlichen Prüfgates für `main`. Der `security`-Job bleibt sichtbar: Gitleaks ist blockierend, der Dependency-Audit ist seit [PR #61](https://github.com/ThomasRey123/agentic-webapp/pull/61) advisory. Das bedeutet nicht, dass Audit-Befunde ignoriert werden; sie werden geprüft und getrennt von Feature-Arbeit behoben. Cloudflare-Secrets liegen im GitHub-Environment `development`, und ungeprüfter PR-Code wird nicht mit diesen Credentials ausgeführt.

**Wichtige Grenze:** Der Cloud-Test hat den Weg vom einzelnen ChatGPT-Auftrag bis zur PR-Vorschau und nach menschlichem Merge bis zum stabilen DEV erneut belegt. Er beweist nicht, dass die Coding-Phase nach dem Ende einer ChatGPT-Sitzung ohne aktiven Worker weiterläuft. GitHub Actions laufen nach ihrem Start selbstständig; die Dauerhaftigkeit des Coding-Workers bleibt ein eigenes Milestone.

## Verifizierter technischer Stand

| Bereich           | Umsetzung und Nachweis                                                                                                                                                                                                                                                                                                   |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| App               | Next.js `16.3.7`, React `19.3.0`, App Router, striktes TypeScript und statischer Export. Die Startseite erklärt den Phase-3-Lieferweg, verlinkt Repository und stabiles DEV, unterstützt ein über Reload gespeichertes Theme und enthält den getesteten Cloud-Test.                                                      |
| Qualität          | `pnpm check` prüft Formatierung, ESLint, TypeScript, Unit-/Node-Tests und den Produktions-Build. Für nutzerseitige Änderungen ist seit [PR #64](https://github.com/ThomasRey123/agentic-webapp/pull/64) `pnpm check:pr` vorgeschrieben; es ergänzt die vollständige Playwright-Suite gegen einen lokalen Next.js-Server. |
| CI und Sicherheit | Das `main`-Ruleset verlangt `quality` und `browser`. `security` führt weiterhin Dependency-Audit und Gitleaks aus; nur der Audit ist advisory. Fehlende oder fehlgeschlagene Pflichtprüfungen dürfen nicht umgangen werden.                                                                                              |
| PR-Vorschau       | Nach erfolgreicher PR-CI deployt ein vertrauenswürdiger `workflow_run`-Workflow das geprüfte statische Artefakt auf `agentic-webapp-pr-<PR-Nummer>`, führt einen Smoke-Test aus und prüft die Theme-Persistenz mit Testcode von `main`. Die vollständigen featurebezogenen Browsertests laufen vorher im `browser`-Job.  |
| Stabiles DEV      | Nach erfolgreicher `main`-CI wird genau der verifizierte Commit auf [agentic-webapp-dev.tr-config-place.workers.dev](https://agentic-webapp-dev.tr-config-place.workers.dev/) bereitgestellt und remote smoke-getestet.                                                                                                  |
| Aufräumen         | Nach erfolgreichem DEV-Deployment werden die Vorschau und der unveränderte gemergte Branch entfernt. Geschlossene ungemergte PRs verlieren ihre Vorschau, ihr Branch bleibt. Die Reconciliation fängt ältere bereinigbare Ressourcen ab.                                                                                 |
| Toolchain         | Node `>=24.19.0 <25`, pnpm `11.19.0`, TypeScript `^6`, Vitest `4.1.11`, Playwright `1.63.0` und Wrangler `4.145.0`. Vitest 5 und Node-Typen 26 wurden bewusst nicht als Routineupdate übernommen.                                                                                                                        |

Für den oben genannten `main`-Commit waren [CI-Lauf 37142125474](https://github.com/ThomasRey123/agentic-webapp/actions/runs/37142125474), [DEV-Deploy 37142187287](https://github.com/ThomasRey123/agentic-webapp/actions/runs/37142187287) und [Reconciliation 37142300116](https://github.com/ThomasRey123/agentic-webapp/actions/runs/37142300116) erfolgreich. Unmittelbar danach gab es keine offenen PRs. Auf GitHub lagen nur `main` und der absichtlich erhaltene, ungemergte Test-Branch `agent/31-unmerged-cleanup-probe`. Der neue Dokumentationsbranch und PR #71 entstanden erst anschließend.

## Pull-Request-Bilanz vom 3. Oktober 2026

Berücksichtigt sind alle PRs, die an diesem Tag erstellt, gemergt oder geschlossen wurden, einschließlich älterer Dependabot-PRs mit Abschluss am 3. Oktober. Insgesamt wurden **16 PRs bearbeitet oder abgeschlossen: neun gemergt und sieben ohne Merge geschlossen**.

### Gemergte Änderungen

| PR                                                            | Ergebnis                                                                                                                                                                             |
| ------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [#48](https://github.com/ThomasRey123/agentic-webapp/pull/48) | Wrangler wurde von `4.137.0` auf `4.140.0` aktualisiert.                                                                                                                             |
| [#57](https://github.com/ThomasRey123/agentic-webapp/pull/57) | Die Starter-Seite wurde durch die responsive Phase-3-Projektübersicht mit Lieferworkflow, Projektlinks sowie Komponenten- und Browsertests ersetzt.                                  |
| [#59](https://github.com/ThomasRey123/agentic-webapp/pull/59) | Das Routineupdate brachte Next.js und `eslint-config-next` auf `16.3.7` sowie Wrangler auf `4.144.0`; nicht freigegebene Major-Updates blieben außen vor.                            |
| [#61](https://github.com/ThomasRey123/agentic-webapp/pull/61) | Der Dependency-Audit wurde advisory, damit sichtbare Audit-Befunde eine ansonsten vollständig geprüfte Preview nicht blockieren. Gitleaks blieb unverändert fatal.                   |
| [#63](https://github.com/ThomasRey123/agentic-webapp/pull/63) | Der vertrauenswürdige Post-Deploy-Browsertest wurde auf die stabile Theme-Persistenz begrenzt. Die vollständige Feature-Suite bleibt im vorgeschalteten `browser`-Job.               |
| [#64](https://github.com/ThomasRey123/agentic-webapp/pull/64) | `pnpm check:pr`, das Pre-PR-Runbook, gemeinsame Testing-Library-Bereinigung und verbindliche Regeln für Formatierung und Umgebungsgrenzen wurden ergänzt.                            |
| [#66](https://github.com/ThomasRey123/agentic-webapp/pull/66) | Projekttitel und Beschreibung ersetzten die generischen Starter-Metadaten; der Browser-Test deckt sie ab.                                                                            |
| [#67](https://github.com/ThomasRey123/agentic-webapp/pull/67) | Wrangler wurde von `4.144.0` auf `4.145.0` aktualisiert.                                                                                                                             |
| [#69](https://github.com/ThomasRey123/agentic-webapp/pull/69) | Der zugängliche Button **„Cloud-Test“** wurde ergänzt. Klick oder Tastaturaktivierung zeigt **„Der Cloud-Agent funktioniert.“**; Komponenten- und Browsertests decken den Ablauf ab. |

Alle neun gemergten PRs hatten erfolgreiche `quality`-, `security`- und `browser`-Checks. Kein fehlgeschlagener Pflichtcheck wurde umgangen.

### Geschlossene Dependabot-PRs ohne Merge

| PR                                                                                                                              | Einordnung                                                                                                                        |
| ------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| [#49](https://github.com/ThomasRey123/agentic-webapp/pull/49) und [#54](https://github.com/ThomasRey123/agentic-webapp/pull/54) | Das Major-Update von Vitest `4.1.11` auf `5.0.3` wurde nicht übernommen und bleibt eine eigene Migrationsaufgabe.                 |
| [#50](https://github.com/ThomasRey123/agentic-webapp/pull/50) und [#55](https://github.com/ThomasRey123/agentic-webapp/pull/55) | `@types/node` 26 wurde nicht übernommen, weil das Projekt auf Node 24 festgelegt ist.                                             |
| [#51](https://github.com/ThomasRey123/agentic-webapp/pull/51)                                                                   | Das Update von `cloudflare/wrangler-action` auf `4.1.3` wurde nicht gemergt; die verwendete Action bleibt per Commit-SHA gepinnt. |
| [#52](https://github.com/ThomasRey123/agentic-webapp/pull/52)                                                                   | Das Major-Update von `actions/upload-artifact` wurde nicht in diesem Durchlauf übernommen.                                        |
| [#53](https://github.com/ThomasRey123/agentic-webapp/pull/53)                                                                   | Der erste Routine-Gruppen-PR wurde durch den aktualisierten und später gemergten PR #59 ersetzt.                                  |

Diese sieben PRs hatten grüne `quality`- und `browser`-Checks, aber nach der damaligen Konfiguration einen fehlgeschlagenen `security`-Job. Sie wurden geschlossen statt über die roten Checks hinweg gemergt. PR #61 änderte anschließend nur die Behandlung des Dependency-Audits; Secret-Scanning bleibt eine harte Grenze.

## Verifizierter Cloud-Test-Durchlauf

Für [Issue #68](https://github.com/ThomasRey123/agentic-webapp/issues/68) wurde auf `agent/68-cloud-test` implementiert und [PR #69](https://github.com/ThomasRey123/agentic-webapp/pull/69) geöffnet. Lokal bestanden `pnpm format` und `pnpm check:pr`. Der [PR-CI-Lauf 37141294514](https://github.com/ThomasRey123/agentic-webapp/actions/runs/37141294514) bestand `quality`, `security` und `browser`. Der [Preview-Lauf 37141355457](https://github.com/ThomasRey123/agentic-webapp/actions/runs/37141355457) deployte und prüfte den isolierten Worker. Die Preview-URL wurde manuell in PR-Beschreibung und Kommentar ergänzt, nachdem sie zunächst nur in der Job-Zusammenfassung sichtbar war.

Nach menschlichem Merge bestand der neue `main`-Commit erneut CI, DEV-Deployment und Reconciliation. Der Coding-Agent hat den PR nicht selbst gemergt und nicht nach PROD deployt. Damit ist der technische ChatGPT-zu-Preview-zu-DEV-Pfad belegt; die Fortsetzung der Coding-Arbeit nach Sitzungsende ist davon ausdrücklich nicht umfasst.

## Orientierung im Repository

- [`AGENTS.md`](AGENTS.md): verbindliche Architektur-, Test-, Sicherheits-, Git- und PR-Regeln; vor jeder Änderung lesen.
- [`docs/development/worker-pre-pr-verification.md`](docs/development/worker-pre-pr-verification.md): exakte lokale Pre-PR-Sequenz und Umgang mit Umgebungsgrenzen.
- [`docs/architecture/phase-2.md`](docs/architecture/phase-2.md) und [`docs/development/chat-to-dev.md`](docs/development/chat-to-dev.md): Zielarchitektur und Weg vom Chat-Auftrag zur Vorschau.
- [`docs/development/workflow.md`](docs/development/workflow.md), [`docs/development/github-governance.md`](docs/development/github-governance.md) und [`docs/development/deployment.md`](docs/development/deployment.md): Branch-, Ruleset-, Review- und Deployment-Verfahren.
- [`docs/development/next-steps.md`](docs/development/next-steps.md): gepflegte Liste der noch offenen Arbeiten.
- [`.github/workflows/`](.github/workflows/) und [`tests/`](tests/): tatsächliche CI-, Preview-, Deployment- und Testimplementierung; Dokumentation immer gegen diese Dateien und aktuelle Runs prüfen.

## Konkreter Einstieg für den nächsten Worker

1. `main`, offene Issues und PRs, das Ruleset sowie die jüngsten CI-, Preview-, DEV- und Reconciliation-Läufe abrufen. Diese V9 ist eine datierte Momentaufnahme.
2. Vor Framework-Änderungen zusätzlich die zur installierten Next.js-Version gehörende Dokumentation unter `node_modules/next/dist/docs/` lesen.
3. Für jede neue Aufgabe ein eigenes Issue und einen Branch nach `agent/<issue>-<slug>` verwenden. Keine alten Branches wiederverwenden und keine fachfremden Änderungen beimischen.
4. Für eine nutzerseitige Änderung `pnpm install --frozen-lockfile`, `pnpm format` und `pnpm check:pr` ausführen. Eine nicht ausführbare Prüfung mit dem exakten Umgebungsfehler melden und niemals als bestanden bezeichnen.
5. Genau einen PR mit `Closes #<issue>`, tatsächlichen Testergebnissen, Risiken und Konfigurationshinweisen öffnen. `quality`, `browser`, `security` und den Preview-Lauf prüfen. Weder selbst mergen noch nach PROD deployen.
6. Nach menschlichem Merge den neuen `main`-CI-Lauf, das erfolgreiche stabile DEV-Deployment samt Smoke-Test und die Ressourcenbereinigung verifizieren, bevor die Änderung als vollständig ausgeliefert bezeichnet wird.

## Weiter offene Aufgaben in Prioritätsfolge

1. **Preview-URL automatisch im PR anzeigen:** Der Workflow schreibt sie derzeit in die Job-Zusammenfassung. Eine automatische PR-Anzeige muss idempotent sein, nur den aktuell geprüften Commit ausweisen und die zusätzlichen `workflow_run`-Berechtigungen sicher begrenzen.
2. Einen echten unbeaufsichtigten Coding-Worker-Versuch durchführen, der die Fortsetzung nach Ende der ChatGPT-Sitzung ausdrücklich prüft.
3. Eine DEV-Rollback-Prozedur dokumentieren und einschließlich anschließendem Smoke-Test praktisch erproben.
4. Vitest 5, Node-Typen 26 und nicht übernommene Action-Majors nur in getrennten, bewusst geprüften Update-PRs behandeln.
5. Advisory-Audit-Befunde weiter prüfen und in separaten Security-/Dependency-Aufgaben beheben; Gitleaks bleibt blockierend.
6. Den absichtlich erhaltenen Branch `agent/31-unmerged-cleanup-probe` nur bewusst behandeln und nicht als vergessenen gemergten Branch einstufen.
7. PROD erst bei realem Bedarf mit eigenem Environment, separaten Credentials, Freigabe-, Promotion- und Rollback-Regeln planen.

Diese Übergabe autorisiert weder einen Ruleset-Bypass noch einen Produktions-Deploy.
