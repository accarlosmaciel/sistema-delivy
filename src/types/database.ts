export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      restaurants: {
        Row: {
          id: string;
          name: string;
          tagline: string | null;
          rating: number;
          reviews_count: number;
          delivery_time: string;
          delivery_fee: number;
          free_delivery_min: number;
          status: string;
          opening_hours: string;
          address: string;
          phone: string;
          banner_image: string | null;
          logo_image: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          tagline?: string | null;
          rating?: number;
          reviews_count?: number;
          delivery_time?: string;
          delivery_fee?: number;
          free_delivery_min?: number;
          status?: string;
          opening_hours?: string;
          address: string;
          phone: string;
          banner_image?: string | null;
          logo_image?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          tagline?: string | null;
          rating?: number;
          reviews_count?: number;
          delivery_time?: string;
          delivery_fee?: number;
          free_delivery_min?: number;
          status?: string;
          opening_hours?: string;
          address?: string;
          phone?: string;
          banner_image?: string | null;
          logo_image?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      categories: {
        Row: {
          id: string;
          name: string;
          icon: string;
          color: string | null;
          badge: string | null;
          sort_order: number;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id: string;
          name: string;
          icon: string;
          color?: string | null;
          badge?: string | null;
          sort_order?: number;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          icon?: string;
          color?: string | null;
          badge?: string | null;
          sort_order?: number;
          is_active?: boolean;
          created_at?: string;
        };
      };
      products: {
        Row: {
          id: string;
          restaurant_id: string | null;
          category_id: string | null;
          name: string;
          description: string | null;
          price: number;
          original_price: number | null;
          stock: number;
          is_available: boolean;
          featured: boolean;
          badge: string | null;
          image: string;
          options: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          restaurant_id?: string | null;
          category_id?: string | null;
          name: string;
          description?: string | null;
          price: number;
          original_price?: number | null;
          stock?: number;
          is_available?: boolean;
          featured?: boolean;
          badge?: string | null;
          image: string;
          options?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          restaurant_id?: string | null;
          category_id?: string | null;
          name?: string;
          description?: string | null;
          price?: number;
          original_price?: number | null;
          stock?: number;
          is_available?: boolean;
          featured?: boolean;
          badge?: string | null;
          image?: string;
          options?: Json;
          created_at?: string;
          updated_at?: string;
        };
      };
      coupons: {
        Row: {
          code: string;
          description: string | null;
          discount_type: 'percent' | 'fixed' | 'freedelivery';
          discount_percent: number | null;
          discount_value: number | null;
          free_delivery: boolean;
          min_subtotal: number;
          is_active: boolean;
          expires_at: string | null;
          created_at: string;
        };
        Insert: {
          code: string;
          description?: string | null;
          discount_type: 'percent' | 'fixed' | 'freedelivery';
          discount_percent?: number | null;
          discount_value?: number | null;
          free_delivery?: boolean;
          min_subtotal?: number;
          is_active?: boolean;
          expires_at?: string | null;
          created_at?: string;
        };
        Update: {
          code?: string;
          description?: string | null;
          discount_type?: 'percent' | 'fixed' | 'freedelivery';
          discount_percent?: number | null;
          discount_value?: number | null;
          free_delivery?: boolean;
          min_subtotal?: number;
          is_active?: boolean;
          expires_at?: string | null;
          created_at?: string;
        };
      };
      profiles: {
        Row: {
          id: string;
          email: string | null;
          name: string;
          phone: string | null;
          role: 'superadmin' | 'admin' | 'kitchen' | 'cliente';
          status: 'ativo' | 'inativo' | 'bloqueado';
          avatar: string | null;
          notes: string | null;
          total_spent: number;
          orders_count: number;
          tag: string;
          address: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email?: string | null;
          name: string;
          phone?: string | null;
          role?: 'superadmin' | 'admin' | 'kitchen' | 'cliente';
          status?: 'ativo' | 'inativo' | 'bloqueado';
          avatar?: string | null;
          notes?: string | null;
          total_spent?: number;
          orders_count?: number;
          tag?: string;
          address?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string | null;
          name?: string;
          phone?: string | null;
          role?: 'superadmin' | 'admin' | 'kitchen' | 'cliente';
          status?: 'ativo' | 'inativo' | 'bloqueado';
          avatar?: string | null;
          notes?: string | null;
          total_spent?: number;
          orders_count?: number;
          tag?: string;
          address?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      orders: {
        Row: {
          id: string;
          restaurant_id: string | null;
          customer_id: string | null;
          customer_name: string;
          customer_phone: string;
          delivery_type: 'delivery' | 'pickup';
          street: string | null;
          number: string | null;
          neighborhood: string | null;
          complement: string | null;
          payment_method: 'pix' | 'card' | 'cash';
          change_for: string | null;
          subtotal: number;
          delivery_fee: number;
          discount_amount: number;
          pix_discount: number;
          grand_total: number;
          status: 'received' | 'preparing' | 'ready' | 'delivering' | 'completed' | 'cancelled';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          restaurant_id?: string | null;
          customer_id?: string | null;
          customer_name: string;
          customer_phone: string;
          delivery_type: 'delivery' | 'pickup';
          street?: string | null;
          number?: string | null;
          neighborhood?: string | null;
          complement?: string | null;
          payment_method: 'pix' | 'card' | 'cash';
          change_for?: string | null;
          subtotal: number;
          delivery_fee?: number;
          discount_amount?: number;
          pix_discount?: number;
          grand_total: number;
          status?: 'received' | 'preparing' | 'ready' | 'delivering' | 'completed' | 'cancelled';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          restaurant_id?: string | null;
          customer_id?: string | null;
          customer_name?: string;
          customer_phone?: string;
          delivery_type?: 'delivery' | 'pickup';
          street?: string | null;
          number?: string | null;
          neighborhood?: string | null;
          complement?: string | null;
          payment_method?: 'pix' | 'card' | 'cash';
          change_for?: string | null;
          subtotal?: number;
          delivery_fee?: number;
          discount_amount?: number;
          pix_discount?: number;
          grand_total?: number;
          status?: 'received' | 'preparing' | 'ready' | 'delivering' | 'completed' | 'cancelled';
          created_at?: string;
          updated_at?: string;
        };
      };
      order_items: {
        Row: {
          id: string;
          order_id: string;
          product_id: string | null;
          product_name: string;
          product_image: string | null;
          unit_price: number;
          quantity: number;
          selected_options: Json;
          notes: string | null;
          total_price: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          product_id?: string | null;
          product_name: string;
          product_image?: string | null;
          unit_price: number;
          quantity?: number;
          selected_options?: Json;
          notes?: string | null;
          total_price: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          order_id?: string;
          product_id?: string | null;
          product_name?: string;
          product_image?: string | null;
          unit_price?: number;
          quantity?: number;
          selected_options?: Json;
          notes?: string | null;
          total_price?: number;
          created_at?: string;
        };
      };
      expenses: {
        Row: {
          id: string;
          restaurant_id: string | null;
          category: string;
          description: string;
          amount: number;
          type: string;
          payment_method: string;
          status: string;
          date: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          restaurant_id?: string | null;
          category: string;
          description: string;
          amount: number;
          type?: string;
          payment_method?: string;
          status?: string;
          date?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          restaurant_id?: string | null;
          category?: string;
          description?: string;
          amount?: number;
          type?: string;
          payment_method?: string;
          status?: string;
          date?: string;
          created_at?: string;
        };
      };
    };
  };
}
