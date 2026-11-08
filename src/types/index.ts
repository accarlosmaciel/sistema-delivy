import { z } from 'zod';
import type { Database } from './database';

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];
export type InsertTables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert'];
export type UpdateTables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update'];

export type Product = Tables<'products'>;
export type Order = Tables<'orders'>;
export type OrderItem = Tables<'order_items'>;
export type Category = Tables<'categories'>;
export type Coupon = Tables<'coupons'>;
export type Profile = Tables<'profiles'>;
export type Expense = Tables<'expenses'>;
export type Restaurant = Tables<'restaurants'>;

// Zod Schemas para Validação de Entrada (DTOs)

export const CreateOrderSchema = z.object({
  customerName: z.string().min(2, 'Nome deve ter no mínimo 2 caracteres'),
  customerPhone: z.string().min(8, 'Informe um WhatsApp válido'),
  deliveryType: z.enum(['delivery', 'pickup']),
  street: z.string().optional().nullable(),
  number: z.string().optional().nullable(),
  neighborhood: z.string().optional().nullable(),
  complement: z.string().optional().nullable(),
  paymentMethod: z.enum(['pix', 'card', 'cash']),
  changeFor: z.string().optional().nullable(),
  couponCode: z.string().optional().nullable(),
  items: z.array(z.object({
    productId: z.string(),
    quantity: z.number().int().positive('Quantidade deve ser maior que zero'),
    selectedOptions: z.record(z.string(), z.any()).optional().default({}),
    notes: z.string().max(300).optional().nullable()
  })).min(1, 'O pedido deve conter pelo menos 1 item')
});

export type CreateOrderDTO = z.infer<typeof CreateOrderSchema>;

export const UpdateOrderStatusSchema = z.object({
  status: z.enum(['received', 'preparing', 'ready', 'delivering', 'completed', 'cancelled'])
});

export const ValidateCouponSchema = z.object({
  code: z.string().min(1, 'Informe o código do cupom'),
  subtotal: z.number().min(0)
});

export const ProductSchema = z.object({
  name: z.string().min(2, 'Nome do produto obrigatório'),
  description: z.string().optional().nullable(),
  price: z.number().positive('Preço deve ser maior que zero'),
  originalPrice: z.number().positive().optional().nullable(),
  category: z.string().min(1, 'Categoria obrigatória'),
  stock: z.number().int().min(0).default(20),
  isAvailable: z.boolean().default(true),
  featured: z.boolean().default(false),
  badge: z.string().optional().nullable(),
  image: z.string().url('URL de imagem inválida').or(z.string().min(1)),
  options: z.any().optional().default([])
});

export const ExpenseSchema = z.object({
  category: z.string().min(1, 'Categoria obrigatória'),
  description: z.string().min(3, 'Descrição obrigatória'),
  amount: z.number().positive('Valor deve ser positivo'),
  paymentMethod: z.string().default('pix'),
  status: z.string().default('pago'),
  date: z.string().optional()
});

export const CouponSchema = z.object({
  code: z.string().min(2, 'Código do cupom deve ter pelo menos 2 caracteres'),
  description: z.string().optional().nullable(),
  discountType: z.enum(['percent', 'fixed', 'freedelivery']),
  discountPercent: z.number().min(0).max(100).optional().nullable(),
  discountValue: z.number().min(0).optional().nullable(),
  freeDelivery: z.boolean().default(false),
  minSubtotal: z.number().min(0).default(0)
});

export const AdminLoginSchema = z.object({
  email: z.string().email('E-mail em formato inválido'),
  password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres')
});

