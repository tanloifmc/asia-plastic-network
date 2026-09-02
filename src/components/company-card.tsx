import { Link } from "@tanstack/react-router";
import type { Company } from "@/lib/companies";

export function CompanyCard({ company }: { company: Company }) {
  return (
    <article className="overflow-hidden rounded-[14px] bg-frame ring-1 ring-line transition-transform hover:-translate-y-1 hover:ring-steel">
      <div className="relative h-32 overflow-hidden">
        <img
          src={company.banner}
          alt={`Nhà máy ${company.name}`}
          loading="lazy"
          width={1024}
          height={512}
          className="size-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-frame via-transparent to-transparent" />
      </div>
      <div className="p-5 pt-0">
        <div className="-mt-8 flex items-end gap-3">
          <div className="grid size-16 shrink-0 place-items-center overflow-hidden rounded-[12px] bg-brand ring-1 ring-line">
            <img
              src={company.logo}
              alt={`Logo ${company.name}`}
              loading="lazy"
              width={512}
              height={512}
              className="size-12 object-contain"
            />
          </div>
          <div className="min-w-0 pb-1">
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
        <span className="text-xs text-muted">{company.sector}</span>
      </div>
    </article>
  );
}
