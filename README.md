# 🪟 Windows 11 KB – Täglicher Release Report

Generiert täglich automatisch eine Excel-Datei mit den neuesten Windows 11 Release Notes
(24H2/25H2) per **GitHub Copilot** und verschickt sie per E-Mail.

## Funktionsweise

```
GitHub Actions (täglich, Cron)
    │
    ├─► 1. Neueste KB von support.microsoft.com/de-de/help/5045988 ermitteln
    ├─► 2. KB-Detailseite abrufen
    ├─► 3. Release Notes via GitHub Copilot (Models API / gpt-4o) extrahieren
    ├─► 4. Excel-Datei generieren (farblich nach Rollout-Typ getrennt)
    └─► 5. Excel per SMTP-E-Mail versenden
```

**Kein ANTHROPIC_API_KEY oder sonstiger KI-API-Key nötig!**
Der `GITHUB_TOKEN` ist in Actions automatisch vorhanden.

**Duplikat-Schutz:** E-Mail wird nur gesendet wenn eine neue KB erschienen ist.

---

## Einrichtung (einmalig, ~5 Minuten)

### Schritt 1 – Repository erstellen

Neues **privates** GitHub-Repository anlegen und folgende Dateien hochladen:

```
📁 dein-repo/
├── generate_report.py
├── requirements.txt
├── last_processed_kb.txt    ← leer lassen
└── .github/
    └── workflows/
        └── daily_report.yml
```

### Schritt 2 – GitHub Secrets konfigurieren

Unter **Settings → Secrets and variables → Actions → New repository secret**:

| Secret-Name    | Beispielwert / Beschreibung                     |
|----------------|--------------------------------------------------|
| `SMTP_SERVER`  | `smtp.office365.com`                             |
| `SMTP_PORT`    | `587`                                            |
| `SMTP_USER`    | `dein-name@firma.de`                             |
| `SMTP_PASSWORD`| Dein Passwort oder App-Passwort                  |
| `EMAIL_TO`     | `empfaenger@firma.de` (Komma für mehrere)        |
| `EMAIL_FROM`   | `absender@firma.de` (optional, = SMTP_USER)      |

> Das ist alles! Kein KI-API-Key nötig – GitHub Copilot läuft über den automatischen `GITHUB_TOKEN`.

#### SMTP-Einstellungen je Anbieter

| Anbieter          | SMTP_SERVER              | SMTP_PORT |
|-------------------|--------------------------|-----------|
| Microsoft 365     | `smtp.office365.com`     | `587`     |
| Gmail             | `smtp.gmail.com`         | `587`     |
| GMX               | `mail.gmx.net`           | `587`     |
| web.de            | `smtp.web.de`            | `587`     |

> **Gmail:** App-Passwort erstellen unter Google-Konto → Sicherheit → App-Passwörter.
> **Microsoft 365:** SMTP AUTH im Exchange Admin Center für das Postfach aktivieren.

### Schritt 3 – Uhrzeit anpassen (optional)

In `.github/workflows/daily_report.yml`:

```yaml
schedule:
  - cron: '0 6 * * *'   # 06:00 UTC = 07:00 MEZ / 08:00 MESZ
```

| Gewünschte Zeit (MEZ) | Cron            |
|-----------------------|-----------------|
| 06:00 Uhr             | `0 5 * * *`     |
| 07:00 Uhr             | `0 6 * * *`     |
| 08:00 Uhr             | `0 7 * * *`     |
| Mo–Fr 07:00 Uhr       | `0 6 * * 1-5`   |

### Schritt 4 – Actions aktivieren

1. Tab **Actions** im Repository öffnen
2. Warnung bestätigen falls vorhanden
3. Fertig ✅

---

## Manuell testen

1. **Actions** → "Windows KB – Täglicher Release Report"
2. **"Run workflow"** klicken
3. Optional: `force_send = true` → sendet auch wenn keine neue KB

---

## Ausgabe-Excel

| Spalte | Inhalt |
|--------|--------|
| Einsatz (Monat) | MM.JJJJ |
| Einsatz | `Microsoft-ClientPatch` |
| Rollout | `Normal` oder `Gradual` |
| KB-Nummer | z.B. `KB5079391` |
| Betriebssystembuild | z.B. `26200.8116 / 26100.8116` |
| Titel | Kurze Beschreibung |
| Beschreibung | Volltext auf Deutsch |
| Votum Fachbereich | (leer – zur manuellen Befüllung) |
| Testergebnis | (leer – zur manuellen Befüllung) |
| Bemerkung | (leer – zur manuellen Befüllung) |
| Aktiv in: | (leer – zur manuellen Befüllung) |

**Farbcodierung:**
- 🟦 Hellblau = Gradueller Rollout
- 🟩 Hellgrün = Normaler Rollout

---

## Kosten

| Dienst | Kosten |
|--------|--------|
| GitHub Actions | Kostenlos (2.000 Min./Monat bei privaten Repos) |
| GitHub Copilot / Models API | Im GitHub-Token inbegriffen – **kostenlos** |
