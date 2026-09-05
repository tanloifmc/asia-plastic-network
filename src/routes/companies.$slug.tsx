import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { useState } from "react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { HeroSlider } from "@/components/hero-slider";
import { ContactDialog } from "@/components/contact-dialog";
import { getCompany, companies } from "@/lib/companies";

export const Route = createFileRoute("/companies/$slug")({
  loader: ({ params }) => {
    const company = getCompany(params.slug);
    if (!company) throw notFound();
    return { company };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Không tìm thấy doanh nghiệp — 1Plastic.Asia" }, { name: "robots", content: "noindex" }],
      };
    }
    const { company } = loaderData;
    const title = `${company.name} — ${company.tagline} | 1Plastic.Asia`;
    const description = company.summary;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: CompanyPage,
});

function CompanyPage() {
  const { company } = Route.useLoaderData();
  const [contactOpen, setContactOpen] = useState(false);
  const related = companies.filter((c) => c.sector === company.sector && c.slug !== company.slug);

  return (
    <div className="min-h-screen bg-brand text-ink">
      <SiteHeader />

      <HeroSlider slides={company.slides}>
        <div className="fade-up mt-8 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => setContactOpen(true)}
            className="rounded-[10px] bg-amber px-6 py-3 font-display text-sm font-semibold uppercase tracking-wide text-brand transition-transform hover:bg-amber/90 active:scale-[0.98]"
          >
            Gửi yêu cầu báo giá
          </button>
          <Link
            to="/companies"
            className="rounded-[10px] px-5 py-3 text-sm font-medium text-ink ring-1 ring-line transition-colors hover:bg-steel/50"
          >
            Quay lại danh bạ
          </Link>
        </div>
      </HeroSlider>

      <main className="mx-auto max-w-[1280px] px-5 py-16 sm:px-8 md:py-24">
        <section className="grid gap-10 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <p className="mb-2 text-xs font-medium uppercase tracking-[0.2em] text-amber">
              Giới thiệu
            </p>
            <h2 className="text-balance font-display text-3xl font-semibold leading-tight md:text-4xl">
              {company.name}
            </h2>
            <p className="mt-4 max-w-[62ch] text-pretty leading-relaxed text-muted">
              {company.summary}
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {company.capabilities.map((cap) => (
                <span
                  key={cap}
                  className="rounded-full px-3 py-1.5 text-sm text-muted ring-1 ring-line"
                >
                  {cap}
                </span>
              ))}
            </div>
          </div>

          <dl className="grid grid-cols-2 gap-3 self-start">
            {[
              ["Lĩnh vực", company.sector],
              ["Địa điểm", `${company.city}, ${company.location}`],
              ["Thành lập", String(company.founded)],
              ["Quy mô", company.employees],
            ].map(([k, v]) => (
              <div key={k} className="rounded-[12px] bg-frame p-4 ring-1 ring-line">
                <dt className="text-xs uppercase tracking-[0.16em] text-muted">{k}</dt>
                <dd className="mt-2 text-sm font-medium leading-snug">{v}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="mt-20">
          <p className="mb-2 text-xs font-medium uppercase tracking-[0.2em] text-amber">
            Sản phẩm &amp; dịch vụ
          </p>
          <h2 className="text-balance font-display text-3xl font-semibold leading-tight md:text-4xl">
            Dải sản phẩm chính
          </h2>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {company.products.map((p) => (
              <div
                key={p.name}
                className="rounded-[14px] bg-frame p-5 ring-1 ring-line transition-transform hover:-translate-y-1 hover:ring-steel"
              >
                <h3 className="font-display text-lg font-semibold leading-tight">{p.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{p.detail}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-20 rounded-[14px] bg-frame p-6 ring-1 ring-line md:p-10">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
            <div>
              <p className="mb-2 text-xs font-medium uppercase tracking-[0.2em] text-amber">
                Liên hệ giao thương
              </p>
              <h2 className="font-display text-2xl font-semibold leading-tight md:text-3xl">
                Kết nối trực tiếp với {company.name}
              </h2>
              <p className="mt-3 text-sm text-muted">
                {company.email} · {company.phone}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setContactOpen(true)}
              className="w-fit rounded-[10px] bg-amber px-6 py-3 font-display text-sm font-semibold uppercase tracking-wide text-brand transition-transform hover:bg-amber/90 active:scale-[0.98]"
            >
              Gửi yêu cầu
            </button>
          </div>
        </section>

        {related.length > 0 && (
          <section className="mt-20">
            <p className="mb-2 text-xs font-medium uppercase tracking-[0.2em] text-amber">
              Cùng lĩnh vực
            </p>
            <div className="mt-4 grid gap-3 md:grid-cols-3">
              {related.map((c) => (
                <Link
                  key={c.slug}
                  to="/companies/$slug"
                  params={{ slug: c.slug }}
                  className="rounded-[12px] bg-frame p-5 ring-1 ring-line transition-transform hover:-translate-y-0.5 hover:ring-steel"
                >
                  <h3 className="font-display text-lg font-semibold leading-tight">{c.name}</h3>
                  <p className="mt-1 text-sm text-muted">
                    {c.location} · {c.tagline}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>

      <ContactDialog company={company} open={contactOpen} onClose={() => setContactOpen(false)} />
      <SiteFooter />
    </div>
  );
}
