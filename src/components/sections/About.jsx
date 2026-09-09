export const About = () => (
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
