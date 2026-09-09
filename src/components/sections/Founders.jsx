import cristina from '../../assets/images/cristina.jpeg';
import lou from '../../assets/images/lou.jpeg';

export const Founders = () => (
  <section id="founders" className="section-shell py-20 sm:py-28">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto text-center">
        <p className="eyebrow">The people behind it</p>
        <h2 className="mt-3 text-4xl font-semibold tracking-tight text-stone-950 sm:text-5xl">Meet the Founders</h2>
        <div className="mt-16 flex flex-col md:flex-row justify-center items-center gap-12 md:gap-20">
          <div className="flex flex-col items-center">
            <a
              href="https://www.linkedin.com/in/cristina-bostean/"
              target="_blank"
              rel="noopener noreferrer"
              className="group cursor-pointer rounded-[1.5rem]"
            >
              <img
                className="h-64 w-64 rounded-[1.5rem] object-cover shadow-[0_20px_50px_rgba(23,23,20,0.14)] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-1 group-hover:shadow-[0_26px_60px_rgba(23,23,20,0.2)]"
                src={cristina}
                alt="Cristina Bostean, co-founder of Legal Lakrids"
                loading="lazy"
                decoding="async"
              />
            </a>
            <h3 className="mt-6 text-xl font-semibold text-gray-800">Cristina Bostean</h3>
          </div>
          <div className="flex flex-col items-center">
            <a
              href="https://www.linkedin.com/in/louladoire/"
              target="_blank"
              rel="noopener noreferrer"
              className="group cursor-pointer rounded-[1.5rem]"
            >
              <img
                className="h-64 w-64 rounded-[1.5rem] object-cover shadow-[0_20px_50px_rgba(23,23,20,0.14)] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-1 group-hover:shadow-[0_26px_60px_rgba(23,23,20,0.2)]"
                src={lou}
                alt="Lou Ladoire, co-founder of Legal Lakrids"
                loading="lazy"
                decoding="async"
              />
            </a>
            <h3 className="mt-6 text-xl font-semibold text-gray-800">Lou Ladoire</h3>
          </div>
        </div>
        <div className="mx-auto mt-12 max-w-3xl space-y-5 text-left text-base leading-8 text-stone-600 sm:text-lg">
          <p>
            Cristina brings a strong M&A, corporate law and banking & finance background, shaped at PwC Romania and studies at the Sorbonne and University of Bucharest.
          </p>
          <p>
            Lou blends expertise in competition law, international arbitration, and cross-border regulatory work, honed at Uría Menéndez and IE Law School in Spain.
          </p>
          <p>
            They share a strong interest in the future of law, specifically AI and tech regulation, as well as the legal challenges in highly regulated industries like logistics, energy, and pharmaceuticals.
          </p>
        </div>
      </div>
    </div>
  </section>
);
