import { useEffect, useState } from 'react';
import { flushSync } from 'react-dom';
import { articles } from '../data/articles.js';
import { scrollInstantlyTo } from '../utils/scroll.js';

export const useSiteNavigation = () => {
  const [activeSection, setActiveSection] = useState('home');
  const [currentArticleId, setCurrentArticleId] = useState(null);
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);
  const [pendingScrollRestore, setPendingScrollRestore] = useState(null);
  const [transitioningArticleId, setTransitioningArticleId] = useState(null);

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
      scrollInstantlyTo(pendingScrollRestore);
      setPendingScrollRestore(null);
    });

    return () => window.cancelAnimationFrame(animationFrame);
  }, [currentArticleId, pendingScrollRestore, showPrivacyPolicy]);

  useEffect(() => {
    const handleLocationChange = (event) => {
      const hash = window.location.hash;
      if (hash.startsWith('#article/')) {
        const articleId = hash.replace('#article/', '');
        if (articles.some((article) => article.id === articleId)) {
          setCurrentArticleId(articleId);
        } else {
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

    handleLocationChange();
    window.addEventListener('hashchange', handleLocationChange);
    window.addEventListener('popstate', handleLocationChange);
    return () => {
      window.removeEventListener('hashchange', handleLocationChange);
      window.removeEventListener('popstate', handleLocationChange);
    };
  }, []);

  const startArticleTransition = (direction, articleId, update) => {
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (!document.startViewTransition || prefersReducedMotion) {
      update();
      return null;
    }

    flushSync(() => setTransitioningArticleId(articleId));
    document.documentElement.dataset.articleTransition = direction;

    const transition = document.startViewTransition(update);
    const cleanUpTransition = () => {
      delete document.documentElement.dataset.articleTransition;
      setTransitioningArticleId(null);
    };
    transition.finished.then(cleanUpTransition, cleanUpTransition);
    return transition;
  };

  const openArticle = (id) => {
    const homeScrollY = window.scrollY;
    startArticleTransition('forward', id, () => {
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
      scrollInstantlyTo(0);
    });
  };

  const goHome = ({ restoreScroll = true } = {}) => {
    if (restoreScroll && window.history.state?.fromHome) {
      const homeScrollY = window.history.state.homeScrollY;
      const transition = startArticleTransition('back', currentArticleId, () => {
        flushSync(() => {
          setCurrentArticleId(null);
          setShowPrivacyPolicy(false);
          setPendingScrollRestore(null);
        });
        scrollInstantlyTo(homeScrollY);
      });

      if (transition) {
        transition.finished.then(
          () => window.history.back(),
          () => window.history.back()
        );
      } else {
        window.history.back();
      }
      return;
    }

    setPendingScrollRestore(null);
    setCurrentArticleId(null);
    setShowPrivacyPolicy(false);
    window.history.replaceState({ view: 'home' }, '', window.location.pathname);
  };

  const openRelatedArticle = (id) => {
    startArticleTransition('forward', null, () => {
      window.history.replaceState(
        { ...window.history.state, view: 'article' },
        '',
        `#article/${id}`
      );
      flushSync(() => setCurrentArticleId(id));
      scrollInstantlyTo(0);
    });
  };

  const openPrivacyPolicy = () => {
    setShowPrivacyPolicy(true);
    window.history.pushState(null, '', '#privacy-policy');
  };

  const closePrivacyPolicy = () => {
    setShowPrivacyPolicy(false);
    window.history.pushState(null, '', window.location.pathname);
  };

  const selectedArticle = currentArticleId
    ? {
        ...articles.find((article) => article.id === currentArticleId),
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

  return {
    activeSection,
    closePrivacyPolicy,
    goHome,
    isInteriorPage: Boolean(currentArticleId || showPrivacyPolicy),
    openArticle,
    openPrivacyPolicy,
    openRelatedArticle,
    relatedArticles,
    selectedArticle,
    setActiveSection,
    showPrivacyPolicy,
    transitioningArticleId
  };
};
