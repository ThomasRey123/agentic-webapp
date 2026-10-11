# Nächste Schritte nach dem gelieferten SDD-Piloten

## Verifizierter Stand am 11. Oktober 2026

Der aktuelle Einstieg steht in [worker-handoff.md](worker-handoff.md).
Liefernachweise stehen dort und in [delivery-review.md](delivery-review.md).
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

1. **Sichtbare Folgeänderung am Pilot spezifizieren und liefern.**
   „DEV-Link kopieren“ ist unter der revidierten Abnahme geliefert: PR #98,
   Testkorrektur #100 und automatisierte Prüfungen #104 sind gemergt. Main-CI,
   DEV und alle 19 Remote-Browserfälle sind erfolgreich. Spec-Freigabe #102
   ersetzt den verpflichtenden realen Screenreader-Test durch die dokumentierten
   automatisierten Prüfungen; hörbare Ausgabe bleibt optional und ungeprüft.
   Sechs Kontrastprüfungen bleiben automatisch unbewertbar.
   [Tasks/Nachweise](../specs/copy-dev-link/tasks.md) enthalten die Ergebnisse.
   Das konkrete nächste sichtbare Verhalten ist noch nicht ausgewählt.
   Owner-Auftrag klären, Spec-Issue/Spec-only-PR erstellen, erst nach dessen
   Owner-Merge eine separate Umsetzung beginnen. Die Abnahmepolitik-Revision
   zählt nicht als die geplante sichtbare Folgeänderung.
2. **SDD-Nutzen nach der Folgeänderung bewerten.** Anforderungen/Testnachweise,
   Review-Aufwand und beobachtete Fehler betrachten; nur begründete zusätzliche
   Automatisierung ergänzen. [Epic #90](https://github.com/ThomasRey123/agentic-webapp/issues/90)
   bleibt für Folgeänderung und Bewertung offen. Kein neuer Feature-Auftrag,
   SDD-CLI oder dauerhafter Worker ist durch diese Übergabe freigegeben.
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
