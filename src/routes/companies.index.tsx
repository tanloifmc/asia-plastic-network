import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import Fuse from "fuse.js";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { SearchBar } from "@/components/search-bar";
import { CompanyCard } from "@/components/company-card";
import { companies } from "@/lib/companies";

const title = "Danh bạ doanh nghiệp — 1Plastic.Asia";
const description =
  "Tra cứu doanh nghiệp ngành nhựa và cao su theo tên, lĩnh vực và địa điểm. Hồ sơ năng lực, sản phẩm và kênh liên hệ báo giá.";

type CompanySearch = {
  q?: string | undefined;
  sector?: string | undefined;
  location?: string | undefined;
};

// Khởi tạo Fuse.js một lần duy nhất — không tái tạo khi re-render
const fuse = new Fuse(companies, {
  // Các trường tìm kiếm theo mức độ ưu tiên (weight)
  keys: [
    { name: "name", weight: 0.5 },        // Tên công ty — quan trọng nhất
    { name: "tagline", weight: 0.2 },      // Slogan
    { name: "city", weight: 0.1 },         // Thành phố
    { name: "capabilities", weight: 0.1 }, // ISO, Chứng chỉ...
    { name: "products.name", weight: 0.1 },// Tên sản phẩm
  ],
  threshold: 0.4,        // 0 = chính xác tuyệt đối, 1 = bất kỳ. 0.4 = thực tế tốt
  includeScore: false,
  ignoreLocation: true,  // Tìm ở bất kỳ vị trí nào trong chuỗi
  minMatchCharLength: 2,
});

export const Route = createFileRoute("/companies/")({
  validateSearch: (search: Record<string, unknown>): CompanySearch => {
    const q = search["q"];
    const sector = search["sector"];
    const location = search["location"];
    return {
      q: typeof q === "string" && q ? q : undefined,
      sector: typeof sector === "string" && sector ? sector : undefined,
      location: typeof location === "string" && location ? location : undefined,
    };
  },
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
  component: CompaniesPage,
});

function CompaniesPage() {
  const { q, sector, location } = Route.useSearch();

  const results = useMemo(() => {
    // Bước 1: Fuse.js fuzzy search theo từ khoá q
    let pool = q ? fuse.search(q).map((r) => r.item) : companies;

    // Bước 2: Lọc thêm theo sector và location (chính xác tuyệt đối)
    if (sector) pool = pool.filter((c) => c.sector === sector);
    if (location) pool = pool.filter((c) => c.location === location);

    return pool;
  }, [q, sector, location]);

  const hasFilters = q ?? sector ?? location;

  return (
    <div className="min-h-screen bg-brand text-ink">
      <SiteHeader />

      <main className="mx-auto max-w-[1280px] px-5 pb-24 pt-28 sm:px-8">
        <p className="mb-2 text-xs font-medium uppercase tracking-[0.2em] text-amber">Danh bạ</p>
        <h1 className="text-balance font-display text-4xl font-bold uppercase leading-[0.95] tracking-tight md:text-5xl">
          Tìm đối tác giao thương
        </h1>
        <p className="mt-3 max-w-[52ch] text-pretty text-muted">
          Tìm kiếm thông minh — gõ tên, lĩnh vực, sản phẩm, chứng nhận hoặc
          địa điểm. Gõ không dấu vẫn tìm được.
        </p>

        <SearchBar initial={{ q, sector, location }} />

        <div className="mt-10 flex items-center justify-between border-b border-line/60 pb-4">
          <p className="text-sm text-muted">
            <span className="font-display text-lg font-semibold text-ink">
              {results.length}
            </span>{" "}
            doanh nghiệp phù hợp
          </p>
          {hasFilters && (
            <p className="truncate text-xs text-muted">
              {[q, sector, location].filter(Boolean).join(" · ")}
            </p>
          )}
        </div>

        {results.length > 0 ? (
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {results.map((c) => (
              <CompanyCard key={c.slug} company={c} />
            ))}
          </div>
        ) : (
          <div className="mt-10 rounded-[14px] bg-frame p-10 text-center ring-1 ring-line">
            <p className="font-display text-xl font-semibold">
              Không tìm thấy doanh nghiệp
            </p>
            <p className="mt-2 text-sm text-muted">
              Thử bỏ bớt bộ lọc, gõ tên ngắn gọn hơn hoặc đổi lĩnh vực.
            </p>
          </div>
        )}
      </main>

      <SiteFooter />
    </div>
  );
}
