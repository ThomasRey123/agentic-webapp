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
und kontaktieren den Betreiber ausschließlich für allgemeine Auskünfte. Arbeitsname **Gravurwerk**, deutsche Oberfläche,
Preise in EUR, warmer Auftritt in Creme/Holzbraun/Petrol. Der Betreiber verwaltet
das Sortiment über einen geschützten Adminzugang.

Owner-Änderung vom 14. Oktober: **Nur Produktkatalog mit Kontaktmöglichkeit**.
Keine Kundenkonten, Kundenregistrierung/-login/-Passwortreset, Warenkorb,
Bestellung, Checkout, Zahlung, Zahlungswebhooks oder Kunden-Bestellübersicht.
Ebenso ausgeschlossen: Epoxidharz/Möbel, grafischer Gravurkonfigurator,
Kunden-Uploads und freie Layoutbearbeitung im Admin. Das Kontaktformular dient
nur allgemeiner Kontaktaufnahme; es bietet weder Bestellung noch Angebotsannahme,
Auftragsanlage oder einen Verkauf per E-Mail. Antworten sind allgemeine Auskünfte,
kein im Projekt vorgesehener Verkaufsprozess. Die frühere Texteingabe beim Kauf entfällt.

Künftig ersetzt der Katalog unter `/` die bisherige Seite vollständig.
Auf Owner-Wunsch vom 14. Oktober entfallen Projekt-/Delivery-Inhalte, Projekt-FAQ,
Cloud-Test, Repository-/DEV-Links und Copy-DEV-Link aus der Anwendung. Es gibt
keine Archiv-/Demoroute `/projekt`. Historische Specs/Liefernachweise bleiben
als Entwicklungsdokumentation und Git-Historie erhalten, nicht als Webseiteninhalt.
Der Admin verwaltet tatsächliche dauerhafte Daten; lokale Browser-Demodaten gelten
nicht als funktionierende Produktverwaltung. PROD und kostenpflichtige Providerbuchungen
bleiben separat freizugebende Schritte.

## Anforderungen und Szenarien

### FR-001 — Warmer Katalogauftritt und Navigation

Creme, Holzbraun und Petrol, große Produkt-/Materialfotos, ruhige Flächen und gut
lesbare Schriften vermitteln Handarbeit. Startseite mit Holz/Leder/Glas-Bereichen,
ausgewählten veröffentlichten Produkten und kurzem Werkstatttext. Navigation:
Katalog und Kontakt; Admin mit eigenem Einstieg. Der Katalog bietet ein
umschaltbares, persistentes Theme; der dunkle Auftritt erhält denselben Markencharakter.
Keine erfundenen Rezensionen, Siegel oder Lieferzusagen.

- Gegeben Desktop oder 390px-Mobilansicht, wenn Nutzer navigieren, dann erreichen
  sie Katalog und Kontakt ohne Clipping oder Hover-Zwang; kein Konto-/Warenkorb-/Bezahlzugang.
- Gegeben Theme-Wechsel/Reload, dann bleiben Theme und lesbare Kontraste erhalten.
- Gegeben die neue Startseite, dann erscheinen ausschließlich Katalog-/Kontakt-
  und Betreiberinhalte. Die bisherigen Projekt-Demoaktionen sind nicht vorhanden;
  ein direkter Aufruf von `/projekt` liefert eine Nicht-gefunden-Seite.

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
Kontakt-/Werkstattangaben und Informations-/Rechtstexte. Es gibt keine öffentliche Registrierung. Rechte werden
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
- Gegeben Admin, wenn er einen Informations-/Rechtstext aus FR-012–018 ersetzt,
  dann bleibt die Änderung nach Reload erhalten; Besucher können diese Texte
  nicht bearbeiten. Markierungen und erforderliche manuelle Prüfung bleiben nachvollziehbar.

### FR-005 — Zurückgezogen: Kundenkonten und Gastbestellungen

