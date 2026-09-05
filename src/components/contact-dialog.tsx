import { useEffect } from "react";
import type { Company } from "@/lib/companies";

type ContactDialogProps = {
  company: Company;
  open: boolean;
  onClose: () => void;
};

export function ContactDialog({ company, open, onClose }: ContactDialogProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[70] grid place-items-center overflow-y-auto bg-brand/80 p-4 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-label={`Thông tin liên hệ ${company.name}`}
    >
      <div className="w-full max-w-[480px] overflow-hidden rounded-[14px] bg-frame ring-1 ring-line">
        <div className="relative h-20">
          <img src={company.banner} alt="" aria-hidden="true" className="size-full object-cover" />
          <div className="absolute inset-0 bg-brand/60" />
          <button
            type="button"
            onClick={onClose}
            aria-label="Đóng"
            className="absolute right-4 top-4 grid size-8 place-items-center rounded-full bg-brand/70 text-ink ring-1 ring-line transition-colors hover:bg-steel"
          >
            <svg className="size-4" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path
                d="m5 5 10 10M15 5 5 15"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>
          <div className="absolute -bottom-6 left-6 flex items-end gap-3">
            <div className="grid size-12 place-items-center overflow-hidden rounded-[10px] bg-brand ring-1 ring-line">
              <img src={company.logo} alt="" aria-hidden="true" className="size-9 object-contain" />
            </div>
            <div className="pb-0.5">
              <p className="text-[11px] uppercase tracking-[0.18em] text-amber">
                Liên hệ trực tiếp
              </p>
              <p className="font-display text-base font-semibold leading-tight">{company.name}</p>
            </div>
          </div>
        </div>

        <div className="px-6 pb-6 pt-10">
          <p className="text-sm leading-relaxed text-muted">
            1Plastic.Asia kết nối trực tiếp — hai bên tự trao đổi nhu cầu và báo giá qua thông tin
            bên dưới.
          </p>

          <div className="mt-5 space-y-3">
            <a
              href={`mailto:${company.email}`}
              className="flex items-center gap-3.5 rounded-[10px] bg-brand px-4 py-3.5 ring-1 ring-line transition-colors hover:ring-amber"
            >
              <span className="grid size-9 shrink-0 place-items-center rounded-[8px] bg-amber/15 text-amber">
                <svg className="size-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.5" />
                  <path d="m3 7 9 6 9-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </span>
              <span className="min-w-0">
                <span className="block text-xs uppercase tracking-wide text-muted">Email</span>
                <span className="block truncate text-sm font-medium text-ink">{company.email}</span>
              </span>
            </a>

            <a
              href={`tel:${company.phone.replace(/\s/g, "")}`}
              className="flex items-center gap-3.5 rounded-[10px] bg-brand px-4 py-3.5 ring-1 ring-line transition-colors hover:ring-amber"
            >
              <span className="grid size-9 shrink-0 place-items-center rounded-[8px] bg-amber/15 text-amber">
                <svg className="size-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path
                    d="M5 4h4l2 5-2.5 1.5a12 12 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <span>
                <span className="block text-xs uppercase tracking-wide text-muted">Điện thoại</span>
                <span className="block text-sm font-medium text-ink">{company.phone}</span>
              </span>
            </a>

            <div className="flex items-center gap-3.5 rounded-[10px] bg-brand px-4 py-3.5 ring-1 ring-line">
              <span className="grid size-9 shrink-0 place-items-center rounded-[8px] bg-amber/15 text-amber">
                <svg className="size-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path
                    d="M12 21s7-5.1 7-11a7 7 0 1 0-14 0c0 5.9 7 11 7 11Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                  <circle cx="12" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.5" />
                </svg>
              </span>
              <span>
                <span className="block text-xs uppercase tracking-wide text-muted">Địa điểm</span>
                <span className="block text-sm font-medium text-ink">
                  {company.city}, {company.location}
                </span>
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="mt-6 w-full rounded-[10px] bg-amber px-5 py-3 font-display text-sm font-semibold uppercase tracking-wide text-brand transition-colors hover:bg-amber/90"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
