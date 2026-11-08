import { createAdminClient } from '../lib/supabase/admin';
import type { Expense } from '../types';

export const financeService = {
  async getExpenses(): Promise<Expense[]> {
    const supabase = createAdminClient();
    try {
      const { data, error } = await supabase
        .from('expenses')
        .select('*')
        .order('date', { ascending: false });

      if (error || !data) return [];
      return data as Expense[];
    } catch {
      return [];
    }
  },

  async createExpense(payload: any): Promise<Expense> {
    const supabase = createAdminClient();
    const newExpense = {
      id: payload.id || `exp-${Date.now()}`,
      restaurant_id: 'a0000000-0000-0000-0000-000000000001',
      category: payload.category,
      description: payload.description,
      amount: payload.amount,
      payment_method: payload.paymentMethod || 'pix',
      status: payload.status || 'pago',
      date: payload.date || new Date().toISOString()
    };

    const { data, error } = await supabase.from('expenses').insert(newExpense).select().single();
    if (error) {
      throw new Error(`Erro ao lançar despesa: ${error.message}`);
    }
    return data as Expense;
  },

  async deleteExpense(id: string): Promise<void> {
    const supabase = createAdminClient();
    const { error } = await supabase.from('expenses').delete().eq('id', id);
    if (error) {
      throw new Error(`Erro ao excluir despesa: ${error.message}`);
    }
  },

  async getFinancialSummary(): Promise<any> {
    const supabase = createAdminClient();
    const { data: orders } = await supabase.from('orders').select('grand_total, subtotal, discount_amount, payment_method, status');
    const { data: expenses } = await supabase.from('expenses').select('amount');

    const completed = (orders || []).filter((o) => o.status !== 'cancelled');
    const totalRevenue = completed.reduce((sum, o) => sum + Number(o.grand_total || 0), 0);
    const totalDiscounts = completed.reduce((sum, o) => sum + Number(o.discount_amount || 0), 0);
    const totalExpenses = (expenses || []).reduce((sum, e) => sum + Number(e.amount || 0), 0);
    const netProfit = totalRevenue - totalExpenses;
    const margin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;

    return {
      totalRevenue,
      totalDiscounts,
      totalExpenses,
      netProfit,
      profitMargin: Number(margin.toFixed(1)),
      ordersCount: completed.length
    };
  }
};