Am 14. Oktober auf Owner-Wunsch entfernt: Kundenkonto, Registrierung, Login,
Passwortreset, Konto-/Gastbestellung und kontoabhängige Bestellübersicht.
Admin-Authentifizierung gemäß FR-003 bleibt erforderlich. ID nicht wiederverwenden.

### FR-006 — Zurückgezogen: Gravurtext im Kaufablauf

Mit der Entscheidung für einen reinen Katalog entfällt die Eingabe/Speicherung
von Gravurtext in Warenkorb oder Bestellung. Eine Nachricht über FR-011 ist
keine Gravurbestellung und erzeugt keinen Auftrag. ID nicht wiederverwenden.

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

### FR-011 — Kontaktformular ausschließlich zur Kontaktaufnahme

Eine Kontaktseite zeigt die konfigurierte Kontaktadresse und ein Formular mit
optionalem Namen, erforderlicher Antwort-E-Mail und erforderlicher Nachricht
(maximal 5.000 Zeichen, Limit sichtbar). Produktdetails verlinken „Frage zum Produkt“
auf dieses Formular mit optionaler Produktreferenz. Keine Mengen-/Adress-/Gravur-
Bestellfelder, kein Bestell-/Angebotsworkflow. Hinweis direkt am Formular:
„Dieses Formular dient ausschließlich der Kontaktaufnahme. Darüber können keine
Bestellungen oder Käufe abgeschlossen werden.“ Datenschutzinformation verlinken;
keine pauschale Pflicht-Einwilligung zur Datenschutzerklärung verlangen.

Das Backend validiert die Nachricht und übermittelt sie an den fest konfigurierten
Betreiberempfänger. Absender kommt aus der geprüften Systemkonfiguration, die
Besucheradresse ausschließlich als validiertes Reply-To. Keine Dateianhänge,
kein frei wählbarer Empfänger, Rate-Limit/Spam-Schutz und serverseitiger Schutz
gegen Header-/Script-Injection. Keine separate dauerhafte Anfragen-Datenbank oder
Admin-Inbox. Empfangenes E-Mail-Postfach und Aufbewahrung sind in FR-013 zu erfassen;
Nachrichtentexte/Antwortadressen gehören nicht in Anwendungs-/CI-Logs.

- Gegeben gültige Nachricht, wenn der Versanddienst die Übermittlung annimmt,
  dann bestätigt die Seite nur diese Annahme, keine Zustellung/Bestellung:
  „Deine Nachricht wurde zur Übermittlung angenommen.“ Mehrfachklicks während
  eines laufenden Vorgangs starten keine parallelen Sendungen.
- Gegeben ungültige Felder, Spamlimit oder Dienstfehler, dann erscheinen passende
  Fehler, keine Erfolgsbehauptung; Eingaben bleiben für Korrektur/erneuten Versuch erhalten.
- Gegeben fehlende Empfänger-/Versandkonfiguration in DEV, dann ist Senden
  deaktiviert und als nicht eingerichtet gekennzeichnet. Keine Nachrichten an
  Beispieladressen. Ein funktionierender Sandboxlauf ist Teil der Abnahme.

### FR-012 — Erreichbares, bearbeitbares Impressum

Eigene Seite `/impressum`, auf jeder öffentlichen Seite einschließlich Kontakt
und Fehlerseite über klaren Footerlink ohne Login erreichbar. Admin pflegt echte
Betreiber-/Kontaktangaben und, soweit anwendbar, Rechtsform, Vertretung, Register,
Umsatzsteuer-/Wirtschafts-ID. Der Arbeitsname ersetzt keinen tatsächlichen Betreiber.
Es werden keine behördlichen Nummern erfunden. Vorbelegte Entwicklungsbeispiele
sind gemäß FR-018 markiert und zu ersetzen.

### FR-013 — Bearbeitbare Datenschutzinformationen und Dateninventar

