import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sparkles, HeartPulse, ShieldCheck, ArrowRight,
  LayoutGrid, Zap, Clock, Star, BadgeCheck, Truck,
  RotateCcw, Headphones, ShoppingCart, Heart, Search, Menu, X, User,
  Plus, Minus, Trash2, Package, Users, BarChart3, LogOut, Edit, Eye,
  ChevronLeft, Settings, Loader2
} from 'lucide-react';
import { useCartStore } from './stores/cartStore';
import { useAuthStore } from './stores/authStore';
import { useWishlistStore } from './stores/wishlistStore';
import { supabase } from './lib/supabase';
import type { Product, Category, Brand, Seller, CartItem } from './lib/types';

// ============ MOCK DATA (Fallback) ============
const mockCategories: Category[] = [
  { id: '1', name: 'মুদি ও নিত্যপ্রয়োজনীয়', slug: 'grocery', icon: 'layout-grid', gradient: 'from-orange-500 to-amber-600', sort_order: 1, is_active: true, description: null, created_at: '' },
  { id: '2', name: 'মাছ', slug: 'fish', icon: 'fish', gradient: 'from-blue-500 to-cyan-600', sort_order: 2, is_active: true, description: null, created_at: '' },
  { id: '3', name: 'মাংস', slug: 'meat', icon: 'beef', gradient: 'from-red-500 to-rose-600', sort_order: 3, is_active: true, description: null, created_at: '' },
  { id: '4', name: 'ফলমূল', slug: 'fruits', icon: 'apple', gradient: 'from-yellow-500 to-orange-500', sort_order: 4, is_active: true, description: null, created_at: '' },
  { id: '5', name: 'শাকসবজি', slug: 'vegetables', icon: 'leaf', gradient: 'from-green-500 to-emerald-600', sort_order: 5, is_active: true, description: null, created_at: '' },
  { id: '6', name: 'ফ্যাশন', slug: 'fashion', icon: 'shirt', gradient: 'from-purple-500 to-violet-600', sort_order: 6, is_active: true, description: null, created_at: '' },
  { id: '7', name: 'ইলেকট্রনিক্স', slug: 'electronics', icon: 'monitor', gradient: 'from-indigo-500 to-blue-600', sort_order: 7, is_active: true, description: null, created_at: '' },
  { id: '8', name: 'বাড়ি ও জীবনযাপন', slug: 'home-living', icon: 'home', gradient: 'from-teal-500 to-cyan-600', sort_order: 8, is_active: true, description: null, created_at: '' },
  { id: '9', name: 'বিউটি ও পার্সোনাল কেয়ার', slug: 'beauty', icon: 'sparkles', gradient: 'from-pink-500 to-rose-500', sort_order: 9, is_active: true, description: null, created_at: '' },
  { id: '10', name: 'মা ও শিশু', slug: 'mother-child', icon: 'baby', gradient: 'from-fuchsia-500 to-pink-600', sort_order: 10, is_active: true, description: null, created_at: '' },
];

const mockBrands: Brand[] = [
  { id: '1', name: 'নর্থওয়েভ অডিও', initials: 'NO', category: 'অডিও', rating: 4.8, gradient: 'from-orange-500 to-amber-600', is_verified: true, created_at: '' },
  { id: '2', name: 'ভানট্রা টেক', initials: 'VA', category: 'ইলেকট্রনিক্স', rating: 4.7, gradient: 'from-red-500 to-rose-600', is_verified: true, created_at: '' },
  { id: '3', name: 'সোলেন ল্যাব', initials: 'SO', category: 'বিউটি', rating: 4.9, gradient: 'from-violet-500 to-purple-600', is_verified: true, created_at: '' },
  { id: '4', name: 'ফোল্ড অ্যান্ড ফিল্ড', initials: 'FO', category: 'ফ্যাশন', rating: 4.6, gradient: 'from-emerald-500 to-green-600', is_verified: true, created_at: '' },
  { id: '5', name: 'কেসেল গুডস', initials: 'KE', category: 'হোম', rating: 4.6, gradient: 'from-amber-600 to-yellow-700', is_verified: true, created_at: '' },
  { id: '6', name: 'হ্যালডেন স্টুডিও', initials: 'HA', category: 'লাইটিং', rating: 4.5, gradient: 'from-rose-500 to-pink-600', is_verified: true, created_at: '' },
];

