# Nächste Schritte nach Dependabot und dem Dark-Mode-Browsertest

Diese Liste ergänzt den nachgewiesenen Projektstand in [`PROJECT_STATE_V7.md`](../../PROJECT_STATE_V7.md). Sie enthält Aufgaben für spätere, getrennte Pull Requests.

Der Browserjob prüft die vorhandenen Startseiten-, Link-, Asset- und Theme-Abläufe. Das aktive [`protect-main`-Ruleset](https://github.com/ThomasRey123/agentic-webapp/rules/23471361) verlangt seit dem 26. September 2026 `browser` zusätzlich zu `quality` und `security`. Die erforderlichen Checks wurden nach einem erfolgreichen PR-Browserlauf über die GitHub-REST-API kontrolliert.

1. **Unbeaufsichtigten Coding-Durchlauf belegen.** Ein kleines Feature einmalig in ChatGPT beauftragen, die Sitzung nicht weiter steuern und prüfen, ob Implementierung, CI, PR und DEV ohne weitere Eingriffe entstehen. Falls die Codierung beim Ende der Sitzung stoppt, erst dann einen dauerhaften Worker-Mechanismus anhand des tatsächlichen Fehlers auswählen. Die menschliche PR-Prüfung und der Merge bleiben erhalten.
2. **PR-Vorschau besser auffindbar machen.** Vorschau-URL und Ergebnis des Browserlaufs am PR oder GitHub-Deployment anzeigen; Fehlschläge eindeutig melden. Bei mehreren Commits pro PR sicherstellen, dass nur der aktuelle geprüfte Commit als bereit angezeigt wird.
3. **DEV-Rollback dokumentieren und testen.** Letzten funktionierenden Worker-Stand identifizieren, die Cloudflare-Rollback-Prozedur und nötige Berechtigungen dokumentieren und den Smoke-Test nach dem Rollback wiederholen.
4. **Workflow-Berechtigungen regelmäßig prüfen.** Insbesondere `workflow_run`, heruntergeladene Artefakte, Token-Rechte, Secrets, Actions-SHAs und Dependabot-PRs prüfen. Die Bereitstellung darf weiterhin keinen nicht geprüften PR-Code mit Cloudflare-Zugangsdaten ausführen.
5. **PROD erst bei Bedarf planen.** Separates Environment und Secrets, bewusste menschliche Freigabe, Rollback und klare Promotion-Kriterien definieren. Kein automatisches PROD-Deployment aus einem Coding-Agenten.


## Phase-3-Hardening nach dem ersten unbeaufsichtigten Durchlauf

Issue #58 dokumentiert die beim ersten Phase-3-Durchlauf gefundenen Vorab-Verifikationslücken. Der zugehörige Hardening-PR führt ein gemeinsames Pre-PR-Gate (`pnpm check:pr`), zentrales Testing-Library-Cleanup und verbindliche Worker-Regeln für nicht ausführbare lokale Checks ein. Nach dem Merge soll ein zweiter kleiner UI-Durchlauf prüfen, ob die zuvor lokal erkennbaren Fehler vor der PR-Erstellung abgefangen werden.
