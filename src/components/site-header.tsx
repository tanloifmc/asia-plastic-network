import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";

const nav = [
  { to: "/", label: "Trang chủ" },
  { to: "/companies", label: "Danh bạ" },
  { to: "/opportunities", label: "Cơ hội kinh doanh" },
  { to: "/sectors", label: "Lĩnh vực" },
  { to: "/about", label: "Về chúng tôi" },
] as const;

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled
          ? "bg-brand/90 backdrop-blur-md border-b border-line/70"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-[1280px] items-center justify-between px-5 sm:px-8">
        <Link to="/" className="flex items-center gap-2.5">
          <span className="grid size-8 place-items-center rounded-md bg-amber font-display text-lg font-bold leading-none text-brand">
            1
          </span>
          <span className="font-display text-lg font-semibold leading-none tracking-tight">
            1Plastic<span className="text-muted">.Asia</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-7 text-sm text-muted md:flex">
          {nav.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeOptions={{ exact: item.to === "/" }}
              activeProps={{ className: "text-ink font-medium" }}
              className="transition-colors hover:text-ink"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <span className="hidden items-center gap-1.5 text-xs text-muted sm:inline-flex">
            <span className="size-1.5 rounded-full bg-amber" />
            650+ doanh nghiệp
          </span>
          <Link
            to="/companies"
            className="rounded-md px-3.5 py-2 text-sm font-medium text-ink ring-1 ring-line transition-colors hover:bg-steel/50"
          >
            Đăng ký
          </Link>
        </div>
      </div>
    </header>
  );
}
