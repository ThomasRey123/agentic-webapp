# Nächste Schritte nach Dependabot und dem Dark-Mode-Browsertest

Diese Liste ergänzt den nachgewiesenen Projektstand in [`PROJECT_STATE_V7.md`](../../PROJECT_STATE_V7.md). Sie enthält Aufgaben für spätere, getrennte Pull Requests.

1. **Unbeaufsichtigten Coding-Durchlauf belegen.** Ein kleines Feature einmalig in ChatGPT beauftragen, die Sitzung nicht weiter steuern und prüfen, ob Implementierung, CI, PR und DEV ohne weitere Eingriffe entstehen. Falls die Codierung beim Ende der Sitzung stoppt, erst dann einen dauerhaften Worker-Mechanismus anhand des tatsächlichen Fehlers auswählen. Die menschliche PR-Prüfung und der Merge bleiben erhalten.
2. **PR-Vorschau besser auffindbar machen.** Vorschau-URL und Ergebnis des Browserlaufs am PR oder GitHub-Deployment anzeigen; Fehlschläge eindeutig melden. Bei mehreren Commits pro PR sicherstellen, dass nur der aktuelle geprüfte Commit als bereit angezeigt wird.
3. **DEV-Rollback dokumentieren und testen.** Letzten funktionierenden Worker-Stand identifizieren, die Cloudflare-Rollback-Prozedur und nötige Berechtigungen dokumentieren und den Smoke-Test nach dem Rollback wiederholen.
4. **Workflow-Berechtigungen regelmäßig prüfen.** Insbesondere `workflow_run`, heruntergeladene Artefakte, Token-Rechte, Secrets, Actions-SHAs und Dependabot-PRs prüfen. Die Bereitstellung darf weiterhin keinen nicht geprüften PR-Code mit Cloudflare-Zugangsdaten ausführen.
5. **PROD erst bei Bedarf planen.** Separates Environment und Secrets, bewusste menschliche Freigabe, Rollback und klare Promotion-Kriterien definieren. Kein automatisches PROD-Deployment aus einem Coding-Agenten.
