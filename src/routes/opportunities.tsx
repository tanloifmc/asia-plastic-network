import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { opportunities, opportunityTypes } from "@/lib/opportunities";
import { fetchCompanies, type Company } from "@/lib/companies";

const title = "Cơ hội kinh doanh ngành Nhựa & Cao su — 1Plastic.Asia";
const description =
  "Danh sách cơ hội hợp tác: tìm nhà phân phối, nhà cung cấp, OEM/ODM, liên doanh và chuyển giao công nghệ giữa các doanh nghiệp nhựa và cao su châu Á.";

export const Route = createFileRoute("/opportunities")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  loader: async () => {
    return await fetchCompanies();
  },
  component: OpportunitiesPage,
});

function OpportunitiesPage() {
  const companies = Route.useLoaderData();
  const [type, setType] = useState<string>("");

  const list = useMemo(
    () => (type ? opportunities.filter((o) => o.type === type) : opportunities),
    [type],
  );

  return (
    <div className="min-h-screen bg-brand text-ink">
      <SiteHeader />

      <main className="mx-auto max-w-[1280px] px-5 pb-20 pt-28 sm:px-8 md:pt-32">
        <p className="mb-2 text-xs font-medium uppercase tracking-[0.2em] text-amber">
          Giao thương
        </p>
        <h1 className="text-balance font-display text-4xl font-semibold leading-tight md:text-5xl">
          Cơ hội kinh doanh
        </h1>
        <p className="mt-4 max-w-2xl text-pretty leading-relaxed text-muted">
          Các doanh nghiệp trong danh bạ đang đăng tìm đối tác phân phối, nhà cung cấp, hợp tác sản
          xuất và đầu tư. Chọn cơ hội phù hợp và liên hệ trực tiếp.
        </p>

        <div className="mt-8 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setType("")}
            className={`rounded-full px-4 py-2 text-sm ring-1 transition-colors ${
              type === "" ? "bg-amber text-brand ring-amber" : "text-muted ring-line hover:text-ink"
            }`}
          >
            Tất cả ({opportunities.length})
          </button>
          {opportunityTypes.map((t) => {
            const count = opportunities.filter((o) => o.type === t).length;
            if (count === 0) return null;
            return (
              <button
                key={t}
                type="button"
                onClick={() => setType(t)}
                className={`rounded-full px-4 py-2 text-sm ring-1 transition-colors ${
                  type === t ? "bg-amber text-brand ring-amber" : "text-muted ring-line hover:text-ink"
                }`}
              >
                {t} ({count})
              </button>
            );
          })}
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {list.map((op) => {
            const company = companies.find(c => c.slug === op.companySlug);
            return (
              <article
                key={op.id}
                className="flex flex-col rounded-[14px] bg-frame p-6 ring-1 ring-line transition-transform hover:-translate-y-1 hover:ring-steel"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="rounded-full bg-amber/15 px-3 py-1 text-xs font-medium text-amber">
                    {op.type}
                  </span>
                  <span className="text-xs text-muted">Hạn: {op.deadline}</span>
                </div>

                <h2 className="mt-4 text-balance font-display text-xl font-semibold leading-tight">
                  {op.title}
                </h2>

                {company ? (
                  <div className="mt-3 flex items-center gap-2.5">
                    <img
                      src={company.logo}
                      alt={`Logo ${company.name}`}
                      loading="lazy"
                      width={512}
                      height={512}
                      className="size-8 rounded-md bg-brand object-contain p-1 ring-1 ring-line"
                    />
                    <Link
                      to="/companies/$slug"
                      params={{ slug: company.slug }}
                      className="text-sm text-ink transition-colors hover:text-amber"
                    >
                      {company.name}
                    </Link>
                    <span className="text-xs text-muted">· {company.location}</span>
                  </div>
                ) : null}

                <p className="mt-4 text-pretty text-sm leading-relaxed text-muted">
                  {op.description}
                </p>

                <dl className="mt-5 grid grid-cols-2 gap-4 border-t border-line/60 pt-4 text-sm">
                  <div>
                    <dt className="text-xs uppercase tracking-wide text-muted">Thị trường</dt>
                    <dd className="mt-1">{op.markets}</dd>
                  </div>
                  <div>
                    <dt className="text-xs uppercase tracking-wide text-muted">Quy mô</dt>
                    <dd className="mt-1">{op.budget}</dd>
                  </div>
                </dl>

                <ul className="mt-4 flex flex-wrap gap-2">
                  {op.needs.map((n) => (
                    <li key={n} className="rounded-md px-2.5 py-1 text-xs text-muted ring-1 ring-line">
                      {n}
                    </li>
                  ))}
                </ul>

                <div className="mt-6 flex items-center gap-3">
                  {company ? (
                    <Link
                      to="/companies/$slug"
                      params={{ slug: company.slug }}
                      className="rounded-md bg-amber px-4 py-2 text-sm font-medium text-brand transition-opacity hover:opacity-90"
                    >
                      Xem hồ sơ & Liên hệ
                    </Link>
                  ) : null}
                </div>
              </article>
            );
          })}
        </div>

        <section className="mt-14 rounded-[14px] bg-frame p-8 ring-1 ring-line">
          <h2 className="font-display text-2xl font-semibold leading-tight">
            Doanh nghiệp của bạn đang tìm đối tác?
          </h2>
          <p className="mt-3 max-w-2xl text-pretty text-sm leading-relaxed text-muted">
            Gửi thông tin nhu cầu hợp tác để đăng tin lên mục Cơ hội kinh doanh và tiếp cận hơn 480
            doanh nghiệp trong danh bạ.
          </p>
          <a
            href={`mailto:partner@1plastic.asia?subject=${encodeURIComponent(
              "[1Plastic.Asia] Đăng cơ hội kinh doanh",
            )}&body=${encodeURIComponent(
              "Tên doanh nghiệp:\nLĩnh vực:\nLoại hợp tác:\nThị trường mong muốn:\nMô tả nhu cầu:\nNgười liên hệ / Email / Điện thoại:",
            )}`}
            className="mt-6 inline-flex rounded-md bg-amber px-5 py-2.5 text-sm font-medium text-brand transition-opacity hover:opacity-90"
          >
            Đăng cơ hội hợp tác
          </a>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
