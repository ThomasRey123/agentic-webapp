# Agentisches Programmieren – Projektstand V3

**Version:** V3  
**Status:** Phase-1-DEV-Grundlage umgesetzt und verifiziert  
**Vorgänger:** `project_state_v2.md`  
**Stand:** 15. September 2026  
**Repository:** `ThomasRey123/agentic-webapp`  
**Zweck:** Verbindliche, eigenständig verständliche Baseline für weitere Chats und Implementierungsschritte.

## 1. Änderungen seit V2

V2 beschrieb die geplante Phase-1-Architektur. V3 dokumentiert den tatsächlich implementierten und verifizierten Stand.

Seit V2 wurden umgesetzt:

- öffentliches GitHub-Repository mit geschütztem `main`;
- Next.js-App als modularer Monolith;
- verbindliche Agentenregeln in `AGENTS.md`;
- Issue- und Pull-Request-Vorlagen;
- ESLint, Prettier, TypeScript Strict Mode und Vitest;
- einheitliches lokales Quality Gate über `pnpm check`;
- unabhängige GitHub-Actions-Jobs für Qualität und Security;
- automatischer DEV-Deploy nach erfolgreicher `main`-CI;
- Cloudflare Workers Static Assets als DEV-Hosting;
- HTTP-basierter Smoke-Test gegen das reale Deployment;
- ein vollständiger Infrastruktur-Durchlauf bis zum öffentlichen DEV-System.

Abweichungen gegenüber V2:

- PROD-Deployment wurde durch bewusste Entscheidung des Repository-Owners zurückgestellt.
- Der Hosting-Provider ist nicht mehr offen: DEV verwendet Cloudflare Workers Static Assets.
- Der Smoke-Test ist als Node-basierter HTTP-Test umgesetzt; Playwright bleibt optional.
- Die konkreten Tool-Versionen sind festgelegt und reproduzierbar gepinnt.

Das Leitprinzip bleibt unverändert:

> Der Agent erzeugt Änderungen. Die Pipeline überprüft sie.

## 2. Aktueller Status

| Bereich                       | Status         | Nachweis                                        |
| ----------------------------- | -------------- | ----------------------------------------------- |
| Repository und App            | abgeschlossen  | Next.js-App auf `main`                          |
| Architektur und Agentenregeln | abgeschlossen  | `AGENTS.md`, Architektur-Dokumentation und ADRs |
| Lokale Quality Gates          | abgeschlossen  | `pnpm check`                                    |
| GitHub Governance             | abgeschlossen  | Templates und Ruleset für `main`                |
| CI Quality                    | abgeschlossen  | GitHub-Actions-Job `quality`                    |
| CI Security                   | abgeschlossen  | GitHub-Actions-Job `security`                   |
| DEV-Deployment                | abgeschlossen  | Cloudflare Worker `agentic-webapp-dev`          |
| DEV Smoke Test                | abgeschlossen  | erfolgreicher Test gegen die Deployment-URL     |
| PROD-Deployment               | zurückgestellt | bewusste Scope-Entscheidung                     |
| Feature Proof of Concept      | offen          | nächster umsetzbarer Schritt                    |

Die Phase-1-Infrastruktur ist damit im reduzierten DEV-Scope abgeschlossen. Der ursprüngliche vollständige V2-Scope ist nicht vollständig erfüllt, weil PROD bewusst fehlt. Der nächste Lernnachweis ist ein echtes Anwendungsfeature, das den eingerichteten Prozess vollständig bis DEV durchläuft.

## 3. Projektziel

Das Repository ist ein Lern- und Testprojekt für kontrollierte agentische Softwareentwicklung. Ein Coding Agent darf klar abgegrenzte Aufgaben bearbeiten, aber nicht die unabhängigen Prüfungen oder menschlichen Kontrollpunkte ersetzen.

Der aktuell funktionierende Pfad lautet:

```text
GitHub Issue
  -> Coding Agent
  -> Task Branch
  -> Pull Request
  -> unabhängige CI
  -> geschützter Merge nach main
  -> automatische DEV-Bereitstellung
  -> Smoke Test gegen DEV
```

