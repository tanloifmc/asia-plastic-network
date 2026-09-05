import { createFileRoute, Outlet, Link } from "@tanstack/react-router";

function CompaniesNotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-brand px-4 text-ink">
      <div className="max-w-md text-center">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-amber">404</p>
        <h1 className="mt-3 font-display text-4xl font-bold">Không tìm thấy doanh nghiệp</h1>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          Trang doanh nghiệp này không tồn tại hoặc đã bị xoá.
        </p>
        <Link
          to="/companies"
          className="mt-6 inline-block rounded-[10px] bg-amber px-6 py-3 font-display text-sm font-semibold uppercase tracking-wide text-brand hover:bg-amber/90"
        >
          Quay lại danh bạ
        </Link>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/companies")({
  component: () => <Outlet />,
  notFoundComponent: CompaniesNotFound,
});
