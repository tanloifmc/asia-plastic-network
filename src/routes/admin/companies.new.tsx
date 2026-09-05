import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "../../lib/supabase";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/card";
import { Loader2, Wand2 } from "lucide-react";
import { sectors, locations, Company } from "../../lib/companies";

export const Route = createFileRoute("/admin/companies/new")({
  component: NewCompanyPage,
});

function NewCompanyPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<"manual" | "ai">("ai");
  const [jsonInput, setJsonInput] = useState("");

  // Default Form state
  const [formData, setFormData] = useState<Partial<Company>>({
    name: "",
    slug: "",
    initials: "",
    sector: sectors[0],
    location: locations[0],
    city: "",
    tagline: "",
    summary: "",
    founded: new Date().getFullYear(),
    employees: "",
    email: "",
    phone: "",
    website: "",
    banner: "",
    logo: "",
    status: "draft", // Mặc định là Nháp
    products: [],
    capabilities: [],
    sections: [],
    slides: []
  });

  const handleJsonImport = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      setFormData(prev => ({
        ...prev,
        ...parsed,
        // Đảm bảo status luôn là draft khi import từ AI
        status: "draft"
      }));
      toast.success("Đã phân tích JSON thành công!");
      setMode("manual"); // Chuyển sang chế độ thủ công để duyệt lại
    } catch (err: any) {
      toast.error("Lỗi JSON: " + err.message);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSlugify = () => {
    if (!formData.name) return;
    const slug = formData.name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-");
    setFormData((prev) => ({ ...prev, slug }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!formData.slug) {
       handleSlugify();
    }

    const { error } = await supabase.from("companies").insert([formData]);

    if (error) {
      toast.error("Thêm thất bại: " + error.message);
      setLoading(false);
    } else {
      toast.success("Thêm doanh nghiệp thành công!");
      navigate({ to: "/admin" });
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl font-bold">Thêm doanh nghiệp mới</h2>
          <p className="text-gray-500 mt-1">Sử dụng AI để nhập nhanh hoặc điền thủ công</p>
        </div>
        <Button variant="outline" onClick={() => navigate({ to: "/admin" })}>
          Trở về
        </Button>
      </div>

      <div className="flex gap-2 mb-6">
        <Button 
          variant={mode === "ai" ? "default" : "outline"} 
          onClick={() => setMode("ai")}
          className="gap-2"
        >
          <Wand2 className="w-4 h-4" /> Import từ AI (JSON)
        </Button>
        <Button 
          variant={mode === "manual" ? "default" : "outline"} 
          onClick={() => setMode("manual")}
        >
          Nhập Thủ Công / Duyệt
        </Button>
      </div>

      {mode === "ai" && (
        <Card className="border-primary/50 shadow-sm">
          <CardHeader>
            <CardTitle>Dán kết quả từ Perplexity / ChatGPT</CardTitle>
            <CardDescription>
              Copy đoạn JSON chuẩn do AI trả về và dán vào đây. Hệ thống sẽ tự động điền form và lưu dưới dạng <b>Bản Nháp</b>.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea 
              rows={15} 
              className="font-mono text-sm bg-gray-50"
              placeholder={'{\n  "name": "Công ty TNHH Nhựa...",\n  "slug": "cong-ty-nhua...",\n  "products": [...]\n}'}
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
            />
            <Button onClick={handleJsonImport} className="w-full gap-2">
              <Wand2 className="w-4 h-4" /> Phân tích & Điền Tự Động
            </Button>
          </CardContent>
        </Card>
      )}

      {mode === "manual" && (
        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle>Thông tin cơ bản</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Tên công ty (*)</Label>
                  <Input id="name" name="name" value={formData.name || ""} onChange={handleChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="slug">Slug (Đường dẫn URL) (*)</Label>
                  <div className="flex gap-2">
                    <Input id="slug" name="slug" value={formData.slug || ""} onChange={handleChange} required />
                    <Button type="button" variant="secondary" onClick={handleSlugify}>Tạo</Button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="initials">Ký tự viết tắt</Label>
                  <Input id="initials" name="initials" value={formData.initials || ""} onChange={handleChange} maxLength={2} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="founded">Năm thành lập</Label>
                  <Input id="founded" name="founded" type="number" value={formData.founded || ""} onChange={handleChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="employees">Số nhân viên</Label>
                  <Input id="employees" name="employees" value={formData.employees || ""} onChange={handleChange} placeholder="VD: 50-100" required />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sector">Lĩnh vực (*)</Label>
                  <select 
                    id="sector" 
                    name="sector" 
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={formData.sector || sectors[0]} 
                    onChange={handleChange}
                  >
                    {sectors.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Quốc gia (*)</Label>
                  <select 
                    id="location" 
                    name="location" 
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={formData.location || locations[0]} 
                    onChange={handleChange}
                  >
                    {locations.map(l => <option key={l} value={l}>{l}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">Thành phố</Label>
                  <Input id="city" name="city" value={formData.city || ""} onChange={handleChange} required />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tagline">Slogan / Tagline (*)</Label>
                <Input id="tagline" name="tagline" value={formData.tagline || ""} onChange={handleChange} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="summary">Đoạn giới thiệu ngắn (*)</Label>
                <Textarea id="summary" name="summary" rows={3} value={formData.summary || ""} onChange={handleChange} required />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email liên hệ</Label>
                  <Input id="email" name="email" type="email" value={formData.email || ""} onChange={handleChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Số điện thoại</Label>
                  <Input id="phone" name="phone" value={formData.phone || ""} onChange={handleChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input id="website" name="website" value={formData.website || ""} onChange={handleChange} />
                </div>
              </div>
              
              <div className="space-y-2 pt-4 border-t">
                <Label htmlFor="status">Trạng thái (Status)</Label>
                <select 
                  id="status" 
                  name="status" 
                  className="flex h-10 w-full rounded-md border border-input bg-yellow-50 px-3 py-2 text-sm font-semibold"
                  value={formData.status || "draft"} 
                  onChange={handleChange}
                >
                  <option value="draft">Bản nháp (Draft) - Chỉ mình bạn thấy</option>
                  <option value="published">Xuất bản (Published) - Hiển thị công khai</option>
                </select>
              </div>
            </CardContent>
          </Card>

          <div className="mt-8 flex justify-end gap-4">
            <Button type="submit" disabled={loading}>
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              {loading ? "Đang lưu..." : "Lưu doanh nghiệp"}
            </Button>
          </div>
          
          <p className="text-center text-sm text-gray-500 mt-4">
            Lưu ý: Để tải lên hình ảnh Logo, Banner, Sản phẩm và Gallery, vui lòng ấn "Lưu doanh nghiệp" trước, sau đó chỉnh sửa lại.
          </p>
        </form>
      )}
    </div>
  );
}