Der Coding Agent bleibt austauschbar. GitHub, reproduzierbare Befehle und die Pipeline bilden die stabilen Systemgrenzen.

## 4. Implementierte Architektur

Die Anwendung ist ein modularer Monolith in einem Repository und einem deploybaren Artefakt.

```text
Browser
  -> Next.js App Router
  -> Page Composition in src/app
  -> öffentliche Feature-Schnittstelle
  -> Feature-Komponenten und -Logik
```

Verbindliche Grenzen:

- `src/app` enthält Routing, Layout und Page Composition.
- `src/features/<feature>` besitzt fachliche Komponenten, Logik und Tests.
- Andere Bereiche verwenden ein Feature über dessen `index.ts`.
- `src/components` ist für tatsächlich geteilte UI- oder Layout-Komponenten reserviert.
- `src/lib` ist nur für wirklich geteilte technische Hilfen vorgesehen.
- System- und Deploymenttests liegen unter `tests`.
- Neue Schichten, Services oder Infrastruktur werden nur bei einem konkreten Bedarf ergänzt.

## 5. Tatsächliche Repository-Struktur

```text
agentic-webapp/
├── .github/
│   ├── ISSUE_TEMPLATE/
│   │   ├── bug.yml
│   │   ├── config.yml
│   │   └── feature.yml
│   ├── workflows/
│   │   ├── ci.yml
│   │   └── deploy-dev.yml
│   └── pull_request_template.md
├── docs/
│   ├── architecture/
│   │   ├── decisions/
│   │   │   ├── ADR-001-modular-monolith.md
│   │   │   └── ADR-002-cloudflare-workers-static-assets.md
│   │   └── phase-1.md
│   └── development/
│       ├── deployment.md
│       ├── github-governance.md
│       ├── local-setup.md
│       └── workflow.md
├── src/
│   ├── app/
│   ├── features/home/
│   └── test/setup.ts
├── tests/smoke/dev.mjs
├── AGENTS.md
├── PROJECT_STATE_V3.md
├── README.md
├── next.config.ts
├── package.json
├── pnpm-lock.yaml
├── pnpm-workspace.yaml
├── tsconfig.json
├── vitest.config.mts
└── wrangler.jsonc
```

Leere Zielordner werden weiterhin nicht vorsorglich erzeugt.

## 6. Verbindlicher Technologiestack

| Bereich          | Implementierte Entscheidung                   |
| ---------------- | --------------------------------------------- |
| Web-Framework    | Next.js `16.3.5`, App Router                  |
| UI Runtime       | React und React DOM `19.2.8`                  |
| Sprache          | TypeScript im Strict Mode                     |
| Node.js          | `24.19.0` über `.nvmrc`                       |
| Package Manager  | pnpm `11.19.0`                                |
| Linting          | ESLint 9                                      |
| Formatierung     | Prettier `3.9.6`                              |
| Tests            | Vitest `4.1.11` mit jsdom und Testing Library |
| CI/CD            | GitHub Actions                                |
| Secret Scan      | Gitleaks Action                               |
| Dependency Audit | `pnpm audit --audit-level high`               |
| DEV Hosting      | Cloudflare Workers Static Assets              |
| Deployment CLI   | Wrangler `4.131.2`                            |
| E2E              | noch nicht eingeführt                         |

Abhängigkeiten und Actions werden bewusst gepinnt oder über das Lockfile reproduzierbar aufgelöst. Wrangler ist als Development Dependency installiert, damit die Deployment-Action keine unkontrollierte Laufzeitinstallation ausführt.

## 7. Standardisierte Befehle

| Befehl                | Zweck                                 |
| --------------------- | ------------------------------------- |
| `pnpm dev`            | lokale Entwicklung                    |
| `pnpm format`         | unterstützte Dateien formatieren      |
| `pnpm format:check`   | Formatierung prüfen                   |
| `pnpm lint`           | ESLint ausführen                      |
| `pnpm typecheck`      | TypeScript ohne Ausgabe prüfen        |
| `pnpm test`           | Vitest einmal ausführen               |
| `pnpm build`          | statischen Produktions-Build erzeugen |
| `pnpm check`          | alle lokalen Quality Gates ausführen  |
| `pnpm test:smoke:dev` | bereitgestellte DEV-URL prüfen        |

