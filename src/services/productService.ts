import { createAdminClient } from '../lib/supabase/admin';
import { PRODUCTS as INITIAL_PRODUCTS } from '../data/products';
import type { Product } from '../types';

export const productService = {
  async getProducts(category?: string, search?: string): Promise<Product[]> {
    const supabase = createAdminClient();
    try {
      let query = supabase.from('products').select('*').order('created_at', { ascending: false });

      if (category && category !== 'all') {
        if (category === 'destaques') {
          query = query.eq('featured', true);
        } else {
          query = query.eq('category_id', category);
        }
      }

      if (search) {
        query = query.ilike('name', `%${search}%`);
      }

      const { data, error } = await query;

      if (error || !data || (data as any[]).length === 0) {
        let list = INITIAL_PRODUCTS.map((p) => ({
          id: p.id,
          restaurant_id: 'a0000000-0000-0000-0000-000000000001',
          category_id: p.category,
          name: p.name,
          description: p.description || null,
          price: p.price,
          original_price: p.originalPrice || null,
          stock: 25,
          is_available: true,
          featured: !!p.featured,
          badge: p.badge || null,
          image: p.image,
          options: (p.options || []) as any,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }));

        if (category && category !== 'all') {
          if (category === 'destaques') {
            list = list.filter((p) => p.featured);
          } else {
            list = list.filter((p) => p.category_id === category);
          }
        }

        if (search) {
          const s = search.toLowerCase();
          list = list.filter((p) => p.name.toLowerCase().includes(s) || (p.description && p.description.toLowerCase().includes(s)));
        }

        return list;
      }

      return data as Product[];
    } catch {
      return INITIAL_PRODUCTS as any;
    }
  },

  async getProductById(id: string): Promise<Product | null> {
    const supabase = createAdminClient();
    const { data, error } = await supabase.from('products').select('*').eq('id', id).single();
    if (error || !data) {
      const match = INITIAL_PRODUCTS.find((p) => p.id === id);
      return match ? (match as any) : null;
    }
    return data as Product;
  },

  async createProduct(payload: any): Promise<Product> {
    const supabase = createAdminClient();
    const id = payload.id || `prod-${Date.now()}`;
    const newProduct: any = {
      id,
      restaurant_id: payload.restaurant_id || 'a0000000-0000-0000-0000-000000000001',
      category_id: payload.category || payload.category_id,
      name: payload.name,
      description: payload.description || null,
      price: payload.price,
      original_price: payload.originalPrice || payload.original_price || null,
      stock: payload.stock !== undefined ? payload.stock : 25,
      is_available: payload.isAvailable !== undefined ? payload.isAvailable : true,
      featured: !!payload.featured,
      badge: payload.badge || null,
      image: payload.image,
      options: payload.options || []
    };

    const { data, error } = await supabase.from('products').insert(newProduct).select().single();
    if (error) {
      throw new Error(`Erro ao cadastrar produto: ${error.message}`);
    }
    return data as Product;
  },

  async updateProduct(id: string, updates: any): Promise<Product> {
    const supabase = createAdminClient();
    const cleanUpdates: any = { ...updates, updated_at: new Date().toISOString() };
    if (updates.category) cleanUpdates.category_id = updates.category;
    if (updates.isAvailable !== undefined) cleanUpdates.is_available = updates.isAvailable;
    if (updates.originalPrice !== undefined) cleanUpdates.original_price = updates.originalPrice;

    const { data, error } = await supabase.from('products').update(cleanUpdates).eq('id', id).select().single();
    if (error) {
      throw new Error(`Erro ao atualizar produto: ${error.message}`);
    }
    return data as Product;
  },

  async deleteProduct(id: string): Promise<void> {
    const supabase = createAdminClient();
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) {
      throw new Error(`Erro ao excluir produto: ${error.message}`);
    }
  }
};
