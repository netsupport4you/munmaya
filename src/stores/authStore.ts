import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { Profile } from '../lib/types';

interface AuthStore {
  user: Profile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  fetchProfile: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<{ error: string | null }>;
  isAdmin: () => boolean;
}

export const useAuthStore = create<AuthStore>()((set, get) => ({
  user: null,
  loading: true,
  
  signIn: async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { error: error.message };
    await get().fetchProfile();
    return { error: null };
  },
  
  signUp: async (email, password, fullName) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
      },
    });
    if (error) return { error: error.message };
    await get().fetchProfile();
    return { error: null };
  },
  
  signOut: async () => {
    await supabase.auth.signOut();
    set({ user: null });
  },
  
  fetchProfile: async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      set({ user: null, loading: false });
      return;
    }
    
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();
    
    set({ user: profile, loading: false });
  },
  
  updateProfile: async (updates) => {
    const { user } = get();
    if (!user) return { error: 'Not authenticated' };
    
    const { error } = await supabase
      .from('profiles')
      .update(updates as any)
      .eq('id', user.id);
    
    if (error) return { error: error.message };
    
    await get().fetchProfile();
    return { error: null };
  },
  
  isAdmin: () => {
    return get().user?.role === 'admin';
  },
}));
