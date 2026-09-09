import { useState } from 'react';
import { Icon } from '../ui/Icon.jsx';

export const Contact = () => {
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
