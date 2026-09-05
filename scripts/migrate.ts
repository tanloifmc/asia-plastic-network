import { createClient } from "@supabase/supabase-js";
import * as fs from "fs";
import * as path from "path";
import * as dotenv from "dotenv";
import { fileURLToPath } from "url";

// Fix __dirname for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load biến môi trường từ .env
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ Thiếu VITE_SUPABASE_URL hoặc VITE_SUPABASE_ANON_KEY trong file .env");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const DATA_DIR = path.resolve(__dirname, "../src/data/companies");
const PUBLIC_DIR = path.resolve(__dirname, "../public");

async function uploadFileToSupabase(filePath: string, storagePath: string) {
  if (!fs.existsSync(filePath)) {
    console.warn(`⚠️ Không tìm thấy file: ${filePath}`);
    return null;
  }

  const fileExt = path.extname(filePath);
  let mimeType = "image/jpeg";
  if (fileExt === ".png") mimeType = "image/png";
  if (fileExt === ".webp") mimeType = "image/webp";
  if (fileExt === ".svg") mimeType = "image/svg+xml";

  const fileBuffer = fs.readFileSync(filePath);

  const { data, error } = await supabase.storage
    .from("company-images")
    .upload(storagePath, fileBuffer, {
      contentType: mimeType,
      upsert: true,
    });

  if (error) {
    console.error(`❌ Lỗi upload file ${filePath}:`, error.message);
    return null;
  }

  // Lấy public URL
  const { data: publicUrlData } = supabase.storage
    .from("company-images")
    .getPublicUrl(storagePath);

  return publicUrlData.publicUrl;
}

async function processCompanyImages(company: any) {
  console.log(`\n⏳ Đang xử lý ảnh cho công ty: ${company.name} (${company.slug})...`);
  const slug = company.slug;

  if (company.banner && company.banner.startsWith("/companies/")) {
    const localPath = path.join(PUBLIC_DIR, company.banner);
    const storagePath = `${slug}/banner${path.extname(localPath)}`;
    const url = await uploadFileToSupabase(localPath, storagePath);
    if (url) company.banner = url;
  }

  if (company.logo && company.logo.startsWith("/companies/")) {
    const localPath = path.join(PUBLIC_DIR, company.logo);
    const storagePath = `${slug}/logo${path.extname(localPath)}`;
    const url = await uploadFileToSupabase(localPath, storagePath);
    if (url) company.logo = url;
  }

  if (company.slides) {
    for (let i = 0; i < company.slides.length; i++) {
      const slide = company.slides[i];
      if (slide.image && slide.image.startsWith("/companies/")) {
        const localPath = path.join(PUBLIC_DIR, slide.image);
        const storagePath = `${slug}/slide-${i + 1}${path.extname(localPath)}`;
        const url = await uploadFileToSupabase(localPath, storagePath);
        if (url) slide.image = url;
      }
    }
  }

  if (company.sections) {
    for (const section of company.sections) {
      if (section.type === "gallery" && section.images) {
        for (let i = 0; i < section.images.length; i++) {
          const img = section.images[i];
          if (img && img.startsWith("/companies/")) {
            const localPath = path.join(PUBLIC_DIR, img);
            const storagePath = `${slug}/gallery-${i + 1}${path.extname(localPath)}`;
            const url = await uploadFileToSupabase(localPath, storagePath);
            if (url) section.images[i] = url;
          }
        }
      }
      
      if (section.type === "certifications" && section.items) {
        for (let i = 0; i < section.items.length; i++) {
          const item = section.items[i];
          if (item.image && item.image.startsWith("/companies/")) {
            const localPath = path.join(PUBLIC_DIR, item.image);
            const storagePath = `${slug}/cert-${i + 1}${path.extname(localPath)}`;
            const url = await uploadFileToSupabase(localPath, storagePath);
            if (url) item.image = url;
          }
        }
      }
    }
  }

  return company;
}

async function run() {
  console.log("🚀 Bắt đầu quá trình đồng bộ dữ liệu lên Supabase...\n");
  const files = fs.readdirSync(DATA_DIR).filter(f => f.endsWith(".json"));

  for (const file of files) {
    const filePath = path.join(DATA_DIR, file);
    const rawData = fs.readFileSync(filePath, "utf-8");
    let company = JSON.parse(rawData);

    company = await processCompanyImages(company);

    console.log(`📤 Đang lưu thông tin ${company.name} vào database...`);
    const { error } = await supabase.from("companies").upsert({
      slug: company.slug,
      name: company.name,
      initials: company.initials,
      banner: company.banner,
      logo: company.logo,
      sector: company.sector,
      location: company.location,
      city: company.city,
      tagline: company.tagline,
      summary: company.summary,
      founded: company.founded,
      employees: company.employees,
      slides: company.slides,
      products: company.products,
      capabilities: company.capabilities,
      email: company.email,
      phone: company.phone,
      website: company.website,
      sections: company.sections,
    }, { onConflict: "slug" });

    if (error) {
      console.error(`❌ Lỗi lưu DB cho ${company.name}:`, error.message);
    } else {
      console.log(`✅ Thành công: ${company.name}`);
    }
  }

  console.log("\n🎉 HOÀN TẤT ĐỒNG BỘ DỮ LIỆU!");
}

run().catch(console.error);
