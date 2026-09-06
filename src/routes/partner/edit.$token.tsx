import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Company } from "@/lib/companies";
import { CompanyForm } from "@/components/company-form";

export const Route = createFileRoute("/partner/edit/$token")({
  component: PartnerEditPage,
});

function PartnerEditPage() {
  const navigate = useNavigate();
  const { token } = Route.useParams();
  const [fetching, setFetching] = useState(true);
  const [companyData, setCompanyData] = useState<Partial<Company>>({});

  useEffect(() => {
    const fetchCompanyByToken = async () => {
      // Vì RLS không cho phép anon query bằng id, nhưng edit_token là bí mật nên ta có thể 
      // dùng RPC để lấy thông tin hoặc tạm thời dùng supabase.from() nếu RLS cho phép.
      // Tuy nhiên, hiện tại RLS cho phép 'Public profiles are viewable by everyone', 
      // nên ta có thể select thoải mái miễn là biết token.
      
      const { data, error } = await supabase
        .from("companies")
        .select("*")
        .eq("edit_token", token)
        .single();
        
      if (error || !data) {
        toast.error("Đường dẫn không hợp lệ hoặc đã hết hạn!");
        setFetching(false);
        return;
      }
      
      setCompanyData({
        ...data,
        status: data.status || "draft",
        products: data.products || [],
        sections: data.sections || [],
      });
      setFetching(false);
    };
    
    if (token) {
      fetchCompanyByToken();
    }
  }, [token]);

  const handleSave = async (dataToSave: Partial<Company>) => {
    // Gọi RPC function vì RLS chặn update từ anon
    const { data, error } = await supabase.rpc("update_company_by_token", {
      p_token: token,
      p_payload: dataToSave
    });

    if (error) {
      toast.error("Lỗi cập nhật: " + error.message);
    } else {
      toast.success("Đã lưu thông tin thành công!");
    }
  };

  if (fetching) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-gray-50">
        <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!companyData.name) {
    return (
      <div className="flex min-h-screen w-full flex-col items-center justify-center bg-gray-50 p-4 text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-2">Truy cập bị từ chối</h1>
        <p className="text-gray-600">Đường dẫn cập nhật thông tin không hợp lệ. Vui lòng liên hệ ban quản trị để được cấp lại.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-5xl mx-auto px-4 md:px-0">
        <div className="mb-8 text-center md:text-left">
          <h2 className="text-3xl font-bold text-gray-900">Cổng Cập Nhật Thông Tin Đối Tác</h2>
          <p className="text-gray-500 mt-2">
            Chào mừng đại diện từ <strong>{companyData.name}</strong>. Tại đây bạn có thể cập nhật thông tin giới thiệu, 
            sản phẩm và hình ảnh của công ty mình bất cứ lúc nào.
          </p>
        </div>

        <CompanyForm 
          initialData={companyData} 
          onSave={handleSave} 
          isPartner={true} 
        />
      </div>
    </div>
  );
}
