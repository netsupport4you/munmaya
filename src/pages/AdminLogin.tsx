import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { Loader2, Lock, Mail, ArrowLeft, AlertCircle } from 'lucide-react';

export default function AdminLogin() {
  const navigate = useNavigate();
  const { user, loading, initialized, isAdmin, signIn } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && initialized && user && isAdmin()) {
      navigate('/admin', { replace: true });
    }
  }, [user, loading, initialized, isAdmin, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const { error } = await signIn(email, password);

    if (error) {
      setError(error);
      setSubmitting(false);
      return;
    }

    // Check if user is admin after sign in
    const { isAdmin: checkAdmin } = useAuthStore.getState();
    if (!checkAdmin()) {
      setError('আপনার অ্যাডমিন অ্যাক্সেস নেই। শুধুমাত্র অ্যাডমিনরা লগইন করতে পারবেন।');
      await useAuthStore.getState().signOut();
      setSubmitting(false);
      return;
    }

    navigate('/admin', { replace: true });
  };

  // Show loading while checking auth
  if (loading || !initialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="size-8 animate-spin text-primary mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">অপেক্ষা করুন...</p>
        </div>
      </div>
    );
  }

  // Already logged in as admin
  if (user && isAdmin()) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md">
        {/* Back link */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="size-4" />
          স্টোরফ্রন্টে ফিরে যান
        </Link>

        {/* Login card */}
        <div className="rounded-2xl border border-border bg-card p-8 shadow-soft">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-magenta text-white mb-4">
              <Lock className="size-8" />
            </div>
            <h1 className="text-2xl font-extrabold">অ্যাডমিন লগইন</h1>
            <p className="text-sm text-muted-foreground mt-2">
              MUNMAYA অ্যাডমিন প্যানেলে প্রবেশ করুন
            </p>
          </div>

          {/* Error message */}
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 flex items-start gap-3">
              <AlertCircle className="size-5 text-red-600 shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                ইমেইল
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="admin@munmaya.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-background text-sm outline-none focus:border-primary/50 transition-colors"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-2">
                পাসওয়ার্ড
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-background text-sm outline-none focus:border-primary/50 transition-colors"
                />
              </div>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full h-11 rounded-xl bg-gradient-to-r from-primary to-magenta text-sm font-semibold text-white disabled:opacity-50 hover:shadow-glow transition-all flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  লগইন হচ্ছে...
                </>
              ) : (
                'লগইন করুন'
              )}
            </button>
          </form>

          {/* Help text */}
          <div className="mt-6 p-4 rounded-xl bg-blue-50 border border-blue-200">
            <p className="text-xs text-blue-900 font-medium mb-1">অ্যাডমিন অ্যাক্সেস:</p>
            <p className="text-xs text-blue-700">
              শুধুমাত্র অ্যাডমিন রোল আছে এমন ব্যবহারকারীরা এই প্যানেলে প্রবেশ করতে পারবেন।
              প্রথম সাইন আপ করা ব্যবহারকারী স্বয়ংক্রিয়ভাবে অ্যাডমিন হবেন।
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