`pnpm check` bleibt die einheitliche Prüfschnittstelle für Mensch, Agent und CI:

```text
format:check -> lint -> typecheck -> test -> build
```

## 8. GitHub-Arbeitsprozess

Jeder Coding-Task folgt diesem Vertrag:

1. GitHub Issue mit Ziel, Akzeptanzkriterien und `Out of Scope`;
2. genau ein kurzlebiger Branch, zum Beispiel `agent/42-dark-mode`;
3. Umsetzung ausschließlich innerhalb des Issue-Scopes;
4. relevante Tests und lokale Checks;
5. Conventional Commit;
6. genau ein Pull Request mit `Closes #<issue>`;
7. unabhängige CI-Prüfung;
8. Merge nur nach erfolgreichen erforderlichen Checks;
9. erneute CI auf dem resultierenden `main`-Commit;
10. automatischer DEV-Deploy und Smoke-Test.

Direkte Pushes nach `main`, Force Pushes, Umgehung der CI und autonome PROD-Freigaben bleiben verboten.

## 9. CI und Security

`.github/workflows/ci.yml` läuft bei Pull Requests gegen `main` und bei Pushes auf `main`.

Der Job `quality` führt aus:

- Installation mit `pnpm install --frozen-lockfile`;
- das vollständige `pnpm check` einschließlich Produktions-Build.

Der Job `security` führt aus:

- Gitleaks gegen die vollständige Git-Historie;
- Dependency Audit ab Schweregrad `high`.

Actions verwenden minimale Workflow-Berechtigungen und sind auf konkrete Commit-SHAs gepinnt. Fehlgeschlagene Prüfungen werden nicht übersprungen oder abgeschwächt.

## 10. DEV-Deployment

Nach erfolgreicher CI für `main` startet `.github/workflows/deploy-dev.yml` über `workflow_run`.

Der Workflow:

1. prüft den exakt verifizierten Commit aus;
2. installiert aus dem Lockfile;
3. erzeugt den statischen Next.js-Export in `out/`;
4. deployt die Assets mit Wrangler;
5. verwendet das GitHub Environment `development`;
6. prüft die zurückgegebene URL mit einem Remote-Smoke-Test.

Aktueller DEV-Endpunkt:

<https://agentic-webapp-dev.tr-config-place.workers.dev>

Erster vollständig erfolgreicher Deploy-Nachweis:

- Datum: 15. September 2026;
- Merge-Commit: `26be83d2a201f96358268ed16329ef80070c91b5`;
- Cloudflare Worker: `agentic-webapp-dev`;
- Worker-Version: `5e13cfa8-964f-4d21-9f9a-7bb3418d7dc0`;
- Ergebnis: Build, Upload, Deployment und Smoke-Test erfolgreich.

Der Smoke-Test verlangt:

- HTTPS außerhalb von localhost;
- erfolgreichen HTTP-Status;
- Content-Type `text/html`;
- ein HTML-Dokument im Response Body.

## 11. Cloudflare-Konfiguration

GitHub speichert im Environment `development`:

- `CLOUDFLARE_API_TOKEN`;
- `CLOUDFLARE_ACCOUNT_ID`.

Die Werte werden nie committed oder ausgegeben. Der API-Token ist auf das beabsichtigte Cloudflare-Konto begrenzt und benötigt für den Assets-Upload:

```text
Developer Platform -> Workers Scripts (Legacy) -> Edit
```

Die Cloudflare API bezeichnet diese Berechtigung als `Workers Scripts Write`. Die moderne Rolle `Workers -> Editor` allein reicht für den von Wrangler verwendeten Assets-Upload-Endpunkt nicht aus.

DEV- und zukünftige PROD-Zugangsdaten dürfen nicht wiederverwendet werden.

## 12. PROD-Entscheidung

Das in V2 geplante PROD-Deployment wurde nicht implementiert. Diese Entscheidung ist bewusst und gilt nicht als technischer Fehler.

Aktueller Status:

