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
  status?: "draft" | "published";
};

import { supabase } from "./supabase";

// ── Hàm tiện ích ──────────────────────────────────────────────────────────
export const fetchCompanies = async (): Promise<Company[]> => {
  const { data, error } = await supabase
    .from("companies")
    .select("*")
    .eq("status", "published")
    .order("name", { ascending: true });
  
  if (error) {
    console.error("Lỗi fetch danh sách công ty:", error);
    return [];
  }
  return data as Company[];
};

export const fetchCompanyBySlug = async (slug: string): Promise<Company | undefined> => {
  const { data, error } = await supabase
    .from("companies")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) {
    console.error(`Lỗi fetch công ty ${slug}:`, error);
    return undefined;
  }
  return data as Company;
};

export const fetchSectorStats = async () => {
  // Thay vì query từng sector phức tạp, ta fetch select("sector")
  const { data, error } = await supabase.from("companies").select("sector").eq("status", "published");
  if (error) return [];
  
  const stats = sectors.map((s) => ({
    name: s,
    count: data.filter((c) => c.sector === s).length,
  }));
  return stats;
};

// ── heroImages: dùng cho trang chủ ────────────────────────────────────────
// Dùng URL từ public/ — không cần import tĩnh
export const heroImages = [
  "/hero/hero-1.jpg",
  "/hero/hero-2.jpg",
  "/hero/hero-3.jpg",
] as const;
