import { useEffect, useState, useRef, useCallback } from 'react';
import { AnimatePresence, motion as m } from 'framer-motion';
// reference to m to satisfy unused variable checks in some strict configs
void m;
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

// Config
const SLIDES = [
  {
    id: 1,
    img: '/HB1.jpg',
    heading: 'Discover Meaningful Connections',
    sub: 'Curated biodatas. Authentic people. Secure experience.',
    cta: 'Explore Biodatas',
    to: '/biodatas'
  },
  {
    id: 2,
    img: '/HB2.jpg',
    heading: 'Where Stories Begin',
    sub: 'Build your profile and let the right people find you.',
    cta: 'Create Your Profile',
    to: '/register'
  },
  {
    id: 3,
    img: '/HB3.jpg',
    heading: 'Trust. Transparency. Tradition.',
    sub: 'Modern matchmaking rooted in cultural values.',
    cta: 'Learn More',
    to: '/about-us'
  }
];

const INTERVAL = 6000; // ms

export default function HeroSlider() {
  const [index, setIndex] = useState(0);
  const timerRef = useRef(null);
  const [paused, setPaused] = useState(false);

  const next = useCallback(() => {
    setIndex(i => (i + 1) % SLIDES.length);
  }, []);

  const prev = () => {
    setIndex(i => (i - 1 + SLIDES.length) % SLIDES.length);
  };

  // Autoplay
  useEffect(() => {
    if (paused) return; // don't run while paused
    timerRef.current && clearTimeout(timerRef.current);
    timerRef.current = setTimeout(next, INTERVAL);
    return () => clearTimeout(timerRef.current);
  }, [index, next, paused]);

  // Swipe / drag support (simplified - rely on pointer events)
  const startPos = useRef(null);
  const onPointerDown = (e) => { startPos.current = e.clientX; };
  const onPointerUp = (e) => {
    if (startPos.current == null) return;
    const delta = e.clientX - startPos.current;
    if (Math.abs(delta) > 60) {
      if (delta < 0) next(); else prev();
    }
    startPos.current = null;
  };

  // Keyboard navigation
  const onKeyDown = (e) => {
    if (e.key === 'ArrowRight') { next(); setPaused(true); }
    if (e.key === 'ArrowLeft') { prev(); setPaused(true); }
  };

  return (
    <section
      className="relative w-full h-[58vh] xs:h-[60vh] sm:h-[68vh] lg:h-[78vh] 2xl:h-[82vh] overflow-hidden rounded-b-[2.5rem] bg-[var(--color-card-light)]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      tabIndex={0}
      onKeyDown={onKeyDown}
      aria-roledescription="carousel"
      aria-label="Hero Slides"
    >
      <AnimatePresence mode="wait">
        {SLIDES.map((slide, i) => (
          i === index && (
            <m.div
              key={slide.id}
              className="absolute inset-0"
              initial={{ opacity: 0, scale: 1.04 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.9, ease: 'easeOut' }}
            >
              <div
                className="absolute inset-0 bg-center bg-cover"
                style={{ backgroundImage: `url(${slide.img})` }}
                aria-hidden="true"
              />
              {/* Gradient overlays */}
              <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/30 to-black/10" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.15),transparent_60%)]" />

              {/* Content */}
              <div className="relative z-10 h-full max-w-7xl mx-auto px-4 flex flex-col justify-center pt-24 sm:pt-0">
                <m.h1
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.15 }}
                  className="heading font-bold tracking-tight text-white drop-shadow-lg max-w-3xl text-[clamp(1.9rem,5vw,3.5rem)] leading-[1.05]"
                >
                  {slide.heading}
                </m.h1>
                <m.p
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="mt-4 text-[clamp(0.9rem,1.5vw,1.25rem)] text-white/85 max-w-2xl font-medium leading-relaxed"
                >
                  {slide.sub}
                </m.p>
                <m.div
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.45 }}
                  className="mt-8 flex items-center gap-4 flex-wrap"
                >
                  <a
                    href={slide.to}
                    className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm sm:text-base font-semibold text-white bg-[var(--color-primary)] hover:bg-[var(--color-light-purple)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-accent)] shadow-lg shadow-[var(--color-primary)]/30 backdrop-blur"
                  >
                    {slide.cta}
                  </a>
                  <div className="hidden sm:flex items-center gap-2">
                    {SLIDES.map((s, dotIdx) => (
                      <button
                        key={s.id}
                        onClick={() => setIndex(dotIdx)}
                        aria-label={`Go to slide ${dotIdx + 1}`}
                        className={`h-2.5 w-2.5 rounded-full transition-all duration-300 ${dotIdx === index ? 'bg-[var(--color-primary)] w-6' : 'bg-white/40 hover:bg-white/70'}`}
                      />
                    ))}
                  </div>
                </m.div>
              </div>
            </m.div>
          )
        ))}
      </AnimatePresence>

      {/* Desktop side arrows */}
      <div className="absolute inset-0 items-center justify-between px-2 sm:px-4 z-30 pointer-events-none hidden sm:flex">
        <button
          onClick={prev}
          aria-label="Previous slide"
          className="pointer-events-auto group p-2 sm:p-3 rounded-full bg-black/40 hover:bg-black/55 text-white backdrop-blur border border-white/20 transition"
        >
          <FiChevronLeft className="w-6 h-6 sm:w-7 sm:h-7 group-active:scale-90 transition" />
        </button>
        <button
          onClick={next}
          aria-label="Next slide"
          className="pointer-events-auto group p-2 sm:p-3 rounded-full bg-black/40 hover:bg-black/55 text-white backdrop-blur border border-white/20 transition"
        >
          <FiChevronRight className="w-6 h-6 sm:w-7 sm:h-7 group-active:scale-90 transition" />
        </button>
      </div>

      {/* Mobile bottom controls: arrows + dots */}
      <div className="sm:hidden absolute bottom-3 left-0 right-0 z-30 flex items-center justify-center gap-4 px-4">
        <button
          onClick={prev}
          aria-label="Previous slide"
          className="group p-2 rounded-full bg-black/45 hover:bg-black/60 text-white backdrop-blur border border-white/20 transition"
        >
          <FiChevronLeft className="w-5 h-5 group-active:scale-90 transition" />
        </button>
        <div className="flex gap-2">
          {SLIDES.map((s, dotIdx) => (
            <button
              key={s.id}
              onClick={() => setIndex(dotIdx)}
              aria-label={`Go to slide ${dotIdx + 1}`}
              className={`h-2.5 w-2.5 rounded-full transition-all ${dotIdx === index ? 'bg-[var(--color-primary)] scale-110' : 'bg-white/50 hover:bg-white/80'}`}
            />
          ))}
        </div>
        <button
          onClick={next}
          aria-label="Next slide"
          className="group p-2 rounded-full bg-black/45 hover:bg-black/60 text-white backdrop-blur border border-white/20 transition"
        >
          <FiChevronRight className="w-5 h-5 group-active:scale-90 transition" />
        </button>
      </div>

      {/* Drag layer */}
      {/* Drag layer now only covers lower z so buttons remain clickable */}
      <div
        className="absolute inset-0 cursor-grab active:cursor-grabbing z-10"
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        aria-hidden="true"
      />
    </section>
  );
}
