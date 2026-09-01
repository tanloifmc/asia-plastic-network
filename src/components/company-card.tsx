import { Link } from "@tanstack/react-router";
import type { Company } from "@/lib/companies";

export function CompanyCard({ company }: { company: Company }) {
  return (
    <article className="overflow-hidden rounded-[14px] bg-frame ring-1 ring-line transition-transform hover:-translate-y-1 hover:ring-steel">
      <div className="p-5">
        <div className="flex items-center gap-3">
          <div className="grid size-12 shrink-0 place-items-center rounded-md bg-steel font-display text-base font-bold text-amber">
            {company.initials}
          </div>
          <div className="min-w-0">
            <h3 className="truncate font-display text-lg font-semibold leading-tight">
              {company.name}
            </h3>
            <p className="mt-0.5 flex items-center gap-1.5 text-xs text-muted">
              <svg className="size-3.5 shrink-0" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.3" />
                <path
                  d="M3 10h14M10 3c-2 2-2 12 0 14M10 3c2 2 2 12 0 14"
                  stroke="currentColor"
                  strokeWidth="1.3"
                />
              </svg>
              <span className="truncate">
                {company.location} · {company.tagline}
              </span>
            </p>
          </div>
        </div>
        <p className="mt-4 text-pretty text-sm leading-relaxed text-muted">{company.summary}</p>
      </div>
      <div className="flex items-center justify-between border-t border-line/60 px-5 py-4">
        <Link
          to="/companies/$slug"
          params={{ slug: company.slug }}
          className="flex items-center gap-1.5 text-sm font-medium text-ink transition-colors hover:text-amber"
        >
          Xem hồ sơ
          <svg className="size-4 shrink-0" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <path
              d="m7 4 6 6-6 6"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Link>
        <span className="text-xs text-muted">RFQ</span>
      </div>
    </article>
  );
}
