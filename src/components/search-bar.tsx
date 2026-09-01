import { useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { sectors, locations } from "@/lib/companies";

export function SearchBar({
  initial,
}: {
  initial?: { q?: string; sector?: string; location?: string };
}) {
  const navigate = useNavigate();
  const [q, setQ] = useState(initial?.q ?? "");
  const [sector, setSector] = useState(initial?.sector ?? "");
  const [location, setLocation] = useState(initial?.location ?? "");

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    navigate({
      to: "/companies",
      search: {
        q: q || undefined,
        sector: sector || undefined,
        location: location || undefined,
      },
    });
  };

  const fieldClass =
    "flex items-center gap-2.5 rounded-[10px] bg-brand/60 px-3 py-3 ring-1 ring-line/70";
  const inputClass =
    "w-full bg-transparent text-sm text-ink placeholder:text-muted/80 focus:outline-none";

  return (
    <form
      onSubmit={onSubmit}
      className="fade-up mt-8 rounded-[14px] bg-frame/90 p-2 ring-1 ring-line backdrop-blur-sm"
    >
      <div className="grid gap-2 md:grid-cols-[1fr_1fr_1fr_auto]">
        <div className={fieldClass}>
          <span className="shrink-0 text-muted">
            <svg className="size-4" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <circle cx="8.5" cy="8.5" r="5" stroke="currentColor" strokeWidth="1.5" />
              <path d="m14 14 3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </span>
          <input
            className={inputClass}
            placeholder="Tên doanh nghiệp"
            aria-label="Tên doanh nghiệp"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>

        <div className={fieldClass}>
          <span className="shrink-0 text-muted">
            <svg className="size-4" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path d="m10 2 7 4-7 4-7-4 7-4Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
              <path d="m3 10 7 4 7-4" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
              <path d="m3 14 7 4 7-4" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
            </svg>
          </span>
          <select
            className={`${inputClass} [&>option]:bg-frame`}
            aria-label="Lĩnh vực"
            value={sector}
            onChange={(e) => setSector(e.target.value)}
          >
            <option value="">Lĩnh vực</option>
            {sectors.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        <div className={fieldClass}>
          <span className="shrink-0 text-muted">
            <svg className="size-4" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path d="M10 18s6-5.2 6-9a6 6 0 1 0-12 0c0 3.8 6 9 6 9Z" stroke="currentColor" strokeWidth="1.5" />
              <circle cx="10" cy="9" r="2.2" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </span>
          <select
            className={`${inputClass} [&>option]:bg-frame`}
            aria-label="Địa điểm"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          >
            <option value="">Địa điểm</option>
            {locations.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="rounded-[10px] bg-amber px-6 py-3 font-display text-sm font-semibold uppercase tracking-wide text-brand transition-transform hover:bg-amber/90 active:scale-[0.98]"
        >
          Tìm kiếm
        </button>
      </div>
    </form>
  );
}
