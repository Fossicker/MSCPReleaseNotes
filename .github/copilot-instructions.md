# Copilot instructions for MSCPReleaseNotes

## Commands

| Purpose | Command | Notes |
| --- | --- | --- |
| Install dependencies | `npm install` | Used by `.github/workflows/mail.yml` before the mail script runs. |
| Run the mail script locally | `node .github/scripts/send-email.mjs` | Requires `GMAIL_APP_PASSWORD` to be set in the environment or a local `.env` file because the script imports `dotenv/config`. |
| Run tests | `npm test` | Placeholder only; `package.json` does not define a real test suite yet and this command exits with an error. |

There are currently no build or lint scripts in `package.json`, and there is no implemented single-test command because no real test runner is configured yet.

## High-level architecture

This repository is workflow-driven. The main behavior lives in GitHub Actions plus one Node script under `.github/scripts`, not in an application `src/` tree.

- `.github/workflows/mail.yml` is the operational workflow. It runs on a schedule and via manual dispatch, installs Node dependencies, and executes `.github/scripts/send-email.mjs`.
- `.github/scripts/send-email.mjs` is a standalone ESM script that loads environment variables with `dotenv/config`, creates a Gmail SMTP transporter with `nodemailer`, and sends a single HTML email. The current branch ID, warning window, and recipient are inline placeholders in the script.
- `.github/workflows/copilot.yml` is separate from the mail flow. It installs the GitHub Copilot CLI, asks it to summarize that day's commits into `summary.md`, and appends the result to `$GITHUB_STEP_SUMMARY`.
- `.github/workflows/copilot-setup-steps.yml` prepares future Copilot cloud-agent sessions with the same Node 20 + npm dependency installation path used by the automation workflows.

## Key conventions

- Treat `.github/workflows/*.yml` and `.github/scripts/*.mjs` as the core product code. Changes to automation behavior usually require updating both the workflow definition and the script it invokes.
- Keep workflow secrets in environment variables and GitHub Actions secrets. Existing workflows rely on `GMAIL_APP_PASSWORD` and `PERSONAL_ACCESS_TOKEN`; follow that pattern instead of introducing new hardcoded credentials.
- Follow the current module split: the package is marked `"type": "commonjs"`, but the automation script is intentionally `.mjs` and uses ESM imports. Prefer additional `.mjs` files for workflow scripts unless you are deliberately standardizing the whole repo.
- Preserve the current workflow entry points: both workflows support `workflow_dispatch` in addition to their schedules, so manual execution is part of the expected operating model.
- Keep `.github/workflows/copilot-setup-steps.yml` aligned with the runtime workflows when dependencies or the Node version change, so Copilot sessions see the same environment the automation uses.
- In the Copilot workflow, generated release-note content is first written to `summary.md` and then appended to `$GITHUB_STEP_SUMMARY`. Reuse that pattern if you expand the summary job.
- Project text is mixed German/English. Keep existing user-facing wording and comments consistent with nearby files instead of normalizing the whole repository in one change.
