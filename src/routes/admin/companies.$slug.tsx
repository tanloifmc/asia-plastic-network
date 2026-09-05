import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Loader2 } from "lucide-react";
import { sectors, locations } from "../../lib/companies";

export const Route = createFileRoute("/admin/companies/$slug")({
  component: EditCompanyPage,
});

function EditCompanyPage() {
  const navigate = useNavigate();
  const { slug } = Route.useParams();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [id, setId] = useState("");

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    initials: "",
    sector: sectors[0],
    location: locations[0],
    city: "",
    tagline: "",
    summary: "",
    founded: "",
    employees: "",
    email: "",
    phone: "",
    website: "",
    banner: "",
    logo: "",
  });

  useEffect(() => {
    const fetchCompany = async () => {
      const { data, error } = await supabase
        .from("companies")
        .select("*")
        .eq("slug", slug)
        .single();
        
      if (error) {
        toast.error("Không tìm thấy công ty");
        navigate({ to: "/admin" });
        return;
      }
      
      setId(data.id);
      setFormData({
        name: data.name || "",
        slug: data.slug || "",
        initials: data.initials || "",
        sector: data.sector || sectors[0],
        location: data.location || locations[0],
        city: data.city || "",
        tagline: data.tagline || "",
        summary: data.summary || "",
        founded: (data.founded || "").toString(),
        employees: data.employees || "",
        email: data.email || "",
        phone: data.phone || "",
        website: data.website || "",
        banner: data.banner || "",
        logo: data.logo || "",
      });
      setFetching(false);
    };
    fetchCompany();
  }, [slug, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const uploadImage = async (e: React.ChangeEvent<HTMLInputElement>, fieldName: "logo" | "banner") => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    
    setUploadingImage(true);
    toast.info(`Đang tải ảnh ${fieldName}...`);
    
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("company-images")
      .upload(filePath, file);

    if (uploadError) {
      toast.error("Lỗi tải ảnh: " + uploadError.message);
      setUploadingImage(false);
      return;
    }

    // Lấy Public URL
    const { data: publicUrlData } = supabase.storage
      .from("company-images")
      .getPublicUrl(filePath);

    setFormData((prev) => ({ ...prev, [fieldName]: publicUrlData.publicUrl }));
    toast.success("Tải ảnh thành công!");
    setUploadingImage(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const updateData = {
      ...formData,
      founded: parseInt(formData.founded) || new Date().getFullYear(),
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase
      .from("companies")
      .update(updateData)
      .eq("id", id);

    if (error) {
      toast.error("Cập nhật thất bại: " + error.message);
      setLoading(false);
    } else {
      toast.success("Cập nhật thành công!");
      navigate({ to: "/admin" });
    }
  };

  if (fetching) {
    return (
      <div className="flex h-96 w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold">Chỉnh sửa doanh nghiệp</h2>
        <Button variant="outline" onClick={() => navigate({ to: "/admin" })}>
          Huỷ & Trở về
        </Button>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Thông tin cơ bản</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Tên công ty (*)</Label>
                <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">Slug (Đường dẫn URL) (*)</Label>
                <Input id="slug" name="slug" value={formData.slug} onChange={handleChange} required disabled />
                <p className="text-xs text-muted-foreground">Không thể thay đổi slug sau khi tạo.</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="initials">Ký tự viết tắt (2 chữ cái)</Label>
                <Input id="initials" name="initials" value={formData.initials} onChange={handleChange} maxLength={2} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="founded">Năm thành lập</Label>
                <Input id="founded" name="founded" type="number" value={formData.founded} onChange={handleChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="employees">Số nhân viên</Label>
                <Input id="employees" name="employees" value={formData.employees} onChange={handleChange} placeholder="VD: 50-100" required />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="sector">Lĩnh vực (*)</Label>
                <select 
                  id="sector" 
                  name="sector" 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={formData.sector} 
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
                  value={formData.location} 
                  onChange={handleChange}
                >
                  {locations.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">Thành phố</Label>
                <Input id="city" name="city" value={formData.city} onChange={handleChange} required />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tagline">Slogan / Tagline (*)</Label>
              <Input id="tagline" name="tagline" value={formData.tagline} onChange={handleChange} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="summary">Đoạn giới thiệu ngắn (*)</Label>
              <Textarea id="summary" name="summary" rows={3} value={formData.summary} onChange={handleChange} required />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email liên hệ</Label>
                <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Số điện thoại</Label>
                <Input id="phone" name="phone" value={formData.phone} onChange={handleChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="website">Website (Không bắt buộc)</Label>
                <Input id="website" name="website" value={formData.website} onChange={handleChange} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Hình ảnh</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <Label>Logo</Label>
                <div className="flex items-center gap-4">
                  {formData.logo ? (
                    <img src={formData.logo} alt="Logo preview" className="w-20 h-20 object-contain border rounded-md" />
                  ) : (
                    <div className="w-20 h-20 bg-gray-100 border rounded-md flex items-center justify-center text-xs text-gray-400">Trống</div>
                  )}
                  <div className="flex-1">
                    <Input type="file" accept="image/*" onChange={(e) => uploadImage(e, "logo")} disabled={uploadingImage} />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <Label>Banner (Ảnh nền)</Label>
                <div className="flex items-center gap-4">
                  {formData.banner ? (
                    <img src={formData.banner} alt="Banner preview" className="w-32 h-20 object-cover border rounded-md" />
                  ) : (
                    <div className="w-32 h-20 bg-gray-100 border rounded-md flex items-center justify-center text-xs text-gray-400">Trống</div>
                  )}
                  <div className="flex-1">
                    <Input type="file" accept="image/*" onChange={(e) => uploadImage(e, "banner")} disabled={uploadingImage} />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => navigate({ to: "/admin" })}>Huỷ</Button>
          <Button type="submit" disabled={loading || uploadingImage}>
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            {loading ? "Đang lưu..." : "Lưu doanh nghiệp"}
          </Button>
        </div>
      </form>
    </div>
  );
}
