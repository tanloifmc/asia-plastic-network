import type { TextSection } from "@/lib/companies";

export function TextSectionComponent({ section }: { section: TextSection }) {
  return (
    <section className="mt-20">
      <p className="mb-2 text-xs font-medium uppercase tracking-[0.2em] text-amber">
        Giới thiệu
      </p>
      <h2 className="text-balance font-display text-3xl font-semibold leading-tight md:text-4xl">
        {section.title}
      </h2>
      <div className="mt-6 max-w-[72ch] rounded-[14px] bg-frame p-6 ring-1 ring-line md:p-8">
        <p className="text-pretty leading-relaxed text-muted">{section.content}</p>
      </div>
    </section>
  );
}
