import { Icon } from '../ui/Icon.jsx';
import { formatArticleDate } from '../../utils/date.js';

export const Blog = ({ articles, onArticleSelect, transitioningArticleId }) => {
  return (
    <section id="blog" className="section-muted scroll-mt-20 py-20 sm:py-28">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto">
          <p className="eyebrow">Ideas and analysis</p>
          <h2 className="mt-3 text-4xl font-semibold tracking-tight text-stone-950 sm:text-5xl">From the Blog</h2>
          <p className="mt-5 text-lg leading-relaxed text-stone-600">
            Latest articles and analysis from leading legal experts in Scandinavia.
          </p>
        </div>
        <div className="mx-auto mt-14 grid max-w-lg gap-8 md:grid-cols-2 md:max-w-4xl lg:grid-cols-3 lg:max-w-none">
          {articles && [...articles].sort((a, b) => new Date(b.date) - new Date(a.date)).map((article) => (
            <a
              key={article.id}
              href={`#article/${article.id}`}
              onClick={(event) => {
                event.preventDefault();
                onArticleSelect(article.id);
              }}
              className="premium-card group flex min-h-full flex-col overflow-hidden"
            >
              <div className="relative aspect-[16/10] flex-shrink-0 overflow-hidden bg-stone-200">
                <img
                  className="h-full w-full transform object-cover transition-transform duration-300 group-hover:scale-105"
                  src={article.imageUrl}
                  alt={article.title}
                  style={{ viewTransitionName: transitioningArticleId === article.id ? 'article-image' : 'none' }}
                  loading="lazy"
                  decoding="async"
                  onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/600x400/e2e8f0/4a5568?text=${article.category}`; }}
                />
              </div>
              <div className="flex flex-1 flex-col justify-between p-6">
                <div>
                  <span className="inline-flex rounded-full bg-[#efe7da] px-3 py-1 text-xs font-bold tracking-wide text-[#72512a]">
                    {article.category}
                  </span>
                  <h3 className="mt-4 text-[1.35rem] font-semibold leading-snug text-stone-950 transition-colors group-hover:text-[#72512a]">
                    {article.title}
                  </h3>
                  <p className="mt-3 line-clamp-3 text-sm leading-6 text-stone-600">{article.summary}</p>
                </div>
                <div className="mt-7 flex items-center justify-between border-t border-stone-200 pt-5">
                  <div className="text-xs font-medium text-stone-500">
                    <span>{article.author}</span>
                    <span className="mx-1.5">&middot;</span>
                    <time dateTime={article.date}>{formatArticleDate(article.date)}</time>
                  </div>
                  <span className="flex items-center text-xs font-bold text-stone-800">
                    Read
                    <Icon
                      path="M17.25 6.75L21 10.5m0 0l-3.75 3.75M21 10.5H3"
                      className="ml-1.5 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                    />
                  </span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};