const mockSellers: Seller[] = [
  { id: '1', user_id: null, business_name: 'নর্থওয়েভ অডিও', initials: 'NO', category: 'অডিও ও গ্যাজেট', rating: 4.8, total_orders: 1284, gradient: 'from-orange-500 to-amber-600', is_verified: true, verification_docs: null, created_at: '' },
  { id: '2', user_id: null, business_name: 'ভানট্রা টেক', initials: 'VA', category: 'ইলেকট্রনিক্স', rating: 4.7, total_orders: 1185, gradient: 'from-red-500 to-rose-600', is_verified: true, verification_docs: null, created_at: '' },
  { id: '3', user_id: null, business_name: 'সোলেন ল্যাব', initials: 'SO', category: 'বিউটি ও কেয়ার', rating: 4.9, total_orders: 4260, gradient: 'from-violet-500 to-purple-600', is_verified: true, verification_docs: null, created_at: '' },
  { id: '4', user_id: null, business_name: 'কেসেল গুডস', initials: 'KE', category: 'হোম ও কিচেন', rating: 4.6, total_orders: 947, gradient: 'from-amber-600 to-yellow-700', is_verified: true, verification_docs: null, created_at: '' },
];

const mockProducts: Product[] = [
  {
    id: '1', name: 'ক্যাসিও এফএক্স-৯৯১ইএস প্লাস বৈজ্ঞানিক ক্যালকুলেটর', slug: 'casio-fx-991es-plus',
    description: 'উন্নত বৈজ্ঞানিক ক্যালকুলেটর যা ছাত্র ও পেশাজীবীদের জন্য আদর্শ। ৪১৭টি ফাংশন সহ।',
    short_description: 'বৈজ্ঞানিক ক্যালকুলেটর', price: 800, sale_price: 720, stock_quantity: 50,
    category_id: '7', brand_id: '2', seller_id: '2', images: ['https://images.unsplash.com/photo-1587145820266-a59515e84651?w=400'],
    tags: ['ক্যালকুলেটর', 'ক্যাসিও', 'বৈজ্ঞানিক'], specifications: { 'ফাংশন': '৪১৭', 'ব্যাটারি': 'সোলার + ব্যাটারি' },
    is_featured: true, is_active: true, discount_expires_at: new Date(Date.now() + 86400000).toISOString(), created_at: '', updated_at: ''
  },
  {
    id: '2', name: 'সনি ব্রাভিয়া গুগল টিভি স্মার্ট এলইডি টিভি', slug: 'sony-bravia-smart-tv',
    description: '৫৫ ইঞ্চি ৪কে UHD স্মার্ট টিভি। গুগল টিভি OS সহ, HDR10 সাপোর্ট।',
    short_description: 'স্মার্ট এলইডি টিভি', price: 55000, sale_price: 48000, stock_quantity: 15,
    category_id: '7', brand_id: '2', seller_id: '2', images: ['https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400'],
    tags: ['টিভি', 'সনি', 'স্মার্ট'], specifications: { 'স্ক্রিন': '৫৫ ইঞ্চি', 'রেজোলিউশন': '4K UHD' },
    is_featured: true, is_active: true, discount_expires_at: new Date(Date.now() + 172800000).toISOString(), created_at: '', updated_at: ''
  },
  {
    id: '3', name: 'অর্গানিক বাসমতি চাল ৫ কেজি', slug: 'organic-basmati-rice',
    description: 'প্রিমিয়াম কোয়ালিটি অর্গানিক বাসমতি চাল। সুগন্ধি ও সুস্বাদু।',
    short_description: 'অর্গানিক চাল', price: 650, sale_price: 580, stock_quantity: 100,
    category_id: '1', brand_id: null, seller_id: '1', images: ['https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400'],
    tags: ['চাল', 'অর্গানিক', 'বাসমতি'], specifications: { 'ওজন': '৫ কেজি', 'ধরন': 'বাসমতি' },
    is_featured: false, is_active: true, discount_expires_at: new Date(Date.now() + 259200000).toISOString(), created_at: '', updated_at: ''
  },
];

