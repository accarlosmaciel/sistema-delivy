import { createAdminClient } from '../lib/supabase/admin';
import type { Profile } from '../types';

export const userService = {
  async getUsers(role?: string, search?: string): Promise<Profile[]> {
    const supabase = createAdminClient();
    try {
      let query = supabase.from('profiles').select('*').order('created_at', { ascending: false });

      if (role && role !== 'all') {
        query = query.eq('role', role);
      }

      if (search) {
        query = query.or(`name.ilike.%${search}%,phone.ilike.%${search}%,email.ilike.%${search}%`);
      }

      const { data, error } = await query;
      if (error || !data) return [];
      return data as Profile[];
    } catch {
      return [];
    }
  },

  async createUser(payload: any): Promise<Profile> {
    const supabase = createAdminClient();
    const id = payload.id || `u-${Date.now()}`;
    const newProfile = {
      id,
      name: payload.name,
      email: payload.email || null,
      phone: payload.phone || null,
      role: payload.role || 'cliente',
      status: payload.status || 'ativo',
      address: payload.address || null,
      notes: payload.notes || null,
      tag: payload.tag || 'Novo'
    };

    const { data, error } = await supabase.from('profiles').insert(newProfile).select().single();
    if (error) {
      throw new Error(`Erro ao cadastrar usuário: ${error.message}`);
    }
    return data as Profile;
  },

  async updateUser(id: string, updates: any): Promise<Profile> {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from('profiles')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Erro ao atualizar usuário: ${error.message}`);
    }
    return data as Profile;
  },

  async deleteUser(id: string): Promise<void> {
    const supabase = createAdminClient();
    const { error } = await supabase.from('profiles').delete().eq('id', id);
    if (error) {
      throw new Error(`Erro ao excluir usuário: ${error.message}`);
    }
  }
};
