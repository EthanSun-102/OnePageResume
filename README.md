# OnePageResume

Build a resume in HTML, print it with `Cmd+P`, and reliably export a clean **one-page A4 PDF**.

OnePageResume is a skill-ready HTML-to-PDF resume system for AI builders who want more than a visual template. It treats **HTML as the authoring layer** and **single-page A4 PDF as the output contract**, then backs that contract with layout rules, fit logic, validation, and eval coverage.

Current repo status:

- skill packaging is complete
- browser-level validation workflow is in place
- eval coverage now protects the most important layout contracts
- release messaging is now in place and the repo is ready for review-oriented polish

---

## Install and integrate

You can use this repository in three different ways:

### 1. Use it as a local HTML resume project

- open `resume.html`
- edit the content directly
- preview in a browser
- export with `Cmd+P`

This is the fastest path if you only want a one-page A4 HTML resume.

### 2. Use it as a locally validated print workflow

Install dependencies:

```bash
npm install
npx playwright install chromium
```

Then run:

```bash
npm run validate:resume
```

This checks that the current HTML still renders as a printable one-page A4 page and emits screenshot / PDF / JSON artifacts.

### 3. Use it as an AI skill source

This repository is structured so `skill/one-page-resume/` can be used as a packaged skill source.

In practice, most users should:

- copy or install `skill/one-page-resume/` into their AI tool's local skills directory, or
- import it using that tool's skill installation workflow

Important note:

- cloning this repository does **not** guarantee automatic skill discovery in every AI runtime
- the exact installation step depends on how Claude Code, Codex, or another skill-capable tool loads local skills

If you are wiring this into a skill-capable AI environment, start from:

- `skill/one-page-resume/SKILL.md`
- `skill/one-page-resume/agents/openai.yaml`

---

## Who this is for now

Right now, this project is most useful for:

- AI builders using Claude Code or Codex to generate or refine resume HTML
- developers who want a reusable one-page A4 resume skill, not just a static template
- anyone trying to make `HTML -> Cmd+P -> PDF` behave predictably for real resume submission

Secondary audience:

- job seekers who are comfortable editing HTML/CSS directly and want print-safe output

---

## Skill pitch

**Trigger this skill when the real requirement is not "make a resume", but "make this resume print as a clean, professional, single-page A4 PDF from HTML."**

- It generates or refines resumes against a fixed A4 print contract, not a generic web layout.
- It preserves project conventions such as print-safe avatar placement, typography roles, and `company｜position / time | location` job headers.
- It includes both browser-level validation and skill-level eval coverage so layout behavior can be checked for regression, not just eyeballed once.

Validation and eval credibility:

- `npm run validate:resume` checks that a concrete HTML file still renders and fits a printable A4 page.
- `skill/one-page-resume/evals/evals.json` checks that the skill still behaves like the same system when invoked later.

---

## The problem

Most modern resume builders solve one side of the workflow, but not both:

- **HTML-based resumes** are flexible and easy to customize, but printing them to PDF is often unstable.
- **Traditional PDF resumes** are easy to send and print, but hard to edit, iterate, or generate programmatically.
- When people export HTML to PDF with `Cmd+P`, the result often breaks in subtle ways:
  - content spills onto a second page
  - spacing looks too loose or too cramped
  - different sections break awkwardly across pages
  - the page feels visually empty even when the content is strong
  - small content edits ruin the layout

For resumes, this matters more than it does for most documents.

A resume is usually expected to be:

- printable
- easy to scan
- visually balanced
- dense, but still readable
- delivered as a **single-page PDF** in many real interview workflows

The core pain point is not just “generate a resume.”

The real pain point is:

> How do you use HTML as the authoring layer, while guaranteeing that printing to PDF gives you a clean, attractive, single-page A4 resume?

That is the problem this project is trying to solve.

---

## What this project is trying to do

OnePageResume treats **HTML as the source of truth** and **A4 PDF as the output contract**.

The goal is to make this workflow stable:

