import { createFileRoute, Outlet, redirect, useNavigate } from "@tanstack/react-router";
import { supabase } from "../lib/supabase";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/admin")({
  component: AdminLayout,
});

function AdminLayout() {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      // Nếu chưa đăng nhập và không phải đang ở trang login thì đẩy về login
      if (!session && window.location.pathname !== "/admin/login") {
        navigate({ to: "/admin/login" });
      }
      setLoading(false);
    };
    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT") {
        navigate({ to: "/admin/login" });
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Nếu đang ở trang login thì không hiện layout Header
  if (window.location.pathname === "/admin/login") {
    return <Outlet />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold text-primary">1Plastic Admin</h1>
            <nav className="hidden md:flex items-center gap-4 ml-8">
              <button onClick={() => navigate({ to: "/admin" })} className="text-sm font-medium hover:text-primary">
                Dashboard
              </button>
            </nav>
          </div>
          <button
            onClick={async () => {
              await supabase.auth.signOut();
            }}
            className="text-sm font-medium text-red-600 hover:text-red-700"
          >
            Đăng xuất
          </button>
        </div>
      </header>
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}