// ============ HELPERS ============
const toBanglaNum = (n: number | string): string => {
  return n.toString().replace(/[0-9]/g, (d: string) => '০১২৩৪৫৬৭৮৯'[parseInt(d)]);
};

const formatPrice = (price: number): string => {
  return '৳' + toBanglaNum(price.toLocaleString('en-IN'));
};

const getCategoryIcon = (icon: string | null) => {
  const icons: Record<string, any> = {
    'layout-grid': LayoutGrid, 'fish': LayoutGrid, 'beef': LayoutGrid, 'apple': LayoutGrid,
    'leaf': LayoutGrid, 'shirt': LayoutGrid, 'monitor': LayoutGrid, 'home': LayoutGrid,
    'sparkles': Sparkles, 'baby': LayoutGrid,
  };
  return icons[icon || ''] || LayoutGrid;
};

// ============ PRODUCT CARD ============
function ProductCard({ product }: { product: Product }) {
  const cart = useCartStore();
  const wishlist = useWishlistStore();
  const auth = useAuthStore();
  const isWished = wishlist.isInWishlist(product.id);

  const handleWishlist = () => {
    if (!auth.user) return;
    if (isWished) {
      wishlist.removeFromWishlist(product.id, auth.user.id);
    } else {
      wishlist.addToWishlist(product.id, auth.user.id);
    }
  };

  const handleAddToCart = () => {
    const item: CartItem = {
      product_id: product.id,
      name: product.name,
      price: product.price,
      sale_price: product.sale_price,
      image: product.images[0] || '',
      quantity: 1,
      stock: product.stock_quantity,
    };
    cart.addItem(item);
  };

  return (
    <article className="group relative flex flex-col rounded-2xl border border-border bg-card overflow-hidden transition-all hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-glow">
      <Link to={`/product/${product.slug}`} className="relative block aspect-square overflow-hidden bg-secondary">
        <img src={product.images[0]} alt={product.name} className="size-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
        {product.sale_price && (
          <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-red-500 text-white text-[10px] font-bold">
            -{toBanglaNum(Math.round((1 - product.sale_price / product.price) * 100))}%
          </span>
        )}
      </Link>
      <button onClick={handleWishlist}
        className={`absolute right-2 top-2 grid size-8 place-items-center rounded-full border border-border bg-background/80 backdrop-blur transition-colors ${isWished ? 'text-red-500' : 'text-muted-foreground hover:text-red-500'}`}>
        <Heart className={`size-4 ${isWished ? 'fill-red-500' : ''}`} />
      </button>
      <div className="flex flex-1 flex-col gap-1.5 p-3">
        <Link to={`/product/${product.slug}`}>
          <h3 className="line-clamp-2 text-sm font-semibold leading-snug">{product.name}</h3>
        </Link>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Star className="size-3.5 fill-highlight text-highlight" />
          <span className="font-medium text-foreground">{toBanglaNum('4.5')}</span>
        </div>
        <div className="flex items-baseline gap-2 pt-1">
          {product.sale_price ? (
            <>
              <span className="text-base font-bold">{formatPrice(product.sale_price)}</span>
              <span className="text-xs text-muted-foreground line-through">{formatPrice(product.price)}</span>
            </>
          ) : (
            <span className="text-base font-bold">{formatPrice(product.price)}</span>
          )}
        </div>
        <button onClick={handleAddToCart}
          className="mt-2 flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-primary to-magenta px-3 py-2 text-xs font-semibold text-white transition-opacity hover:opacity-90">
          <ShoppingCart className="size-3.5" />
          কার্টে যোগ করুন
        </button>
      </div>
    </article>
  );
}