Eigene Seite `/datenschutz` mit gleichem Erreichbarkeitsniveau. Bearbeitbarer Text
beschreibt die tatsächlich eingesetzten Dienste und Verarbeitungen: Hosting/IP/
Logs, Admin-Sitzung, Theme-Speicherung sowie Kontaktformular, Versanddienst und
Betreiberpostfach. Verantwortlicher, Zwecke/Rechtsgrundlagen, Empfänger/
Auftragsverarbeitung, gegebenenfalls Drittlandtransfers, Fristen/Fristkriterien,
Betroffenenrechte und Beschwerdemöglichkeit sind konkret zu prüfen/zu ergänzen.
Die ADR dokumentiert hierzu eingesetzte Dienste, Daten und Aufbewahrung; ein
Mustertext allein ist kein Nachweis zutreffender Information oder rechtmäßiger Verarbeitung.

### FR-014 — Datensparsame Technik und begründete Browser-Speicherung

Kein Tracking, keine Werbepixel, extern geladenen Schriften, Karten-, Video- oder
Social-Media-Einbettungen im ersten Umfang. Schriften lokal bereitstellen.
Admin-Sitzung und Speicherung der ausdrücklich gewählten Theme-Einstellung werden
nach Zweck, Dauer und Erforderlichkeit dokumentiert. Kein pauschaler Cookiebanner
als Ersatz dieser Prüfung. Falls eine nicht erforderliche Speicherung/Integration
geplant wird, erst Spec-Revidierung und Einwilligungsablauf mit vorheriger
Blockierung, Ablehnung und Widerruf festlegen; nicht stillschweigend einbauen.

### FR-015 — Verständliche Katalogpreise und Leistungsumfang

FR-002/004 um Preis pro Stück, enthaltene Textgravur und konfigurierbaren,
fachlich geprüften Steuerhinweis ergänzen. Keine falsche Standardbehauptung
„inkl. MwSt.“ bei ungeklärter/abweichender Besteuerung, keine Kauf-/Zahlungsaktion.
Der Admin kann Erläuterungstexte ersetzen, aber dadurch keine Bestellfunktion
aktivieren. Preisbeispiele in DEV als Beispiele markieren. Preis-/Steuerdarstellung
bleibt auch ohne Checkout auf Anwendbarkeit der Preisangabenregeln zu prüfen.

### FR-016 — Produktidentifikation und gegebenenfalls Sicherheitshinweise

Adminfelder für Produktreferenz, Herstellername mit Post-/elektronischer Adresse,
gegebenenfalls verantwortliche EU-Person und produktbezogene Sicherheitshinweise.
Auf Produktdetails anzeigen, soweit nach dokumentierter Produkt-/Rollenprüfung
relevant. Keine erfundenen Hersteller, Warnungen oder Konformitätszeichen. Ein
leeres Warnfeld belegt nicht automatisch, dass keine Warnung erforderlich ist.
Pro Produkt muss der Betreiber die zutreffenden Angaben prüfen; der Verzicht
auf Online-Verkauf ersetzt diese Prüfung nicht.

### FR-017 — Bedingte Informationspflichten und Zugänglichkeit

Vor Echtbetrieb BFSG-Anwendbarkeit einschließlich Unternehmensgröße/Ausnahmen
sowie VSBG-Informationspflicht/Teilnahmestatus dokumentieren. Für gegebenenfalls
erforderliche Informationen bearbeitbare öffentliche Textbereiche vorsehen;
keine erfundene Schlichtungsbereitschaft, Verpflichtung oder Barrierefreiheits-
Konformität behaupten. Keine veralteten EU-OS-Plattformlinks übernehmen.
Unabhängig von der rechtlichen Einordnung bleiben die vorgesehenen automatisierten
und manuellen Bedienbarkeits-/Kontrastprüfungen bestehen.

### FR-018 — Markierte Beispieltexte, Adminbearbeitung und Veröffentlichung

