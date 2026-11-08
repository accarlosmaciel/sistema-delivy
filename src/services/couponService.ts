import { createAdminClient } from '../lib/supabase/admin';
import { PROMO_COUPONS as INITIAL_COUPONS } from '../data/products';
import type { Coupon } from '../types';

export const couponService = {
  async getCoupons(): Promise<Record<string, any>> {
    const supabase = createAdminClient();
    try {
      const { data, error } = await supabase.from('coupons').select('*').eq('is_active', true);
      if (error || !data || data.length === 0) {
        return INITIAL_COUPONS;
      }

      const map: Record<string, any> = {};
      data.forEach((c) => {
        map[c.code] = {
          code: c.code,
          description: c.description,
          discountPercent: c.discount_percent,
          discountValue: c.discount_value,
          freeDelivery: c.free_delivery,
          minSubtotal: c.min_subtotal
        };
      });
      return map;
    } catch {
      return INITIAL_COUPONS;
    }
  },

  async validateCoupon(code: string, subtotal: number): Promise<{ valid: boolean; message?: string; coupon?: any }> {
    const cleanCode = code.trim().toUpperCase();
    const allCoupons = await this.getCoupons();
    const coupon = allCoupons[cleanCode];

    if (!coupon) {
      return { valid: false, message: 'Cupom inválido ou inexistente.' };
    }

    if (coupon.minSubtotal && subtotal < coupon.minSubtotal) {
      return {
        valid: false,
        message: `Cupom válido apenas para pedidos acima de R$ ${Number(coupon.minSubtotal).toFixed(2).replace('.', ',')}`
      };
    }

    return { valid: true, coupon };
  },

  async createCoupon(payload: any): Promise<Coupon> {
    const supabase = createAdminClient();
    const cleanCode = payload.code.trim().toUpperCase();
    const newCoupon = {
      code: cleanCode,
      description: payload.description || null,
      discount_type: payload.discountType || 'percent',
      discount_percent: payload.discountPercent || null,
      discount_value: payload.discountValue || null,
      free_delivery: !!payload.freeDelivery,
      min_subtotal: payload.minSubtotal || 0,
      is_active: true
    };

    const { data, error } = await supabase.from('coupons').upsert(newCoupon).select().single();
    if (error) {
      throw new Error(`Erro ao cadastrar cupom: ${error.message}`);
    }
    return data as Coupon;
  },

  async deleteCoupon(code: string): Promise<void> {
    const supabase = createAdminClient();
    const cleanCode = code.trim().toUpperCase();
    const { error } = await supabase.from('coupons').delete().eq('code', cleanCode);
    if (error) {
      throw new Error(`Erro ao excluir cupom: ${error.message}`);
    }
  }
};
