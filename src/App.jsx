import React, { useState, useEffect, useRef, useMemo } from 'react';
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
              <img
                src={article.imageUrl}
                alt={article.title}
                className="w-full h-auto max-h-[500px] object-cover rounded-lg shadow-lg mb-12"
                onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/1200x600/e2e8f0/4a5568?text=Image+Not+Found`; }}
              />
              <div
                className="prose prose-lg max-w-none text-gray-700 leading-relaxed space-y-6"
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
          </div>
        </div>
      </div>
    </>
  );
};

// --- Main Section Components ---

const Header = ({ setActiveSection, onGoHome, currentArticleId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (currentArticleId) {
        setIsScrolled(true);
        return;
      }
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();
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
        <div className="flex items-center justify-between h-20">
          <div className="flex-shrink-0">
            <a href="#home" onClick={handleLogoClick} className="block bg-white">
              <img src={logo} alt="Legal Lakrids Logo - Scandinavian Legal Events" className={`h-20 w-auto background-white`} />
            </a>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navLinks.map((link) => (
                <a
                  key={link}
                  href={`#${link.toLowerCase()}`}
                  onClick={(e) => { e.preventDefault(); handleNavClick(link); }}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isOpaque ? 'text-gray-700 hover:bg-gray-200' : 'text-gray-200 hover:bg-white hover:bg-opacity-20 hover:text-gray-700'}`}
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
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.8;
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
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 tracking-tight">
          Legal Lakrids
        </h1>
        <p className="text-lg md:text-2xl text-gray-200 max-w-3xl mx-auto">
          For the acquired taste in law: Your partner in Scandinavian legal events and insights.
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
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">About Legal Lakrids</h2>
          <p className="mt-4 text-lg text-gray-600">
            Your specialized partner in Scandinavian legal events and insights.
          </p>
        </div>
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <img
              className="rounded-lg shadow-lg object-cover w-full h-full"
              src="https://images.unsplash.com/photo-1585399058947-f68f9db58e5f?q=80&w=2070&auto=format&fit=crop"
              alt="Legal professionals collaborating on Scandinavian market movements"
              onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/600x400/e2e8f0/4a5568?text=Our+Team'; }}
            />
          </div>
          <div className="prose prose-lg text-gray-600 text-justify">
            <p>
              Founded by two EU-qualified lawyers based in Copenhagen, this is the essential platform for legal professionals looking to connect, collaborate, and critically engage with the field in Scandinavia.
              <br /> <br />
              Born from the belief that law is best understood when it's actively discussed, our mission is to foster a space for critical commentary and analysis of legal developments and market movements.
              <br /> <br />
              If you have a passion for law and a desire to engage with your peers, welcome home.
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const Founders = () => (
  <section id="founders" className="bg-white py-20 sm:py-28">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto text-center">
        <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">Meet the Founders</h2>
        <div className="mt-16 flex flex-col md:flex-row justify-center items-center gap-12 md:gap-20">
          <div className="flex flex-col items-center">
            <a
              href="https://www.linkedin.com/in/cristina-bostean/"
              target="_blank"
              rel="noopener noreferrer"
              className="group cursor-pointer"
            >
              <img
                className="h-64 w-64 rounded-xl object-cover shadow-xl transition-all duration-300 ease-in-out transform group-hover:scale-105"
                src={cristina}
                alt="Cristina Bostean, co-founder of Legal Lakrids"
              />
            </a>
            <h3 className="mt-6 text-xl font-semibold text-gray-800">Cristina Bostean</h3>
          </div>
          <div className="flex flex-col items-center">
            <a
              href="https://www.linkedin.com/in/louladoire/"
              target="_blank"
              rel="noopener noreferrer"
              className="group cursor-pointer"
            >
              <img
                className="h-64 w-64 rounded-xl object-cover shadow-xl transition-all duration-300 ease-in-out transform group-hover:scale-105"
                src={lou}
                alt="Lou Ladoire, co-founder of Legal Lakrids"
              />
            </a>
            <h3 className="mt-6 text-xl font-semibold text-gray-800">Lou Ladoire</h3>
          </div>
        </div>
        <div className="mt-12 max-w-4xl mx-auto text-lg text-gray-600 text-justify prose prose-lg">
          <p>
            Cristina brings a strong M&A, corporate law and banking & finance background, shaped at PwC Romania and studies at the Sorbonne and University of Bucharest.
          </p>
          <br />
          <p>
            Lou blends expertise in competition law, international arbitration, and cross-border regulatory work, honed at Uría Menéndez and IE Law School in Spain.
          </p>
          <br />
          <p>
            They share a strong interest in the future of law, specifically AI and tech regulation, as well as the legal challenges in highly regulated industries like logistics, energy, and pharmaceuticals.
          </p>
        </div>
      </div>
    </div>
  </section>
);

const Blog = ({ articles, onArticleSelect }) => {
  return (
    <section id="blog" className="bg-gray-50 py-20 sm:py-28">
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
                  onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/600x400/e2e8f0/4a5568?text=${article.category}`; }}
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
      title: 'TechTorget Danmark',
      date: 'OCT 8, 2025',
      location: '🇩🇰 Copenhagen, Denmark',
      description: 'Explore the transformative power of legal tech and AI in today\'s rapidly evolving global landscape.',
      isPast: true,
      icon: <Icon path="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
    },
    {
      title: 'Google 15 Years On – Key Learnings, Antitrust Challenges, and the Road Ahead',
      date: 'OCT 27, 2025',
      location: '🇩🇰 Copenhagen, Denmark',
      description: 'Reflect on the key lessons learned so far about Google, antitrust, and policing abusive actions in the tech sector.',
      icon: <Icon path="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21v-1a6 6 0 00-5.197-5.803" />
    },
    {
      title: 'Accura Open House',
      date: 'NOV 6, 2025',
      location: '🇩🇰 Alexandriagade 8, 2150, Nordhavn',
      description: 'Experience Accura’s innovative approach to legal services and network with industry professionals.',
      icon: <Icon path="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm0 5.25h.007v.008H3.75v-.008zm0 5.25h.007v.008H3.75v-.008z" />
    },
    {
      title: 'Breakfast Briefing with Martin Scheinin',
      date: 'NOV 6, 2025',
      location: '🇩🇰 Njalsgade 76, 2300 Copenhagen S',
      description: 'Norms, Sources and Facts in International Law: Some Reflections on Theory, Methodology and Practice',
      icon: <Icon path="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm0 5.25h.007v.008H3.75v-.008zm0 5.25h.007v.008H3.75v-.008z" />
    },
    {
      title: 'Course on Green Hydrogen Regulation',
      date: 'NOV 11, 2025',
      location: '🇩🇰 Room 8A.0.57 – Faculty of Law, University of Copenhagen',
      description: 'This hybrid course offers deep insights into the EU and Denmark’s Hydrogen laws and policies.',
      icon: <Icon path="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm0 5.25h.007v.008H3.75v-.008zm0 5.25h.007v.008H3.75v-.008z" />
    },
    {
      title: 'Nordic Ethics and Compliance Survey Launch',
      date: 'NOV 25, 2025',
      location: '🇩🇰 Axel Towers, Axel Torv 2, 1609 Copenhagen',
      description: 'Inspiration, new insights and great networking with peers in the ethics and compliance field.',
      icon: <Icon path="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm0 5.25h.007v.008H3.75v-.008zm0 5.25h.007v.008H3.75v-.008z" />
    },
  ];

  return (
    <section id="events" className="bg-white py-20 sm:py-28">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">Events</h2>
          <p className="mt-4 text-lg text-gray-600">
            Connect with peers and gain valuable insights at legal events across Scandinavia.
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
                    Sign up
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


const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { name, email, message } = formData;
    const subject = `Contact Form Inquiry from ${name}`;
    const body = `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`;
    const mailtoLink = `mailto:contact@legallakrids.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoLink;
  };

  return (
    <section id="contact" className="bg-gray-50 py-20 sm:py-28">
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
                  <p className="mt-1 text-base text-gray-600">Matrikel1, Højbro Pl. 10</p>
                  <p className="mt-1 text-base text-gray-600">1200 København K, Denmark</p>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-16 lg:mt-0">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="sr-only">Full name</label>
                <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} required autoComplete="name" className="block w-full shadow-sm py-3 px-4 placeholder-gray-500 focus:ring-gray-500 focus:border-gray-500 border-gray-300 rounded-md" placeholder="Full name" />
              </div>
              <div>
                <label htmlFor="email" className="sr-only">Email</label>
                <input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required autoComplete="email" className="block w-full shadow-sm py-3 px-4 placeholder-gray-500 focus:ring-gray-500 focus:border-gray-500 border-gray-300 rounded-md" placeholder="Email" />
              </div>
              <div>
                <label htmlFor="message" className="sr-only">Message</label>
                <textarea id="message" name="message" rows="4" value={formData.message} onChange={handleChange} required className="block w-full shadow-sm py-3 px-4 placeholder-gray-500 focus:ring-gray-500 focus:border-gray-500 border-gray-300 rounded-md" placeholder="Message"></textarea>
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
};

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

  // Memoize articles to prevent unnecessary re-renders
  const articles = useMemo(() => [
    {
      id: 'quick-must-knows-on-the-danish-and-eu-stricter-merger-control',
      category: 'Competition Law',
      title: 'Quick must-knows on the Danish (and EU) stricter merger control',
      summary: 'The Danish Competition and Consumer Authority (DCCA) has recently begun using its new "call-in" power to require notification for mergers that fall below regular financial thresholds.',
      author: 'Lou',
      date: '2025-10-24',
      imageUrl: 'https://lh3.googleusercontent.com/drive-storage/AJQWtBPuTy54rxWVIyOAwcx3K5nDh2ywEnsdmfF59th3PHH8Fh3kae0T_P8SL1DLccx4elbMyjyt6J-Jz-ZGiE0wKU9amlkt5eATYWimCqJPj-ZKwDg=w3008-h1660',
      content: `On August 26th and 27th, the **Danish Competition and Consumer Authority (DCCA)** issued its first two decisions exercising their "call-in" power for mergers that fall below the thresholds of Article 12(1) of the Danish Competition Act (DCA).

The recently amended [Article 12 DCA (paragraph 6)](https://en.kfst.dk/media/s4ybfdap/the-danish-competition-act-1150-af-03112024.pdf) grants the DCCA power to require notification of mergers that fall below the "regular" thresholds established in its first paragraph, when: (i) the parties' combined Danish turnover exceeds DKK 50 million (≈ €6.5 m), and (ii) the deal risks significantly impeding effective competition.

Once the DCCA becomes “aware” of a merger, they have 15 working days to decide whether to call it in, and no later than three months after signing (extendable to six after closing in exceptional cases). In the Uber/Dantaxi case, although the merger had been closed since May, the DCCA decided that it raised enough competition concerns in the taxi dispatch and transport markets to require notification three months later. Ann Sofie Vrang, Head of Division at the DCCA, shared with us that the Danish authority considers to be aware of a merger once they have received sufficient information to decide on whether to call-in or not. In Uber/Dantaxi, the merger was closed shortly after signature, and the DCCA didn’t have the necessary information until August to call them in. 

This follows a broader trend across national authorities in the EU toward increased scrutiny of below-threshold mergers, and is likely due to both a gap left by the [CJEU Illuma/Grail](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=celex:62022CJ0611) judgement (on the application of Article 22 EUMR), and a growing awareness that, under regular thresholds, innovation-driven deals could escape review despite harming competition. Nevertheless, in their most recent call-in decision (OneMed/Kirstine Hardam), the DCCA targeted the medical supplies/ostomy‐care products market, indicating that call-in powers will not be confined to digital or high-tech sectors.

**Key takeaways:**

The Danish decisions of 26/27 August signal that below‑threshold merger control is no longer theoretical in Denmark, it’s operational. Combined with evolving EU restrictions, the message to M&A practitioners is clear: even if the regular quantitative thresholds are not met, there is a non‑negligible risk of regulatory intervention. 

For companies active in Denmark (or across the European Union) merger checklists should therefore include:

- Always conduct a **competition risk assessment** regardless of thresholds, try to ask: “Could this merger significantly impede effective competition?”. Especially in cross-border deals, monitor national rules in each jurisdiction for call‑in powers or similar below‑threshold mechanisms.

- **Consider early dialogue with competition authorities** and ensure documentation of reasoning in case intervention arises. In the case of the DCCA, they have been receiving several inquiries since the application of this new rule.  

- **For deals already closed** (like the Uber case), calling‑in may lead to stand‑still obligations (or even unwinding risks),  reinforcing that deal clearance processes must factor in below‑threshold risk.

**Particularly relevant for SPA / transaction timeline planning**: (i) possible notification requirement, (ii) standstill implications, (iii) timeline delays.`
    },
  ], []); // Empty dependency array since articles are static

  // Handle deep linking on page load and URL changes
  useEffect(() => {
    const handleLocationChange = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#article/')) {
        const articleId = parseInt(hash.replace('#article/', ''), 10);
        if (!isNaN(articleId) && articles.some(article => article.id === articleId)) {
          setCurrentArticleId(articleId);
        } else {
          // Invalid article ID, redirect to home
          window.history.replaceState(null, '', window.location.pathname);
          setCurrentArticleId(null);
        }
      } else {
        setCurrentArticleId(null);
      }
    };

    // Handle initial load
    handleLocationChange();

    // Listen for hash changes
    window.addEventListener('hashchange', handleLocationChange);
    return () => window.removeEventListener('hashchange', handleLocationChange);
  }, [articles]); // Add articles as dependency since we use it in the effect

  const handleArticleSelect = (id) => {
    setCurrentArticleId(id);
    window.history.pushState(null, '', `#article/${id}`);
  };

  const handleGoHome = () => {
    setCurrentArticleId(null);
    window.history.pushState(null, '', window.location.pathname);
  };

  const selectedArticle = currentArticleId ? articles.find(a => a.id === currentArticleId) : null;

  return (
    // The HelmetProvider wrapper is now removed.
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
            {/* SEO: Native meta tags for the homepage */}
            <title>Legal Lakrids | Scandinavian Legal Events & Insights</title>
            <meta name="description" content="Legal Lakrids is the essential platform for legal professionals in Scandinavia, offering expert analysis, critical commentary, and events in Copenhagen and beyond." />

            <Hero />
            <FadeInSection><About /></FadeInSection>
            <FadeInSection><Events /></FadeInSection>
            <FadeInSection><Blog articles={articles} onArticleSelect={handleArticleSelect} /></FadeInSection>
            <FadeInSection><Founders /></FadeInSection>
            <FadeInSection><Contact /></FadeInSection>
          </>
        )}
      </main>
      <Footer setActiveSection={setActiveSection} />
    </div>
  )
}