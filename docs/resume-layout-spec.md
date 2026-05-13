# Resume Layout Specification

## 1. Purpose

This document defines the **required HTML architecture, print constraints, and density-adjustment rules** for OnePageResume.

Future AI agents that generate or modify resume HTML for this project must treat this document as a **normative specification**, not as optional guidance.

The goal is not merely to create a valid HTML page. The goal is to create a resume that:

- is authored in HTML
- prints as **one A4 portrait page**
- survives browser `Cmd+P` export to PDF
- feels visually full and balanced
- remains readable under typical real-world resume content density

This specification exists to make the HTML-to-PDF path predictable and reusable.

---

## 2. Non-negotiable output contract

Every generated or modified resume must satisfy these constraints unless the user explicitly overrides them:

1. The printable target is **A4 portrait**.
2. The default output is **one page only**.
3. The result must be designed for **browser print preview and PDF export**, not only screen viewing.
4. The content must remain **readable** after layout adjustment.
5. The layout must avoid visibly awkward page breaks inside semantic blocks.
6. The page should feel **full but not crowded**.
7. HTML remains the editable source of truth; the PDF is the delivery format.

If there is a conflict between screen styling and print quality, prioritize **print quality**.

---

## 3. Supported generation modes

Agents working against this specification must support these three modes:

### 3.1 Generate from raw content

The user provides resume notes, bullets, structured data, or mixed prose.
The agent must:

- normalize content into a resume structure
- generate compliant HTML
- apply print-safe CSS

### 3.2 Refine existing HTML

The user already has a resume HTML file.
The agent must:

- preserve the existing content where practical
- prefer surgical edits over rewrites
- upgrade the file to comply with this spec

### 3.3 Fit existing content to one A4 page

The user wants to keep content mostly unchanged.
The agent must:

- preserve wording and section order as much as possible
- prioritize layout compression before content compression
- only shorten content when layout-only adjustment is insufficient and the user allows it

---

## 4. Required document structure

Generated HTML must use a stable, predictable DOM structure so the page can be reliably styled, adjusted, and maintained.

### 4.1 Required top-level structure

The preferred structure is:

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

### 4.2 Required structural classes

The following class names are required unless a documented project-wide migration changes them:

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

### 4.3 Section class convention

Each semantic section must use both:

- the generic `section` class
- a semantic section class

Examples:

- `section section-education`
- `section section-experience`
- `section section-projects`
- `section section-skills`
- `section section-summary`

This allows both shared styling and targeted overrides.

### 4.4 Content hierarchy

Use the following hierarchy whenever applicable:

- page wrapper: `.resume`
- top identity block: `.header`
- inner printable content wrapper: `.content`
- semantic block: `.section`
- repeatable experience/project entry: `.job`
- entry header row: `.job-head`
- descriptive metadata: `.job-meta`, `.company-info`, `.edu-meta`

Do not flatten everything into plain paragraphs. The layout engine depends on semantic grouping.

### 4.5 Job-head composition pattern

For experience, internship, and project entries, the preferred header pattern is:

- left side: `company + position`
- right side: `time + location`

Preferred examples:

- `某证券机构｜投资银行部助理`
- `某数据科技公司｜Business Development Manager`
- `2025.03 – Present | 多地协同办公`

Rules:

- company and position should be grouped together in the left title block
- use `｜` between company and position in the left block
- time and location should be grouped together in the right meta block
- use `|` between time and location in the right block
- do not split company and position into separate visual rows unless the line length makes the grouped form unreadable
- do not leave the company name in a separate description line if it belongs in the main title row

---

## 5. Required semantic sections

A generated resume should prefer this section order unless the user requests a different order:

1. Header / identity
2. Education
3. Experience
4. Projects or internship experience if applicable
5. Skills

Optional sections:

- summary
- selected projects
- awards
- certifications
- additional information

Rules:

- Do not create empty sections.
- Do not create a section if the content is too weak to justify the visual space.
- If multiple low-value sections exist, merge them before increasing page length.

