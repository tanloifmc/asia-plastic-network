import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { HeroSlider } from "@/components/hero-slider";
import { StatsSectionComponent } from "@/components/sections/stats-section";
import { GallerySectionComponent } from "@/components/sections/gallery-section";
import { CertificationsSectionComponent } from "@/components/sections/certifications-section";
import { TextSectionComponent } from "@/components/sections/text-section";
import { VideoSectionComponent } from "@/components/sections/video-section";
import { fetchCompanyBySlug, type CompanySection } from "@/lib/companies";
import { Mail, Phone, Globe, MapPin } from "lucide-react";

export const Route = createFileRoute("/companies/$slug")({
  headers: () => ({
    "Cache-Control": "public, max-age=300, s-maxage=3600, stale-while-revalidate=86400",
  }),
  loader: async ({ params }) => {
    const company = await fetchCompanyBySlug(params.slug);
    if (!company) {
      throw notFound();
    }
    return { company };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [
          { title: "Không tìm thấy doanh nghiệp — 1Plastic.Asia" },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    const { company } = loaderData;
    const title = `${company.name} — ${company.tagline} | 1Plastic.Asia`;
    const description = company.summary;
    
    // Tạo JSON-LD Schema.org cho SEO
    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": company.name,
      "url": company.website || `https://1plastic.asia/companies/${company.slug}`,
      "logo": company.logo,
      "description": company.summary,
      "address": {
        "@type": "PostalAddress",
        "addressLocality": company.city,
        "addressCountry": company.location
      },
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": company.phone,
        "contactType": "sales",
        "email": company.email
      }
    };

    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
        { property: "og:image", content: company.banner },
        { name: "twitter:card", content: "summary_large_image" },
      ],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify(jsonLd),
        },
      ],
    };
  },
  component: CompanyPage,
});

// ── Renderer trung tâm cho sections ────────────────────────────────────────
function SectionRenderer({ section }: { section: CompanySection }) {
  switch (section.type) {
    case "stats":
      return <StatsSectionComponent section={section} />;
    case "gallery":
      return <GallerySectionComponent section={section} />;
    case "certifications":
      return <CertificationsSectionComponent section={section} />;
    case "text":
      return <TextSectionComponent section={section} />;
    case "video":
      return <VideoSectionComponent section={section} />;
    default:
      return null;
  }
}

