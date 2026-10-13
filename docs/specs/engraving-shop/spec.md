# Spezifikation: Gravurwerk – erster verkaufbarer Shopumfang

**Spec-Issue:** [#116](https://github.com/ThomasRey123/agentic-webapp/issues/116).
**Epic:** [#115](https://github.com/ThomasRey123/agentic-webapp/issues/115).
**Reviewzweck:** Fachlicher Vorschlag zur Owner-Freigabe, keine Umsetzung oder Lieferbehauptung.
**Bestehende Spec:** Neue Shop-Anforderungen; die historischen Copy-DEV-Link-IDs werden nicht umgedeutet.

Es gilt der [SDD-Vertrag](../../development/spec-driven-development.md). Erst nach
Owner-Merge folgen separate Implementierungs-Issues/PRs mit Spec-Pfad, Freigabe-PR
und dessen tatsächlichem vollständigen Merge-SHA. Keine Infrastruktur wird durch
Erstellung dieses Entwurfs eingerichtet.

## Ziel und Nutzer

Kunden in Deutschland kaufen personalisierte Gravurprodukte aus Holz, Leder und
Glas. Der Betreiber pflegt Sortiment und Bestellungen selbst über einen separaten
Adminzugang. Arbeitsname: **Gravurwerk**. Kundentexte und Shopbedienung sind deutsch;
Preise und Zahlungen verwenden EUR.

## Umfang und Nicht-Ziele

Im ersten Umfang: Shopgestaltung, Produktkatalog/-details, Admin-Produktpflege mit
Bildern/Preisen, Kundenkonto und Gastbestellung, eingegebener Gravurtext, Warenkorb,
deutscher Versand, PayPal/Kartenzahlung, Kunden-/Admin-Bestellübersicht.

Ausgeschlossen: Epoxidharz/Möbel, internationale Lieferungen/Mehrwährungen,
Kunden-Logo-/Foto-Uploads, grafischer Gravurkonfigurator, Rabattcodes, Abonnements,
Marktplatz, freie Layoutbearbeitung im Admin und eigene Rückerstattungsoberfläche.
Rückerstattungen können im Zahlungsanbieter-Dashboard bearbeitet werden; der
Bestell-Zahlungsstatus muss deren bestätigtes Ergebnis nachvollziehen.
Echtbetrieb/PROD, verbindlicher Markenname und kostenpflichtige Providerbuchungen
benötigen einen separaten Auftrag. Die technische Erstabnahme erfolgt in DEV
mit Sandboxzahlungen und Testdaten, nicht mit echten Kunden/Zahlungen.

## Bestehendes und vorgeschlagenes Verhalten

Die aktuelle Startseite demonstriert den Entwicklungsablauf. Künftig führt `/`
in den Shop. Die bestehende Projekt-Demo bleibt unter `/projekt` mit ihren Links,
FAQ, Cloud-Test, Copy-DEV-Link und Theme-Verhalten erreichbar; ihre historische
Spec gilt weiter. Das Verschieben erhält diese Abläufe und deren Browserprüfungen.
Ein Adminlogin ist vom Kundenlogin getrennt und autorisiert tatsächliche
serverseitige Verwaltung. Ein geändertes Produkt bleibt nach Reload und in einem
anderen Browser sichtbar; lokale Demo-Daten sind kein funktionierendes Shopsystem.

## Anforderungen und Szenarien

### FR-001 — Warmer Shopauftritt und Navigation

Creme, Holzbraun und Petrol bestimmen den hellen Auftritt. Große Material-/Gravur-
Produktfotos, ruhige Flächen und gut lesbare Schriften vermitteln Handarbeit.
Die Startseite zeigt Produktbereiche Holz, Leder und Glas, ausgewählte verfügbare
Produkte und einen kurzen Werkstatttext. Navigation führt zu Shop, Kundenkonto
und Warenkorb; der Admin besitzt einen eigenen Einstieg. Das vorhandene Theme
bleibt umschaltbar und über Reload erhalten; ein dunkler Auftritt erhält denselben
Markencharakter. Keine erfundenen Rezensionen, Siegel oder Lieferzusagen.

- Gegeben Desktop oder 390px-Mobilansicht, wenn Nutzer navigieren, dann erreichen
  sie Katalog, Konto und Warenkorb ohne abgeschnittene Inhalte oder Hover-Zwang.
- Gegeben ein Theme-Wechsel/Reload, dann bleiben gewähltes Theme und lesbare
  Kontraste erhalten; die Projekt-Demo bleibt auf ihrer eigenen Route nutzbar.

### FR-002 — Veröffentlichte Produkte und nachvollziehbare Produktdetails

Nur veröffentlichte Produkte erscheinen öffentlich. Details zeigen Name,
Beschreibung, Material, Bilder, Preis, Variante und konfigurierte Lieferzeit/
Verfügbarkeit. Preis enthält die Gravur; es gibt im MVP keinen separaten
Gravuraufschlag. Nicht verfügbare Produkte sind nicht bestellbar.

- Gegeben Entwurf und veröffentlichtes Produkt, wenn ein Kunde den Katalog
  öffnet oder eine Detailadresse direkt aufruft, dann erhält er keine
  unveröffentlichten Produktdetails; nur das veröffentlichte Produkt ist kaufbar.
- Gegeben fehlendes/fehlerhaftes Bild oder leerer Katalog, dann zeigt die Seite
  verständlichen Ersatz/Leerzustand statt eines kaputten oder erfundenen Angebots.

### FR-003 — Getrennter, geschützter Adminzugang

Nur vom Betreiber eingerichtete Admins verwalten Produkte, Shop-Einstellungen
und Bestellungen. Öffentliche Registrierung erzeugt niemals Adminrechte.
Berechtigungen werden für jeden Lese-/Schreibzugriff im Backend geprüft.

- Gegeben Gast/Kundenkonto, wenn Adminseiten oder deren APIs direkt aufgerufen
  werden, dann sind Verwaltungsdaten und Schreibaktionen verweigert.
- Gegeben angemeldeter Admin, wenn er sich abmeldet oder seine Sitzung ungültig
  wird, dann scheitert auch ein zuvor vorbereiteter Verwaltungsrequest.

### FR-004 — Dauerhafte Produkt-, Preis- und Bildverwaltung

Admins erstellen/bearbeiten Produkte: Titel, Beschreibung, Materialkategorie,
Varianten/Preise, Veröffentlichung, Verfügbarkeit, Lieferzeit, Bilder und
Gravurpflicht/-Zeichenlimit. Preise sind gültige positive EUR-Beträge, Mengen
positive ganze Zahlen. Archivieren/Depublizieren ersetzt physisches Löschen
von bestellten Produkten; historische Bestellungen bleiben unverändert.

- Gegeben Admin, wenn er ein Produkt speichert/veröffentlicht oder dessen Preis
  ändert, dann sieht ein anderer Browser nach Aktualisierung den gespeicherten
  Stand. Ungültige Eingaben erzeugen Feldfehler und keine Teiländerung.
- Gegeben Bild-Upload, wenn eine gültige JPEG-/PNG-/WebP-Datei bis 10 MiB eingeht,
  dann ist sie dauerhaft als Produktbild nutzbar. Fremde Formate, beschädigte
  Bilder oder größere Dateien werden serverseitig abgewiesen; ein Uploadfehler
  entfernt keine vorhandenen Bilder. Alternative Bildtexte sind bearbeitbar.

### FR-005 — Kundenkonten und Gastbestellungen

Kunden registrieren sich mit E-Mail/Passwort, melden sich an/ab und können ein
Passwort über einen begrenzten, einmal verwendbaren E-Mail-Link zurücksetzen.
Es gibt eine Bestellübersicht für das eigene Konto. Gastbestellung ist ohne
Registrierung möglich; Gäste werden nicht stillschweigend registriert.

- Gegeben Kundenkonto A, wenn es die Bestellungen von B über manipulierte IDs
  anfragt, dann erhält es keine fremden Daten; ein Kundenkonto erhält keine Adminrechte.
- Gegeben Gast, wenn er bestellen möchte, dann genügt der Gastweg mit nötigen
  Kontakt-/Adressdaten. Die Bestellbestätigung ist geschützt und nicht über
  erratbare Bestellnummern öffentlich abrufbar.
- Gegeben falsches Passwort oder ungültiger/abgelaufener Reset-Link, dann schlägt
  die Aktion verständlich fehl. Reset-Anfragen verraten nicht, ob eine E-Mail existiert.

### FR-006 — Gravurtext gehört zur bestellten Position

Gravurfähige Produkte besitzen ein Texteingabefeld mit sichtbarem, vom Admin
festgelegtem Zeichenlimit und Kennzeichnung, ob die Eingabe erforderlich ist.
Nur Textgravur; keine automatische grafische Vorschau. Der Preis verändert sich
nicht durch Textlänge. Text wird als Text dargestellt, nicht als HTML ausgeführt.

- Gegeben Pflichtgravur, wenn Text leer/nur Leerzeichen oder länger als das
  angezeigte Limit ist, dann verhindern Frontend und Backend die Aufnahme/Bestellung.
- Gegeben gültiger Text, wenn das Produkt in den Warenkorb und die Bestellung
  gelangt, dann bleibt der bestätigte Text exakt in Position/Bestellübersicht/
  Adminansicht erhalten, einschließlich Umlauten. Änderungen sind vor Bestellung möglich.
- Gegeben gleiche Variante mit zwei unterschiedlichen Gravuren, dann bleiben
  zwei unterscheidbare Positionen; Texte werden nicht durch Mengenaggregation überschrieben.

### FR-007 — Bearbeitbarer Warenkorb

Gäste und Kunden fügen verfügbare Varianten mit Menge/Gravur hinzu, ändern Mengen
oder Gravur und entfernen Positionen. Ein Reload verliert den Warenkorb nicht;
bei Login wird ein vorhandener Gastwarenkorb übernommen. Geräteübergreifendes
Zusammenführen mehrerer Warenkörbe ist nicht Teil des MVP.

- Gegeben nicht leerer Warenkorb, wenn Menge/Gravur geändert wird, dann stimmen
  sichtbare Positionen und Summen; Entfernen der letzten Position zeigt einen Leerzustand.
- Gegeben Preis-/Verfügbarkeitsänderung seit Hinzufügen, wenn Checkout beginnt,
  dann prüft der Server neu und informiert über Änderungen. Eine geänderte Summe
  muss vor einer Zahlung erneut bestätigt werden.

### FR-008 — Checkout für Deutschland mit klarer Gesamtsumme

Checkout erfasst Kontakt-E-Mail, Liefer-/Rechnungsadresse und verlangt eine
lieferfähige deutsche Adresse. Vor Zahlung zeigt er Positionen mit Gravur,
Versand und Gesamtpreis sowie konfigurierte Steuerhinweise. Eine im Admin
konfigurierbare deutschlandweite Versandpauschale ist der erste Versandtarif;
keine automatische Paketdienstintegration. Bestellabschluss erfolgt ausdrücklich.

- Gegeben gültige deutsche Adresse, wenn Kunde oder Gast fortfährt, dann sieht
  er dieselbe serverseitig berechnete EUR-Gesamtsumme einschließlich Versand.
- Gegeben ungültige/nicht deutsche Adresse, leeren Warenkorb oder fehlende
  Versand-/Steuerkonfiguration, dann startet keine Zahlung; verständliche Fehler
  ermöglichen Korrektur. Manipulierte Browserpreise werden nicht übernommen.

### FR-009 — PayPal und Karte mit wahrheitsgemäßem Zahlungsstatus

Beide Zahlungsarten müssen im Zielbetrieb verfügbar und in DEV über die
jeweilige Sandbox nachgewiesen sein. Kartendaten verarbeitet der Zahlungsanbieter;
Shopdatenbank und Logs speichern keine vollständigen Kartendaten. Ein Rücksprung
vom Anbieter allein bestätigt keine erfolgreiche Zahlung.

- Gegeben erfolgreiche, serverseitig bestätigte Zahlung, dann entsteht genau
  eine bezahlte Bestellung mit unveränderlichem Preis-/Produkt-/Gravursnapshot.
- Gegeben Ablehnung, Abbruch oder noch ausstehende Zahlung, dann wird kein
  erfolgreicher Kauf behauptet. Nutzer erhalten passenden Status und einen
  sicheren weiteren Versuch; keine zweite Zahlung für denselben bestätigten Auftrag.
- Gegeben gefälschte, doppelte oder verzögert zugestellte Anbieterereignisse,
  dann verändern ungültige Ereignisse nichts und gültige Duplikate erzeugen
  weder doppelte Bestellungen noch doppelte Bestätigungen.

### FR-010 — Bestellungen für Kunde und Betreiber

Bestätigung und Kundenkonto zeigen eigene Bestellnummer, Positionen/Gravur,
Gesamtsumme und Zahlungs-/Versandstatus. Nach bestätigter Bestellung geht eine
E-Mail an die angegebene Adresse; ein E-Mail-Fehler macht eine bezahlte Bestellung
nicht ungeschehen. Admins sehen die Bestellungen mit für Bearbeitung nötigen
Kontaktdaten, markieren Bearbeitungs-/Versandstatus und können Versandinformationen
hinterlegen. Sie können eine unbezahlte Bestellung nicht einfach als bezahlt setzen.

- Gegeben Bestellung, wenn später Produkttext/Preis geändert oder das Produkt
  archiviert wird, dann bleibt ihr ursprünglicher Snapshot erhalten.
- Gegeben Admin ändert Versandstatus oder Anbieter bestätigt Rückerstattung,
  dann wird der entsprechende Status nachvollziehbar aktualisiert; Zahlungs-
  und Versandstatus werden getrennt behandelt. Kunden sehen nur eigene Daten.

## Grenzen und vorgeschlagene Umsetzungsetappen

- Bedienbarkeit: Native Controls, Tastatur/Fokus, verständliche Feldfehler,
  passende Statussemantik, Bildalternativen und Kontrast in beiden Themes.
  Kritische Abläufe bei 390px und Desktop prüfen; keine komplette WCAG-Zertifizierung.
- Sicherheit: Dauerhafte serverseitige Datenhaltung und Autorisierung, geschützte
  Sessions, serverseitige Preise/Eingabe-/Dateiprüfung, Abuse-Schutz für Auth,
  verifizierte Providerereignisse, keine Secrets in Browser/Logs. DEV nutzt
  isolierte Testkonten/-daten; Kundendaten nicht in Repository/CI-Artefakten.
- Architektur: Der statische Export allein reicht nicht. Vor Backend-Umsetzung
  begründet eine ADR Laufzeit, Commerce-/Auth-Basis, Datenbank, Bild-/E-Mail-Dienst,
  Provider und Hosting einschließlich Kosten/Alternativen. Medusa ist Kandidat,
  keine endgültige technische Wahl. Keine Providerkonten oder kostenpflichtigen
  Dienste ohne passenden Owner-Auftrag einrichten.
- Kompatibilität: Historische Projekt-Demo und kritische Journeys bleiben unter
  `/projekt` erreichbar; ihre Browserabdeckung wird mitverschoben. Bestehende
  Pflichtgates/menschliche Merges bleiben erhalten. Kein direkter PROD-Deploy.
- Leistung: Bildgrößen/Übertragung begrenzen und keine Original-Uploads unnötig
  im Katalog laden. Noch kein empirisch begründetes Latenzziel; langsame/fehlende
  Dienste dürfen keine falschen Erfolgszustände erzeugen.

Drei getrennte Implementierungsaufträge nach Freigabe: (1) Shopgestaltung und
Admin-/Produktgrundlage FR-001–004; (2) Kundenkonten, Gravur und Warenkorb
FR-005–007; (3) Checkout/Zahlungen/Bestellungen FR-008–010 mit Integration aller
Anforderungen. Plan/Tasks entstehen erst aus der freigegebenen Revision.
Zwischenstände sind als unvollständig gekennzeichnet und bieten keine scheinbar
funktionierenden Login-/Bezahlbuttons. Vollständige Lieferung erfordert die
integrierte Abnahme; Hosting-/Architekturabhängigkeiten bleiben in den Teilaufträgen sichtbar.

## Annahmen und offene Fragen

Owner entschied: Arbeitsname, Deutschland, Farbwelt, eingegebener Gravurtext,
Gastbestellung zusätzlich zum Konto, PayPal und Karte; Epoxidharz zurückgestellt.
Produktpreis einschließlich Textgravur, konfigurierbare einheitliche Versandpauschale,
Text statt Live-Vorschau und die Demo-Route sind explizite Vorschläge dieses PRs.

Offene fachliche Scope-/Abnahmefragen: keine für diesen vorgeschlagenen MVP.
Anbieter-/Hostingauswahl, tatsächliche Versandpreise, Steuerbehandlung, Absender,
Händlerdaten, Produktmaterial und bereitgestellte Rechtstexte sind noch keine
festgelegten Betriebswerte. Vor Echtbetrieb werden sie korrekt konfiguriert und
vom Owner geprüft; ihre Testwerte sind als Testdaten gekennzeichnet. Eine technische
Wahl, die den vereinbarten Umfang nicht erfüllen kann, erfordert erneute Klärung,
keinen stillen Verzicht auf PayPal, Gastbestellung oder sichere Konten.

## Abnahme und geplante Prüfungen

Alle folgenden Prüfungen sind **geplant und nicht ausgeführt**. Pro Teilauftrag
`pnpm format` und passendes vollständiges Gate, für Nutzerabläufe `pnpm check:pr`,
unabhängige CI/commitgenaue Vorschau und nach Owner-Merge Main-CI/DEV nachweisen.

| ID     | Geplante beobachtbare Prüfung                                                                                                                                             |
| ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| FR-001 | Browsernavigation/Desktop/390px, Theme/Reload und verschobene Projektregressionen; manuelle Visual-/Kontrastprüfung in beiden Themes                                      |
| FR-002 | Service-/Browserfälle für veröffentlicht/Entwurf/unverfügbar, direkte Detailadresse, Leerzustand und fehlendes Bild                                                       |
| FR-003 | Integration mit Gast/Kunde/Admin, direkte API-Manipulation und ungültiger Sitzung; verweigerte Daten-/Schreibzugriffe                                                     |
| FR-004 | Admin speichern → separater Browser/Reload; ungültige Preise/Felder; reale Bildpersistenz und abgewiesene beschädigte/zu große/fremde Dateien                             |
| FR-005 | Registrierung/Login/Logout/Reset, Kunde A/B-Isolation und geschützte Gastbestätigung; Browser-End-to-End ohne Registrierung                                               |
| FR-006 | Backend-/Browserfälle leer/Limit/Umlaute/HTML-Text; zwei gleiche Varianten mit verschiedenen Gravuren bis zur Admin-Bestellansicht                                        |
| FR-007 | Browser Mengen/Text/Entfernen/Reload/Login-Übernahme; Backend-Preis-/Verfügbarkeitsänderung mit erneuter Bestätigung                                                      |
| FR-008 | Gast-/Kundencheckout, deutsche/ungültige/fremde Adresse, fehlende Konfiguration, manipulierte Preise; korrekte konfigurierte Gesamtsumme                                  |
| FR-009 | Echte Provider-Sandboxfälle für beide Zahlungsarten: Erfolg/Ablehnung/Abbruch/ausstehend; Integration gefälschter/doppelter/verzögerter Ereignisse, genau eine Bestellung |
| FR-010 | Bestell-/E-Mail-Sandbox, Produktänderung/Archivierung, Mailfehler, Admin-/Kundenstatus und bestätigte Rückerstattung; fremde Datenzugriffe verweigert                     |

Kritische Formulare/Zustände ergänzen automatisierte Accessibility-Prüfungen
(WCAG 2/2.1 A/AA, keine verschwiegenen Ausschlüsse). Incomplete-Ergebnisse bleiben
sichtbar ungeprüft und werden manuell bewertet. Hörbare Screenreader-Ausgabe
bleibt ausdrücklich ungeprüft, sofern keine Sitzung dokumentiert wird. Fachliche
Owner-Prüfung der Vorschau ist zusätzlich zu Tests nötig. Vor Echthandel sind
Händler-/Versand-/Steuer-/Rechtstextkonfiguration und reale Provider-/Hostingkosten
separat manuell zu prüfen; kein solcher Startnachweis wird hier behauptet.

## Entscheidungsnotizen und Quellen

Neue IDs FR-001–010 gelten innerhalb `engraving-shop`; keine historischen IDs
werden entfernt oder wiederverwendet. Designableitung aus
[Ingrained Inc.](https://ingrainedinc.com/): Material-/Geschenkkategorien,
Produktfotos und Werkstattbezug. Die Palette ist unser eigener Vorschlag, keine
behauptete Kopie der Referenz. Frühere Tischreferenzen gehören nicht zum ersten Shopumfang.

Technische Recherche, 13. Oktober 2026:
[Medusa Produkt-/Bildpflege](https://docs.medusajs.com/user-guide/products/edit),
[personalisierte Produkte](https://docs.medusajs.com/resources/recipes/personalized-products),
[Gastwarenkorb](https://docs.medusajs.com/resources/storefront-development/cart/create),
[Payment-Anbindungen](https://docs.medusajs.com/resources/commerce-modules/payment/payment-provider)
und [Hostinganforderungen](https://docs.medusajs.com/learn/deployment/general).
Diese Quellen belegen mögliche Bausteine, keine fertig integrierte Lösung,
kostenlose Betriebszusage oder Anbieterfreigabe.
