import React, { useState, useEffect, useRef, useMemo } from 'react';
import { flushSync } from 'react-dom';
import heroVideo from './assets/videos/hero-video.mp4';
import logo from './assets/images/logo.png';
import lou from './assets/images/lou.jpeg';
import cristina from './assets/images/cristina.jpeg';


// --- Helper Components ---

// Icon component for consistent icon styling
const Icon = ({ path, className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d={path} />
  </svg>
);

const formatArticleDate = (date) => new Intl.DateTimeFormat('en-GB', {
  day: 'numeric',
  month: 'short',
  year: 'numeric'
}).format(new Date(`${date}T00:00:00`));

// A component to fade in sections as they are scrolled into view
const FadeInSection = ({ children }) => {
  const [isVisible, setVisible] = useState(false);
  const domRef = useRef();
  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setVisible(entry.isIntersecting);
        }
      });
    });
    const { current } = domRef;
    if (current) {
      observer.observe(current);
    }
    return () => {
      if (current) {
        observer.unobserve(current);
      }
    };
  }, []);
  return (
    <div
      ref={domRef}
      className={`transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
      }`}
    >
      {children}
    </div>
  );
};


// --- Article Page Component ---

const ArticlePage = ({ article, onGoHome, relatedArticles, onRelatedArticleSelect }) => {
  const articleRef = useRef(null);
  const [readingProgress, setReadingProgress] = useState(0);
  const [shareStatus, setShareStatus] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [article]);

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
  }, [article]);

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
      <div className="section-shell min-h-screen pt-24">
        <div className="container mx-auto px-4 py-10 sm:px-6 md:py-14 lg:px-8">
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

// --- Main Section Components ---

const Header = ({
  activeSection,
  setActiveSection,
  onGoHome,
  isInteriorPage
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (isInteriorPage) {
        setIsScrolled(true);
        return;
      }
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isInteriorPage]);

  useEffect(() => {
    if (isInteriorPage) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleSection = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visibleSection) {
          setActiveSection(visibleSection.target.id);
        }
      },
      { rootMargin: '-35% 0px -55% 0px', threshold: [0, 0.1, 0.5] }
    );

    ['home', 'about', 'events', 'blog', 'contact'].forEach((sectionId) => {
      const section = document.getElementById(sectionId);
      if (section) {
        observer.observe(section);
      }
    });

    return () => observer.disconnect();
  }, [isInteriorPage, setActiveSection]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen]);

  const navLinks = ["About", "Events", "Blog", "Contact"];

  const handleNavClick = (section) => {
    const sectionId = section.toLowerCase();

    const scrollToSection = () => {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    };

    if (isInteriorPage) {
      onGoHome({ restoreScroll: false });
      setTimeout(scrollToSection, 100);
    } else {
      scrollToSection();
    }

    setActiveSection(sectionId);
    setIsOpen(false);
  };

  const handleLogoClick = (e) => {
    e.preventDefault();
    if (isInteriorPage) {
      onGoHome({ restoreScroll: false });
      setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 100);
    } else {
      handleNavClick('home');
    }
  };

  const isOpaque = isScrolled || isInteriorPage;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 border-b transition-all duration-500 ${
        isOpaque
          ? 'border-black/5 bg-[#fffdf9]/90 shadow-[0_12px_35px_rgba(23,23,20,0.07)] backdrop-blur-xl'
          : 'border-transparent bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`flex items-center justify-between transition-all duration-500 ${isOpaque ? 'h-16' : 'h-20'}`}>
          <div className="flex-shrink-0">
            <a
              href="#home"
              onClick={handleLogoClick}
              className="block rounded-xl bg-white/95 px-1 shadow-sm transition-transform duration-300 hover:scale-[1.02]"
              aria-label="Legal Lakrids home"
            >
              <img
                src={logo}
                alt=""
                className={`w-auto transition-all duration-500 ${isOpaque ? 'h-14' : 'h-16'}`}
              />
            </a>
          </div>
          <div className="hidden md:block">
            <nav aria-label="Primary navigation" className="ml-10 flex items-center gap-1">
              {navLinks.map((link) => (
                <a
                  key={link}
                  href={`#${link.toLowerCase()}`}
                  onClick={(e) => { e.preventDefault(); handleNavClick(link); }}
                  aria-current={activeSection === link.toLowerCase() ? 'location' : undefined}
                  className={`relative rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                    isOpaque
                      ? 'text-stone-700 hover:bg-stone-100 hover:text-stone-950'
                      : 'text-white/85 hover:bg-white/10 hover:text-white'
                  } ${
                    activeSection === link.toLowerCase()
                      ? 'after:absolute after:inset-x-4 after:-bottom-0.5 after:h-px after:bg-[#b48a55]'
                      : ''
                  }`}
                >
                  {link}
                </a>
              ))}
            </nav>
          </div>
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className={`inline-flex min-h-11 min-w-11 items-center justify-center rounded-full transition-colors ${
                isOpaque
                  ? 'text-stone-900 hover:bg-stone-100'
                  : 'text-white hover:bg-white/10'
              }`}
              aria-controls="mobile-menu"
              aria-expanded={isOpen}
            >
              <span className="sr-only">Open main menu</span>
              <Icon path={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>

      <div
        className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out md:hidden ${
          isOpen ? 'grid-rows-[1fr] opacity-100' : 'pointer-events-none grid-rows-[0fr] opacity-0'
        }`}
        id="mobile-menu"
        aria-hidden={!isOpen}
      >
        <div className="overflow-hidden">
          <nav
            aria-label="Mobile navigation"
            className="mx-3 mb-3 space-y-1 rounded-2xl border border-black/5 bg-[#fffdf9]/95 p-2 shadow-xl backdrop-blur-xl"
          >
            {navLinks.map((link) => (
              <a
                key={link}
                href={`#${link.toLowerCase()}`}
                onClick={(e) => { e.preventDefault(); handleNavClick(link); }}
                tabIndex={isOpen ? 0 : -1}
                aria-current={activeSection === link.toLowerCase() ? 'location' : undefined}
                className={`block rounded-xl px-4 py-3 text-base font-semibold transition-colors ${
                  activeSection === link.toLowerCase()
                    ? 'bg-stone-900 text-white'
                    : 'text-stone-700 hover:bg-stone-100 hover:text-stone-950'
                }`}
              >
                {link}
              </a>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
};

const Hero = () => {
  const [videoError, setVideoError] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updateMotionPreference = () => setPrefersReducedMotion(motionPreference.matches);
    updateMotionPreference();
    motionPreference.addEventListener('change', updateMotionPreference);
    return () => motionPreference.removeEventListener('change', updateMotionPreference);
  }, []);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.8;
    }
  }, [prefersReducedMotion]);

  const fallbackImageUrl = "https://images.unsplash.com/photo-1519751138087-5bf79df62d5b?q=80&w=2070&auto=format&fit=crop";
  const saveDataEnabled = navigator.connection?.saveData ?? false;
  const shouldShowVideo = !videoError && !prefersReducedMotion && !saveDataEnabled;

  return (
    <section
      id="home"
      className="relative flex h-[100svh] min-h-[680px] items-center justify-center overflow-hidden bg-cover bg-center text-center"
      style={{ backgroundImage: `url(${fallbackImageUrl})` }}
    >
      {shouldShowVideo && (
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          poster={fallbackImageUrl}
          className="absolute inset-0 z-0 h-full w-full object-cover"
          onError={() => setVideoError(true)}
        >
          <source src={heroVideo} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      )}
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,10,9,0.48)_0%,rgba(10,10,9,0.58)_52%,rgba(10,10,9,0.78)_100%)]"></div>
      <div className="relative z-10 mx-auto max-w-5xl px-5">
        <p className="mb-5 text-xs font-bold uppercase tracking-[0.24em] text-white/70">
          Scandinavian law · Ideas · Community
        </p>
        <h1 className="text-5xl font-semibold tracking-[-0.035em] text-white sm:text-6xl md:text-7xl lg:text-8xl">
          Legal Lakrids
        </h1>
        <p className="mx-auto mt-6 max-w-3xl text-lg leading-relaxed text-white/80 md:text-2xl">
          For the acquired taste in law: Your partner in Scandinavian legal events and insights.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a
            href="#blog"
            className="inline-flex min-h-12 items-center justify-center rounded-full bg-white px-6 text-sm font-bold text-stone-950 shadow-[0_16px_40px_rgba(0,0,0,0.24)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#f8f6f1] hover:shadow-[0_20px_50px_rgba(0,0,0,0.3)]"
          >
            Explore articles
            <Icon path="M17.25 6.75L21 10.5m0 0l-3.75 3.75M21 10.5H3" className="ml-2 h-4 w-4" />
          </a>
          <a href="#events" className="secondary-button">
            View events
          </a>
        </div>
      </div>
      <a
        href="#about"
        className="absolute bottom-7 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-white/60 transition-colors hover:text-white"
        aria-label="Scroll to learn more about Legal Lakrids"
      >
        Discover
        <span className="h-8 w-px bg-gradient-to-b from-white/80 to-transparent"></span>
      </a>
    </section>
  );
};

