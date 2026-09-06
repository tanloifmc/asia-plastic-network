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

-- 2. Thêm cột 'status' và 'edit_token' nếu bảng đã tồn tại từ trước nhưng bị thiếu
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

  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name='companies' AND column_name='edit_token'
  ) THEN
    ALTER TABLE public.companies ADD COLUMN edit_token UUID DEFAULT gen_random_uuid();
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

-- Admin VÀ Anon (Khách có link bí mật) đều được TẢI LÊN ảnh
CREATE POLICY "Anon and Admin Insert Access"
ON storage.objects FOR INSERT WITH CHECK ( bucket_id = 'company-images' );

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

-- ==========================================
-- BỔ SUNG: RPC Function cho Partner Portal (Cập nhật không cần đăng nhập)
-- ==========================================
CREATE OR REPLACE FUNCTION public.update_company_by_token(
  p_token UUID,
  p_payload JSONB
) RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_company_id UUID;
  v_result JSONB;
BEGIN
  -- Kiểm tra xem token có hợp lệ không
  SELECT id INTO v_company_id FROM public.companies WHERE edit_token = p_token;
  
  IF v_company_id IS NULL THEN
    RAISE EXCEPTION 'Invalid edit token';
  END IF;

  -- Cập nhật dữ liệu từ payload
  UPDATE public.companies
  SET 
    name = COALESCE((p_payload->>'name')::TEXT, name),
    initials = COALESCE((p_payload->>'initials')::TEXT, initials),
    banner = COALESCE((p_payload->>'banner')::TEXT, banner),
    logo = COALESCE((p_payload->>'logo')::TEXT, logo),
    sector = COALESCE((p_payload->>'sector')::TEXT, sector),
    location = COALESCE((p_payload->>'location')::TEXT, location),
    city = COALESCE((p_payload->>'city')::TEXT, city),
    tagline = COALESCE((p_payload->>'tagline')::TEXT, tagline),
    summary = COALESCE((p_payload->>'summary')::TEXT, summary),
    founded = COALESCE((p_payload->>'founded')::INTEGER, founded),
    employees = COALESCE((p_payload->>'employees')::TEXT, employees),
    slides = COALESCE((p_payload->'slides')::JSONB, slides),
    products = COALESCE((p_payload->'products')::JSONB, products),
    capabilities = COALESCE((p_payload->'capabilities')::JSONB, capabilities),
    email = COALESCE((p_payload->>'email')::TEXT, email),
    phone = COALESCE((p_payload->>'phone')::TEXT, phone),
    website = COALESCE((p_payload->>'website')::TEXT, website),
    sections = COALESCE((p_payload->'sections')::JSONB, sections),
    status = COALESCE((p_payload->>'status')::TEXT, status),
    updated_at = timezone('utc'::text, now())
  WHERE id = v_company_id
  RETURNING row_to_json(companies.*) INTO v_result;

  RETURN v_result;
END;
$$;

-- HOÀN TẤT!
