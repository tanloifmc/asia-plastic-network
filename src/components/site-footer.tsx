import { Link } from "@tanstack/react-router";

export function SiteFooter() {
  return (
    <footer className="border-t border-line/70">
      <div className="mx-auto flex max-w-[1280px] flex-col items-start justify-between gap-4 px-5 py-10 sm:flex-row sm:items-center sm:px-8">
        <Link to="/" className="flex items-center gap-2.5">
          <span className="grid size-7 place-items-center rounded-md bg-amber font-display font-bold leading-none text-brand">
            1
          </span>
          <span className="font-display font-semibold tracking-tight">
            1Plastic<span className="text-muted">.Asia</span>
          </span>
        </Link>
        <p className="max-w-[52ch] text-pretty text-sm text-muted">
          Danh bạ giao thương công nghiệp cho ngành Nhựa &amp; Cao su — kết nối nhà sản xuất, nguyên
          liệu và máy móc toàn cầu.
        </p>
      </div>
    </footer>
  );
}
