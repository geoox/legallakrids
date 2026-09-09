import { useEffect } from 'react';
import { Icon } from '../components/ui/Icon.jsx';

export const PrivacyPolicyPage = ({ onGoHome }) => {
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
