import { useEffect, useRef, useState } from 'react';
import heroVideo from '../../assets/videos/hero-video.mp4';
import { Icon } from '../ui/Icon.jsx';

export const Hero = () => {
  const [videoError, setVideoError] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const heroRef = useRef(null);
  const videoRef = useRef(null);

  useEffect(() => {
    const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updateMotionPreference = () => setPrefersReducedMotion(motionPreference.matches);
    updateMotionPreference();
    motionPreference.addEventListener('change', updateMotionPreference);
    return () => motionPreference.removeEventListener('change', updateMotionPreference);
  }, []);

  useEffect(() => {
    const heroElement = heroRef.current;
    const videoElement = videoRef.current;
    if (!heroElement || !videoElement) {
      return;
    }

    videoElement.playbackRate = 0.8;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          videoElement.play().catch(() => setVideoError(true));
        } else {
          videoElement.pause();
        }
      },
      { threshold: 0.05 }
    );

    observer.observe(heroElement);
    return () => observer.disconnect();
  }, [prefersReducedMotion]);

  const fallbackImageUrl = "https://images.unsplash.com/photo-1519751138087-5bf79df62d5b?q=80&w=2070&auto=format&fit=crop";
  const saveDataEnabled = navigator.connection?.saveData ?? false;
  const shouldShowVideo = !videoError && !prefersReducedMotion && !saveDataEnabled;

  return (
    <section
      ref={heroRef}
      id="home"
      className="relative flex h-[100svh] min-h-[680px] items-center justify-center overflow-hidden bg-cover bg-center text-center"
      style={{ backgroundImage: `url(${fallbackImageUrl})` }}
    >
      {shouldShowVideo && (
        <video
          ref={videoRef}
          loop
          muted
          playsInline
          preload="metadata"
          poster={fallbackImageUrl}
          className="absolute inset-0 z-0 h-full w-full object-cover"
          onError={() => setVideoError(true)}
        >
          <source src={heroVideo} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      )}
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,10,9,0.48)_0%,rgba(10,10,9,0.58)_52%,rgba(10,10,9,0.78)_100%)]"></div>
      <div className="relative z-10 mx-auto max-w-5xl px-5">
        <p className="mb-5 text-xs font-bold uppercase tracking-[0.24em] text-white/70">
          Scandinavian law · Ideas · Community
        </p>
        <h1 className="text-5xl font-semibold tracking-[-0.035em] text-white sm:text-6xl md:text-7xl lg:text-8xl">
          Legal Lakrids
        </h1>
        <p className="mx-auto mt-6 max-w-3xl text-lg leading-relaxed text-white/80 md:text-2xl">
          For the acquired taste in law: Your partner in Scandinavian legal events and insights.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a
            href="#blog"
            className="inline-flex min-h-12 items-center justify-center rounded-full bg-white px-6 text-sm font-bold text-stone-950 shadow-[0_16px_40px_rgba(0,0,0,0.24)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#f8f6f1] hover:shadow-[0_20px_50px_rgba(0,0,0,0.3)]"
          >
            Explore articles
            <Icon path="M17.25 6.75L21 10.5m0 0l-3.75 3.75M21 10.5H3" className="ml-2 h-4 w-4" />
          </a>
          <a href="#events" className="secondary-button">
            View events
          </a>
        </div>
      </div>
      <a
        href="#about"
        className="absolute bottom-7 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-white/60 transition-colors hover:text-white"
        aria-label="Scroll to learn more about Legal Lakrids"
      >
        Discover
        <span className="h-8 w-px bg-gradient-to-b from-white/80 to-transparent"></span>
      </a>
    </section>
  );
};
