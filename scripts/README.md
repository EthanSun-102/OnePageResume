# Validation Workflow

This folder contains local validation helpers for the OnePageResume project.

## Commands

Install dependencies first:

```bash
npm install
npx playwright install chromium
```

Run the default validation flow:

```bash
npm run validate:resume
```

Run validation for the personal sample:

```bash
npm run validate:resume:personal
```

Optional preview server:

```bash
npm run preview
```

## Direct script usage

The validation script accepts either a local HTML file or a URL:

```bash
node scripts/check-resume-preview.mjs --input resume.html
node scripts/check-resume-preview.mjs --url http://127.0.0.1:4173/resume.html
node scripts/check-resume-preview.mjs --input resume.html --out-dir /tmp/opr-check
```

## Output artifacts

By default, artifacts are written to:

```text
/tmp/onepageresume-check/
```

Each run emits:

- a screenshot PNG
- a print PDF
- a JSON analysis report

## Current pass criteria

The validation script currently treats a run as passing when:

- the page loads successfully
- a `.resume` root exists
- a `.fit-end-marker` exists
- at least one `.section > h2` exists
- measured used height does not exceed printable A4 height beyond a small tolerance

This is intentionally a workflow-level validation layer. Richer behavioral coverage belongs in the later `Evals And Coverage` phase.
