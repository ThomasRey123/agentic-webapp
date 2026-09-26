# Agentisches Programmieren – Projektstand V7

**Version:** V7

**Stand:** 26. September 2026

**Status:** Phase-2-Workflow und Phase-3-Milestone zur automatischen Bereinigung von PR-Ressourcen nachgewiesen

**Vorgänger:** [`PROJECT_STATE_V6.md`](PROJECT_STATE_V6.md)

**Repository:** `ThomasRey123/agentic-webapp`

## Aktueller Workflow

Der Benutzer beschreibt ein Feature direkt in ChatGPT. Ein Coding-Worker analysiert das Repository, erstellt bei Bedarf ein GitHub-Issue, implementiert auf einem `agent/<issue>-<slug>`-Branch und öffnet einen PR. `quality` und `security` prüfen ihn unabhängig; nach Erfolg steht ein eigener öffentlicher Cloudflare-Worker `agentic-webapp-pr-<PR-Nummer>` als Vorschau bereit. Der Benutzer prüft das Feature und merged den PR nach den Regeln für `main`. Erfolgreiche `main`-CI veröffentlicht den verifizierten Commit auf `agentic-webapp-dev` und führt einen Smoke-Test aus. Der Coding-Agent merged seine eigenen PRs nicht. PROD ist nicht eingerichtet und bleibt einer späteren menschlichen Freigabe vorbehalten.

`AGENTS.md` verlangt versionsbewusste APIs, angemessene Architektur, begründete Abhängigkeiten, Verhaltenstests, Barrierefreiheit und ehrliche Check-Ergebnisse. Deployment-Secrets liegen im GitHub-Environment `development`; PR-Code wird nicht mit Cloudflare-Credentials ausgeführt.

## Phase 3: nachgewiesener Lebenszyklus

| Fall                   | Nachweis                                                                                                                                                                                                                                                                                                                                              | Ergebnis                                                                                                                                                                  |
| ---------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Merge                  | [PR #30](https://github.com/ThomasRey123/agentic-webapp/pull/30), [main-CI](https://github.com/ThomasRey123/agentic-webapp/actions/runs/36248864042), [DEV-Deploy mit Smoke-Test und Cleanup](https://github.com/ThomasRey123/agentic-webapp/actions/runs/36248913555)                                                                                | PR-Worker #30 und Branch `agent/29-branch-cleanup-guard` entfernt. Der vorher bei PR #28 gefundene Fehler (PR-Nummer statt Issue-Nummer im Branchnamen) wurde korrigiert. |
| Geschlossen ohne Merge | [Test-PR #32](https://github.com/ThomasRey123/agentic-webapp/pull/32), [CI](https://github.com/ThomasRey123/agentic-webapp/actions/runs/36250118307), [Preview-Deploy](https://github.com/ThomasRey123/agentic-webapp/actions/runs/36250172243), [Cleanup](https://github.com/ThomasRey123/agentic-webapp/actions/runs/36250241578)                   | Preview-Worker #32 entfernt; ungemergter Branch `agent/31-unmerged-cleanup-probe` bleibt bewusst bestehen.                                                                |
| Ältere Ressourcen      | [PR #34](https://github.com/ThomasRey123/agentic-webapp/pull/34), [main-CI](https://github.com/ThomasRey123/agentic-webapp/actions/runs/36250818154), [DEV-Deploy und Smoke-Test](https://github.com/ThomasRey123/agentic-webapp/actions/runs/36250865293), [Reconciliation](https://github.com/ThomasRey123/agentic-webapp/actions/runs/36250933464) | Inventar und Löschungen vollständig erfolgreich; Details unten.                                                                                                           |

Die Reconciliation lief nach dem gesamten erfolgreichen DEV-Workflow. Sie zählte **sieben GitHub-Branches** und **drei PR-Preview-Worker**. Als Kandidaten identifizierte sie ausschließlich:

- Worker `agentic-webapp-pr-22`, `agentic-webapp-pr-24` und `agentic-webapp-pr-26`; alle drei wurden gelöscht.
- Gemergte Branches `agent/19-chat-to-dev`, `agent/21-persistent-theme`, `agent/23-phase2-closeout`, `agent/25-engineering-standards` und `agent/27-pr-lifecycle-cleanup`; alle fünf wurden gelöscht.

Die anschließende GitHub-REST-Prüfung zeigte nur noch `main` und den absichtlich erhaltenen, ungemergten Test-Branch `agent/31-unmerged-cleanup-probe`. Der stabile Worker `agentic-webapp-dev` wurde nie als Löschkandidat zugelassen. Die Reconciliation listete drei PR-Worker und protokollierte alle drei erfolgreichen Löschungen; eine zusätzliche Cloudflare-Liste nach der Löschung wurde nicht erhoben.

Der regelmäßige Job inventorysiert auch künftig nach einem vollständig erfolgreichen DEV-Workflow PR-Worker und Branches. Er löscht nur exakt nummerierte Worker weiterhin geschlossener PRs und unveränderte Branches gemergter PRs ohne offenen Zweit-PR. Unbekannte Worker, offene PRs, `main` und ungemergte Branches bleiben unberührt. Sein Aktionsprotokoll enthält Kandidaten und Löschungen; Fehler sind sichtbar, ohne ein bereits erfolgreiches stabiles DEV-Deployment zurückzunehmen.

## Als Nächstes

1. **Dependabot separat einrichten:** Regelmäßige, begrenzte PRs für npm-Abhängigkeiten und GitHub Actions sowie Sicherheitsupdates. Diese Automatisierung ist weiterhin ein To-do; `AGENTS.md` definiert bereits die Regeln für neue Bibliotheken. Updates müssen CI bestehen und vor dem Merge geprüft werden.
2. Einen gezielten Browser-Test für Dark Mode, Reload und gespeicherte Einstellung auf der PR-Vorschau ausführen.
3. PR-Vorschau-URL und Deployment-Status besser sichtbar machen und einen DEV-Rollback dokumentieren und testen.
4. PROD erst später mit eigener Umgebung und bewusster menschlicher Freigabe planen.
