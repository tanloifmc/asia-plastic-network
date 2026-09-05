import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { sectors, fetchSectorStats } from "@/lib/companies";

const title = "Lĩnh vực ngành Nhựa & Cao su — 1Plastic.Asia";
const description =
  "Bảy nhóm ngành trong danh bạ: máy móc, hóa chất & nguyên liệu, máy móc phụ trợ, gia nhiệt & điều khiển, khuôn mẫu, thủy lực & khí nén, tái chế.";

export const Route = createFileRoute("/sectors")({
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
    return await fetchSectorStats();
  },
  component: SectorsPage,
});

function SectorsPage() {
  const stats = Route.useLoaderData();
  return (
    <div className="min-h-screen bg-brand text-ink">
      <SiteHeader />

      <main className="mx-auto max-w-[1280px] px-5 pb-24 pt-28 sm:px-8">
        <p className="mb-2 text-xs font-medium uppercase tracking-[0.2em] text-amber">Nhóm ngành</p>
        <h1 className="text-balance font-display text-4xl font-bold uppercase leading-[0.95] tracking-tight md:text-5xl">
          Bảy mắt xích của chuỗi giá trị
        </h1>
        <p className="mt-3 max-w-[56ch] text-pretty text-muted">
          Danh bạ được phân nhóm theo hồ sơ ngành, giúp doanh nghiệp tìm đúng đối tác từ nguyên
          liệu đầu vào đến tái chế cuối vòng đời.
        </p>

        <div className="mt-10 grid gap-3 md:grid-cols-2">
          {sectors.map((s, i) => {
            const statObj = stats.find((stat) => stat.name === s);
            const count = statObj ? statObj.count : 0;
            return (
              <Link
                key={s}
                to="/companies"
                search={{ sector: s }}
                className="flex items-center justify-between rounded-[12px] bg-frame p-6 ring-1 ring-line transition-transform hover:-translate-y-0.5 hover:ring-steel"
              >
                <div>
                  <span className="font-display text-sm font-medium text-amber">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p className="mt-2 font-display text-xl font-semibold leading-tight">{s}</p>
                  <p className="mt-1 text-sm text-muted">{count} doanh nghiệp trong danh bạ</p>
                </div>
                <svg className="size-5 shrink-0 text-muted" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                  <path
                    d="m7 4 6 6-6 6"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>
            );
          })}
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
