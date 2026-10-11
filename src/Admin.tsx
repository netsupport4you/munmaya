import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2, Edit, Save, X, Package, Loader2, Image as ImageIcon } from 'lucide-react';
import { supabase } from './lib/supabase';

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  created_at: string;
}

export default function Admin() {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    image_url: '',
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error: fetchError } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) {
        console.error('Fetch error:', fetchError);
        setError('পণ্য লোড করতে সমস্যা হয়েছে: ' + fetchError.message);
        setProducts([]);
      } else {
        setProducts(data || []);
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      setError('অপ্রত্যাশিত সমস্যা হয়েছে');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(null);

    if (!form.name.trim() || !form.price) {
      setError('নাম এবং দাম আবশ্যক');
      setSubmitting(false);
      return;
    }

    const productData = {
      name: form.name.trim(),
      description: form.description.trim() || null,
      price: parseFloat(form.price),
      image_url: form.image_url.trim() || null,
    };

    try {
      if (editingId) {
        // Update existing product
        const { error: updateError } = await supabase
          .from('products')
          .update(productData)
          .eq('id', editingId);

        if (updateError) {
          setError('আপডেট করতে সমস্যা: ' + updateError.message);
        } else {
          setSuccess('পণ্য সফলভাবে আপডেট হয়েছে!');
          resetForm();
          await fetchProducts();
        }
      } else {
        // Insert new product
        const { error: insertError } = await supabase
          .from('products')
          .insert([productData]);

        if (insertError) {
          setError('যোগ করতে সমস্যা: ' + insertError.message);
        } else {
          setSuccess('নতুন পণ্য সফলভাবে যোগ হয়েছে!');
          resetForm();
          await fetchProducts();
        }
      }
    } catch (err) {
      setError('সার্ভার সমস্যা হয়েছে');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (product: Product) => {
    setForm({
      name: product.name,
      description: product.description || '',
      price: product.price.toString(),
      image_url: product.image_url || '',
    });
    setEditingId(product.id);
    setShowForm(true);
    setError(null);
    setSuccess(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('আপনি কি নিশ্চিত এই পণ্যটি মুছে ফেলতে চান?')) return;

    setError(null);
    setSuccess(null);

    const { error: deleteError } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (deleteError) {
      setError('মুছে ফেলতে সমস্যা: ' + deleteError.message);
    } else {
      setSuccess('পণ্য সফলভাবে মুছে ফেলা হয়েছে!');
      await fetchProducts();
    }
  };

  const resetForm = () => {
    setForm({ name: '', description: '', price: '', image_url: '' });
    setEditingId(null);
    setShowForm(false);
  };

  const formatPrice = (price: number): string => {
    return '৳' + price.toLocaleString('en-IN');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-lg">
        <div className="container mx-auto flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="size-4" />
              স্টোরফ্রন্ট
            </button>
            <div className="h-6 w-px bg-border"></div>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-magenta text-white font-black text-xs">
                M
              </div>
              <span className="font-extrabold">MUNMAYA</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-semibold">
                Admin
              </span>
            </div>
          </div>
          <button
            onClick={() => { setShowForm(true); setEditingId(null); setForm({ name: '', description: '', price: '', image_url: '' }); }}
            className="flex items-center gap-2 h-9 rounded-xl bg-gradient-to-r from-primary to-magenta px-4 text-xs font-semibold text-white hover:shadow-glow transition-all"
          >
            <Plus className="size-4" />
            নতুন পণ্য
          </button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Alerts */}
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-6 p-4 rounded-xl bg-green-50 border border-green-200 text-green-700 text-sm">
            {success}
          </div>
        )}

        {/* Add/Edit Form */}
        {showForm && (
          <div className="mb-8 rounded-2xl border border-border bg-card p-6 shadow-soft">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-extrabold">
                {editingId ? 'পণ্য এডিট করুন' : 'নতুন পণ্য যোগ করুন'}
              </h2>
              <button
                onClick={resetForm}
                className="p-2 rounded-lg hover:bg-secondary transition-colors"
              >
                <X className="size-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1.5 block">
                  পণ্যের নাম <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm outline-none focus:border-primary/50 transition-colors"
                  placeholder="যেমন: ক্যাসিও ক্যালকুলেটর"
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-1.5 block">বিবরণ</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm outline-none focus:border-primary/50 transition-colors resize-none"
                  placeholder="পণ্যের বিস্তারিত বিবরণ লিখুন..."
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1.5 block">
                    দাম (৳) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    required
                    min="0"
                    step="0.01"
                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm outline-none focus:border-primary/50 transition-colors"
                    placeholder="০.০০"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-1.5 block">ছবির URL</label>
                  <input
                    type="url"
                    value={form.image_url}
                    onChange={(e) => setForm({ ...form, image_url: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm outline-none focus:border-primary/50 transition-colors"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
              </div>

              {/* Image Preview */}
              {form.image_url && (
                <div className="rounded-xl border border-border overflow-hidden bg-secondary">
                  <img
                    src={form.image_url}
                    alt="Preview"
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex items-center gap-2 h-11 rounded-xl bg-gradient-to-r from-primary to-magenta px-6 text-sm font-semibold text-white disabled:opacity-50 hover:shadow-glow transition-all"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      {editingId ? 'আপডেট হচ্ছে...' : 'যোগ হচ্ছে...'}
                    </>
                  ) : (
                    <>
                      <Save className="size-4" />
                      {editingId ? 'আপডেট করুন' : 'সেভ করুন'}
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="h-11 rounded-xl border border-border px-6 text-sm font-semibold hover:bg-secondary transition-colors"
                >
                  বাতিল
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Products List */}
        <div className="rounded-2xl border border-border bg-card overflow-hidden">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <h2 className="text-lg font-extrabold flex items-center gap-2">
              <Package className="size-5 text-primary" />
              সব পণ্য ({products.length})
            </h2>
            <button
              onClick={fetchProducts}
              disabled={loading}
              className="text-xs font-semibold text-primary hover:underline disabled:opacity-50"
            >
              রিফ্রেশ
            </button>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <Loader2 className="size-8 animate-spin text-primary mb-3" />
              <p className="text-sm text-muted-foreground">পণ্য লোড হচ্ছে...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Package className="size-12 text-muted-foreground mb-3" />
              <p className="text-sm text-muted-foreground mb-4">কোনো পণ্য নেই</p>
              <button
                onClick={() => setShowForm(true)}
                className="flex items-center gap-2 h-9 rounded-xl bg-gradient-to-r from-primary to-magenta px-4 text-xs font-semibold text-white"
              >
                <Plus className="size-4" />
                প্রথম পণ্য যোগ করুন
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-secondary">
                  <tr>
                    <th className="text-left p-3 font-semibold">পণ্য</th>
                    <th className="text-left p-3 font-semibold hidden sm:table-cell">বিবরণ</th>
                    <th className="text-left p-3 font-semibold">দাম</th>
                    <th className="text-right p-3 font-semibold">অ্যাকশন</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.id} className="border-t border-border hover:bg-secondary/50 transition-colors">
                      <td className="p-3">
                        <div className="flex items-center gap-3">
                          {product.image_url ? (
                            <img
                              src={product.image_url}
                              alt={product.name}
                              className="w-12 h-12 rounded-lg object-cover bg-secondary"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"%3E%3Crect x="3" y="3" width="18" height="18" rx="2"/%3E%3Ccircle cx="8.5" cy="8.5" r="1.5"/%3E%3Cpath d="m21 15-5-5L5 21"/%3E%3C/svg%3E';
                              }}
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center">
                              <ImageIcon className="size-5 text-muted-foreground" />
                            </div>
                          )}
                          <span className="font-medium truncate max-w-[200px]">{product.name}</span>
                        </div>
                      </td>
                      <td className="p-3 hidden sm:table-cell">
                        <span className="text-muted-foreground truncate max-w-[300px] block">
                          {product.description || '-'}
                        </span>
                      </td>
                      <td className="p-3 font-semibold">{formatPrice(product.price)}</td>
                      <td className="p-3">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleEdit(product)}
                            className="p-2 rounded-lg hover:bg-primary/10 text-primary transition-colors"
                            title="এডিট"
                          >
                            <Edit className="size-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(product.id)}
                            className="p-2 rounded-lg hover:bg-red-50 text-red-500 transition-colors"
                            title="মুছুন"
                          >
                            <Trash2 className="size-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
