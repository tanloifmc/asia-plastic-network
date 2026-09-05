import type { StatsSection } from "@/lib/companies";

export function StatsSectionComponent({ section }: { section: StatsSection }) {
  return (
    <section className="mt-20">
      <p className="mb-2 text-xs font-medium uppercase tracking-[0.2em] text-amber">
        Thông số
      </p>
      <h2 className="text-balance font-display text-3xl font-semibold leading-tight md:text-4xl">
        {section.title}
      </h2>
      <dl className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {section.items.map((item) => (
          <div
            key={item.label}
            className="rounded-[12px] bg-frame p-4 ring-1 ring-line"
          >
            <dd className="font-display text-2xl font-bold leading-none text-amber">
              {item.value}
            </dd>
            <dt className="mt-2 text-xs uppercase tracking-[0.14em] text-muted">
              {item.label}
            </dt>
          </div>
        ))}
      </dl>
    </section>
  );
}
