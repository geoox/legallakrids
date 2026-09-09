---
name: legal-lakrids-article
description: Creates and publishes a Legal Lakrids website article from an uploaded document or pasted draft. Use when the user asks to add, create, convert, publish, or draft an article, blog post, legal update, or event recap for this repository.
compatibility: Designed for the Legal Lakrids React repository. Requires access to src/App.jsx and the repository's existing npm scripts.
metadata:
  author: Legal Lakrids
  version: "1.0"
---

# Create a Legal Lakrids article

Turn the user's uploaded document or pasted content into a complete article entry in
`src/App.jsx`. Follow the existing article model and presentation style; do not create
a separate article file or change the renderer unless the user explicitly requests a
refactor.

## Workflow

1. Read the complete source material before editing.
   - Treat the uploaded or pasted text as the factual source of truth.
   - For rich-text formats such as DOCX, do not rely on plain-text extraction alone.
     Inspect the document's hyperlink relationships and map every linked text run in the
     selected article body to its target URL. For DOCX files, this means reading both
     `word/document.xml` and `word/_rels/document.xml.rels`.
   - Identify the exact article-body boundaries established by the document. Documents
     may also contain metadata, speaker/contact lines, social-media drafts, hashtags,
     event listings, working notes, or outlines; none of those are article content
     unless the user explicitly includes them.
   - When the document labels or positions an article body between surrounding sections,
     copy only that body. For example, if publishable paragraphs appear below a
     “speakers” line and before “notes,” use those paragraphs verbatim and exclude both
     boundary sections.
   - Preserve names, organizations, dates, figures, quotations, legal citations,
     conclusions, and every hyperlink attached to text within the selected body.
   - Do not add facts, sources, examples, headings, introductions, transitions,
     conclusions, commentary, or analysis. Only research or expand the body when the
     user explicitly asks.
   - If an attachment cannot be read, explain the blocker instead of guessing.

2. Inspect the current article collection and renderer in `src/App.jsx`.
   - Locate `const articles = useMemo(() => [`.
   - Check existing IDs, author spellings, category labels, field conventions, and the
     currently supported body formatting.
   - Do not assume this skill's examples are newer than the code.

3. Derive the article metadata.
   - `title`: Use the document title exactly when present. Only create a title when the
     source has none.
   - `id`: Convert the final title to a lowercase ASCII kebab-case slug. Remove
     punctuation and diacritics, convert `&` to `and`, collapse repeated hyphens, and
     verify that the ID is unique in `src/App.jsx`.
   - `category`: Reuse the closest existing category when appropriate. Infer a concise
     legal topic only when the source makes it unambiguous.
   - `summary`: Use the document's thumbnail summary or equivalent text exactly when
     present. Only write a summary when the source has none.
   - `author`: Use the author named by the user or document. If absent, inspect recent
     article authors but do not guess which person wrote the piece; ask one focused
     question.
   - `date`: Use an explicitly supplied publication date. If none is supplied, use the
     current local date in `YYYY-MM-DD` format.
   - `imageUrl`: Use an HTTPS image URL supplied by the user or document. If none is
     supplied, find a relevant, license-safe image only when web access and attribution
     requirements permit it. Otherwise ask one focused question for an image URL.

4. Preserve the selected article body.
   - Copy the designated body verbatim. Do not rewrite, polish, summarize, expand, or
     enhance it.
   - Preserve the source's wording, spelling, punctuation, paragraph order, legal
     precision, and level of detail, even when an alternative phrasing seems better.
   - Do not derive article prose from notes or outlines.
   - Make only the mechanical escaping and paragraph-separation changes required to
     store the text safely in the JavaScript template literal, plus the Markdown link
     syntax required to retain source hyperlinks.
   - If the user requests editorial changes, apply only the specifically requested
     changes and identify them in the completion response.

5. Convert the body to the renderer's supported markup.
   - Separate paragraphs with one blank line.
   - Use `**text**` for bold emphasis.
   - Use `[label](https://example.com)` for links.
   - Use `- ` at the beginning of each list-item line for unordered lists.
   - Plain numbered lines and headings have no dedicated renderer support. Preserve
     their text rather than rewriting it; ask before changing the source structure if
     the formatting would be materially degraded.
   - Straight double-quoted spans are automatically italicized by the renderer. Prefer
     typographic quotation marks (`“...”`) for ordinary quotations; use straight quotes
     only when the site's italic behavior is intended.
   - Do not insert HTML, Markdown tables, images, blockquotes, fenced code blocks, or
     heading syntax into `content`; the current renderer does not support them safely.

6. Add the new object to the beginning of the `articles` array.
   - Include every field in the template from
     [references/article-format.md](references/article-format.md).
   - Keep the field order consistent with nearby recent articles.
   - Do not edit unrelated articles.
   - Escape JavaScript delimiters as described in the reference.

7. Verify the result.
   - Confirm the ID is non-empty, kebab-case, and unique.
   - Confirm the date is a real ISO date and the image URL uses HTTPS.
   - Confirm all six metadata values are present and `content` is non-empty.
   - Compare the rich-text source relationships with the final article and confirm every
     hyperlink whose linked text falls inside the selected body survived conversion.
     Do not count links from excluded metadata, speaker, social-media, or notes sections.
   - Confirm parentheses in URLs were not truncated by the simple link renderer.
   - Run `npm run lint` and `npm run build`.
   - Review the diff to ensure only the intended article and skill-related files changed.

## Missing information

Ask only for information that cannot be inferred safely. If both author and image are
missing, ask about them one at a time. Do not pause for title, slug, category, summary,
or date when they can be derived by the rules above.

## Completion response

State the published title, author, category, date, and deep link
`#article/<article-id>`. Confirm that the designated article body was copied without
editorial expansion. Mention any user-requested transformation or supplied placeholder
explicitly. Do not claim deployment unless a deployment was requested and completed.
