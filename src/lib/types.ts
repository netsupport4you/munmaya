// MUNMAYA Database Types

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          phone: string | null;
          avatar_url: string | null;
          role: 'customer' | 'admin';
          shipping_address: Record<string, any>;
          reward_points: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['profiles']['Row'], 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>;
      };
      categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          icon: string | null;
          gradient: string | null;
          sort_order: number;
          is_active: boolean;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['categories']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['categories']['Insert']>;
      };
      brands: {
        Row: {
          id: string;
          name: string;
          initials: string;
          category: string | null;
          rating: number;
          gradient: string | null;
          is_verified: boolean;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['brands']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['brands']['Insert']>;
      };
      sellers: {
        Row: {
          id: string;
          user_id: string | null;
          business_name: string;
          initials: string;
          category: string | null;
          rating: number;
          total_orders: number;
          gradient: string | null;
          is_verified: boolean;
          verification_docs: Record<string, any> | null;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['sellers']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['sellers']['Insert']>;
      };
      products: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          short_description: string | null;
          price: number;
          sale_price: number | null;
          stock_quantity: number;
          category_id: string | null;
          brand_id: string | null;
          seller_id: string | null;
          images: string[];
          tags: string[];
          specifications: Record<string, any>;
          is_featured: boolean;
          is_active: boolean;
          discount_expires_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['products']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['products']['Insert']>;
      };
      reviews: {
        Row: {
          id: string;
          product_id: string;
          user_id: string | null;
          rating: number;
          title: string | null;
          comment: string | null;
          is_verified_purchase: boolean;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['reviews']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['reviews']['Insert']>;
      };
      wishlists: {
        Row: {
          id: string;
          user_id: string;
          product_id: string;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['wishlists']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['wishlists']['Insert']>;
      };
      orders: {
        Row: {
          id: string;
          user_id: string | null;
          order_number: string;
          status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
          subtotal: number;
          discount: number;
          shipping_cost: number;
          total: number;
          payment_method: string | null;
          payment_status: 'unpaid' | 'paid' | 'refunded' | 'partial';
          shipping_address: Record<string, any>;
          notes: string | null;
          tracking_number: string | null;
          estimated_delivery: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['orders']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['orders']['Insert']>;
      };
      order_items: {
        Row: {
          id: string;
          order_id: string;
          product_id: string | null;
          product_name: string;
          product_image: string | null;
          quantity: number;
          unit_price: number;
          total_price: number;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['order_items']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['order_items']['Insert']>;
      };
      ai_chats: {
        Row: {
          id: string;
          user_id: string | null;
          query: string;
          response: Record<string, any>;
          products_found: number;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['ai_chats']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['ai_chats']['Insert']>;
      };
    };
    Functions: {
      get_flash_deals: {
        Args: Record<string, never>;
        Returns: Database['public']['Tables']['products']['Row'][];
      };
      search_products: {
        Args: {
          search_query: string;
          category_filter?: string;
          min_price?: number;
          max_price?: number;
          page_num?: number;
          page_size?: number;
        };
        Returns: {
          product_id: string;
          product_name: string;
          product_slug: string;
          product_price: number;
          product_sale_price: number;
          product_images: string[];
          product_rating: number;
          total_count: number;
        }[];
      };
      is_admin: {
        Args: Record<string, never>;
        Returns: boolean;
      };
    };
  };
}

// Helper types
export type Profile = Database['public']['Tables']['profiles']['Row'];
export type Category = Database['public']['Tables']['categories']['Row'];
export type Brand = Database['public']['Tables']['brands']['Row'];
export type Seller = Database['public']['Tables']['sellers']['Row'];
export type Product = Database['public']['Tables']['products']['Row'];
export type Review = Database['public']['Tables']['reviews']['Row'];
export type Wishlist = Database['public']['Tables']['wishlists']['Row'];
export type Order = Database['public']['Tables']['orders']['Row'];
export type OrderItem = Database['public']['Tables']['order_items']['Row'];
export type AIChat = Database['public']['Tables']['ai_chats']['Row'];

// Cart item type (not in DB, used in Zustand store)
export interface CartItem {
  product_id: string;
  name: string;
  price: number;
  sale_price: number | null;
  image: string;
  quantity: number;
  stock: number;
}
