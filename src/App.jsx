import React, { useState, useEffect, useRef } from 'react';
import heroVideo from './assets/videos/hero-video.mp4';
import logo from './assets/images/logo.png';


// --- Helper Components ---

// Icon component for consistent icon styling
const Icon = ({ path, className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d={path} />
  </svg>
);

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
            className={`transition-opacity duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
        >
            {children}
        </div>
    );
};


// --- Article Page Component ---

const ArticlePage = ({ article, onGoHome }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [article]);

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
              <p className="text-base font-semibold text-gray-600">{article.category}</p>
              <h1 className="mt-2 text-3xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight">{article.title}</h1>
              <div className="text-sm text-gray-500 mb-8">
                <span>By {article.author}</span> &middot; <span>{article.date}</span>
              </div>
              {/* Added the article image to the top of the page */}
              <img 
                src={article.imageUrl} 
                alt={article.title} 
                className="w-full h-auto max-h-[500px] object-cover rounded-lg shadow-lg mb-12" 
                onError={(e) => { e.target.onerror = null; e.target.src=`https://placehold.co/1200x600/e2e8f0/4a5568?text=Image+Not+Found`; }}
              />
              <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed space-y-6">
                {article.content.split('\n').map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </article>
        </div>
      </div>
    </div>
  );
};

// --- Main Section Components ---

const Header = ({ setActiveSection, onGoHome, currentArticleId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Don't make header transparent on article pages
      if (currentArticleId) {
        setIsScrolled(true);
        return;
      }
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check on initial load
    return () => window.removeEventListener('scroll', handleScroll);
  }, [currentArticleId]);

  const navLinks = ["About", "Blog", "Events", "Contact"];

  const handleNavClick = (section) => {
    const sectionId = section.toLowerCase();
    
    const scrollToSection = () => {
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    if (currentArticleId) {
        onGoHome();
        // Wait for the main page to re-render before trying to scroll
        setTimeout(scrollToSection, 100);
    } else {
        scrollToSection();
    }

    setActiveSection(sectionId);
    setIsOpen(false);
  };

  const handleLogoClick = (e) => {
      e.preventDefault();
      if (currentArticleId) {
          onGoHome();
      } else {
          handleNavClick('home');
      }
  };
  
  const isOpaque = isScrolled || currentArticleId;

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isOpaque ? 'bg-white shadow-md' : 'bg-transparent'}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <a href="#home" onClick={handleLogoClick} className="block bg-white">
              <img src={logo} alt="Legal Lakrids Logo" className={`h-14 w-auto background-white`} />
            </a>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navLinks.map((link) => (
                <a
                  key={link}
                  href={`#${link.toLowerCase()}`}
                  onClick={(e) => { e.preventDefault(); handleNavClick(link); }}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isOpaque ? 'text-gray-700 hover:bg-gray-200' : 'text-gray-200 hover:bg-white hover:bg-opacity-20'}`}
                >
                  {link}
                </a>
              ))}
            </div>
          </div>
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className={`inline-flex items-center justify-center p-2 rounded-md focus:outline-none transition-colors ${isOpaque ? 'text-gray-800 hover:bg-gray-200' : 'text-white hover:bg-white hover:bg-opacity-20'}`}
              aria-controls="mobile-menu"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              <Icon path={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden" id="mobile-menu">
          <div className={`px-2 pt-2 pb-3 space-y-1 sm:px-3 ${isOpaque ? 'bg-white' : 'bg-gray-800 bg-opacity-90'}`}>
            {navLinks.map((link) => (
              <a
                key={link}
                href={`#${link.toLowerCase()}`}
                onClick={(e) => { e.preventDefault(); handleNavClick(link); }}
                className={`block px-3 py-2 rounded-md text-base font-medium ${isOpaque ? 'text-gray-700 hover:bg-gray-200' : 'text-gray-200 hover:bg-gray-700'}`}
              >
                {link}
              </a>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};

const Hero = () => {
    const [videoError, setVideoError] = useState(false);
    const videoRef = useRef(null);

    useEffect(() => {
        // Set the playback speed once the video element is available
        if (videoRef.current) {
            videoRef.current.playbackRate = 0.8; // Play at 75% of the original speed
        }
    }, []);

    const fallbackImageUrl = "https://images.unsplash.com/photo-1519751138087-5bf79df62d5b?q=80&w=2070&auto=format&fit=crop";

    return (
        <section 
            id="home" 
            className="relative h-screen flex items-center justify-center text-center overflow-hidden bg-center"
            style={videoError ? { backgroundImage: `url(${fallbackImageUrl})` } : {}}
        >
            {!videoError && (
                <video
                    ref={videoRef}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="absolute z-0 w-auto min-w-full min-h-full object-cover"
                    onError={() => setVideoError(true)}
                >
                    <source src={heroVideo} type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
            )}
            <div className="absolute inset-0 bg-opacity-50"></div>
            <div className="relative container mx-auto px-4 z-10">
                <div className="text-4xl md:text-6xl font-bold text-white mb-4 tracking-tight">
                    Legal Lakrids
                </div>
                <p className="text-lg md:text-xl text-gray-200 max-w-3xl mx-auto">
                    Your premier source for legal events, news, and analysis in Scandinavia.
                </p>
            </div>
        </section>
    );
};


const About = () => (
  <section id="about" className="bg-gray-50 py-20 sm:py-28">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">About LegalLakrids</h2>
            <p className="mt-4 text-lg text-gray-600">
                Your specialized partner in Scandinavian legal events and insights.
            </p>
        </div>
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <img 
              className="rounded-lg shadow-lg object-cover w-full h-full" 
              src="https://images.unsplash.com/photo-1585399058947-f68f9db58e5f?q=80&w=2070&auto=format&fit=crop"
              alt="Team collaborating in a modern office"
              onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/600x400/e2e8f0/4a5568?text=Our+Team'; }}
            />
          </div>
          <div className="prose prose-lg text-gray-600 text-justify">
              <p>
                Founded in Copenhagen, LegalLakrids was born from a desire to create a central platform for legal professionals across Denmark, Sweden, and Norway. We saw a need for high-quality, region-specific content and networking opportunities.
              </p>
              <br />
              <p>
                Our mission is to foster a connected and informed legal community. We achieve this by hosting premier events, publishing insightful articles from leading experts, and delivering timely news that impacts the Scandinavian legal sector.
              </p>
              <br />
               <p>
                Whether you're a seasoned partner, a rising associate, or an in-house counsel, LegalLakrids provides the resources and connections you need to excel.
              </p>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const Blog = ({ articles, onArticleSelect }) => {
    return (
        <section id="blog" className="bg-white py-20 sm:py-28">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-2xl mx-auto">
                    <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">From the Blog</h2>
                    <p className="mt-4 text-lg text-gray-600">
                        Latest articles and analysis from leading legal experts in Scandinavia.
                    </p>
                </div>
                <div className="mt-16 grid gap-12 max-w-lg mx-auto lg:grid-cols-3 lg:max-w-none">
                    {articles.map((article) => (
                        <div 
                            key={article.id} 
                            onClick={() => onArticleSelect(article.id)}
                            className="flex flex-col rounded-lg shadow-lg overflow-hidden group cursor-pointer"
                        >
                             <div className="flex-shrink-0">
                                <img className="h-48 w-full object-cover transform group-hover:scale-105 transition-transform duration-300" 
                                src={article.imageUrl} 
                                alt={article.title} 
                                onError={(e) => { e.target.onerror = null; e.target.src=`https://placehold.co/600x400/e2e8f0/4a5568?text=${article.category}`; }}
                                />
                            </div>
                            <div className="flex-1 bg-white p-6 flex flex-col justify-between">
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-gray-600">{article.category}</p>
                                    <div className="block mt-2">
                                        <p className="text-xl font-semibold text-gray-900 group-hover:text-gray-700">{article.title}</p>
                                        <p className="mt-3 text-base text-gray-500">{article.summary}</p>
                                    </div>
                                </div>
                                <div className="mt-6 flex items-center">
                                    <div className="text-sm text-gray-500">
                                        <span>{article.author}</span>
                                        <span className="mx-1">&middot;</span>
                                        <time dateTime={article.date}>{article.date}</time>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

const Events = () => {
  const events = [
    {
      title: 'Nordic Legal Tech Summit 2025',
      date: 'NOV 12, 2025',
      location: 'Copenhagen, Denmark',
      description: 'Join industry leaders to discuss the future of legal technology, innovation, and AI implementation in law firms.',
      icon: <Icon path="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
    },
    {
      title: 'Scandinavian Corporate Counsel Symposium',
      date: 'DEC 05, 2025',
      location: 'Stockholm, Sweden',
      description: 'An exclusive event for in-house counsel to network and explore the challenges of modern corporate governance.',
      icon: <Icon path="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21v-1a6 6 0 00-5.197-5.803" />
    }
  ];

  return (
    <section id="events" className="bg-gray-50 py-20 sm:py-28">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">Upcoming Events</h2>
          <p className="mt-4 text-lg text-gray-600">
            Connect with peers and gain valuable insights at our exclusive legal events across Scandinavia.
          </p>
        </div>
        <div className="mt-16 max-w-lg mx-auto sm:max-w-2xl lg:max-w-4xl space-y-8">
          {events.map((event) => (
            <div key={event.title} className="bg-white rounded-lg shadow-md overflow-hidden transition-shadow duration-300 hover:shadow-xl">
              <div className="p-6 md:flex md:items-center md:justify-between">
                <div className="md:flex-1">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-600">
                        {event.icon}
                      </div>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-semibold text-gray-800">{event.date}</p>
                      <p className="text-xs text-gray-500">{event.location}</p>
                    </div>
                  </div>
                  <h3 className="mt-4 text-xl font-semibold text-gray-900">{event.title}</h3>
                  <p className="mt-2 text-base text-gray-600">{event.description}</p>
                </div>
                <div className="mt-6 md:mt-0 md:ml-6 flex-shrink-0">
                  <button 
                    disabled
                    className="w-full md:w-auto inline-flex items-center justify-center px-5 py-2 border border-transparent text-base font-medium rounded-md text-white bg-gray-400 cursor-not-allowed"
                  >
                    Coming Soon
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};


const Contact = () => (
    <section id="contact" className="bg-white py-20 sm:py-28">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-lg mx-auto lg:max-w-none lg:grid lg:grid-cols-2 lg:gap-24">
                <div className="text-left">
                    <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">Get in Touch</h2>
                    <p className="mt-4 text-lg text-gray-600">
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
                                <p className="mt-1 text-base text-gray-600">Nyhavn 17, 1051</p>
                                <p className="mt-1 text-base text-gray-600">København K, Denmark</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="mt-16 lg:mt-0">
                    <form action="#" method="POST" className="space-y-6">
                        <div>
                            <label htmlFor="name" className="sr-only">Full name</label>
                            <input type="text" name="name" id="name" autoComplete="name" className="block w-full shadow-sm py-3 px-4 placeholder-gray-500 focus:ring-gray-500 focus:border-gray-500 border-gray-300 rounded-md" placeholder="Full name" />
                        </div>
                        <div>
                            <label htmlFor="email" className="sr-only">Email</label>
                            <input id="email" name="email" type="email" autoComplete="email" className="block w-full shadow-sm py-3 px-4 placeholder-gray-500 focus:ring-gray-500 focus:border-gray-500 border-gray-300 rounded-md" placeholder="Email" />
                        </div>
                        <div>
                            <label htmlFor="message" className="sr-only">Message</label>
                            <textarea id="message" name="message" rows="4" className="block w-full shadow-sm py-3 px-4 placeholder-gray-500 focus:ring-gray-500 focus:border-gray-500 border-gray-300 rounded-md" placeholder="Message"></textarea>
                        </div>
                        <div>
                            <button type="submit" className="inline-flex justify-center py-3 px-6 border border-transparent shadow-sm text-base font-medium rounded-md text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 w-full transition-colors duration-300">
                                Send Message
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </section>
);

const Footer = ({ setActiveSection }) => {
    const handleNavClick = (section) => {
        const element = document.getElementById(section);
        if (element) {
            setActiveSection(section);
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <footer className="bg-gray-800 text-white">
            <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <div className="xl:grid xl:grid-cols-3 xl:gap-8">
                    <div className="space-y-8 xl:col-span-1">
                        <h2 className="text-3xl font-bold tracking-tight">LegalLakrids</h2>
                        <p className="text-gray-300 text-base">
                            The premier source for legal news, articles, and events in Scandinavia.
                        </p>
                        <div className="flex space-x-6">
                            <a href="#" className="text-gray-400 hover:text-white">
                               <span className="sr-only">LinkedIn</span>
                               <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                    <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" />
                                </svg>
                            </a>
                            <a href="#" className="text-gray-400 hover:text-white">
                                <span className="sr-only">Twitter</span>
                                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.71v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                                </svg>
                            </a>
                        </div>
                    </div>
                    <div className="mt-12 grid grid-cols-2 gap-8 xl:mt-0 xl:col-span-2">
                        <div className="md:grid md:grid-cols-2 md:gap-8">
                            <div>
                                <h3 className="text-sm font-semibold text-gray-200 tracking-wider uppercase">Navigation</h3>
                                <ul className="mt-4 space-y-4">
                                    <li><a onClick={() => handleNavClick('about')} className="text-base text-gray-300 hover:text-white cursor-pointer">About</a></li>
                                    <li><a onClick={() => handleNavClick('blog')} className="text-base text-gray-300 hover:text-white cursor-pointer">Blog</a></li>
                                </ul>
                            </div>
                            <div className="mt-12 md:mt-0">
                                <h3 className="text-sm font-semibold text-gray-200 tracking-wider uppercase">&nbsp;</h3>
                                <ul className="mt-4 space-y-4">
                                    <li><a onClick={() => handleNavClick('events')} className="text-base text-gray-300 hover:text-white cursor-pointer">Events</a></li>
                                    <li><a onClick={() => handleNavClick('contact')} className="text-base text-gray-300 hover:text-white cursor-pointer">Contact</a></li>
                                </ul>
                            </div>
                        </div>
                         <div className="md:grid md:grid-cols-1 md:gap-8">
                            <div>
                                <h3 className="text-sm font-semibold text-gray-200 tracking-wider uppercase">Legal</h3>
                                <ul className="mt-4 space-y-4">
                                    <li><a href="#" className="text-base text-gray-300 hover:text-white">Privacy Policy</a></li>
                                    <li><a href="#" className="text-base text-gray-300 hover:text-white">Terms of Service</a></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="mt-12 border-t border-gray-700 pt-8">
                    <p className="text-base text-gray-400 xl:text-center">&copy; 2025 LegalLakrids.com. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

// --- Main App Component ---

export default function App() {
  const [setActiveSection] = useState('home');
  const [currentArticleId, setCurrentArticleId] = useState(null);

  // Consolidated and expanded article data as the single source of truth
  const articles = [
    {
        id: 1,
        category: 'Corporate Law',
        title: 'Navigating Cross-Border M&A in the Nordics',
        summary: 'A deep dive into the complexities and opportunities of mergers and acquisitions across Scandinavian borders.',
        author: 'Cristina',
        date: 'Oct 02, 2025',
        imageUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=2070&auto=format&fit=crop',
        content: 'The Scandinavian M&A market has shown remarkable resilience and dynamism in 2025. This analysis covers the key transactions that have defined the year, highlighting the sectors driving growth, such as renewable energy and technology. We examine the strategic rationales behind these deals and the evolving legal hurdles in cross-border acquisitions.\nFurthermore, the article provides an outlook on what to expect in the final quarter and into 2026, considering macroeconomic factors and regulatory shifts that could influence deal-making across the Nordic countries. It is essential reading for corporate lawyers, investment bankers, and business leaders.'
    },
    {
        id: 2,
        category: 'Tech & IP',
        title: 'The Rise of AI in Legal Tech: A Scandinavian Perspective',
        summary: 'Exploring how artificial intelligence is transforming legal practices in Sweden, Denmark, and Norway.',
        author: 'Lou',
        date: 'Sep 28, 2025',
        imageUrl: 'https://images.unsplash.com/photo-1504639725590-34d0984388bd?q=80&w=1974&auto=format&fit=crop',
        content: "The rapid advancement of artificial intelligence presents both unprecedented opportunities and significant challenges for the legal frameworks in the Nordic region. This article delves into the proactive steps being taken by governments in Denmark, Sweden, and Norway to create a regulatory environment that fosters innovation while safeguarding fundamental rights.\nWe will analyze the current legislative proposals, compare the Nordic approach to the EU's AI Act, and discuss the ethical considerations that legal professionals must navigate when integrating AI tools into their practice. From automated contract analysis to predictive justice, the landscape is shifting, and understanding these changes is crucial for any legal expert in the region."
    },
    {
        id: 3,
        category: 'Sustainability',
        title: 'ESG Compliance: What Scandinavian Firms Need to Know',
        summary: 'Key considerations for Environmental, Social, and Governance compliance for businesses in the region.',
        author: 'Cristina',
        date: 'Sep 15, 2025',
        imageUrl: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?q=80&w=2070&auto=format&fit=crop',
        content: "While the General Data-Protection Regulation (GDPR) set a global benchmark for data privacy, several Scandinavian nations are already looking at what comes next. This piece explores the innovative data protection laws being pioneered in the region, which often go above and beyond GDPR's requirements.\nWe focus on new concepts such as data sovereignty, the rights of digital individuals, and the responsibilities of corporations in an increasingly data-driven world. For legal professionals specializing in technology and data privacy, understanding this progressive legislative direction is not just beneficial—it's a necessity."
    }
  ];

  const handleArticleSelect = (id) => {
    setCurrentArticleId(id);
  };

  const handleGoHome = () => {
    setCurrentArticleId(null);
  };
  
  const selectedArticle = currentArticleId ? articles.find(a => a.id === currentArticleId) : null;

  return (
    <div className="bg-white">
      <Header 
        setActiveSection={setActiveSection}
        onGoHome={handleGoHome}
        currentArticleId={currentArticleId}
      />
      <main>
        {selectedArticle ? (
          <ArticlePage article={selectedArticle} onGoHome={handleGoHome} />
        ) : (
          <>
            <Hero />
            <FadeInSection><About /></FadeInSection>
            <FadeInSection><Blog articles={articles} onArticleSelect={handleArticleSelect} /></FadeInSection>
            <FadeInSection><Events /></FadeInSection>
            <FadeInSection><Contact /></FadeInSection>
          </>
        )}
      </main>
      <Footer setActiveSection={setActiveSection} />
    </div>
  )
}