Für alle Informationsbereiche des folgenden Abschnitts werden bearbeitbare
Beispieltexte vorgelegt. Jeder Block besitzt einen expliziten Beispiel-/Prüfstatus;
Besucher erkennen in DEV „Beispieltext – vor Veröffentlichung ersetzen“.
Der Admin kann Texte und zugehörige Stammdaten dauerhaft bearbeiten, ohne
Codeänderung/Deployment oder beliebiges HTML/Script eingeben zu müssen.

- Gegeben Beispieltext, wenn Admin ihn ersetzt, dann sieht ein anderer Browser
  nach Aktualisierung die gespeicherte Version; Unbefugte können sie nicht verändern.
- Gegeben noch markierte Beispiele oder fehlende Betreiber-/Datenschutz-/Kontakt-
  Angaben, dann darf der Stand nicht als für Echtbetrieb freigegeben gelten.
  Bekannte Beispielmarker/Platzhalter technisch prüfen; die tatsächliche
  Richtigkeit zusätzlich manuell durch den Owner bestätigen. Das bloße Entfernen
  eines Markers ist kein rechtlicher Korrektheitsnachweis.
- Gegeben vollständige Texte, dann bleiben zusätzlich die dokumentierten
  Anwendbarkeits-/Dienstprüfungen, Kontakt-Sandbox und separate PROD-Freigabe nötig.
  Tests und CI behaupten keine umfassende Rechtssicherheit.

## Vorbelegte Beispieltexte zur späteren Adminbearbeitung

**Alle folgenden Texte sind Entwicklungsbeispiele und unvollständig.** Jeder
Block erhält die sichtbare Beispielmarkierung aus FR-018. Eckige Platzhalter
müssen anhand tatsächlicher Daten ersetzt werden; keine automatisch als korrekt
veröffentlichten Muster-Rechtstexte. Beispieladressen verwenden `example.invalid`.

| Bereich                          | Bearbeitbarer Beispieltext                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Impressum                        | „Gravurwerk – Beispielbetrieb. Betreiber: [vollständiger Name/Firma], [Rechtsform/Vertretung falls zutreffend], [ladungsfähige Anschrift]. E-Mail: kontakt@example.invalid. Weitere erforderliche Angaben: [Register/IDs/Aufsicht nach tatsächlicher Einordnung].“                                                                                                                                                                                                                                     |
| Datenschutz                      | „Verantwortlich: [Betreiber und Kontakt]. Beim Seitenaufruf verarbeiten [Hostinganbieter] und wir [tatsächliche technische Daten] für [Zweck/Rechtsgrundlage] für [Dauer/Kriterien]. Kontaktangaben und Nachricht verarbeiten [Betreiber/Versanddienst/Postfachanbieter] zur Bearbeitung deiner Anfrage auf Grundlage von [geprüfte Rechtsgrundlage], Aufbewahrung: [Frist/Kriterien]. Weitere Informationen: [Empfänger/Transfers, Theme-/Adminspeicherung, Rechte und zuständige Beschwerdestelle].“ |
| Browser-Speicherung              | „Wir verwenden [tatsächlich eingesetzte Sitzungsspeicherung] für den geschützten Adminzugang und [Speicherart/Dauer] für deine gewählte Darstellung. Im vorgesehenen ersten Umfang nutzen wir keine Werbepixel oder Trackingdienste. [Mit tatsächlichem Dateninventar abgleichen].“                                                                                                                                                                                                                    |
| Katalogpreise                    | „Preisbeispiel: 19,90 € pro Stück, einschließlich Textgravur. [Zutreffender Steuerhinweis nach Prüfung]. Diese Seite dient der Produktpräsentation; eine Bestellung ist hier nicht möglich.“                                                                                                                                                                                                                                                                                                           |
| Hersteller/Sicherheit            | „Produktreferenz: MUSTER-001. Hersteller: [tatsächlicher Hersteller], [Postanschrift], [elektronische Adresse]. Verantwortliche EU-Person: [falls erforderlich]. Sicherheitshinweise: [zutreffende produktbezogene Angaben nach Prüfung].“                                                                                                                                                                                                                                                             |
| Barrierefreiheit                 | „Wir möchten unseren Katalog gut zugänglich gestalten. Hinweise zu Problemen kannst du über unser Kontaktformular melden. [Anwendbarkeit und gegebenenfalls erforderliche Informationen zu Anforderungen, Umsetzung und Kontakt/Behörde fachlich ergänzen].“                                                                                                                                                                                                                                           |
| Streitbeilegung                  | „[Anwendbarkeit des § 36 VSBG prüfen und zutreffenden Teilnahme-/Verpflichtungsstatus sowie gegebenenfalls zuständige Schlichtungsstelle einsetzen].“                                                                                                                                                                                                                                                                                                                                                  |
| Kontaktformular                  | „Du hast eine allgemeine Frage zu unseren Arbeiten? Schreib uns eine Nachricht. Dieses Formular dient ausschließlich der Kontaktaufnahme. Bestellungen oder Käufe können darüber nicht abgeschlossen werden. Wie wir deine Angaben verarbeiten, erfährst du in unseren Datenschutzinformationen.“                                                                                                                                                                                                      |
| Veröffentlichungsprüfung (Admin) | „Noch nicht für Echtbetrieb freigegeben: [offene Angaben/Prüfungen]. Beispiele ersetzt und Inhalte geprüft durch [Owner/Datum]. Dienst-/Dateninventar und Kontaktversand geprüft: [Nachweise]. Separate Produktionsfreigabe: [noch offen/tatsächlicher Nachweis].“                                                                                                                                                                                                                                     |

