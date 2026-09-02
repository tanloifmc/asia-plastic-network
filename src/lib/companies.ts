import hero1 from "@/assets/hero-1.jpg";
import hero2 from "@/assets/hero-2.jpg";
import hero3 from "@/assets/hero-3.jpg";
import company1 from "@/assets/company-1.jpg";
import company2 from "@/assets/company-2.jpg";
import company3 from "@/assets/company-3.jpg";
import bannerVinhPolymer from "@/assets/banner-vinh-polymer.jpg";
import bannerKitayama from "@/assets/banner-kitayama.jpg";
import bannerHanswerk from "@/assets/banner-hanswerk.jpg";
import bannerRegra from "@/assets/banner-regra.jpg";
import bannerSeonjin from "@/assets/banner-seonjin.jpg";
import bannerThermolink from "@/assets/banner-thermolink.jpg";
import bannerAuxitek from "@/assets/banner-auxitek.jpg";
import bannerAarav from "@/assets/banner-aarav.jpg";
import bannerTruongSon from "@/assets/banner-truong-son.jpg";
import logoVinhPolymer from "@/assets/logo-vinh-polymer.png";
import logoKitayama from "@/assets/logo-kitayama.png";
import logoHanswerk from "@/assets/logo-hanswerk.png";
import logoRegra from "@/assets/logo-regra.png";
import logoSeonjin from "@/assets/logo-seonjin.png";
import logoThermolink from "@/assets/logo-thermolink.png";
import logoAuxitek from "@/assets/logo-auxitek.png";
import logoAarav from "@/assets/logo-aarav.png";
import logoTruongSon from "@/assets/logo-truong-son.png";

export const heroImages = [hero1, hero2, hero3];

export const sectors = [
  "Máy móc ngành nhựa & cao su",
  "Hóa chất & nguyên liệu thô",
  "Máy móc phụ trợ",
  "Thiết bị gia nhiệt & điều khiển",
  "Khuôn mẫu",
  "Thủy lực & khí nén",
  "Tái chế",
] as const;

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

export type Company = {
  slug: string;
  name: string;
  initials: string;
  banner: string;
  logo: string;
  sector: (typeof sectors)[number];
  location: (typeof locations)[number];
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
};

const slideSet = (a: string, b: string, c: string, name: string) => [
  {
    image: a,
    eyebrow: "Năng lực sản xuất",
    title: `${name} — vận hành liên tục 24/7`,
    text: "Dây chuyền đồng bộ, kiểm soát chất lượng theo lô và truy xuất nguồn gốc đầy đủ.",
  },
  {
    image: b,
    eyebrow: "Sản phẩm & vật liệu",
    title: "Chuẩn kỹ thuật cho từng đơn hàng",
    text: "Đáp ứng dung sai chặt, chứng nhận vật liệu và hồ sơ kỹ thuật theo yêu cầu khách hàng.",
  },
  {
    image: c,
    eyebrow: "Hợp tác giao thương",
    title: "Sẵn sàng nhận yêu cầu báo giá",
    text: "Đội ngũ kỹ thuật phản hồi RFQ trong 48 giờ làm việc, hỗ trợ mẫu thử và tư vấn tại nhà máy.",
  },
];