1. Write or generate resume content
2. Render it as structured HTML
3. Apply print-aware layout rules
4. Use `Cmd+P`
5. Export a PDF that is still **one page, A4, and visually complete**

This project is especially useful for:

- job seekers who want a polished printable resume
- builders who prefer HTML/CSS over closed resume tools
- AI-coding users who want Claude Code or Codex to generate resume pages dynamically
- anyone exploring a reusable “resume generation skill” instead of a one-off template

---

## Design principles

This project is built around a few strong constraints.

### 1. A4 is a hard requirement

The final output should be designed for **A4 portrait**, not “responsive web first, print later.”

That means:

- page size is fixed
- printable height is treated as a hard boundary
- layout decisions are made against real print space
- the resume should survive `Cmd+P` without manual repair

### 2. One page is the default contract

This project assumes the most common real-world resume expectation:

- one page
- printable PDF
- readable on screen and on paper

If content does not fit, the system should try to adapt layout before giving up.

### 3. Spacing should flex before typography collapses

When content is slightly too long, the layout should not immediately make text tiny.

A better order is:

1. reduce section spacing
2. reduce bullet spacing
3. tighten line-height slightly
4. reduce font size in a controlled range
5. only then consider stronger content compression

This preserves readability while still respecting the one-page constraint.

### 4. The page should feel full, not merely valid

A resume that technically fits on one page can still look bad.

This project optimizes for a more useful target:

- not overflowing
- not underfilled
- not visually sparse
- not excessively compressed

The goal is a page that feels **balanced, intentional, and interview-ready**.

### 5. HTML should remain human-editable

The output should still be understandable and editable by humans.

This is not meant to be an opaque rendering pipeline. It should be possible to:

- tweak content manually
- edit CSS rules directly
- swap templates
- plug the system into AI generation workflows

---

## Solution approach

OnePageResume is not just a static template. It is moving toward a **constraint-driven resume layout system**.

The solution has three layers.

### Layer 1: Structured resume content

Resume content should be expressible as structured data, not only handwritten HTML.

Examples:

- name / title / contact
- education
- experience
- achievements
- skills

This makes it easier for:

- AI tools to generate resumes programmatically
- templates to stay reusable
- validation to happen before rendering
- future multi-template support

### Layer 2: Print-aware HTML template

The HTML template should be explicitly designed for printing.

That includes:

- `@page { size: A4 portrait; ... }`
- print-specific spacing rules
- section-level page-break protection
- predictable type scale
- safe image sizing
- screen and print styles that do not fight each other

The template should be good enough that many resumes already print correctly without extra work.

### Layer 3: Fit-to-page adjustment rules

This is the key differentiator.

If the content is slightly too short or too long, the system should adapt.

Possible strategies:

- shrink spacing when content overflows
- enlarge spacing slightly when content underfills the page
- tighten line height within a safe range
- adjust font sizes within controlled lower/upper bounds
- compress overly verbose bullets
- preserve readability and section hierarchy throughout

This makes the system more than a template.
It becomes a repeatable **HTML → one-page A4 PDF** workflow.

---

## Why this is useful in the AI coding era

AI tools are already good at generating resume content and HTML structure.

What they are less reliable at is the final mile:

- making the layout printable
- keeping the output to one page
- preserving A4 constraints
- balancing density and readability

That makes resume generation a good fit for a reusable skill.

A future skill based on this project should be able to:

- accept structured resume input
- generate a printable HTML page
- apply A4-safe layout rules
- dynamically adjust density
- output a page that is ready for `Cmd+P` export

In other words:

> let Claude Code or Codex generate the resume, but enforce print-quality constraints automatically.

---

## Project structure

Current structure:

