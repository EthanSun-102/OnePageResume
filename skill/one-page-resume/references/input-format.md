# Input format guidance

This skill can work from several input forms.

## Supported inputs

### 1. Raw resume notes

The user may provide:

- bullet points
- job history notes
- education details
- skills lists
- mixed Chinese and English content

If the content is unstructured, organize it into:

- basics
- education
- experience
- projects if needed
- skills

### 2. Structured JSON

Prefer structured JSON when available.

Typical fields include:

- basics
- education
- experience
- skills

Use local schema files when present.

### 3. Existing HTML

If the user already has an HTML resume, prefer editing it directly instead of rewriting from scratch unless the current structure is beyond repair.

## Clarify only when necessary

Ask only if a missing detail blocks layout or content quality, such as:

- target language
- whether shortening is allowed
- whether a photo is required
- whether the result must be strictly one page at all costs
