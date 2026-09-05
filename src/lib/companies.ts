// ─────────────────────────────────────────────────────────────────────────────
// src/lib/companies.ts
//
// Nguồn dữ liệu duy nhất (Single Source of Truth) cho tất cả doanh nghiệp.
// Dữ liệu được đọc tự động từ thư mục src/data/companies/*.json qua
// import.meta.glob. Để thêm công ty mới: chỉ cần thả file JSON vào thư mục
// đó — KHÔNG cần sửa file này.
// ─────────────────────────────────────────────────────────────────────────────

// ── Danh sách lĩnh vực ──────────────────────────────────────────────────────
export const sectors = [
  "Máy móc ngành nhựa & cao su",
  "Hóa chất & nguyên liệu thô",
  "Máy móc phụ trợ",
  "Thiết bị gia nhiệt & điều khiển",
  "Khuôn mẫu",
  "Thủy lực & khí nén",
  "Tái chế",
] as const;

export type Sector = (typeof sectors)[number];

// ── Danh sách thị trường/quốc gia ────────────────────────────────────────────
export const locations = [
  "Việt Nam",
  "Thái Lan",
  "Nhật Bản",
  "Hàn Quốc",
  "Đài Loan",
  "Trung Quốc",
  "Đức",
  "Ấn Độ",
] as const;

export type Location = (typeof locations)[number];

// ── Định nghĩa kiểu Section linh hoạt ────────────────────────────────────────
// Để thêm loại section mới: bổ sung union type ở đây + thêm renderer trong
// src/components/sections/

export type GallerySection = {
  type: "gallery";
  title: string;
  /** URL ảnh: có thể là đường dẫn public (/companies/...) hoặc URL Cloudinary */
  images: string[];
};

export type StatsSection = {
  type: "stats";
  title: string;
  items: { label: string; value: string }[];
};

export type CertificationsSection = {
  type: "certifications";
  title: string;
  items: { name: string; description: string; image?: string }[];
};

export type TextSection = {
  type: "text";
  title: string;
  content: string;
};

export type VideoSection = {
  type: "video";
  title: string;
  /** YouTube embed URL hoặc URL video trực tiếp */
  url: string;
  thumbnail?: string;
};

export type CompanySection =
  | GallerySection
  | StatsSection
  | CertificationsSection
  | TextSection
  | VideoSection;

// ── Định nghĩa kiểu Company ────────────────────────────────────────────────
export type Company = {
  slug: string;
  name: string;
  initials: string;
  /** URL banner: đường dẫn public hoặc Cloudinary */
  banner: string;
  /** URL logo: đường dẫn public hoặc Cloudinary */
  logo: string;
  sector: Sector;
  location: Location;
  city: string;
  tagline: string;
  summary: string;
  founded: number;
  employees: string;
  slides: { image: string; eyebrow: string; title: string; text: string }[];
  products: { name: string; detail: string }[];
  capabilities: string[];
  email: string;
  phone: string;
  website?: string;
  /** Mảng section tùy biến — thêm bao nhiêu section tuỳ ý */
  sections?: CompanySection[];
};

// ── Đọc tất cả JSON trong src/data/companies/ ─────────────────────────────
// Vite's import.meta.glob tự động nhận diện khi có file JSON mới được thêm vào.
// Không cần sửa file này khi thêm công ty mới.
const modules = import.meta.glob("../data/companies/*.json", {
  eager: true,
}) as Record<string, { default: Company }>;

export const companies: Company[] = Object.values(modules)
  .map((m) => m.default)
  .sort((a, b) => a.name.localeCompare(b.name, "vi"));

// ── Hàm tiện ích ──────────────────────────────────────────────────────────
export const getCompany = (slug: string): Company | undefined =>
  companies.find((c) => c.slug === slug);

export const getCompaniesBySector = (sector: Sector): Company[] =>
  companies.filter((c) => c.sector === sector);

export const getCompaniesByLocation = (location: Location): Company[] =>
  companies.filter((c) => c.location === location);

export const sectorStats = sectors.map((s) => ({
  name: s,
  count: companies.filter((c) => c.sector === s).length,
}));

// ── heroImages: dùng cho trang chủ ────────────────────────────────────────
// Dùng URL từ public/ — không cần import tĩnh
export const heroImages = [
  "/hero/hero-1.jpg",
  "/hero/hero-2.jpg",
  "/hero/hero-3.jpg",
] as const;