- kein `deploy-prod.yml`;
- keine autonomen Produktionsdeployments;
- keine Produktions-Credentials im DEV-Workflow;
- PROD bleibt ein späterer, separat zu genehmigender Task.

Wenn PROD später umgesetzt wird, gelten weiterhin:

- separates GitHub Environment `production`;
- getrennte Cloudflare-Credentials;
- explizite menschliche Freigabe;
- Deployment nur eines zuvor durch CI geprüften Commits;
- eigener PROD-Smoke-Test.

## 13. Bekannte Einschränkungen

- Die Anwendung ist aktuell ein statischer Export. Server-seitige Next.js-Funktionen erfordern eine neue Architekturentscheidung.
- Es gibt noch keinen Browser-E2E-Test mit Playwright.
- Der Smoke-Test prüft Erreichbarkeit und HTML-Struktur, aber noch keinen fachlichen Benutzerfluss.
- Es gibt noch kein echtes, nachträglich hinzugefügtes Feature als agentischen Abnahmetest.
- PROD, Monitoring, Rollbacks und Preview Deployments sind nicht umgesetzt.
- Die lokale isolierte Codex-Laufzeit kann bei `next build` mit `uv_resident_set_memory` scheitern. GitHub Actions hat denselben Produktions-Build mehrfach erfolgreich ausgeführt und bleibt dafür die maßgebliche unabhängige Prüfung.

## 14. Weiterhin ausgeschlossener Scope

Ohne neue genehmigte Anforderungen werden nicht eingeführt:

- Microservices, Datenbank oder Queue;
- Kubernetes oder Terraform;
- eigener Agent-Orchestrator oder MCP-Server;
- RAG oder Vector Database;
- automatische Reparatur fehlgeschlagener Builds;
- autonome PROD-Freigabe;
- komplexer Monitoring-Stack;
- zusätzliche Architektur-Schichten ohne konkreten Feature-Bedarf.

## 15. Phase-1-Abnahme im reduzierten Scope

Die technische DEV-Grundlage gilt als abgenommen, weil folgender reale Ablauf erfolgreich nachgewiesen ist:

```text
Issue -> Agentenänderung -> PR -> CI -> Merge -> main-CI
      -> Cloudflare DEV -> Remote-Smoke-Test
```

Die vollständige agentische Feature-Abnahme ist noch offen. Dafür muss ein neues sichtbares Feature nach der bereits bestehenden Infrastruktur vollständig durch denselben Prozess geliefert werden.

Der ursprünglich in V2 vorgesehene PROD-Teil ist kein aktuelles Abnahmekriterium mehr, sondern ein bewusst zurückgestellter späterer Meilenstein.

## 16. Nächster umsetzbarer Schritt

Als erster echter Feature Proof of Concept wird ein persistenter Dark Mode empfohlen.

Der Task soll mindestens beweisen:

- präzises GitHub Issue als Agenten-Contract;
- Feature-Modul unter `src/features/theme`;
- sichtbarer Theme-Schalter;
- persistente Auswahl im Browser;
- Unterstützung von Light und Dark Mode;
- Unit- beziehungsweise Component-Tests;
- erfolgreicher Pull Request und CI;
- automatischer DEV-Deploy;
- erfolgreiche Verifikation auf dem öffentlichen DEV-System.

Nicht Teil dieses ersten Features sind Benutzerkonten, Datenbank-Synchronisierung, PROD-Deployment oder neue Infrastruktur.

## 17. Regeln für weitere Projektstände

V3 ersetzt V2 als aktuelle Baseline, ohne ältere Versionen historisch zu überschreiben. Eine V4 wird erst erstellt, wenn ein weiterer wesentlicher Meilenstein erreicht ist.

Jede neue Version dokumentiert mindestens:

- Änderungen seit der Vorgängerversion;
- tatsächlichen Implementierungs- und Deployment-Stand;
- getroffene und offene Entscheidungen;
- Quality Gates und Security;
- bekannte Einschränkungen und Risiken;
- nächsten konkret umsetzbaren Schritt.

Weitere Chats sollen `PROJECT_STATE_V3.md` als aktuelle Projektquelle verwenden.
