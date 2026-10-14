# Übergabe an den nächsten Worker

Stand: 14. Oktober 2026 (Europe/Berlin). Repository:
`ThomasRey123/agentic-webapp`. GitHub ist die Quelle für aktuelle Merge-/CI-/DEV-Zustände.

## Genau hier weiterarbeiten

Der Copy-DEV-Link-Pilot und die sichtbare Folgeänderung sind geliefert.
Die Folgeänderung zeigt bei Kopierfehlern die auswählbare stabile DEV-Adresse.
Owner-Merge [#112](https://github.com/ThomasRey123/agentic-webapp/pull/112):
`0a2efae0da9912d2c1f4c4deb567680b64ba30b1`.
Main-CI 38436187920 und DEV 38436330269 einschließlich Smoke/Bereinigung
sind erfolgreich; 21/21 Browserfälle bestanden auf stabilem DEV.

Epic #90 ist nach Owner-Merge der Auswertung #114 abgeschlossen. Der genaue
Abschlussrecord steht in #90/#113/#114; der Dokumentationsmerge ist
`93e07d7c30caea95f03ba1f0f8adcb935fccd7bf`, Main-CI 38437770050 / DEV 38437935864
inklusive Smoke/Bereinigung erfolgreich.

Der aktuelle Owner-Auftrag ist [Katalog-Epic #115](https://github.com/ThomasRey123/agentic-webapp/issues/115).
Arbeitsname Gravurwerk, Deutschland, Creme/Holzbraun/Petrol; Holz/Leder/Glas mit
Produktkatalog und Kontaktmöglichkeit, separater Admin für Produkt-/Preis-/Bildpflege.
Owner hat am 14. Oktober Kundenkonten, Warenkorb, Bestellung und Online-Bezahlung
aus dem Umfang entfernt. Die alte Projekt-Demoseite wird bei Lieferung des
Katalogs vollständig ersetzt, keine Archivroute `/projekt`. Epoxidharz/Möbel
bleiben ausgeschlossen.

1. `AGENTS.md`, diese Übergabe, [Prioritäten](next-steps.md) und
   [Shop-Spec](../specs/engraving-shop/spec.md) lesen; aktuelle Main-/Issue-/PR-
   Zustände prüfen und fremde lokale Änderungen bewahren.
2. Spec-Issue #116 / dessen Spec-only-PR zuerst durch den Owner freigeben lassen.
   Keinen eigenen PR mergen; noch keine Shop-Implementierung, Datenbank oder
   kostenpflichtige Infrastruktur einrichten. Entwurf/CI ist keine Spec-Freigabe.
3. Nach tatsächlichem Owner-Merge separate Implementierungsaufträge gemäß Spec
   mit echtem Freigabe-SHA aufnehmen. Den nötigen Architekturwechsel als ADR
   begründen; keine Commerce-/Kundenkonto-/Payment-Infrastruktur mehr vorsehen.
   Alte Demo-Inhalte und deren ausschließlich zugehörige Tests im Katalog-PR
   durch die freigegebene Katalogoberfläche mit neuer Regression ersetzen.
   Pflichtprüfungen/Vorschau/DEV und separate PROD-Grenze erhalten.

## Nachweise und Prüfgrenzen

Die [Auswertung](sdd-pilot-review.md) verlinkt die Freigabe-/Lieferkette und
beobachtete Nacharbeit. [Spec](../specs/copy-dev-link/spec.md) und
[Tasks](../specs/copy-dev-link/tasks.md) enthalten Anforderungen und Tests;
finale Follow-up-Liefernachweise stehen in #111/#112/#90, nicht in den historischen
Pending-Zeilen der vor Merge erstellten Tasks. Keine alten Aufträge neu implementieren.

Axe meldete keine erkannten Verstöße in acht Project-links-Audits. Sechs Status-
und zwei neue Label-Kontrastknoten bleiben automatisch unbewertbar; manuelle
Visual-/Kontrastevidenz ergänzt sie. Hörbare Screenreader-Ausgabe ist ungeprüft
und optional. Keine vollständige WCAG-Konformität behaupten. CI-Artefakte haben
sieben Tage Aufbewahrung; frühere direkte Downloads waren mit 403 blockiert.

## Umgebung und verbleibende Arbeit

DEV: <https://agentic-webapp-dev.tr-config-place.workers.dev/>.
Node/pnpm/Next-/Playwright-Versionen aus `.nvmrc`, `package.json` und Lockfile
prüfen; keine pauschalen Updates. Veröffentlichte Cloud-Konfiguration mit
`*.tr-config-place.workers.dev` verwenden, aktuelle Runtime/Auth/Netzwerkbeobachtungen
neu prüfen. Sitzungsspezifische Hilfspfade unter `/workspace/.onboarding-tools`
und `/workspace/.onboarding-cache` nur verwenden, wenn sie vorhanden sind.

[Historische Umgebungsanleitung](https://github.com/ThomasRey123/agentic-webapp/blob/0a2efae0da9912d2c1f4c4deb567680b64ba30b1/docs/development/worker-handoff.md#arbeitsumgebung-und-wiederaufnahme)
enthält die erprobten Variablen/Remote-Kommandos. Proxy und CA-Vertrauen erhalten,
TLS-Prüfung nicht deaktivieren. Owner hat Vertrauen der bereits systemvertrauten
Umgebungs-CA und NSS-Zugriff dauerhaft autorisiert; konkrete Sandbox-Freigaben
bei Bedarf über den unterstützten Weg erneuern. Vorhandene NSS-Einträge bewahren,
keine fremde CA/Secrets auslesen. HTTP-403-Zielblockaden von CA/NSS-Problemen trennen.

[Issue #82](https://github.com/ThomasRey123/agentic-webapp/issues/82) verfolgt den
bekannten hohen braces-Entwicklungsbefund; Registry/Advisory vor einer separaten
Wartung erneut prüfen, kein Unterdrücken oder ungeprüftes Override. Wöchentliche
Dependabot-Updates und [Node-LTS-Verfahren](node-updates.md) bleiben erhalten.
Pflichtgates `quality`, `browser`, `secret-scan`, sichtbarer advisory Audit sowie
menschliche Merges bleiben unverändert. PROD ist zurückgestellt.
