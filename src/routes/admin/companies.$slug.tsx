import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/card";
import { Loader2, Plus, Trash2, Image as ImageIcon } from "lucide-react";
import { sectors, locations, Company } from "../../lib/companies";

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
    status: "draft",
    products: [],
    sections: [],
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
        ...data,
        status: data.status || "draft",
        products: data.products || [],
        sections: data.sections || [],
      });
      setFetching(false);
    };
    fetchCompany();
  }, [slug, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const uploadDirectImage = async (file: File): Promise<string | null> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error } = await supabase.storage.from("company-images").upload(filePath, file);
    if (error) {
      toast.error("Lỗi tải ảnh: " + error.message);
      return null;
    }
    const { data } = supabase.storage.from("company-images").getPublicUrl(filePath);
    return data.publicUrl;
  };

  const handleUploadMain = async (e: React.ChangeEvent<HTMLInputElement>, fieldName: "logo" | "banner") => {
    if (!e.target.files?.length) return;
    setUploadingImage(true);
    toast.info(`Đang tải ${fieldName}...`);
    const url = await uploadDirectImage(e.target.files[0]);
    if (url) {
      setFormData(prev => ({ ...prev, [fieldName]: url }));
      toast.success("Tải ảnh thành công!");
    }
    setUploadingImage(false);
  };

  const handleUploadGallery = async (e: React.ChangeEvent<HTMLInputElement>, sectionIndex: number) => {
    if (!e.target.files?.length) return;
    setUploadingImage(true);
    toast.info(`Đang tải ảnh vào Gallery...`);
    const url = await uploadDirectImage(e.target.files[0]);
    if (url) {
      setFormData(prev => {
        const newSections = [...(prev.sections || [])];
        const sec = newSections[sectionIndex];
        if (sec.type === "gallery") {
          sec.images = [...(sec.images || []), url];
        }
        return { ...prev, sections: newSections };
      });
      toast.success("Đã thêm ảnh vào Gallery!");
    }
    setUploadingImage(false);
  };

  const handleDeleteGalleryImage = (sectionIndex: number, imageIndex: number) => {
    setFormData(prev => {
      const newSections = [...(prev.sections || [])];
      const sec = newSections[sectionIndex];
      if (sec.type === "gallery" && sec.images) {
        sec.images = sec.images.filter((_, i) => i !== imageIndex);
      }
      return { ...prev, sections: newSections };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const updateData = {
      ...formData,
      founded: parseInt(formData.founded as any) || new Date().getFullYear(),
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase.from("companies").update(updateData).eq("id", id);

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
    <div className="max-w-5xl mx-auto pb-12">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl font-bold">Chỉnh sửa doanh nghiệp</h2>
          {formData.status === "draft" && (
            <span className="inline-flex items-center mt-2 px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
              Đang là Bản nháp
            </span>
          )}
        </div>
        <Button variant="outline" onClick={() => navigate({ to: "/admin" })}>
          Trở về
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Trạng thái xuất bản</CardTitle>
          </CardHeader>
          <CardContent>
            <select 
              name="status" 
              className={`flex h-10 w-full rounded-md border px-3 py-2 text-sm font-semibold ${formData.status === 'published' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-yellow-50 border-yellow-200 text-yellow-700'}`}
              value={formData.status} 
              onChange={handleChange}
            >
              <option value="draft">Bản nháp (Khách không xem được)</option>
              <option value="published">Xuất bản (Hiển thị công khai)</option>
            </select>
          </CardContent>
        </Card>

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
                <Input id="slug" name="slug" value={formData.slug || ""} onChange={handleChange} required disabled />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="sector">Lĩnh vực (*)</Label>
                <select id="sector" name="sector" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={formData.sector || sectors[0]} onChange={handleChange}>
                  {sectors.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Quốc gia (*)</Label>
                <select id="location" name="location" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={formData.location || locations[0]} onChange={handleChange}>
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
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Logo & Banner</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <Label>Logo</Label>
                <div className="flex items-center gap-4">
                  {formData.logo ? (
                    <img src={formData.logo} alt="Logo" className="w-20 h-20 object-contain border rounded-md" />
                  ) : (
                    <div className="w-20 h-20 bg-gray-100 border rounded-md flex items-center justify-center text-xs text-gray-400">Trống</div>
                  )}
                  <div className="flex-1">
                    <Input type="file" accept="image/*" onChange={(e) => handleUploadMain(e, "logo")} disabled={uploadingImage} />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <Label>Banner (Ảnh nền)</Label>
                <div className="flex items-center gap-4">
                  {formData.banner ? (
                    <img src={formData.banner} alt="Banner" className="w-32 h-20 object-cover border rounded-md" />
                  ) : (
                    <div className="w-32 h-20 bg-gray-100 border rounded-md flex items-center justify-center text-xs text-gray-400">Trống</div>
                  )}
                  <div className="flex-1">
                    <Input type="file" accept="image/*" onChange={(e) => handleUploadMain(e, "banner")} disabled={uploadingImage} />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {formData.products && formData.products.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Danh sách sản phẩm (AI đã tạo)</CardTitle>
              <CardDescription>
                AI đã tự động bóc tách các sản phẩm. Bạn có thể xem lại hoặc sửa đổi. Tính năng upload ảnh từng sản phẩm sẽ được bổ sung ở Phase kế tiếp.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {formData.products.map((p, idx) => (
                <div key={idx} className="border rounded-md p-4 bg-gray-50">
                  <div className="font-bold">{p.name}</div>
                  <div className="text-sm text-gray-600 mt-1">{p.detail}</div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {formData.sections && formData.sections.map((sec, secIdx) => {
          if (sec.type === "gallery") {
            return (
              <Card key={secIdx}>
                <CardHeader>
                  <CardTitle>Gallery: {sec.title}</CardTitle>
                  <CardDescription>Kéo thả nhiều ảnh để hiển thị trong bộ sưu tập.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-4 gap-4">
                    {sec.images?.map((img, imgIdx) => (
                      <div key={imgIdx} className="relative group rounded-md overflow-hidden border aspect-video">
                        <img src={img} alt="gallery" className="w-full h-full object-cover" />
                        <button 
                          type="button"
                          onClick={() => handleDeleteGalleryImage(secIdx, imgIdx)}
                          className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    
                    <label className="border-2 border-dashed border-gray-300 rounded-md flex flex-col items-center justify-center aspect-video cursor-pointer hover:bg-gray-50 transition">
                      <ImageIcon className="w-6 h-6 text-gray-400 mb-2" />
                      <span className="text-sm text-gray-500">Tải ảnh lên</span>
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => handleUploadGallery(e, secIdx)} disabled={uploadingImage} />
                    </label>
                  </div>
                </CardContent>
              </Card>
            );
          }
          return null; // Render other section types later if needed
        })}

        <div className="mt-8 flex justify-end gap-4 sticky bottom-4 bg-white/80 p-4 border rounded-xl shadow backdrop-blur-sm z-50">
          <Button type="button" variant="outline" onClick={() => navigate({ to: "/admin" })}>Huỷ</Button>
          <Button type="submit" disabled={loading || uploadingImage} size="lg">
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            {loading ? "Đang lưu..." : "Cập nhật thay đổi"}
          </Button>
        </div>
      </form>
    </div>
  );
}