---

## 6. Header requirements

The header must contain the highest-value identity information and consume controlled space.

### 6.1 Required header fields

The header should support:

- full name
- role/title line
- compact contact line
- optional avatar/photo

The preferred information order is:

1. full name
2. role/title line
3. contact details

Do not add a separate target role / desired position line when the role/title line already makes the job direction clear. Avoid redundant header rows that consume vertical space without adding meaning.

### 6.2 Contact block rules

The header contact area should be treated as one compact contact line by default.

Required behavior:

- address, phone, email, and profile links should prefer a single-line layout when space allows
- short separators such as `·` should be used between contact items
- the line should feel compact, even, and easy to scan
- avoid unnecessary line breaks that fragment the header

Use multi-line contact layout only when the single-line form would visibly break balance or overflow.

### 6.3 Contact typography rules

Header contact text should remain slightly larger than micro-metadata elsewhere on the page.

Preferred range:

- `9pt` to `9.8pt`

If the current contact text feels too small relative to the header name block, increase it slightly before enlarging decorative elements.

### 6.4 Avatar rules

If an avatar exists:

- it must be optional, never required
- it must not dominate the header
- it must use `object-fit: cover`
- it must use a fixed box, not intrinsic image size
- it must remain visually subordinate to the text block
- it should align with the text block formed by name, role/title, and contact line
- it should not make the header visibly taller than necessary
- in print mode, it must stay pinned to the top-right of the header and must not fall back into normal document flow

Critical print-safety rule:

Responsive mobile rules that move the avatar into normal flow must not apply to print preview. If a breakpoint rule changes `.avatar` to `position: static`, the print stylesheet must explicitly restore the print contract.

Recommended print size range:

- width: `18mm` to `22mm`
- height: `23mm` to `28mm`

Preferred locked default:

- width: `20mm`
- height: `26mm`
- portrait ratio close to `3:4`

The avatar height should visually match the combined height of the three main text lines on the left: name, role/title, and contact line. Keep only a small amount of vertical breathing room so the image supports the header instead of stretching it.

For this project, the avatar position and size should be treated as effectively locked once a clean right-top composition has been reached. Do not keep resizing the avatar during normal content edits.

---

## 7. Print page model

### 7.1 Required print rule

The stylesheet must include print-specific rules.

At minimum:

```css
@page {
  size: A4 portrait;
}
```

### 7.2 Print target

All print styling must assume:

- A4 portrait page size
- browser print preview
- direct PDF export from `Cmd+P`

### 7.3 Recommended page margins

Default print margins should be tight but safe.

Recommended range:

- `5mm` to `10mm`

Preferred default:

- `6mm`

Do not use overly large print margins unless a template explicitly depends on them.

### 7.4 Resume container rules in print

In print mode, `.resume` must:

- remove decorative border if it harms print clarity
- remove drop shadow
- remove rounded-corner dependency
- expand to full printable width
- avoid clipping due to `overflow: hidden` unless intentionally used for strict single-page control

---

## 8. Typography contract

Typography must be tuned for print readability first.

### 8.1 Font role rules

Typography in this project is role-based, not purely global.

The generator must distinguish between:

- Chinese section titles
- Chinese descriptive body text
- Latin text and numerals

### 8.1.1 Chinese section title font

Major section titles such as Education, Experience, Projects, and Skills must default to **Songti-style Chinese serif**.

Recommended stack:

```css
font-family: "Songti SC", "STSong", "SimSun", serif;
```

This applies to section headings and similar high-level title labels.

### 8.1.2 Chinese descriptive body font

Descriptive Chinese content, especially bullet descriptions under sections such as work experience, should default to **Kaiti-style Chinese script** to create contrast from headings.

Recommended stack:

```css
font-family: "Kaiti SC", "STKaiti", "KaiTi", serif;
```

This applies primarily to:

- experience bullets
- project bullets
- descriptive lines whose role is explanation rather than labeling

