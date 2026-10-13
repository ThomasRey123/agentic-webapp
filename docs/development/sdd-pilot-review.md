# SDD-Auswertung: Copy-DEV-Link-Pilot und Folgeänderung

Stand: 13. Oktober 2026 (Europe/Berlin). [Review-Issue #113](https://github.com/ThomasRey123/agentic-webapp/issues/113),
[Epic #90](https://github.com/ThomasRey123/agentic-webapp/issues/90).
Diese Auswertung ist zur Owner-Prüfung vorbereitet; ihr Merge wird nicht vorweggenommen.

## Ergebnis und Empfehlung

Der kleine Durchlauf belegt einen nachvollziehbaren fachlichen Vertrag und dessen
Pflege bei einer sichtbaren Änderung. Er belegt keinen Produktivitätsgewinn.
Der Eigentümer bewertet die getrennten Reviews als **hilfreich, aber mit zu viel
Dokumentation** (Rückmeldung in dieser Sitzung am 13. Oktober).

Den bestehenden [Arbeitsvertrag](spec-driven-development.md) mit Markdown,
getrennter Spec-Freigabe und Umsetzung beibehalten. Die bereits dort geforderte
kurze Planung praktisch einhalten: konkrete Änderungen, Nicht-Ziele, Szenarien
und Prüfnachweise beschreiben; Einstiegstexte verlinken die ausführlichen
Nachweise. Historische Lieferstände bleiben in Git und den bestehenden Issues/PRs.
Keine neue Pflichtvorlage, CLI, KI-Freigabe, Orchestrierung oder zusätzliche
CI-Prüfung einführen. Anwendungs-/Lieferverhalten, Freigaben, Pflichtgates und
Kurzroute für Wartung bleiben unverändert.

## Was der Durchlauf zeigt

| Beobachtung                                               | Beleg und Folgerung                                                                                                                                                                                                                                                                                            |
| --------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Freigabe und Lieferung sind getrennt nachweisbar          | Spec #96 → Umsetzung #98; Abnahmerevision #102 → Audits #104; sichtbare Folgeänderung #110 → Umsetzung #112. Tatsächliche Owner-Merges statt selbst gesetzter Statuslabels.                                                                                                                                    |
| Fehlerfälle und Umfang wurden vor Umsetzung vereinbart    | FR-001–FR-006 legen exakte stabile URL, keine Navigation/Clipboard-Leseoperation, wahrheitsgemäße Zustände, Wiederholung und Bedienbarkeit fest. #110 erweitert FR-003 und FR-004/005-Szenarien ohne IDs umzudeuten.                                                                                           |
| Die Folgeänderung blieb im genehmigten Umfang             | #112 zeigt die Adresse nur bei Fehler, entfernt sie beim Retry und erhält sie über Theme-Wechsel. Zwei zusätzliche Browserfälle prüfen echte manuelle Auswahl/Kopieren mit Tastatur und Maus, ohne falsche App-Erfolgsmeldung.                                                                                 |
| Tests fanden konkrete Probleme                            | Pilot-Tasks dokumentieren eine lokal entdeckte mobile Layoutregression. Der erste stabile DEV-Lauf fand den No-JS-Teststub-Fehler; Wartungs-PR #100 reparierte den Harness ohne fachliche Spec-Änderung oder entfernte Assertions. Dies ist Nutzen der Browserprüfungen, kein isolierter SDD-Wirkungsnachweis. |
| Die Abnahme musste bewusst geändert werden                | Der ursprüngliche reale Screenreader-Nachweis war nicht erbracht. Owner-Revision #102 machte ihn optional und definierte automatisierte Prüfungen. Das sind zwei zusätzliche PRs (#102/#104), keine nachträglich behauptete Erfüllung des ursprünglichen Vertrags.                                             |
| Zusätzliche Dokumentation erzeugte sichtbar Pflegeaufwand | #110 änderte 152 Markdown-Zeilen; #112 weitere 152 Plan-/Tasks-Zeilen, neben 43 Anwendungs-/CSS- und 112 Testzeilen sowie zwei Screenshots. Dies sind Additionen + Löschungen aus GitHub, keine Zeitmessung oder Qualitätskennzahl.                                                                            |
| Einstiegstexte waren nach Lieferung veraltet              | Handoff/Prioritäten verlangten noch Auswahl/Lieferung der Folgeänderung; Tasks enthielten den vor Merge korrekten Pending-Stand. Die finalen Belege standen bereits in #111/#112/#90. Diese Auswertung aktualisiert die Einstiegstexte und verlinkt diese Belege.                                              |

## Fragen, Nacharbeit und Review-Aufwand

Drei Spec-/Umsetzungspaare und ein separater Harness-Fix ergeben sieben
Owner-Merges für den Pilotbereich; der einmalige Vertrag #94 und die historische
Recherche #92 sind davon getrennt. Für die sichtbare Folgeänderung waren genau
zwei Issues/PRs nötig (#109/#110 und #111/#112).

In dieser Sitzung war eine fachliche Auswahlfrage nötig; der Owner wählte die
Fehleradresse. Die native Read-only-Textarea und ihre Gestaltung waren danach
interne Entscheidungen innerhalb der freigegebenen Spec. Kein zusätzlicher
fachlicher Änderungswunsch während dieser Umsetzung ist dokumentiert. Der
abschließende lokale Lauf, CI und die Remote-Läufe bestanden 21/21 Browserfälle.
Im ursprünglichen Pilot gab es den dokumentierten Abnahmewunsch sowie Layout- und
Harness-Nacharbeit; Cloud-/NSS- und Proxyprobleme sind Umgebungsarbeit.

Aktive Reviewzeit, Lesezeit, Kosten, Agentlaufzeit und eingesparte Nacharbeit
wurden nicht gemessen. PR-Erstellungs-/Mergezeitpunkte sind keine Reviewdauer.
Die frühere FAQ-Lieferung ist kein kontrollierter Vergleich mit gleicher Aufgabe.
Es gibt einen Pilotbereich mit einer sichtbaren Folgeänderung, keine belastbare
Statistik zu Fehlerraten oder Geschwindigkeit. Die Owner-Rückmeldung ist eine
subjektive Bewertung; historische Steuerung außerhalb vorhandener Aufzeichnungen
wird nicht rekonstruiert.

## Liefer- und Prüfbelege

Die [Spec](../specs/copy-dev-link/spec.md),
[Tasks mit Anforderungs-/Testzuordnung](../specs/copy-dev-link/tasks.md) und
bestehenden PRs enthalten die Details. Die historischen Pending-Zeilen in Tasks
sind ein Stand vor Merge; die nachstehenden GitHub-Lieferrecords ersetzen sie.
Alle genannten Spec-/Implementierungs-PRs wurden laut aktuell geprüfter API
von `ThomasRey123` gemergt.

| Etappe                  | Owner-Freigabe                                                                                              | Lieferrecord                                                                                                                                                                              |
| ----------------------- | ----------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Pilot                   | [#96](https://github.com/ThomasRey123/agentic-webapp/pull/96), `a4a06bd880135436f5b2856a361c1c59b191d10d`   | [#98](https://github.com/ThomasRey123/agentic-webapp/pull/98), `1e74554f674cdc8dc9bcf6ebc51cd4bf800bb7b6`; ursprünglicher Screenreader-Nachweis unrun                                     |
| Revidierte Abnahme      | [#102](https://github.com/ThomasRey123/agentic-webapp/pull/102), `6ddf92ca36d183cca0634237b2800689911172af` | [#104](https://github.com/ThomasRey123/agentic-webapp/pull/104), `c5755b0a4177cedc9e46253d50312bcbec3a34a2`; Main-CI 38154391357, DEV 38154476936; 19/19 Remote-Browserfälle dokumentiert |
| Sichtbare Folgeänderung | [#110](https://github.com/ThomasRey123/agentic-webapp/pull/110), `9c747eb2ed3169255fa28073de6fb93d8c11051b` | [#112](https://github.com/ThomasRey123/agentic-webapp/pull/112), `0a2efae0da9912d2c1f4c4deb567680b64ba30b1`; 21/21 auf Vorschau und stabilem DEV in dieser Sitzung                        |

Harness-Reparatur [#100](https://github.com/ThomasRey123/agentic-webapp/pull/100):
`d05aaede35544992e2ea4f231785cfef2be8c6e8`.
Für #112 bestehen lokale Formatierung, Lint, Typprüfung, 16 Vitest-/15 Node-Tests
und statischer Build; [PR-CI 38435821440](https://github.com/ThomasRey123/agentic-webapp/actions/runs/38435821440),
[Vorschau 38435959796](https://github.com/ThomasRey123/agentic-webapp/actions/runs/38435959796),
[Main-CI 38436187920](https://github.com/ThomasRey123/agentic-webapp/actions/runs/38436187920)
und [DEV 38436330269](https://github.com/ThomasRey123/agentic-webapp/actions/runs/38436330269)
sind erfolgreich. Die aktuelle API bestätigt Main-CI/DEV und Bereinigung;
zusätzliche Cloud-Smoke-/Browserergebnisse sind im Lieferrecord und Sitzungsverlauf
festgehalten. Keine erneute Ausführung historischer Läufe für diese Auswertung.

Acht tatsächlich geprüfte DEV-axe-4.13.0-Berichte: Project links, beide Themes ×
vier Zustände, WCAG 2/2.1 A/AA, keine ausgeschlossenen Regeln, keine erkannten
Verstöße. Sechs Status- und zwei Fehlerlabel-Kontrastknoten auf dem Verlauf bleiben
**automatisch unbewertbar**; neue manuelle Visual-/Kontrastevidenz ergänzt sie.
Hörbare Screenreader-Ausgabe bleibt optional und ungeprüft. Keine vollständige
WCAG-Zertifizierung. CI-Artefakt-/Logdownload aus der Cloud war historisch mit
403 blockiert; heruntergeladene CI-Inhalte werden nicht als unabhängig geprüft
behauptet. Lokale/deployte Berichte wurden tatsächlich gelesen. Advisory #82
bleibt separat offen; ein grüner Security-Job bedeutet nicht null Befunde.

## Automatisierungsentscheidung und Abschluss

Keine zusätzliche Automatisierung ist derzeit durch den Durchlauf gerechtfertigt.
Ein einfacher Strukturcheck könnte fehlende IDs/Links erkennen, aber nicht
Owner-Freigabe, Szenarioqualität oder wahre Lieferung beweisen. Solche Kontrollen
wurden hier ausgeführt; ein wiederholt übersehener struktureller Fehler ist nicht
belegt. Die beobachtete Statusduplikation lässt sich durch kurze Einstiegstexte
mit Links verringern. Spec Kit/OpenSpec oder ein Orchestrator würden zusätzliche
Dateien und Pflege einführen, ohne einen nachgewiesenen Bedarf zu lösen.

Nach Owner-Merge dieser Auswertung und erfolgreichen Pflichtprüfungen kann die
letzte Bewertungs-Etappe von Epic #90 mit dem tatsächlichen Merge-/CI-/DEV-Record
abgeschlossen werden. Bis dahin bleibt das Epic offen. Neue Features brauchen
einen eigenen Auftrag; Wartung folgt der vorhandenen Kurzroute. PROD bleibt
zurückgestellt. Keine neuen Anforderungen werden durch diese Empfehlung aktiviert.
