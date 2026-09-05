import { useState } from "react";
import type { GallerySection } from "@/lib/companies";

export function GallerySectionComponent({ section }: { section: GallerySection }) {
  const [active, setActive] = useState(0);
  const images = section.images;
  if (images.length === 0) return null;

  return (
    <section className="mt-20">
      <p className="mb-2 text-xs font-medium uppercase tracking-[0.2em] text-amber">
        Hình ảnh
      </p>
      <h2 className="text-balance font-display text-3xl font-semibold leading-tight md:text-4xl">
        {section.title}
      </h2>

      {/* Main image */}
      <div className="relative mt-6 overflow-hidden rounded-[16px] bg-frame ring-1 ring-line">
        <img
          src={images[active]}
          alt={`${section.title} — ảnh ${active + 1}`}
          className="aspect-[16/9] w-full object-cover transition-opacity duration-300"
          loading="lazy"
        />
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {images.map((src, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActive(i)}
              className={[
                "shrink-0 overflow-hidden rounded-[8px] ring-2 transition-all",
                i === active ? "ring-amber" : "ring-line hover:ring-steel",
              ].join(" ")}
              aria-label={`Xem ảnh ${i + 1}`}
            >
              <img
                src={src}
                alt=""
                className="h-16 w-24 object-cover"
                loading="lazy"
              />
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
