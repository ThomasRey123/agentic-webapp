# Übergabe an den nächsten Worker

Stand: 11. Oktober 2026 (Europe/Berlin). Diese Übergabe beendet die aktuelle
Coding-Sitzung; es läuft kein weiterer Feature-Auftrag. GitHub ist die Quelle für
den jeweils aktuellen Merge-, Prüf- und Lieferstatus. Historische
`PROJECT_STATE_*`-Dateien ersetzen diese Übergabe nicht.

## Genau hier weiterarbeiten

Der SDD-Pilot „DEV-Link kopieren“ ist unter der revidierten Abnahme geliefert.
Abgeschlossener Anwendungs-/Teststand auf `main`:
`c5755b0a4177cedc9e46253d50312bcbec3a34a2` (Owner-Merge von PR #104).
Vor Erstellung dieser Dokumentationsübergabe waren keine PRs offen.
Diese Übergabe selbst ist eine separate Dokumentationsänderung zu Issue #105;
ihren PR-/Merge-Status vor einem neuen Auftrag live prüfen. Ein Dokumentations-
Merge ist keine neue fachliche Spec-Freigabe.

Der nächste offene Schritt in [Epic #90](https://github.com/ThomasRey123/agentic-webapp/issues/90)
ist eine **kleine für Nutzer sichtbare Folgeänderung am Pilot**. Das konkrete
Verhalten ist noch nicht ausgewählt oder freigegeben. Die Abnahmerevision #102
ersetzt diese Etappe nicht. Danach wird der Nutzen des SDD-Ablaufs bewertet.

1. Aktuelles `main`, offene Issues/PRs und jüngste CI-/DEV-Läufe prüfen; lokale
   Änderungen anderer Aufgaben bewahren. `AGENTS.md`, diese Übergabe,
   [Prioritäten](next-steps.md), den [SDD-Vertrag](spec-driven-development.md)
   und [Pilot-Spec](../specs/copy-dev-link/spec.md) lesen.
2. Einen bereits vorliegenden konkreten Folgeauftrag des Eigentümers verwenden.
   Fehlt dieser, eine kleine sichtbare Änderung mit dem Eigentümer klären;
   nicht eigenständig ein neues Verhalten als genehmigt behandeln.
3. Eigenes Spec-Issue und Spec-only-PR für die betroffenen stabilen
   Anforderungs-IDs erstellen. Noch keine Implementierung. Owner-Merge der Spec
   abwarten; tatsächlichen vollständigen Merge-SHA verwenden.
4. Separates Implementierungs-Issue, neuer Branch und genau ein PR; Plan/Tasks
   aus der freigegebenen Spec ableiten. `pnpm install --frozen-lockfile`,
   `pnpm format`, `pnpm check:pr` ausführen, CI und commitgenaue Vorschau prüfen.
5. Owner-Merge und erfolgreiche Main-CI/DEV-Lieferung dokumentieren. Keine
   eigenen PRs mergen, keine Pflichtprüfungen umgehen, keine PROD-Deployments.

## Verbindliche Nachweise des abgeschlossenen Piloten

| Schritt                     | Owner-Merge                                | Nachweis                                                                                                                                                                                                                                                            |
| --------------------------- | ------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Ursprüngliche Spec #96      | `a4a06bd880135436f5b2856a361c1c59b191d10d` | FR-001–FR-006, Implementierungs-Issue #97                                                                                                                                                                                                                           |
| Anwendung #98               | `1e74554f674cdc8dc9bcf6ebc51cd4bf800bb7b6` | [Main-CI 38150461246](https://github.com/ThomasRey123/agentic-webapp/actions/runs/38150461246), [DEV 38150541965](https://github.com/ThomasRey123/agentic-webapp/actions/runs/38150541965) erfolgreich                                                              |
| Abnahmerevision #102        | `6ddf92ca36d183cca0634237b2800689911172af` | FR-005 revidiert; Main-CI 38152127449 / DEV 38152201961 erfolgreich                                                                                                                                                                                                 |
| Testkorrektur #100          | `d05aaede35544992e2ea4f231785cfef2be8c6e8` | Main-CI 38153522823 / DEV 38153590153 erfolgreich; 11/11 Browserfälle auf DEV                                                                                                                                                                                       |
| Automatisierte Abnahme #104 | `c5755b0a4177cedc9e46253d50312bcbec3a34a2` | [Main-CI 38154391357](https://github.com/ThomasRey123/agentic-webapp/actions/runs/38154391357), [DEV 38154476936](https://github.com/ThomasRey123/agentic-webapp/actions/runs/38154476936) einschließlich Smoke/Bereinigung erfolgreich; 19/19 Browserfälle auf DEV |

PR #100 verhindert, dass das No-JavaScript-Teststub beim Test gegen die stabile
DEV-Adresse bereits die ursprüngliche App-Seite ersetzt. Der Fix ist gemergt;
nicht erneut implementieren. PR #104 ist ebenfalls gemergt, nicht mehr in Review.

Aktuelle Testbasis: 16 Vitest- und 15 Node-Skripttests, statischer Export und
19 Chromium-Fälle. Die acht zusätzlichen axe-Audits prüfen Project links in
light/dark × idle/pending/success/error. Tool: axe-core/Playwright-Adapter 4.13.0;
Tags: `wcag2a`, `wcag2aa`, `wcag21a`, `wcag21aa`. Keine Regeln ausgeschlossen;
keine erkannten Verstöße. Alle acht nach Merge erzeugten DEV-Berichte wurden
in dieser Sitzung geprüft. Pfade und Anforderungszuordnung stehen in
[Tasks/Nachweisen](../specs/copy-dev-link/tasks.md).

**Prüfgrenzen erhalten:** Sechs Kontrastprüfungen für Statusmeldungen bleiben
wegen des Hintergrundverlaufs automatisch unbewertbar. Die vorhandene manuelle
Visual-/Kontrastevidenz ergänzt sie; unvollständige axe-Ergebnisse nicht als
bestanden umetikettieren. Echte hörbare Screenreader-Ansagen wurden nicht getestet
und sind seit Owner-Freigabe #102 optional. Kein Nachweis für vollständige
WCAG-Konformität oder hörbare Interoperabilität.

CI speichert `copy-accessibility-evidence` für sieben Tage, zuletzt Artefakt
`11708510182` im genannten Main-CI-Lauf. Artefakte können ablaufen. Ergebnisse
des lokalen/deployten Browserlaufs und ihre Zusammenfassung bleiben dokumentiert;
bei neuem Verhalten neue Nachweise erzeugen. Der direkte CI-Artefakt-/Logdownload
aus dieser Cloud lieferte HTTP 403; heruntergeladene CI-JSON-Inhalte wurden nicht
unabhängig geprüft. Erfolgreiche Jobs/Upload und GitHub-Metadaten sind geprüft.

## Arbeitsumgebung und Wiederaufnahme

Repository: `ThomasRey123/agentic-webapp`.
DEV: <https://agentic-webapp-dev.tr-config-place.workers.dev/>.
Stack am Übergabestand: Node 24.21.0 (LTS), pnpm 11.19.0, Next.js 16.4.0,
React 19.3.0, Playwright 1.64.0. Versionsdateien/Lockfile vor Verwendung prüfen.
Dependabot läuft wöchentlich; Node-LTS-Updates folgen dem manuellen
[Update-Verfahren](node-updates.md). Keine pauschalen Versions-Upgrades im Feature.

Die veröffentlichte Cloud-Konfiguration mit `*.tr-config-place.workers.dev`
verwenden. Aktuelle Runtime-/Netzwerkbeobachtungen und Authentifizierung neu
prüfen; der letzte Runtime-Status meldete Netzwerkzustand `unknown`, obwohl
GitHub-Aufrufe und die früheren DEV-Tests funktionierten. Eine konfigurierte
Freigabe allein beweist keine aktuelle Erreichbarkeit. Proxy und CA-Vertrauen
beibehalten, keine Credentials auslesen oder TLS-Prüfung deaktivieren.

In dieser Sitzung lagen die Werkzeuge/Caches in `/workspace/.onboarding-tools`
und `/workspace/.onboarding-cache`. Diese Pfade sind sitzungsspezifisch und
keine Voraussetzung für einen frischen Worker. Mit dem veröffentlichten Setup
Werkzeuge installieren; benötigt wird zur Playwright-Version passendes Chromium
(hier 1248). Vorhandene lokale Hilfspfade nur verwenden, wenn sie existieren:

```bash
export PATH=/workspace/.onboarding-tools/node/bin:/workspace/.onboarding-tools/node_modules/.bin:$PATH
export XDG_CACHE_HOME=/workspace/.onboarding-cache
export XDG_DATA_HOME=/workspace/.onboarding-data
export npm_config_store_dir=/workspace/.onboarding-cache/pnpm-store
export PLAYWRIGHT_BROWSERS_PATH=/workspace/.onboarding-cache/ms-playwright
export WRANGLER_LOG_PATH=/workspace/.onboarding-cache/wrangler-logs
export NEXT_TELEMETRY_DISABLED=1
```

Remote-Node-Smoke benötigte in dieser Umgebung die vorhandene System-CA und
den injizierten Proxy:

```bash
NODE_OPTIONS='--use-system-ca --use-env-proxy' DEV_URL=https://agentic-webapp-dev.tr-config-place.workers.dev/ pnpm test:smoke:dev
DEV_URL=https://agentic-webapp-dev.tr-config-place.workers.dev/ pnpm test:e2e:preview
```

Für Remote-Browserläufe `PLAYWRIGHT_LOCAL_SERVER` nicht setzen. Der Eigentümer
hat dauerhaft das Vertrauen der vorhandenen Umgebungs-Proxy-CA samt NSS-Zugriff
freigegeben. Die CA war bereits vertrauenswürdig; der tatsächliche Browserblocker
war der schreibgeschützte NSS-Speicher unter `/home/agent/.pki/nssdb`.
Mit zulässigem NSS-Zugriff und aktiver TLS-Prüfung bestanden die Remote-Läufe.
Das Setup importiert die bereits systemvertrauenswürdige Umgebungs-CA idempotent
und bewahrt vorhandene NSS-Einträge. Keine fremde CA importieren. Sandbox-
Freigaben nicht als automatisch auf neue Sitzungen übertragen behandeln;
bei Bedarf den eng begrenzten Remote-Test-/NSS-Zugriff über den unterstützten
Freigabeweg anfordern und auf die vorhandene Owner-Autorisierung verweisen.

HTTP-403-Zielblockaden separat von CA/NSS-Fehlern diagnostizieren. Insbesondere
der Artefaktdownload ist kein Beleg für einen Ausfall der gesamten GitHub-API.
Keine Proxy-Umgehung, keine Secrets in Logs; Fehlermeldungen mit signierten
Download-URLs nicht ungekürzt ausgeben. Netzwerkänderungen benötigen den
unterstützten Konfigurationsweg.

## Verbleibende Arbeiten

- Epic #90: sichtbare Folgeänderung spezifizieren/liefern, dann Nutzen bewerten.
- [Issue #82](https://github.com/ThomasRey123/agentic-webapp/issues/82): bekannter
  hoher Entwicklungsabhängigkeits-Befund `GHSA-vfj7-8cjw-p6xm` in braces;
  Fix laut Advisory ab 3.0.4, zuletzt nicht veröffentlicht. Registry/Advisory
  erneut prüfen, bevor eine separate Wartungsaufgabe begonnen wird. Kein
  Unterdrücken des Befunds oder ungeprüftes Override.
- Bestehende Pflichtgates `quality`, `browser`, `secret-scan` und sichtbarer
  advisory Dependency-Audit bleiben erhalten. Cloudflare-Tokenprüfung hat der
  Eigentümer als erledigt bestätigt; exakte Rechte wurden von diesem Worker
  nicht unabhängig über die API eingesehen.
- PROD bleibt zurückgestellt. Kein zusätzlicher SDD-CLI-/Orchestrator-Auftrag.

## Starttext für den neuen Worker

> Lies AGENTS.md, docs/development/worker-handoff.md und
> docs/development/next-steps.md. Prüfe aktuellen Main-/PR-/Issue-Status und die
> Nachweise zu #100/#104. Setze Epic #90 am nächsten offenen Schritt fort:
> eine kleine sichtbare Folgeänderung am gelieferten Copy-DEV-Link-Pilot.
> Verwende meinen konkreten Folgeauftrag; fehlt er, kläre das gewünschte
> Verhalten. Erstelle zuerst eine Spec-only-Freigabe und implementiere erst nach
> meinem Spec-Merge separat. Bewahre die dokumentierten Prüfgrenzen und
> menschlichen Merge-/PROD-Grenzen.
