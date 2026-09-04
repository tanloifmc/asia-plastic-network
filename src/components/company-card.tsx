import { Link } from "@tanstack/react-router";
import type { Company } from "@/lib/companies";

export function CompanyCard({ company }: { company: Company }) {
  return (
    <Link
      to="/companies/$slug"
      params={{ slug: company.slug }}
      className="group flex flex-col overflow-hidden rounded-[14px] bg-frame ring-1 ring-line transition-transform hover:-translate-y-1 hover:ring-steel"
    >
      <div className="relative aspect-[2/1] w-full overflow-hidden">
        <img
          src={company.banner}
          alt={`Nhà máy ${company.name}`}
          loading="lazy"
          width={1024}
          height={512}
          className="absolute inset-0 size-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-frame via-frame/25 to-transparent" />
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="relative z-10 -mt-14 mb-4 grid size-16 place-items-center overflow-hidden rounded-[12px] bg-brand shadow-lg shadow-black/30 ring-1 ring-line">
          <img
            src={company.logo}
            alt={`Logo ${company.name}`}
            loading="lazy"
            width={512}
            height={512}
            className="size-11 object-contain"
          />
        </div>

        <h3 className="font-display text-lg font-semibold leading-tight">{company.name}</h3>
        <p className="mt-1 flex items-center gap-1.5 text-xs text-muted">
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
        <p className="mt-3 text-pretty text-sm leading-relaxed text-muted">{company.summary}</p>
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
        <span className="truncate pl-3 text-right text-xs text-muted">{company.sector}</span>
      </div>
    </article>
  );
}
