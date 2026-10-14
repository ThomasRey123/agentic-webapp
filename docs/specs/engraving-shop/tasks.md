# Aufgaben: Gravurwerk-Katalog und Kontakt

**Planungs-Issue:** [#118](https://github.com/ThomasRey123/agentic-webapp/issues/118).
**Spec:** `docs/specs/engraving-shop/spec.md`, Owner-Freigabe
[#117](https://github.com/ThomasRey123/agentic-webapp/pull/117), Merge
`0a2235ba264ecd8f0dd228458547fd275ca3ad68`.
Aus dem zuvor erstellten [Plan](plan.md) abgeleitet. Keine Implementation-/Test-
Ergebnisse vorweggenommen; separate Implementierungs-Issues/PRs sind noch anzulegen.

## Vorbereitung und Planung

- [x] Owner-Merge und immutable Spec gegen Main geprüft; aktive/zurückgezogene IDs gelesen.
- [x] Technischen Plan und ADR mit Runtime-/Storage-/Auth-/Mailalternativen recherchiert.
- [x] Daraus diese Tasks und Anforderungs-/Prüfzuordnung abgeleitet.
- [ ] Planungsdokumente formatieren, `pnpm check`, Links/IDs/Quellen prüfen; genau ein PR für #118.

## Umsetzung A – Grundlage (separates Issue/Branch/PR)

- [ ] Issue mit Freigabe-SHA, FR-003/004 und relevanten Querschnittsanforderungen eröffnen.
- [ ] Adapter-/Paket-/Lizenz-/Auditprüfung, Build und echter lokaler Worker-/Bindinglauf;
      aktuelle Next.js-Guides beachten, Versionen pinnen und Bundle messen.
- [ ] Decoder auswählen/nachweisen: beschädigte JPEG/PNG/WebP, falscher MIME-Typ,
      exakt 10 MiB erlaubt und darüber abgelehnt; sichere Variantenbildung ohne Zusatzdienstannahme.
- [ ] D1-Schema/Migrationen und privates R2 anbinden; synthetische Beispieldaten/Textblöcke.
- [ ] Access-Identitätsprüfung plus widerrufbare Anwendungssitzung, Logout, Origin-/CSRF-
      und direkte API-Angriffe testen; keine öffentliche Registrierung oder Testhintertür.
- [ ] Adminformulare für Produkte, Bilder/Alttext, Kontakte/Werkstatt und Informationsblöcke;
      Persistenz, Depublizieren, sichere Textausgabe und Beispiel-/Prüfstatus integrieren.
- [ ] Kontakt-Backend: fester Empfänger, sichere Reply-To-Prüfung, 5.000-Zeichen-Limit,
      Missbrauchsschutz und fehlende Konfiguration; nur isolierter Mailtest, keine Inbox/Bestellung.
- [ ] Owner-Setupauftrag/Kostenrahmen und echte Ressourcenrechte/Allowlist/Domain/Testziel
      klären; ohne diese keine Remoteeinrichtung oder als bestanden deklarierte Sandboxabnahme.
- [ ] Vertrauenswürdiges Runtime-Artefaktdeployment sowie isolierte Vorschau-/Migrations-/
      Cleanupregeln nach ADR implementieren und Fehl-/veraltete Identitäten testen.
- [ ] Vollständige lokale Gates, unabhängige CI und authentifizierte Vorschauintegration;
      Owner-Merge und erfolgreiche tatsächliche A-Main-/DEV-Lieferung im Issue/PR festhalten.

## Umsetzung B – Katalog, Kontakt und Informationen (separates Issue/Branch/PR)

- [ ] Issue mit Freigabe-SHA, geliefertem A-Stand und FR-001/002/011–018 eröffnen.
- [ ] Katalog/Kategorien/Produktdetails und zwei Themes im neuen Design implementieren.
- [ ] Allgemeines Kontaktformular/Datenschutzhinweis und korrekte Zustände; keine Verkaufsaktionen.
- [ ] Informationsseiten/Footer und alle neun Beispielblöcke sicher darstellen;
      Betreiber-/Produktfelder, Musterstatus und Startcheck integrieren.
- [ ] Alte Demo, nicht mehr benötigte Assets/Komponenten und allein zugehörige Tests
      mit passenden Katalogregressionen ablösen; `/projekt` liefert 404.
- [ ] Alle folgenden Prüfungen durchführen, Belege/Unvollständiges getrennt dokumentieren.
- [ ] `pnpm format`, `pnpm check:pr`, Adapter-/Runtimechecks, unabhängige CI und exakte Vorschau;
      nach Owner-Merge tatsächliche Main-/DEV-Abnahme im bestehenden B-Issue/PR ergänzen.

## Anforderungsnachweise – geplante Orte, noch keine Testergebnisse

Die Pfade sind Zielorte für die Umsetzung; noch nicht vorhandene Dateien sind
keine ausgeführten Tests. Jeder Implementierungs-PR nennt tatsächliche Testnamen,
Kommandos, Ergebnisse und eindeutige Commit-/Lauflinks.

| ID     | Geplante locatable Prüfungen                                                                                                                                                                                                             | Stand   |
| ------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| FR-001 | `tests/e2e/catalog.spec.ts`: Desktop/390px, Navigation/Theme/Reload, alte Demoaktionen entfernt, `/projekt` 404; manuelle Screenshots/Kontrast                                                                                           | Geplant |
| FR-002 | `src/features/catalog/tests/catalog.test.ts`, `tests/e2e/catalog.spec.ts`: veröffentlichte/Entwurfs-Direktaufrufe, leere Daten/kaputtes Bild                                                                                             | Geplant |
| FR-003 | `tests/integration/admin-auth.test.ts`, `tests/e2e/admin.spec.ts`: kein Token/falsche Signatur/Audience/Allowlist, Logout/abgelaufene Sitzung, CSRF, Besucher-/API-Angriffe                                                              | Geplant |
| FR-004 | `tests/integration/catalog-storage.test.ts`, `tests/e2e/admin.spec.ts`: echte D1/R2-Persistenz, zweiter Browser, Preise/Felder/Bilder/Depublizieren, fehlerhafter Upload                                                                 | Geplant |
| FR-011 | `src/features/contact/tests/contact.test.ts`, `tests/integration/contact.test.ts`, `tests/e2e/contact.spec.ts`: Limits/Injection/Rate-Limit, Annahme/Fehler, keine Parallelversuche/Bestellung; echte isolierte Provider-Sandbox separat | Geplant |
| FR-012 | `tests/e2e/site-information.spec.ts`: Footer/Fehlerseite/Impressum ohne Login; tatsächliche Betreiberangaben manuell                                                                                                                     | Geplant |
| FR-013 | `tests/e2e/site-information.spec.ts`: Datenschutz/Formularlink und Adminänderung; tatsächliches Daten-/Dienst-/Fristeninventar manuell                                                                                                   | Geplant |
| FR-014 | `tests/e2e/privacy.spec.ts`: Netzwerk-/Speicherinventar, keine externen Schriften/Tracker; Erforderlichkeit/Transfers/Verträge manuell                                                                                                   | Geplant |
| FR-015 | `src/features/catalog/tests/catalog.test.ts`, Admin-/Katalogbrowserfälle: Cent-/Preis-/Leistungs-/Steuerhinweis und Beispielmarker; Steuerstatus manuell                                                                                 | Geplant |
| FR-016 | Storage-/Admin-/Katalogfälle für Hersteller-/Referenz-/Warnfelder und Publikationsprüfung; Produkt-/Rollenentscheidung manuell                                                                                                           | Geplant |
| FR-017 | `tests/e2e/accessibility.spec.ts`: relevante Theme/Zustandsaudits und Tastatur; BFSG/VSBG-Einordnung/Inhalte manuell, Incompletes ausdrücklich offen                                                                                     | Geplant |
| FR-018 | `tests/integration/site-content.test.ts`, `tests/e2e/site-information.spec.ts`: sichere Bearbeitung/Persistenz, Unbefugte, Beispiel-/Platzhalterstatus; Inhalts-/PROD-Freigabe manuell                                                   | Geplant |

FR-005–010 bleiben zurückgezogen. Der Planungsvorgang liefert kein Feature und
kein Sandbox-/Remote-/Rechtskonformitätsergebnis. Echtbetrieb bleibt separat.
