import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://gjkckgjvhhdpxxzohyuu.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_fG8iWUF_TFPU7jvauobhNA_BYxZqBgy';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

export const STORAGE_BUCKETS = {
  PRODUCTS: 'product-images',
  AVATARS: 'avatars',
  SELLER_DOCS: 'seller-documents',
};
