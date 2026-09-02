import { useEffect, useRef, useState } from "react";
import type { Company } from "@/lib/companies";

type RfqDialogProps = {
  company: Company;
  open: boolean;
  onClose: () => void;
};

type FormState = {
  name: string;
  email: string;
  phone: string;
  buyerCompany: string;
  product: string;
  quantity: string;
  message: string;
};

const emptyForm: FormState = {
  name: "",
  email: "",
  phone: "",
  buyerCompany: "",
  product: "",
  quantity: "",
  message: "",
};

const inputCls =
  "w-full rounded-[10px] bg-brand px-3.5 py-2.5 text-sm text-ink ring-1 ring-line placeholder:text-muted/60 focus:outline-none focus:ring-amber";

export function RfqDialog({ company, open, onClose }: RfqDialogProps) {
  const [form, setForm] = useState<FormState>(emptyForm);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [sent, setSent] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    setForm((f) => ({ ...emptyForm, product: company.products[0]?.name ?? "" }));
    setErrors({});
    setSent(false);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, company, onClose]);

  if (!open) return null;

  const set = (key: keyof FormState) => (e: { target: { value: string } }) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    setErrors((er) => ({ ...er, [key]: undefined }));
  };

  const validate = () => {
    const er: Partial<Record<keyof FormState, string>> = {};
    if (!form.name.trim()) er.name = "Vui lòng nhập họ tên";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) er.email = "Email chưa hợp lệ";
    if (!form.buyerCompany.trim()) er.buyerCompany = "Vui lòng nhập tên công ty";
    if (!form.message.trim()) er.message = "Vui lòng mô tả nhu cầu";
    setErrors(er);
    return Object.keys(er).length === 0;
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    const subject = encodeURIComponent(
      `[RFQ] Yêu cầu báo giá — ${form.product} — ${form.buyerCompany}`,
    );
    const body = encodeURIComponent(
      [
        `Kính gửi ${company.name},`,
        "",
        `Tôi muốn nhận báo giá cho sản phẩm/dịch vụ: ${form.product}`,
        form.quantity ? `Số lượng dự kiến: ${form.quantity}` : "",
        "",
        "Nội dung yêu cầu:",
        form.message,
        "",
        "— Thông tin người liên hệ —",
        `Họ tên: ${form.name}`,
        `Công ty: ${form.buyerCompany}`,
        `Email: ${form.email}`,
        form.phone ? `Điện thoại: ${form.phone}` : "",
        "",
        "Gửi qua 1Plastic.Asia",
      ]
        .filter((l) => l !== "")
        .join("\n"),
    );
    window.location.href = `mailto:${company.email}?subject=${subject}&body=${body}`;
    setSent(true);
  };

  return (
    <div
      className="fixed inset-0 z-[70] grid place-items-center overflow-y-auto bg-brand/80 p-4 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-label={`Gửi yêu cầu báo giá tới ${company.name}`}
    >
      <div
        ref={dialogRef}
        className="w-full max-w-[560px] overflow-hidden rounded-[14px] bg-frame ring-1 ring-line"
      >
        <div className="relative h-20">
          <img src={company.banner} alt="" aria-hidden="true" className="size-full object-cover" />
          <div className="absolute inset-0 bg-brand/60" />
          <button
            type="button"
            onClick={onClose}
            aria-label="Đóng"
            className="absolute right-4 top-4 grid size-8 place-items-center rounded-full bg-brand/70 text-ink ring-1 ring-line transition-colors hover:bg-steel"
          >
            <svg className="size-4" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path
                d="m5 5 10 10M15 5 5 15"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>
          <div className="absolute -bottom-6 left-6 flex items-end gap-3">
            <div className="grid size-12 place-items-center overflow-hidden rounded-[10px] bg-brand ring-1 ring-line">
              <img src={company.logo} alt="" aria-hidden="true" className="size-9 object-contain" />
            </div>
            <div className="pb-0.5">
              <p className="text-[11px] uppercase tracking-[0.18em] text-amber">Yêu cầu báo giá</p>
              <p className="font-display text-base font-semibold leading-tight">{company.name}</p>
            </div>
          </div>
        </div>

        {sent ? (
          <div className="px-6 pb-8 pt-12 text-center">
            <div className="mx-auto grid size-14 place-items-center rounded-full bg-amber/15 ring-1 ring-amber/40">
              <svg className="size-6 text-amber" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="m5 13 4 4L19 7"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <h3 className="mt-4 font-display text-xl font-semibold">Đã tạo yêu cầu báo giá</h3>
            <p className="mx-auto mt-2 max-w-[42ch] text-sm leading-relaxed text-muted">
              Ứng dụng email của bạn vừa mở với nội dung RFQ gửi tới{" "}
              <span className="text-ink">{company.email}</span>. Nếu chưa thấy, hãy kiểm tra lại
              trình email mặc định.
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <button
                type="button"
                onClick={() => setSent(false)}
                className="rounded-[10px] px-5 py-2.5 text-sm font-medium text-ink ring-1 ring-line transition-colors hover:bg-steel/50"
              >
                Soạn lại
              </button>
              <button
                type="button"
                onClick={onClose}
                className="rounded-[10px] bg-amber px-5 py-2.5 font-display text-sm font-semibold uppercase tracking-wide text-brand transition-colors hover:bg-amber/90"
              >
                Hoàn tất
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={submit} className="px-6 pb-6 pt-10">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="rfq-name" className="mb-1.5 block text-xs font-medium text-muted">
                  Họ tên *
                </label>
                <input
                  id="rfq-name"
                  value={form.name}
                  onChange={set("name")}
                  className={inputCls}
                  placeholder="Nguyễn Văn A"
                />
                {errors.name && <p className="mt-1 text-xs text-red-400">{errors.name}</p>}
              </div>
              <div>
                <label htmlFor="rfq-email" className="mb-1.5 block text-xs font-medium text-muted">
                  Email *
                </label>
                <input
                  id="rfq-email"
                  type="email"
                  value={form.email}
                  onChange={set("email")}
                  className={inputCls}
                  placeholder="ban@congty.com"
                />
                {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email}</p>}
              </div>
              <div>
                <label htmlFor="rfq-phone" className="mb-1.5 block text-xs font-medium text-muted">
                  Điện thoại
                </label>
                <input
                  id="rfq-phone"
                  value={form.phone}
                  onChange={set("phone")}
                  className={inputCls}
                  placeholder="+84 ..."
                />
              </div>
              <div>
                <label
                  htmlFor="rfq-buyer-company"
                  className="mb-1.5 block text-xs font-medium text-muted"
                >
                  Công ty của bạn *
                </label>
                <input
                  id="rfq-buyer-company"
                  value={form.buyerCompany}
                  onChange={set("buyerCompany")}
                  className={inputCls}
                  placeholder="Tên công ty"
                />
                {errors.buyerCompany && (
                  <p className="mt-1 text-xs text-red-400">{errors.buyerCompany}</p>
                )}
              </div>
              <div>
                <label
                  htmlFor="rfq-product"
                  className="mb-1.5 block text-xs font-medium text-muted"
                >
                  Sản phẩm quan tâm
                </label>
                <select
                  id="rfq-product"
                  value={form.product}
                  onChange={set("product")}
                  className={inputCls}
                >
                  {company.products.map((p) => (
                    <option key={p.name} value={p.name}>
                      {p.name}
                    </option>
                  ))}
                  <option value="Khác">Khác</option>
                </select>
              </div>
              <div>
                <label
                  htmlFor="rfq-quantity"
                  className="mb-1.5 block text-xs font-medium text-muted"
                >
                  Số lượng dự kiến
                </label>
                <input
                  id="rfq-quantity"
                  value={form.quantity}
                  onChange={set("quantity")}
                  className={inputCls}
                  placeholder="VD: 2 dây chuyền / 5 tấn"
                />
              </div>
            </div>
            <div className="mt-4">
              <label htmlFor="rfq-message" className="mb-1.5 block text-xs font-medium text-muted">
                Nội dung yêu cầu *
              </label>
              <textarea
                id="rfq-message"
                value={form.message}
                onChange={set("message")}
                rows={4}
                className={inputCls}
                placeholder="Mô tả thông số kỹ thuật, tiêu chuẩn, thời gian giao hàng mong muốn..."
              />
              {errors.message && <p className="mt-1 text-xs text-red-400">{errors.message}</p>}
            </div>
            <div className="mt-5 flex items-center justify-between gap-4">
              <p className="text-xs leading-relaxed text-muted">
                Gửi tới <span className="text-ink">{company.email}</span>
              </p>
              <button
                type="submit"
                className="rounded-[10px] bg-amber px-6 py-3 font-display text-sm font-semibold uppercase tracking-wide text-brand transition-transform hover:bg-amber/90 active:scale-[0.98]"
              >
                Gửi yêu cầu
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
