# Nächste Schritte nach Pilot und sichtbarer Folgeänderung

Stand: 14. Oktober 2026 (Europe/Berlin). Aktueller Einstieg:
[Worker-Übergabe](worker-handoff.md). Historische `PROJECT_STATE_*`-Dateien sind
Momentaufnahmen; GitHub liefert den aktuellen Status.

## Prioritäten

1. **Gravurkatalog mit Kontakt spezifizieren und freigeben.**
   [Epic #115](https://github.com/ThomasRey123/agentic-webapp/issues/115) ist der
   neue Owner-Auftrag; [Shop-Spec](../specs/engraving-shop/spec.md) / Issue #116
   legt den ersten Umfang fest. Noch keine Umsetzung vor Owner-Spec-Merge.
   Danach folgen getrennte Aufträge für Admin-/Produktgrundlage und Katalog/Kontakt;
   Architektur-/Hostingbedarf zuerst begründen. Kundenkonten, Warenkorb, Bestellung
   und Online-Bezahlung sind auf Owner-Wunsch entfernt. Der Katalog ersetzt
   die bisherige Projektseite vollständig; keine Demo-/Archivroute `/projekt`.
   Allgemeines Kontaktformular, kein Verkauf per E-Mail. Informations-/Rechtstexte
   zunächst als markierte, adminbearbeitbare Beispiele; vor Echtbetrieb prüfen/ersetzen.
   Epoxidharz ist zurückgestellt. Die [SDD-Auswertung](sdd-pilot-review.md) ist
   mit #114 geliefert; Epic #90 ist abgeschlossen, kein weiterer SDD-Werkzeugauftrag.
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
