import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Plus, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/")({
  component: AdminDashboard,
});

function AdminDashboard() {
  const [companies, setCompanies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const ITEMS_PER_PAGE = 20;

  const fetchCompanies = async (currentPage: number) => {
    setLoading(true);
    
    // Đếm tổng số để tính số trang
    const { count, error: countError } = await supabase
      .from("companies")
      .select("*", { count: 'exact', head: true });
      
    if (!countError && count !== null) setTotal(count);

    // Tính range
    const from = (currentPage - 1) * ITEMS_PER_PAGE;
    const to = from + ITEMS_PER_PAGE - 1;

    const { data, error } = await supabase
      .from("companies")
      .select("id, slug, name, sector, city, status, created_at")
      .order("created_at", { ascending: false })
      .range(from, to);

    if (error) {
      toast.error("Lỗi tải dữ liệu: " + error.message);
    } else {
      setCompanies(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCompanies(page);
  }, [page]);

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Bạn có chắc muốn xoá doanh nghiệp "${name}"?`)) {
      const { error } = await supabase.from("companies").delete().eq("id", id);
      if (error) {
        toast.error("Xoá thất bại: " + error.message);
      } else {
        toast.success("Xoá thành công!");
        fetchCompanies(page);
      }
    }
  };
  
  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Danh sách doanh nghiệp</h2>
        <Button asChild>
          <Link to="/admin/companies/new">
            <Plus className="mr-2 h-4 w-4" /> Thêm doanh nghiệp
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tổng quan ({total} doanh nghiệp)</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-10 text-gray-500">Đang tải dữ liệu...</div>
          ) : companies.length === 0 ? (
            <div className="text-center py-10 text-gray-500">Chưa có doanh nghiệp nào.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                  <tr>
                    <th className="px-6 py-3">Tên công ty</th>
                    <th className="px-6 py-3">Trạng thái</th>
                    <th className="px-6 py-3">Slug</th>
                    <th className="px-6 py-3">Ngành nghề</th>
                    <th className="px-6 py-3">Thành phố</th>
                    <th className="px-6 py-3 text-right">Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {companies.map((c) => (
                    <tr key={c.id} className="bg-white border-b hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium text-gray-900">{c.name}</td>
                      <td className="px-6 py-4">
                        {c.status === "draft" ? (
                          <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded">Nháp</span>
                        ) : (
                          <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">Đã xuất bản</span>
                        )}
                      </td>
                      <td className="px-6 py-4">{c.slug}</td>
                      <td className="px-6 py-4">{c.sector}</td>
                      <td className="px-6 py-4">{c.city}</td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <Button variant="outline" size="icon" asChild>
                          <Link to={`/admin/companies/$slug`} params={{ slug: c.slug }}>
                            <Edit className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button variant="destructive" size="icon" onClick={() => handleDelete(c.id, c.name)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          
          {/* Phân trang */}
          {totalPages > 1 && (
            <div className="flex justify-between items-center mt-6 pt-4 border-t">
              <span className="text-sm text-gray-600">
                Hiển thị trang {page} / {totalPages}
              </span>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  Trang trước
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                >
                  Trang sau
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
