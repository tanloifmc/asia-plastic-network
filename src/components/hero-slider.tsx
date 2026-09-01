import { useEffect, useState, type ReactNode } from "react";

export type HeroSlide = {
  image: string;
  eyebrow: string;
  title: string;
  text: string;
};

export function HeroSlider({
  slides,
  children,
  height = "h-[600px] md:h-[640px]",
}: {
  slides: HeroSlide[];
  children?: ReactNode;
  height?: string;
}) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => setActive((i) => (i + 1) % slides.length), 7000);
    return () => window.clearInterval(id);
  }, [slides.length]);

  const slide = slides[active] ?? slides[0]!;

  return (
    <section className={`relative overflow-hidden ${height}`}>
      <div className="absolute inset-0">
        {slides.map((s, i) => (
          <img
            key={s.image + i}
            src={s.image}
            alt={s.title}
            width={1920}
            height={1080}
            loading={i === 0 ? "eager" : "lazy"}
            className={`absolute inset-0 size-full object-cover transition-opacity duration-[1200ms] ${
              i === active ? "kb-img opacity-100" : "opacity-0"
            }`}
          />
        ))}
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-brand via-brand/70 to-brand/20" />

      <div className="relative mx-auto flex h-full max-w-[1280px] px-5 sm:px-8">
        <div className="w-full self-end pb-16 md:pb-20">
          <p
            key={`e-${active}`}
            className="fade-up mb-4 inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.22em] text-amber"
          >
            {slide.eyebrow}
          </p>
          <h1
            key={`t-${active}`}
            className="fade-up max-w-[26ch] font-display text-5xl font-bold uppercase leading-[0.92] tracking-tight sm:text-6xl md:text-7xl"
          >
            {slide.title}
          </h1>
          <p
            key={`p-${active}`}
            className="fade-up mt-4 max-w-[48ch] text-base leading-relaxed text-muted sm:text-lg"
          >
            {slide.text}
          </p>
          {children}
        </div>
      </div>

      <div className="absolute bottom-6 right-5 z-10 flex items-center gap-2 sm:right-8">
        {slides.map((s, i) => (
          <button
            key={`d-${s.image}-${i}`}
            type="button"
            aria-label={`Slide ${i + 1}`}
            onClick={() => setActive(i)}
            className={`h-1 rounded-full transition-all ${
              i === active ? "w-8 bg-amber" : "w-4 bg-line hover:bg-steel"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