Do not apply Kaiti to section headings.

### 8.1.3 Latin text and numerals

English text and numerals must default to **Times New Roman**.

Recommended stack:

```css
font-family: "Times New Roman", "Times", serif;
```

This requirement applies to:

- English words
- company names written in English
- dates and date ranges
- percentages
- money amounts
- phone numbers
- email addresses
- URLs and LinkedIn-style handles
- other numeric fragments

### 8.1.4 Mixed-script implementation rule

When a text block contains Chinese together with English or numerals, the generator must not rely on one global `font-family` declaration if that would cause English and numbers to render in the Chinese font.

To preserve the required distinction, the generator should wrap Latin text and numeric fragments in a helper span such as:

```html
<span class="latin">2025.03 – Present</span>
```

Recommended helper class rule:

```css
.latin {
  font-family: "Times New Roman", "Times", serif;
}
```

Use this helper for mixed-script lines such as:

- job metadata
- contact lines
- quantified bullets
- bilingual labels
- English names inside Chinese-led headings
- English job titles inside Chinese-led title blocks
- English company names inside Chinese-led company lines

Critical implementation note:

If a parent element is assigned a Chinese title font such as Songti, the browser will not automatically switch embedded English text to Times New Roman. In those cases, English fragments must be wrapped explicitly in `.latin`, even when the surrounding element is a title, strong label, or company line.

If a block is entirely English or entirely numeric-heavy, it may use the Latin font rule directly at the element level instead of wrapping many fragments.


### 8.2 Size ranges

The generator must stay within these ranges unless the user explicitly requests a different visual style.

#### Name
- preferred: `18pt` to `22pt`
- absolute ceiling: `24pt`
- absolute floor: `17pt`

#### Subtitle / role line
- preferred: `10pt` to `12pt`

#### Section heading
- preferred: `11pt` to `13pt`
- may use uppercase if the design is restrained and readable

#### Body text
- preferred: `9pt` to `10.5pt`
- absolute floor: `8.7pt`

#### Meta text
- preferred: `8.5pt` to `9.5pt`
- absolute floor: `8.2pt`

Do not reduce body text below the floor merely to force a one-page fit.

### 8.3 Line-height ranges

Recommended line-height:

- name: `1.15` to `1.25`
- headings: `1.2` to `1.35`
- body and bullets: `1.35` to `1.5`
- metadata: `1.3` to `1.45`

Avoid overly airy line-height in print mode.
Avoid overly compressed line-height that harms scanability.

### 8.4 Letter spacing

Use letter spacing sparingly.

Allowed use cases:

- section headings
- high-level visual accents

Do not use visible tracking across body text.

---

## 9. Spacing contract

The page should be compact, but not dense to the point of fatigue.

### 9.1 Section spacing

Recommended print spacing:

- top padding per section: `4px` to `10px`
- section heading bottom gap: `3px` to `6px`

### 9.2 Entry spacing

Recommended print spacing for `.job` blocks:

- top margin: `0px` to `4px`
- company info top gap: `2px` to `6px`

### 9.3 Bullet spacing

Recommended print spacing:

- list top margin: `4px` to `8px`
- list item bottom margin: `2px` to `6px`
- left padding: as tight as readability allows

### 9.4 Header spacing

The header should be compact.

Recommended print spacing:

- top/bottom padding should generally stay within `3mm` to `6mm`
- contact gap should generally stay within `4px` to `8px`

---

## 10. Naming conventions

### 10.1 CSS class naming

Use concise semantic class names.
Avoid purely presentational names such as:

- `blue-title`
- `small-text`
- `box-1`

Prefer semantic names such as:

- `section-skills`
- `job-meta`
- `company-info`

### 10.2 Avoid one-off class sprawl

Do not create a large number of single-use utility-like class names for one resume instance unless the system intentionally adopts that style.

The default pattern for this project is:

- semantic block classes
- limited nested structure
- template-level CSS