```text
OnePageResume/
├── package.json
├── README.md
├── resume.html
├── assets/
│   ├── images/
│   ├── pdf/
│   └── README.md
├── docs/
│   ├── resume-layout-spec.md
│   └── skill-rationale.md
├── examples/
│   ├── input/
│   │   └── sample.resume.json
│   └── output/
│       └── README.md
├── schema/
│   └── resume.schema.json
├── scripts/
│   ├── check-resume-preview.mjs
│   └── README.md
├── skill/
│   ├── SKILL_DRAFT.md
│   └── one-page-resume/
│       ├── SKILL.md
│       ├── agents/
│       │   └── openai.yaml
│       ├── assets/
│       │   └── base-resume.html
│       ├── evals/
│       │   └── evals.json
│       ├── references/
│       │   ├── input-format.md
│       │   ├── layout-rules.md
│       │   └── layout-spec.md
│       └── scripts/
│           └── fit-a4.js
└── templates/
    └── README.md
```

## Validation and evals

The project now has two distinct quality layers:

- **Validation workflow**
  - run `npm run validate:resume`
  - run `npm run validate:resume:personal`
  - use Playwright to generate screenshot / PDF / JSON analysis artifacts
  - answers: "does this concrete HTML file still load and fit a printable A4 page?"

- **Skill eval coverage**
  - see [skill/one-page-resume/evals/evals.json](/Users/ethansun/Desktop/小项目/OnePageResume/skill/one-page-resume/evals/evals.json)
  - covers avatar print placement, `company｜position / time | location`, mixed Chinese-English typography, and high-risk overflow scenarios
  - answers: "if the skill is invoked again later, are the most important layout contracts still being preserved?"

In short:

- validation checks whether the current page still works
- evals check whether the skill still behaves like the same system

### What each part is for

- `README.md`  
  Problem statement, project positioning, workflow, and roadmap.

- `package.json`  
  Local validation workflow entrypoints such as `npm run validate:resume`.

- `resume.html`  
  Current working HTML resume page and print prototype.

- `docs/resume-layout-spec.md`  
  The binding HTML, typography, print, and density spec for AI-generated resumes.

- `docs/skill-rationale.md`  
  Human-readable explanation for why the layout spec is defined this way.

- `examples/input/`  
  Structured sample resume data for testing generation workflows.

- `examples/output/`  
  Generated examples, including future HTML/PDF outputs.

- `schema/`  
  Input schema for structured resume content.

- `scripts/`  
  Local validation helpers and usage notes for preview checks.

- `skill/one-page-resume/SKILL.md`  
  The formal Claude skill entry point.

- `skill/one-page-resume/agents/openai.yaml`  
  UI-facing metadata for skill lists, chips, and default invocation.

- `skill/one-page-resume/assets/base-resume.html`  
  The stable template that Claude should start from when generating a resume page.

- `skill/one-page-resume/references/layout-spec.md`  
  The packaged skill's normative layout contract and precedence rules.

- `skill/one-page-resume/scripts/fit-a4.js`  
  The rule-based one-page A4 fitting engine for overflow and underfill adjustment.

- `skill/one-page-resume/references/`  
  Supporting reference files for input format and layout rules.

- `skill/one-page-resume/evals/evals.json`  
  Starter evaluation prompts for testing the skill.

---

## How Claude should use these files

If you are wiring this project into a packaged skill or asking Claude Code to generate a resume from this repo, use the files in this order:

1. Read `skill/one-page-resume/SKILL.md` first.  
   This is the packaged skill entry point and the first file that should orient the workflow.

2. Read `skill/one-page-resume/references/layout-spec.md` next.  
   This is the normative layout contract for the packaged skill. It defines the required DOM structure, class names, font roles, header rules, print rules, fit order, and success criteria.

3. Read `skill/one-page-resume/assets/base-resume.html`.  
   This is the canonical starting template. Reuse its structure and placeholders instead of inventing a new layout. In particular, keep the avatar as a locked top-right component with a stable print-friendly size unless the user explicitly asks to redesign it.

4. Read `skill/one-page-resume/scripts/fit-a4.js`.  
   This file explains and implements the adjustment order for fitting content onto one printable A4 page.

5. Use `schema/resume.schema.json` and `examples/input/sample.resume.json` to understand the expected input shape when those repo files are available.

6. Use `docs/resume-layout-spec.md` and `docs/skill-rationale.md` only when you need project-level background or historical rationale, not the packaged skill's primary contract.

