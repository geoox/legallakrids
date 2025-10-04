import React, { useState, useEffect } from 'react';

// --- Helper Components ---

// Icon component for consistent icon styling
const Icon = ({ path, className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d={path} />
  </svg>
);

// --- Main Section Components ---

const Header = ({ activeSection, setActiveSection }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navLinks = ["About", "Blog", "Events", "Contact"];

  const linkClasses = (section) => 
    `cursor-pointer py-2 text-sm font-medium transition-colors duration-300 ${
      activeSection === section.toLowerCase() 
      ? 'text-gray-900 border-b-2 border-gray-900' 
      : 'text-gray-500 hover:text-gray-900'
    }`;

  return (
    <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <h1 
              onClick={() => setActiveSection('home')} 
              className="text-2xl font-bold text-gray-900 cursor-pointer tracking-tight"
            >
              LegalL<span className="text-gray-500">akrids</span>
            </h1>
          </div>
          <nav className="hidden md:flex md:items-center md:space-x-8">
            {navLinks.map(link => (
              <a key={link} onClick={() => setActiveSection(link.toLowerCase())} className={linkClasses(link)}>
                {link}
              </a>
            ))}
          </nav>
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-gray-500">
              <Icon path={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"} className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map(link => (
              <a 
                key={link} 
                onClick={() => {
                  setActiveSection(link.toLowerCase());
                  setIsOpen(false);
                }} 
                className={`block px-3 py-2 rounded-md text-base font-medium ${activeSection === link.toLowerCase() ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
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

const Hero = ({ setActiveSection }) => (
  <section id="home" className="bg-white">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
      <div className="max-w-3xl mx-auto text-center">
        <p className="text-base font-semibold text-gray-600 tracking-wider uppercase">
          Navigating Scandinavian Legal Landscapes
        </p>
        <h2 className="mt-2 text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl lg:text-6xl">
          Insightful Events, Articles & News
        </h2>
        <p className="mt-6 max-w-2xl mx-auto text-lg text-gray-500">
          LegalLakrids is your premier hub for legal professionals in Scandinavia, offering exclusive events, in-depth analysis, and the latest industry news.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <button onClick={() => setActiveSection('events')} className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gray-800 hover:bg-gray-900 transition-colors duration-300 shadow-md">
            Upcoming Events
          </button>
          <button onClick={() => setActiveSection('blog')} className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-300 shadow-md">
            Read Articles
          </button>
        </div>
      </div>
    </div>
  </section>
);

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
              src="https://images.unsplash.com/photo-1521737852577-6848d7a1b9f8?q=80&w=2070&auto=format&fit=crop"
              alt="Team collaborating in a modern office"
              onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/600x400/e2e8f0/4a5568?text=Our+Team'; }}
            />
          </div>
          <div className="prose prose-lg text-gray-600">
              <p>
                Founded in Copenhagen, LegalLakrids was born from a desire to create a central platform for legal professionals across Denmark, Sweden, and Norway. We saw a need for high-quality, region-specific content and networking opportunities.
              </p>
              <p>
                Our mission is to foster a connected and informed legal community. We achieve this by hosting premier events, publishing insightful articles from leading experts, and delivering timely news that impacts the Scandinavian legal sector.
              </p>
               <p>
                Whether you're a seasoned partner, a rising associate, or an in-house counsel, LegalLakrids provides the resources and connections you need to excel.
              </p>
          </div>
        </div>
      </div>
    </div>
  </section>
);


const Blog = () => {
    const articles = [
        {
            category: 'Corporate Law',
            title: 'Navigating Cross-Border M&A in the Nordics',
            date: 'Oct 02, 2025',
            author: 'Anja Sørensen',
            imageUrl: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=2232&auto=format&fit=crop',
            description: 'A deep dive into the complexities and opportunities of mergers and acquisitions across Scandinavian borders.'
        },
        {
            category: 'Tech & IP',
            title: 'The Rise of AI in Legal Tech: A Scandinavian Perspective',
            date: 'Sep 28, 2025',
            author: 'Björn Lindgren',
            imageUrl: 'https://images.unsplash.com/photo-1620712943543-95fc69634367?q=80&w=2070&auto=format&fit=crop',
            description: 'Exploring how artificial intelligence is transforming legal practices in Sweden, Denmark, and Norway.'
        },
        {
            category: 'Sustainability',
            title: 'ESG Compliance: What Scandinavian Firms Need to Know',
            date: 'Sep 15, 2025',
            author: 'Ingrid Olsen',
            imageUrl: 'https://images.unsplash.com/photo-1594788405208-a57933b5f36e?q=80&w=2070&auto=format&fit=crop',
            description: 'Key considerations for Environmental, Social, and Governance compliance for businesses in the region.'
        }
    ];

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
                        <div key={article.title} className="flex flex-col rounded-lg shadow-lg overflow-hidden group">
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
                                    <a href="#" className="block mt-2">
                                        <p className="text-xl font-semibold text-gray-900 group-hover:text-gray-700">{article.title}</p>
                                        <p className="mt-3 text-base text-gray-500">{article.description}</p>
                                    </a>
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
    },
    {
      title: 'Oslo ESG & Law Conference',
      date: 'JAN 22, 2026',
      location: 'Oslo, Norway',
      description: 'A critical look at the evolving landscape of ESG regulations and their impact on Scandinavian businesses.',
      icon: <Icon path="M13 10V3L4 14h7v7l9-11h-7z" />
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
                  <button className="w-full md:w-auto inline-flex items-center justify-center px-5 py-2 border border-transparent text-base font-medium rounded-md text-white bg-gray-800 hover:bg-gray-900 transition-colors duration-300">
                    Register Now
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
                               <Icon path="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" className="h-6 w-6 text-gray-500" />
                               <Icon path="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" className="h-6 w-6 text-gray-500" />
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


const Footer = ({ setActiveSection }) => (
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
                                <li><a onClick={() => setActiveSection('about')} className="text-base text-gray-300 hover:text-white cursor-pointer">About</a></li>
                                <li><a onClick={() => setActiveSection('blog')} className="text-base text-gray-300 hover:text-white cursor-pointer">Blog</a></li>
                            </ul>
                        </div>
                        <div className="mt-12 md:mt-0">
                            <h3 className="text-sm font-semibold text-gray-200 tracking-wider uppercase">&nbsp;</h3>
                            <ul className="mt-4 space-y-4">
                                <li><a onClick={() => setActiveSection('events')} className="text-base text-gray-300 hover:text-white cursor-pointer">Events</a></li>
                                <li><a onClick={() => setActiveSection('contact')} className="text-base text-gray-300 hover:text-white cursor-pointer">Contact</a></li>
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

// --- Main App Component ---

export default function App() {
  const [activeSection, setActiveSection] = useState('home');

  const scrollToSection = (sectionId) => {
    const sectionElement = document.getElementById(sectionId);
    if (sectionElement) {
        // A bit of offset to account for the sticky header
        const headerOffset = 80; 
        const elementPosition = sectionElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
            top: offsetPosition,
            behavior: "smooth"
        });
    }
  };

  useEffect(() => {
    if (activeSection && activeSection !== 'home') {
      scrollToSection(activeSection);
    } else if (activeSection === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth'});
    }
  }, [activeSection]);


  return (
    <div className="bg-white font-sans">
      <Header activeSection={activeSection} setActiveSection={setActiveSection} />
      <main>
        <Hero setActiveSection={setActiveSection} />
        <div id="about-container"><About /></div>
        <div id="blog-container"><Blog /></div>
        <div id="events-container"><Events /></div>
        <div id="contact-container"><Contact /></div>
      </main>
      <Footer setActiveSection={setActiveSection} />
    </div>
  )
}
