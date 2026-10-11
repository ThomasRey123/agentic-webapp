# Nächste Schritte nach dem zweiten UI-Durchlauf

## Verifizierter Stand am 11. Oktober 2026

Der aktuelle Nachweis steht in [delivery-review.md](delivery-review.md).
Datierte `PROJECT_STATE_*`-Dateien bleiben historische Momentaufnahmen.

- **Unabhängige Prüfungen:** `protect-main` verlangt `quality`, `browser` und
  `secret-scan`. Dependency-Audit-Befunde sind sichtbar und werden separat bewertet.
- **PR-Vorschau:** Commitgenaue Deployment-Anzeige mit Smoke- und Theme-Browsertest
  live an PR #78 und #87 geprüft. Fehler/veraltete Identitäten haben Skripttests;
  absichtlich fehlschlagende Remote-Deployments wurden nicht durchgeführt.
- **Rollback:** Isolierte Übung 38141174993 erfolgreich; Baseline wiederhergestellt,
  Inhalt geprüft und Test-Worker entfernt. Kein Rollback des stabilen DEV durchgeführt.
- **Updates:** Dependabot-PRs #78–#80 gemergt; kombinierter Main-Stand, DEV und
  Bereinigung erfolgreich geprüft. Wöchentliche Updates bleiben unter menschlicher Prüfung.
- **Zweiter UI-Durchlauf:** FAQ aus Issue #86 / PR #87 implementiert, PR-CI und
  Vorschau erfolgreich, vom Eigentümer gemergt. Lokales `pnpm check:pr` ist im PR
  dokumentiert. Die vollständigen Laufnachweise und Beobachtungsgrenzen stehen im Review.
- **Cloud-Zugriff:** Wiederverwendbare Freigabe `*.tr-config-place.workers.dev`
  gespeichert; Zugriff auf die FAQ-Vorschau aus dieser Umgebung liefert HTTP 200.
  Neue Aufgaben müssen die veröffentlichte Konfiguration verwenden.
- **Berechtigungsprüfung:** Workflows, Artefakte, Checkouts und Live-GitHub-Regeln
  geprüft. PR #89 ist gemergt: Die ausdrückliche Push-/Repository-Prüfung für
  DEV ist aktiv; Main-CI, DEV-Smoke und Bereinigung sind erfolgreich. Der
  Eigentümer hat die Cloudflare-Tokenprüfung bestätigt; direkte API-Einsicht
  in die genauen Tokenrechte bleibt der Integration verwehrt.

## Prioritäten

1. **Spec Driven Development als nächstes großes Vorhaben planen.**
   [Epic #90](https://github.com/ThomasRey123/agentic-webapp/issues/90) hält den
   Auftrag fest. Der [recherchierte Plan](spec-driven-development-roadmap.md)
   beschreibt Primärquellen, Freigaben, Anforderungs-Test-Zuordnung und die
   schrittweise Einführung. Die aktuelle Änderung dokumentiert den Vorschlag;
   Agent-/CI-Regeln werden noch nicht umgestellt und kein Werkzeug installiert.
2. **Den freigegebenen Plan in kleinen Etappen umsetzen.** Zunächst Vorlage und
   Arbeitsvertrag abstimmen; danach einen kleinen neuen fachlichen Pilot
   spezifizieren, menschlich freigeben und mit dem bestehenden DEV-Ablauf
   liefern. Eine Folgeänderung belegt anschließend die Pflege der Spezifikation.
3. **Wartung fortführen.** Dependabot-Updates wöchentlich prüfen, Node-LTS-Updates
   gemäß [node-updates.md](node-updates.md) manuell koordinieren. Issue #82 bleibt
   offen, bis ein verifizierter unterstützter braces-Fix verfügbar ist.
4. **Berechtigungen erneut prüfen**, wenn Trigger, Artefakte, Checkouts, Secrets
   oder Hauptversionen von Actions geändert werden. Der Eigentümer prüft zusätzlich
   die Cloudflare-Account-/Tokenrechte direkt in Cloudflare.
5. **PROD bei konkretem Bedarf planen.** Separates Environment und Credentials,
   menschliche Freigabe, Promotion-Kriterien und Rollback festlegen.

## Bedarf für zusätzliche Automatisierung

Issue #58 führte das gemeinsame Pre-PR-Gate und verbindliche Worker-Regeln ein.
Der FAQ-Durchlauf liefert den zweiten technischen Nachweis nach diesem Hardening.
Ein dauerhafter Worker oder Agent-Orchestrator wird erst ausgewählt, wenn ein
beobachteter Sitzungsabbruch oder anderer konkreter Bedarf ihn rechtfertigt.