## Grenzen und Umsetzungsetappen

- Bedienbarkeit: Native Controls, Tastatur/Fokus, verständliche Feldfehler und
  Statussemantik, Bildalternativen und Kontrast in beiden Themes; Desktop/390px.
- Sicherheit: Serverseitige Admin-Autorisierung, geschützte Sessions, Eingabe-/Dateiprüfung,
  Auth-Abuse-Schutz, keine Secrets im Browser/Logs; öffentliche Kontakte dürfen
  keine Script-/Header-Injection ermöglichen. Kontaktformular benötigt HTTPS,
  serverseitige Validierung, Spam-/Abuse-Schutz und einen geprüften Versandweg.
  DEV nutzt isolierte Testdaten und einen abgegrenzten Mail-Sandboxempfänger.
- Architektur: Öffentlicher Katalog kann statisch oder dynamisch ausgeliefert
  werden; dauerhafte geschützte Adminverwaltung benötigt Backend/Datenspeicher.
  Eine ADR begründet vor Umsetzung Laufzeit, Admin-Auth, Produkt-/Bildspeicher,
  Veröffentlichung, Formular-Mailversand, Datenschutzinventar und Hostingkosten.
  Keine Commerce-, Kunden-Auth- oder Payment-Infrastruktur erforderlich. Die frühere Medusa-Empfehlung
  ist für diesen kleineren Umfang neu zu bewerten, keine getroffene Anbieterwahl.
- Ablösung: Bei Lieferung des Katalogs alte Demo-Routen/-Komponenten/-Assets und
  ausschließlich dafür bestehende Tests entfernen. Im selben Implementierungs-PR
  aktive Katalog-/Kontakt-/Admin-Journeys, statische Assets und Theme durch passende
  neue Unit-/Browserregressionen prüfen. Alte Demo-Specs sind dann historisch,
  kein fortgeltender Produktauftrag. Keine Tests wegen eines Fehlers umgehen;
  die Ablösung folgt diesem ausdrücklich geänderten Produktumfang. Pflichtgates
  und menschliche Merges bleiben erhalten. Langsame/fehlerhafte Dienste erzeugen
  keine falschen Speicher-Erfolgsmeldungen.
  Bilder passend ausliefern; kein unbegründetes Latenzziel. Kein direkter PROD-Deploy.

