import type { Company } from "@/lib/companies";

export const opportunityTypes = [
  "Tìm nhà phân phối",
  "Tìm nhà cung cấp",
  "Hợp tác OEM/ODM",
  "Liên doanh & đầu tư",
  "Chuyển giao công nghệ",
] as const;

export type OpportunityType = (typeof opportunityTypes)[number];

export type Opportunity = {
  id: string;
  type: OpportunityType;
  title: string;
  companySlug: string;
  markets: string;
  budget: string;
  deadline: string;
  description: string;
  needs: string[];
};

export const opportunities: Opportunity[] = [
  {
    id: "op-01",
    type: "Tìm nhà phân phối",
    title: "Tìm nhà phân phối máy ép phun servo tại Đông Nam Á",
    companySlug: "vinh-polymer",
    markets: "Thái Lan, Indonesia, Philippines",
    budget: "Doanh số cam kết từ 500.000 USD/năm",
    deadline: "31/12/2026",
    description:
      "Cần đối tác phân phối có sẵn đội kỹ thuật bảo trì tại chỗ cho dòng máy ép phun 120–650 tấn. Hỗ trợ đào tạo, phụ tùng và chính sách bảo hành 24 tháng.",
    needs: ["Kho phụ tùng tại địa phương", "Đội kỹ thuật ≥ 5 người", "Kinh nghiệm ngành nhựa ≥ 3 năm"],
  },
  {
    id: "op-02",
    type: "Tìm nhà cung cấp",
    title: "Thu mua hạt nhựa kỹ thuật PA6/PBT dài hạn",
    companySlug: "kitayama-chemical",
    markets: "Việt Nam, Đài Loan, Hàn Quốc",
    budget: "1.200 tấn/năm",
    deadline: "30/06/2026",
    description:
      "Tìm nhà cung cấp hạt nhựa kỹ thuật ổn định chất lượng theo lô, có chứng nhận vật liệu đầy đủ và năng lực giao hàng đúng hạn cho các nhà máy tại châu Á.",
    needs: ["Chứng nhận ISO 9001", "Báo cáo COA theo lô", "Giao hàng ≤ 21 ngày"],
  },
  {
    id: "op-03",
    type: "Hợp tác OEM/ODM",
    title: "Hợp tác OEM khuôn mẫu chính xác cho linh kiện ô tô",
    companySlug: "hanswerk-maschinenguss",
    markets: "Việt Nam, Đức",
    budget: "8–12 bộ khuôn/năm",
    deadline: "15/09/2026",
    description:
      "Cần xưởng khuôn có năng lực gia công CNC 5 trục và đo kiểm CMM để hợp tác sản xuất khuôn ép nhựa dung sai chặt cho cụm linh kiện nội thất ô tô.",
    needs: ["CNC 5 trục", "Đo kiểm CMM", "Bảo mật bản vẽ (NDA)"],
  },
  {
    id: "op-04",
    type: "Liên doanh & đầu tư",
    title: "Liên doanh nhà máy tái chế PET công suất 20.000 tấn/năm",
    companySlug: "regra-recyclables",
    markets: "Việt Nam",
    budget: "Vốn góp 3–5 triệu USD",
    deadline: "01/11/2026",
    description:
      "Mời đối tác cùng góp vốn xây dựng nhà máy tái chế PET đạt chuẩn food-grade, đã có quỹ đất và nguồn nguyên liệu đầu vào ổn định.",
    needs: ["Kinh nghiệm vận hành tái chế", "Năng lực tài chính minh bạch", "Cam kết dài hạn 7 năm"],
  },
  {
    id: "op-05",
    type: "Chuyển giao công nghệ",
    title: "Chuyển giao công nghệ điều khiển gia nhiệt tiết kiệm năng lượng",
    companySlug: "thermolink-controls",
    markets: "Toàn châu Á",
    budget: "Thoả thuận theo license",
    deadline: "Liên tục",
    description:
      "Cung cấp giải pháp và chuyển giao công nghệ bộ điều khiển gia nhiệt giúp giảm 18–25% điện năng cho dây chuyền đùn và ép phun.",
    needs: ["Đối tác tích hợp hệ thống", "Đội ngũ kỹ thuật tại chỗ", "Cam kết dịch vụ hậu mãi"],
  },
  {
    id: "op-06",
    type: "Tìm nhà phân phối",
    title: "Tìm đại lý thiết bị thuỷ lực & khí nén tại Việt Nam",
    companySlug: "auxitek-systems",
    markets: "Việt Nam, Campuchia",
    budget: "Đơn hàng tối thiểu 60.000 USD/quý",
    deadline: "28/02/2027",
    description:
      "Mở rộng kênh phân phối cho dòng bơm, van và xy-lanh khí nén dùng trong dây chuyền nhựa. Ưu tiên đại lý đã phục vụ khu công nghiệp phía Nam.",
    needs: ["Showroom hoặc kho hàng", "Đội bán hàng kỹ thuật", "Thanh toán L/C hoặc T/T"],
  },
];

