import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export default function ProtectedRoute({ children, requireAdmin = false }: ProtectedRouteProps) {
  const navigate = useNavigate();
  const { user, loading, initialized, isAdmin } = useAuthStore();

  useEffect(() => {
    if (!loading && initialized) {
      // Not authenticated
      if (!user) {
        navigate('/admin/login', { replace: true });
        return;
      }

      // Authenticated but not admin (if admin required)
      if (requireAdmin && !isAdmin()) {
        navigate('/', { replace: true });
        return;
      }
    }
  }, [user, loading, initialized, requireAdmin, navigate, isAdmin]);

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

  // Not authenticated
  if (!user) {
    return null; // Will redirect in useEffect
  }

  // Not admin (if admin required)
  if (requireAdmin && !isAdmin()) {
    return null; // Will redirect in useEffect
  }

  // Authenticated and has permission
  return <>{children}</>;
}
