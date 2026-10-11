import { create } from 'zustand';
import { supabase } from '../lib/supabase';

interface WishlistStore {
  items: string[]; // product IDs
  loading: boolean;
  fetchWishlist: (userId: string) => Promise<void>;
  addToWishlist: (productId: string, userId: string) => Promise<void>;
  removeFromWishlist: (productId: string, userId: string) => Promise<void>;
  isInWishlist: (productId: string) => boolean;
}

export const useWishlistStore = create<WishlistStore>()((set, get) => ({
  items: [],
  loading: false,
  
  fetchWishlist: async (userId) => {
    set({ loading: true });
    const { data } = await supabase
      .from('wishlists')
      .select('product_id')
      .eq('user_id', userId);
    
    set({ 
      items: data?.map(w => w.product_id) || [],
      loading: false 
    });
  },
  
  addToWishlist: async (productId, userId) => {
    await supabase
      .from('wishlists')
      .insert({ user_id: userId, product_id: productId });
    
    set({ items: [...get().items, productId] });
  },
  
  removeFromWishlist: async (productId, userId) => {
    await supabase
      .from('wishlists')
      .delete()
      .eq('user_id', userId)
      .eq('product_id', productId);
    
    set({ items: get().items.filter(id => id !== productId) });
  },
  
  isInWishlist: (productId) => {
    return get().items.includes(productId);
  },
}));
