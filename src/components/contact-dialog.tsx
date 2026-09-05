import { useEffect, useState } from "react";
import type { Company } from "@/lib/companies";

export type ContactMode = "rfq" | "partnership";

type ContactDialogProps = {
  company: Company;
  mode: ContactMode;
  open: boolean;
  onClose: () => void;
};

const inputClass =
  "w-full rounded-[10px] bg-brand px-3.5 py-2.5 text-sm text-ink ring-1 ring-line outline-none transition-colors placeholder:text-muted/60 focus:ring-amber";

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-muted">
        {label}
        {required ? <span className="text-amber"> *</span> : null}
      </span>
      {children}
    </label>
  );
}

export function ContactDialog({ company, mode, open, onClose }: ContactDialogProps) {
  const [name, setName] = useState("");
  const [org, setOrg] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  // rfq
  const [product, setProduct] = useState("");
  const [quantity, setQuantity] = useState("");
  // partnership
  const [coopType, setCoopType] = useState("Phân phối / Đại lý");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  const isRfq = mode === "rfq";
  const title = isRfq ? "Yêu cầu báo giá" : "Đề xuất hợp tác";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const lines = [
      `Họ tên: ${name}`,
      `Công ty: ${org}`,
      `Email: ${email}`,
      phone ? `Điện thoại: ${phone}` : "",
      "",
      isRfq
        ? `Sản phẩm/dịch vụ quan tâm: ${product}\nSố lượng dự kiến: ${quantity}`
        : `Hình thức hợp tác: ${coopType}`,
      "",
      isRfq ? "Nội dung yêu cầu:" : "Nội dung đề xuất:",
      message,
    ].filter((l) => l !== undefined);

    const subject = isRfq
      ? `[1Plastic.Asia] Yêu cầu báo giá gửi ${company.name}`
      : `[1Plastic.Asia] Đề xuất hợp tác gửi ${company.name}`;

    window.location.href = `mailto:${company.email}?subject=${encodeURIComponent(
      subject,
    )}&body=${encodeURIComponent(lines.join("\n"))}`;
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[70] grid place-items-center overflow-y-auto bg-brand/80 p-4 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-label={`${title} — ${company.name}`}
    >
      <div className="w-full max-w-[520px] overflow-hidden rounded-[14px] bg-frame ring-1 ring-line">
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
              <p className="text-[11px] uppercase tracking-[0.18em] text-amber">{title}</p>
              <p className="font-display text-base font-semibold leading-tight">{company.name}</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="px-6 pb-6 pt-10">
          <p className="text-sm leading-relaxed text-muted">
            Thông tin được soạn thành email gửi trực tiếp đến{" "}
            <span className="text-ink">{company.email}</span> — 1Plastic.Asia không lưu trữ nội dung
            của bạn.
          </p>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <Field label="Họ tên" required>
              <input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={inputClass}
                placeholder="Nguyễn Văn A"
              />
            </Field>
            <Field label="Công ty" required>
              <input
                required
                value={org}
                onChange={(e) => setOrg(e.target.value)}
                className={inputClass}
                placeholder="Tên công ty của bạn"
              />
            </Field>
            <Field label="Email" required>
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputClass}
                placeholder="you@company.com"
              />
            </Field>
            <Field label="Điện thoại">
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className={inputClass}
                placeholder="+84 ..."
              />
            </Field>

            {isRfq ? (
              <>
                <Field label="Sản phẩm / dịch vụ quan tâm" required>
                  <input
                    required
                    value={product}
                    onChange={(e) => setProduct(e.target.value)}
                    className={inputClass}
                    placeholder="VD: Hạt nhựa PP, khuôn ép..."
                  />
                </Field>
                <Field label="Số lượng dự kiến">
                  <input
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className={inputClass}
                    placeholder="VD: 5 tấn/tháng"
                  />
                </Field>
              </>
            ) : (
              <div className="sm:col-span-2">
                <Field label="Hình thức hợp tác" required>
                  <select
                    value={coopType}
                    onChange={(e) => setCoopType(e.target.value)}
                    className={inputClass}
                  >
                    {[
                      "Phân phối / Đại lý",
                      "Cung cấp nguyên vật liệu",
                      "Gia công OEM / ODM",
                      "Liên doanh / Đầu tư",
                      "Chuyển giao công nghệ",
                      "Khác",
                    ].map((o) => (
                      <option key={o} value={o} className="bg-brand">
                        {o}
                      </option>
                    ))}
                  </select>
                </Field>
              </div>
            )}

            <div className="sm:col-span-2">
              <Field label={isRfq ? "Nội dung yêu cầu" : "Nội dung đề xuất"} required>
                <textarea
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={4}
                  className={`${inputClass} resize-none`}
                  placeholder={
                    isRfq
                      ? "Quy cách, điều kiện giao hàng, thời gian mong muốn nhận báo giá..."
                      : "Giới thiệu ngắn về công ty, mục tiêu hợp tác, thị trường mong muốn..."
                  }
                />
              </Field>
            </div>
          </div>

          <button
            type="submit"
            className="mt-6 w-full rounded-[10px] bg-amber px-5 py-3 font-display text-sm font-semibold uppercase tracking-wide text-brand transition-colors hover:bg-amber/90"
          >
            {isRfq ? "Gửi yêu cầu báo giá" : "Gửi đề xuất hợp tác"}
          </button>
          <p className="mt-3 text-center text-xs text-muted">
            Hoặc liên hệ trực tiếp: {company.phone}
          </p>
        </form>
      </div>
    </div>
  );
}
