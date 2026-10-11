import { useState, useEffect } from 'react';
import {
  Sparkles, HeartPulse, ShieldCheck, ArrowRight,
  LayoutGrid, Zap, Clock, Send, Star, BadgeCheck, Truck,
  RotateCcw, Headphones, ShoppingCart, Heart, Search, Menu, X, User, Wand2
} from 'lucide-react';

// ============ DATA ============
const categories = [
  { name: 'মুদি ও নিত্যপ্রয়োজনীয়', gradient: 'from-orange-500 to-amber-600' },
  { name: 'মাছ', gradient: 'from-blue-500 to-cyan-600' },
  { name: 'মাংস', gradient: 'from-red-500 to-rose-600' },
  { name: 'ফলমূল', gradient: 'from-yellow-500 to-orange-500' },
  { name: 'শাকসবজি', gradient: 'from-green-500 to-emerald-600' },
  { name: 'ফ্যাশন', gradient: 'from-purple-500 to-violet-600' },
  { name: 'ইলেকট্রনিক্স', gradient: 'from-indigo-500 to-blue-600' },
  { name: 'বাড়ি ও জীবনযাপন', gradient: 'from-teal-500 to-cyan-600' },
  { name: 'বিউটি ও পার্সোনাল কেয়ার', gradient: 'from-pink-500 to-rose-500' },
  { name: 'মা ও শিশু', gradient: 'from-fuchsia-500 to-pink-600' },
];

const products = [
  {
    id: '1',
    name: 'ক্যাসিও এফএক্স-৯৯১ইএস প্লাস বৈজ্ঞানিক ক্যালকুলেটর ২য় সংস্করণ',
    price: '৳৮০০',
    rating: 0,
    reviews: 0,
    image: 'https://uftlxymbifonhgpcuoyp.supabase.co/storage/v1/object/public/product-images/b77654ae-0851-4d72-935b-b72eb561d80c/1c407e7d-936f-4088-a312-4d13362fda04.jpg',
    freeDelivery: true,
  },
  {
    id: '2',
    name: 'সনি ব্রাভিয়া গুগল টিভি স্মার্ট এলইডি টিভি',
    price: '৳৫৫,০০০',
    rating: 0,
    reviews: 0,
    image: 'https://uftlxymbifonhgpcuoyp.supabase.co/storage/v1/object/public/product-images/b77654ae-0851-4d72-935b-b72eb561d80c/c5ee8008-5fe0-4dc8-9702-2d018c6f3626.jpg',
    freeDelivery: true,
  },
];

const brands = [
  { initials: 'NO', name: 'নর্থওয়েভ অডিও', category: 'অডিও', rating: '৪.৮', gradient: 'from-orange-500 to-amber-600' },
  { initials: 'VA', name: 'ভানট্রা টেক', category: 'ইলেকট্রনিক্স', rating: '৪.৭', gradient: 'from-red-500 to-rose-600' },
  { initials: 'SO', name: 'সোলেন ল্যাব', category: 'বিউটি', rating: '৪.৯', gradient: 'from-violet-500 to-purple-600' },
  { initials: 'FO', name: 'ফোল্ড অ্যান্ড ফিল্ড', category: 'ফ্যাশন', rating: '৪.৬', gradient: 'from-emerald-500 to-green-600' },
  { initials: 'KE', name: 'কেসেল গুডস', category: 'হোম', rating: '৪.৬', gradient: 'from-amber-600 to-yellow-700' },
  { initials: 'HA', name: 'হ্যালডেন স্টুডিও', category: 'লাইটিং', rating: '৪.৫', gradient: 'from-rose-500 to-pink-600' },
];

