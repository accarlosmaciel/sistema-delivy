import { createAdminClient } from '../lib/supabase/admin';
import { productService } from './productService';
import { couponService } from './couponService';
import type { CreateOrderDTO } from '../types';

export const orderService = {
  async getOrders(filters?: { status?: string; limit?: number }): Promise<any[]> {
    const supabase = createAdminClient();
    try {
      let query = supabase
        .from('orders')
        .select(`
          *,
          items:order_items(*)
        `)
        .order('created_at', { ascending: false });

      if (filters?.status && filters.status !== 'all') {
        if (filters.status === 'active') {
          query = query.in('status', ['received', 'preparing', 'ready']);
        } else {
          query = query.eq('status', filters.status);
        }
      }

      if (filters?.limit) {
        query = query.limit(filters.limit);
      }

      const { data, error } = await query;
      if (error || !data) return [];

      return (data as any[]).map((o: any) => ({
        id: o.id,
        orderId: o.id,
        date: o.created_at,
        customer: {
          name: o.customer_name,
          phone: o.customer_phone,
          address: o.street ? `${o.street}, ${o.number} - ${o.neighborhood}${o.complement ? ` (${o.complement})` : ''}` : 'Retirada no Balcão',
          street: o.street,
          number: o.number,
          neighborhood: o.neighborhood,
          complement: o.complement,
          changeFor: o.change_for
        },
        deliveryType: o.delivery_type,
        paymentMethod: o.payment_method,
        subtotal: Number(o.subtotal),
        deliveryFee: Number(o.delivery_fee),
        discountAmount: Number(o.discount_amount),
        pixDiscount: Number(o.pix_discount),
        grandTotal: Number(o.grand_total),
        status: o.status,
        elapsedMinutes: Math.max(0, Math.floor((Date.now() - new Date(o.created_at).getTime()) / 60000)),
        items: (o.items || []).map((it: any) => ({
          id: it.id,
          product: { id: it.product_id, name: it.product_name, price: Number(it.unit_price) },
          name: it.product_name,
          quantity: it.quantity,
          options: it.selected_options,
          notes: it.notes,
          totalPrice: Number(it.total_price)
        }))
      }));
    } catch {
      return [];
    }
  },

  async getOrderById(id: string): Promise<any | null> {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        items:order_items(*)
      `)
      .eq('id', id)
      .single();

    if (error || !data) return null;
    const o = data as any;

    return {
      id: o.id,
      orderId: o.id,
      date: o.created_at,
      customer: {
        name: o.customer_name,
        phone: o.customer_phone,
        street: o.street,
        number: o.number,
        neighborhood: o.neighborhood,
        complement: o.complement,
        changeFor: o.change_for
      },
      deliveryType: o.delivery_type,
      paymentMethod: o.payment_method,
      subtotal: Number(o.subtotal),
      deliveryFee: Number(o.delivery_fee),
      discountAmount: Number(o.discount_amount),
      pixDiscount: Number(o.pix_discount),
      grandTotal: Number(o.grand_total),
      status: o.status,
      items: (o.items || []).map((it: any) => ({
        id: it.id,
        product: { id: it.product_id, name: it.product_name, price: Number(it.unit_price) },
        quantity: it.quantity,
        selectedOptions: it.selected_options,
        notes: it.notes,
        totalPrice: Number(it.total_price)
      }))
    };
  },

  async createOrder(dto: CreateOrderDTO): Promise<any> {
    const supabase = createAdminClient();

    // 1. Recalcular preços no servidor para segurança
    let subtotal = 0;
    const preparedItems = [];

    for (const item of dto.items) {
      const prod = await productService.getProductById(item.productId);
      if (!prod) {
        throw new Error(`Produto não encontrado: ${item.productId}`);
      }

      let unitPrice = Number(prod.price);

      if (item.selectedOptions) {
        Object.values(item.selectedOptions).forEach((val: any) => {
          if (Array.isArray(val)) {
            val.forEach((opt: any) => {
              if (opt && opt.price) unitPrice += Number(opt.price);
            });
          } else if (val && typeof val === 'object' && val.price) {
            unitPrice += Number(val.price);
          }
        });
      }

      const itemTotal = unitPrice * item.quantity;
      subtotal += itemTotal;

      preparedItems.push({
        product_id: prod.id,
        product_name: prod.name,
        product_image: prod.image,
        unit_price: unitPrice,
        quantity: item.quantity,
        selected_options: item.selectedOptions || {},
        notes: item.notes || null,
        total_price: itemTotal
      });
    }

    // 2. Taxa de entrega
    let deliveryFee = dto.deliveryType === 'pickup' ? 0 : (subtotal >= 70 ? 0 : 4.90);

    // 3. Validação de Cupom
    let discountAmount = 0;
    if (dto.couponCode) {
      const couponCheck = await couponService.validateCoupon(dto.couponCode, subtotal);
      if (couponCheck.valid && couponCheck.coupon) {
        const c = couponCheck.coupon;
        if (c.freeDelivery) {
          deliveryFee = 0;
        } else if (c.discountPercent) {
          discountAmount = (subtotal * Number(c.discountPercent)) / 100;
        } else if (c.discountValue) {
          discountAmount = Number(c.discountValue);
        }
      }
    }

    // 4. Desconto PIX
    let intermediateTotal = Math.max(0, subtotal + deliveryFee - discountAmount);
    let pixDiscount = dto.paymentMethod === 'pix' ? intermediateTotal * 0.05 : 0;
    let grandTotal = Math.max(0, intermediateTotal - pixDiscount);

    // 5. Inserir Pedido
    const orderId = `PED-${Math.floor(1000 + Math.random() * 9000)}`;

    const newOrderPayload: any = {
      id: orderId,
      restaurant_id: 'a0000000-0000-0000-0000-000000000001',
      customer_name: dto.customerName,
      customer_phone: dto.customerPhone,
      delivery_type: dto.deliveryType,
      street: dto.street || null,
      number: dto.number || null,
      neighborhood: dto.neighborhood || null,
      complement: dto.complement || null,
      payment_method: dto.paymentMethod,
      change_for: dto.changeFor || null,
      subtotal,
      delivery_fee: deliveryFee,
      discount_amount: discountAmount,
      pix_discount: pixDiscount,
      grand_total: grandTotal,
      status: 'received'
    };

    const { data: createdOrder, error: orderError } = await supabase
      .from('orders')
      .insert(newOrderPayload)
      .select()
      .single();

    if (orderError) {
      throw new Error(`Erro ao registrar pedido: ${orderError.message}`);
    }

    // 6. Inserir Itens do Pedido
    const itemsPayload = preparedItems.map((item) => ({
      order_id: orderId,
      ...item
    }));

    const { error: itemsError } = await supabase.from('order_items').insert(itemsPayload as any);
    if (itemsError) {
      console.error('Erro ao registrar itens do pedido:', itemsError);
    }

    return {
      ...(createdOrder as any || newOrderPayload),
      orderId,
      customer: {
        name: dto.customerName,
        phone: dto.customerPhone,
        street: dto.street,
        number: dto.number,
        neighborhood: dto.neighborhood,
        complement: dto.complement
      },
      items: preparedItems.map((it) => ({
        product: { id: it.product_id, name: it.product_name, price: it.unit_price },
        quantity: it.quantity,
        selectedOptions: it.selected_options,
        notes: it.notes,
        totalPrice: it.total_price
      }))
    };
  },

  async updateOrderStatus(id: string, status: string): Promise<void> {
    const supabase = createAdminClient();
    const { error } = await supabase
      .from('orders')
      .update({ status: status as any, updated_at: new Date().toISOString() } as any)
      .eq('id', id);

    if (error) {
      throw new Error(`Erro ao atualizar status: ${error.message}`);
    }
  }
};
