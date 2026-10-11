import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, useNavigate, useParams, useLocation } from 'react-router-dom';
import {
  Sparkles, HeartPulse, ShieldCheck, ArrowRight,
  LayoutGrid, Zap, Clock, Send, Star, BadgeCheck, Truck,
  RotateCcw, Headphones, ShoppingCart, Heart, Search, Menu, X, User,
  Plus, Minus, Trash2, Package, Users, BarChart3, LogOut, Edit, Eye,
  ChevronLeft, Filter, Home, Baby, Shirt, Monitor, Leaf, Apple, Beef, Fish
} from 'lucide-react';
import { useCartStore } from './stores/cartStore';
import { useAuthStore } from './stores/authStore';
import { useWishlistStore } from './stores/wishlistStore';
import type { Product, Category, Brand, Seller, CartItem } from './lib/types';

// ============ MOCK DATA (Fallback when Supabase not connected) ============
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
  {
    id: '4', name: 'প্রিমিয়াম ফেস ওয়াশ - সেনসিটিভ স্কিন', slug: 'premium-face-wash',
    description: 'সেনসিটিভ স্কিনের জন্য বিশেষভাবে তৈরি। প্যারাবেন ও সালফেট মুক্ত।',
    short_description: 'ফেস ওয়াশ', price: 450, sale_price: 380, stock_quantity: 200,
    category_id: '9', brand_id: '3', seller_id: '3', images: ['https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400'],
    tags: ['ফেস ওয়াশ', 'বিউটি', 'স্কিন কেয়ার'], specifications: { 'ভলিউম': '১৫০ মিলি', 'ধরন': 'সেনসিটিভ স্কিন' },
    is_featured: true, is_active: true, discount_expires_at: new Date(Date.now() + 86400000).toISOString(), created_at: '', updated_at: ''
  },
  {
    id: '5', name: 'মেনস কটন পোলো শার্ট', slug: 'mens-cotton-polo',
    description: '১০০% কটন পোলো শার্ট। আরামদায়ক ও স্টাইলিশ।',
    short_description: 'পোলো শার্ট', price: 1200, sale_price: 950, stock_quantity: 75,
    category_id: '6', brand_id: '4', seller_id: '1', images: ['https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=400'],
    tags: ['শার্ট', 'পোলো', 'ফ্যাশন'], specifications: { 'ম্যাটেরিয়াল': '১০০% কটন', 'সাইজ': 'S-XXL' },
    is_featured: true, is_active: true, discount_expires_at: new Date(Date.now() + 432000000).toISOString(), created_at: '', updated_at: ''
  },
  {
    id: '6', name: 'LED ডেস্ক ল্যাম্প - চোখের যত্ন', slug: 'led-desk-lamp',
    description: 'চোখের জন্য আরামদায়ক LED ডেস্ক ল্যাম্প। ডিমেবল ও চার্জেবল।',
    short_description: 'LED ল্যাম্প', price: 1500, sale_price: 1200, stock_quantity: 40,
    category_id: '8', brand_id: '6', seller_id: '4', images: ['https://images.unsplash.com/photo-1507473885765-e6ed057ab6fe?w=400'],
    tags: ['ল্যাম্প', 'LED', 'ডেস্ক'], specifications: { 'ওয়াট': '১২W', 'ব্যাটারি': 'রিচার্জেবল' },
    is_featured: false, is_active: true, discount_expires_at: null, created_at: '', updated_at: ''
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
    'layout-grid': LayoutGrid, 'fish': Fish, 'beef': Beef, 'apple': Apple,
    'leaf': Leaf, 'shirt': Shirt, 'monitor': Monitor, 'home': Home,
    'sparkles': Sparkles, 'baby': Baby,
  };
  return icons[icon || ''] || LayoutGrid;
};

