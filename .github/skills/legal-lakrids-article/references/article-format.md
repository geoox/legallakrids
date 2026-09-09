# Legal Lakrids article format

Articles are static JavaScript objects inside the `articles` array in `src/App.jsx`.
The blog grid sorts them by descending `date`, while article navigation uses the string
`id` in the hash route `#article/<id>`.

## Object template

Insert the object at the beginning of the array:

```jsx
{
  title: 'Article title',
  author: 'Author name',
  date: 'YYYY-MM-DD',
  id: 'article-title',
  category: 'Category',
  imageUrl: 'https://example.com/article-image.jpg',
  summary: 'One accurate sentence used on the blog card and as the SEO description.',
  content: `Opening paragraph.

**Section label**

Body paragraph with **bold text** and a [descriptive source link](https://example.com).

- First list item
- Second list item

Closing paragraph.`,
},
```

Nearby objects may use a different field order. Match the most recent objects while
retaining all eight required fields:

- `title`
- `author`
- `date`
- `id`
- `category`
- `imageUrl`
- `summary`
- `content`

## JavaScript escaping

Metadata values use single-quoted JavaScript strings:

- Escape apostrophes as `\'`.
- Escape literal backslashes as `\\`.
- Keep metadata on one line unless the surrounding code establishes another pattern.

The body uses a template literal:

- Escape a literal backtick as `` \` ``.
- Escape a literal `${` as `\${` so it is not treated as interpolation.
- Do not escape apostrophes in the template literal.

## Renderer behavior

The article page transforms body text in this order:

1. Straight double-quoted spans become italic HTML.
2. `**text**` becomes bold.
3. `[label](URL)` becomes an external link.
4. lines beginning with `- ` become unordered list items.
5. blank lines become paragraph boundaries.
6. remaining line breaks become `<br />`.

This is a small custom formatter, not a Markdown parser. In particular:

- `# Heading` is displayed literally.
- `1. Item` is displayed as ordinary text.
- Nested lists are unsupported.
- Raw HTML is unsafe because the result is passed to `dangerouslySetInnerHTML`.
- URLs containing unmatched closing parentheses can be truncated by the link pattern.

## Existing publication conventions

- Recent commits add article objects directly to `src/App.jsx`.
- New articles are normally prepended to the array.
- Dates use `YYYY-MM-DD` and determine blog-card ordering.
- IDs are readable lowercase kebab-case title slugs.
- Summaries are single-sentence card and SEO descriptions.
- Categories are short legal practice areas or event classifications.
- Images are externally hosted HTTPS URLs, commonly from Unsplash.
- Content retains legal source links and uses bold text for section labels or key terms.
