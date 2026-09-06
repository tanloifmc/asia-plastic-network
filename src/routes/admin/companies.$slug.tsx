import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Company } from "../../lib/companies";
import { CompanyForm } from "../../components/company-form";
import { Button } from "../../components/ui/button";

export const Route = createFileRoute("/admin/companies/$slug")({
  component: EditCompanyPage,
});

function EditCompanyPage() {
  const navigate = useNavigate();
  const { slug } = Route.useParams();
  const [fetching, setFetching] = useState(true);
  const [companyId, setCompanyId] = useState("");
  const [companyData, setCompanyData] = useState<Partial<Company>>({});

  useEffect(() => {
    const fetchCompany = async () => {
      const { data, error } = await supabase
        .from("companies")
        .select("*")
        .eq("slug", slug)
        .single();
        
      if (error || !data) {
        toast.error("Không tìm thấy công ty");
        navigate({ to: "/admin" });
        return;
      }
      
      setCompanyId(data.id);
      setCompanyData({
        ...data,
        status: data.status || "draft",
        products: data.products || [],
        sections: data.sections || [],
      });
      setFetching(false);
    };
    fetchCompany();
  }, [slug, navigate]);

  const handleSave = async (dataToSave: Partial<Company>) => {
    const updateData = {
      ...dataToSave,
      founded: parseInt(dataToSave.founded as any) || new Date().getFullYear(),
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase.from("companies").update(updateData).eq("id", companyId);

    if (error) {
      toast.error("Cập nhật thất bại: " + error.message);
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
          {companyData.status === "draft" && (
            <span className="inline-flex items-center mt-2 px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
              Đang là Bản nháp
            </span>
          )}
        </div>
        <Button variant="outline" onClick={() => navigate({ to: "/admin" })}>
          Trở về
        </Button>
      </div>

      <CompanyForm 
        initialData={companyData} 
        companyId={companyId} 
        onSave={handleSave} 
        isPartner={false} 
      />
    </div>
  );
}
