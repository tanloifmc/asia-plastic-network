-- Xóa bảng cũ nếu có (cẩn thận khi chạy trên production)
-- DROP TABLE IF EXISTS public.companies;

-- 1. Tạo bảng companies
CREATE TABLE public.companies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  initials TEXT NOT NULL,
  banner TEXT NOT NULL,
  logo TEXT NOT NULL,
  sector TEXT NOT NULL,
  location TEXT NOT NULL,
  city TEXT NOT NULL,
  tagline TEXT NOT NULL,
  summary TEXT NOT NULL,
  founded INTEGER NOT NULL,
  employees TEXT NOT NULL,
  slides JSONB NOT NULL DEFAULT '[]'::jsonb,
  products JSONB NOT NULL DEFAULT '[]'::jsonb,
  capabilities JSONB NOT NULL DEFAULT '[]'::jsonb,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  website TEXT,
  sections JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Tạo Storage Bucket cho hình ảnh
INSERT INTO storage.buckets (id, name, public) 
VALUES ('company-images', 'company-images', true)
ON CONFLICT (id) DO NOTHING;

-- 3. Thiết lập Row Level Security (RLS) cho Database
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;

-- Mọi người đều có thể đọc danh sách công ty
CREATE POLICY "Public profiles are viewable by everyone." 
ON public.companies FOR SELECT 
USING (true);

-- Chỉ những người dùng đã xác thực (Admin) mới có quyền Insert, Update, Delete
CREATE POLICY "Users can insert companies" 
ON public.companies FOR INSERT 
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update companies" 
ON public.companies FOR UPDATE 
USING (auth.role() = 'authenticated');

CREATE POLICY "Users can delete companies" 
ON public.companies FOR DELETE 
USING (auth.role() = 'authenticated');


-- 4. Thiết lập RLS cho Storage
-- Mọi người đều có thể xem ảnh
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'company-images' );

-- Chỉ Admin mới có thể upload, update, xoá ảnh
CREATE POLICY "Admin Insert Access"
ON storage.objects FOR INSERT
WITH CHECK ( bucket_id = 'company-images' AND auth.role() = 'authenticated' );

CREATE POLICY "Admin Update Access"
ON storage.objects FOR UPDATE
USING ( bucket_id = 'company-images' AND auth.role() = 'authenticated' );

CREATE POLICY "Admin Delete Access"
ON storage.objects FOR DELETE
USING ( bucket_id = 'company-images' AND auth.role() = 'authenticated' );
