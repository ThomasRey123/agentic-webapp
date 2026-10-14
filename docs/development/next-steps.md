# Nächste Schritte nach Pilot und sichtbarer Folgeänderung

Stand: 14. Oktober 2026 (Europe/Berlin). Aktueller Einstieg:
[Worker-Übergabe](worker-handoff.md). Historische `PROJECT_STATE_*`-Dateien sind
Momentaufnahmen; GitHub liefert den aktuellen Status.

## Prioritäten

1. **Gravurkatalog planen, dann umsetzen.**
   [Epic #115](https://github.com/ThomasRey123/agentic-webapp/issues/115): Spec #117
   ist owner-gemergt (`0a2235ba264ecd8f0dd228458547fd275ca3ad68`).
   Planungs-Issue #118 enthält [Plan](../specs/engraving-shop/plan.md), daraus
   abgeleitete [Tasks](../specs/engraving-shop/tasks.md) und die Runtime-ADR.
   Danach eigene A-/B-Implementierungsaufträge: Admin-/Produktgrundlage, dann
   Katalog/Kontakt/Informationsseiten und vollständige Ablösung der alten Seite.
   Account-/Kosten-/Auth-/Mailvoraussetzungen vor Remoteeinrichtung klären;
   keine Shopkonten, Warenkörbe, Bestellungen, Verkäufe oder Zahlungen.
   Beispieltexte vor Echtbetrieb prüfen/ersetzen, Epoxidharz zurückgestellt.
   Die SDD-Auswertung ist geliefert (#114/#90), kein SDD-Werkzeugauftrag.
2. **Wartung fortführen.** Dependabot wöchentlich prüfen; Node-LTS nach dem
   [Update-Verfahren](node-updates.md). Für [#82](https://github.com/ThomasRey123/agentic-webapp/issues/82)
   nur einen tatsächlich veröffentlichten, unterstützten braces-Fix übernehmen.
   Keine Unterdrückung des Befunds oder pauschale Upgrades.
3. **Berechtigungen bei konkreten Änderungen erneut prüfen.** Trigger, Artefakte,
   Checkouts, Secrets oder Hauptversionen von Actions können eine erneute
   [Delivery-Prüfung](delivery-review.md) erfordern. Historische Tokenbestätigung
   ist keine neue unabhängige Prüfung der Cloudflare-Rechte.
4. **PROD bei Bedarf separat planen.** Environment/Credentials, menschliche
   Freigabe, Promotion-Kriterien und Rollback festlegen; aktuell zurückgestellt.

## Erhaltene Grenzen

`quality`, `browser` und `secret-scan` bleiben verpflichtend; Dependency-Audit
ist sichtbar und advisory. Neue Nutzerabläufe behalten Browserregressionen und
Spec-Freigabe. Kontrast-Incompletes und ungeprüfte hörbare Screenreader-Ausgabe
bleiben ausdrücklich dokumentiert; Details stehen in der Auswertung.
Ein dauerhafter Worker, Orchestrator oder SDD-Werkzeug benötigt einen konkreten
beobachteten Bedarf und eigenen Auftrag. Die Auswertung installiert kein Werkzeug.
