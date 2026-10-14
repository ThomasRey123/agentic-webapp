# ADR-003: Laufzeit und Datenhaltung für Gravurwerk

**Status:** Technische Empfehlung zur Prüfung; noch nicht eingerichtet oder praktisch validiert.
**Grundlage:** [Spec](../../specs/engraving-shop/spec.md), Owner-Merge
[#117](https://github.com/ThomasRey123/agentic-webapp/pull/117),
`0a2235ba264ecd8f0dd228458547fd275ca3ad68`; Planungs-Issue #118.

## Anlass und Empfehlung

ADR-002 beschreibt den bisherigen reinen Static-Assets-Betrieb. FR-003/004/011/018
benötigen geschützte Schreibzugriffe, dauerhafte Inhalte und Formularversand.
Empfehlung: Next.js-App-Router als modularer Monolith auf Cloudflare Workers,
mit OpenNext-Adapter, D1 für strukturierte Daten und privatem R2 für Bilder.
`output: "export"` entfällt erst bei der geprüften Runtime-Umsetzung.
ADR-002 bleibt historische Grundlage und wird dadurch nicht rückwirkend umgeschrieben.

| Bereich             | Vorgeschlagene Entscheidung und Grenze                                                                                                                                                                                                                                                                                                                                                                                                  |
| ------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Next.js             | Bestehendes Next.js 16.4.0 beibehalten. OpenNext 1.20.11 (MIT) ist Recherchekandidat; npm-Peers `next >=15.5.27 <16                                                                                                                                                                                                                                                                                                                     |     | >=16.3.8`, Wrangler `^4.148.0`passen zu den installierten Versionen. Das ist Metadatenkompatibilität, kein bestandenes Build-/Runtime-Ergebnis.`rclone.js`-Peer und weitere transitive Pakete vor Installation prüfen. |
| Rendering           | Request-basierte öffentliche Katalog-, Produkt- und Informationsseiten lesen nur veröffentlichte Daten. Neue Produkte/Rechtstexte ohne Build sichtbar; zunächst keine ISR-/CDN-Inhaltscaches, die nach Depublizieren private/veraltete Daten ausliefern. Thin Route Handlers rufen Feature-Services auf.                                                                                                                                |
| Strukturierte Daten | D1 mit EU-Jurisdiktion: Produkte/Medienreferenzen, Site-/Kontaktangaben, Textblöcke/Beispielstatus und widerrufbare Admin-Sitzungen. Parametrisierte SQL-Abfragen, versionierte additive Migrationen; kein ORM ohne konkreten Bedarf.                                                                                                                                                                                                   |
| Bilder              | R2 mit EU-Jurisdiktion, kein öffentliches Bucketlisting/`r2.dev`. Medienauslieferung prüft aktuelle Veröffentlichung oder Adminrecht. Uploads bis exakt 10 MiB und JPEG/PNG/WebP vollständig validieren; bloßer MIME-/Dateinamencheck reicht nicht. Decoder/Variantenbildung ist ein eigener Kompatibilitätsschritt vor Paketwahl; kein stilles Absenken des freigegebenen Limits.                                                      |
| Admin               | Cloudflare Access mit expliziter Betreiber-Allowlist für `/admin` und sämtliche Admin-API-Pfade; keine öffentliche Registrierung. Serverseitig Signatur, Issuer, Audience und Ablauf prüfen. Nicht auf bloße Headerpräsenz oder `ctx.access` vertrauen: Static-Assets-Routing kann dessen Weitergabe verhindern. Kurze, serverseitig widerrufbare Anwendungssitzung zusätzlich; Logout löscht sie. Origin-/CSRF-Prüfung für Änderungen. |
| Kontakt             | Fester Betreiberempfänger über Cloudflare-Mailbinding an verifizierte Zieladresse, Absenderdomain verifiziert, Besuchermail nur validiertes Reply-To. Keine Bestell-/Verkaufsfunktionen, keine Anfrage-Datenbank. Vor Auswahl tatsächliche Verfügbarkeit, Domain und abgeschotteten Testempfänger prüfen. Kein echter Versand in lokalen Unit-/Browsertests.                                                                            |
| Datenschutz         | Dateninventar einschließlich Access, Hostinglogs, Session, Theme, D1/R2, Versand/Postfach. EU-Speicherwahl allein belegt keine vollständige EU-Verarbeitung oder DSGVO-Konformität; Auftragsverarbeitung/Transfers/Fristen tatsächlich prüfen und Mustertexte anpassen.                                                                                                                                                                 |

## Alternativen und Kompatibilität

- **Static Export mit eigener Worker-API:** möglich, benötigt aber zusätzliche
  Rendering-/Routinglösungen für neue Produkte, ohne Build veränderliche Rechtstexte
  und vollständige HTML-Seiten. Gegenüber der bestehenden Next.js-App mehr Sonderlogik.
- **Next.js auf Node mit PostgreSQL/S3 und Authdienst:** mögliche Rückfalloption,
  würde zusätzliche Hosting-/Betriebsentscheidungen benötigen. Bei Adapterfehlern
  konkret vergleichen, nicht automatisch mehrere Plattformen aufbauen.
- **Medusa:** für Katalog ohne Konten/Bestellungen/Zahlungen unnötiger Commerce-Umfang.
- **vinext:** Cloudflare empfiehlt es aktuell für neue Apps. Für dieses bestehende
  Next.js-/Turbopack-Projekt zunächst OpenNext prüfen, um keinen zusätzlichen
  Framework-/Buildsystemwechsel einzuführen. Das ist eine Abwägung, kein genereller
  Qualitätsvergleich. Scheitert der Kompatibilitätslauf, ADR vor Umsetzung anpassen.

Keine lokale Passwortdatenbank oder selbst entworfene Passwortkryptografie.
Sitzungsregeln: HttpOnly/Secure/SameSite-Cookie, zufällige Token nur gehasht speichern,
Ablauf/Revocation bei jedem Adminzugriff; keine Tokens/Kontaktinhalte in Logs.
Admin-Allowlist und Access-App sind echte Setup-Voraussetzungen, keine angenommenen
bereits vorhandenen Konfigurationen. Ausfall/fehlende Konfiguration verweigert Zugriff.

## Deployment, Isolation und Wiederherstellung

Der jetzige Vorschauworkflow lädt nur `out/`; ein Runtime-Worker wird damit nicht
ausgeliefert. Die Erweiterung ist explizite Arbeit, kein bereits funktionierendes Setup.
CI baut/testet App/Adapter ohne Cloudflare-Deploymentcredentials. Privilegierte
Workflows verwenden weiterhin geprüfte Main-Skripte, keine PR-Konfiguration,
Installationshooks oder PR-Buildskripte. Nur identifizierte, erfolgreich geprüfte
Runtime-/Asset-Artefakte hochladen; keine erneute PR-Codeausführung mit Deploymenttoken.

PR-Vorschauen brauchen eigene D1/R2-Ressourcen und Test-Mailziel, niemals stabile
DEV-Daten, PROD-Bindings oder freie Mailversandberechtigung. Auch Auth-Testidentitäten
und Servicecredentials sind auf diese Vorschau begrenzt. Deployment-/Cleanup-Skripte
prüfen Repository, offene PR, unveränderte SHA und Ressourcenzugehörigkeit; keine
beliebigen DB-/Bucket-IDs aus PR-Konfiguration übernehmen. Migrationen wirken nur
auf die zugeordnete Umgebung, stabile Migrationen erst aus owner-gemergtem Main.

Vor Runtime-Cutover isolierte Vorschau, Smoke und vollständige Browserfälle,
inklusive abgelehnter Adminzugriffe, testen. Falls diese Trust-/Isolationsgrenzen
nicht erhalten werden können, Lieferdesign/gegebenenfalls Spec zuerst klären;
keine Abkürzung über privilegierte PR-Ausführung. Code-Rollback setzt keine Daten
zurück: additive Schemata, geprüfte Sicherung/Restore und manuell kontrollierte
Datenmigration. Alte Demoseite erst im Katalog-Implementierungs-PR ersetzen.

## Kosten und noch nicht eingerichtete Voraussetzungen

Workers Paid beginnt laut aktueller Preisseite bei **5 USD/Monat pro Account**;
Verbrauch, Steuer/Währungsumrechnung, Speicher und gegebenenfalls weitere Dienste
kommen hinzu. Free ist erst nach gemessener Bundlegröße/CPU und Kontoprüfung
beurteilbar, keine zugesagte kostenlose Gesamtlösung. Mail an verifizierte
Account-Zieladressen ist laut Cloudflare kostenlos; beliebige Empfänger haben
andere Plan-/Nutzungsbedingungen. Unser Formular benötigt nur einen festen Empfänger.

Vor Remote-Einrichtung: bestehender Plan/Billing und zulässiger Kostenrahmen,
D1/R2-/Access-Rechte, Admin-Allowlist, Absenderdomain und Sandboxempfänger prüfen.
Dies ist keine Freigabe für kostenpflichtige Dienste, DNS-/Access-Änderungen oder
PROD. Lokale Emulator-/Kompatibilitätstests benötigen diese Buchungen nicht.

## Quellen (14. Oktober 2026)

[OpenNext-Unterstützung](https://opennext.js.org/cloudflare),
[Cloudflare/OpenNext und vinext-Empfehlung](https://developers.cloudflare.com/workers/framework-guides/web-apps/opennext/),
[Access-JWT-Prüfung](https://developers.cloudflare.com/cloudflare-one/access-controls/applications/http-apps/authorization-cookie/validating-json/),
[Access-/Static-Assets-Grenzen](https://developers.cloudflare.com/workers/configuration/cloudflare-access/),
[D1-Jurisdiktion](https://developers.cloudflare.com/d1/configuration/data-location/),
[R2-Jurisdiktion](https://developers.cloudflare.com/r2/reference/data-location/),
[Workers-Preise](https://developers.cloudflare.com/workers/platform/pricing/),
[Mail-Preise](https://developers.cloudflare.com/email-service/platform/pricing/),
[Mail-Bindings](https://developers.cloudflare.com/email-service/configuration/send-bindings/).
Zusätzlich installierte Next.js-Guides `static-exports`, `deploying-to-platforms`
und `route-handlers` gelesen; keine erinnerte Runtime-API als Kompatibilitätsbeleg.