Nach Freigabe zwei getrennte Implementierungsaufträge: (1) Admin-/Produktgrundlage
FR-003/004 einschließlich ADR, Textverwaltung und Kontakt-Versandgrundlage;
(2) Katalog/Kontakt FR-001/002/011 und Informationsseiten FR-012–018 mit integrierter
Abnahme. Die Querschnittsanforderungen FR-012–018 gelten bereits für relevante
Arbeiten des ersten Auftrags. Plan/Tasks folgen der tatsächlich freigegebenen Revision. Teilstände
sind als unvollständig erkennbar; vollständige Lieferung verlangt alle aktiven
Anforderungen, Main-CI/DEV und Owner-Prüfung. Keine Account-/Payment-Platzhalter.

## Annahmen und offene Fragen

Bestätigt: nur Produktpräsentation und allgemeine Kontaktaufnahme, kein Verkauf
über Webseite oder E-Mail. Admin, Gestaltung/Materialien/Deutschland/Arbeitsname
bleiben; alte Seite entfällt vollständig. Das Kontaktformular ersetzt die zuvor
vorgeschlagenen produktbezogenen `mailto:`-Anfragen. Adminbearbeitbare, sichtbar
markierte Beispieltexte sind ausdrücklich gewünscht. Gravur im angezeigten Preis
bleibt ein expliziter Vorschlag. Keine offene fachliche Scopefrage für diesen
Entwurf; rechtliche Anwendbarkeit, echte Betreiber-/Produkt-/Dienstangaben und
Versand-/Hostingkosten sind vor Echtbetrieb zu prüfen. Dieser Entwurf entscheidet
sie nicht durch Beispieltexte oder eine pauschale Behauptung „keine Pflichten“.

## Abnahme und geplante Prüfungen

Prüfungen sind **geplant, nicht ausgeführt**: `pnpm format`, für Nutzerabläufe
`pnpm check:pr`, unabhängige CI/commitgenaue Vorschau, Owner-Review/-Merge und
Main-CI/DEV. Die Spec allein liefert keine funktionierende Webseite.

| ID     | Geplante beobachtbare Prüfung                                                                                                                                                                       |
| ------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| FR-001 | Desktop-/Mobilnavigation, keine Kundenkonto-/Warenkorb-/Bezahlaktionen, Theme/Reload, keine alten Demoaktionen und `/projekt` nicht gefunden; manuelle Visual-/Kontrastprüfung                      |
| FR-002 | Entwurf/veröffentlicht, direkte Detailadresse, fehlendes Bild/Leerzustand; keine Kaufaktion                                                                                                         |
| FR-003 | Besucher vs. Admin, direkte API-Manipulation, Logout/ungültige Session: verweigerte Verwaltungszugriffe                                                                                             |
| FR-004 | Admin speichern → anderer Browser/Reload; ungültige Felder/Preise/Kontaktadresse; reale Bildpersistenz und abgewiesene fehlerhafte/fremde/zu große Dateien                                          |
| FR-011 | Formularfelder/Limit, Produktreferenz, keine Bestellaktionen, Validierung/Header-/Script-Injection/Rate-Limit, fehlende Konfiguration, Provider-Sandboxannahme/Fehler und wahrheitsgemäßes Feedback |
| FR-012 | Impressumlinks von allen öffentlichen Seiten/Fehlerseite, ohne Login und mobil erreichbar; Adminpersistenz und manuelle Prüfung der Betreiberangaben                                                |
| FR-013 | Datenschutzlinks auch am Formular; Textpersistenz und manueller Abgleich mit tatsächlichem Dienst-/Dateninventar einschließlich Formular/Postfach                                                   |
| FR-014 | Browser-Netzwerk-/Speicherprüfung, keine unerwarteten Drittanbieter/Tracker; Session-/Theme-Zweck und Aufbewahrung manuell eingeordnet                                                              |
| FR-015 | Preis-/Leistungs-/Steuerhinweisdarstellung nach Adminänderung; Beispielmarker; tatsächliche steuerliche Einordnung manuell geprüft                                                                  |
| FR-016 | Produktfelder nach Adminänderung sichtbar, Referenzzuordnung; fehlende/erforderliche Angaben und manuelle Produkt-/Rollenprüfung                                                                    |
| FR-017 | Anwendbarkeitsentscheidungen und gegebenenfalls öffentliche Texte manuell geprüft, keine falsche Konformität/Schlichtungsbereitschaft; bestehende Accessibility-Prüfungen                           |
| FR-018 | Editieren → separater Browser/Reload, Unbefugte verweigert, sichere Textausgabe, Beispiel-/Platzhalterstatus und fehlende Startangaben; manuelle Inhalts-/Produktionsfreigabe                       |

