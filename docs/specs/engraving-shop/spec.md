# Spezifikation: Gravurwerk – Produktkatalog mit Kontaktmöglichkeit

**Spec-Issue:** [#116](https://github.com/ThomasRey123/agentic-webapp/issues/116).
**Epic:** [#115](https://github.com/ThomasRey123/agentic-webapp/issues/115).
**Reviewzweck:** Revidierter fachlicher Vorschlag zur Owner-Freigabe, keine Umsetzung.
**Stand:** 14. Oktober 2026 (Europe/Berlin). Der bisherige Spec-PR #117 ist noch nicht gemergt.

Es gilt der [SDD-Vertrag](../../development/spec-driven-development.md). Erst nach
Owner-Merge folgen separate Implementierungs-Issues/PRs mit Spec-Pfad, Freigabe-PR
und tatsächlichem vollständigen Merge-SHA. Keine Anbieter oder Infrastruktur
werden durch den Entwurf eingerichtet.

## Ziel, Umfang und bestehendes Verhalten

Interessenten in Deutschland entdecken Gravurprodukte aus Holz, Leder und Glas
und kontaktieren den Betreiber. Arbeitsname **Gravurwerk**, deutsche Oberfläche,
Preise in EUR, warmer Auftritt in Creme/Holzbraun/Petrol. Der Betreiber verwaltet
das Sortiment über einen geschützten Adminzugang.

Owner-Änderung vom 14. Oktober: **Nur Produktkatalog mit Kontaktmöglichkeit**.
Keine Kundenkonten, Kundenregistrierung/-login/-Passwortreset, Warenkorb,
Bestellung, Checkout, Zahlung, Zahlungswebhooks oder Kunden-Bestellübersicht.
Ebenso ausgeschlossen: Epoxidharz/Möbel, grafischer Gravurkonfigurator,
Kunden-Uploads, eingebautes Anfrageformular und freie Layoutbearbeitung im Admin.
Ein Gravurwunsch wird gegebenenfalls außerhalb der Webseite per E-Mail besprochen;
die frühere Texteingabe beim Kauf entfällt mit dem Kaufablauf.

Künftig führt `/` zum Katalog. Die bestehende Projekt-Demo bleibt unter `/projekt`
mit Links, FAQ, Cloud-Test, Copy-DEV-Link und persistentem Theme erreichbar;
ihre historische Spec und Browserprüfungen werden mitverschoben. Der Admin
verwaltet tatsächliche dauerhafte Daten; lokale Browser-Demodaten gelten nicht
als funktionierende Produktverwaltung. PROD und kostenpflichtige Providerbuchungen
bleiben separat freizugebende Schritte.

## Anforderungen und Szenarien

### FR-001 — Warmer Katalogauftritt und Navigation

Creme, Holzbraun und Petrol, große Produkt-/Materialfotos, ruhige Flächen und gut
lesbare Schriften vermitteln Handarbeit. Startseite mit Holz/Leder/Glas-Bereichen,
ausgewählten veröffentlichten Produkten und kurzem Werkstatttext. Navigation:
Katalog und Kontakt; Admin mit eigenem Einstieg. Das vorhandene Theme bleibt
umschaltbar und persistent, der dunkle Auftritt erhält denselben Markencharakter.
Keine erfundenen Rezensionen, Siegel oder Lieferzusagen.

- Gegeben Desktop oder 390px-Mobilansicht, wenn Nutzer navigieren, dann erreichen
  sie Katalog und Kontakt ohne Clipping oder Hover-Zwang; kein Konto-/Warenkorb-/Bezahlzugang.
- Gegeben Theme-Wechsel/Reload, dann bleiben Theme und lesbare Kontraste erhalten;
  die Projekt-Demo bleibt auf ihrer eigenen Route nutzbar.

### FR-002 — Veröffentlichte Produkte und verständliche Details

Nur veröffentlichte Produkte erscheinen öffentlich. Details zeigen Name,
Beschreibung, Material, Bilder, Preis und konfigurierte Verfügbarkeit/Lieferhinweise.
Der vorgeschlagene Produktpreis umfasst Textgravur; es gibt keine Preisberechnung
oder Kaufaktion. Detailseiten führen stattdessen zur Kontaktmöglichkeit FR-011.

- Gegeben Entwurf und veröffentlichtes Produkt, wenn Katalog oder Detailadresse
  direkt aufgerufen wird, dann werden keine unveröffentlichten Produktdaten ausgeliefert.
- Gegeben fehlendes/fehlerhaftes Bild oder leerer Katalog, dann erscheint ein
  verständlicher Ersatz/Leerzustand statt kaputter Bilder oder erfundener Angebote.

### FR-003 — Geschützter Adminzugang

Nur vom Betreiber eingerichtete Admins verwalten Produkte und öffentliche
Kontakt-/Werkstattangaben. Es gibt keine öffentliche Registrierung. Rechte werden
für jeden Verwaltungs-Lese-/Schreibzugriff im Backend geprüft.

- Gegeben nicht angemeldeter Besucher, wenn Adminseiten/APIs direkt aufgerufen
  werden, dann werden Verwaltungsdaten und Schreibaktionen verweigert.
- Gegeben Admin, wenn er sich abmeldet oder seine Sitzung ungültig wird, dann
  scheitert auch ein zuvor vorbereiteter Verwaltungsrequest.

### FR-004 — Dauerhafte Produkt-, Preis- und Bildverwaltung

Admins erstellen/bearbeiten Titel, Beschreibung, Materialkategorie, positive
EUR-Preise, Veröffentlichung, Verfügbarkeit/Lieferhinweise und Produktbilder.
Produkte lassen sich depublizieren/archivieren. Es gibt keine Bestell-/Zahlungsverwaltung.

- Gegeben Admin, wenn er Produkt/Preis speichert und veröffentlicht, dann sieht
  ein anderer Browser nach Aktualisierung den gespeicherten Stand. Ungültige
  Felder erzeugen verständliche Fehler und keine Teiländerung.
- Gegeben Bild-Upload, wenn eine gültige JPEG-/PNG-/WebP-Datei bis 10 MiB eingeht,
  dann ist sie dauerhaft als Produktbild nutzbar. Fremde Formate, beschädigte oder
  größere Bilder werden serverseitig abgewiesen. Uploadfehler entfernen keine
  vorhandenen Bilder; alternative Bildtexte sind bearbeitbar.
- Gegeben Admin, wenn er Kontakt-E-Mail/Werkstatttext speichert, dann erscheinen
  gültige Angaben nach Aktualisierung öffentlich; ungültige E-Mail wird abgewiesen.

### FR-005 — Zurückgezogen: Kundenkonten und Gastbestellungen

Am 14. Oktober auf Owner-Wunsch entfernt: Kundenkonto, Registrierung, Login,
Passwortreset, Konto-/Gastbestellung und kontoabhängige Bestellübersicht.
Admin-Authentifizierung gemäß FR-003 bleibt erforderlich. ID nicht wiederverwenden.

### FR-006 — Zurückgezogen: Gravurtext im Kaufablauf

Mit der Entscheidung für einen reinen Katalog entfällt die Eingabe/Speicherung
von Gravurtext in Warenkorb oder Bestellung. Individuelle Wünsche werden über
FR-011 außerhalb der Webseite besprochen. ID nicht wiederverwenden.

### FR-007 — Zurückgezogen: Warenkorb

Kein Warenkorb, keine Mengen-/Positionsbearbeitung oder Warenkorb-Persistenz.
ID nicht wiederverwenden.

### FR-008 — Zurückgezogen: Checkout

Kein Checkout, keine Adress-/Versanderfassung, Versandpauschalenberechnung oder
verbindlicher Bestellabschluss auf der Webseite. ID nicht wiederverwenden.

### FR-009 — Zurückgezogen: Online-Bezahlung

Keine PayPal-/Kartenzahlung, Payment-Integration, Zahlungswebhooks oder
Online-Rückerstattungen. ID nicht wiederverwenden.

### FR-010 — Zurückgezogen: Bestellverwaltung

Keine Kunden-/Admin-Bestellübersicht, Bestellbestätigung, Bestell-E-Mails oder
Zahlungs-/Versandstatusverwaltung. ID nicht wiederverwenden.

### FR-011 — Kontakt und produktbezogene E-Mail-Anfrage

Eine Kontaktseite zeigt die vom Betreiber konfigurierte Kontakt-E-Mail als
sichtbaren Text und nutzbaren E-Mail-Link. Produktdetails bieten „Produkt anfragen“
als klar bezeichneten E-Mail-Link mit Produktname und stabiler Produktreferenz
im vorausgefüllten Betreff. Weitere Wünsche, etwa Gravurtext, kann der Interessent
in seinem E-Mail-Programm formulieren. Die Webseite speichert/versendet keine Anfrage.

- Gegeben Produktdetail, wenn „Produkt anfragen“ aktiviert wird, dann wird ein
  korrekt kodierter `mailto:`-Link für den konfigurierten Empfänger angeboten;
  auch Umlaute/Sonderzeichen erzeugen keinen falschen Empfänger oder Zusatzheader.
- Gegeben kein eingerichtetes E-Mail-Programm, dann bleibt die Kontaktadresse
  sichtbar manuell kopierbar; die Webseite behauptet niemals „Anfrage gesendet“.
- Gegeben noch nicht konfigurierte Kontaktadresse in DEV, dann wird ein klarer
  Hinweis statt eines erfundenen Empfängers oder scheinbar funktionsfähigen Links gezeigt.
  Vor vollständiger Abnahme muss der Owner eine gültige Kontaktadresse bereitstellen.

## Grenzen und Umsetzungsetappen

- Bedienbarkeit: Native Controls, Tastatur/Fokus, verständliche Feldfehler und
  Statussemantik, Bildalternativen und Kontrast in beiden Themes; Desktop/390px.
- Sicherheit: Serverseitige Admin-Autorisierung, geschützte Sessions, Eingabe-/Dateiprüfung,
  Auth-Abuse-Schutz, keine Secrets im Browser/Logs; öffentliche Kontakte dürfen
  keine Script-/Header-Injection ermöglichen. DEV nutzt isolierte Testdaten.
- Architektur: Öffentlicher Katalog kann statisch oder dynamisch ausgeliefert
  werden; dauerhafte geschützte Adminverwaltung benötigt Backend/Datenspeicher.
  Eine ADR begründet vor Umsetzung Laufzeit, Admin-Auth, Produkt-/Bildspeicher,
  Veröffentlichung und Hostingkosten. Keine Commerce-, Kunden-Auth-, Payment-
  oder E-Mail-Versandinfrastruktur erforderlich. Die frühere Medusa-Empfehlung
  ist für diesen kleineren Umfang neu zu bewerten, keine getroffene Anbieterwahl.
- Kompatibilität: Projekt-Demo und Pflichtgates/menschliche Merges bleiben erhalten.
  Langsame/fehlerhafte Dienste erzeugen keine falschen Speicher-Erfolgsmeldungen.
  Bilder passend ausliefern; kein unbegründetes Latenzziel. Kein direkter PROD-Deploy.

Nach Freigabe zwei getrennte Implementierungsaufträge: (1) Admin-/Produktgrundlage
FR-003/004 einschließlich ADR; (2) Katalog/Kontakt FR-001/002/011 mit integrierter
Abnahme. Plan/Tasks folgen der tatsächlich freigegebenen Revision. Teilstände
sind als unvollständig erkennbar; vollständige Lieferung verlangt alle aktiven
Anforderungen, Main-CI/DEV und Owner-Prüfung. Keine Account-/Payment-Platzhalter.

## Annahmen und offene Fragen

Bestätigt: nur Katalog/Kontakt, Admin bleibt, bisherige Gestaltung/Materialien/
Deutschland/Arbeitsname bleiben. `mailto:` statt Anfrageformular, Gravur im
angezeigten Preis und die Demo-Route sind explizite Vorschläge zur Prüfung.
Offene fachliche Scope-/Abnahmefragen: keine für diesen Vorschlag. Tatsächliche
Kontakt-/Händlerdaten, Preise, Bilder, Rechtstexte und Hostingkosten sind noch
bereitzustellen/zu prüfen; Testwerte werden kenntlich gemacht. Sie werden nicht
als bereits geklärte Betriebsfreigabe behauptet.

## Abnahme und geplante Prüfungen

Prüfungen sind **geplant, nicht ausgeführt**: `pnpm format`, für Nutzerabläufe
`pnpm check:pr`, unabhängige CI/commitgenaue Vorschau, Owner-Review/-Merge und
Main-CI/DEV. Die Spec allein liefert keine funktionierende Webseite.

| ID     | Geplante beobachtbare Prüfung                                                                                                                                                                                 |
| ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| FR-001 | Desktop-/Mobilnavigation, keine Kundenkonto-/Warenkorb-/Bezahlaktionen, Theme/Reload und verschobene Projektregressionen; manuelle Visual-/Kontrastprüfung                                                    |
| FR-002 | Entwurf/veröffentlicht, direkte Detailadresse, fehlendes Bild/Leerzustand; keine Kaufaktion                                                                                                                   |
| FR-003 | Besucher vs. Admin, direkte API-Manipulation, Logout/ungültige Session: verweigerte Verwaltungszugriffe                                                                                                       |
| FR-004 | Admin speichern → anderer Browser/Reload; ungültige Felder/Preise/Kontaktadresse; reale Bildpersistenz und abgewiesene fehlerhafte/fremde/zu große Dateien                                                    |
| FR-011 | Kontaktseite und Produktlink mit kodiertem Produktnamen/Referenz/Empfänger, Umlaute/Header-Manipulation, sichtbare kopierbare Adresse und fehlende Konfiguration; manuell korrektes Öffnen im E-Mail-Programm |

FR-005–010 sind zurückgezogen und haben keine Implementierungs-Abnahme mehr.
Automatisierte Accessibility-Prüfungen kritischer Zustände (WCAG 2/2.1 A/AA)
und manuelle Bedien-/Kontrastprüfung ergänzen die Browserfälle. Incomplete-Befunde
bleiben sichtbar unbewertet; keine vollständige WCAG-/hörbare Screenreader-Zusage.
Vor Echtbetrieb prüft der Owner tatsächliche Kontakt-/Händler-/Rechtstextdaten
und Hostingkosten separat; keine kommerzielle Startfreigabe durch diesen PR.

## Änderungsnotizen und Quellen

Owner hat am 14. Oktober den noch offenen Entwurf #117 auf Katalog/Kontakt
reduziert. FR-001–004 angepasst, FR-005–010 zurückgezogen, FR-011 neu hinzugefügt.
Historische IDs bleiben dokumentiert; die ursprüngliche Shopfassung steht in Git.
Designreferenz [Ingrained Inc.](https://ingrainedinc.com/): Materialkategorien,
Produktfotos/Werkstattbezug. Palette ist unser eigener Vorschlag. Frühere
Commerce-/Payment-Recherche ist historisch und autorisiert keine Integration
für den jetzt reduzierten Umfang.