// ============ HEADER ============
function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const cart = useCartStore();
  const auth = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    auth.fetchProfile();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-lg">
      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-magenta text-white font-black text-sm">M</div>
          <span className="text-lg font-extrabold tracking-tight">MUNMAYA</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link to="/" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">হোম</Link>
          <Link to="/categories" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">ক্যাটাগরি</Link>
          <Link to="/flash-deals" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">ফ্ল্যাশ ডিল</Link>
          <Link to="/brands" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">ব্র্যান্ড</Link>
        </nav>

        <div className="flex items-center gap-2">
          <button onClick={() => setSearchOpen(!searchOpen)} className="h-9 w-9 flex items-center justify-center rounded-xl border border-border bg-card text-muted-foreground hover:text-foreground transition-colors">
            <Search className="size-4" />
          </button>
          <Link to="/cart" className="relative h-9 w-9 flex items-center justify-center rounded-xl border border-border bg-card text-muted-foreground hover:text-foreground transition-colors">
            <ShoppingCart className="size-4" />
            {cart.getItemCount() > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-magenta text-white text-[9px] font-bold flex items-center justify-center">
                {toBanglaNum(cart.getItemCount())}
              </span>
            )}
          </Link>
          {auth.user ? (
            <Link to={auth.isAdmin() ? '/admin' : '/profile'} className="h-9 flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-primary to-magenta px-4 text-xs font-semibold text-white">
              <User className="size-3.5" />
              <span className="hidden sm:inline">{auth.user.full_name || 'প্রোফাইল'}</span>
            </Link>
          ) : (
            <Link to="/login" className="h-9 flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-primary to-magenta px-4 text-xs font-semibold text-white">
              <User className="size-3.5" />
              <span className="hidden sm:inline">সাইন ইন</span>
            </Link>
          )}
          <button className="md:hidden h-9 w-9 flex items-center justify-center rounded-xl border border-border text-muted-foreground" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {searchOpen && (
        <div className="border-t border-border px-4 py-3">
          <form onSubmit={handleSearch} className="container mx-auto flex gap-2">
            <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="পণ্য খুঁজুন..." className="flex-1 px-4 py-2 rounded-xl bg-secondary border border-border text-sm outline-none focus:border-primary/50" />
            <button type="submit" className="px-4 py-2 rounded-xl bg-primary text-white text-sm font-semibold">খুঁজুন</button>
          </form>
        </div>
      )}

      {menuOpen && (
        <div className="md:hidden border-t border-border bg-background px-4 py-4 space-y-3">
          <Link to="/" className="block text-sm font-medium py-2" onClick={() => setMenuOpen(false)}>হোম</Link>
          <Link to="/categories" className="block text-sm font-medium py-2" onClick={() => setMenuOpen(false)}>ক্যাটাগরি</Link>
          <Link to="/flash-deals" className="block text-sm font-medium py-2" onClick={() => setMenuOpen(false)}>ফ্ল্যাশ ডিল</Link>
          <Link to="/brands" className="block text-sm font-medium py-2" onClick={() => setMenuOpen(false)}>ব্র্যান্ড</Link>
        </div>
      )}
    </header>
  );
}

