# Hướng Dẫn Thêm Doanh Nghiệp Mới — 1Plastic.Asia

## Quy trình thêm 1 công ty mới (3 bước)

```
Bước 1: Tạo file JSON → src/data/companies/<slug>.json
Bước 2: Upload ảnh → public/companies/<slug>/ 
Bước 3: Commit lên GitHub → Vercel tự deploy trong 2 phút
```

---

## Schema JSON đầy đủ (copy & chỉnh sửa)

```json
{
  "slug": "ten-cong-ty",
  "name": "Tên Công Ty",
  "initials": "TC",
  "banner": "/companies/ten-cong-ty/banner.jpg",
  "logo": "/companies/ten-cong-ty/logo.png",
  "sector": "Máy móc ngành nhựa & cao su",
  "location": "Việt Nam",
  "city": "Hồ Chí Minh",
  "tagline": "Slogan ngắn gọn của công ty",
  "summary": "Mô tả 1-2 câu về công ty, chuyên môn và thị trường phục vụ.",
  "founded": 2010,
  "employees": "200 nhân sự",
  "slides": [
    {
      "image": "/companies/ten-cong-ty/slide-1.jpg",
      "eyebrow": "Năng lực sản xuất",
      "title": "Tên Công Ty — vận hành liên tục 24/7",
      "text": "Mô tả ngắn về dây chuyền và năng lực."
    },
    {
      "image": "/companies/ten-cong-ty/slide-2.jpg",
      "eyebrow": "Sản phẩm & vật liệu",
      "title": "Chuẩn kỹ thuật cho từng đơn hàng",
      "text": "Mô tả về chất lượng sản phẩm."
    },
    {
      "image": "/companies/ten-cong-ty/slide-3.jpg",
      "eyebrow": "Hợp tác giao thương",
      "title": "Sẵn sàng nhận yêu cầu báo giá",
      "text": "Thông tin hỗ trợ và thời gian phản hồi."
    }
  ],
  "products": [
    { "name": "Tên sản phẩm 1", "detail": "Thông số kỹ thuật" },
    { "name": "Tên sản phẩm 2", "detail": "Thông số kỹ thuật" },
    { "name": "Tên sản phẩm 3", "detail": "Thông số kỹ thuật" }
  ],
  "capabilities": ["Chứng chỉ 1", "Năng lực 2", "Dịch vụ 3"],
  "email": "contact@company.com",
  "phone": "+84 xxx xxx xxx",
  "website": "https://company.com",
  "sections": [
    {
      "type": "stats",
      "title": "Năng lực sản xuất",
      "items": [
        { "label": "Công suất", "value": "1.000 tấn/năm" },
        { "label": "Nhân sự", "value": "200 người" },
        { "label": "Năm thành lập", "value": "2010" },
        { "label": "Thị trường", "value": "5 quốc gia" }
      ]
    },
    {
      "type": "certifications",
      "title": "Chứng nhận & tiêu chuẩn",
      "items": [
        { "name": "ISO 9001:2015", "description": "Quản lý chất lượng" },
        { "name": "CE Marking", "description": "Tiêu chuẩn châu Âu" }
      ]
    },
    {
      "type": "gallery",
      "title": "Hình ảnh nhà máy",
      "images": [
        "/companies/ten-cong-ty/factory-1.jpg",
        "/companies/ten-cong-ty/factory-2.jpg",
        "/companies/ten-cong-ty/factory-3.jpg"
      ]
    },
    {
      "type": "video",
      "title": "Video giới thiệu nhà máy",
      "url": "https://www.youtube.com/watch?v=VIDEO_ID"
    },
    {
      "type": "text",
      "title": "Câu chuyện thương hiệu",
      "content": "Đoạn văn giới thiệu dài hơn về lịch sử, giá trị cốt lõi và tầm nhìn của công ty."
    }
  ]
}
```

---

## Quy tắc đặt `slug`

