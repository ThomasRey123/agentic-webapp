# Agentisches Programmieren – Projektstand V4

**Version:** V4

**Stand:** 26. September 2026

**Status:** Phase-2-Milestone ChatGPT → Code → CI → PR-DEV-Vorschau → menschliche Prüfung → Merge → stabiles DEV nachgewiesen

**Vorgänger:** `PROJECT_STATE_V3.md`

**Repository:** `ThomasRey123/agentic-webapp`

Dieses Dokument ist die eigenständig lesbare Baseline für folgende Chats. V3 beschreibt weiterhin die Phase-1-Infrastruktur; V4 dokumentiert die zusätzlich erreichte Phase 2.

## Ziel und Bedienung

Ein Feature-Wunsch wird direkt in einem ChatGPT Work/Codex-Coding-Auftrag beschrieben. Der Worker liest Repository und `AGENTS.md`, legt bei Bedarf selbst ein Issue an, implementiert auf einem `agent/<issue>-<slug>`-Branch, prüft lokal, erstellt einen PR und verfolgt CI und Vorschau-Deployment. Der Benutzer muss weder ein GitHub-Issue anlegen noch einen Agenten separat starten. Ein normal beendeter Chat ist kein dauerhaft laufender Dienst; der Worker muss bis zum Ergebnis im Auftrag bleiben oder eine gezielte Folgeprüfung im selben Chat planen.

Für den praktischen Auftrag und das einmalige Setup siehe [`docs/development/chat-to-dev.md`](docs/development/chat-to-dev.md). Die Architektur und ihre Grenzen stehen in [`docs/architecture/phase-2.md`](docs/architecture/phase-2.md).

## Aktuelle Architektur

```text
ChatGPT-Anforderung
  -> optional automatisch erzeugtes GitHub-Issue
  -> kurzlebiger Agent-Branch und ein Pull Request
  -> GitHub-CI: quality (pnpm check) und security
  -> bei Erfolg: eigener öffentlicher Cloudflare-Worker pro PR + Smoke-Test
  -> menschliche Funktionsprüfung auf dieser Vorschau
  -> Merge nach geschützt main
  -> main-CI -> bestehender stabiler DEV-Worker + Smoke-Test
```

Die PR-Vorschau ist von `agentic-webapp-dev` getrennt. Das bestehende DEV unter [agentic-webapp-dev.tr-config-place.workers.dev](https://agentic-webapp-dev.tr-config-place.workers.dev) bleibt an verifizierte `main`-Commits gebunden. PROD ist nicht eingerichtet und erfordert später eine gesonderte menschliche Freigabe. Ein dauerhafter `dev`-Branch ist derzeit nicht nötig.

## Berechtigungen und Sicherheitsgrenzen

- Das aktive GitHub-Ruleset `protect-main` erzwingt PRs, aktuelle `quality`- und `security`-Checks und die Auflösung von Review-Threads; Force-Push und Branch-Löschung sind gesperrt. Die erforderliche Anzahl zustimmender Reviews ist derzeit **0**. Der Coding-Agent merged seinen eigenen PR gemäß `AGENTS.md` nicht.
- Der PR-CI-Job baut ohne Cloudflare-Zugang. Erst nach vollständig erfolgreicher CI lädt ein separater `workflow_run`-Job den statischen Export aus genau diesem CI-Lauf. Er prüft, ob ein PR im selben Repository noch offen ist und sein Head-Commit zur erfolgreichen CI passt.
- Der Deployment-Job verwendet Skripte und Wrangler-Konfiguration von `main`; er führt keine Skripte vom Feature-Branch aus. Cloudflare-Zugang liegt als Environment-Secrets `CLOUDFLARE_API_TOKEN` und `CLOUDFLARE_ACCOUNT_ID` im GitHub-Environment `development`, nicht im Repository oder in ChatGPT.
- PR-Vorschauen sind öffentlich. Keine Secrets oder privaten Daten in statische Assets legen. Der Workflow erstellt derzeit pro PR einen Worker; geschlossene PR-Worker werden noch nicht automatisch entfernt.

## Nachweis: erster vollständiger Feature-Durchlauf

| Station             | Ergebnis                                                                                                                                                                                                     |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Auftrag             | Dark Mode direkt im ChatGPT-Chat angefordert                                                                                                                                                                 |
| GitHub              | [Issue #21](https://github.com/ThomasRey123/agentic-webapp/issues/21) automatisch erstellt; [PR #22](https://github.com/ThomasRey123/agentic-webapp/pull/22) auf eigenem Branch                              |
| Feature             | Theme-Schalter im Header; Hell/Dunkel, Speicherung per `localStorage`, Wiederherstellung beim Laden, Feature-API und Verhaltenstests                                                                         |
| PR-CI               | [Quality und Security erfolgreich](https://github.com/ThomasRey123/agentic-webapp/actions/runs/36244951216), einschließlich Production-Build                                                                 |
| PR-Vorschau         | [Deployment und Smoke-Test erfolgreich](https://github.com/ThomasRey123/agentic-webapp/actions/runs/36244991204); [Vorschau-URL](https://agentic-webapp-pr-22.tr-config-place.workers.dev/)                  |
| Menschliche Prüfung | Benutzer hat die Vorschau geprüft und als gut beurteilt                                                                                                                                                      |
| Merge               | PR #22 nach `main` gemergt; Issue #21 geschlossen; Merge-Commit `463db4a4b0f245f992b3e7e499f3a4dcb0971397`                                                                                                   |
| Stabiles DEV        | [main-CI erfolgreich](https://github.com/ThomasRey123/agentic-webapp/actions/runs/36245300881); [Deploy und Smoke-Test erfolgreich](https://github.com/ThomasRey123/agentic-webapp/actions/runs/36245345509) |
| Live-Verifikation   | Auf stabilem DEV Schalter betätigt: `data-theme=dark`; nach Reload weiterhin `dark`, Schalter zeigt „Helles Design“                                                                                          |

Die lokale Laufzeitumgebung meldete beim Next.js-Build `ENOENT: uv_resident_set_memory`. Formatierung, Lint, Typecheck und vier Tests waren lokal erfolgreich. Der unabhängige Build in GitHub-CI bestand sowohl im PR als auch nach dem Merge auf `main`.

## Offene Punkte und nächster Schritt

- Der erste Milestone ist erreicht. Für weitere Features gilt derselbe ChatGPT-zu-PR-Vorschau-Ablauf; der Benutzer prüft die Vorschau vor dem Merge.
- Die PR-spezifischen Cloudflare-Worker sollten später automatisch beim Schließen des PR entfernt werden, falls sich sonst unnötige Ressourcen ansammeln. Die erste Version enthält bewusst keinen Aufräumjob.
- Der Smoke-Test prüft HTTP-Erfolg und HTML. Ein echter Browser-Test für ausgewählte Funktionen kann bei weiterem Bedarf ergänzt werden.
- Es gibt weiterhin keine automatische Freigabe nach PROD. Der separate PROD-Prozess bleibt einer späteren Phase vorbehalten.
