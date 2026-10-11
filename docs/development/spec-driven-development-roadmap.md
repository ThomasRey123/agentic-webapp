# Nächstes großes Vorhaben: Spec Driven Development

**Stand:** 11. Oktober 2026. **Epic:** [#90](https://github.com/ThomasRey123/agentic-webapp/issues/90).
**Status:** Recherchierter Vorschlag. Diese Dokumentation aktiviert noch keine
neuen Agent-/CI-Regeln und installiert kein Werkzeug. Das Planungs-Issue #91
wird getrennt vom offenen Umsetzungs-Epic abgeschlossen.

## Ziel und Empfehlung

Der Eigentümer soll vor der Implementierung erkennen können, welches Verhalten
ein Feature liefern wird. Der Coding-Agent bekommt einen versionierten,
freigegebenen Auftrag; Tests und Review belegen danach, ob dieses Verhalten
umgesetzt wurde. Die Spezifikation wird bei späteren Änderungen mitgepflegt.

Empfohlen wird ein schlanker Ablauf mit Markdown im bestehenden Repository,
GitHub-Reviews und den vorhandenen Vitest-/Playwright-Prüfungen. Zunächst wird
ein kleiner neuer fachlicher Pilot durchgeführt. Eine CLI oder ein zusätzliches
Produkt wird erst anhand des beobachteten Nutzens bewertet.

Das folgt der Projektgröße und den vorhandenen Grenzen: modulare Next.js-App,
statischer Export, ein Issue/Branch/PR pro abgegrenztem Auftrag, unabhängige CI,
menschlicher Merge und separates DEV. SDD ergänzt den Anforderungsvertrag,
ersetzt keine dieser Kontrollen.

## Recherche und Quellenbewertung

Gelesen wurden die aktuellen offiziellen GitHub-Dokumentationen am genannten
Datum. Die unten verlinkten Commit-Stände machen die Recherche reproduzierbar.
Die Quellen beschreiben ihre jeweiligen Methoden und Produkte; daraus folgt kein
unabhängiger Nachweis, dass eines davon für dieses Projekt grundsätzlich besser
ist. Die Empfehlung und der Rollout sind projektspezifische Schlussfolgerungen.

| Quelle                  | Relevante Empfehlung                                                                                                                                                     | Übernahme für dieses Projekt                                                                                                           |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------- |
| GitHub Spec Kit [S1–S4] | Anforderungen, technische Planung und Aufgaben trennen; Unklarheiten und Konsistenz prüfen; bestehende Projekte schrittweise übernehmen; mehrere Modelle zur Spec-Pflege | Anforderungen mit stabilen IDs, Plan und Tasks trennen; vorhandene AGENTS-/ADR-Regeln wiederverwenden; lebende Spezifikationen pflegen |
| OpenSpec [S5–S7]        | Nur den aktuell geänderten Bereich spezifizieren; Änderungsvorschläge und bestehende Specs unterscheiden; Spec und Implementierung vor Abschluss abgleichen              | Keine Komplettinventur als Voraussetzung; Änderungen als hinzugefügt/geändert/entfernt beschreiben; Abschlussabgleich einplanen        |
| Kiro [S8–S9]            | Anforderungen, Design und Implementierungsaufgaben strukturieren; Widersprüche und Lücken analysieren; überprüfbare Kriterien und bei Bedarf Eigenschaften testen        | Klärung vor Umsetzung, getrennte technische Entscheidungen; Property-Tests nur bei geeigneten Regeln und echtem Bedarf                 |
| Cucumber [S10–S11]      | Regeln, konkrete Beispiele und offene Fragen gemeinsam klären; Given/When/Then beschreibt Ausgangslage, Handlung und beobachtbares Ergebnis                              | Kurze Akzeptanzszenarien in Markdown; bestehende Testwerkzeuge verwenden, ohne zusätzliche Gherkin-Laufzeit                            |

Spec Kit und OpenSpec sind mögliche spätere Werkzeuge. Spec Kit bietet einen
ausführlichen Ablauf und verwaltete Projektdateien; seine Installation benötigt
zusätzliche Python-/uv-Werkzeuge. OpenSpec bietet einen auf Änderungen bestehenden
Codes ausgerichteten Ablauf und ebenfalls eigene verwaltete Dateien/Kommandos.
Kiro ist eine weitere Entwicklungsplattform. Ein Produktwechsel ist für die
vorgeschlagene Methode nicht nötig. Herstellervergleiche werden nicht als
objektive Leistungsbewertung übernommen.

Direkte Abrufe von kiro.dev, cucumber.io und dem ergänzend angefragten Artikel
auf martinfowler.com wurden durch den Netzwerkproxy mit HTTP 403 abgewiesen.
Die offiziellen GitHub-Quellen zu Kiro und Cucumber konnten gelesen werden;
der Fowler-Artikel wurde nicht als Beleg verwendet. Die Recherche umfasst
relevante zugängliche Primärquellen, nicht sämtliche Internetveröffentlichungen.

## Vorgeschlagener Arbeitsvertrag

```text
Anforderung → Spec-Entwurf → offene Fragen klären → menschliche Spec-Freigabe
            → technischer Plan/Tasks → Implementierung und Tests
            → unabhängige CI → PR-Vorschau → menschlicher Merge → DEV
```

### 1. Spezifikation beschreibt das Verhalten

Für einen tatsächlich bearbeiteten Bereich entsteht künftig
`docs/specs/<feature>/spec.md`. Die Datei enthält Ziel/Nutzerbedarf, Umfang und
Nicht-Ziele, bestehendes und neues Verhalten, stabile Anforderungs-IDs wie
`FR-001`, konkrete Szenarien, Rand-/Fehlerfälle sowie relevante Anforderungen an
Bedienbarkeit, Sicherheit oder Leistung. Messbare Grenzwerte werden nur für
einen konkreten Bedarf mit realistischer Prüfgrundlage festgelegt.

Annahmen und offene Fragen werden ausdrücklich getrennt. Eine ungeklärte
Frage, die den Lieferumfang oder die Akzeptanz betrifft, verhindert die Freigabe.
Bereits vereinbarte technische Routineentscheidungen trifft der Agent weiterhin
selbstständig; er muss nicht für jede Implementierungswahl nachfragen.

### 2. Fachliche Freigabe ist nachweisbar

Der erste Pilot erhält einen eigenen Spezifikationsauftrag und einen Spec-PR.
Der Eigentümer prüft das Verhalten und merged diesen PR ausdrücklich als Freigabe.
Der spätere Implementierungsauftrag referenziert Spec-Pfad, Freigabe-PR und
genauen Commit. Eine vom Agenten gesetzte Zeile „Approved“ oder eine grüne CI
ist keine fachliche Freigabe.

Die vorgeschlagenen Zustände sind Entwurf, freigegeben und implementiert. Sie
beschreiben verschiedene Dinge: Ein freigegebenes zukünftiges Verhalten ist
noch kein Nachweis, dass es bereits im laufenden DEV verfügbar ist. Der
Implementierungsnachweis verlinkt erst nach erfolgreicher Lieferung die Tests,
Merge-/DEV-Revision und Ergebnisse.

Der Spec-PR und der Implementierungs-PR gehören jeweils zu einem eigenen
abgegrenzten Issue. So bleibt die bestehende Ein-Issue/Ein-PR-Regel erhalten.
Der zusätzliche Review-Schritt wird im Pilot auf seinen Aufwand geprüft.

### 3. Technische Planung bleibt getrennt

`plan.md` beschreibt betroffene Module, technische Entscheidungen, Risiken,
Teststrategie und gegebenenfalls Migration/Rollback. `tasks.md` zerlegt den
Plan in überprüfbare Arbeitsschritte. Kleine Vorhaben benötigen kurze Inhalte;
leere Vertrags-, Datenmodell- oder Architekturdateien werden nicht erzeugt.

AGENTS.md und bestehende ADRs bleiben die zentrale Quelle für Projektregeln.
Eine zusätzliche „Constitution“ darf keine zweite widersprüchliche Kopie werden.
Ein Feature, das nicht statisch exportierbar ist, benötigt eine bewusste
Architekturentscheidung statt einer stillen Änderung des Deployments.

### 4. Anforderungen werden unabhängig überprüft

Eine kleine Zuordnung verbindet jede Anforderungs-ID mit Szenario und passender
Prüfung. Eine ID in einem Testnamen ist dabei nur Nachverfolgbarkeit, kein
Nachweis ausreichender Testqualität. Abgedeckt werden beobachtbares Verhalten,
relevante Fehlerfälle und bestehende Regressionen.

Beispiel für die spätere Form, kein neu beauftragtes Feature:

| Anforderung                                        | Szenario                                                                             | Nachweis                                      |
| -------------------------------------------------- | ------------------------------------------------------------------------------------ | --------------------------------------------- |
| FR-001: Eine Frage lässt sich öffnen und schließen | Geschlossene Frage → Aktivierung → Antwort sichtbar; erneute Aktivierung → verborgen | Playwright-Prüfung des sichtbaren Ergebnisses |
| FR-002: Bedienung per Tastatur                     | Fokus auf Frage → Enter/Space → derselbe Zustandswechsel                             | Browsertest für Fokus und Bedienung           |

Unit-/Integrationstests belegen Logik dort, wo sie liegt; Browsertests belegen
Nutzerabläufe. Geeignete reine Regeln können später Property-Tests erhalten.
Manuelle Prüfungen bleiben ausdrücklich als manuell dokumentiert. Tests und
Spec können gemeinsam dieselbe falsche Annahme enthalten; daher bleiben die
fachliche Freigabe und unabhängige menschliche Prüfung der Vorschau wichtig.

`quality`, `browser` und `secret-scan` bleiben verpflichtend; Audit-Warnungen
werden separat bewertet. Eine strukturelle Spec-Prüfung kann später fehlende
Abschnitte oder Referenzen erkennen, aber die fachliche Richtigkeit nicht beweisen.

### 5. Änderungen halten Spec, Code und Tests zusammen

Bei einer Änderung des vereinbarten Verhaltens wird zuerst die betroffene Spec
angepasst und erneut fachlich freigegeben. Danach folgen Plan, Code und Tests.
Im Implementierungs-PR steht, welche Anforderungs-IDs hinzugefügt, geändert oder
entfernt wurden. Git-Historie und Review-Links erhalten frühere Entscheidungen;
mehrere unverbundene Kopien desselben Vertrags werden vermieden.

Eine Reparatur innerhalb des freigegebenen Verhaltens benötigt keine neue
fachliche Freigabe: Bug-Issue und Regressionstest beschreiben die Abweichung.
Dependency-Updates oder rein redaktionelle Änderungen erhalten eine kurze
Variante mit „keine beabsichtigte Verhaltensänderung“ und passenden bestehenden
Prüfungen. Dabei bleibt zu prüfen, ob ein Update tatsächlich Verhalten ändert.

## Rollout als kleine überprüfbare Etappen

1. **Arbeitsvertrag einführen.** In einem eigenen Issue/PR die Vorlage, Zustände,
   Freigabereferenz und angemessene Kurzvariante definieren. AGENTS.md,
   Workflow-Dokumentation sowie Issue-/PR-Vorlagen abstimmen. Keine neue CLI.
2. **Pilot spezifizieren.** Mit dem Eigentümer ein kleines neues fachliches
   Feature wählen. Nutzerbedarf, Szenarien und Nicht-Ziele festlegen; keine
   nachträgliche Gesamtspezifikation für Theme/FAQ erzwingen. Spec separat freigeben.
3. **Pilot liefern.** Plan/Tasks und Testzuordnung erstellen, freigegebenes
   Verhalten umsetzen, lokal `pnpm format` und `pnpm check:pr` ausführen,
   CI/Preview abwarten und nach menschlichem Merge DEV nachweisen.
4. **Pflege und Nutzen prüfen.** Eine kleine Folgeänderung am Pilot zunächst
   spezifizieren und dann liefern. Offene Fragen, Nacharbeit, erforderliche
   Eingriffe und Review-Aufwand festhalten. Dieser Lernnachweis ist keine
   statistische Aussage über die Produktivität von SDD.
5. **Automatisierung gezielt entscheiden.** Erst danach entscheiden, ob eine
   Strukturprüfung, wiederverwendbare Agent-Anweisung oder Spec Kit/OpenSpec
   ein beobachtetes Problem löst. Kein KI-Urteil als Ersatz für Pflichtprüfungen.

Das Epic ist abgeschlossen, wenn Arbeitsvertrag, Pilot und Folgeänderung
reviewt und geliefert sind, Anforderungen samt Test-/DEV-Nachweisen zugeordnet
sind und die Grenzen/Erkenntnisse dokumentiert wurden. Werkzeuginstallation
ist kein Abschlusskriterium.

## Quellen

- **S1:** [Spec Kit README](https://github.com/github/spec-kit/blob/0443760542e7e5269724744a2ac55c4bd386d095/README.md).
- **S2:** [Spec Kit: bestehende Projekte](https://github.com/github/spec-kit/blob/0443760542e7e5269724744a2ac55c4bd386d095/docs/guides/existing-projects.md).
- **S3:** [Spec Kit: Spezifikationen weiterentwickeln](https://github.com/github/spec-kit/blob/0443760542e7e5269724744a2ac55c4bd386d095/docs/guides/evolving-specs.md).
- **S4:** [Spec Kit: Spezifikationsvorlage](https://github.com/github/spec-kit/blob/0443760542e7e5269724744a2ac55c4bd386d095/templates/spec-template.md).
- **S5:** [OpenSpec README](https://github.com/Fission-AI/OpenSpec/blob/9111a7654d7800391459431fff4eaf66e33a3d2e/README.md).
- **S6:** [OpenSpec: bestehende Projekte](https://github.com/Fission-AI/OpenSpec/blob/9111a7654d7800391459431fff4eaf66e33a3d2e/docs/existing-projects.md).
- **S7:** [OpenSpec: Änderungen pflegen](https://github.com/Fission-AI/OpenSpec/blob/9111a7654d7800391459431fff4eaf66e33a3d2e/docs/editing-changes.md).
- **S8:** [Kiro: offizielle Übersicht](https://github.com/kirodotdev/kiro/blob/bfe7ff30d9b21e583566c844d75e3dd2b572e2c7/README.md).
- **S9:** [Kiro: Anforderungsbeispiel](https://github.com/kirodotdev/kiro/blob/bfe7ff30d9b21e583566c844d75e3dd2b572e2c7/.kiro/specs/github-issue-automation/requirements.md).
- **S10:** [Cucumber: Example Mapping](https://github.com/cucumber/docs/blob/3c93e6cee4c6164f40ed69dfe84ac440c2983120/content/docs/bdd/example-mapping.md).
- **S11:** [Cucumber: Gherkin-Referenz](https://github.com/cucumber/docs/blob/3c93e6cee4c6164f40ed69dfe84ac440c2983120/content/docs/gherkin/reference.md).
