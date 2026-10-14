# Technischer Plan: Gravurwerk-Katalog und Kontakt

**Planungs-Issue:** [#118](https://github.com/ThomasRey123/agentic-webapp/issues/118).
**Freigegebene Spec:** `docs/specs/engraving-shop/spec.md`.
**Owner-Freigabe:** [#117](https://github.com/ThomasRey123/agentic-webapp/pull/117),
`0a2235ba264ecd8f0dd228458547fd275ca3ad68`.
Immutable Revision gelesen und Gleichheit mit Main geprüft. Keine Änderung der
Spec: zwölf aktive Anforderungen, FR-005–010 zurückgezogen. Plan zuerst erstellt,
danach [Tasks](tasks.md) daraus abgeleitet. Noch keine Anwendungsimplementierung.

## Ansatz und Reihenfolge

1. **Lokaler Runtime-/Binding-Nachweis:** Empfehlung aus
   [ADR-003](../../architecture/decisions/ADR-003-catalog-runtime.md) praktisch prüfen:
   Next.js 16.4.0 + OpenNext, D1/R2-Emulatoren, abgesicherte Adminroute und isolierter
   Mail-Testadapter. Paket-/Lizenz-/Securityprüfung, gemessene Bundlegröße und
   Node-vs-Worker-Tests vor Remoteumstellung. Kein pauschales Paketupgrade.
2. **Umsetzung A – Admin-/Produktgrundlage:** eigenes Issue/Branch/PR mit obiger
   Freigabe. Auth/Sitzungswiderruf, Produkt-/Bildverwaltung, öffentliche Stammdaten,
   sichere Textblockbearbeitung/Beispielstatus und Kontakt-Versandgrundlage.
   Runtime-Preview/DEV-Infrastruktur gemäß ADR mit vollständiger Isolation erweitern.
3. **Umsetzung B – öffentlicher Katalog/Kontakt:** separates Issue/Branch/PR mit
   Freigabe und geliefertem A-Stand. Start-/Material-/Produktseiten, Kontaktformular,
   Informationsseiten/Footer, beide Themes. Alte Demo und ausschließlich zugehörige
   Tests/Assets in demselben PR ablösen; alle neuen Journeys prüfen. Kein `/projekt`.

Jedes Umsetzungs-Issue nennt konkrete IDs/Teilabnahme und tatsächliche Ergebnisse.
A ist keine abgeschlossene Kataloglieferung, B benötigt die funktionsfähige Grundlage.
Keine Kundenkonten, Warenkorb-, Bestell-, Verkaufs- oder Paymentfunktionen.

## Module, Daten und Schnittstellen

- `src/app`: Routen `/`, `/produkte/[slug]`, `/kontakt`, `/impressum`, `/datenschutz`,
  weitere relevante Informationsseiten, `/admin` und dünne API-Handler; keine Geschäftslogik.
- `src/features/catalog`: öffentliche veröffentlichte Produkte, Kategorie/Detail,
  Preise/Material/Hersteller/Sicherheit; öffentliche API nur veröffentlichte Felder.
- `src/features/admin`: autorisierte Produkt-/Medien-/Text-/Kontaktpflege.
  Authentifizierung/Sitzung sind serverseitig; kein Browserflag als Rechteprüfung.
- `src/features/contact`: Formularregeln, fester Mailtransport, Rate-Limit,
  wahrheitsgemäße Zustände. `src/features/site-content`: Werkstatt-/Footer-/Rechtstexte,
  Beispielmarker und Startprüfstatus. Bestehendes Theme nur im neuen Auftritt weiterverwenden.
- D1: Produkte mit stabiler ID/Slug/Material/Preis in Cent/Publikationsstatus,
  Medienreferenzen/Alttext, Hersteller-/Sicherheitsangaben, Siteangaben und Textblöcke
  mit Beispiel-/Prüfstatus; Sitzungstokenhash/Ablauf/Revocation. Keine Kontakt-Nachrichten
  speichern. Produkt-/Textänderungen müssen nach Reload ohne Build sichtbar sein.
- R2: private Originale/validierte Bildvarianten, öffentliche Auslieferung nur für
  freigegebene Produktreferenzen. Kein Kunden-Upload und kein Zugriff auf Entwurfsbilder.
- Eingaben: explizite Felder, serverseitige Limits/Enums/Preisprüfung, parametrisierte
  SQL-Abfragen; Textblöcke sicher als Text mit Absätzen rendern, kein freies HTML.
  Browsernachrichten nie in Logs; Tests verwenden synthetische Daten.

## Verifikation und akzeptierte Grenzen

Anforderung/Testzuordnung in Tasks, konkrete Fälle und Ergebnisse anschließend in
jedem Implementierungs-PR. Komponenten-/Servicetests für Regeln/Zustände, lokale
Worker-/DB-/Medienintegration für echte Persistenz und Autorisierung; Playwright
für Navigation, Datenänderung im zweiten Browser, Kontaktfehler, Themes und Mobilansicht.
Node/jsdom allein belegen keine Worker-/Bindingkompatibilität.

`pnpm format`, `pnpm check:pr` sowie zusätzlicher Adapterbuild und lokaler
Wrangler-/Runtime-Browserlauf für Implementierungen. `pnpm check` bleibt gemeinsames
Basisgate; Buildschritt wird beim Runtimewechsel passend ersetzt, nicht gestrichen.
CI `quality`, `browser`, `secret-scan`, sichtbarer advisory Audit und menschlicher
Merge bleiben. Lokale Auth-/Mailstubs gehören ausschließlich in den Testaufbau;
keine öffentliche DEV-Admin-Hintertür oder als echter Sandboxversand ausgegebener Mock.

Kritische Katalog-/Kontakt-/Adminzustände in beiden Themes mit axe prüfen; manuelle
Tastatur-/Visual-/Kontrastprüfung ergänzen. Incompletes unverifiziert lassen.
Automatisierung bestätigt keine hörbaren Ansagen oder vollständige Rechtssicherheit.
Beispieltexte erst nach tatsächlicher Inhalts-/Anwendbarkeitsprüfung ersetzen;
Markerentfernung allein ist kein Rechtsnachweis. Separate manuelle PROD-Freigabe.

## Voraussetzungen, Migration und Rückfall

Kosten/Account-/Access-/Absender-/Testzielvoraussetzungen stehen konkret in ADR-003.
Vor Konto-/DNS-/Billingänderungen passenden Owner-Auftrag einholen; keine bezahlten
Dienste anlegen. Lokale Arbeit und Paketrecherche sind davon unabhängig möglich.
Ohne Remote-Bindings/Auth/Mailkonfiguration bleiben betroffene Integration/Preview-
Abnahmen offen; niemals eine funktionsfähige Admin-/Versandlieferung behaupten.

Fällt der Adapter-/Decoder-/Isolationstest durch, technische Wahl im Plan/ADR
innerhalb genehmigten Umfangs korrigieren; bei geänderten Ergebnissen zuerst Spec
revidieren. Migrationen/Backups und Rückfall auf vorherige App getrennt von
Datenwiederherstellung testen. Keine echte Kontakt-/Produkt-/Adminidentität in Git.