---

## 11. Bullet and content rules

Content quality affects layout quality. Agents must enforce content-density discipline.

### 11.1 Bullet count guidance

Recommended per experience entry:

- strongest primary experience: `3` to `4` bullets
- secondary experience, internship, campus, or project entry: `2` to `3` bullets
- general default range: `2` to `4` bullets
- soft ceiling: `4`
- avoid `5+` bullets unless the user explicitly asks for a denser document and the content is unusually strong and concise

If a role has many weak bullets, merge or remove before shrinking typography aggressively.

### 11.2 Bullet length guidance

Each bullet should generally aim for:

- one strong sentence
- one measurable outcome, concrete action, or clear responsibility

Avoid paragraph-like bullets when possible.

### 11.3 Summary compression order

If content is too long, compress in this order:

1. repetitive wording
2. low-value adjectives
3. long company descriptions
4. weaker bullets
5. lower-priority sections

This should happen before pushing typography below safe floors.

### 11.4 Skills section rules

The skills section must be compact.

Prefer grouped lines such as:

- languages
- business/domain knowledge
- tools
- technical capabilities

Do not turn skills into a visually wasteful long bullet list unless the design explicitly needs it.

---

## 12. Overflow handling

When content is close to exceeding one printable A4 page, the agent must apply adjustments in a strict order.

### 12.1 Required overflow adjustment order

Apply these steps in sequence:

1. reduce section spacing
2. reduce bullet spacing
3. reduce local metadata spacing
4. tighten line-height slightly
5. reduce font size within allowed ranges
6. compress content if the user allows it

Do not use avatar resizing as a normal overflow-control step once the page has adopted the locked right-top avatar pattern.

Do not jump directly to global font shrink.

### 12.2 Overflow safety rules

- Preserve section hierarchy.
- Preserve readability.
- Do not create collisions between lines or blocks.
- Do not reduce all dimensions at once if a smaller targeted change would solve the issue.

### 12.3 Last-resort behavior

If the content still does not fit after safe layout adjustment:

- tell the user clearly that the resume is over capacity for one page
- recommend where to shorten content
- do not silently collapse readability below the defined floors

---

## 13. Underfill handling

A resume that technically fits but leaves too much empty space fails the visual-density goal.

### 13.1 Required underfill adjustment order

If the page looks sparse, adjust in this order:

1. slightly increase section spacing
2. slightly increase header breathing room
3. slightly increase bullet spacing
4. slightly increase line-height
5. increase font sizes within preferred ranges

Do not inflate the layout so much that it becomes poster-like.

### 13.2 Underfill boundaries

- preserve compact professional tone
- avoid oversized name blocks relative to body content
- avoid excessive whitespace at the bottom of the page

---

## 14. Divider line rules

Divider lines are allowed in this project, but only as a restrained hierarchy aid.

Their purpose is to separate major content parts and improve scanability, not to decorate every block.

### 14.1 Where divider lines are allowed

Divider lines may appear:

- immediately below major section headings
- between major sections such as Education, Experience, Internship Experience, Projects, and Skills

Do not place a standalone divider directly below the header when the first major section heading already begins with its own full-width rule. Two adjacent rules create visual stacking and weaken the hierarchy.

The preferred section treatment is a **full-width horizontal rule directly below the section title**, not a short line beside the title.

If Work Experience and Internship Experience are separate sections, each section may use its own major divider line.

### 14.2 Where divider lines are not allowed

Divider lines must not appear:

- between individual bullet points
- between every `.job` entry inside the same section by default
- around the full page as a heavy frame
- around small metadata fragments
- as decoration that does not map to information hierarchy

Use spacing and heading hierarchy to separate bullets and individual entries inside the same section.

### 14.3 Divider line color

Divider lines should default to a dark neutral gray close to black, not pure black.

Recommended range:

- `#222222` to `#333333`

Preferred default:

- `#2b2b2b`

Do not use fully saturated black unless a print test proves that it still looks restrained.

