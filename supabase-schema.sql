-- ==========================================
-- SCRIPT ĐỒNG BỘ SUPABASE (Full Database & Storage & RLS)
-- ==========================================
-- Hướng dẫn: Bạn copy TOÀN BỘ file này và dán vào phần SQL Editor của Supabase,
-- sau đó bấm Run. Nó sẽ tự động tạo bảng (nếu chưa có), thêm cột (nếu thiếu)
-- và cập nhật các chính sách bảo mật (RLS) mới nhất.

-- 1. Tạo bảng companies (Nếu chưa tồn tại)
CREATE TABLE IF NOT EXISTS public.companies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  initials TEXT NOT NULL,
  banner TEXT,
  logo TEXT,
  sector TEXT NOT NULL,
  location TEXT NOT NULL,
  city TEXT,
  tagline TEXT,
  summary TEXT,
  founded INTEGER,
  employees TEXT,
  slides JSONB DEFAULT '[]'::jsonb,
  products JSONB DEFAULT '[]'::jsonb,
  capabilities JSONB DEFAULT '[]'::jsonb,
  email TEXT,
  phone TEXT,
  website TEXT,
  sections JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Thêm cột 'status' nếu bảng đã tồn tại từ trước nhưng bị thiếu
-- (Tránh lỗi nếu bạn đã có data cũ)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name='companies' AND column_name='status'
  ) THEN
    ALTER TABLE public.companies ADD COLUMN status TEXT DEFAULT 'draft' NOT NULL;
  END IF;
END
$$;

-- 3. Tạo Storage Bucket cho hình ảnh (Nếu chưa tồn tại)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('company-images', 'company-images', true)
ON CONFLICT (id) DO NOTHING;

-- 4. Bật Row Level Security (RLS) cho Database
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;

-- Cẩn thận xóa các Policy cũ để cập nhật Policy mới (tránh bị trùng tên)
DROP POLICY IF EXISTS "Public profiles are viewable by everyone." ON public.companies;
DROP POLICY IF EXISTS "Users can insert companies" ON public.companies;
DROP POLICY IF EXISTS "Users can update companies" ON public.companies;
DROP POLICY IF EXISTS "Users can delete companies" ON public.companies;

-- Tạo lại Database Policies
-- Bất kỳ ai cũng có thể ĐỌC dữ liệu
CREATE POLICY "Public profiles are viewable by everyone." 
ON public.companies FOR SELECT USING (true);

-- Chỉ Admin (đã đăng nhập) mới được Insert, Update, Delete
CREATE POLICY "Users can insert companies" 
ON public.companies FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update companies" 
ON public.companies FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Users can delete companies" 
ON public.companies FOR DELETE USING (auth.role() = 'authenticated');


-- 5. Thiết lập RLS cho Storage
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Admin Insert Access" ON storage.objects;
DROP POLICY IF EXISTS "Admin Update Access" ON storage.objects;
DROP POLICY IF EXISTS "Admin Delete Access" ON storage.objects;

-- Mọi người đều có thể XEM ảnh qua URL Public, nhưng chỉ Admin mới có thể gọi API List/Search files
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT USING ( bucket_id = 'company-images' AND auth.role() = 'authenticated' );

-- Chỉ Admin mới được TẢI LÊN, SỬA, XÓA ảnh
CREATE POLICY "Admin Insert Access"
ON storage.objects FOR INSERT WITH CHECK ( bucket_id = 'company-images' AND auth.role() = 'authenticated' );

CREATE POLICY "Admin Update Access"
ON storage.objects FOR UPDATE USING ( bucket_id = 'company-images' AND auth.role() = 'authenticated' );

CREATE POLICY "Admin Delete Access"
ON storage.objects FOR DELETE USING ( bucket_id = 'company-images' AND auth.role() = 'authenticated' );

-- ==========================================
-- BỔ SUNG: VÁ CÁC LỖI BẢO MẬT TỪ SUPABASE LINTER
-- ==========================================
-- Sửa lỗi: Public Can Execute SECURITY DEFINER Function (rls_auto_enable)
-- Thu hồi quyền thực thi từ public/anon
REVOKE EXECUTE ON FUNCTION public.rls_auto_enable() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.rls_auto_enable() FROM anon;
REVOKE EXECUTE ON FUNCTION public.rls_auto_enable() FROM authenticated;

-- HOÀN TẤT!