export const companies: Company[] = [
  {
    slug: "vinh-polymer",
    name: "Vinh Polymer",
    initials: "VP",
    sector: "Máy móc ngành nhựa & cao su",
    location: "Việt Nam",
    city: "Hải Phòng",
    tagline: "Máy ép phun & dây chuyền tạo hạt",
    summary:
      "Nhà chế tạo máy ép phun và dây chuyền tạo hạt cho linh kiện kỹ thuật, phục vụ ngành ô tô, điện tử và bao bì.",
    founded: 2008,
    employees: "320 nhân sự",
    slides: slideSet(company1, hero1, company3, "Vinh Polymer"),
    products: [
      { name: "Máy ép phun 120–650 tấn", detail: "Servo tiết kiệm điện, điều khiển đa trục" },
      { name: "Dây chuyền tạo hạt", detail: "Công suất 300–1.200 kg/h" },
      { name: "Hệ thống sấy & tiếp liệu", detail: "Tích hợp giám sát từ xa" },
    ],
    capabilities: ["ISO 9001:2015", "Bảo trì tại chỗ", "Đào tạo vận hành", "Xuất khẩu 9 thị trường"],
    email: "sales@vinhpolymer.example",
    phone: "+84 225 555 018",
  },
  {
    slug: "kitayama-chemical",
    name: "Kitayama Chemical",
    initials: "KC",
    sector: "Hóa chất & nguyên liệu thô",
    location: "Nhật Bản",
    city: "Osaka",
    tagline: "Nguyên liệu & phụ gia kỹ thuật",
    summary:
      "Cung cấp hạt nhựa kỹ thuật, chất ổn định nhiệt và masterbatch màu với hồ sơ kiểm định đầy đủ cho từng lô hàng.",
    founded: 1991,
    employees: "540 nhân sự",
    slides: slideSet(company2, hero1, company3, "Kitayama Chemical"),
    products: [
      { name: "Hạt PA6 / PA66 gia cường", detail: "Sợi thủy tinh 15–50%" },
      { name: "Masterbatch màu", detail: "Phối màu theo mẫu trong 5 ngày" },
      { name: "Phụ gia chống UV", detail: "Cho ứng dụng ngoài trời" },
    ],
    capabilities: ["REACH", "RoHS", "Phòng lab nội bộ", "Kho trung chuyển tại Đông Nam Á"],
    email: "export@kitayama-chem.example",
    phone: "+81 6 5550 2214",
  },
  {
    slug: "hanswerk-maschinenguss",
    name: "Hanswerk Maschinenguss",
    initials: "HM",
    sector: "Khuôn mẫu",
    location: "Đức",
    city: "Stuttgart",
    tagline: "Khuôn mẫu chính xác cao",
    summary:
      "Xưởng khuôn chính xác với gia công CNC 5 trục, chuyên khuôn nhiều lòng cho linh kiện y tế và ô tô.",
    founded: 1974,
    employees: "180 nhân sự",
    slides: slideSet(hero3, company1, company3, "Hanswerk Maschinenguss"),
    products: [
      { name: "Khuôn ép nhiều lòng", detail: "Đến 96 lòng khuôn" },
      { name: "Khuôn hai vật liệu", detail: "2K / overmolding" },
      { name: "Dịch vụ sửa & tân trang khuôn", detail: "Thời gian xử lý 10 ngày" },
    ],
    capabilities: ["CNC 5 trục", "Đo CMM", "Thử khuôn tại xưởng", "IATF 16949"],
    email: "info@hanswerk.example",
    phone: "+49 711 555 6620",
  },
  {
    slug: "regra-recyclables",
    name: "Regra Recyclables",
    initials: "RR",
    sector: "Tái chế",
    location: "Thái Lan",
    city: "Rayong",
    tagline: "Nguyên liệu tái chế rPET & rHDPE",
    summary:
      "Đơn vị tái chế quy mô công nghiệp, cung cấp hạt rPET cấp thực phẩm với chuỗi truy xuất nguồn gốc khép kín.",
    founded: 2014,
    employees: "260 nhân sự",
    slides: slideSet(company2, company1, hero2, "Regra Recyclables"),
    products: [
      { name: "Hạt rPET cấp thực phẩm", detail: "IV 0.72–0.84" },
      { name: "Hạt rHDPE", detail: "Cho bao bì công nghiệp" },
      { name: "Dịch vụ thu gom & phân loại", detail: "Hợp đồng dài hạn" },
    ],
    capabilities: ["GRS", "Truy xuất theo lô", "Kiểm định bên thứ ba", "Công suất 42.000 tấn/năm"],
    email: "trade@regra.example",
    phone: "+66 38 555 771",
  },
  {
    slug: "seonjin-hydraulics",
    name: "Seonjin Hydraulics",
    initials: "SH",
    sector: "Thủy lực & khí nén",
    location: "Hàn Quốc",
    city: "Busan",
    tagline: "Bơm, van và cụm thủy lực",
    summary:
      "Chuyên cụm nguồn thủy lực và van tỷ lệ cho máy ép nhựa, tối ưu tiêu thụ năng lượng và độ ổn định áp suất.",
    founded: 1999,
    employees: "210 nhân sự",
    slides: slideSet(hero2, company1, company3, "Seonjin Hydraulics"),
    products: [
      { name: "Cụm nguồn thủy lực servo", detail: "Giảm 35% điện năng" },
      { name: "Van tỷ lệ", detail: "Đáp ứng < 25 ms" },
      { name: "Bộ lọc & làm mát dầu", detail: "Cho vận hành liên tục" },
    ],
    capabilities: ["Thử tải tại xưởng", "Bảo hành 24 tháng", "Kho phụ tùng khu vực"],
    email: "sales@seonjin-hyd.example",
    phone: "+82 51 555 4408",
  },
  {
    slug: "thermolink-controls",
    name: "Thermolink Controls",
    initials: "TC",
    sector: "Thiết bị gia nhiệt & điều khiển",
    location: "Đài Loan",
    city: "Đài Trung",
    tagline: "Gia nhiệt khuôn & bộ điều khiển nhiệt",
    summary:
      "Thiết bị gia nhiệt kênh nóng và bộ điều khiển đa vùng, tích hợp giám sát nhiệt theo thời gian thực.",
    founded: 2005,
    employees: "150 nhân sự",
    slides: slideSet(hero3, hero2, company3, "Thermolink Controls"),
    products: [
      { name: "Bộ điều khiển 12–96 vùng", detail: "Sai số ±0.5°C" },
      { name: "Hệ kênh nóng", detail: "Cho khuôn kỹ thuật" },
      { name: "Cảm biến & module giám sát", detail: "Kết nối MES" },
    ],
    capabilities: ["CE", "Hỗ trợ tích hợp OEM", "Tùy biến theo khuôn"],
    email: "contact@thermolink.example",
    phone: "+886 4 5550 3311",
  },
  {
    slug: "auxitek-systems",
    name: "Auxitek Systems",
    initials: "AS",
    sector: "Máy móc phụ trợ",
    location: "Trung Quốc",
    city: "Ninh Ba",
    tagline: "Thiết bị phụ trợ dây chuyền",
    summary:
      "Máy nghiền, máy sấy, máy trộn và robot gắp sản phẩm cho nhà máy nhựa quy mô vừa và lớn.",
    founded: 2011,
    employees: "430 nhân sự",
    slides: slideSet(company1, hero2, company3, "Auxitek Systems"),
    products: [
      { name: "Robot gắp 3–5 trục", detail: "Chu kỳ 0.8 s" },
      { name: "Máy sấy hút ẩm", detail: "Điểm sương −40°C" },
      { name: "Hệ thống trộn định lượng", detail: "Sai số 0.3%" },
    ],
    capabilities: ["Lắp đặt trọn gói", "Hỗ trợ kỹ thuật từ xa", "Kho linh kiện tại Việt Nam"],
    email: "oversea@auxitek.example",
    phone: "+86 574 5555 900",
  },
  {
    slug: "aarav-compounds",
    name: "Aarav Compounds",
    initials: "AC",
    sector: "Hóa chất & nguyên liệu thô",
    location: "Ấn Độ",
    city: "Ahmedabad",
    tagline: "Compound PVC & TPE",
    summary:
      "Nhà sản xuất compound PVC mềm, TPE và hợp chất chống cháy cho dây cáp, ống dẫn và linh kiện gia dụng.",
    founded: 2003,
    employees: "380 nhân sự",
    slides: slideSet(company2, hero1, company3, "Aarav Compounds"),
    products: [
      { name: "Compound PVC mềm", detail: "Độ cứng 55–95 Shore A" },
      { name: "TPE cho linh kiện tiếp xúc", detail: "Không phthalate" },
      { name: "Hợp chất chống cháy", detail: "UL94 V-0" },
    ],
    capabilities: ["ISO 14001", "Phòng thử nghiệm cháy", "Sản lượng 3.000 tấn/tháng"],
    email: "export@aaravcomp.example",
    phone: "+91 79 5555 2277",
  },
  {
    slug: "truong-son-extrusion",
    name: "Trường Sơn Extrusion",
    initials: "TS",
    sector: "Máy móc ngành nhựa & cao su",
    location: "Việt Nam",
    city: "Bình Dương",
    tagline: "Dây chuyền đùn ống & profile",
    summary:
      "Chế tạo dây chuyền đùn ống PVC, HDPE và profile cửa nhựa, bàn giao trọn gói kèm đào tạo vận hành.",
    founded: 2012,
    employees: "190 nhân sự",
    slides: slideSet(hero2, company1, company3, "Trường Sơn Extrusion"),
    products: [
      { name: "Dây chuyền đùn ống HDPE", detail: "Ø20–630 mm" },
      { name: "Dây chuyền profile", detail: "Đùn hai vít song song" },
      { name: "Máy cắt & nong đầu ống", detail: "Tự động hoàn toàn" },
    ],
    capabilities: ["Bàn giao chìa khóa trao tay", "Bảo trì 24/7", "Thiết kế theo yêu cầu"],
    email: "kinhdoanh@truongson-ex.example",
    phone: "+84 274 555 130",
  },
];

export const getCompany = (slug: string) => companies.find((c) => c.slug === slug);

export const sectorStats = sectors.map((s) => ({
  name: s,
  count: 120 + s.length * 17,
}));
