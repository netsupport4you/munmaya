-- ============================================
-- MUNMAYA Database Schema with Authentication
-- Run this ENTIRE script in Supabase SQL Editor
-- ============================================

-- ============================================
-- 1. PRODUCTS TABLE
-- ============================================
DROP TABLE IF EXISTS products CASCADE;

CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Anyone can read products (storefront)
CREATE POLICY "Products are viewable by everyone"
  ON products FOR SELECT
  USING (true);

-- Only authenticated admins can insert
CREATE POLICY "Only admins can insert products"
  ON products FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Only authenticated admins can update
CREATE POLICY "Only admins can update products"
  ON products FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Only authenticated admins can delete
CREATE POLICY "Only admins can delete products"
  ON products FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- ============================================
-- 2. PROFILES TABLE (extends auth.users)
-- ============================================
DROP TABLE IF EXISTS profiles CASCADE;

CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  role TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Users can view their own profile
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Admins can view all profiles
CREATE POLICY "Admins can view all profiles"
  ON profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid()
      AND p.role = 'admin'
    )
  );

-- ============================================
-- 3. AUTO-CREATE PROFILE ON SIGNUP
-- ============================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    -- First user becomes admin, rest are customers
    CASE
      WHEN (SELECT COUNT(*) FROM public.profiles) = 0 THEN 'admin'
      ELSE COALESCE(NEW.raw_user_meta_data->>'role', 'customer')
    END
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- 4. INSERT 3 DUMMY PRODUCTS
-- ============================================
INSERT INTO products (name, description, price, image_url) VALUES
(
  'ক্যাসিও এফএক্স-৯৯১ইএস প্লাস বৈজ্ঞানিক ক্যালকুলেটর',
  'উন্নত বৈজ্ঞানিক ক্যালকুলেটর যা ছাত্র ও পেশাজীবীদের জন্য আদর্শ। ৪১৭টি ফাংশন সহ, সোলার ও ব্যাটারি পাওয়ার।',
  800.00,
  'https://images.unsplash.com/photo-1587145820266-a59515e84651?w=400&h=400&fit=crop'
),
(
  'সনি ব্রাভিয়া ৫৫ ইঞ্চি ৪কে স্মার্ট টিভি',
  '৫৫ ইঞ্চি ৪কে UHD স্মার্ট টিভি। গুগল টিভি OS সহ, HDR10 সাপোর্ট, ডলবি অডিও।',
  55000.00,
  'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&h=400&fit=crop'
),
(
  'প্রিমিয়াম অর্গানিক বাসমতি চাল ৫ কেজি',
  'প্রিমিয়াম কোয়ালিটি অর্গানিক বাসমতি চাল। সুগন্ধি ও সুস্বাদু, রাসায়নিক মুক্ত।',
  650.00,
  'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=400&fit=crop'
);

-- ============================================
-- 5. VERIFY
-- ============================================
SELECT 'Products created: ' || COUNT(*) FROM products;
SELECT 'Profiles table ready' AS status;
