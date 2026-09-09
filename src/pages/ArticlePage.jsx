import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Icon } from '../components/ui/Icon.jsx';
import { formatArticleDate } from '../utils/date.js';
import { scrollInstantlyTo } from '../utils/scroll.js';

export const ArticlePage = ({ article, onGoHome, relatedArticles, onRelatedArticleSelect }) => {
  const articleRef = useRef(null);
  const [readingProgress, setReadingProgress] = useState(0);
  const [shareStatus, setShareStatus] = useState('');

  useLayoutEffect(() => {
    scrollInstantlyTo(0);
  }, [article.id]);

  useEffect(() => {
    const updateReadingProgress = () => {
      const articleElement = articleRef.current;
      if (!articleElement) {
        return;
      }

      const articleTop = articleElement.offsetTop;
      const readableDistance = Math.max(articleElement.offsetHeight - window.innerHeight, 1);
      const progress = Math.min(Math.max((window.scrollY - articleTop) / readableDistance, 0), 1);
      setReadingProgress(progress);
    };

    window.addEventListener('scroll', updateReadingProgress, { passive: true });
    window.addEventListener('resize', updateReadingProgress);
    updateReadingProgress();
    return () => {
      window.removeEventListener('scroll', updateReadingProgress);
      window.removeEventListener('resize', updateReadingProgress);
    };
  }, [article.id]);

  useEffect(() => {
    if (!shareStatus) {
      return;
    }

    const timeout = window.setTimeout(() => setShareStatus(''), 2500);
    return () => window.clearTimeout(timeout);
  }, [shareStatus]);

  const copyArticleLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setShareStatus('Link copied');
    } catch {
      setShareStatus('Unable to copy link');
    }
  };

  const shareArticle = async () => {
    try {
      await navigator.share({
        title: article.title,
        text: article.summary,
        url: window.location.href
      });
    } catch (error) {
      if (error.name !== 'AbortError') {
        setShareStatus('Unable to open sharing');
      }
    }
  };

  // SEO: Structured data for the article page
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": article.title,
    "image": article.imageUrl,
    "author": {
      "@type": "Person",
      "name": article.author
    },
    "publisher": {
      "@type": "Organization",
      "name": "Legal Lakrids",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.legallakrids.com/logo.png" // Replace with your absolute URL
      }
    },
    "datePublished": article.date,
    "description": article.summary
  };

  return (
    <>
      {/* SEO: Native React 19 support for meta tags and structured data */}
      <title>{`${article.title} | Legal Lakrids`}</title>
      <meta name="description" content={article.summary} />
      <script type="application/ld+json">{JSON.stringify(articleSchema)}</script>

      <div className="fixed left-0 right-0 top-16 z-40 h-0.5 bg-transparent" aria-hidden="true">
        <div
          className="h-full origin-left bg-[#9a7441] transition-transform duration-100 ease-linear"
          style={{ transform: `scaleX(${readingProgress})` }}
        ></div>
      </div>
      <div className="section-shell min-h-screen pt-16">
        <div className="container mx-auto px-4 pb-10 pt-6 sm:px-6 md:pb-14 md:pt-8 lg:px-8">
          <div className="mx-auto max-w-5xl pb-20">
            <div className="mb-10 flex flex-wrap items-center justify-between gap-4">
              <button
                onClick={() => onGoHome()}
                className="inline-flex min-h-11 cursor-pointer items-center rounded-full px-3 text-sm font-semibold text-stone-600 transition-colors hover:bg-stone-100 hover:text-stone-950"
              >
                <Icon path="M10 19l-7-7m0 0l7-7m-7 7h18" className="mr-2 h-5 w-5" />
                Back
              </button>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={copyArticleLink}
                  className="inline-flex min-h-11 items-center rounded-full border border-stone-200 px-4 text-sm font-semibold text-stone-700 transition-colors hover:border-stone-300 hover:bg-stone-100"
                >
                  <Icon path="M13.5 10.5H15.75A2.25 2.25 0 0118 12.75V18A2.25 2.25 0 0115.75 20.25H10.5A2.25 2.25 0 018.25 18V15.75M15.75 8.25V6A2.25 2.25 0 0013.5 3.75H8.25A2.25 2.25 0 006 6V11.25A2.25 2.25 0 008.25 13.5H10.5" className="mr-2 h-4 w-4" />
                  Copy link
                </button>
                {typeof navigator.share === 'function' && (
                  <button
                    type="button"
                    onClick={shareArticle}
                    className="inline-flex min-h-11 items-center rounded-full border border-stone-200 px-4 text-sm font-semibold text-stone-700 transition-colors hover:border-stone-300 hover:bg-stone-100"
                  >
                    <Icon path="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" className="mr-2 h-4 w-4" />
                    Share
                  </button>
                )}
              </div>
            </div>
            <article ref={articleRef}>
              <header className="mx-auto max-w-4xl text-center">
                <p className="eyebrow">{article.category}</p>
                <h1 className="mt-4 text-4xl font-semibold leading-[1.08] tracking-[-0.035em] text-stone-950 md:text-6xl">
                  {article.title}
                </h1>
                <div className="mt-6 text-sm font-medium text-stone-500">
                  <span>By {article.author}</span>
                  <span className="mx-2">&middot;</span>
                  <time dateTime={article.date}>{formatArticleDate(article.date)}</time>
                </div>
                <p className="mt-4 min-h-5 text-sm font-semibold text-[#72512a]" role="status" aria-live="polite">
                  {shareStatus}
                </p>
              </header>
              <img
                src={article.imageUrl}
                alt={article.title}
                className="article-hero-image mt-8 aspect-[16/9] w-full rounded-[1.5rem] object-cover shadow-[0_24px_70px_rgba(23,23,20,0.16)]"
                style={{ viewTransitionName: article.isTransitioning ? 'article-image' : 'none' }}
                fetchPriority="high"
                decoding="async"
                onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/1200x600/e2e8f0/4a5568?text=Image+Not+Found`; }}
              />
              <div
                className="article-content mx-auto mt-14 max-w-[68ch]"
                dangerouslySetInnerHTML={{
                  __html: '<p>' + article.content
                    .replace(/"([^"]+)"/g, '<span class="italic">$1</span>') // 1. Italicize quotes (MUST run before links)
                    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>') // 2. Bold text
                    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-gray-900 hover:text-gray-600 underline transition duration-150 ease-in-out">$1</a>') // 3. Links
                    .replace(/^-\s(.+)$/gm, '</p><ul class="list-disc pl-6"><li>$1</li></ul><p>') // 4. Unordered lists
                    .replace(/<\/ul><p><ul class="list-disc pl-6">/g, '') // 5. Fix adjacent list items
                    .replace(/\n\n/g, '</p><p>') // 6. Paragraphs
                    .replace(/\n/g, '<br />') // 7. Line breaks
                    + '</p>'
                }}
              />
            </article>
            {relatedArticles.length > 0 && (
              <aside className="mt-20 border-t border-stone-200 pt-12" aria-labelledby="related-articles-title">
                <p className="eyebrow">Continue reading</p>
                <h2 id="related-articles-title" className="mt-2 text-3xl font-semibold text-stone-950">
                  Related articles
                </h2>
                <div className="mt-8 grid gap-5 md:grid-cols-3">
                  {relatedArticles.map((relatedArticle) => (
                    <a
                      key={relatedArticle.id}
                      href={`#article/${relatedArticle.id}`}
                      onClick={(event) => {
                        event.preventDefault();
                        onRelatedArticleSelect(relatedArticle.id);
                      }}
                      className="premium-card group overflow-hidden"
                    >
                      <img
                        src={relatedArticle.imageUrl}
                        alt=""
                        className="aspect-[16/9] w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                        loading="lazy"
                        decoding="async"
                      />
                      <div className="p-5">
                        <p className="eyebrow">{relatedArticle.category}</p>
                        <h3 className="mt-2 text-lg font-semibold leading-snug text-stone-950 group-hover:text-[#72512a]">
                          {relatedArticle.title}
                        </h3>
                      </div>
                    </a>
                  ))}
                </div>
              </aside>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
