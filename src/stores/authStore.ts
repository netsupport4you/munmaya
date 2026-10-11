import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { Profile } from '../lib/types';

interface AuthStore {
  user: Profile | null;
  loading: boolean;
  initialized: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  fetchProfile: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<{ error: string | null }>;
  isAdmin: () => boolean;
  initialize: () => () => void;
}

export const useAuthStore = create<AuthStore>()((set, get) => ({
  user: null,
  loading: true,
  initialized: false,

  // Initialize auth state and listen for changes
  initialize: () => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        get().fetchProfile();
      } else {
        set({ user: null, loading: false, initialized: true });
      }
    });

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          await get().fetchProfile();
        } else if (event === 'SIGNED_OUT') {
          set({ user: null, loading: false, initialized: true });
        } else if (event === 'TOKEN_REFRESHED') {
          await get().fetchProfile();
        } else if (event === 'INITIAL_SESSION') {
          if (!session?.user) {
            set({ user: null, loading: false, initialized: true });
          }
        }
      }
    );

    // Return cleanup function
    return () => subscription.unsubscribe();
  },

  signIn: async (email, password) => {
    set({ loading: true });
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      set({ loading: false });
      return { error: error.message };
    }
    await get().fetchProfile();
    return { error: null };
  },

  signUp: async (email, password, fullName) => {
    set({ loading: true });
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
      },
    });
    if (error) {
      set({ loading: false });
      return { error: error.message };
    }
    await get().fetchProfile();
    return { error: null };
  },

  signOut: async () => {
    await supabase.auth.signOut();
    set({ user: null, loading: false });
  },

  fetchProfile: async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      set({ user: null, loading: false, initialized: true });
      return;
    }

    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error || !profile) {
      // Profile might not exist yet (trigger might not have fired)
      // Create it manually
      const { data: newProfile } = await supabase
        .from('profiles')
        .insert({
          id: user.id,
          email: user.email || '',
          full_name: user.user_metadata?.full_name || '',
          role: 'customer',
        })
        .select()
        .single();

      set({ user: newProfile, loading: false, initialized: true });
    } else {
      set({ user: profile, loading: false, initialized: true });
    }
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
