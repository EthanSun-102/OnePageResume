# Layout rules

Use these rules when generating or refining a one-page resume for A4 print.

## Core print target

- A4 portrait
- one printable page
- safe print margins
- no awkward section breaks

## Adjustment priority

When content slightly overflows, adjust in this order:

1. section spacing
2. bullet spacing
3. line-height
4. font size
5. content compression

This order preserves readability better than shrinking text first.

## Safe typography guidance

These are guidance ranges, not absolute rules:

Font-role reminder:

- Chinese section titles should use Songti-style serif
- Chinese descriptive body text should use Kaiti-style serif
- English text and numerals should use Times New Roman
- If English appears inside a Chinese-styled title or label, wrap that fragment in `.latin`; do not assume the browser will switch fonts automatically

- name: about 18pt to 24pt
- section headings: about 11pt to 14pt
- body text: about 9pt to 11pt
- metadata text: about 8.5pt to 10pt
- line-height: about 1.35 to 1.55

Avoid going below readable body text just to force a fit.

## Density guidance

Avatar-lock reminder:

- keep the avatar fixed in the top-right header corner in print
- prefer a stable portrait size around `20mm × 26mm`
- do not treat avatar resizing as a default density-control knob

A good page should feel:

- full but not crowded
- structured but not sparse
- easy to scan quickly

If the page looks underfilled, first increase spacing slightly rather than enlarging all text aggressively.

## Section handling

Prefer keeping each section visually intact.

Use print rules such as:

- `break-inside: avoid`
- `page-break-inside: avoid`

for sections, jobs, and list items when appropriate.

## Content compression guidance

If layout changes are not enough:

- shorten verbose company summaries
- merge repetitive skill items
- keep the bullets with strongest outcomes, metrics, and impact
- remove lower-value wording before shrinking typography further
