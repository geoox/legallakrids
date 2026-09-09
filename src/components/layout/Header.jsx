import { useEffect, useState } from 'react';
import logo from '../../assets/images/logo.png';
import { Icon } from '../ui/Icon.jsx';

export const Header = ({
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
