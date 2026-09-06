import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, Plus, Trash2, Image as ImageIcon, Link as LinkIcon, Check, Copy } from "lucide-react";
import { toast } from "sonner";
import { sectors, locations, Company } from "@/lib/companies";
import imageCompression from "browser-image-compression";

interface CompanyFormProps {
  initialData: Partial<Company>;
  companyId?: string; // Tồn tại khi đã lưu ở DB
  onSave: (data: Partial<Company>) => Promise<void>;
  isPartner?: boolean; // Form được load ở trang partner
}

export function CompanyForm({ initialData, companyId, onSave, isPartner = false }: CompanyFormProps) {
  const [formData, setFormData] = useState<Partial<Company>>(initialData);
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Upload & Compress Image
  const uploadAndCompressImage = async (file: File): Promise<string | null> => {
    try {
      const options = {
        maxSizeMB: 0.5,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
      };
      
      const compressedFile = await imageCompression(file, options);
      const fileExt = compressedFile.name.split('.').pop() || 'jpg';
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `public/uploads/${fileName}`; // Lưu vào public folder trong bucket

      const { error } = await supabase.storage.from("company-images").upload(filePath, compressedFile);
      if (error) {
        toast.error("Lỗi tải ảnh: " + error.message);
        return null;
      }
      const { data } = supabase.storage.from("company-images").getPublicUrl(filePath);
      return data.publicUrl;
    } catch (err: any) {
      toast.error("Lỗi xử lý ảnh: " + err.message);
      return null;
    }
  };

  const handleUploadMain = async (e: React.ChangeEvent<HTMLInputElement>, fieldName: "logo" | "banner") => {
    if (!e.target.files?.length) return;
    setUploadingImage(true);
    toast.info(`Đang xử lý & tải ${fieldName}...`);
    const url = await uploadAndCompressImage(e.target.files[0]);
    if (url) {
      setFormData(prev => ({ ...prev, [fieldName]: url }));
      toast.success("Tải ảnh thành công!");
    }
    setUploadingImage(false);
  };

  const handleUploadGallery = async (e: React.ChangeEvent<HTMLInputElement>, sectionIndex: number) => {
    if (!e.target.files?.length) return;
    setUploadingImage(true);
    toast.info(`Đang nén & tải ảnh vào Gallery...`);
    const url = await uploadAndCompressImage(e.target.files[0]);
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

  // --- Products Management ---
  const addProduct = () => {
    setFormData(prev => ({
      ...prev,
      products: [...(prev.products || []), { name: "", detail: "", images: [] }]
    }));
  };

  const removeProduct = (index: number) => {
    if (!confirm("Xóa sản phẩm này?")) return;
    setFormData(prev => ({
      ...prev,
      products: prev.products?.filter((_, i) => i !== index)
    }));
  };

  const updateProduct = (index: number, field: string, value: any) => {
    setFormData(prev => {
      const newProducts = [...(prev.products || [])];
      newProducts[index] = { ...newProducts[index], [field]: value };
      return { ...prev, products: newProducts };
    });
  };

  const handleProductImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, productIndex: number) => {
    if (!e.target.files?.length) return;
    const currentImages = formData.products?.[productIndex]?.images || [];
    if (currentImages.length >= 3) {
      toast.error("Tối đa 3 ảnh cho mỗi sản phẩm!");
      return;
    }

    setUploadingImage(true);
    toast.info(`Đang nén & tải ảnh sản phẩm...`);
    const url = await uploadAndCompressImage(e.target.files[0]);
    if (url) {
      setFormData(prev => {
        const newProducts = [...(prev.products || [])];
        const prod = newProducts[productIndex];
        prod.images = [...(prod.images || []), url];
        return { ...prev, products: newProducts };
      });
      toast.success("Tải ảnh sản phẩm thành công!");
    }
    setUploadingImage(false);
  };

  const removeProductImage = (productIndex: number, imageIndex: number) => {
    setFormData(prev => {
      const newProducts = [...(prev.products || [])];
      const prod = newProducts[productIndex];
      if (prod.images) {
        prod.images = prod.images.filter((_, i) => i !== imageIndex);
      }
      return { ...prev, products: newProducts };
    });
  };

  // --- Copy Secret Link ---
  const copySecretLink = () => {
    if (formData.edit_token) {
      const link = `${window.location.origin}/partner/edit/${formData.edit_token}`;
      navigator.clipboard.writeText(link);
      setCopiedLink(true);
      toast.success("Đã copy link gửi đối tác!");
      setTimeout(() => setCopiedLink(false), 3000);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await onSave(formData);
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* NẾU LÀ ADMIN, hiển thị Block Link Bí Mật */}
      {!isPartner && formData.edit_token && (
        <Card className="border-blue-200 bg-blue-50/50">
          <CardContent className="pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="font-semibold text-blue-900 flex items-center gap-2">
                <LinkIcon className="w-4 h-4" /> Link chỉnh sửa cho đối tác (Partner Portal)
              </h3>
              <p className="text-sm text-blue-700 mt-1">
                Gửi link này cho khách hàng để họ có thể tự cập nhật thông tin và hình ảnh (không cần tài khoản).
              </p>
            </div>
            <Button type="button" variant="outline" className="bg-white hover:bg-blue-50" onClick={copySecretLink}>
              {copiedLink ? <Check className="w-4 h-4 mr-2 text-green-600" /> : <Copy className="w-4 h-4 mr-2 text-blue-600" />}
              {copiedLink ? "Đã sao chép!" : "Sao chép Link"}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Trạng thái xuất bản (Ai cũng được quyền sửa theo y/c) */}
      <Card>
        <CardHeader>
          <CardTitle>Trạng thái hiển thị</CardTitle>
          <CardDescription>
            Quyết định xem trang này có được hiển thị công khai trên danh bạ không.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <select 
            name="status" 
            className={`flex h-10 w-full rounded-md border px-3 py-2 text-sm font-semibold ${formData.status === 'published' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-yellow-50 border-yellow-200 text-yellow-700'}`}
            value={formData.status || "draft"} 
            onChange={handleChange}
          >
            <option value="draft">Bản nháp (Đang chỉnh sửa, ẩn với khách)</option>
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
              <Label htmlFor="slug">Slug (Đường dẫn URL)</Label>
              <Input id="slug" name="slug" value={formData.slug || ""} disabled className="bg-gray-50" />
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
              <Label htmlFor="city">Thành phố / Tỉnh</Label>
              <Input id="city" name="city" value={formData.city || ""} onChange={handleChange} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="founded">Năm thành lập</Label>
              <Input id="founded" name="founded" type="number" value={formData.founded || ""} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="employees">Quy mô nhân sự</Label>
              <Input id="employees" name="employees" placeholder="Ví dụ: 100 - 500 người" value={formData.employees || ""} onChange={handleChange} />
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
          <CardTitle>Thông tin Liên hệ</CardTitle>
          <CardDescription>Thông tin này sẽ hiển thị trực tiếp để khách hàng gọi điện, gửi email.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Số điện thoại</Label>
              <Input id="phone" name="phone" value={formData.phone || ""} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" value={formData.email || ""} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input id="website" name="website" type="url" value={formData.website || ""} onChange={handleChange} />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Logo & Banner</CardTitle>
          <CardDescription>Ảnh sẽ được tự động nén để tối ưu tốc độ tải trang.</CardDescription>
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

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Danh sách sản phẩm</CardTitle>
            <CardDescription>Tối đa 3 ảnh cho mỗi sản phẩm.</CardDescription>
          </div>
          <Button type="button" onClick={addProduct} variant="outline" size="sm">
            <Plus className="w-4 h-4 mr-2" /> Thêm sản phẩm
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          {!formData.products?.length && (
            <div className="text-center py-8 text-gray-500 border-2 border-dashed rounded-md">
              Chưa có sản phẩm nào. Bấm nút Thêm để bắt đầu.
            </div>
          )}
          
          {formData.products?.map((p, idx) => (
            <div key={idx} className="border rounded-lg p-5 bg-gray-50 relative">
              <button 
                type="button" 
                onClick={() => removeProduct(idx)}
                className="absolute top-4 right-4 text-gray-400 hover:text-red-600"
              >
                <Trash2 className="w-5 h-5" />
              </button>
              
              <div className="space-y-4 mt-2 pr-8">
                <div className="space-y-2">
                  <Label>Tên sản phẩm</Label>
                  <Input 
                    value={p.name} 
                    onChange={e => updateProduct(idx, "name", e.target.value)}
                    className="bg-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Mô tả chi tiết</Label>
                  <Textarea 
                    value={p.detail} 
                    onChange={e => updateProduct(idx, "detail", e.target.value)}
                    rows={3}
                    className="bg-white"
                  />
                </div>
                
                {/* Product Images */}
                <div className="space-y-2 pt-2">
                  <Label>Hình ảnh minh họa ({p.images?.length || 0}/3)</Label>
                  <div className="flex flex-wrap gap-4 mt-2">
                    {p.images?.map((img, imgIdx) => (
                      <div key={imgIdx} className="relative group rounded-md overflow-hidden border w-24 h-24 bg-white">
                        <img src={img} alt="product" className="w-full h-full object-cover" />
                        <button 
                          type="button"
                          onClick={() => removeProductImage(idx, imgIdx)}
                          className="absolute inset-0 bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    ))}
                    
                    {(p.images?.length || 0) < 3 && (
                      <label className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-md flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 transition bg-white">
                        <ImageIcon className="w-6 h-6 text-gray-400 mb-1" />
                        <span className="text-[10px] text-gray-500 text-center px-1">Thêm ảnh</span>
                        <input 
                          type="file" 
                          accept="image/*" 
                          className="hidden" 
                          onChange={(e) => handleProductImageUpload(e, idx)} 
                          disabled={uploadingImage} 
                        />
                      </label>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Tạm thời chỉ hỗ trợ Gallery Sections, các loại khác có thể thêm sau */}
      {formData.sections?.map((sec, secIdx) => {
        if (sec.type === "gallery") {
          return (
            <Card key={secIdx}>
              <CardHeader>
                <CardTitle>Thư viện ảnh (Gallery): {sec.title}</CardTitle>
                <CardDescription>Tải lên ảnh nhà máy, dây chuyền, giấy chứng nhận...</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {sec.images?.map((img, imgIdx) => (
                    <div key={imgIdx} className="relative group rounded-md overflow-hidden border aspect-video">
                      <img src={img} alt="gallery" className="w-full h-full object-cover" />
                      <button 
                        type="button"
                        onClick={() => handleDeleteGalleryImage(secIdx, imgIdx)}
                        className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded opacity-0 group-hover:opacity-100 transition"
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
        return null; 
      })}

      <div className="mt-8 flex justify-end gap-4 sticky bottom-4 bg-white/90 p-4 border rounded-xl shadow-lg backdrop-blur-sm z-50">
        <Button type="submit" disabled={loading || uploadingImage} size="lg" className="w-full md:w-auto px-8">
          {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Check className="mr-2 h-5 w-5" />}
          {loading ? "Đang lưu..." : "Lưu thay đổi"}
        </Button>
      </div>
    </form>
  );
}