const About = () => (
  <section id="about" className="section-muted scroll-mt-20 py-20 sm:py-28">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center">
          <p className="eyebrow">Our perspective</p>
          <h2 className="mt-3 text-4xl font-semibold tracking-tight text-stone-950 sm:text-5xl">About Legal Lakrids</h2>
          <p className="mt-5 text-lg leading-relaxed text-stone-600">
            Your specialized partner in Scandinavian legal events and insights.
          </p>
        </div>
        <div className="mt-14 grid grid-cols-1 items-center gap-12 md:grid-cols-2 md:gap-16">
          <div>
            <img
              className="aspect-[4/3] h-full w-full rounded-[1.5rem] object-cover shadow-[0_24px_60px_rgba(23,23,20,0.12)]"
              src="https://images.unsplash.com/photo-1585399058947-f68f9db58e5f?q=80&w=2070&auto=format&fit=crop"
              alt="Legal professionals collaborating on Scandinavian market movements"
              loading="lazy"
              decoding="async"
              onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/600x400/e2e8f0/4a5568?text=Our+Team'; }}
            />
          </div>
          <div className="space-y-5 text-base leading-8 text-stone-600 sm:text-lg">
            <p>
              Founded by two EU-qualified lawyers based in Copenhagen, this is the essential platform for legal professionals looking to connect, collaborate, and critically engage with the field in Scandinavia.
            </p>
            <p>
              Born from the belief that law is best understood when it's actively discussed, our mission is to foster a space for critical commentary and analysis of legal developments and market movements.
            </p>
            <p className="font-semibold text-stone-900">
              If you have a passion for law and a desire to engage with your peers, welcome home.
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const Founders = () => (
  <section id="founders" className="section-shell py-20 sm:py-28">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto text-center">
        <p className="eyebrow">The people behind it</p>
        <h2 className="mt-3 text-4xl font-semibold tracking-tight text-stone-950 sm:text-5xl">Meet the Founders</h2>
        <div className="mt-16 flex flex-col md:flex-row justify-center items-center gap-12 md:gap-20">
          <div className="flex flex-col items-center">
            <a
              href="https://www.linkedin.com/in/cristina-bostean/"
              target="_blank"
              rel="noopener noreferrer"
              className="group cursor-pointer rounded-[1.5rem]"
            >
              <img
                className="h-64 w-64 rounded-[1.5rem] object-cover shadow-[0_20px_50px_rgba(23,23,20,0.14)] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-1 group-hover:shadow-[0_26px_60px_rgba(23,23,20,0.2)]"
                src={cristina}
                alt="Cristina Bostean, co-founder of Legal Lakrids"
                loading="lazy"
                decoding="async"
              />
            </a>
            <h3 className="mt-6 text-xl font-semibold text-gray-800">Cristina Bostean</h3>
          </div>
          <div className="flex flex-col items-center">
            <a
              href="https://www.linkedin.com/in/louladoire/"
              target="_blank"
              rel="noopener noreferrer"
              className="group cursor-pointer rounded-[1.5rem]"
            >
              <img
                className="h-64 w-64 rounded-[1.5rem] object-cover shadow-[0_20px_50px_rgba(23,23,20,0.14)] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-1 group-hover:shadow-[0_26px_60px_rgba(23,23,20,0.2)]"
                src={lou}
                alt="Lou Ladoire, co-founder of Legal Lakrids"
                loading="lazy"
                decoding="async"
              />
            </a>
            <h3 className="mt-6 text-xl font-semibold text-gray-800">Lou Ladoire</h3>
          </div>
        </div>
        <div className="mx-auto mt-12 max-w-3xl space-y-5 text-left text-base leading-8 text-stone-600 sm:text-lg">
          <p>
            Cristina brings a strong M&A, corporate law and banking & finance background, shaped at PwC Romania and studies at the Sorbonne and University of Bucharest.
          </p>
          <p>
            Lou blends expertise in competition law, international arbitration, and cross-border regulatory work, honed at Uría Menéndez and IE Law School in Spain.
          </p>
          <p>
            They share a strong interest in the future of law, specifically AI and tech regulation, as well as the legal challenges in highly regulated industries like logistics, energy, and pharmaceuticals.
          </p>
        </div>
      </div>
    </div>
  </section>
);

const Blog = ({ articles, onArticleSelect, transitioningArticleId }) => {
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

const Events = () => {
  const events = [
    {
      title: 'TechTorget Danmark',
      date: '2025-10-08',
      location: '🇩🇰 Copenhagen, Denmark',
      description: 'Explore the transformative power of legal tech and AI in today\'s rapidly evolving global landscape.',
      icon: <Icon path="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />,
      hrefLink: 'https://event.techtorget.com/techtorget-copenhagen-2025/'
    },
    {
      title: 'Google 15 Years On – Key Learnings, Antitrust Challenges, and the Road Ahead',
      date: '2025-10-27',
      location: '🇩🇰 Copenhagen, Denmark',
      description: 'Reflect on the key lessons learned so far about Google, antitrust, and policing abusive actions in the tech sector.',
      icon: <Icon path="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21v-1a6 6 0 00-5.197-5.803" />,
      hrefLink: 'https://www.cbs.dk/en/research/departments-and-centres/department-of-business-humanities-and-law/cbs-law/events/google-15-years-on-key-learnings-antitrust-challenges-and-the-road-ahead'
    },
    {
      title: 'Accura Open House',
      date: '2025-11-06',
      location: '🇩🇰 Alexandriagade 8, 2150, Nordhavn',
      description: 'Experience Accura’s innovative approach to legal services and network with industry professionals.',
      icon: <Icon path="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm0 5.25h.007v.008H3.75v-.008zm0 5.25h.007v.008H3.75v-.008z" />,
      hrefLink: 'https://app.happenings.dk/buy/449921a2-8b55-4c1a-81a3-23d8806df5d2'
    },
    {
      title: 'Breakfast Briefing with Martin Scheinin',
      date: '2025-11-06',
      location: '🇩🇰 Njalsgade 76, 2300 Copenhagen S',
      description: 'Norms, Sources and Facts in International Law: Some Reflections on Theory, Methodology and Practice',
      icon: <Icon path="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm0 5.25h.007v.008H3.75v-.008zm0 5.25h.007v.008H3.75v-.008z" />,
      hrefLink: 'https://jura.ku.dk/icourts/calendar/2025/breakfast-briefing-with-martin-scheinin/'
    },
    {
      title: 'Course on Green Hydrogen Regulation',
      date: '2025-11-11',
      location: '🇩🇰 Room 8A.0.57 – Faculty of Law, University of Copenhagen',
      description: 'This hybrid course offers deep insights into the EU and Denmark’s Hydrogen laws and policies.',
      icon: <Icon path="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm0 5.25h.007v.008H3.75v-.008zm0 5.25h.007v.008H3.75v-.008z" />,
      hrefLink: 'https://jura.ku.dk/clima/calendar/2025/course-on-green-hydrogen/'
    },
    {
      title: 'Nordic Ethics and Compliance Survey Launch',
      date: '2025-11-25',
      location: '🇩🇰 Axel Towers, Axel Torv 2, 1609 Copenhagen',
      description: 'Inspiration, new insights and great networking with peers in the ethics and compliance field.',
      icon: <Icon path="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm0 5.25h.007v.008H3.75v-.008zm0 5.25h.007v.008H3.75v-.008z" />,
      hrefLink: 'https://gorrissenfederspiel.com/en/events/nordic-ethics-compliance-survey-launch-in-copenhagen/'
    },
  ];

  const today = new Date();
  const sortedEvents = events
    .map((event) => {
      const eventDate = new Date(`${event.date}T23:59:59`);
      return { ...event, isPast: eventDate < today, eventDate };
    })
    .sort((a, b) => {
      if (a.isPast !== b.isPast) {
        return a.isPast ? 1 : -1;
      }
      return a.isPast ? b.eventDate - a.eventDate : a.eventDate - b.eventDate;
    });

  return (
    <section id="events" className="section-shell scroll-mt-20 py-20 sm:py-28">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto">
          <p className="eyebrow">Meet and exchange</p>
          <h2 className="mt-3 text-4xl font-semibold tracking-tight text-stone-950 sm:text-5xl">Events</h2>
          <p className="mt-5 text-lg leading-relaxed text-stone-600">
            Connect with peers and gain valuable insights at legal events across Scandinavia.
          </p>
        </div>
        <div className="mx-auto mt-14 max-w-5xl space-y-5">
          {sortedEvents.map((event) => {
            const month = new Intl.DateTimeFormat('en', { month: 'short' })
              .format(event.eventDate)
              .toUpperCase();
            const day = new Intl.DateTimeFormat('en', { day: '2-digit' })
              .format(event.eventDate);
            const year = event.eventDate.getFullYear();

            return (
              <article
                key={event.title}
                className={`premium-card overflow-hidden ${event.isPast ? 'opacity-75 hover:opacity-100' : ''}`}
              >
                <div className="grid gap-6 p-6 sm:grid-cols-[5rem_1fr] md:grid-cols-[5rem_1fr_auto] md:items-center md:p-7">
                  <time
                    dateTime={event.date}
                    className="flex h-20 w-20 flex-col items-center justify-center rounded-2xl bg-stone-950 text-white shadow-lg"
                  >
                    <span className="text-[0.65rem] font-bold tracking-[0.18em] text-white/65">{month}</span>
                    <span className="font-serif text-3xl font-semibold leading-none">{day}</span>
                    <span className="mt-1 text-[0.65rem] text-white/65">{year}</span>
                  </time>
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <span className={`rounded-full px-2.5 py-1 text-[0.65rem] font-bold uppercase tracking-wider ${
                        event.isPast
                          ? 'bg-stone-200 text-stone-600'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {event.isPast ? 'Past event' : 'Upcoming'}
                      </span>
                      <span className="text-xs text-stone-500">{event.location}</span>
                    </div>
                    <div className="mt-3 flex items-start gap-3">
                      <span className="mt-1 hidden text-[#9a7441] sm:block">
                        {event.icon}
                      </span>
                      <div>
                        <h3 className="text-xl font-semibold leading-snug text-stone-950">{event.title}</h3>
                        <p className="mt-2 text-sm leading-6 text-stone-600">{event.description}</p>
                      </div>
                    </div>
                  </div>
                  <a
                    href={event.hrefLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="primary-button w-full gap-2 md:w-auto"
                    aria-label={`Read more about ${event.title} (opens in a new tab)`}
                  >
                    Read more
                    <Icon path="M13.5 4.5H19.5V10.5M19 5L10 14M6.75 6.75H5.25A2.25 2.25 0 003 9V18.75A2.25 2.25 0 005.25 21H15A2.25 2.25 0 0017.25 18.75V17.25" className="h-4 w-4" />
                  </a>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};


const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [formStatus, setFormStatus] = useState('');
  const [isOpeningEmail, setIsOpeningEmail] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { name, email, message } = formData;
    const subject = `Contact Form Inquiry from ${name}`;
    const body = `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`;
    const mailtoLink = `mailto:contact@legallakrids.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setIsOpeningEmail(true);
    setFormStatus('Opening your email app with this message…');
    window.setTimeout(() => {
      window.location.href = mailtoLink;
      setIsOpeningEmail(false);
    }, 150);
  };

  return (
    <section id="contact" className="section-muted scroll-mt-20 py-20 sm:py-28">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-lg mx-auto lg:max-w-none lg:grid lg:grid-cols-2 lg:gap-24">
          <div className="text-left">
            <p className="eyebrow">Start a conversation</p>
            <h2 className="mt-3 text-4xl font-semibold tracking-tight text-stone-950 sm:text-5xl">Get in Touch</h2>
            <p className="mt-5 text-lg leading-relaxed text-stone-600">
              We're here to help. Whether you have a question about our events, are interested in contributing an article, or have a media inquiry, please reach out.
            </p>
            <div className="mt-8 space-y-6">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <Icon path="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" className="h-6 w-6 text-gray-500" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">Email</h3>
                  <p className="mt-1 text-base text-gray-600">General Inquiries: <a href="mailto:contact@legallakrids.com" className="text-gray-800 hover:underline">contact@legallakrids.com</a></p>
                  <p className="mt-1 text-base text-gray-600">Media: <a href="mailto:press@legallakrids.com" className="text-gray-800 hover:underline">press@legallakrids.com</a></p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <Icon path="M21 10.5c0 7.142-7.5 11.25-7.5 11.25S6 17.642 6 10.5a7.5 7.5 0 1115 0z M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" className="h-6 w-6 text-gray-500" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">Office</h3>
                  <p className="mt-1 text-base text-gray-600">Matrikel1, Højbro Pl. 10</p>
                  <p className="mt-1 text-base text-gray-600">1200 København K, Denmark</p>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-16 lg:mt-0">
            <form onSubmit={handleSubmit} className="premium-card space-y-5 p-6 sm:p-8">
              <div>
                <label htmlFor="name" className="mb-2 block text-sm font-semibold text-stone-800">Full name</label>
                <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} required autoComplete="name" className="block min-h-12 w-full rounded-xl border border-stone-300 bg-white px-4 text-stone-950 shadow-sm transition-colors placeholder:text-stone-400 hover:border-stone-400 focus:border-[#9a7441] focus:outline-none" placeholder="Your name" />
              </div>
              <div>
                <label htmlFor="email" className="mb-2 block text-sm font-semibold text-stone-800">Email</label>
                <input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required autoComplete="email" className="block min-h-12 w-full rounded-xl border border-stone-300 bg-white px-4 text-stone-950 shadow-sm transition-colors placeholder:text-stone-400 hover:border-stone-400 focus:border-[#9a7441] focus:outline-none" placeholder="you@example.com" />
              </div>
              <div>
                <label htmlFor="message" className="mb-2 block text-sm font-semibold text-stone-800">Message</label>
                <textarea id="message" name="message" rows="5" value={formData.message} onChange={handleChange} required className="block w-full resize-y rounded-xl border border-stone-300 bg-white px-4 py-3 text-stone-950 shadow-sm transition-colors placeholder:text-stone-400 hover:border-stone-400 focus:border-[#9a7441] focus:outline-none" placeholder="How can we help?"></textarea>
              </div>
              <div>
                <button type="submit" disabled={isOpeningEmail} className="primary-button w-full disabled:cursor-wait disabled:opacity-60">
                  {isOpeningEmail ? 'Opening email…' : 'Compose email'}
                </button>
              </div>
              <p className="min-h-5 text-center text-sm text-stone-600" role="status" aria-live="polite">
                {formStatus}
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

const PrivacyPolicyPage = ({ onGoHome }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="pt-24 bg-white min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={onGoHome}
            className="mb-8 cursor-pointer inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors font-medium"
          >
            <Icon path="M10 19l-7-7m0 0l7-7m-7 7h18" className="h-5 w-5 mr-2" />
            Back
          </button>
          <article>
            <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-8 tracking-tight">Privacy Policy</h1>
            <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed space-y-6 text-justify">
              <p className="text-gray-600">Last Updated: 24.10.2025</p>
              
              <p className="mt-6">
                Welcome to Legal Lakrids! Your privacy matters to us, and we want to be transparent about how we collect, use, and protect your personal information when you visit our site. We keep things simple and transparent, so here's everything you need to know.
              </p>
              <p>
                If you have any questions, feel free to refer to Section 10 below for our contact details.
              </p>

              <h2 className="text-2xl font-bold mt-8 mb-4">1. What Information We Collect</h2>
              <p>When you visit our website, we only collect the basics to provide our services:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Personal Information:</strong> This could be anything you provide directly, like your name, surname, email address, or other details you provide to us when you sign up to our newsletter or events, or contact us via our contact form.</li>
                <li><strong>Automatically Collected Data:</strong> We may also gather certain technical information like your IP address, browser type, device information, and browsing behavior. This helps us improve your experience.</li>
                <li><strong>Cookies and Tracking:</strong> We use cookies to personalize your visit and remember your preferences. If you don't want cookies, you can manage them through your browser settings.</li>
              </ul>

              <h2 className="text-2xl font-bold mt-8 mb-4">2. Why We Collect Your Data</h2>
              <p>We use the information we collect for several reasons:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>To Provide Our Services:</strong> We need your information to answer your questions, and know who and how many people are attending our events.</li>
                <li><strong>To Improve Your Experience:</strong> Your data helps us enhance the user experience by understanding how people use our website.</li>
                <li><strong>Marketing and Communication:</strong> With your consent, we may send you updates, or other marketing materials. You can opt out anytime.</li>
              </ul>

              <h2 className="text-2xl font-bold mt-8 mb-4">3. How We Protect Your Data</h2>
              <p>
                We take the security of your personal information seriously. We use industry-standard security measures to protect your data, though please keep in mind no method of online data transmission is 100% secure. Rest assured, we're committed to safeguarding your information.
              </p>

              <h2 className="text-2xl font-bold mt-8 mb-4">4. Your Rights Under GDPR</h2>
              <p>If you are in the European Union (EU), you have several important rights when it comes to your personal data. Here's a quick rundown:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Right of Access:</strong> You can request to see what personal information we hold about you, as well as a copy of said data.</li>
                <li><strong>Right to Rectification:</strong> If your information is inaccurate or incomplete, you can ask us to update it.</li>
                <li><strong>Right to Erasure:</strong> You can ask us to delete your personal data, although there may be exceptions (like if we still need the data for legal or business purposes).</li>
                <li><strong>Right to Restrict Processing:</strong> You can ask us to limit how we process your data in certain situations.</li>
                <li><strong>Right to Data Portability:</strong> You can request a copy of your personal data in a structured, commonly used format.</li>
                <li><strong>Right to Object:</strong> You can object to us processing your data, for example for direct marketing purposes.</li>
              </ul>
              <p className="mt-4">
                If you'd like to exercise any of these rights, simply get in touch with us (see Section 10 below for our contact details).
              </p>

              <h2 className="text-2xl font-bold mt-8 mb-4">5. Who We Share Your Data With</h2>
              <p>We do not sell or rent your personal information to any third parties.</p>

              <h2 className="text-2xl font-bold mt-8 mb-4">6. International Data Transfers</h2>
              <p>
                As we're based in Copenhagen, Denmark, your personal data is processed here. If you're located outside of the EU, rest assured that we take the necessary steps to ensure your data is protected, in line with EU regulations.
              </p>

              <h2 className="text-2xl font-bold mt-8 mb-4">7. Third-Party Links</h2>
              <p>
                Our website may link to third-party websites that we don't control. These sites have their own privacy policies, so we encourage you to review them before sharing any personal information with them.
              </p>

              <h2 className="text-2xl font-bold mt-8 mb-4">8. Children's Privacy</h2>
              <p>
                Our website is not designed for children, and we do not knowingly collect personal information from anyone under 16. If we discover that we have inadvertently collected such information, we will delete it as soon as possible.
              </p>

              <h2 className="text-2xl font-bold mt-8 mb-4">9. Changes to This Privacy Policy</h2>
              <p>
                We may update this Privacy Policy from time to time. Any changes will be posted on this page with a revised date. We encourage you to review this policy periodically for updates.
              </p>

              <h2 className="text-2xl font-bold mt-8 mb-4">10. Contact Us</h2>
              <p>
                If you have any questions, concerns, or want to exercise your rights under the GDPR, we're here to help. Just reach out to us at:
              </p>
              <p className="mt-2">
                Email: <a href="mailto:contact@legallakrids.com" className="text-gray-900 hover:text-gray-600 underline">contact@legallakrids.com</a>
              </p>
            </div>
          </article>
        </div>
      </div>
    </div>
  );
};

const Footer = ({ setActiveSection, onPrivacyPolicyClick, onGoHome, isInteriorPage }) => {
  const handleNavClick = (section) => {
    const scrollToSection = () => {
      const element = document.getElementById(section);
      if (element) {
        setActiveSection(section);
        element.scrollIntoView({ behavior: 'smooth' });
      }
    };

    if (isInteriorPage) {
      onGoHome({ restoreScroll: false });
      setTimeout(scrollToSection, 100);
      return;
    }

    scrollToSection();
  };

  return (
    <footer className="bg-gray-800 text-white">
      <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          <div className="space-y-8 xl:col-span-1">
            <h2 className="text-3xl font-bold tracking-tight">Legal Lakrids</h2>
            <p className="text-gray-300 text-base">
              For the acquired taste in law
            </p>
            <div className="flex space-x-6">
              <a href="https://www.linkedin.com/company/legal-lakrids/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
                <span className="sr-only">LinkedIn</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="https://www.facebook.com/profile.php?id=61580814195148" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
                <span className="sr-only">Facebook</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                </svg>
              </a>
            </div>
          </div>
          <div className="mt-12 grid grid-cols-2 gap-8 xl:mt-0 xl:col-span-2">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold text-gray-200 tracking-wider uppercase">Navigation</h3>
                <ul className="mt-4 space-y-4">
                  <li><a href="#about" onClick={(e) => { e.preventDefault(); handleNavClick('about'); }} className="text-base text-gray-300 hover:text-white cursor-pointer">About</a></li>
                  <li><a href="#blog" onClick={(e) => { e.preventDefault(); handleNavClick('blog'); }} className="text-base text-gray-300 hover:text-white cursor-pointer">Blog</a></li>
                </ul>
              </div>
              <div className="mt-12 md:mt-0">
                <h3 className="text-sm font-semibold text-gray-200 tracking-wider uppercase">&nbsp;</h3>
                <ul className="mt-4 space-y-4">
                  <li><a href="#events" onClick={(e) => { e.preventDefault(); handleNavClick('events'); }} className="text-base text-gray-300 hover:text-white cursor-pointer">Events</a></li>
                  <li><a href="#contact" onClick={(e) => { e.preventDefault(); handleNavClick('contact'); }} className="text-base text-gray-300 hover:text-white cursor-pointer">Contact</a></li>
                </ul>
              </div>
            </div>
            <div className="md:grid md:grid-cols-1 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold text-gray-200 tracking-wider uppercase">Legal</h3>
                <ul className="mt-4 space-y-4">
                  <li><a href="#privacy" onClick={(e) => { e.preventDefault(); onPrivacyPolicyClick(); }} className="text-base text-gray-300 hover:text-white cursor-pointer">Privacy Policy</a></li>
                  {/* <li><a href="#" className="text-base text-gray-300 hover:text-white">Terms of Service</a></li> */}
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-12 border-t border-gray-700 pt-8">
          <p className="text-base text-gray-400 xl:text-center">&copy; {new Date().getFullYear()} LegalLakrids.com. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

// --- Main App Component ---

export default function App() {
  const [activeSection, setActiveSection] = useState('home');
  const [currentArticleId, setCurrentArticleId] = useState(null);
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);
  const [pendingScrollRestore, setPendingScrollRestore] = useState(null);
  const [transitioningArticleId, setTransitioningArticleId] = useState(null);

  // Memoize articles to prevent unnecessary re-renders
  const articles = useMemo(() => [
    {
      title: 'Green Hydrogen Regulation in DK and the EU in the Landscape of the Energy Transition',
      author: 'Lou',
      date: '2025-11-11',
      id: 'green-hydrogen-regulation-in-dk-and-the-eu-in-the-landscape-of-the-energy-transition',
      category: 'Energy Law',
      imageUrl: 'https://images.unsplash.com/photo-1558366763-f22476ba6fac?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0',
      summary: 'Are we truly ready for green hydrogen? A quick read on how the EU and DK are facing regulatory, technical and sociopolitical challenges, from industry and academic experts',
      content: `
      The event brought together environmental engineers, industry and landscape planning experts to critically discuss green hydrogen regulation within the EU’s current energy strategy, and its challenges in Denmark specifically.

While green hydrogen is often portrayed as a silver bullet for decarbonisation, it also faces major barriers to deployment. High costs, lack of infrastructure, and the absence of a natural demand-side market, but also a weak regulatory framework to support it. Only recently was green hydrogen acquired a legal definition as part of RFNBOs (Renewable Fuels of Non-Biological Origin), introduced by [RED II (Renewable Energy Directive II)](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=uriserv:OJ.L_.2018.328.01.0082.01.ENG&toc=OJ:L:2018:328:TOC), with its additional sustainability criteria of additionality (Article 5) and temporal and geographic correlation (Article 7). While green hydrogen avoids fossil fuels, it introduces new resource challenges, particularly around water use.

The experts also raised the ethical question of whether regulation-compliant large-scale energy infrastructure projects should proceed despite lacking legitimacy from the local community ([“Wind turbines or the bats?”](https://maritime-executive.com/article/counting-bats-and-uncertain-permits-puts-danish-wind-farm-on-hold) ).

This seminar was part of the [Regulatory Innovation to Incentivize Green Hydrogen (RIGHydro)](https://jura.ku.dk/clima/research/righydro/) project, hosted by the Center for Climate Change Law and Governance at the University of Copenhagen and led by Beatriz Martinez Romera.
      `,
    },
    {
      title: 'Danish M&A Pulse: Market Overview',
      author: 'Cristina',
      date: '2025-11-19',
      id: 'danish-ma-pulse-market-overview',
      category: 'Mergers & Acquisitions',
      imageUrl: 'https://images.unsplash.com/photo-1506787497326-c2736dde1bef?q=80&w=992&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      summary: 'The Danish M&A market has shown resilience and adaptability in the face of global economic uncertainties, with a notable increase in deal activity and strategic investments across various sectors.',
      content: `
      The Danish mergers and acquisitions landscape maintained its strong activity level through the second half of 2025, driven primarily by themes of digital transformation, sector consolidation, and strategic expansion. Despite global macroeconomic uncertainties, the Nordic market's stability and strong pool of private equity dry powder continued to fuel deal flow. The Financial Services, Technology, and Automotive sectors witnessed some of the most significant and transformative transactions, establishing strong foundations for the 2026 market.

      **Transactions Overview**
      
      1. Financial Services: The Mega-Merger to Create AL Sydbank

      → **Transaction:** Merger Agreement
      → **Acquirer/Surviving Entity:** Sydbank
      → **Target Entities:** Arbejdernes Landsbank and Vestjysk Bank
      → **Details:** Announced in late October 2025, this three-way merger is set to create AL Sydbank, positioning it as one of Denmark’s five largest financial institutions. The deal structure aims to combine the local roots of the three banks into a nationwide entity.
      → **Strategic Impact:** This deal signals a major consolidation phase within the highly competitive Danish banking sector, focusing on creating a powerhouse capable of competing with larger Nordic players.
      → [Source](https://www.globenewswire.com/news-release/2025/10/27/3174315/0/en/Sydbank-Arbejdernes-Landsbank-and-Vestjysk-Bank-enter-into-merger-agreement.html)

      2. Technology (GRC Software): Keensight Capital Acquires Decision Focus

      → **Transaction:** Majority Acquisition
      → **Acquirer:** Keensight Capital (European Growth Buyout Firm)
      → **Target:** Decision Focus (Governance, Risk & Compliance Software)
      → **Details:** French private equity firm Keensight Capital acquired a majority stake in Danish-headquartered **Decision Focus** from **VIA equity**. Decision Focus is a key provider of a no-code Governance, Risk, and Compliance (GRC) software platform, primarily serving the financial services and insurance industries globally. The transaction was reportedly valued at nearly **DKK 1 billion**.
      → **Strategic Impact:** This deal highlights the strong global investor appetite for Nordic B2B SaaS companies
      → [Source](https://keensight.com/keensight-capital-signs-an-agreement-to-acquire-decision-focus-a-leading-governance-risk-compliance-software-developer/)

      3. Industrial Distribution: Solar's Strategic Norwegian Expansion

      → **Transaction:** Acquisition
      → **Acquirer:** Solar A/S (Denmark)
      → **Target:** Sonepar Norge AS (Norway)
      → **Details:** Danish sourcing and services company Solar agreed to acquire 100% of Sonepar Norge, a Norwegian B2B distributor of electrical materials, for an enterprise value of DKK 315 million. Sonepar Norge, a subsidiary of the French Sonepar Group, has an annual revenue of approximately DKK 700 million.
      → **Strategic Impact:** The acquisition is a bolt-on transaction designed to be transformative for Solar’s Norwegian operations. 
      → [Source](https://investorshangout.com/solar-as-announces-share-offering-and-strategic-acquisition-moves-454569-/)

      4. Automotive & Transport: Semler Group Enters Heavy Transport

      → **Transaction:** Acquisition
      → **Acquirer:** Semler Gruppen A/S (Denmark)
      → **Target:** MAN Truck & Bus Danmark A/S
      → **Details:** Denmark's largest automotive group, Semler Gruppen (importer of VW, Audi, etc.), acquired MAN Truck & Bus Danmark, the Danish importer and distributor for MAN and Neoplan trucks, vans, and buses. The move marks Semler’s strategic entry into the heavy transport segment and strengthens its existing van business. The transaction is pending approval by competition authorities.
      → **Strategic Impact:** This acquisition is part of Semler’s broader strategy to diversify its mobility portfolio and secure a leading position in the commercial vehicle market, aligning with the industry's shift toward sustainable transport solutions.
      → [Source](https://accura.dk/en/cases/semler-gruppen-acquires-man-truck-bus-danmark/)

      **Conclusion: Momentum into the New Year**

      The M&A activity across the latter half of 2025 demonstrates the **resilience and strategic depth** of the Danish corporate sector. Financial services consolidation, the continued growth of the TMT sector via private equity backing, and industrial players seeking to bolster their regional market shares were key themes. As these newly merged and acquired entities enter 2026, the focus will shift from deal completion to **successful integration**, with the goal of unlocking the significant synergies and market opportunities that underpinned these high-profile transactions. 

      `
      },
    {
      title: 'Accura Open House with Legal Lakrids',
      author: 'Cristina',
      id: 'accura-open-house-with-legal-lakrids',
      category: 'Events',
      date: '2025-11-12',
      imageUrl: 'https://images.unsplash.com/photo-1515169067868-5387ec356754?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=2070',
      summary: 'Accura Open House Event provided ambitious students and recent graduates with an honest insight into the dynamic life of a lawyer within one of Denmark\'s leading law firms.',
      content: `
      Last week, Legal Lakrids had the pleasure of attending the Accura Open House Event, an occasion tailored for ambitious students and recent graduates. The event offered an unparalleled, honest insight into the dynamic and multifaceted life of a lawyer, assistant attorney, or student within one of Denmark's preeminent law firms. It served as a crucial bridge for the next generation of legal professionals, providing a realistic glimpse into the demands and rewards of a career in law.

Organized by ElsaCopenhagen, the event was strategically designed to foster meaningful connections and facilitate candid discussions. Attendees were granted direct access to Accura's diverse and experienced employees, spanning an impressive breadth of 13 specialized areas of law. This direct interaction provided an exceptional opportunity for participants to engage in substantive discussions and receive personalized guidance on a wide array of critical topics. These included advice on navigating the complexities of the job search, refining thesis and bachelor writing skills, understanding the nuances of exchange and secondment programs, and exploring the international opportunities available within the global legal landscape. 

The atmosphere was vibrant and engaging, with Accura's lawyers dedicating their time to interact directly with the attendees. They readily answered questions about their current projects, offering detailed accounts of their day-to-day responsibilities and the intellectual challenges they encounter.

This Open House Event proved to be an exceptionally beneficial experience for the audience. It offered a profound opportunity to gain a deeper understanding of the exacting standards and diverse skills required to thrive as a lawyer in a leading international law firm. Crucially, the event also provided a platform for attendees to articulate their motivations and aspirations directly to Accura’s lawyers, potentially forging connections that could lead to future career opportunities. This was particularly pertinent given that Accura had already opened its application portal, making the event a timely and strategic avenue for talent acquisition.

In a forward-thinking addition this year, a dedicated stand was established to provide advice on leveraging LinkedIn. Guests received tailored guidance on how to effectively utilize the professional networking platform to build and strengthen their profiles, connect with industry leaders, and discover new opportunities. 

The Accura Open House Event thus stood as a comprehensive and highly effective platform for both recruitment and professional development, solidifying Accura's reputation as a firm committed to cultivating future legal talent.


      `,
    },
    {
      title: 'Breakfast with Martin Sheinin over international legal theory - and practice',
      id: 'breakfast-with-martin-sheinin-over-international-legal-theory-and-practice',
      category: 'International Law',
      summary: 'Breakfast evolved from a presentation on how facts and norms interact in international law, to a conversation on the current applications of these theories in today’s delicate political climate.',
      date: '2025-11-10',
      imageUrl: 'https://images.unsplash.com/photo-1623334044303-241021148842?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=2070',
      author: 'Lou',
      content: `
      Martin Sheinin, renowned expert in Human Rights Law, delighted University of Copenhagen community members and guests with a lecture on the separation of facts and norms in international law. Sheinin spoke about the use and categorization of sources of international law, and “norm formulations.” In the absence of an established hierarchy of norms, he argued that legal reasoning in international law should follow a “bottom-up” rather than a “top-down” approach, allowing the facts of the case to narrow the scope of applicable law. 

The conversation evolved into a rich discussion on different schools of legal thought. Scheinin reflected on how positivism, as developed during the Napoleonic era, relies on normative coherence; hermeneutics, by contrast, are satisfied with mere persuasion; while legal realism tends to overly compromise the distinction between laws and norms, allowing power to dictate law. A tangible example of legal realism, Sheinin noted, is the European Court of Human Rights considering State practices as lawful solely because they are lawful under their own jurisdictions, since States are “masters of the truth.”

Once Scheinin opened the floor, attendees started a lively debate on the International Court of Justice’s reference to the [ICRC’s customary international humanitarian law study](https://ihl-databases.icrc.org/en/customary-ihl/v1) in its recent [Advisory Opinion on Israel’s Obligations in Occupied Palestinian Territory](https://www.icj-cij.org/case/196). The group generally agreed that the study would be relevant insofar as it accurately reflected State practice, and noted that, in this case, its true value laid in compelling States to respond to it during the proceedings.

The last question to Martin was on Hungary’s noncompliance with Netanyahu’s arrest warrant. In this case, the Hungarian government argued that the Rome Statute is not incorporated into Hungarian national law. The attendee who posed the question noted that in this day and age, it appears positivism and normative coherence are on the low, and that human rights are becoming no longer self-explanatory. To which Martin answered, **“don’t predict the future!”** 
      `,
    },
    {
      id: 'quick-must-knows-on-the-danish-and-eu-stricter-merger-control',
      category: 'Competition Law',
      title: 'Quick must-knows on the Danish (and EU) stricter merger control',
      summary: 'The Danish Competition and Consumer Authority (DCCA) has recently begun using its new "call-in" power to require notification for mergers that fall below regular financial thresholds.',
      author: 'Lou',
      date: '2025-10-24',
      imageUrl: 'https://freerangestock.com/sample/169061/close-up-of-yellow-and-black-road-markings.jpg',
      content: `On August 26th and 27th, the **Danish Competition and Consumer Authority (DCCA)** issued its first two decisions exercising their "call-in" power for mergers that fall below the thresholds of Article 12(1) of the Danish Competition Act (DCA).

The recently amended [Article 12 DCA (paragraph 6)](https://en.kfst.dk/media/s4ybfdap/the-danish-competition-act-1150-af-03112024.pdf) grants the DCCA power to require notification of mergers that fall below the “regular” thresholds established in its first paragraph, when: (i) the parties’ combined Danish turnover exceeds DKK 50 million (≈ €6.5 m), and (ii) the deal risks significantly impeding effective competition. 

Once the DCCA becomes “aware” of a merger, they have 15 working days to decide whether to call it in, and no later than three months after signing (extendable to six after closing in exceptional cases). In the Uber/Dantaxi case, although the merger had been closed since May, the DCCA decided that it raised enough competition concerns in the taxi dispatch and transport markets to require notification three months later. Ann Sofie Vrang, Head of Division at the DCCA, shared with us that the Danish authority is aware of a merger once they have received sufficient information to call-in or not. In Uber/Dantaxi, the merger was closed shortly after signature, and the DCCA didn’t have the necessary information until August to call them in. 

This follows a broader trend across national authorities in the EU toward increased scrutiny of below-threshold mergers, and is likely due to both a gap left by the [CJEU Illuma/Grail judgement](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=celex:62022CJ0611) (on the application of Article 22 EUMR), and a growing awareness that, under regular thresholds, innovation-driven deals could escape review despite harming competition. Nevertheless, in their most recent call-in decision (OneMed/Kirstine Hardam), the DCCA targeted the medical supplies/ostomy‐care products market, indicating that call-in powers will not be confined to digital or high-tech sectors.
**Key takeaways:**

The recent Danish decisions signal that below‑threshold merger control is no longer theoretical in Denmark, it’s operational. Combined with evolving EU restrictions, the message to M&A practitioners is clear: even if the regular quantitative thresholds are not met, there is a non‑negligible risk of regulatory intervention. 

For companies active in Denmark (or across the European Union) merger checklists should therefore include:

- Always conduct a **competition risk assessment** regardless of thresholds, try to ask: “Could this merger significantly impede effective competition?”. Especially in cross-border deals, monitor national rules in each jurisdiction for call‑in powers or similar below‑threshold mechanisms.

- **Consider early dialogue with competition authorities** and ensure documentation of reasoning in case intervention arises. In the case of the DCCA, they have been receiving several inquiries since the application of this new rule.  

- **For deals already closed** (like the Uber case), calling‑in may lead to stand‑still obligations (or even unwinding risks),  reinforcing that deal clearance processes must factor in below‑threshold risk.

**Particularly relevant for SPA / transaction timeline planning**: (i) possible notification requirement, (ii) standstill implications, (iii) timeline delays.
    
[Competition Authority Requires Uber and Dantaxi Merger to Be Notified](https://en.kfst.dk/nyheder/kfst/english/decisions/2025/20250826-competition-authority-requires-uber-and-dantaxi-merger-to-be-notified)
    [Competition Authority Requires Notification of OneMed and Kirstine Hardam Merger](https://en.kfst.dk/nyheder/kfst/english/decisions/2025/20250827-competition-authority-requires-notification-of-onemed-and-kirstine-hardam-merger)  
    `
    },
    {
      id: 'legal-lakrids-highlights-at-techtorget-2025-the-inevitable-integration-of-ai',
      category: 'Legal Events',
      title: 'Legal Lakrids Highlights at TechTorget 2025: The Inevitable Integration of AI',
      summary: 'At TechTorget 2025, Legal Lakrids explored the transformative impact of AI on the legal landscape, emphasizing the need for adaptation and ethical considerations in this rapidly evolving field.',
      author: 'Cristina',
      date: '2025-10-30',
      imageUrl: 'https://images.unsplash.com/photo-1560439514-4e9645039924?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=2070',
      content: `
      Hosted at Dansk Industri in Copenhagen, the 2025 TechTorget event successfully brought together the legal community to address critical advancements in legal technology and AI.
      
Legal Lakrids was front and center at this event, which focused on technology's dynamic intersection with law and business. The gathering highlighted how innovative IT solutions offer a direct pathway to significantly enhance the quality, efficiency, and profitability of legal services throughout the Nordic region and globally.

The main stage featured a balanced and representative panel, bringing together diverse perspectives from law firms, such as **DLA Piper Denmark, Gorrissen Federspiel, Kromann Reumert, and Poul Schmith Kammeradvokaten**; companies, such as **PwC Danmark and Wordsmith AI Academy; the Danish Bar and Law Society; Djøf Advokat**; and non-profit organizations, like **Copenhagen Legal Tech**. 

The session involved asking each panelist about their current attitude towards AI and its practical applications. Christina Bruun Geertsen from **Kromann Reumert** noted a significant attitude change in the last 12 months, attributing the shift primarily to AI’s growing importance to clients, making adoption a business imperative rather than a theoretical luxury.

Andrew Hjuler Crichton from **Advokatsamfundet** stressed the importance of maintaining professional ethics and client confidentiality as AI tools become ubiquitous. He emphasized that AI should be viewed as an assistant that augments, but never replaces, the core judgment and responsibility of the lawyer.

Beyond the main stage, the conference hall was buzzing with activity, featuring numerous stands showcasing the latest tools and innovations in legal technology, such as Legora (AI contract review), **Juristic Jurimesh** (eDiscovery solutions), **Single Draft** (document automation), and **Thomson Reuters** (legal research and software).

The clear message from TechTorget 2025 is that the question is no longer whether AI will change legal practice, but how fast and how comprehensively. Legal professionals are actively moving past initial hesitation and embracing the digital tools necessary to secure their competitive edge in a global market defined by efficiency.

The panelists included:
- Andrew Hjuler Crichton, Generalsekretær, Advokatsamfundet

- Laura Jeffords Greenberg, Head of Wordsmith AI Academy

- Marlene Winther Plas, Partner, Head of IPT, DLA Piper Denmark

- Benedikte Bolvig Lund, Vice Chairman, Djøf Advokat

- Lena Ernlund Malmberg, Partner - Head of NewLaw | PwC Legal Business Solutions | PwC Denmark

- Martin André Dittmer, Managing Partner, Gorrissen Federspiel

- Christina Bruun Geertsen, Managing Partner, Kromann Reumert

- Stine Mangor Tornmark, Co-founder and CEO, legaltech-startup Openli

- Cathrine Wollenberg Zittan, Partner/lawyer, Poul Schmith Kammeradvokaten

      `,
    },
    {
      title: 'Legal Lakrids highlights at "Google 15 Years On – Key Learnings, Antitrust Challenges, and the Road Ahead"',
      id: 'legal-lakrids-highlights-at-google-15-years-on-key-learnings-antitrust-challenges-and-the-road-ahead',
      category: 'Legal Events',
      author: 'Lou',
      date: '2025-11-04',
      imageUrl: 'https://images.unsplash.com/photo-1482881497185-d4a9ddbe4151?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1065',
      summary: 'The Copenhagen Competition Law Lab hosted a colloquium on the Google Shopping case, fifteen years after the European Commission’s official initiation of proceedings against Google.',
      content: `
      Last Monday at CBS Law Faculty, the Copenhagen Competition Law Lab hosted a colloquium on the Google Shopping case, fifteen years after the European Commission’s [official initiation of proceedings](https://ec.europa.eu/competition/antitrust/cases/dec_docs/39768/39768_430_6.pdf) against Google. Although the case was resolved by the European Court of Justice (ECJ) in 2024, follow-on litigation is ongoing.

      **Lawrence B. Landman**, Senior Vice President at Lateral Link’s Bridgeline Solutions and Director of its Antitrust Division, introduced the event by recalling that the [Google Shopping decision](https://ec.europa.eu/competition/antitrust/cases/dec_docs/39740/39740_14996_3.pdf) was among the first to find any infringement from Google (second only to a 2016 decision by Russia’s Federal Antimonopoly Service), and since then almost every jurisdiction has opened an investigation into their conduct. 

      **Paul L. Csizár**, Senior Advisor at Brunswick and former Director at DG COMP, opened the discussion by highlighting the relevance of timeliness for **effective remedies** - the “holy grail” of antitrust. Csizár commented on how the European Commission cannot afford to take five years (as they reportedly do now), if they want to avoid their decisions becoming obsolete before enforcement. 

      Csizár gave a brief overview of the original investigation led by Commissioner Alumnia, and the four original areas of concern: self-preferencing, content scraping, advertising exclusivity, and data portability. Once Vestager took charge as the European Commissioner for Competition, she reviewed the [tentative settlement](https://ec.europa.eu/competition/antitrust/cases/dec_docs/39740/39740_8608_5.pdf), narrowed the investigation to comparison shopping services, and imposed a €2.42 billion fine for self-preferencing in 2017, which was upheld through all appeals until [the 2024 ECJ judgment](https://curia.europa.eu/juris/document/document.jsf?text=&docid=289925&pageIndex=0&doclang=en&mode=req&dir=&occ=first&part=1&cid=918179). 

      **Christian Bergqvist**, Associate Professor at Copenhagen University, followed with a dynamic presentation on the broader concerns behind Google’s conduct. He concluded with a warning that Google’s competitive pressure to train its AI (especially from rival OpenAI’s ChatGPT) could imply IP infringements.
      
      After a short break, **Yuka Aoyagi**, Professor at Hosei University and Visiting Fellow at the European University Institute, analysed the Japanese approach to Google’s conduct. She discussed the evolving dynamics of digital markets in Japan and the implications for global enforcement.
      
      **John M. Yun**, Professor at George Mason University, critiqued [the U.S. Federal Trade Commission’s (FTC) consideration](https://www.ftc.gov/system/files/documents/public_statements/295971/130103googlesearchstmtofcomm.pdf) of Google’s self-preferencing in Search as "procompetitive." In 2024, [a US district court shifted the focus](https://files.lbr.cloud/public/2024-08/045110819896.pdf?VersionId=mHMw8uSvPbFCwl.7.yAY8wRXM0.UCmrD%23page=8) from self preferencing to the exclusivity of Google’s distribution agreements and the “power of defaults;” including a 22-year-old agreement with Apple of USD 20 billion in yearly payments, feature limits, and a Right of First Refusal on Apple’s ad ambitions.

      **Alfonso Lamadrid**, Antitrust and Competition Partner at Latham & Watkins, talked about the **Google Android** case, examining Google’s practices of (i) requiring manufacturers to preinstall Google Search and Chrome, (ii) paying manufacturers and mobile operators to preinstall Google Search exclusively, and (iii) restricting the development of alternative open-source versions of Android. Divergent from the FTC’s interpretation, the EU analysis centered on whether these practices had exclusionary effects regardless of any alleged countervailing efficiencies. In light of the Court’s decision to exempt the as-efficient competitor test (AEC) from their assessment of preinstallation obligations [(par 777 to 788)](https://curia.europa.eu/juris/document/document.jsf?text=&docid=265421&pageIndex=0&doclang=EN&mode=lst&dir=&occ=first&part=1&cid=11519767), Lamadrid raised a question on the applicability of AEC to tying cases. 
      
      **Jorge Padilla**, Partner at Compass Lexecon, discussed private enforcement and Google’s role in the AdTech sector. He noted that Google simultaneously acts as a buyer, seller, and operator of the digital advertising marketplace, a structure many enforcers, including DG COMP and the U.S. Department of Justice, view as a conflict of interest. While only the [French Competition Authority](https://www.autoritedelaconcurrence.fr/fr/decision/relative-des-pratiques-mises-en-oeuvre-dans-le-secteur-de-la-publicite-sur-internet-0) has formally found an infringement so far, several damages claims have already been filed.

      **Fernando Castillo de la Torre**, Competition team Director in the European Commission Legal Service, discussed the recent [Android Auto case](https://curia.europa.eu/juris/document/document.jsf?text=&docid=295687&pageIndex=0&doclang=EN&mode=req&dir=&occ=first&part=1&cid=654147), where Google denied access to JuicePass, an electrical vehicle charging app. The ECJ held that the traditional test of “indispensability” does not apply to platforms designed to host third-party apps, in which case evidence of capability to restrict competition is sufficient - even in dynamic markets without clearly defined downstream markets. Justifications may include safety or technical reasons, but firms should pursue alternatives under a “fair and proportionate” standard.

      **Johannes Wick**, counsel at Geradin Partners, discussed the procedural technicalities behind civil litigation against Google across the EU, while Stijn Huijts, also of Geradin Partners, talked about Google’s use of third-party content in both search results and AI products, potentially straddling IP and antitrust boundaries.

      Finally, **Giorgio Monti**, Professor at Tilburg Law School, outlined the challenges the Digital Markets Act faces in regulating Google and other gatekeepers, and offered recommendations to improve the regulatory dialogue.

      `
    }
  ], []); // Empty dependency array since articles are static

  useEffect(() => {
    const previousScrollRestoration = window.history.scrollRestoration;
    window.history.scrollRestoration = 'manual';
    return () => {
      window.history.scrollRestoration = previousScrollRestoration;
    };
  }, []);

  useEffect(() => {
    if (currentArticleId || showPrivacyPolicy || pendingScrollRestore === null) {
      return;
    }

    const animationFrame = window.requestAnimationFrame(() => {
      window.scrollTo(0, pendingScrollRestore);
      setPendingScrollRestore(null);
    });

    return () => window.cancelAnimationFrame(animationFrame);
  }, [currentArticleId, pendingScrollRestore, showPrivacyPolicy]);

  // Handle deep linking on page load and URL changes
  useEffect(() => {
    const handleLocationChange = (event) => {
      const hash = window.location.hash;
      if (hash.startsWith('#article/')) {
        const articlePath = hash.replace('#article/', '');
        const matchingArticle = articles.find(article => article.id === articlePath);
        if (matchingArticle) {
          setCurrentArticleId(articlePath);
        } else {
          // Only redirect to home if no matching article is found
          window.history.replaceState(null, '', window.location.pathname);
          setCurrentArticleId(null);
        }
      } else if (hash === '#privacy-policy') {
        setShowPrivacyPolicy(true);
      } else {
        setCurrentArticleId(null);
        setShowPrivacyPolicy(false);
        const savedScrollPosition = window.history.state?.homeScrollY;
        if (
          Number.isFinite(savedScrollPosition) &&
          (!event || event.type === 'popstate')
        ) {
          setPendingScrollRestore(savedScrollPosition);
        }
      }
    };

    // Handle initial load
    handleLocationChange();

    // Listen for hash changes
    window.addEventListener('hashchange', handleLocationChange);
    window.addEventListener('popstate', handleLocationChange);
    return () => {
      window.removeEventListener('hashchange', handleLocationChange);
      window.removeEventListener('popstate', handleLocationChange);
    };
  }, [articles]); // Add articles as dependency since we use it in the effect

  const startArticleTransition = (direction, articleId, update) => {
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (!document.startViewTransition || prefersReducedMotion) {
      update();
      return;
    }

    flushSync(() => setTransitioningArticleId(articleId));
    document.documentElement.dataset.articleTransition = direction;

    const transition = document.startViewTransition(update);
    const cleanUpTransition = () => {
      delete document.documentElement.dataset.articleTransition;
      setTransitioningArticleId(null);
    };
    transition.finished.then(cleanUpTransition, cleanUpTransition);
  };

  const handleArticleSelect = (id) => {
    const homeScrollY = window.scrollY;

    const openArticle = () => {
      window.history.replaceState(
        { ...window.history.state, homeScrollY },
        '',
        window.location.href
      );
      window.history.pushState(
        { view: 'article', fromHome: true, homeScrollY },
        '',
        `#article/${id}`
      );
      flushSync(() => setCurrentArticleId(id));
      window.scrollTo(0, 0);
    };

    startArticleTransition('forward', id, openArticle);
  };

  const handleGoHome = ({ restoreScroll = true } = {}) => {
    if (restoreScroll && window.history.state?.fromHome) {
      const articleId = currentArticleId;
      const homeScrollY = window.history.state.homeScrollY;

      const returnToArticleCard = () => {
        window.history.back();
        flushSync(() => {
          setCurrentArticleId(null);
          setShowPrivacyPolicy(false);
          setPendingScrollRestore(null);
        });
        window.scrollTo(0, homeScrollY);
      };

      startArticleTransition('back', articleId, returnToArticleCard);
      return;
    }

    setPendingScrollRestore(null);
    setCurrentArticleId(null);
    setShowPrivacyPolicy(false);
    window.history.replaceState(
      { view: 'home' },
      '',
      window.location.pathname
    );
  };

  const handleRelatedArticleSelect = (id) => {
    const switchArticle = () => {
      window.history.replaceState(
        { ...window.history.state, view: 'article' },
        '',
        `#article/${id}`
      );
      flushSync(() => setCurrentArticleId(id));
      window.scrollTo(0, 0);
    };

    startArticleTransition('forward', null, switchArticle);
  };

  const selectedArticle = currentArticleId
    ? {
        ...articles.find(a => a.id === currentArticleId),
        isTransitioning: transitioningArticleId === currentArticleId
      }
    : null;
  const relatedArticles = selectedArticle
    ? articles
        .filter((article) => article.id !== selectedArticle.id)
        .sort((a, b) => {
          const aMatchesCategory = a.category === selectedArticle.category ? 1 : 0;
          const bMatchesCategory = b.category === selectedArticle.category ? 1 : 0;
          return bMatchesCategory - aMatchesCategory || new Date(b.date) - new Date(a.date);
        })
        .slice(0, 3)
    : [];

  const handlePrivacyPolicyClick = () => {
    setShowPrivacyPolicy(true);
    window.history.pushState(null, '', '#privacy-policy');
  };

  const handleGoHomeFromPrivacy = () => {
    setShowPrivacyPolicy(false);
    window.history.pushState(null, '', window.location.pathname);
  };

  return (
    <div className="bg-white">
      <Header
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        onGoHome={handleGoHome}
        isInteriorPage={Boolean(currentArticleId || showPrivacyPolicy)}
      />
      <main>
        {showPrivacyPolicy ? (
          <PrivacyPolicyPage onGoHome={handleGoHomeFromPrivacy} />
        ) : selectedArticle ? (
          <ArticlePage
            article={selectedArticle}
            onGoHome={handleGoHome}
            relatedArticles={relatedArticles}
            onRelatedArticleSelect={handleRelatedArticleSelect}
          />
        ) : (
          <>
            {/* SEO: Native meta tags for the homepage */}
            <title>Legal Lakrids | Scandinavian Legal Events & Insights</title>
            <meta name="description" content="Legal Lakrids is the essential platform for legal professionals in Scandinavia, offering expert analysis, critical commentary, and events in Copenhagen and beyond." />

            <Hero />
            <FadeInSection><About /></FadeInSection>
            <FadeInSection><Events /></FadeInSection>
            <FadeInSection>
              <Blog
                articles={articles}
                onArticleSelect={handleArticleSelect}
                transitioningArticleId={transitioningArticleId}
              />
            </FadeInSection>
            <FadeInSection><Founders /></FadeInSection>
            <FadeInSection><Contact /></FadeInSection>
          </>
        )}
      </main>
      <Footer
        setActiveSection={setActiveSection}
        onPrivacyPolicyClick={handlePrivacyPolicyClick}
        onGoHome={handleGoHome}
        isInteriorPage={Boolean(currentArticleId || showPrivacyPolicy)}
      />
    </div>
  )
}