In short:

- `SKILL.md` defines the entrypoint
- `skill/one-page-resume/references/layout-spec.md` defines the packaged rules
- `base-resume.html` defines the starting shape
- `fit-a4.js` defines how the page adapts

If there is any conflict, prioritize:

1. `skill/one-page-resume/SKILL.md`
2. `skill/one-page-resume/references/layout-spec.md`
3. `base-resume.html`
4. `fit-a4.js`

Claude should prefer editing existing compliant files over generating new structure from scratch.

---

## How to use it right now

This project is no longer just an idea or loose prototype. The core skill packaging, validation workflow, and eval coverage are already in place.

### Option 1: Edit the HTML directly

1. Open `resume.html`
2. Replace the content with your own resume information
3. Open the file in a browser
4. Press `Cmd+P`
5. Export to PDF
6. Check whether it fits a single A4 page cleanly

### Option 2: Use structured data as input

1. Start from `examples/input/sample.resume.json`
2. Define your resume content in structured form
3. Use the schema in `schema/resume.schema.json` as a guide
4. Render that content into HTML manually or with an AI tool
5. Print to PDF from the browser

### Option 3: Run the local validation workflow

1. Run `npm install`
2. Run `npx playwright install chromium`
3. Run `npm run validate:resume`
4. Inspect the generated screenshot, PDF, and JSON report in `/tmp/onepageresume-check`

---

## Intended workflow

The long-term workflow for this project is:

1. Prepare resume content as structured input
2. Generate HTML from a template
3. Run fit-to-page rules
4. Preview in browser
5. Export to single-page A4 PDF

For AI-assisted workflows, the goal is:

1. User provides resume content
2. Claude Code or Codex generates HTML
3. The system applies print constraints automatically
4. The user exports a final one-page A4 PDF

---

## What “good” output means here

A successful output is not just “a PDF exists.”

A successful output should meet these standards:

- exactly one A4 page
- looks intentional on screen and in print preview
- no awkward page breaks
- no giant empty whitespace blocks
- no unreadably tiny text
- strong visual hierarchy
- content density feels professional

---

## Roadmap

### Completed foundation

- [x] package the skill so core rules live under `skill/one-page-resume/`
- [x] provide a stable base template and fit-to-page script
- [x] add browser-level validation with screenshot / PDF / JSON outputs
- [x] add eval coverage for avatar placement, job-head format, typography, and one-page overflow risk

### Next release polish

- [ ] add stronger output examples or preview artifacts
- [ ] polish public-facing descriptions of scope, validation, and limitations
- [ ] decide what to publish as the first public-facing release slice

### Future expansion

- [ ] expand example coverage and structured input variants
- [ ] support multiple one-page resume styles under the same A4 contract
- [ ] improve public release assets for easier adoption

---

## Who this project is for

This project may be a good fit if you:

- want full control over resume layout
- prefer HTML/CSS over closed resume builders
- need a resume that prints cleanly to PDF
- want to generate resumes with AI but still care about print quality
- believe the final mile of formatting is part of the product, not an afterthought

---

## Non-goals

At least for now, this project is **not** trying to be:

- a full applicant tracking system optimizer
- a multi-page academic CV builder
- a generic website-to-PDF exporter
- a drag-and-drop WYSIWYG resume editor

The focus is narrower and more practical:

> build a reliable path from HTML to a strong single-page A4 PDF resume.

---

## Contributing

This project is still being shaped from a concrete user pain point.

Useful contributions may include:

- better one-page resume templates
- print CSS improvements
- safer A4 fitting heuristics
- overflow/underfill adjustment logic
- structured input formats
- test cases across different browsers and content lengths

---

## Current status

This repository is now in a **skill-ready, release-polish phase**.

What is already true:

- HTML is the editable layer
- A4 PDF is the output contract
- one-page quality is enforced by layout rules, not luck
- validation and eval coverage exist as explicit regression guardrails

What is next:

- public-facing release messaging
- stronger output examples
- final polish for broader reuse
