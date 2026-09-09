import { Footer } from './components/layout/Footer.jsx';
import { Header } from './components/layout/Header.jsx';
import { About } from './components/sections/About.jsx';
import { Blog } from './components/sections/Blog.jsx';
import { Contact } from './components/sections/Contact.jsx';
import { Events } from './components/sections/Events.jsx';
import { Founders } from './components/sections/Founders.jsx';
import { Hero } from './components/sections/Hero.jsx';
import { FadeInSection } from './components/ui/FadeInSection.jsx';
import { articles } from './data/articles.js';
import { useSiteNavigation } from './hooks/useSiteNavigation.js';
import { ArticlePage } from './pages/ArticlePage.jsx';
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage.jsx';

export default function App() {
  const {
    activeSection,
    closePrivacyPolicy,
    goHome,
    isInteriorPage,
    openArticle,
    openPrivacyPolicy,
    openRelatedArticle,
    relatedArticles,
    selectedArticle,
    setActiveSection,
    showPrivacyPolicy,
    transitioningArticleId
  } = useSiteNavigation();

  return (
    <div className="bg-white">
      <Header
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        onGoHome={goHome}
        isInteriorPage={isInteriorPage}
      />
      <main>
        {showPrivacyPolicy ? (
          <PrivacyPolicyPage onGoHome={closePrivacyPolicy} />
        ) : selectedArticle ? (
          <ArticlePage
            article={selectedArticle}
            onGoHome={goHome}
            relatedArticles={relatedArticles}
            onRelatedArticleSelect={openRelatedArticle}
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
                onArticleSelect={openArticle}
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
        onPrivacyPolicyClick={openPrivacyPolicy}
        onGoHome={goHome}
        isInteriorPage={isInteriorPage}
      />
    </div>
  )
}
