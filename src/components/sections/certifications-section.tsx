import type { CertificationsSection } from "@/lib/companies";

export function CertificationsSectionComponent({
  section,
}: {
  section: CertificationsSection;
}) {
  return (
    <section className="mt-20">
      <p className="mb-2 text-xs font-medium uppercase tracking-[0.2em] text-amber">
        Chứng nhận
      </p>
      <h2 className="text-balance font-display text-3xl font-semibold leading-tight md:text-4xl">
        {section.title}
      </h2>
      <div className="mt-6 grid gap-3 sm:grid-cols-2 md:grid-cols-3">
        {section.items.map((item) => (
          <div
            key={item.name}
            className="flex items-start gap-4 rounded-[12px] bg-frame p-5 ring-1 ring-line"
          >
            {item.image ? (
              <img
                src={item.image}
                alt={item.name}
                className="mt-0.5 h-10 w-10 shrink-0 rounded object-contain"
                loading="lazy"
              />
            ) : (
              <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-[8px] bg-amber/15 text-xs font-bold text-amber">
                ✓
              </span>
            )}
            <div>
              <h3 className="font-display text-base font-semibold leading-tight">
                {item.name}
              </h3>
              <p className="mt-1 text-sm leading-relaxed text-muted">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