const sellers = [
  { initials: 'NO', name: 'নর্থওয়েভ অডিও', category: 'অডিও ও গ্যাজেট', rating: '৪.৮', orders: '১,২৮৪', gradient: 'from-orange-500 to-amber-600' },
  { initials: 'VA', name: 'ভানট্রা টেক', category: 'ইলেকট্রনিক্স', rating: '৪.৭', orders: '১,১৮৫', gradient: 'from-red-500 to-rose-600' },
  { initials: 'SO', name: 'সোলেন ল্যাব', category: 'বিউটি ও কেয়ার', rating: '৪.৯', orders: '৪,২৬০', gradient: 'from-violet-500 to-purple-600' },
  { initials: 'KE', name: 'কেসেল গুডস', category: 'হোম ও কিচেন', rating: '৪.৬', orders: '৯৪৭', gradient: 'from-amber-600 to-yellow-700' },
];

const popularQuestions = [
  '১০ হাজার টাকার মধ্যে ভালো স্মার্টফোন',
  'শীতের জন্য আরামদায়ক জ্যাকেট',
  'অফিসের জন্য হালকা ল্যাপটপ',
  'সেনসিটিভ স্কিনের জন্য ফেসওয়াশ',
  'বাচ্চাদের শিক্ষামূলক খেলনা',
  'ছোট রান্নাঘরের জন্য গ্যাজেট',
];

// ============ COMPONENTS ============

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-lg">
      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-magenta text-white font-black text-sm">
            M
          </div>
          <span className="text-lg font-extrabold tracking-tight">MUNMAYA</span>
        </div>
        
        <nav className="hidden md:flex items-center gap-6">
          <a href="#" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">হোম</a>
          <a href="#categories" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">ক্যাটাগরি</a>
          <a href="#flash-deals" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">ফ্ল্যাশ ডিল</a>
          <a href="#brands" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">ব্র্যান্ড</a>
        </nav>

        <div className="flex items-center gap-2">
          <button className="hidden sm:flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground hover:text-foreground transition-colors">
            <Search className="size-4" />
          </button>
          <button className="h-9 w-9 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground hover:text-foreground transition-colors hidden sm:flex">
            <ShoppingCart className="size-4" />
          </button>
          <button className="h-9 items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-primary to-magenta px-4 text-xs font-semibold text-white transition-opacity hover:opacity-90 hidden sm:flex">
            <User className="size-3.5" />
            সাইন ইন
          </button>
          <button 
            className="md:hidden h-9 w-9 flex items-center justify-center rounded-xl border border-border text-muted-foreground"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>
      
      {menuOpen && (
        <div className="md:hidden border-t border-border bg-background px-4 py-4 space-y-3">
          <a href="#" className="block text-sm font-medium text-foreground py-2">হোম</a>
          <a href="#categories" className="block text-sm font-medium text-foreground py-2">ক্যাটাগরি</a>
          <a href="#flash-deals" className="block text-sm font-medium text-foreground py-2">ফ্ল্যাশ ডিল</a>
          <a href="#brands" className="block text-sm font-medium text-foreground py-2">ব্র্যান্ড</a>
          <button className="w-full h-10 rounded-xl bg-gradient-to-r from-primary to-magenta text-sm font-semibold text-white">
            সাইন ইন
          </button>
        </div>
      )}
    </header>
  );
}