// ============ AI CHAT COMPONENT ============
function AIChatModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [messages, setMessages] = useState<{ role: 'user' | 'ai'; content: string; products?: Product[] }[]>([
    { role: 'ai', content: 'আসসালামু আলাইকুম! আমি MUNMAYA AI। আপনি কী ধরনের পণ্য খুঁজছেন? বাজেট, ব্র্যান্ড বা প্রয়োজন বললেই আমি সেরা পণ্য খুঁজে দেব।' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    
    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setLoading(true);

    // Simulate AI response with product search
    setTimeout(() => {
      const query = userMsg.toLowerCase();
      let filteredProducts: Product[] = [];
      let response = '';

      if (query.includes('ফোন') || query.includes('স্মার্টফোন') || query.includes('মোবাইল')) {
        filteredProducts = mockProducts.filter(p => p.tags.some(t => t.includes('ফোন') || t.includes('মোবাইল')));
        response = 'আপনার বাজেট অনুযায়ী সেরা স্মার্টফোন খুঁজে পেলাম। তবে আমাদের ডাটাবেসে এখনো স্মার্টফোন যুক্ত করা হয়নি। শীঘ্রই আসছে!';
      } else if (query.includes('ক্যালকুলেটর')) {
        filteredProducts = mockProducts.filter(p => p.name.includes('ক্যালকুলেটর'));
        response = 'এই দেখুন! ক্যাসিও FX-991ES Plus একটি চমৎকার বৈজ্ঞানিক ক্যালকুলেটর। ৪১৭টি ফাংশন সহ, সোলার ও ব্যাটারি পাওয়ার।';
      } else if (query.includes('টিভি') || query.includes('tv')) {
        filteredProducts = mockProducts.filter(p => p.name.includes('টিভি'));
        response = 'সনি ব্রাভিয়া ৫৫ ইঞ্চি ৪কে স্মার্ট টিভি আপনার জন্য পারফেক্ট! HDR10 সাপোর্ট সহ গুগল টিভি OS।';
      } else if (query.includes('বিউটি') || query.includes('ফেস') || query.includes('স্কিন')) {
        filteredProducts = mockProducts.filter(p => p.category_id === '9');
        response = 'সেনসিটিভ স্কিনের জন্য সোলেন ল্যাবের প্রিমিয়াম ফেস ওয়াশ খুবই ভালো। প্যারাবেন ও সালফেট মুক্ত।';
      } else if (query.includes('শার্ট') || query.includes('ফ্যাশন') || query.includes('পোশাক')) {
        filteredProducts = mockProducts.filter(p => p.category_id === '6');
        response = 'ফোল্ড অ্যান্ড ফিল্ডের ১০০% কটন পোলো শার্ট দেখুন। আরামদায়ক ও স্টাইলিশ!';
      } else {
        filteredProducts = mockProducts.slice(0, 3);
        response = 'আপনার জন্য কিছু জনপ্রিয় পণ্য সাজেস্ট করছি। বিস্তারিত জানতে যেকোনো পণ্যে ক্লিক করুন।';
      }

      setMessages(prev => [...prev, { role: 'ai', content: response, products: filteredProducts }]);
      setLoading(false);
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-card rounded-3xl border border-border shadow-2xl overflow-hidden max-h-[80vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-border bg-gradient-to-r from-primary/5 to-magenta/5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-magenta flex items-center justify-center">
              <Sparkles className="size-4 text-white" />
            </div>
            <div>
              <p className="text-sm font-bold">MUNMAYA AI</p>
              <p className="text-[10px] text-muted-foreground">শপিং অ্যাসিস্ট্যান্ট</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-secondary transition-colors">
            <X className="size-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] rounded-2xl p-3 ${
                msg.role === 'user' 
                  ? 'bg-gradient-to-r from-primary to-magenta text-white' 
                  : 'bg-secondary border border-border'
              }`}>
                <p className="text-sm">{msg.content}</p>
                {msg.products && msg.products.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {msg.products.map(p => (
                      <Link key={p.id} to={`/product/${p.slug}`} onClick={onClose}
                        className="flex items-center gap-2 p-2 rounded-xl bg-card border border-border hover:border-primary/50 transition-colors">
                        <img src={p.images[0]} alt={p.name} className="w-10 h-10 rounded-lg object-cover" />
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-semibold truncate">{p.name}</p>
                          <p className="text-xs text-primary font-bold">{formatPrice(p.sale_price || p.price)}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-secondary border border-border rounded-2xl p-3">
                <div className="flex gap-1">
                  <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-border">
          <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="বাংলায় প্রশ্ন লিখুন..."
              className="flex-1 px-4 py-2.5 rounded-full bg-secondary border border-border text-sm outline-none focus:border-primary/50 transition-colors"
            />
            <button type="submit" disabled={loading} className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-magenta flex items-center justify-center text-white disabled:opacity-50">
              <Send className="size-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

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
  const [aiOpen, setAiOpen] = useState(false);
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
    <>
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
            <button onClick={() => { setAiOpen(true); setMenuOpen(false); }} className="w-full h-10 rounded-xl bg-gradient-to-r from-primary to-magenta text-sm font-semibold text-white flex items-center justify-center gap-2">
              <Sparkles className="size-4" /> AI অ্যাসিস্ট্যান্ট
            </button>
          </div>
        )}
      </header>
      <AIChatModal isOpen={aiOpen} onClose={() => setAiOpen(false)} />
    </>
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

// ============ PAGES ============

// HOME PAGE
function HomePage() {
  const [aiOpen, setAiOpen] = useState(false);
  const [time, setTime] = useState({ hours: 5, minutes: 42, seconds: 20 });

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

  const flashDeals = mockProducts.filter(p => p.discount_expires_at && new Date(p.discount_expires_at) > new Date());
  const featuredProducts = mockProducts.filter(p => p.is_featured);

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
              <button onClick={() => setAiOpen(true)} className="inline-flex items-center gap-2 h-11 rounded-2xl px-8 bg-gradient-to-r from-primary to-magenta text-sm font-semibold text-white shadow-soft hover:shadow-glow transition-all">
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

      {/* Health Shortcut */}
      <section className="container mx-auto flex justify-end px-4 py-3">
        <a href="#" className="group inline-flex h-14 w-[150px] items-center gap-2.5 rounded-2xl border border-teal-300/70 bg-gradient-to-br from-teal-50 via-card to-emerald-50 px-3 shadow-[0_8px_22px_rgba(13,148,136,0.13)] transition-all hover:-translate-y-0.5">
          <span className="relative grid size-8 place-items-center rounded-xl bg-gradient-to-br from-teal-700 to-emerald-500 text-white">
            <HeartPulse className="size-4" />
          </span>
          <span className="min-w-0 text-left leading-tight">
            <span className="block truncate text-[11px] font-black text-teal-950">MUNMAYA Health</span>
            <span className="block text-[9px] font-semibold text-teal-700">২৪/৭ যত্ন</span>
          </span>
          <ArrowRight className="ml-auto size-3.5 text-teal-700 transition-transform group-hover:translate-x-0.5" />
        </a>
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
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
            {flashDeals.slice(0, 4).map(p => <ProductCard key={p.id} product={p} />)}
          </div>
          {flashDeals.length === 0 && (
            <p className="rounded-2xl border border-border bg-card p-6 text-center text-sm text-muted-foreground">
              ডাটাবেসে এখনো কোনো ফ্ল্যাশ ডিল যুক্ত করা হয়নি।
            </p>
          )}
        </div>
      </section>

      {/* AI Ask */}
      <section className="container mx-auto px-4 py-8 sm:py-12">
        <div className="rounded-3xl border border-border aurora p-5 sm:p-8">
          <div className="grid gap-6 lg:grid-cols-2 lg:items-center">
            <div>
              <h2 className="text-xl font-extrabold sm:text-3xl">AI কে জিজ্ঞেস করুন</h2>
              <p className="mt-2 text-sm text-muted-foreground">বাংলায় প্রশ্ন লিখুন — MUNMAYA AI মিলিয়ে দেবে সেরা পণ্য।</p>
              <button onClick={() => setAiOpen(true)} className="mt-4 inline-flex items-center gap-2 h-10 rounded-xl bg-gradient-to-r from-primary to-magenta px-6 text-sm font-semibold text-white">
                <Sparkles className="size-4" /> AI চ্যাট চালু করুন
              </button>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">জনপ্রিয় প্রশ্ন</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {['১০ হাজার টাকার মধ্যে ভালো স্মার্টফোন', 'শীতের জন্য আরামদায়ক জ্যাকেট', 'অফিসের জন্য হালকা ল্যাপটপ', 'সেনসিটিভ স্কিনের জন্য ফেসওয়াশ'].map((q, i) => (
                  <button key={i} onClick={() => setAiOpen(true)}
                    className="rounded-full border border-border bg-card/70 px-3 py-1.5 text-left text-xs hover:border-primary/60 hover:bg-primary/15 transition-colors">
                    {q}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="container mx-auto px-4 pb-8 sm:pb-12">
        <div className="mb-5 flex items-end justify-between">
          <div>
            <h2 className="text-lg font-extrabold sm:text-2xl">AI সাজেস্টেড ফর ইউ</h2>
            <p className="mt-1 text-xs text-muted-foreground sm:text-sm">জনপ্রিয় সার্চ ও ট্রেন্ড অনুযায়ী বাছাই</p>
          </div>
          <Link to="/products" className="flex items-center gap-1 text-xs font-semibold text-primary hover:underline sm:text-sm">
            আরও দেখুন <ArrowRight className="size-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
          {featuredProducts.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
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

      <AIChatModal isOpen={aiOpen} onClose={() => setAiOpen(false)} />
    </>
  );
}

// CATEGORY PAGE
function CategoryPage() {
  const { slug } = useParams();
  const category = mockCategories.find(c => c.slug === slug);
  const products = slug ? mockProducts.filter(p => p.category_id === category?.id) : mockProducts;

  if (slug && !category) {
    return <div className="container mx-auto px-4 py-20 text-center"><p className="text-lg">ক্যাটাগরি পাওয়া যায়নি</p></div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold sm:text-3xl">{category ? category.name : 'সব পণ্য'}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{toBanglaNum(products.length)}টি পণ্য পাওয়া গেছে</p>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
        {products.map(p => <ProductCard key={p.id} product={p} />)}
      </div>
      {products.length === 0 && (
        <p className="rounded-2xl border border-border bg-card p-8 text-center text-muted-foreground">এই ক্যাটাগরিতে কোনো পণ্য নেই।</p>
      )}
    </div>
  );
}

// PRODUCT DETAIL PAGE
function ProductPage() {
  const { slug } = useParams();
  const product = mockProducts.find(p => p.slug === slug);
  const cart = useCartStore();
  const [qty, setQty] = useState(1);

  if (!product) {
    return <div className="container mx-auto px-4 py-20 text-center"><p className="text-lg">পণ্য পাওয়া যায়নি</p></div>;
  }

  const handleAddToCart = () => {
    const item: CartItem = {
      product_id: product.id, name: product.name, price: product.price,
      sale_price: product.sale_price, image: product.images[0] || '', quantity: qty, stock: product.stock_quantity,
    };
    cart.addItem(item);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Link to="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6">
        <ChevronLeft className="size-4" /> ফিরে যান
      </Link>
      <div className="grid gap-8 lg:grid-cols-2">
        <div className="rounded-2xl border border-border overflow-hidden bg-card">
          <img src={product.images[0]} alt={product.name} className="w-full aspect-square object-cover" />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold sm:text-3xl">{product.name}</h1>
          <div className="mt-3 flex items-center gap-2">
            <div className="flex items-center gap-1">
              {[1,2,3,4,5].map(s => <Star key={s} className="size-4 fill-highlight text-highlight" />)}
            </div>
            <span className="text-sm text-muted-foreground">({toBanglaNum(24)} রিভিউ)</span>
          </div>
          <div className="mt-4 flex items-baseline gap-3">
            {product.sale_price ? (
              <>
                <span className="text-3xl font-black">{formatPrice(product.sale_price)}</span>
                <span className="text-lg text-muted-foreground line-through">{formatPrice(product.price)}</span>
                <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-xs font-bold">
                  -{toBanglaNum(Math.round((1 - product.sale_price / product.price) * 100))}%
                </span>
              </>
            ) : (
              <span className="text-3xl font-black">{formatPrice(product.price)}</span>
            )}
          </div>
          <p className="mt-4 text-sm text-muted-foreground leading-relaxed">{product.description}</p>
          
          {product.specifications && Object.keys(product.specifications).length > 0 && (
            <div className="mt-6 rounded-xl border border-border p-4">
              <h3 className="text-sm font-bold mb-2">বিশেষত্ব</h3>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(product.specifications).map(([key, val]) => (
                  <div key={key} className="text-xs"><span className="text-muted-foreground">{key}: </span><span className="font-medium">{val as string}</span></div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-6 flex items-center gap-3">
            <div className="flex items-center border border-border rounded-xl overflow-hidden">
              <button onClick={() => setQty(Math.max(1, qty - 1))} className="p-2 hover:bg-secondary"><Minus className="size-4" /></button>
              <span className="px-4 text-sm font-semibold">{toBanglaNum(qty)}</span>
              <button onClick={() => setQty(Math.min(product.stock_quantity, qty + 1))} className="p-2 hover:bg-secondary"><Plus className="size-4" /></button>
            </div>
            <span className="text-xs text-muted-foreground">স্টক: {toBanglaNum(product.stock_quantity)}</span>
          </div>

          <div className="mt-6 flex gap-3">
            <button onClick={handleAddToCart} className="flex-1 flex items-center justify-center gap-2 h-12 rounded-2xl bg-gradient-to-r from-primary to-magenta text-sm font-semibold text-white hover:shadow-glow transition-all">
              <ShoppingCart className="size-4" /> কার্টে যোগ করুন
            </button>
          </div>

          <div className="mt-6 grid grid-cols-3 gap-3">
            <div className="flex items-center gap-2 rounded-xl border border-border p-3">
              <Truck className="size-4 text-primary" />
              <span className="text-[11px] font-medium">ফ্রি ডেলিভারি</span>
            </div>
            <div className="flex items-center gap-2 rounded-xl border border-border p-3">
              <RotateCcw className="size-4 text-primary" />
              <span className="text-[11px] font-medium">৭ দিন রিটার্ন</span>
            </div>
            <div className="flex items-center gap-2 rounded-xl border border-border p-3">
              <ShieldCheck className="size-4 text-primary" />
              <span className="text-[11px] font-medium">নিরাপদ পেমেন্ট</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// CART PAGE
function CartPage() {
  const cart = useCartStore();
  const navigate = useNavigate();

  if (cart.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <ShoppingCart className="size-16 mx-auto text-muted-foreground mb-4" />
        <h2 className="text-xl font-bold">আপনার কার্ট খালি</h2>
        <p className="mt-2 text-sm text-muted-foreground">পণ্য যোগ করতে শপ দেখুন</p>
        <Link to="/" className="mt-6 inline-flex items-center gap-2 h-11 rounded-2xl px-8 bg-gradient-to-r from-primary to-magenta text-sm font-semibold text-white">
          শপিং শুরু করুন
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-extrabold mb-6">শপিং কার্ট ({toBanglaNum(cart.getItemCount())}টি পণ্য)</h1>
      <div className="grid gap-6 lg:grid-cols-[1fr_350px]">
        <div className="space-y-3">
          {cart.items.map(item => (
            <div key={item.product_id} className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4">
              <img src={item.image} alt={item.name} className="w-20 h-20 rounded-xl object-cover" />
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold truncate">{item.name}</h3>
                <p className="text-sm font-bold text-primary mt-1">{formatPrice(item.sale_price || item.price)}</p>
              </div>
              <div className="flex items-center border border-border rounded-lg overflow-hidden">
                <button onClick={() => cart.updateQuantity(item.product_id, item.quantity - 1)} className="p-1.5 hover:bg-secondary"><Minus className="size-3" /></button>
                <span className="px-3 text-xs font-semibold">{toBanglaNum(item.quantity)}</span>
                <button onClick={() => cart.updateQuantity(item.product_id, item.quantity + 1)} className="p-1.5 hover:bg-secondary"><Plus className="size-3" /></button>
              </div>
              <button onClick={() => cart.removeItem(item.product_id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 className="size-4" /></button>
            </div>
          ))}
        </div>
        <div className="rounded-2xl border border-border bg-card p-6 h-fit sticky top-24">
          <h3 className="text-lg font-bold mb-4">অর্ডার সামারি</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">সাবটোটাল</span><span className="font-medium">{formatPrice(cart.getTotal())}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">ডেলিভারি</span><span className="font-medium text-green-600">ফ্রি</span></div>
            <div className="border-t border-border pt-2 flex justify-between text-base font-bold">
              <span>মোট</span><span>{formatPrice(cart.getTotal())}</span>
            </div>
          </div>
          <button onClick={() => navigate('/checkout')} className="mt-6 w-full h-12 rounded-2xl bg-gradient-to-r from-primary to-magenta text-sm font-semibold text-white hover:shadow-glow transition-all">
            চেকআউট করুন
          </button>
        </div>
      </div>
    </div>
  );
}

// CHECKOUT PAGE
function CheckoutPage() {
  const cart = useCartStore();
  const auth = useAuthStore();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [shipping, setShipping] = useState({ name: '', phone: '', address: '', city: '', zip: '' });
  const [payment, setPayment] = useState('cod');
  const [orderPlaced, setOrderPlaced] = useState(false);

  if (cart.items.length === 0 && !orderPlaced) {
    navigate('/cart');
    return null;
  }

  const handlePlaceOrder = () => {
    setOrderPlaced(true);
    cart.clearCart();
  };

  if (orderPlaced) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <div className="w-20 h-20 mx-auto rounded-full bg-green-100 flex items-center justify-center mb-4">
          <BadgeCheck className="size-10 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold">অর্ডার সফলভাবে সম্পন্ন!</h2>
        <p className="mt-2 text-sm text-muted-foreground">আপনার অর্ডার নম্বর: #MUN-{toBanglaNum(Math.floor(Math.random() * 90000) + 10000)}</p>
        <Link to="/" className="mt-6 inline-flex items-center gap-2 h-11 rounded-2xl px-8 bg-gradient-to-r from-primary to-magenta text-sm font-semibold text-white">হোমে ফিরে যান</Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <h1 className="text-2xl font-extrabold mb-6">চেকআউট</h1>
      
      {/* Steps */}
      <div className="flex items-center gap-2 mb-8">
        {[1, 2, 3].map(s => (
          <div key={s} className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${step >= s ? 'bg-gradient-to-r from-primary to-magenta text-white' : 'bg-secondary text-muted-foreground'}`}>
              {toBanglaNum(s)}
            </div>
            <span className={`text-xs font-medium ${step >= s ? 'text-foreground' : 'text-muted-foreground'}`}>
              {s === 1 ? 'শিপিং' : s === 2 ? 'পেমেন্ট' : 'কনফার্ম'}
            </span>
            {s < 3 && <div className={`w-8 h-0.5 ${step > s ? 'bg-primary' : 'bg-border'}`}></div>}
          </div>
        ))}
      </div>

      {step === 1 && (
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">পুরো নাম</label>
            <input value={shipping.name} onChange={e => setShipping({...shipping, name: e.target.value})}
              className="mt-1 w-full px-4 py-2.5 rounded-xl border border-border bg-card text-sm outline-none focus:border-primary/50" placeholder="আপনার নাম" />
          </div>
          <div>
            <label className="text-sm font-medium">ফোন নম্বর</label>
            <input value={shipping.phone} onChange={e => setShipping({...shipping, phone: e.target.value})}
              className="mt-1 w-full px-4 py-2.5 rounded-xl border border-border bg-card text-sm outline-none focus:border-primary/50" placeholder="০১XXXXXXXXX" />
          </div>
          <div>
            <label className="text-sm font-medium">ঠিকানা</label>
            <textarea value={shipping.address} onChange={e => setShipping({...shipping, address: e.target.value})}
              className="mt-1 w-full px-4 py-2.5 rounded-xl border border-border bg-card text-sm outline-none focus:border-primary/50" placeholder="বাসা/ফ্ল্যাট নং, রোড, এলাকা" rows={3} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">শহর</label>
              <input value={shipping.city} onChange={e => setShipping({...shipping, city: e.target.value})}
                className="mt-1 w-full px-4 py-2.5 rounded-xl border border-border bg-card text-sm outline-none focus:border-primary/50" placeholder="ঢাকা" />
            </div>
            <div>
              <label className="text-sm font-medium">পোস্ট কোড</label>
              <input value={shipping.zip} onChange={e => setShipping({...shipping, zip: e.target.value})}
                className="mt-1 w-full px-4 py-2.5 rounded-xl border border-border bg-card text-sm outline-none focus:border-primary/50" placeholder="১২০০" />
            </div>
          </div>
          <button onClick={() => setStep(2)} className="w-full h-12 rounded-2xl bg-gradient-to-r from-primary to-magenta text-sm font-semibold text-white mt-4">
            পরবর্তী: পেমেন্ট
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <p className="text-sm font-medium mb-2">পেমেন্ট মেথড বেছে নিন</p>
          {[
            { id: 'cod', label: 'ক্যাশ অন ডেলিভারি', desc: 'পণ্য হাতে পেয়ে পেমেন্ট করুন' },
            { id: 'bkash', label: 'বিকাশ', desc: 'বিকাশ দিয়ে পেমেন্ট করুন' },
            { id: 'nagad', label: 'নগদ', desc: 'নগদ দিয়ে পেমেন্ট করুন' },
          ].map(method => (
            <label key={method.id} className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all ${payment === method.id ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}`}>
              <input type="radio" name="payment" value={method.id} checked={payment === method.id} onChange={e => setPayment(e.target.value)} className="accent-primary" />
              <div>
                <p className="text-sm font-semibold">{method.label}</p>
                <p className="text-xs text-muted-foreground">{method.desc}</p>
              </div>
            </label>
          ))}
          <div className="flex gap-3 mt-4">
            <button onClick={() => setStep(1)} className="flex-1 h-12 rounded-2xl border border-border text-sm font-semibold">পিছনে</button>
            <button onClick={() => setStep(3)} className="flex-1 h-12 rounded-2xl bg-gradient-to-r from-primary to-magenta text-sm font-semibold text-white">পরবর্তী: কনফার্ম</button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-4">
          <div className="rounded-xl border border-border p-4">
            <h3 className="text-sm font-bold mb-2">শিপিং তথ্য</h3>
            <p className="text-xs text-muted-foreground">{shipping.name || 'নাম দেওয়া হয়নি'}, {shipping.phone || 'ফোন দেওয়া হয়নি'}</p>
            <p className="text-xs text-muted-foreground">{shipping.address || 'ঠিকানা দেওয়া হয়নি'}, {shipping.city}</p>
          </div>
          <div className="rounded-xl border border-border p-4">
            <h3 className="text-sm font-bold mb-2">অর্ডার সামারি</h3>
            {cart.items.map(item => (
              <div key={item.product_id} className="flex justify-between text-xs py-1">
                <span>{item.name} × {toBanglaNum(item.quantity)}</span>
                <span className="font-medium">{formatPrice((item.sale_price || item.price) * item.quantity)}</span>
              </div>
            ))}
            <div className="border-t border-border mt-2 pt-2 flex justify-between text-sm font-bold">
              <span>মোট</span><span>{formatPrice(cart.getTotal())}</span>
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={() => setStep(2)} className="flex-1 h-12 rounded-2xl border border-border text-sm font-semibold">পিছনে</button>
            <button onClick={handlePlaceOrder} className="flex-1 h-12 rounded-2xl bg-gradient-to-r from-primary to-magenta text-sm font-semibold text-white">অর্ডার কনফার্ম করুন</button>
          </div>
        </div>
      )}
    </div>
  );
}

// LOGIN PAGE
function LoginPage() {
  const auth = useAuthStore();
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    if (isSignUp) {
      const { error } = await auth.signUp(email, password, fullName);
      if (error) setError(error);
      else navigate('/');
    } else {
      const { error } = await auth.signIn(email, password);
      if (error) setError(error);
      else navigate(auth.isAdmin() ? '/admin' : '/');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-magenta text-white font-black text-xl mx-auto mb-4">M</div>
          <h1 className="text-2xl font-extrabold">{isSignUp ? 'অ্যাকাউন্ট খুলুন' : 'সাইন ইন'}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{isSignUp ? 'MUNMAYA-তে নতুন অ্যাকাউন্ট তৈরি করুন' : 'আপনার MUNMAYA অ্যাকাউন্টে লগইন করুন'}</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <div>
              <label className="text-sm font-medium">পুরো নাম</label>
              <input value={fullName} onChange={e => setFullName(e.target.value)} required
                className="mt-1 w-full px-4 py-2.5 rounded-xl border border-border bg-card text-sm outline-none focus:border-primary/50" placeholder="আপনার নাম" />
            </div>
          )}
          <div>
            <label className="text-sm font-medium">ইমেইল</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
              className="mt-1 w-full px-4 py-2.5 rounded-xl border border-border bg-card text-sm outline-none focus:border-primary/50" placeholder="email@example.com" />
          </div>
          <div>
            <label className="text-sm font-medium">পাসওয়ার্ড</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required
              className="mt-1 w-full px-4 py-2.5 rounded-xl border border-border bg-card text-sm outline-none focus:border-primary/50" placeholder="••••••••" />
          </div>
          {error && <p className="text-sm text-red-500 bg-red-50 rounded-xl p-3">{error}</p>}
          <button type="submit" disabled={loading} className="w-full h-12 rounded-2xl bg-gradient-to-r from-primary to-magenta text-sm font-semibold text-white disabled:opacity-50">
            {loading ? 'অপেক্ষা করুন...' : isSignUp ? 'সাইন আপ' : 'সাইন ইন'}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-muted-foreground">
          {isSignUp ? 'ইতিমধ্যে অ্যাকাউন্ট আছে?' : 'নতুন অ্যাকাউন্ট নেই?'}{' '}
          <button onClick={() => { setIsSignUp(!isSignUp); setError(''); }} className="text-primary font-semibold hover:underline">
            {isSignUp ? 'সাইন ইন' : 'সাইন আপ'}
          </button>
        </p>
      </div>
    </div>
  );
}

// PROFILE PAGE
function ProfilePage() {
  const auth = useAuthStore();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(auth.user?.full_name || '');
  const [phone, setPhone] = useState(auth.user?.phone || '');

  if (!auth.user) {
    return <div className="container mx-auto px-4 py-20 text-center"><p>লগইন করুন</p><Link to="/login" className="text-primary font-semibold">সাইন ইন</Link></div>;
  }

  const handleSave = async () => {
    await auth.updateProfile({ full_name: name, phone } as any);
    setEditing(false);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-2xl font-extrabold mb-6">আমার প্রোফাইল</h1>
      <div className="rounded-2xl border border-border bg-card p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-magenta flex items-center justify-center text-white text-xl font-bold">
            {(auth.user.full_name || auth.user.email)[0].toUpperCase()}
          </div>
          <div>
            <p className="text-lg font-bold">{auth.user.full_name || 'ব্যবহারকারী'}</p>
            <p className="text-sm text-muted-foreground">{auth.user.email}</p>
            <p className="text-xs text-primary font-medium mt-0.5">{auth.user.role === 'admin' ? 'অ্যাডমিন' : 'গ্রাহক'}</p>
          </div>
        </div>
        
        {editing ? (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">নাম</label>
              <input value={name} onChange={e => setName(e.target.value)} className="mt-1 w-full px-4 py-2.5 rounded-xl border border-border text-sm outline-none focus:border-primary/50" />
            </div>
            <div>
              <label className="text-sm font-medium">ফোন</label>
              <input value={phone} onChange={e => setPhone(e.target.value)} className="mt-1 w-full px-4 py-2.5 rounded-xl border border-border text-sm outline-none focus:border-primary/50" />
            </div>
            <div className="flex gap-3">
              <button onClick={handleSave} className="px-6 py-2 rounded-xl bg-primary text-white text-sm font-semibold">সেভ</button>
              <button onClick={() => setEditing(false)} className="px-6 py-2 rounded-xl border border-border text-sm font-semibold">বাতিল</button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-border">
              <span className="text-sm text-muted-foreground">নাম</span>
              <span className="text-sm font-medium">{auth.user.full_name || '-'}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-border">
              <span className="text-sm text-muted-foreground">ফোন</span>
              <span className="text-sm font-medium">{auth.user.phone || '-'}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-border">
              <span className="text-sm text-muted-foreground">রিওয়ার্ড পয়েন্ট</span>
              <span className="text-sm font-medium">{toBanglaNum(auth.user.reward_points)}</span>
            </div>
            <button onClick={() => setEditing(true)} className="mt-4 px-6 py-2 rounded-xl border border-primary text-primary text-sm font-semibold hover:bg-primary/5">এডিট করুন</button>
          </div>
        )}
      </div>

      <div className="mt-6 rounded-2xl border border-border bg-card p-6">
        <h2 className="text-lg font-bold mb-4">অর্ডার ইতিহাস</h2>
        <p className="text-sm text-muted-foreground text-center py-8">কোনো অর্ডার নেই।</p>
      </div>

      <button onClick={() => { auth.signOut(); }} className="mt-6 flex items-center gap-2 px-6 py-2 rounded-xl border border-red-300 text-red-600 text-sm font-semibold hover:bg-red-50">
        <LogOut className="size-4" /> সাইন আউট
      </button>
    </div>
  );
}

// ADMIN LAYOUT
function AdminLayout({ children }: { children: React.ReactNode }) {
  const auth = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!auth.loading && !auth.isAdmin()) {
      navigate('/');
    }
  }, [auth.loading, auth.user]);

  if (auth.loading) return <div className="min-h-screen flex items-center justify-center">লোড হচ্ছে...</div>;
  if (!auth.isAdmin()) return null;

  const links = [
    { to: '/admin', label: 'ড্যাশবোর্ড', icon: BarChart3 },
    { to: '/admin/products', label: 'পণ্য', icon: Package },
    { to: '/admin/orders', label: 'অর্ডার', icon: ShoppingCart },
    { to: '/admin/users', label: 'ব্যবহারকারী', icon: Users },
  ];

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 border-r border-border bg-card p-4 hidden lg:block">
        <Link to="/" className="flex items-center gap-2 mb-8">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-magenta text-white font-black text-xs">M</div>
          <span className="font-extrabold">MUNMAYA</span>
        </Link>
        <nav className="space-y-1">
          {links.map(link => (
            <Link key={link.to} to={link.to}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${location.pathname === link.to ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:text-foreground hover:bg-secondary'}`}>
              <link.icon className="size-4" /> {link.label}
            </Link>
          ))}
        </nav>
        <div className="mt-auto pt-8">
          <button onClick={() => { auth.signOut(); navigate('/'); }} className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 w-full">
            <LogOut className="size-4" /> সাইন আউট
          </button>
        </div>
      </aside>
      <main className="flex-1 p-6 overflow-auto">
        {children}
      </main>
    </div>
  );
}

