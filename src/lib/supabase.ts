import { createClient } from "@supabase/supabase-js";

// Khởi tạo Supabase Client
// Lưu ý: Các biến này lấy từ file .env
// Nếu đang build trên Vercel, cần thêm biến môi trường trên dashboard Vercel
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
