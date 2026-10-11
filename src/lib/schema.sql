-- ============================================
-- MUNMAYA Simple Products Table
-- Run this in Supabase SQL Editor
-- ============================================

-- Drop existing table if exists (for clean setup)
DROP TABLE IF EXISTS products CASCADE;

-- Create products table
CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read products
CREATE POLICY "Products are viewable by everyone"
  ON products FOR SELECT
  USING (true);

-- Policy: Anyone can insert products (for admin panel demo)
CREATE POLICY "Anyone can insert products"
  ON products FOR INSERT
  WITH CHECK (true);

-- Policy: Anyone can update products (for admin panel demo)
CREATE POLICY "Anyone can update products"
  ON products FOR UPDATE
  USING (true);

-- Policy: Anyone can delete products (for admin panel demo)
CREATE POLICY "Anyone can delete products"
  ON products FOR DELETE
  USING (true);

-- ============================================
-- Insert 3 Dummy Products
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

-- Verify insertion
SELECT * FROM products ORDER BY created_at DESC;