function HeroSection() {
  return (
    <section className="border-b border-border aurora">
      <div className="container mx-auto grid gap-8 px-4 py-10 lg:grid-cols-2 lg:items-center lg:py-16">
        <div className="min-w-0">
          <p className="mb-4 inline-flex max-w-full items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-xs font-medium text-foreground">
            <Sparkles className="size-3.5 shrink-0 text-magenta" />
            <span className="truncate">MUNMAYA AI শপিং অ্যাসিস্ট্যান্ট</span>
          </p>
          <h1 className="text-3xl font-black leading-tight tracking-tight sm:text-5xl">
            যা খুঁজছেন,{' '}
            <span className="text-gradient">AI বলে দেবে</span>
            <span className="block">কোথায় সেরা দামে পাবেন</span>
          </h1>
          <p className="mt-4 max-w-xl text-sm text-muted-foreground sm:text-lg">
            বাংলায় লিখুন বা বলুন — MUNMAYA AI আপনার বাজেট ও পছন্দ বুঝে সঠিক পণ্য, যাচাইকৃত বিক্রেতা আর সেরা অফার খুঁজে দেবে।
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <button className="inline-flex items-center justify-center gap-2 h-11 rounded-2xl px-8 bg-gradient-to-r from-primary to-magenta text-sm font-semibold text-white shadow-soft hover:shadow-glow transition-all duration-200">
              <Wand2 className="size-4" />
              AI অ্যাসিস্ট্যান্ট চালু করুন
            </button>
            <button className="inline-flex items-center justify-center gap-2 h-11 rounded-2xl px-8 border border-primary/25 bg-card text-primary text-sm font-semibold shadow-soft hover:border-primary/50 hover:bg-accent transition-all duration-200">
              ফ্ল্যাশ ডিল দেখুন
            </button>
          </div>
        </div>
        
        <div className="relative mx-auto w-full max-w-[240px] sm:max-w-sm">
          <div className="absolute inset-6 rounded-full bg-primary/30 blur-3xl" aria-hidden="true"></div>
          <div className="relative w-full aspect-square rounded-3xl bg-gradient-to-br from-primary/20 to-magenta/20 flex items-center justify-center">
            <div className="text-center p-6">
              <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-primary to-magenta flex items-center justify-center mb-4">
                <Sparkles className="size-12 text-white" />
              </div>
              <p className="text-sm font-bold text-foreground">MUNMAYA AI</p>
            </div>
          </div>
          <div className="relative -mt-3 rounded-2xl border border-border bg-card/80 p-3 text-center backdrop-blur sm:-mt-6 sm:p-4 sm:text-left">
            <p className="text-xs text-muted-foreground">MUNMAYA AI বলছে</p>
            <p className="mt-1 text-sm font-semibold">"আজকের ফ্ল্যাশ ডিলে ৪০% পর্যন্ত ছাড় চলছে — দেখে নিন?"</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function HealthShortcut() {
  return (
    <section className="container mx-auto flex justify-end px-4 py-3 sm:py-4">
      <a href="#" className="group inline-flex h-14 w-[150px] items-center gap-2.5 rounded-2xl border border-teal-300/70 bg-gradient-to-br from-teal-50 via-card to-emerald-50 px-3 shadow-[0_8px_22px_rgba(13,148,136,0.13)] transition-all hover:-translate-y-0.5 hover:border-teal-500 hover:shadow-[0_12px_28px_rgba(13,148,136,0.2)]">
        <span className="relative grid size-8 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-teal-700 to-emerald-500 text-white shadow-sm">
          <HeartPulse className="size-4" />
          <ShieldCheck className="absolute -bottom-1 -right-1 size-3 rounded-full bg-card p-0.5 text-teal-700" />
        </span>
        <span className="min-w-0 text-left leading-tight">
          <span className="block truncate text-[11px] font-black text-teal-950">MUNMAYA Health</span>
          <span className="mt-0.5 block text-[9px] font-semibold text-teal-700">২৪/৭ যত্ন</span>
        </span>
        <ArrowRight className="ml-auto size-3.5 shrink-0 text-teal-700 transition-transform group-hover:translate-x-0.5" />
      </a>
    </section>
  );
}

function CategoriesSection() {
  return (
    <section id="categories" className="container mx-auto px-4 py-8 sm:py-12">
      <div className="mb-5 grid grid-cols-[1fr_auto] items-end gap-4">
        <div className="min-w-0">
          <h2 className="text-lg font-extrabold tracking-tight sm:text-2xl">সব ক্যাটাগরি</h2>
          <p className="mt-1 text-xs text-muted-foreground sm:text-sm">আপনার প্রয়োজন অনুযায়ী ক্যাটাগরি বেছে নিন</p>
        </div>
        <button className="flex shrink-0 items-center gap-1 text-xs font-semibold text-primary hover:underline sm:text-sm">
          সব দেখুন <ArrowRight className="size-4" />
        </button>
      </div>
      <div className="-mx-4 flex snap-x gap-3 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-4 sm:gap-4 sm:overflow-visible sm:px-0 lg:grid-cols-5 xl:grid-cols-5">
        {categories.map((cat, i) => (
          <button
            key={i}
            className="group flex w-24 shrink-0 snap-start flex-col items-center gap-2 rounded-2xl border border-border bg-card p-3 transition-all hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-glow sm:w-auto sm:min-w-0"
          >
            <span className={`grid size-12 shrink-0 place-items-center rounded-xl bg-gradient-to-br ${cat.gradient}`}>
              <LayoutGrid className="size-5 text-white" />
            </span>
            <span className="w-full truncate text-center text-[11px] font-medium sm:text-xs">{cat.name}</span>
          </button>
        ))}
      </div>
    </section>
  );
}

function FlashDealsSection() {
  const [time, setTime] = useState({ hours: 5, minutes: 42, seconds: 2 });

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

  const toBangla = (n: number) => n.toString().padStart(2, '0').replace(/[0-9]/g, d => '০১২৩৪৫৬৭৮৯'[parseInt(d)]);

  return (
    <section id="flash-deals" className="border-y border-border bg-card/40">
      <div className="container mx-auto px-4 py-8 sm:py-12">
        <div className="mb-5 grid grid-cols-[1fr_auto] items-center gap-4">
          <div className="min-w-0">
            <h2 className="flex items-center gap-2 text-lg font-extrabold tracking-tight sm:text-2xl">
              <Zap className="size-5 shrink-0 text-highlight" />
              ফ্ল্যাশ ডিল
            </h2>
            <p className="mt-1 text-xs text-muted-foreground sm:text-sm">সীমিত সময়ের অফার — স্টক শেষ হওয়ার আগেই নিন</p>
          </div>
          <div className="flex shrink-0 items-center gap-3">
            <div className="flex items-center gap-1.5 text-sm font-bold">
              <Clock className="size-4 shrink-0 text-highlight" />
              <span className="rounded-md bg-secondary px-2 py-1 tabular-nums">{toBangla(time.hours)}</span>
              <span className="rounded-md bg-secondary px-2 py-1 tabular-nums">{toBangla(time.minutes)}</span>
              <span className="rounded-md bg-secondary px-2 py-1 tabular-nums">{toBangla(time.seconds)}</span>
            </div>
            <button className="hidden sm:inline-flex items-center justify-center gap-2 h-9 rounded-lg px-3.5 border border-primary/25 bg-card text-primary text-xs font-semibold shadow-soft hover:border-primary/50 hover:bg-accent transition-all">
              সব দেখুন <ArrowRight className="size-4" />
            </button>
          </div>
        </div>
        <p className="rounded-2xl border border-border bg-card p-6 text-center text-sm text-muted-foreground">
          ডাটাবেসে এখনো কোনো পণ্য যুক্ত করা হয়নি।
        </p>
      </div>
    </section>
  );
}

function AIAskSection() {
  const [query, setQuery] = useState('');

  return (
    <section className="container mx-auto px-4 py-8 sm:py-12">
      <div className="overflow-hidden rounded-3xl border border-border aurora p-5 sm:p-8">
        <div className="grid gap-6 lg:grid-cols-2 lg:items-center">
          <div className="min-w-0">
            <h2 className="text-xl font-extrabold tracking-tight sm:text-3xl">AI কে জিজ্ঞেস করুন</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              বাংলায় প্রশ্ন লিখুন — বাজেট, ব্র্যান্ড বা প্রয়োজন বললেই MUNMAYA AI মিলিয়ে দেবে সেরা পণ্য।
            </p>
            <form 
              className="mt-5 flex min-w-0 items-stretch gap-2 rounded-full border border-border bg-background/70 p-1.5 backdrop-blur focus-within:border-primary/60"
              onSubmit={(e) => e.preventDefault()}
            >
              <input
                className="min-w-0 flex-1 bg-transparent px-3 text-sm outline-none placeholder:text-muted-foreground"
                placeholder="যেমন: ২০ হাজার টাকার মধ্যে ভালো ফোন কোনটি?"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <button 
                type="submit"
                className="grid size-10 shrink-0 place-items-center rounded-full bg-gradient-to-r from-primary to-magenta text-white"
              >
                <Send className="size-4" />
              </button>
            </form>
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">জনপ্রিয় প্রশ্ন</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {popularQuestions.map((q, i) => (
                <button
                  key={i}
                  className="max-w-full break-words rounded-full border border-border bg-card/70 px-3 py-1.5 text-left text-xs text-foreground transition-colors hover:border-primary/60 hover:bg-primary/15"
                  onClick={() => setQuery(q)}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ProductCard({ product }: { product: typeof products[0] }) {
  const [wishlisted, setWishlisted] = useState(false);

  return (
    <article className="group relative flex min-w-0 flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-glow">
      <div className="relative block aspect-square w-full overflow-hidden bg-secondary">
        <img
          alt={product.name}
          src={product.image}
          className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
      </div>
      <button
        onClick={() => setWishlisted(!wishlisted)}
        className={`absolute right-2 top-2 grid size-8 place-items-center rounded-full border border-border bg-background/60 backdrop-blur transition-colors ${wishlisted ? 'text-red-500' : 'text-muted-foreground hover:text-red-500'}`}
      >
        <Heart className={`size-4 ${wishlisted ? 'fill-red-500' : ''}`} />
      </button>
      <div className="flex min-w-0 flex-1 flex-col gap-1.5 p-3">
        <h3 className="line-clamp-2 break-words text-sm font-semibold leading-snug text-foreground">
          {product.name}
        </h3>
        <div className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
          <Star className="size-3.5 shrink-0 fill-highlight text-highlight" />
          <span className="font-medium text-foreground">{product.rating.toFixed(1).replace(/[0-9]/g, (d: string) => '০১২৩৪৫৬৭৮৯'[parseInt(d)])}</span>
          <span>({product.reviews.toString().replace(/[0-9]/g, (d: string) => '০১২৩৪৫৬৭৮৯'[parseInt(d)])})</span>
        </div>
        <div className="mt-auto flex flex-wrap items-baseline gap-2 pt-1.5">
          <span className="text-base font-bold tracking-tight text-foreground">{product.price}</span>
        </div>
        {product.freeDelivery && (
          <p className="truncate text-[11px] text-muted-foreground">ফ্রি ডেলিভারি</p>
        )}
        <button className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-primary to-magenta px-3 py-2 text-xs font-semibold text-white transition-opacity hover:opacity-90">
          <ShoppingCart className="size-3.5 shrink-0" />
          <span className="truncate">কার্টে যোগ করুন</span>
        </button>
      </div>
    </article>
  );
}

function AISuggestedSection() {
  return (
    <section className="container mx-auto px-4 pb-8 sm:pb-12">
      <div className="mb-5 grid grid-cols-[1fr_auto] items-end gap-4">
        <div className="min-w-0">
          <h2 className="text-lg font-extrabold tracking-tight sm:text-2xl">AI সাজেস্টেড ফর ইউ</h2>
          <p className="mt-1 text-xs text-muted-foreground sm:text-sm">জনপ্রিয় সার্চ ও ট্রেন্ড অনুযায়ী বাছাই</p>
        </div>
        <button className="flex shrink-0 items-center gap-1 text-xs font-semibold text-primary hover:underline sm:text-sm">
          আরও দেখুন <ArrowRight className="size-4" />
        </button>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-6">
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}

function BrandsSection() {
  return (
    <section id="brands" className="border-t border-border bg-card/40">
      <div className="container mx-auto px-4 py-8 sm:py-12">
        <div className="mb-5 grid grid-cols-[1fr_auto] items-end gap-4">
          <div className="min-w-0">
            <h2 className="text-lg font-extrabold tracking-tight sm:text-2xl">জনপ্রিয় ব্র্যান্ড</h2>
            <p className="mt-1 text-xs text-muted-foreground sm:text-sm">MUNMAYA-তে থাকা ডেমো ব্র্যান্ড কালেকশন</p>
          </div>
          <button className="flex shrink-0 items-center gap-1 text-xs font-semibold text-primary hover:underline sm:text-sm">
            সব ব্র্যান্ড <ArrowRight className="size-4" />
          </button>
        </div>
        <div className="-mx-4 flex snap-x gap-3 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-3 sm:gap-4 sm:overflow-visible sm:px-0 lg:grid-cols-6">
          {brands.map((brand, i) => (
            <button
              key={i}
              className="flex w-40 shrink-0 snap-start flex-col items-center gap-2 rounded-2xl border border-border bg-card p-4 transition-all hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-glow sm:w-auto sm:min-w-0"
            >
              <span className={`grid size-12 shrink-0 place-items-center rounded-2xl text-sm font-black text-white bg-gradient-to-br ${brand.gradient}`}>
                {brand.initials}
              </span>
              <span className="flex w-full min-w-0 items-center justify-center gap-1 text-xs font-semibold">
                <span className="truncate">{brand.name}</span>
                <BadgeCheck className="size-3.5 shrink-0 text-primary" />
              </span>
              <span className="w-full truncate text-center text-[11px] text-muted-foreground">{brand.category}</span>
              <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                <Star className="size-3 shrink-0 fill-highlight text-highlight" />
                <span className="font-medium text-foreground">{brand.rating}</span>
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

function SellersSection() {
  return (
    <section className="container mx-auto px-4 py-8 sm:py-12">
      <div className="mb-5 grid grid-cols-[1fr_auto] items-end gap-4">
        <div className="min-w-0">
          <h2 className="text-lg font-extrabold tracking-tight sm:text-2xl">বিশ্বস্ত বিক্রেতা</h2>
          <p className="mt-1 text-xs text-muted-foreground sm:text-sm">যাচাইকৃত ডেমো বিক্রেতা ও তাদের রেটিং</p>
        </div>
        <button className="flex shrink-0 items-center gap-1 text-xs font-semibold text-primary hover:underline sm:text-sm">
          সব বিক্রেতা <ArrowRight className="size-4" />
        </button>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
        {sellers.map((seller, i) => (
          <article
            key={i}
            className="flex min-w-0 items-center gap-3 rounded-2xl border border-border bg-card p-4 transition-all hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-glow"
          >
            <span className={`grid size-12 shrink-0 place-items-center rounded-2xl text-sm font-black text-white bg-gradient-to-br ${seller.gradient}`}>
              {seller.initials}
            </span>
            <div className="min-w-0">
              <h3 className="flex min-w-0 items-center gap-1.5 truncate text-sm font-semibold">
                {seller.name}
                <BadgeCheck className="size-4 shrink-0 text-primary" />
              </h3>
              <p className="truncate text-xs text-muted-foreground">{seller.category}</p>
              <p className="mt-1 flex flex-wrap items-center gap-1 text-xs text-muted-foreground">
                <Star className="size-3.5 shrink-0 fill-highlight text-highlight" />
                <span className="font-medium text-foreground">{seller.rating}</span>
                <span>· {seller.orders}+ অর্ডার</span>
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function TrustBadges() {
  const badges = [
    { icon: ShieldCheck, title: '১০০% নিরাপদ পেমেন্ট', desc: 'এনক্রিপ্টেড ও সুরক্ষিত চেকআউট' },
    { icon: BadgeCheck, title: 'ভেরিফাইড বিক্রেতা', desc: 'যাচাই করা বিক্রেতার কাছ থেকে কিনুন' },
    { icon: Truck, title: 'দ্রুত ডেলিভারি', desc: 'সারা দেশে দ্রুত পৌঁছে যায়' },
    { icon: RotateCcw, title: 'সহজ রিটার্ন', desc: '৭ দিনের সহজ রিটার্ন সুবিধা' },
    { icon: Headphones, title: '২৪/৭ সাপোর্ট', desc: 'যেকোনো সময় বাংলায় সহায়তা' },
  ];

  return (
    <section className="border-t border-border bg-card/40">
      <div className="container mx-auto grid grid-cols-2 gap-4 px-4 py-10 sm:grid-cols-3 lg:grid-cols-5">
        {badges.map((badge, i) => (
          <div key={i} className="flex min-w-0 items-start gap-3 rounded-2xl border border-border bg-card p-4">
            <span className="grid size-10 shrink-0 place-items-center rounded-xl border border-border bg-secondary">
              <badge.icon className="size-4 text-primary" />
            </span>
            <div className="min-w-0">
              <p className="break-words text-xs font-semibold sm:text-sm">{badge.title}</p>
              <p className="mt-0.5 break-words text-[11px] text-muted-foreground sm:text-xs">{badge.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function SignUpCTA() {
  return (
    <section className="container mx-auto px-4 py-10">
      <div className="grid gap-5 rounded-3xl border border-border aurora p-6 sm:p-8 md:grid-cols-[1fr_auto] md:items-center">
        <div className="min-w-0">
          <h2 className="text-xl font-extrabold tracking-tight sm:text-2xl">MUNMAYA অ্যাকাউন্ট খুলুন</h2>
          <p className="mt-2 max-w-xl text-sm text-muted-foreground">
            অর্ডার ট্র্যাকিং, উইশলিস্ট আর ব্যক্তিগত AI রেকমেন্ডেশন পেতে সাইন আপ করুন।
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button className="inline-flex items-center justify-center gap-2 h-11 rounded-2xl px-8 bg-gradient-to-r from-primary to-magenta text-sm font-semibold text-white shadow-soft hover:shadow-glow transition-all duration-200">
            সাইন আপ
          </button>
          <button className="inline-flex items-center justify-center gap-2 h-11 rounded-2xl px-8 border border-primary/25 bg-card text-primary text-sm font-semibold shadow-soft hover:border-primary/50 hover:bg-accent transition-all duration-200">
            সাইন ইন
          </button>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border bg-card/60">
      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-magenta text-white font-black text-xs">
                M
              </div>
              <span className="text-base font-extrabold">MUNMAYA</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              AI চালিত অনলাইন মার্কেটপ্লেস। বাংলায় খুঁজুন, সেরা দামে পণ্য কিনুন।
            </p>
          </div>
          <div>
            <h4 className="text-sm font-bold mb-3">কোম্পানি</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors">আমাদের সম্পর্কে</a></li>
              <li><a href="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors">ক্যারিয়ার</a></li>
              <li><a href="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors">যোগাযোগ</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-bold mb-3">নীতিমালা</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors">প্রাইভেসি পলিসি</a></li>
              <li><a href="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors">টার্মস ও কন্ডিশনস</a></li>
              <li><a href="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors">রিটার্ন পলিসি</a></li>
              <li><a href="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors">সেলার পলিসি</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-bold mb-3">সাহায্য</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors">সহায়তা কেন্দ্র</a></li>
              <li><a href="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors">অর্ডার ট্র্যাকিং</a></li>
              <li><a href="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors">নিষিদ্ধ পণ্য তালিকা</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-border pt-6 text-center">
          <p className="text-xs text-muted-foreground">
            © ২০২৫ MUNMAYA। সর্বস্বত্ব সংরক্ষিত। support@munmaya.com
          </p>
        </div>
      </div>
    </footer>
  );
}

// ============ MAIN APP ============
export default function App() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <HealthShortcut />
        <CategoriesSection />
        <FlashDealsSection />
        <AIAskSection />
        <AISuggestedSection />
        <BrandsSection />
        <SellersSection />
        <TrustBadges />
        <SignUpCTA />
      </main>
      <Footer />
    </div>
  );
}
