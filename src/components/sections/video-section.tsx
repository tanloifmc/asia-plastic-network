import type { VideoSection } from "@/lib/companies";

export function VideoSectionComponent({ section }: { section: VideoSection }) {
  // Chuyển youtube.com/watch?v=xxx → youtube.com/embed/xxx
  const embedUrl = section.url
    .replace("watch?v=", "embed/")
    .replace("youtu.be/", "www.youtube.com/embed/");

  return (
    <section className="mt-20">
      <p className="mb-2 text-xs font-medium uppercase tracking-[0.2em] text-amber">
        Video
      </p>
      <h2 className="text-balance font-display text-3xl font-semibold leading-tight md:text-4xl">
        {section.title}
      </h2>
      <div className="mt-6 overflow-hidden rounded-[16px] bg-frame ring-1 ring-line">
        <div className="relative aspect-video w-full">
          <iframe
            src={embedUrl}
            title={section.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 h-full w-full border-0"
            loading="lazy"
          />
        </div>
      </div>
    </section>
  );
}
