# Agentisches Programmieren – Projektstand V6

**Version:** V6

**Stand:** 26. September 2026

**Status:** Phase 2 abgeschlossen; beide Phase-3-Cleanup-Fälle praktisch nachgewiesen; Aufräumen der Altbestände in Umsetzung

**Vorgänger:** [`PROJECT_STATE_V5.md`](PROJECT_STATE_V5.md)

**Repository:** `ThomasRey123/agentic-webapp`

## Ausgangspunkt

Ein Auftrag beginnt direkt in ChatGPT; der Coding-Worker erzeugt bei Bedarf ein Issue, arbeitet auf einem Feature-Branch und erstellt einen PR. GitHub-CI prüft Qualität und Sicherheit. Eine isolierte Cloudflare-PR-Vorschau wird auf DEV geprüft; erst nach einem menschlichen Merge laufen `main`-CI, stabiles DEV-Deployment und Smoke-Test. `AGENTS.md` fordert versionsbewusste APIs, nachvollziehbare Abhängigkeiten, angemessene Architektur, Tests und Barrierefreiheit. PROD ist nicht eingerichtet und bleibt menschlich freizugeben.

## Nachweis für den PR-Lebenszyklus

- **Gemergter PR:** [PR #30](https://github.com/ThomasRey123/agentic-webapp/pull/30) wurde nach erfolgreicher [main-CI](https://github.com/ThomasRey123/agentic-webapp/actions/runs/36248864042) im [DEV-Deploy](https://github.com/ThomasRey123/agentic-webapp/actions/runs/36248913555) bereitgestellt und smoke-getestet. Die PR-Vorschau `agentic-webapp-pr-30` wurde gelöscht; der Branch `agent/29-branch-cleanup-guard` ist nach dem Lauf nicht mehr vorhanden. Der vorherige Lauf bei PR #28 fand einen Fehler bei der Verwechslung von PR- und Issue-Nummer; PR #30 korrigierte und testete ihn.
- **Ohne Merge geschlossener PR:** [Test-PR #32](https://github.com/ThomasRey123/agentic-webapp/pull/32) lief erfolgreich durch [CI](https://github.com/ThomasRey123/agentic-webapp/actions/runs/36250118307) und [PR-Vorschau mit Smoke-Test](https://github.com/ThomasRey123/agentic-webapp/actions/runs/36250172243). Nach dem Schließen ohne Merge meldete der [Cleanup-Lauf](https://github.com/ThomasRey123/agentic-webapp/actions/runs/36250241578) die Löschung von `agentic-webapp-pr-32`. Der ungemergte Branch `agent/31-unmerged-cleanup-probe` blieb wie vorgesehen bestehen. [Issue #31](https://github.com/ThomasRey123/agentic-webapp/issues/31) dokumentiert den Test und ist geschlossen.

Die Anwendung läuft weiterhin auf `agentic-webapp-dev` in Cloudflare Workers Static Assets. Der Cleanup verwendet ausschließlich `development`-Secrets aus GitHub, vertrauenswürdigen `main`-Code und exakt nummerierte PR-Worker. Branch-Löschungen verlangen einen gemergten PR und einen unveränderten Branch-SHA; `main` bleibt geschützt.

## Bestandsaufnahme und ausstehender Nachweis

Bei der Bestandsaufnahme vor diesem PR waren neben `main` fünf ältere gemergte Branches vorhanden: `agent/19-chat-to-dev` (PR #20), `agent/21-persistent-theme` (#22), `agent/23-phase2-closeout` (#24), `agent/25-engineering-standards` (#26) und `agent/27-pr-lifecycle-cleanup` (#28). Der Test-Branch `agent/31-unmerged-cleanup-probe` gehört zu einem **ungemergten** PR und soll nicht automatisch gelöscht werden. Weitere früher beobachtete Branches waren bei dieser Bestandsaufnahme bereits entfernt; ihre Entfernung wurde nicht diesem Auftrag zugeschrieben.

Für Cloudflare liegt derzeit **kein verifizierter Account-Bestand** vor. [Issue #33](https://github.com/ThomasRey123/agentic-webapp/issues/33) ergänzt deshalb eine Reconciliation nach dem vollständig erfolgreichen DEV-Workflow: Der Job listet zuerst Worker-Skripte, PRs und Branches auf, berichtet die exakt klassifizierten Kandidaten und löscht nur noch existierende Worker geschlossener PRs und unveränderte Branches gemergter PRs. Andere Worker und ungemergte Branches bleiben bestehen. Erst der erfolgreiche Lauf nach dem Merge und die kontrollierte REST-Bestandsprüfung belegen die tatsächliche Altbereinigung.

## Nächste getrennte Aufgaben

1. **Dependabot einrichten:** Regelmäßige, begrenzte PRs für npm-Abhängigkeiten und GitHub Actions sowie Sicherheitsupdates. Die Auswahlregeln stehen in `AGENTS.md`, die Automatisierung ist noch nicht eingerichtet. Alle Update-PRs brauchen bestehende CI und menschliche Prüfung.
2. Kleinen Browser-Test für Dark Mode inklusive Reload auf PR-Vorschauen einrichten.
3. Vorschau-URL und Deployment-Status am PR besser sichtbar machen; einen überprüften DEV-Rollback vorsehen.
4. PROD nur über eine getrennte Umgebung und bewusste menschliche Freigabe planen.
