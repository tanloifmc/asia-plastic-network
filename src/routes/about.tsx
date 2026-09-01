import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

const title = "Về 1Plastic.Asia — Sàn danh bạ giao thương ngành nhựa";
const description =
  "1Plastic.Asia là danh bạ giao thương B2B cho ngành nhựa và cao su châu Á, nơi mỗi doanh nghiệp sở hữu một trang hồ sơ năng lực riêng.";

export const Route = createFileRoute("/about")({
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
  component: AboutPage,
});

const stats = [
  ["650+", "Doanh nghiệp niêm yết"],
  ["15+", "Quốc gia tham gia"],
  ["7", "Nhóm ngành chuyên biệt"],
  ["48h", "Thời gian phản hồi RFQ"],
];

function AboutPage() {
  return (
    <div className="min-h-screen bg-brand text-ink">
      <SiteHeader />

      <main className="mx-auto max-w-[1280px] px-5 pb-24 pt-28 sm:px-8">
        <p className="mb-2 text-xs font-medium uppercase tracking-[0.2em] text-amber">
          Về chúng tôi
        </p>
        <h1 className="max-w-[20ch] text-balance font-display text-4xl font-bold uppercase leading-[0.95] tracking-tight md:text-5xl">
          Một danh bạ, toàn bộ chuỗi cung ứng polymer
        </h1>
        <p className="mt-4 max-w-[62ch] text-pretty leading-relaxed text-muted">
          1Plastic.Asia được xây dựng cho các nhà sản xuất, nhà cung cấp nguyên liệu và đơn vị chế
          tạo máy trong ngành nhựa &amp; cao su. Mỗi doanh nghiệp sở hữu một trang landing riêng để
          trình bày năng lực, sản phẩm và kênh nhận yêu cầu báo giá — thay cho những hồ sơ PDF rời
          rạc.
        </p>

        <div className="mt-12 grid grid-cols-2 gap-3 md:grid-cols-4">
          {stats.map(([v, k]) => (
            <div key={k} className="rounded-[12px] bg-frame p-5 ring-1 ring-line">
              <span className="font-display text-3xl font-bold leading-none text-amber">{v}</span>
              <p className="mt-3 text-sm leading-snug text-muted">{k}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 rounded-[14px] bg-frame p-6 ring-1 ring-line md:p-10">
          <h2 className="font-display text-2xl font-semibold leading-tight md:text-3xl">
            Đưa doanh nghiệp của bạn lên danh bạ
          </h2>
          <p className="mt-3 max-w-[58ch] text-pretty text-sm leading-relaxed text-muted">
            Gửi hồ sơ năng lực, danh mục sản phẩm và thông tin liên hệ — đội ngũ biên tập sẽ dựng
            trang landing riêng cho doanh nghiệp trong vòng 5 ngày làm việc.
          </p>
          <Link
            to="/companies"
            className="mt-6 inline-block rounded-[10px] bg-amber px-6 py-3 font-display text-sm font-semibold uppercase tracking-wide text-brand transition-transform hover:bg-amber/90 active:scale-[0.98]"
          >
            Xem danh bạ
          </Link>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