// ADMIN DASHBOARD
function AdminDashboard() {
  return (
    <div>
      <h1 className="text-2xl font-extrabold mb-6">ড্যাশবোর্ড</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'মোট পণ্য', value: toBanglaNum(mockProducts.length), icon: Package, color: 'from-primary to-violet-600' },
          { label: 'মোট অর্ডার', value: toBanglaNum(0), icon: ShoppingCart, color: 'from-blue-500 to-cyan-600' },
          { label: 'ব্যবহারকারী', value: toBanglaNum(0), icon: Users, color: 'from-emerald-500 to-green-600' },
          { label: 'আয়', value: formatPrice(0), icon: BarChart3, color: 'from-amber-500 to-orange-600' },
        ].map((stat, i) => (
          <div key={i} className="rounded-2xl border border-border bg-card p-5">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-3`}>
              <stat.icon className="size-5 text-white" />
            </div>
            <p className="text-2xl font-black">{stat.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
          </div>
        ))}
      </div>
      <div className="mt-8 rounded-2xl border border-border bg-card p-6">
        <h2 className="text-lg font-bold mb-4">সাম্প্রতিক কার্যক্রম</h2>
        <p className="text-sm text-muted-foreground text-center py-8">কোনো কার্যক্রম নেই।</p>
      </div>
    </div>
  );
}

// ADMIN PRODUCTS
function AdminProducts() {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', price: '', sale_price: '', stock: '', category_id: '', description: '' });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-extrabold">পণ্য ম্যানেজমেন্ট</h1>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 h-10 rounded-xl bg-gradient-to-r from-primary to-magenta px-4 text-sm font-semibold text-white">
          <Plus className="size-4" /> নতুন পণ্য
        </button>
      </div>

      {showForm && (
        <div className="rounded-2xl border border-border bg-card p-6 mb-6">
          <h2 className="text-lg font-bold mb-4">নতুন পণ্য যোগ করুন</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-sm font-medium">পণ্যের নাম</label>
              <input value={form.name} onChange={e => setForm({...form, name: e.target.value})}
                className="mt-1 w-full px-4 py-2.5 rounded-xl border border-border text-sm outline-none focus:border-primary/50" />
            </div>
            <div>
              <label className="text-sm font-medium">দাম (৳)</label>
              <input type="number" value={form.price} onChange={e => setForm({...form, price: e.target.value})}
                className="mt-1 w-full px-4 py-2.5 rounded-xl border border-border text-sm outline-none focus:border-primary/50" />
            </div>
            <div>
              <label className="text-sm font-medium">সেল প্রাইস (৳)</label>
              <input type="number" value={form.sale_price} onChange={e => setForm({...form, sale_price: e.target.value})}
                className="mt-1 w-full px-4 py-2.5 rounded-xl border border-border text-sm outline-none focus:border-primary/50" />
            </div>
            <div>
              <label className="text-sm font-medium">স্টক</label>
              <input type="number" value={form.stock} onChange={e => setForm({...form, stock: e.target.value})}
                className="mt-1 w-full px-4 py-2.5 rounded-xl border border-border text-sm outline-none focus:border-primary/50" />
            </div>
            <div>
              <label className="text-sm font-medium">ক্যাটাগরি</label>
              <select value={form.category_id} onChange={e => setForm({...form, category_id: e.target.value})}
                className="mt-1 w-full px-4 py-2.5 rounded-xl border border-border text-sm outline-none focus:border-primary/50">
                <option value="">বেছে নিন</option>
                {mockCategories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">ছবি আপলোড</label>
              <input type="file" accept="image/*" className="mt-1 w-full text-sm" />
            </div>
            <div className="sm:col-span-2">
              <label className="text-sm font-medium">বিবরণ</label>
              <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})}
                className="mt-1 w-full px-4 py-2.5 rounded-xl border border-border text-sm outline-none focus:border-primary/50" rows={3} />
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <button className="px-6 py-2 rounded-xl bg-primary text-white text-sm font-semibold">সেভ করুন</button>
            <button onClick={() => setShowForm(false)} className="px-6 py-2 rounded-xl border border-border text-sm font-semibold">বাতিল</button>
          </div>
        </div>
      )}

      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-secondary">
            <tr>
              <th className="text-left p-3 font-semibold">পণ্য</th>
              <th className="text-left p-3 font-semibold hidden sm:table-cell">ক্যাটাগরি</th>
              <th className="text-left p-3 font-semibold">দাম</th>
              <th className="text-left p-3 font-semibold hidden sm:table-cell">স্টক</th>
              <th className="text-right p-3 font-semibold">অ্যাকশন</th>
            </tr>
          </thead>
          <tbody>
            {mockProducts.map(product => (
              <tr key={product.id} className="border-t border-border hover:bg-secondary/50">
                <td className="p-3">
                  <div className="flex items-center gap-3">
                    <img src={product.images[0]} alt="" className="w-10 h-10 rounded-lg object-cover" />
                    <span className="font-medium truncate max-w-[150px]">{product.name}</span>
                  </div>
                </td>
                <td className="p-3 hidden sm:table-cell text-muted-foreground">{mockCategories.find(c => c.id === product.category_id)?.name || '-'}</td>
                <td className="p-3 font-medium">{formatPrice(product.sale_price || product.price)}</td>
                <td className="p-3 hidden sm:table-cell">{toBanglaNum(product.stock_quantity)}</td>
                <td className="p-3 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button className="p-1.5 rounded-lg hover:bg-primary/10 text-primary"><Eye className="size-4" /></button>
                    <button className="p-1.5 rounded-lg hover:bg-primary/10 text-primary"><Edit className="size-4" /></button>
                    <button className="p-1.5 rounded-lg hover:bg-red-50 text-red-500"><Trash2 className="size-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ADMIN ORDERS
function AdminOrders() {
  const [orders] = useState<any[]>([]);

  return (
    <div>
      <h1 className="text-2xl font-extrabold mb-6">অর্ডার ম্যানেজমেন্ট</h1>
      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        {orders.length === 0 ? (
          <p className="text-center py-12 text-muted-foreground">কোনো অর্ডার নেই।</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-secondary">
              <tr>
                <th className="text-left p-3 font-semibold">অর্ডার নং</th>
                <th className="text-left p-3 font-semibold">গ্রাহক</th>
                <th className="text-left p-3 font-semibold">মোট</th>
                <th className="text-left p-3 font-semibold">স্ট্যাটাস</th>
                <th className="text-right p-3 font-semibold">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order: any) => (
                <tr key={order.id} className="border-t border-border">
                  <td className="p-3 font-medium">{order.order_number}</td>
                  <td className="p-3">{order.customer_name}</td>
                  <td className="p-3 font-medium">{formatPrice(order.total)}</td>
                  <td className="p-3">
                    <select className="px-2 py-1 rounded-lg border border-border text-xs">
                      <option value="pending">পেন্ডিং</option>
                      <option value="confirmed">কনফার্মড</option>
                      <option value="shipped">শিপড</option>
                      <option value="delivered">ডেলিভারড</option>
                      <option value="cancelled">ক্যান্সেলড</option>
                    </select>
                  </td>
                  <td className="p-3 text-right">
                    <button className="p-1.5 rounded-lg hover:bg-primary/10 text-primary"><Eye className="size-4" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

// ADMIN USERS
function AdminUsers() {
  return (
    <div>
      <h1 className="text-2xl font-extrabold mb-6">ব্যবহারকারী ম্যানেজমেন্ট</h1>
      <div className="rounded-2xl border border-border bg-card p-12 text-center">
        <Users className="size-12 mx-auto text-muted-foreground mb-4" />
        <p className="text-muted-foreground">কোনো ব্যবহারকারী নেই।</p>
      </div>
    </div>
  );
}

// SEARCH PAGE
function SearchPage() {
  const location = useLocation();
  const query = new URLSearchParams(location.search).get('q') || '';
  const results = mockProducts.filter(p =>
    p.name.toLowerCase().includes(query.toLowerCase()) ||
    p.tags.some(t => t.toLowerCase().includes(query.toLowerCase())) ||
    (p.description || '').toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-extrabold mb-2">সার্চ রেজাল্ট</h1>
      <p className="text-sm text-muted-foreground mb-6">"{query}" - {toBanglaNum(results.length)}টি ফলাফল পাওয়া গেছে</p>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
        {results.map(p => <ProductCard key={p.id} product={p} />)}
      </div>
      {results.length === 0 && (
        <p className="rounded-2xl border border-border bg-card p-8 text-center text-muted-foreground">কোনো পণ্য পাওয়া যায়নি।</p>
      )}
    </div>
  );
}

// FLASH DEALS PAGE
function FlashDealsPage() {
  const deals = mockProducts.filter(p => p.discount_expires_at && new Date(p.discount_expires_at) > new Date());
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="flex items-center gap-2 text-2xl font-extrabold mb-2">
        <Zap className="size-6 text-highlight" /> ফ্ল্যাশ ডিল
      </h1>
      <p className="text-sm text-muted-foreground mb-6">সীমিত সময়ের বিশেষ অফার</p>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
        {deals.map(p => <ProductCard key={p.id} product={p} />)}
      </div>
      {deals.length === 0 && (
        <p className="rounded-2xl border border-border bg-card p-8 text-center text-muted-foreground">এখন কোনো ফ্ল্যাশ ডিল চলছে না।</p>
      )}
    </div>
  );
}

// BRANDS PAGE
function BrandsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-extrabold mb-6">জনপ্রিয় ব্র্যান্ড</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {mockBrands.map(brand => (
          <div key={brand.id} className="flex items-center gap-4 rounded-2xl border border-border bg-card p-5 transition-all hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-glow">
            <span className={`grid size-14 place-items-center rounded-2xl text-lg font-black text-white bg-gradient-to-br ${brand.gradient}`}>{brand.initials}</span>
            <div>
              <h3 className="flex items-center gap-1.5 font-bold">{brand.name}<BadgeCheck className="size-4 text-primary" /></h3>
              <p className="text-xs text-muted-foreground">{brand.category}</p>
              <p className="mt-1 flex items-center gap-1 text-xs"><Star className="size-3.5 fill-highlight text-highlight" /><span className="font-medium">{toBanglaNum(brand.rating)}</span></p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============ MAIN APP ============
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout><AdminDashboard /></AdminLayout>} />
        <Route path="/admin/products" element={<AdminLayout><AdminProducts /></AdminLayout>} />
        <Route path="/admin/orders" element={<AdminLayout><AdminOrders /></AdminLayout>} />
        <Route path="/admin/users" element={<AdminLayout><AdminUsers /></AdminLayout>} />
        
        {/* Store Routes */}
        <Route path="/" element={<><Header /><main className="flex-1"><HomePage /></main><Footer /></>} />
        <Route path="/categories" element={<><Header /><main className="flex-1"><div className="container mx-auto px-4 py-8"><h1 className="text-2xl font-extrabold mb-6">সব ক্যাটাগরি</h1><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{mockCategories.map(cat => { const Icon = getCategoryIcon(cat.icon); return (<Link key={cat.id} to={`/category/${cat.slug}`} className="flex items-center gap-4 rounded-2xl border border-border bg-card p-5 hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-glow transition-all"><span className={`grid size-14 place-items-center rounded-2xl bg-gradient-to-br ${cat.gradient}`}><Icon className="size-6 text-white" /></span><span className="font-bold">{cat.name}</span></Link>); })}</div></div></main><Footer /></>} />
        <Route path="/category/:slug" element={<><Header /><main className="flex-1"><CategoryPage /></main><Footer /></>} />
        <Route path="/product/:slug" element={<><Header /><main className="flex-1"><ProductPage /></main><Footer /></>} />
        <Route path="/cart" element={<><Header /><main className="flex-1"><CartPage /></main><Footer /></>} />
        <Route path="/checkout" element={<><Header /><main className="flex-1"><CheckoutPage /></main><Footer /></>} />
        <Route path="/login" element={<><Header /><main className="flex-1"><LoginPage /></main><Footer /></>} />
        <Route path="/profile" element={<><Header /><main className="flex-1"><ProfilePage /></main><Footer /></>} />
        <Route path="/search" element={<><Header /><main className="flex-1"><SearchPage /></main><Footer /></>} />
        <Route path="/flash-deals" element={<><Header /><main className="flex-1"><FlashDealsPage /></main><Footer /></>} />
        <Route path="/brands" element={<><Header /><main className="flex-1"><BrandsPage /></main><Footer /></>} />
        <Route path="/products" element={<><Header /><main className="flex-1"><div className="container mx-auto px-4 py-8"><h1 className="text-2xl font-extrabold mb-6">সব পণ্য</h1><div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">{mockProducts.map(p => <ProductCard key={p.id} product={p} />)}</div></div></main><Footer /></>} />
      </Routes>
    </BrowserRouter>
  );
}