// ============ FOOTER ============
function Footer() {
  return (
    <footer className="border-t border-border bg-card/60">
      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-magenta text-white font-black text-xs">M</div>
              <span className="text-base font-extrabold">MUNMAYA</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">AI চালিত অনলাইন মার্কেটপ্লেস। বাংলায় খুঁজুন, সেরা দামে পণ্য কিনুন।</p>
          </div>
          <div>
            <h4 className="text-sm font-bold mb-3">কোম্পানি</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-xs text-muted-foreground hover:text-foreground">আমাদের সম্পর্কে</a></li>
              <li><a href="#" className="text-xs text-muted-foreground hover:text-foreground">ক্যারিয়ার</a></li>
              <li><a href="#" className="text-xs text-muted-foreground hover:text-foreground">যোগাযোগ</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-bold mb-3">নীতিমালা</h4>
            <ul className="space-y-2">
              <li><Link to="/privacy" className="text-xs text-muted-foreground hover:text-foreground">প্রাইভেসি পলিসি</Link></li>
              <li><Link to="/terms" className="text-xs text-muted-foreground hover:text-foreground">টার্মস ও কন্ডিশনস</Link></li>
              <li><Link to="/returns" className="text-xs text-muted-foreground hover:text-foreground">রিটার্ন পলিসি</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-bold mb-3">সাহায্য</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-xs text-muted-foreground hover:text-foreground">সহায়তা কেন্দ্র</a></li>
              <li><Link to="/profile" className="text-xs text-muted-foreground hover:text-foreground">অর্ডার ট্র্যাকিং</Link></li>
              <li><a href="#" className="text-xs text-muted-foreground hover:text-foreground">FAQ</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-border pt-6 text-center">
          <p className="text-xs text-muted-foreground">© ২০২৫ MUNMAYA। সর্বস্বত্ব সংরক্ষিত। support@munmaya.com</p>
        </div>
      </div>
    </footer>
  );
}

