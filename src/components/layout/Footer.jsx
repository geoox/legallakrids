export const Footer = ({ setActiveSection, onPrivacyPolicyClick, onGoHome, isInteriorPage }) => {
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
