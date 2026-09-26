# Agentisches Programmieren – Projektstand V5

**Version:** V5

**Stand:** 26. September 2026

**Status:** Phase 2 nachgewiesen; Phase 3, Milestone 1 (PR-Lebenszyklus-Aufräumen) in Umsetzung

**Vorgänger:** [`PROJECT_STATE_V4.md`](PROJECT_STATE_V4.md)

**Repository:** `ThomasRey123/agentic-webapp`

## Ziel und erreichter Workflow

Ein Feature-Wunsch startet direkt in ChatGPT. Ein Coding-Worker analysiert das Repository, erstellt bei Bedarf selbst ein Issue, arbeitet auf einem kurzlebigen Branch und öffnet einen PR. GitHub Actions prüft Qualität und Sicherheit und stellt eine eigene Cloudflare-PR-Vorschau bereit. Nach menschlicher Prüfung und Merge baut die CI `main` erneut, veröffentlicht das stabile DEV und führt einen Smoke-Test aus. Ein durchgehender Dark-Mode-Durchlauf mit PR #22 und stabilem DEV ist in V4 belegt. PROD ist zurückgestellt und bleibt eine menschliche Freigabe.

Der Agent merged seine PRs nicht selbst. `main` ist durch ein aktives Ruleset mit erforderlichen `quality`- und `security`-Checks geschützt. Der CI-Build des PR besitzt keine Cloudflare-Zugangsdaten; der privilegierte Preview-Deploy nutzt geprüfte Build-Artefakte und Konfiguration von `main`. Die Secrets liegen im GitHub-Environment `development`. Die neue `AGENTS.md`-Entwicklungsrichtlinie aus [PR #26](https://github.com/ThomasRey123/agentic-webapp/pull/26) ist gemergt: versionsbewusste APIs, verhältnismäßiges Design, begründete Abhängigkeiten, statischer Export, Tests und Barrierefreiheit.

## Phase 3 – Milestone 1

[Issue #27](https://github.com/ThomasRey123/agentic-webapp/issues/27) behandelt den Lebenszyklus von PR-Vorschauen und Feature-Branches:

- Nach erfolgreicher `main`-CI, stabilem DEV-Deployment und Smoke-Test entfernt der Folgejob den zum Merge-Commit gehörenden PR-Worker und den unveränderten kurzlebigen PR-Branch.
- Ein ohne Merge geschlossener PR entfernt nur seinen eigenen Worker. Bei erneut geöffnetem PR unterbleibt das Aufräumen.
- Fehlende Worker und bereits fehlende Branches gelten als erledigt; andere API-Fehler werden sichtbar. Der stabile Worker `agentic-webapp-dev` wird nie zum Löschziel.
- Frühere Branches und Workers bleiben zunächst bestehen. Eine einmalige Bereinigung setzt einen gesondert geprüften Bestand voraus.

Die technische Anleitung steht in [`docs/development/deployment.md`](docs/development/deployment.md). Bis zum Merge und dem erfolgreichen End-to-End-Nachweis von Issue #27 ist dieser Milestone **nicht abgeschlossen**.

## To-dos nach diesem Milestone

1. **Dependabot separat einrichten:** Regelmäßige PRs für aktuelle, kompatible Bibliotheks- und GitHub-Actions-Versionen sowie Sicherheitsupdates. Die Regeln zur Auswahl neuer Abhängigkeiten stehen bereits in `AGENTS.md`; die Update-Automatisierung ist noch nicht eingerichtet. Update-PRs laufen durch CI und werden vor dem Merge geprüft.
2. Gezielte Browser-Tests für wichtige Nutzerabläufe auf PR-Vorschauen, etwa Dark Mode und Persistenz nach Reload.
3. Deployment-Status und PR-Vorschau-URL verständlich am PR anzeigen; danach einen nachvollziehbaren DEV-Rollback erproben.
4. PROD erst in einer späteren Phase mit eigener Umgebung und bewusster menschlicher Freigabe planen.

Die nächsten Aufgaben bleiben getrennte Issues und PRs, damit die bestehende CI und das Ruleset jedes Vorhaben einzeln prüfen können.
