---
name: one-page-resume
description: "Generate or refine a printable one-page A4 HTML resume from resume notes, structured JSON, or an existing HTML file. Use this whenever the real goal is a reliable HTML-to-PDF resume workflow: build a resume in HTML, export with Cmd+P, fit exactly one A4 page, or preserve a print-safe single-page layout contract."
---

# One Page Resume

Use this skill when the user's real goal is not just "write a resume", but "get a resume that prints cleanly as a single A4 PDF from HTML, with the same layout rules preserved every time."

## What this skill does

This skill helps Claude produce or refine a resume that satisfies these constraints:

- HTML is the editable source
- the printable target is A4 portrait
- the output should fit on one page by default
- the page should feel visually full, not sparse or collapsed
- print quality matters as much as screen appearance
- the result should preserve the packaged layout contract instead of inventing a new resume style on each run

This skill supports three common modes:

1. **Generate from content**
   The user provides resume notes, bullets, or structured data and wants a printable HTML resume.

2. **Refine existing HTML**
   The user already has a resume HTML file and wants it to print better.

3. **Fit to one page**
   The user wants to keep content mostly intact but needs layout adjustments so the result prints as one clean A4 page.

## Output path contract

The output file is always written to the user's Desktop:

- Default output path: `~/Desktop/resume.html`
- If the user specifies a filename: `~/Desktop/<filename>.html`
- If `~/Desktop/resume.html` already exists: overwrite it directly
- Always state the output path in the first reply and proceed immediately — do not ask for confirmation

Never write to the project directory or any other path unless the user explicitly overrides this.

## Clarifying questions

Before generating, ask the user the following questions in a single message. Explain why each question matters so the user understands the tradeoff:

1. **Mode** — "Are you generating a resume from scratch, refining an existing HTML file, or just fitting existing content to one page? This determines which template and rules I start from."
2. **Content source** — "Please paste your resume content (notes, bullets, or existing HTML). The more complete this is, the less back-and-forth we need."
3. **Language** — "Should the resume be in Chinese, English, or bilingual? This affects font rules and layout density."
4. **Avatar** — "Do you want to include a photo? If yes, please provide the image path. If no, the header will be text-only."
5. **Print vs screen** — "Is this for actual printing / PDF submission, or mainly for screen review? Print mode applies stricter A4 constraints."

If the user's initial message already answers some of these, skip those questions and only ask the remaining ones. If all are answered, skip this step entirely and proceed directly to generation.

## Fast path

If the user's input is complete (content provided + mode is clear + language is clear), skip all clarifying questions and:

1. State the output path (`~/Desktop/resume.html`) in the first reply
2. Generate the full resume in one pass
3. Write the file
4. End with export instructions (Cmd+P settings)

## Workflow

1. Identify which mode applies: generate, refine, or fit.
2. If the user already has an HTML resume, prefer editing that file over creating a new one.
3. If the user provides raw content, structure it into sections such as basics, education, experience, and skills before generating HTML.
4. In job headers, prefer the project convention: left side is `company + position`, right side is `time + location`. Use `｜` between company and position, and `|` between time and location.
5. Treat the header as a designed information block: avoid redundant target-role rows when the title already communicates direction, prefer one compact contact line when space allows, and keep the avatar aligned with the three main text lines instead of letting it stretch the header. In print mode, the avatar must remain fixed to the top-right of the header and must not fall back into normal flow because of responsive rules.
6. Treat the avatar as a locked component once it looks right: default to a restrained top-right portrait size around `20mm × 26mm`, and do not keep resizing it during ordinary content edits unless the user explicitly asks.
7. Apply A4 print constraints first.
8. If the content is close to overflowing, tighten layout in this order:
   - reduce section spacing
   - reduce bullet spacing
   - tighten line-height slightly
   - reduce font size within safe bounds
9. If the page is clearly underfilled, slightly increase spacing before increasing font size.
10. Preserve visual hierarchy and readability throughout.
11. Apply font roles strictly: Chinese section titles use Songti-style serif, Chinese descriptive text uses Kaiti-style serif, and English text plus numerals use Times New Roman. When English appears inside a Chinese-styled element, wrap the English fragment in `.latin` instead of relying on automatic browser fallback.
12. Tell the user how to export with Cmd+P and what to check in print preview.

## Minimum read set by mode

Load only what the current task requires:

**Generate mode:**
- Required: `references/layout-spec.md`, `assets/base-resume.html`
- Load if content is incomplete or ambiguous: `references/input-format.md`

**Refine / layout mode:**
- Required: `references/layout-spec.md`
- Load if making layout tradeoffs: `references/layout-rules.md`

**Fit to one page / density adjustment:**
- Required: `references/layout-spec.md`, `scripts/fit-a4.js`

**Regression check only:**
- Load `evals/evals.json` only when verifying that a planned change does not break existing passing cases. Do not load it in the main generation path.

If files conflict, resolve by this priority order: `SKILL.md` → `layout-spec.md` → `base-resume.html` → `fit-a4.js` → `layout-rules.md` → `input-format.md` → `evals.json`.

## Working with project files

If the surrounding repo also contains local resources, use them as optional helpers only:

- Use files in `templates/` as a secondary starting point when they exist
- Use `schema/resume.schema.json` and files in `examples/input/` to understand content structure when available

Treat repo-root docs as background context only. The packaged skill does not depend on them for the main layout contract.

## When to be strict

Be strict about:

- A4 portrait print target
- keeping the resume on one page when reasonably possible
- avoiding unreadably small text
- avoiding loose, empty layouts
- always writing output to `~/Desktop/`

## Notes

Do not optimize only for web appearance. Optimize for the HTML-to-PDF path.

A valid result is not just "no overflow". The resume should also look intentional, dense, and printable.