function CompanyPage() {
  const { company } = Route.useLoaderData();
  
  // NOTE: Logic Related company chưa hoàn chỉnh (fetch offline), 
  // ta ẩn đi hoặc gọi DB fetch related. Hiện tại đang giả lập rỗng.
  const related: any[] = []; 

  return (
    <div className="min-h-screen bg-brand text-ink">
      <SiteHeader />

      <HeroSlider slides={company.slides || []}>
        <div className="fade-up mt-8 flex flex-wrap items-center gap-3">
          <a
            href="#contact"
            className="rounded-[10px] bg-amber px-6 py-3 font-display text-sm font-semibold uppercase tracking-wide text-brand transition-transform hover:bg-amber/90 active:scale-[0.98]"
          >
            Liên hệ ngay
          </a>
          <Link
            to="/companies"
            className="rounded-[10px] px-5 py-3 text-sm font-medium text-ink ring-1 ring-line transition-colors hover:bg-steel/50 bg-white/10 backdrop-blur-md"
          >
            Quay lại danh bạ
          </Link>
        </div>
      </HeroSlider>

      <main className="mx-auto max-w-[1280px] px-5 py-16 sm:px-8 md:py-24">
        {/* ── Giới thiệu & thông tin cơ bản ─────────────────────────────── */}
        <section className="grid gap-10 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <p className="mb-2 text-xs font-medium uppercase tracking-[0.2em] text-amber">
              Giới thiệu
            </p>
            <h1 className="text-balance font-display text-3xl font-semibold leading-tight md:text-4xl">
              {company.name}
            </h1>
            <p className="mt-4 max-w-[62ch] text-pretty leading-relaxed text-muted">
              {company.summary}
            </p>
            
            {company.capabilities && company.capabilities.length > 0 && (
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
            )}
          </div>

          <dl className="grid grid-cols-2 gap-3 self-start">
            {(
              [
                ["Lĩnh vực", company.sector],
                ["Địa điểm", `${company.city || ''}, ${company.location}`],
                ["Thành lập", String(company.founded || 'N/A')],
                ["Quy mô", company.employees || 'N/A'],
              ] as [string, string][]
            ).map(([k, v]) => (
              <div key={k} className="rounded-[12px] bg-frame p-4 ring-1 ring-line">
                <dt className="text-xs uppercase tracking-[0.16em] text-muted">{k}</dt>
                <dd className="mt-2 text-sm font-medium leading-snug">{v}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* ── Sản phẩm & dịch vụ ─────────────────────────────────────────── */}
        {company.products && company.products.length > 0 && (
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
                  className="rounded-[14px] bg-frame overflow-hidden ring-1 ring-line transition-transform hover:-translate-y-1 hover:ring-steel flex flex-col"
                >
                  {p.images && p.images.length > 0 && (
                    <div className="w-full h-48 bg-gray-100 flex overflow-x-auto snap-x hide-scrollbar">
                      {p.images.map((img, i) => (
                        <img key={i} src={img} alt={`${p.name} ${i+1}`} loading="lazy" className="h-full w-full object-cover shrink-0 snap-center" />
                      ))}
                    </div>
                  )}
                  <div className="p-5 flex-1 bg-white">
                    <h3 className="font-display text-lg font-semibold leading-tight">
                      {p.name}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted whitespace-pre-line">{p.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── Dynamic Sections (gallery, stats, certifications, text, video) ── */}
        {company.sections?.map((section, i) => (
          <SectionRenderer key={`${section.type}-${i}`} section={section} />
        ))}

        {/* ── Liên hệ ─────────────────────────────────────────────────────── */}
        <section id="contact" className="mt-20 rounded-[14px] bg-frame p-6 ring-1 ring-line md:p-10">
          <div className="grid gap-8 md:grid-cols-2 items-center">
            <div>
              <p className="mb-2 text-xs font-medium uppercase tracking-[0.2em] text-amber">
                Liên hệ giao thương
              </p>
              <h2 className="font-display text-2xl font-semibold leading-tight md:text-3xl">
                Kết nối trực tiếp với {company.name}
              </h2>
              <p className="mt-3 text-sm text-muted mb-6">
                Bạn quan tâm đến sản phẩm, dịch vụ hoặc muốn trở thành đối tác? 
                Vui lòng liên hệ trực tiếp với doanh nghiệp thông qua các kênh bên dưới.
              </p>
            </div>
            
            <div className="space-y-4 bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              {company.phone && (
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-amber/10 flex items-center justify-center text-amber">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-muted uppercase">Điện thoại</p>
                    <a href={`tel:${company.phone}`} className="font-medium hover:text-amber transition-colors">
                      {company.phone}
                    </a>
                  </div>
                </div>
              )}
              
              {company.email && (
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-amber/10 flex items-center justify-center text-amber">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-muted uppercase">Email liên hệ</p>
                    <a href={`mailto:${company.email}`} className="font-medium hover:text-amber transition-colors">
                      {company.email}
                    </a>
                  </div>
                </div>
              )}
              
              {company.website && (
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-amber/10 flex items-center justify-center text-amber">
                    <Globe className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-muted uppercase">Website</p>
                    <a href={company.website} target="_blank" rel="noopener noreferrer" className="font-medium hover:text-amber transition-colors">
                      Truy cập trang web
                    </a>
                  </div>
                </div>
              )}
              
              {(company.city || company.location) && (
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-amber/10 flex items-center justify-center text-amber">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-muted uppercase">Trụ sở</p>
                    <p className="font-medium">
                      {company.city ? `${company.city}, ` : ''}{company.location}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

      </main>

      <SiteFooter />
    </div>
  );
}