- Chỉ dùng chữ thường, số và dấu gạch ngang `-`
- Không dấu tiếng Việt
- Ví dụ: `nhua-binh-minh`, `tan-a-dai-thanh`, `fpt-plastics`
- Slug = tên thư mục ảnh = URL trang: `/companies/<slug>`

---

## Các giá trị hợp lệ cho `sector`

```
"Máy móc ngành nhựa & cao su"
"Hóa chất & nguyên liệu thô"
"Máy móc phụ trợ"
"Thiết bị gia nhiệt & điều khiển"
"Khuôn mẫu"
"Thủy lực & khí nén"
"Tái chế"
```

## Các giá trị hợp lệ cho `location`

```
"Việt Nam" | "Thái Lan" | "Nhật Bản" | "Hàn Quốc"
"Đài Loan" | "Trung Quốc" | "Đức" | "Ấn Độ"
```

> Nếu quốc gia không có trong danh sách, hãy báo để bổ sung vào hệ thống.

---

## Cấu trúc thư mục ảnh

```
public/
└── companies/
    └── ten-cong-ty/
        ├── banner.jpg      ← Ảnh banner trang công ty (16:9, tối thiểu 1280x720px)
        ├── logo.png        ← Logo công ty (nền trong suốt, 400x400px)
        ├── slide-1.jpg     ← Ảnh slide 1 hero (16:9)
        ├── slide-2.jpg     ← Ảnh slide 2 hero (16:9)
        ├── slide-3.jpg     ← Ảnh slide 3 hero (16:9)
        ├── factory-1.jpg   ← Ảnh gallery (bất kỳ tỷ lệ)
        ├── factory-2.jpg
        └── factory-3.jpg
```

### Nén ảnh trước khi upload

| Loại | Kích thước tối đa | Định dạng |
|---|---|---|
| Banner, Slides | 1280×720 px | JPG, 80% quality |
| Logo | 400×400 px | PNG (transparent) hoặc WebP |
| Gallery | 1200×800 px | JPG, 75% quality |

**Công cụ nén miễn phí:** [squoosh.app](https://squoosh.app) hoặc [tinypng.com](https://tinypng.com)

---

## Sử dụng Cloudinary (tuỳ chọn)

Nếu không muốn lưu ảnh trong repo, upload lên Cloudinary và dùng URL:

```json
"banner": "https://res.cloudinary.com/YOUR_CLOUD/image/upload/v1/companies/vinh-polymer/banner.jpg"
```

**Cloudinary Free:** 25 GB storage, 25 GB bandwidth/tháng — đủ dùng cho ~500 công ty.

---

## Prompt mẫu cho AI tạo dữ liệu

```
Hãy tạo file JSON theo chuẩn COMPANY_SCHEMA.md cho công ty sau:

Tên: [Tên công ty]
Lĩnh vực: [Lĩnh vực hoạt động]
Quốc gia/Thành phố: [Địa điểm]
Mô tả: [Mô tả ngắn về công ty]
Sản phẩm chính: [Danh sách sản phẩm]
Chứng nhận: [Danh sách chứng nhận nếu có]
Email: [Email liên hệ]
Điện thoại: [Số điện thoại]
Website: [URL website nếu có]

Tạo 4-6 items cho section stats dựa trên thông tin trên.
Tạo 3 slides với nội dung phù hợp ngành nhựa.
```

---

## Các loại `sections` hiện hỗ trợ

| type | Mô tả | Dùng khi |
|---|---|---|
| `stats` | Lưới chỉ số nổi bật | Công suất, nhân sự, năm thành lập, thị trường |
| `certifications` | Thẻ chứng nhận | ISO, CE, REACH, RoHS, ngành đặc thù |
| `gallery` | Thư viện ảnh có thumbnail | Hình ảnh nhà máy, sản phẩm, dây chuyền |
| `video` | Video YouTube/MP4 | Giới thiệu công ty, tour nhà máy |
| `text` | Đoạn văn tự do | Câu chuyện thương hiệu, lịch sử, triết lý |
