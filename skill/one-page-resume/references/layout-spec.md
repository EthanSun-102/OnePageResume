# Layout Spec

This file is the **normative layout reference** for the packaged `one-page-resume` skill.

If this skill is used outside the full repo, this file is the source of truth for layout rules. Treat broader repo docs as optional background only.

## Table Of Contents

1. Purpose
2. Output contract
3. Resource order and precedence
4. Required document structure
5. Section and entry rules
6. Header and avatar rules
7. Print page model
8. Typography contract
9. Fit-to-page policy
10. Success criteria

## 1. Purpose

Use this skill to produce or refine a resume that:

- is authored in HTML
- prints as one A4 portrait page
- survives browser `Cmd+P` export to PDF
- stays readable under realistic resume density
- feels full and intentional instead of sparse or collapsed

The output target is not a generic web page. It is a printable one-page A4 resume.

## 2. Output Contract

Unless the user explicitly overrides it, every result should satisfy these rules:

1. Target `A4 portrait`
2. Default to `one printable page only`
3. Optimize for browser print preview and PDF export, not just screen appearance
4. Keep content readable after adjustment
5. Avoid awkward visual breaks inside sections, jobs, and list items
6. Keep the page full but not crowded
7. Treat HTML as the editable source of truth and PDF as the delivery format

If screen styling and print quality conflict, prioritize print quality.

## 3. Resource Order And Precedence

Use the packaged skill resources in this order:

1. `SKILL.md`
2. `references/layout-spec.md`
3. `assets/base-resume.html`
4. `scripts/fit-a4.js`
5. `references/layout-rules.md`
6. `references/input-format.md`

When rules conflict, prioritize them in that same order.

If the surrounding repo also contains `schema/` or `examples/`, use them as optional input aids. They are useful, but they are not required for understanding the packaged skill.

## 4. Required Document Structure

Prefer this top-level structure:

```html
<body>
  <main class="resume">
    <header class="header">...</header>
    <div class="content">
      <section class="section section-education">...</section>
      <section class="section section-experience">...</section>
      <section class="section section-projects">...</section>
      <section class="section section-skills">...</section>
    </div>
  </main>
</body>
```

Required structural classes:

- `resume`
- `header`
- `header-top`
- `header-main`
- `name`
- `subtitle`
- `contact`
- `avatar`
- `content`
- `section`
- `job`
- `job-head`
- `job-title`
- `job-meta`
- `company-info`
- `edu-item`
- `edu-main`
- `edu-meta`
- `skills-grid`

Use both the generic `section` class and a semantic section class:

- `section section-education`
- `section section-experience`
- `section section-projects`
- `section section-skills`

Do not flatten the page into loose paragraphs. The template and fit logic depend on stable semantic grouping.

## 5. Section And Entry Rules

Preferred section order:

1. Header / identity
2. Education
3. Experience
4. Projects or internship experience
5. Skills

Entry header pattern:

- left side: `company + position`
- right side: `time + location`

Formatting rules:

- use `｜` between company and position
- use `|` between time and location
- keep company and position in the same visual title row when readable
- do not leave company names in a separate descriptive row when they belong in the main title row

Content density rules:

- do not create empty sections
- merge weak low-value sections before increasing page length
- keep most major roles to `2-4` bullets
- keep secondary project or internship entries to `2-3` bullets when possible

## 6. Header And Avatar Rules

The header should support:

- full name
- role or title line
- one compact contact line
- optional avatar

Preferred order:

1. full name
2. role or title line
3. contact line

Contact rules:

- prefer one compact contact line when space allows
- use short separators such as `·`
- avoid unnecessary line breaks

Do not add a redundant target-role row if the title already communicates the direction.

Avatar rules:

- avatar is optional
- avatar must not dominate the header
- avatar must use a fixed box and `object-fit: cover`
- avatar must remain pinned to the top-right in print
- responsive screen rules must not pull avatar back into normal flow during print

Preferred locked default:

- width: `20mm`
- height: `26mm`
- ratio close to `3:4`

Treat avatar resizing as a last resort, not a default density knob.

## 7. Print Page Model

Required print baseline:

```css
@page {
  size: A4 portrait;
}
```

Assume:

- A4 portrait
- browser print preview
- direct PDF export from `Cmd+P`

Recommended print margins:

- safe range: `5mm` to `10mm`
- preferred default: `6mm`

In print mode, `.resume` should:

- remove decorative shadow
- avoid print-hostile border or rounded-corner dependency
- expand to the printable width
- avoid accidental clipping from `overflow: hidden` unless deliberately used

Use print protection rules such as:

- `break-inside: avoid`
- `page-break-inside: avoid`

Apply them to sections, jobs, and list items where appropriate.

## 8. Typography Contract

Typography is role-based.

### 8.1 Chinese section titles

Use Songti-style serif for major section titles and similar high-level labels.

Recommended stack:

```css
font-family: "Songti SC", "STSong", "SimSun", serif;
```

### 8.2 Chinese descriptive body text

Use Kaiti-style serif for descriptive Chinese body text such as bullets and explanatory lines.

Recommended stack:

```css
font-family: "Kaiti SC", "STKaiti", "KaiTi", serif;
```

### 8.3 Latin text and numerals

Use Times New Roman for English text and numerals.

Recommended stack:

```css
font-family: "Times New Roman", "Times", serif;
```

Apply this to:

- English words
- dates and date ranges
- percentages
- money amounts
- phone numbers
- email addresses
- URLs and social handles
- English names or titles inside Chinese-led lines

### 8.4 Mixed-script rule

Do not assume the browser will automatically switch embedded English or numbers to the Latin font if the parent is already assigned a Chinese font.

Wrap Latin fragments explicitly:

```html
<span class="latin">2025.03 – Present</span>
```

Recommended helper rule:

```css
.latin {
  font-family: "Times New Roman", "Times", serif;
}
```

### 8.5 Safe size guidance

Use these as guardrails, not absolutes:

- name: `18pt` to `24pt`
- section headings: `11pt` to `14pt`
- body text: `9pt` to `11pt`
- metadata text: `8.5pt` to `10pt`
- line-height: about `1.35` to `1.55`

Avoid shrinking body text below a comfortable reading floor just to force a fit.

## 9. Fit-To-Page Policy

Apply A4 constraints before making content edits.

If content slightly overflows, tighten layout in this order:

1. section spacing
2. bullet spacing
3. metadata or local spacing
4. line-height
5. font size
6. content compression only if layout-only adjustment is insufficient and allowed

If the page is clearly underfilled:

1. increase spacing slightly
2. increase line-height slightly
3. increase typography slightly only after spacing still feels too tight

Keep these principles:

- preserve hierarchy
- preserve readability
- move whitespace before shrinking type
- do not use avatar resizing as the normal fit strategy

If content compression becomes necessary:

- shorten verbose company summaries first
- merge repetitive skills
- keep the highest-impact bullets with metrics and outcomes
- remove lower-value wording before shrinking typography further

## 10. Success Criteria

A successful result is not just “fits on one page.”

It should also:

- export as one clean A4 page
- feel visually balanced in print preview
- avoid awkward internal breaks
- avoid giant empty whitespace blocks
- avoid unreadably small text
- preserve clear hierarchy between title, metadata, and body
- remain editable as ordinary HTML