FR-005–010 sind zurückgezogen und haben keine Implementierungs-Abnahme mehr.
Automatisierte Accessibility-Prüfungen kritischer Zustände (WCAG 2/2.1 A/AA)
und manuelle Bedien-/Kontrastprüfung ergänzen die Browserfälle. Incomplete-Befunde
bleiben sichtbar unbewertet; keine vollständige WCAG-/hörbare Screenreader-Zusage.
Vor Echtbetrieb prüft der Owner tatsächliche Kontakt-/Händler-/Rechtstextdaten
und Hostingkosten separat; keine kommerzielle Startfreigabe durch diesen PR.

## Änderungsnotizen und Quellen

Owner hat am 14. Oktober den noch offenen Entwurf #117 auf Katalog/Kontakt
reduziert und die vollständige Ablösung der alten Seite verlangt. FR-001–004
angepasst, FR-005–010 zurückgezogen, FR-011 neu hinzugefügt. Die zuvor vorgeschlagene
Verschiebung der Demo nach `/projekt` ist aufgehoben.
Historische IDs bleiben dokumentiert; die ursprüngliche Shopfassung steht in Git.
Designreferenz [Ingrained Inc.](https://ingrainedinc.com/): Materialkategorien,
Produktfotos/Werkstattbezug. Palette ist unser eigener Vorschlag. Frühere
Commerce-/Payment-Recherche ist historisch und autorisiert keine Integration
für den jetzt reduzierten Umfang.

Am 14. Oktober weiter revidiert: FR-011 allgemeines Kontaktformular statt
produktbezogenem E-Mail-Anfrage-/Verkaufsweg; FR-012–018 neu für Informationsseiten,
Beispieltexte/Adminbearbeitung und Veröffentlichungsprüfung. Beispiele sind keine
juristisch geprüften Endfassungen. Die Entscheidung gegen Verkauf ersetzt nicht
die Prüfung der für das konkrete Angebot tatsächlich geltenden Pflichten.

Recherchierte Grundlagen vom 14. Oktober 2026:
[§ 5 DDG](https://www.gesetze-im-internet.de/ddg/__5.html),
[Datenschutzpflichten der EU-Kommission](https://commission.europa.eu/law/law-topic/data-protection/information-business-and-organisations/obligations_en),
[§ 25 TDDDG](https://www.gesetze-im-internet.de/ttdsg/__25.html),
[§ 3 PAngV](https://www.gesetze-im-internet.de/pangv_2022/__3.html),
[§ 19 UStG](https://www.gesetze-im-internet.de/ustg_1980/__19.html),
[Produktinformationen im Fernabsatz](https://www.bundesumweltministerium.de/faq/welche-zusaetzlichen-pflichten-gelten-im-fernabsatz),
[§ 3 BFSG](https://www.gesetze-im-internet.de/bfsg/__3.html),
[§ 36 VSBG](https://www.gesetze-im-internet.de/vsbg/__36.html).