### 14.4 Divider line thickness

Divider lines should stay visually light.

Recommended thickness:

- `0.8px` to `1px`

Preferred default:

- `0.9px`

Avoid thick rules that overpower text or make the resume feel mechanical.

### 14.5 Divider line behavior

Divider lines should:

- reinforce section hierarchy
- remain thinner and quieter than text
- sit below the section title as a full-width rule for stable visual rhythm
- improve visual segmentation without fragmenting the page

If the page is already visually dense, prefer a lighter line before removing the rule entirely.

---

## 15. Screen vs print behavior

The screen view may include mild decorative styling, but print mode is authoritative.

### 14.1 Allowed screen-only decoration

Allowed when restrained:

- background tint outside the paper area
- border radius
- soft shadow
- subtle paper border

### 14.2 Print mode cleanup

In print mode, remove or neutralize decoration that:

- wastes printable area
- muddies the page edges
- weakens black-and-white legibility
- makes the PDF look like a screenshot of a webpage instead of a printable document

---

## 16. Required print CSS behavior

The print stylesheet must do the following:

1. set A4 portrait page size
2. normalize page margins
3. remove nonessential screen decoration
4. expand main content to printable width
5. keep semantic blocks from breaking awkwardly
6. tighten typography and spacing for print
7. preserve color output only when it helps clarity

Recommended declarations include:

```css
* {
  -webkit-print-color-adjust: exact !important;
  print-color-adjust: exact !important;
}

section,
.job,
li {
  break-inside: avoid;
  page-break-inside: avoid;
}
```

Use these rules carefully. Avoid creating impossible no-break constraints on extremely long blocks.

---

## 17. Content normalization rules for AI generation

When generating HTML from raw user input, normalize content before rendering.

### 16.1 Normalize structure

Transform messy input into these buckets where possible:

- basics
- education
- experience
- projects or internships
- skills

### 16.2 Normalize contact data

Contact data should be rendered compactly and consistently.

Prefer short labels or unlabeled compact text when the meaning is obvious.

### 16.3 Normalize bullet quality

Prefer bullets that show:

- action
- ownership
- result
- metric
- business or technical relevance

### 16.4 Normalize section count

Too many sections create visual fragmentation.

Preferred section count:

- `4` to `6` total content sections excluding header

If the input suggests more, merge weak sections.

---

## 18. File and template behavior

When editing a local project, agents should follow this priority order:

1. If a stable local resume template exists, edit it.
2. If the current file already uses the required class structure, preserve it.
3. If the structure is close but inconsistent, normalize it instead of rewriting everything.
4. Only generate a new file when reuse is clearly worse than replacement.

For this project specifically:

- `resume.html` is the current working prototype
- future reusable templates may live in `templates/`
- skill-specific base templates may live under `skill/.../assets/`

---

## 19. Success criteria

A generated or modified file is considered successful only if most of the following are true:

1. Prints as **one A4 page** in browser print preview.
2. Looks intentional in both browser view and print preview.
3. Uses the required semantic structure.
4. Maintains readable body text.
5. Avoids awkward mid-section visual breaks.
6. Avoids obvious underfill or over-compression.
7. Produces a PDF suitable for real resume submission.

---

## 20. Failure conditions

The result should be considered non-compliant if any of the following occur without explicit user approval:

- body text is shrunk below readable floor
- content spills to a second page
- decorative wrappers consume too much printable area
- the page contains large empty zones caused by weak spacing choices
- semantic structure is flattened into unmaintainable markup
- section and entry blocks break in visibly awkward places
- the result is optimized only for screen and not for print

---

## 21. Implementation note for future skills

Any future skill that generates OnePageResume HTML must treat this specification as binding.

That means:

- generate HTML that matches the required structure
- enforce A4 print constraints during generation or refinement
- preserve readability floors
- adjust density in the required order
- explain when user content exceeds safe one-page capacity

This document is the layout contract that makes the project reusable.
