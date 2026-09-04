import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { HeroSlider } from "@/components/hero-slider";
import { SearchBar } from "@/components/search-bar";
import { CompanyCard } from "@/components/company-card";
import { companies, heroImages } from "@/lib/companies";
import { opportunities, companyOf } from "@/lib/opportunities";

const title = "1Plastic.Asia — Danh bạ doanh nghiệp Nhựa & Cao su châu Á";
const description =
  "Danh bạ giao thương B2B ngành nhựa và cao su: tìm nhà sản xuất, nguyên liệu, khuôn mẫu, máy móc và đối tác tái chế theo lĩnh vực và địa điểm.";

export const Route = createFileRoute("/")({
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
  component: Index,
});

const slides = [
  {
    image: heroImages[0]!,
    eyebrow: "Danh bạ B2B ngành Nhựa & Cao su",
    title: "Nơi chuỗi giá trị polymer hội tụ",
    text: "Kết nối thẳng với nhà sản xuất, nhà cung cấp nguyên liệu và đối tác máy móc trên toàn cầu — chính xác, tin cậy, như một dây chuyền đang vận hành.",
  },
  {
    image: heroImages[1]!,
    eyebrow: "Hơn 650 doanh nghiệp · 15+ quốc gia",
    title: "Tìm đối tác theo từng mắt xích",
    text: "Máy móc, hóa chất, khuôn mẫu, thủy lực và tái chế — lọc theo lĩnh vực và địa điểm chỉ trong vài giây.",
  },
  {
    image: heroImages[2]!,
    eyebrow: "Landing page riêng cho mỗi doanh nghiệp",
    title: "Hồ sơ năng lực đúng chuẩn công nghiệp",
    text: "Mỗi doanh nghiệp sở hữu một trang giới thiệu riêng với sản phẩm, năng lực sản xuất và kênh nhận yêu cầu báo giá.",
  },
];

const sectorCards = [
  { count: "860", name: "Hóa chất & nguyên liệu thô" },
  { count: "540", name: "Máy móc phụ trợ" },
  { count: "410", name: "Khuôn mẫu & thủy lực" },
  { count: "320", name: "Tái chế & gia nhiệt" },
];

function Index() {
  return (
    <div className="min-h-screen bg-brand text-ink">
      <SiteHeader />

      <HeroSlider slides={slides}>
        <SearchBar />
      </HeroSlider>

      <main className="mx-auto max-w-[1280px] px-5 py-16 sm:px-8 md:py-24">
        <section>
          <div className="mb-8 flex items-end justify-between">
            <div>
              <p className="mb-2 text-xs font-medium uppercase tracking-[0.2em] text-amber">
                Nhóm ngành
              </p>
              <h2 className="text-balance font-display text-3xl font-semibold leading-tight md:text-4xl">
                Phân khúc trong danh bạ
              </h2>
            </div>
            <Link
              to="/sectors"
              className="hidden items-center gap-1.5 text-sm text-muted transition-colors hover:text-ink sm:inline-flex"
            >
              Xem tất cả
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
          </div>

          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            <div className="col-span-2 row-span-2 flex flex-col justify-between rounded-[12px] bg-frame p-6 ring-1 ring-line transition-transform hover:-translate-y-0.5 hover:ring-steel">
              <div>
                <span className="font-display text-4xl font-bold leading-none text-amber">1240</span>
                <p className="mt-3 font-display text-xl font-semibold leading-tight">
                  Máy móc ngành nhựa &amp; cao su
                </p>
                <p className="mt-2 text-pretty text-sm leading-relaxed text-muted">
                  Máy ép, đùn, thổi, tạo hạt và dây chuyền hoàn chỉnh từ các nhà sản xuất uy tín.
                </p>
              </div>
              <div className="mt-6 flex items-center gap-2 text-sm text-muted">
                <span className="size-1.5 rounded-full bg-amber" />
                Đang mở rộng
              </div>
            </div>

            {sectorCards.map((c) => (
              <div
                key={c.name}
                className="rounded-[12px] bg-frame p-5 ring-1 ring-line transition-transform hover:-translate-y-0.5 hover:ring-steel"
              >
                <span className="font-display text-2xl font-bold leading-none text-ink">
                  {c.count}
                </span>
                <p className="mt-3 text-sm font-medium leading-snug">{c.name}</p>
              </div>
            ))}

            <div className="col-span-2 flex items-center justify-between rounded-[12px] bg-amber p-5 text-brand ring-1 ring-amber/40 transition-transform hover:-translate-y-0.5 hover:ring-amber">
              <div>
                <p className="font-display text-lg font-semibold leading-tight">+15 quốc gia</p>
                <p className="mt-1 text-pretty text-sm opacity-80">
                  Mạng lưới nguồn hàng xuyên Á-Âu
                </p>
              </div>
              <svg className="size-6 shrink-0" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M12 2 15 9l7 .5-5.5 4.5L18 21l-6-4-6 4 1.5-7L2 9.5 9 9l3-7Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
        </section>

        <section className="mt-20">
          <div className="mb-6 flex items-end justify-between">
            <div>
              <p className="mb-2 text-xs font-medium uppercase tracking-[0.2em] text-amber">
                Doanh nghiệp nổi bật
              </p>
              <h2 className="text-balance font-display text-3xl font-semibold leading-tight md:text-4xl">
                Đối tác trong danh bạ
              </h2>
            </div>
            <Link
              to="/companies"
              className="hidden items-center gap-1.5 text-sm text-muted transition-colors hover:text-ink sm:inline-flex"
            >
              Toàn bộ danh bạ
            </Link>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {companies.slice(0, 3).map((c) => (
              <CompanyCard key={c.slug} company={c} />
            ))}
          </div>
        </section>

        <section className="mt-20">
          <div className="mb-6 flex items-end justify-between">
            <div>
              <p className="mb-2 text-xs font-medium uppercase tracking-[0.2em] text-amber">
                Giao thương
              </p>
              <h2 className="text-balance font-display text-3xl font-semibold leading-tight md:text-4xl">
                Cơ hội kinh doanh
              </h2>
            </div>
            <Link
              to="/opportunities"
              className="hidden items-center gap-1.5 text-sm text-muted transition-colors hover:text-ink sm:inline-flex"
            >
              Xem tất cả cơ hội
            </Link>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {opportunities.slice(0, 3).map((op) => {
              const company = companyOf(op);
              return (
                <Link
                  key={op.id}
                  to="/opportunities"
                  className="flex flex-col rounded-[14px] bg-frame p-6 ring-1 ring-line transition-transform hover:-translate-y-1 hover:ring-steel"
                >
                  <span className="w-fit rounded-full bg-amber/15 px-3 py-1 text-xs font-medium text-amber">
                    {op.type}
                  </span>
                  <h3 className="mt-4 text-balance font-display text-lg font-semibold leading-tight">
                    {op.title}
                  </h3>
                  <p className="mt-3 line-clamp-3 text-pretty text-sm leading-relaxed text-muted">
                    {op.description}
                  </p>
                  <span className="mt-5 text-xs text-muted">
                    {company ? `${company.name} · ${company.location}` : op.markets} · Hạn{" "}
                    {op.deadline}
                  </span>
                </Link>
              );
            })}
          </div>
        </section>
      </main>


      <SiteFooter />
    </div>
  );
}