// ============ HOME PAGE ============
function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [time, setTime] = useState({ hours: 5, minutes: 42, seconds: 20 });

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(prev => {
        let { hours, minutes, seconds } = prev;
        seconds--;
        if (seconds < 0) { seconds = 59; minutes--; }
        if (minutes < 0) { minutes = 59; hours--; }
        if (hours < 0) { hours = 23; minutes = 59; seconds = 59; }
        return { hours, minutes, seconds };
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) {
        console.error('Error fetching products:', error);
        setProducts(mockProducts);
      } else if (data && data.length > 0) {
        // Transform Supabase data to Product format
        const transformedProducts: Product[] = data.map((p: any) => ({
          id: p.id,
          name: p.name,
          slug: p.slug || p.name.toLowerCase().replace(/\s+/g, '-'),
          description: p.description || '',
          short_description: p.short_description || '',
          price: p.price,
          sale_price: p.sale_price,
          stock_quantity: p.stock_quantity || 0,
          category_id: p.category_id,
          brand_id: p.brand_id,
          seller_id: p.seller_id,
          images: p.images || (p.image_url ? [p.image_url] : []),
          tags: p.tags || [],
          specifications: p.specifications || {},
          is_featured: p.is_featured || false,
          is_active: p.is_active !== false,
          discount_expires_at: p.discount_expires_at,
          created_at: p.created_at,
          updated_at: p.updated_at,
        }));
        setProducts(transformedProducts);
      } else {
        setProducts(mockProducts);
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      setProducts(mockProducts);
    } finally {
      setLoading(false);
    }
  };

  const flashDeals = products.filter(p => p.discount_expires_at && new Date(p.discount_expires_at) > new Date());
  const featuredProducts = products.filter(p => p.is_featured);

  return (
    <>
      {/* Hero */}
      <section className="border-b border-border aurora">
        <div className="container mx-auto grid gap-8 px-4 py-10 lg:grid-cols-2 lg:items-center lg:py-16">
          <div>
            <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-xs font-medium">
              <Sparkles className="size-3.5 text-magenta" />
              MUNMAYA AI শপিং অ্যাসিস্ট্যান্ট
            </p>
            <h1 className="text-3xl font-black leading-tight tracking-tight sm:text-5xl">
              যা খুঁজছেন, <span className="text-gradient">AI বলে দেবে</span>
              <span className="block">কোথায় সেরা দামে পাবেন</span>
            </h1>
            <p className="mt-4 max-w-xl text-sm text-muted-foreground sm:text-lg">
              বাংলায় লিখুন বা বলুন — MUNMAYA AI আপনার বাজেট ও পছন্দ বুঝে সঠিক পণ্য, যাচাইকৃত বিক্রেতা আর সেরা অফার খুঁজে দেবে।
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <button className="inline-flex items-center gap-2 h-11 rounded-2xl px-8 bg-gradient-to-r from-primary to-magenta text-sm font-semibold text-white shadow-soft hover:shadow-glow transition-all">
                <Sparkles className="size-4" /> AI অ্যাসিস্ট্যান্ট চালু করুন
              </button>
              <Link to="/flash-deals" className="inline-flex items-center gap-2 h-11 rounded-2xl px-8 border border-primary/25 bg-card text-primary text-sm font-semibold shadow-soft hover:border-primary/50 transition-all">
                ফ্ল্যাশ ডিল দেখুন
              </Link>
            </div>
          </div>
          <div className="relative mx-auto w-full max-w-[240px] sm:max-w-sm">
            <div className="absolute inset-6 rounded-full bg-primary/30 blur-3xl"></div>
            <div className="relative w-full aspect-square rounded-3xl bg-gradient-to-br from-primary/20 to-magenta/20 flex items-center justify-center">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-magenta flex items-center justify-center">
                <Sparkles className="size-12 text-white" />
              </div>
            </div>
            <div className="relative -mt-3 rounded-2xl border border-border bg-card/80 p-3 backdrop-blur sm:-mt-6">
              <p className="text-xs text-muted-foreground">MUNMAYA AI বলছে</p>
              <p className="mt-1 text-sm font-semibold">"আজকের ফ্ল্যাশ ডিলে ৪০% পর্যন্ত ছাড় চলছে!"</p>
            </div>
          </div>
        </div>
      </section>

      {/* Admin Link */}
      <section className="container mx-auto flex justify-end px-4 py-3">
        <Link to="/admin" className="group inline-flex h-14 w-[150px] items-center gap-2.5 rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/5 via-card to-magenta/5 px-3 shadow-soft transition-all hover:-translate-y-0.5 hover:border-primary/50">
          <span className="relative grid size-8 place-items-center rounded-xl bg-gradient-to-br from-primary to-magenta text-white">
            <Settings className="size-4" />
          </span>
          <span className="min-w-0 text-left leading-tight">
            <span className="block truncate text-[11px] font-black">Admin Panel</span>
            <span className="block text-[9px] font-semibold text-muted-foreground">পণ্য ম্যানেজ করুন</span>
          </span>
          <ArrowRight className="ml-auto size-3.5 text-primary transition-transform group-hover:translate-x-0.5" />
        </Link>
      </section>

      {/* Categories */}
      <section className="container mx-auto px-4 py-8 sm:py-12">
        <div className="mb-5 flex items-end justify-between">
          <div>
            <h2 className="text-lg font-extrabold sm:text-2xl">সব ক্যাটাগরি</h2>
            <p className="mt-1 text-xs text-muted-foreground sm:text-sm">আপনার প্রয়োজন অনুযায়ী ক্যাটাগরি বেছে নিন</p>
          </div>
          <Link to="/categories" className="flex items-center gap-1 text-xs font-semibold text-primary hover:underline sm:text-sm">
            সব দেখুন <ArrowRight className="size-4" />
          </Link>
        </div>
        <div className="-mx-4 flex snap-x gap-3 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-5 sm:gap-4 sm:overflow-visible sm:px-0 lg:grid-cols-5">
          {mockCategories.map((cat) => {
            const Icon = getCategoryIcon(cat.icon);
            return (
              <Link key={cat.id} to={`/category/${cat.slug}`}
                className="group flex w-24 shrink-0 snap-start flex-col items-center gap-2 rounded-2xl border border-border bg-card p-3 transition-all hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-glow sm:w-auto">
                <span className={`grid size-12 place-items-center rounded-xl bg-gradient-to-br ${cat.gradient}`}>
                  <Icon className="size-5 text-white" />
                </span>
                <span className="w-full truncate text-center text-[11px] font-medium sm:text-xs">{cat.name}</span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Flash Deals */}
      <section className="border-y border-border bg-card/40">
        <div className="container mx-auto px-4 py-8 sm:py-12">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="flex items-center gap-2 text-lg font-extrabold sm:text-2xl">
                <Zap className="size-5 text-highlight" /> ফ্ল্যাশ ডিল
              </h2>
              <p className="mt-1 text-xs text-muted-foreground sm:text-sm">সীমিত সময়ের অফার</p>
            </div>
            <div className="flex items-center gap-1.5 text-sm font-bold">
              <Clock className="size-4 text-highlight" />
              <span className="rounded-md bg-secondary px-2 py-1">{toBanglaNum(time.hours)}</span>
              <span className="rounded-md bg-secondary px-2 py-1">{toBanglaNum(time.minutes)}</span>
              <span className="rounded-md bg-secondary px-2 py-1">{toBanglaNum(time.seconds)}</span>
            </div>
          </div>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="size-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
              {flashDeals.slice(0, 4).map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          )}
          {!loading && flashDeals.length === 0 && (
            <p className="rounded-2xl border border-border bg-card p-6 text-center text-sm text-muted-foreground">
              ডাটাবেসে এখনো কোনো ফ্ল্যাশ ডিল যুক্ত করা হয়নি।
            </p>
          )}
        </div>
      </section>

      {/* Featured Products */}
      <section className="container mx-auto px-4 py-8 sm:py-12">
        <div className="mb-5 flex items-end justify-between">
          <div>
            <h2 className="text-lg font-extrabold sm:text-2xl">AI সাজেস্টেড ফর ইউ</h2>
            <p className="mt-1 text-xs text-muted-foreground sm:text-sm">জনপ্রিয় সার্চ ও ট্রেন্ড অনুযায়ী বাছাই</p>
          </div>
          <Link to="/products" className="flex items-center gap-1 text-xs font-semibold text-primary hover:underline sm:text-sm">
            আরও দেখুন <ArrowRight className="size-4" />
          </Link>
        </div>
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="size-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
            {(featuredProducts.length > 0 ? featuredProducts : products.slice(0, 4)).map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </section>

      {/* Brands */}
      <section className="border-t border-border bg-card/40">
        <div className="container mx-auto px-4 py-8 sm:py-12">
          <div className="mb-5 flex items-end justify-between">
            <div>
              <h2 className="text-lg font-extrabold sm:text-2xl">জনপ্রিয় ব্র্যান্ড</h2>
              <p className="mt-1 text-xs text-muted-foreground sm:text-sm">MUNMAYA-তে থাকা ব্র্যান্ড কালেকশন</p>
            </div>
            <Link to="/brands" className="flex items-center gap-1 text-xs font-semibold text-primary hover:underline sm:text-sm">
              সব ব্র্যান্ড <ArrowRight className="size-4" />
            </Link>
          </div>
          <div className="-mx-4 flex snap-x gap-3 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-3 sm:gap-4 sm:overflow-visible sm:px-0 lg:grid-cols-6">
            {mockBrands.map((brand) => (
              <div key={brand.id} className="flex w-40 shrink-0 snap-start flex-col items-center gap-2 rounded-2xl border border-border bg-card p-4 transition-all hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-glow sm:w-auto">
                <span className={`grid size-12 place-items-center rounded-2xl text-sm font-black text-white bg-gradient-to-br ${brand.gradient}`}>{brand.initials}</span>
                <span className="flex items-center gap-1 text-xs font-semibold"><span className="truncate">{brand.name}</span><BadgeCheck className="size-3.5 text-primary" /></span>
                <span className="text-[11px] text-muted-foreground">{brand.category}</span>
                <span className="flex items-center gap-1 text-[11px]"><Star className="size-3 fill-highlight text-highlight" /><span className="font-medium">{toBanglaNum(brand.rating)}</span></span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sellers */}
      <section className="container mx-auto px-4 py-8 sm:py-12">
        <div className="mb-5 flex items-end justify-between">
          <div>
            <h2 className="text-lg font-extrabold sm:text-2xl">বিশ্বস্ত বিক্রেতা</h2>
            <p className="mt-1 text-xs text-muted-foreground sm:text-sm">যাচাইকৃত বিক্রেতা ও তাদের রেটিং</p>
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
          {mockSellers.map((seller) => (
            <div key={seller.id} className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4 transition-all hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-glow">
              <span className={`grid size-12 shrink-0 place-items-center rounded-2xl text-sm font-black text-white bg-gradient-to-br ${seller.gradient}`}>{seller.initials}</span>
              <div className="min-w-0">
                <h3 className="flex items-center gap-1.5 truncate text-sm font-semibold">{seller.business_name}<BadgeCheck className="size-4 text-primary" /></h3>
                <p className="truncate text-xs text-muted-foreground">{seller.category}</p>
                <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                  <Star className="size-3.5 fill-highlight text-highlight" />
                  <span className="font-medium text-foreground">{toBanglaNum(seller.rating)}</span>
                  <span>· {toBanglaNum(seller.total_orders)}+ অর্ডার</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Trust Badges */}
      <section className="border-t border-border bg-card/40">
        <div className="container mx-auto grid grid-cols-2 gap-4 px-4 py-10 sm:grid-cols-3 lg:grid-cols-5">
          {[
            { icon: ShieldCheck, title: '১০০% নিরাপদ পেমেন্ট', desc: 'এনক্রিপ্টেড ও সুরক্ষিত চেকআউট' },
            { icon: BadgeCheck, title: 'ভেরিফাইড বিক্রেতা', desc: 'যাচাই করা বিক্রেতার কাছ থেকে কিনুন' },
            { icon: Truck, title: 'দ্রুত ডেলিভারি', desc: 'সারা দেশে দ্রুত পৌঁছে যায়' },
            { icon: RotateCcw, title: 'সহজ রিটার্ন', desc: '৭ দিনের সহজ রিটার্ন সুবিধা' },
            { icon: Headphones, title: '২৪/৭ সাপোর্ট', desc: 'যেকোনো সময় বাংলায় সহায়তা' },
          ].map((badge, i) => (
            <div key={i} className="flex items-start gap-3 rounded-2xl border border-border bg-card p-4">
              <span className="grid size-10 shrink-0 place-items-center rounded-xl border border-border bg-secondary">
                <badge.icon className="size-4 text-primary" />
              </span>
              <div>
                <p className="text-xs font-semibold sm:text-sm">{badge.title}</p>
                <p className="mt-0.5 text-[11px] text-muted-foreground sm:text-xs">{badge.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 py-10">
        <div className="grid gap-5 rounded-3xl border border-border aurora p-6 sm:p-8 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <h2 className="text-xl font-extrabold sm:text-2xl">MUNMAYA অ্যাকাউন্ট খুলুন</h2>
            <p className="mt-2 max-w-xl text-sm text-muted-foreground">অর্ডার ট্র্যাকিং, উইশলিস্ট আর ব্যক্তিগত AI রেকমেন্ডেশন পেতে সাইন আপ করুন।</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link to="/login" className="inline-flex items-center justify-center h-11 rounded-2xl px-8 bg-gradient-to-r from-primary to-magenta text-sm font-semibold text-white shadow-soft hover:shadow-glow transition-all">সাইন আপ</Link>
            <Link to="/login" className="inline-flex items-center justify-center h-11 rounded-2xl px-8 border border-primary/25 bg-card text-primary text-sm font-semibold shadow-soft hover:border-primary/50 transition-all">সাইন ইন</Link>
          </div>
        </div>
      </section>
    </>
  );
}

// ============ MAIN APP ============
export default function App() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <HomePage />
      </main>
      <Footer />
    </div>
  );
}
