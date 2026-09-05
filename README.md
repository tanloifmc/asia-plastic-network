# 1Plastic.Asia — Danh Bạ Giao Thương Ngành Nhựa & Cao Su

Nền tảng B2B kết nối doanh nghiệp ngành nhựa và cao su tại châu Á. Mỗi doanh nghiệp sở hữu một trang landing page riêng chuyên nghiệp với thông tin năng lực, sản phẩm và kênh liên hệ báo giá.

🌐 **Domain:** [1Plastic.Asia](https://1plastic.asia)

---

## Tech Stack

| Thành phần | Công nghệ |
|---|---|
| Framework | TanStack Start + TanStack Router |
| UI | React 19 + Tailwind CSS v4 |
| Dữ liệu | JSON files tĩnh (`src/data/companies/`) |
| Search | Fuse.js (fuzzy search) |
| Deploy | Vercel (Static + Edge) |
| Repository | GitHub |
| Ảnh | `public/companies/<slug>/` hoặc Cloudinary CDN |

---

## Cấu trúc thư mục

```
src/
├── data/companies/          ← Dữ liệu doanh nghiệp (1 file JSON / công ty)
├── lib/companies.ts         ← Loader + TypeScript types
├── routes/
│   ├── index.tsx            ← Trang chủ
│   ├── companies.index.tsx  ← Danh bạ + Search
│   ├── companies.$slug.tsx  ← Landing Page từng công ty
│   ├── opportunities.tsx    ← Cơ hội giao thương
│   └── sectors.tsx          ← Phân loại lĩnh vực
└── components/
    ├── sections/            ← Gallery, Stats, Certs, Text, Video sections
    ├── company-card.tsx
    ├── search-bar.tsx
    ├── hero-slider.tsx
    └── contact-dialog.tsx

public/
└── companies/<slug>/        ← Ảnh tĩnh cho từng công ty
```

---

## Thêm Doanh Nghiệp Mới

Xem hướng dẫn đầy đủ trong [`COMPANY_SCHEMA.md`](./COMPANY_SCHEMA.md).

**Tóm tắt 3 bước:**
1. Tạo `src/data/companies/<slug>.json`
2. Upload ảnh vào `public/companies/<slug>/`
3. `git push` → Vercel tự deploy

---

## Chạy Local

```bash
npm install
npm run dev
# → http://localhost:8080
```

---

## Các loại Section cho Landing Page

| type | Mô tả |
|---|---|
| `stats` | Lưới chỉ số: công suất, nhân sự, thị trường |
| `gallery` | Thư viện ảnh nhà máy có thumbnail |
| `certifications` | Thẻ chứng nhận ISO, CE, REACH... |
| `video` | YouTube embed tự động |
| `text` | Đoạn văn câu chuyện thương hiệu |
