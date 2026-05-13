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

## Workflow

1. Identify which mode the user needs: generate, refine, or fit.
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

## Primary packaged entrypoint

Treat this skill folder as self-contained.

Read packaged resources in this order:

1. `SKILL.md`
2. `references/layout-spec.md`
3. `assets/base-resume.html`
4. `scripts/fit-a4.js`
5. `references/layout-rules.md`
6. `references/input-format.md`
7. `evals/evals.json`

If these files conflict, prioritize them in that same order.

## Output expectations

When using this skill, aim to produce:

- a printable HTML resume
- A4 portrait print CSS
- section blocks that avoid awkward page breaks
- readable typography with controlled density
- a result that is likely to export as a single-page PDF via Cmd+P

## Working with project files

Use packaged skill resources first:

- Read `references/layout-spec.md` as the normative layout contract.
- Use `assets/base-resume.html` as the canonical starting template.
- Read `scripts/fit-a4.js` before changing density-control behavior.
- Read `references/layout-rules.md` when making layout tradeoffs.
- Read `references/input-format.md` when the user provides mixed or incomplete resume content.
- Read `evals/evals.json` when checking whether a planned change would violate the skill's current regression coverage expectations.

If the surrounding repo also contains local project resources, use them as optional helpers:

- Use `resume.html` or files in `templates/` as a starting point when they already exist.
- Use `schema/resume.schema.json` and files in `examples/input/` to understand expected content structure when available.

Treat repo-root docs as background context only. The packaged skill should not depend on them to understand the main layout contract.

## When to be strict

Be strict about:

- A4 portrait print target
- keeping the resume on one page when reasonably possible
- avoiding unreadably small text
- avoiding loose, empty layouts

## When to ask the user

Ask brief clarifying questions only when needed, such as:

- whether the user wants generation vs refinement
- whether content may be shortened
- whether bilingual output is needed
- whether the resume is for screen review only or actual printing/interview submission

If the user already gave enough context, proceed directly.

## Notes

Do not optimize only for web appearance. Optimize for the HTML-to-PDF path.

A valid result is not just "no overflow". The resume should also look intentional, dense, and printable.
