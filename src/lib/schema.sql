-- ============================================
-- MUNMAYA E-Commerce Database Schema
-- Supabase PostgreSQL with RLS Policies
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 1. PROFILES TABLE (extends Supabase auth.users)
-- ============================================
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  phone TEXT,
  avatar_url TEXT,
  role TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
  shipping_address JSONB DEFAULT '{}',
  reward_points INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', ''),
    CASE WHEN NEW.email = 'admin@munmaya.com' THEN 'admin' ELSE 'customer' END
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- 2. CATEGORIES TABLE
-- ============================================
CREATE TABLE public.categories (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  icon TEXT,
  gradient TEXT,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 3. BRANDS TABLE
-- ============================================
CREATE TABLE public.brands (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  initials TEXT NOT NULL,
  category TEXT,
  rating DECIMAL(2,1) DEFAULT 0,
  gradient TEXT,
  is_verified BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 4. SELLERS TABLE
-- ============================================
CREATE TABLE public.sellers (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id),
  business_name TEXT NOT NULL,
  initials TEXT NOT NULL,
  category TEXT,
  rating DECIMAL(2,1) DEFAULT 0,
  total_orders INTEGER DEFAULT 0,
  gradient TEXT,
  is_verified BOOLEAN DEFAULT TRUE,
  verification_docs JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 5. PRODUCTS TABLE
-- ============================================
CREATE TABLE public.products (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  short_description TEXT,
  price DECIMAL(10,2) NOT NULL,
  sale_price DECIMAL(10,2),
  stock_quantity INTEGER DEFAULT 0,
  category_id UUID REFERENCES public.categories(id),
  brand_id UUID REFERENCES public.brands(id),
  seller_id UUID REFERENCES public.sellers(id),
  images JSONB DEFAULT '[]',
  tags TEXT[] DEFAULT '{}',
  specifications JSONB DEFAULT '{}',
  is_featured BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  discount_expires_at TIMESTAMPTZ,
  search_vector tsvector GENERATED ALWAYS AS (
    setweight(to_tsvector('simple', COALESCE(name, '')), 'A') ||
    setweight(to_tsvector('simple', COALESCE(description, '')), 'B') ||
    setweight(to_tsvector('simple', COALESCE(array_to_string(tags, ' '), '')), 'C')
  ) STORED,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for full-text search
CREATE INDEX idx_products_search ON public.products USING GIN(search_vector);
CREATE INDEX idx_products_category ON public.products(category_id);
CREATE INDEX idx_products_brand ON public.products(brand_id);
CREATE INDEX idx_products_featured ON public.products(is_featured) WHERE is_active = TRUE;
CREATE INDEX idx_products_flash_deals ON public.products(discount_expires_at) WHERE discount_expires_at > NOW();

-- ============================================
-- 6. REVIEWS TABLE
-- ============================================
CREATE TABLE public.reviews (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title TEXT,
  comment TEXT,
  is_verified_purchase BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 7. WISHLISTS TABLE
-- ============================================
CREATE TABLE public.wishlists (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- ============================================
-- 8. ORDERS TABLE
-- ============================================
CREATE TABLE public.orders (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  order_number TEXT UNIQUE NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded')),
  subtotal DECIMAL(10,2) NOT NULL,
  discount DECIMAL(10,2) DEFAULT 0,
  shipping_cost DECIMAL(10,2) DEFAULT 0,
  total DECIMAL(10,2) NOT NULL,
  payment_method TEXT,
  payment_status TEXT DEFAULT 'unpaid' CHECK (payment_status IN ('unpaid', 'paid', 'refunded', 'partial')),
  shipping_address JSONB NOT NULL,
  notes TEXT,
  tracking_number TEXT,
  estimated_delivery TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 9. ORDER ITEMS TABLE
-- ============================================
CREATE TABLE public.order_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  product_name TEXT NOT NULL,
  product_image TEXT,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  unit_price DECIMAL(10,2) NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 10. AI CHAT HISTORY TABLE
-- ============================================
CREATE TABLE public.ai_chats (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  query TEXT NOT NULL,
  response JSONB NOT NULL,
  products_found INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- FLASH DEAL FUNCTION
-- ============================================
CREATE OR REPLACE FUNCTION public.get_flash_deals()
RETURNS SETOF public.products AS $$
BEGIN
  RETURN QUERY
  SELECT * FROM public.products
  WHERE discount_expires_at > NOW()
    AND is_active = TRUE
    AND sale_price IS NOT NULL
  ORDER BY discount_expires_at ASC
  LIMIT 20;
END;
$$ LANGUAGE plpgsql STABLE;

-- ============================================
-- FULL TEXT SEARCH FUNCTION
-- ============================================
CREATE OR REPLACE FUNCTION public.search_products(
  search_query TEXT,
  category_filter UUID DEFAULT NULL,
  min_price DECIMAL DEFAULT NULL,
  max_price DECIMAL DEFAULT NULL,
  page_num INTEGER DEFAULT 1,
  page_size INTEGER DEFAULT 20
)
RETURNS TABLE (
  product_id UUID,
  product_name TEXT,
  product_slug TEXT,
  product_price DECIMAL,
  product_sale_price DECIMAL,
  product_images JSONB,
  product_rating DECIMAL,
  total_count BIGINT
) AS $$
DECLARE
  offset_val INTEGER;
BEGIN
  offset_val := (page_num - 1) * page_size;
  
  RETURN QUERY
  SELECT 
    p.id, p.name, p.slug, p.price, p.sale_price, p.images,
    COALESCE(AVG(r.rating), 0)::DECIMAL(2,1) as rating,
    COUNT(*) OVER() as total_count
  FROM public.products p
  LEFT JOIN public.reviews r ON r.product_id = p.id
  WHERE p.is_active = TRUE
    AND (search_query IS NULL OR p.search_vector @@ plainto_tsquery('simple', search_query))
    AND (category_filter IS NULL OR p.category_id = category_filter)
    AND (min_price IS NULL OR COALESCE(p.sale_price, p.price) >= min_price)
    AND (max_price IS NULL OR COALESCE(p.sale_price, p.price) <= max_price)
  GROUP BY p.id
  ORDER BY p.created_at DESC
  LIMIT page_size OFFSET offset_val;
END;
$$ LANGUAGE plpgsql STABLE;

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sellers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_chats ENABLE ROW LEVEL SECURITY;

-- Helper function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- PROFILES
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins can view all profiles" ON public.profiles
  FOR SELECT USING (public.is_admin());
CREATE POLICY "Admins can update all profiles" ON public.profiles
  FOR ALL USING (public.is_admin());

-- CATEGORIES (public read, admin write)
CREATE POLICY "Categories are viewable by everyone" ON public.categories
  FOR SELECT USING (TRUE);
CREATE POLICY "Admins can insert categories" ON public.categories
  FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "Admins can update categories" ON public.categories
  FOR UPDATE USING (public.is_admin());
CREATE POLICY "Admins can delete categories" ON public.categories
  FOR DELETE USING (public.is_admin());

-- BRANDS (public read, admin write)
CREATE POLICY "Brands are viewable by everyone" ON public.brands
  FOR SELECT USING (TRUE);
CREATE POLICY "Admins can manage brands" ON public.brands
  FOR ALL USING (public.is_admin());

-- SELLERS (public read, admin write)
CREATE POLICY "Sellers are viewable by everyone" ON public.sellers
  FOR SELECT USING (TRUE);
CREATE POLICY "Admins can manage sellers" ON public.sellers
  FOR ALL USING (public.is_admin());

-- PRODUCTS (public read, admin write)
CREATE POLICY "Products are viewable by everyone" ON public.products
  FOR SELECT USING (is_active = TRUE);
CREATE POLICY "Admins can insert products" ON public.products
  FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "Admins can update products" ON public.products
  FOR UPDATE USING (public.is_admin());
CREATE POLICY "Admins can delete products" ON public.products
  FOR DELETE USING (public.is_admin());

-- REVIEWS (public read, authenticated write own)
CREATE POLICY "Reviews are viewable by everyone" ON public.reviews
  FOR SELECT USING (TRUE);
CREATE POLICY "Authenticated users can insert reviews" ON public.reviews
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own reviews" ON public.reviews
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own reviews" ON public.reviews
  FOR DELETE USING (auth.uid() = user_id);

-- WISHLISTS (user owns)
CREATE POLICY "Users can view own wishlist" ON public.wishlists
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can add to wishlist" ON public.wishlists
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can remove from wishlist" ON public.wishlists
  FOR DELETE USING (auth.uid() = user_id);

-- ORDERS (user owns, admin sees all)
CREATE POLICY "Users can view own orders" ON public.orders
  FOR SELECT USING (auth.uid() = user_id OR public.is_admin());
CREATE POLICY "Authenticated users can create orders" ON public.orders
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own orders" ON public.orders
  FOR UPDATE USING (auth.uid() = user_id OR public.is_admin());
CREATE POLICY "Admins can delete orders" ON public.orders
  FOR DELETE USING (public.is_admin());

-- ORDER ITEMS (accessible through orders)
CREATE POLICY "Order items viewable by order owner or admin" ON public.order_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.orders
      WHERE orders.id = order_items.order_id
      AND (orders.user_id = auth.uid() OR public.is_admin())
    )
  );
CREATE POLICY "Admins can manage order items" ON public.order_items
  FOR ALL USING (public.is_admin());

-- AI CHATS (user owns)
CREATE POLICY "Users can view own chat history" ON public.ai_chats
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Authenticated users can create chat entries" ON public.ai_chats
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ============================================
-- SEED DATA: Categories
-- ============================================
INSERT INTO public.categories (name, slug, icon, gradient, sort_order) VALUES
  ('মুদি ও নিত্যপ্রয়োজনীয়', 'grocery', 'layout-grid', 'from-orange-500 to-amber-600', 1),
  ('মাছ', 'fish', 'fish', 'from-blue-500 to-cyan-600', 2),
  ('মাংস', 'meat', 'beef', 'from-red-500 to-rose-600', 3),
  ('ফলমূল', 'fruits', 'apple', 'from-yellow-500 to-orange-500', 4),
  ('শাকসবজি', 'vegetables', 'leaf', 'from-green-500 to-emerald-600', 5),
  ('ফ্যাশন', 'fashion', 'shirt', 'from-purple-500 to-violet-600', 6),
  ('ইলেকট্রনিক্স', 'electronics', 'monitor', 'from-indigo-500 to-blue-600', 7),
  ('বাড়ি ও জীবনযাপন', 'home-living', 'home', 'from-teal-500 to-cyan-600', 8),
  ('বিউটি ও পার্সোনাল কেয়ার', 'beauty', 'sparkles', 'from-pink-500 to-rose-500', 9),
  ('মা ও শিশু', 'mother-child', 'baby', 'from-fuchsia-500 to-pink-600', 10);

-- ============================================
-- SEED DATA: Brands
-- ============================================
INSERT INTO public.brands (name, initials, category, rating, gradient) VALUES
  ('নর্থওয়েভ অডিও', 'NO', 'অডিও', 4.8, 'from-orange-500 to-amber-600'),
  ('ভানট্রা টেক', 'VA', 'ইলেকট্রনিক্স', 4.7, 'from-red-500 to-rose-600'),
  ('সোলেন ল্যাব', 'SO', 'বিউটি', 4.9, 'from-violet-500 to-purple-600'),
  ('ফোল্ড অ্যান্ড ফিল্ড', 'FO', 'ফ্যাশন', 4.6, 'from-emerald-500 to-green-600'),
  ('কেসেল গুডস', 'KE', 'হোম', 4.6, 'from-amber-600 to-yellow-700'),
  ('হ্যালডেন স্টুডিও', 'HA', 'লাইটিং', 4.5, 'from-rose-500 to-pink-600');

-- ============================================
-- SEED DATA: Sellers
-- ============================================
INSERT INTO public.sellers (business_name, initials, category, rating, total_orders, gradient) VALUES
  ('নর্থওয়েভ অডিও', 'NO', 'অডিও ও গ্যাজেট', 4.8, 1284, 'from-orange-500 to-amber-600'),
  ('ভানট্রা টেক', 'VA', 'ইলেকট্রনিক্স', 4.7, 1185, 'from-red-500 to-rose-600'),
  ('সোলেন ল্যাব', 'SO', 'বিউটি ও কেয়ার', 4.9, 4260, 'from-violet-500 to-purple-600'),
  ('কেসেল গুডস', 'KE', 'হোম ও কিচেন', 4.6, 947, 'from-amber-600 to-yellow-700');
