-- ==============================================================================
-- DELIVY GOURMET & CRAFTS — MIGRATION 001: INITIAL SCHEMA
-- Descrição: Estrutura completa de tabelas relacionais, chaves e índices
-- Compatibilidade: Supabase PostgreSQL 15+
-- ==============================================================================

-- 1. Extensões essenciais
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. Tabela de Restaurantes (Multi-tenant ready com loja padrão)
CREATE TABLE IF NOT EXISTS public.restaurants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    tagline TEXT,
    rating NUMERIC(2,1) NOT NULL DEFAULT 4.9,
    reviews_count INT NOT NULL DEFAULT 1480,
    delivery_time TEXT NOT NULL DEFAULT '30 - 45 min',
    delivery_fee NUMERIC(10,2) NOT NULL DEFAULT 4.90,
    free_delivery_min NUMERIC(10,2) NOT NULL DEFAULT 70.00,
    status TEXT NOT NULL DEFAULT 'Aberto',
    opening_hours TEXT NOT NULL DEFAULT '18:00 às 23:30',
    address TEXT NOT NULL,
    phone TEXT NOT NULL,
    banner_image TEXT,
    logo_image TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. Tabela de Categorias
CREATE TABLE IF NOT EXISTS public.categories (
    id VARCHAR(50) PRIMARY KEY,
    name TEXT NOT NULL,
    icon VARCHAR(50) NOT NULL,
    color VARCHAR(30),
    badge VARCHAR(30),
    sort_order INT NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. Tabela de Produtos do Cardápio
CREATE TABLE IF NOT EXISTS public.products (
    id VARCHAR(50) PRIMARY KEY,
    restaurant_id UUID REFERENCES public.restaurants(id) ON DELETE CASCADE,
    category_id VARCHAR(50) REFERENCES public.categories(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    description TEXT,
    price NUMERIC(10,2) NOT NULL CHECK (price >= 0),
    original_price NUMERIC(10,2),
    stock INT NOT NULL DEFAULT 25 CHECK (stock >= 0),
    is_available BOOLEAN NOT NULL DEFAULT true,
    featured BOOLEAN NOT NULL DEFAULT false,
    badge TEXT,
    image TEXT NOT NULL,
    options JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 5. Tabela de Cupons de Desconto
CREATE TABLE IF NOT EXISTS public.coupons (
    code VARCHAR(30) PRIMARY KEY,
    description TEXT,
    discount_type VARCHAR(20) NOT NULL CHECK (discount_type IN ('percent', 'fixed', 'freedelivery')),
    discount_percent NUMERIC(5,2) CHECK (discount_percent >= 0 AND discount_percent <= 100),
    discount_value NUMERIC(10,2) CHECK (discount_value >= 0),
    free_delivery BOOLEAN NOT NULL DEFAULT false,
    min_subtotal NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    is_active BOOLEAN NOT NULL DEFAULT true,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 6. Tabela de Perfis de Usuário (Integrado com Supabase Auth)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE,
    name TEXT NOT NULL,
    phone TEXT,
    role VARCHAR(20) NOT NULL DEFAULT 'cliente' CHECK (role IN ('superadmin', 'admin', 'kitchen', 'cliente')),
    status VARCHAR(20) NOT NULL DEFAULT 'ativo' CHECK (status IN ('ativo', 'inativo', 'bloqueado')),
    avatar TEXT,
    notes TEXT,
    total_spent NUMERIC(10,2) NOT NULL DEFAULT 0.00 CHECK (total_spent >= 0),
    orders_count INT NOT NULL DEFAULT 0 CHECK (orders_count >= 0),
    tag VARCHAR(30) NOT NULL DEFAULT 'Novo',
    address TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 7. Tabela de Pedidos (Orders)
CREATE TABLE IF NOT EXISTS public.orders (
    id VARCHAR(30) PRIMARY KEY,
    restaurant_id UUID REFERENCES public.restaurants(id) ON DELETE SET NULL,
    customer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    delivery_type VARCHAR(20) NOT NULL CHECK (delivery_type IN ('delivery', 'pickup')),
    street TEXT,
    number TEXT,
    neighborhood TEXT,
    complement TEXT,
    payment_method VARCHAR(20) NOT NULL CHECK (payment_method IN ('pix', 'card', 'cash')),
    change_for TEXT,
    subtotal NUMERIC(10,2) NOT NULL CHECK (subtotal >= 0),
    delivery_fee NUMERIC(10,2) NOT NULL DEFAULT 0.00 CHECK (delivery_fee >= 0),
    discount_amount NUMERIC(10,2) NOT NULL DEFAULT 0.00 CHECK (discount_amount >= 0),
    pix_discount NUMERIC(10,2) NOT NULL DEFAULT 0.00 CHECK (pix_discount >= 0),
    grand_total NUMERIC(10,2) NOT NULL CHECK (grand_total >= 0),
    status VARCHAR(20) NOT NULL DEFAULT 'received' CHECK (status IN ('received', 'preparing', 'ready', 'delivering', 'completed', 'cancelled')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 8. Tabela de Itens do Pedido (Order Items)
CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id VARCHAR(30) NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id VARCHAR(50) REFERENCES public.products(id) ON DELETE SET NULL,
    product_name TEXT NOT NULL,
    product_image TEXT,
    unit_price NUMERIC(10,2) NOT NULL CHECK (unit_price >= 0),
    quantity INT NOT NULL DEFAULT 1 CHECK (quantity > 0),
    selected_options JSONB NOT NULL DEFAULT '{}'::jsonb,
    notes TEXT,
    total_price NUMERIC(10,2) NOT NULL CHECK (total_price >= 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 9. Tabela de Controle Financeiro / Despesas Operacionais
CREATE TABLE IF NOT EXISTS public.expenses (
    id VARCHAR(50) PRIMARY KEY DEFAULT ('exp-' || gen_random_uuid()),
    restaurant_id UUID REFERENCES public.restaurants(id) ON DELETE SET NULL,
    category VARCHAR(50) NOT NULL,
    description TEXT NOT NULL,
    amount NUMERIC(10,2) NOT NULL CHECK (amount > 0),
    type VARCHAR(20) NOT NULL DEFAULT 'despesa',
    payment_method VARCHAR(30) NOT NULL DEFAULT 'pix',
    status VARCHAR(20) NOT NULL DEFAULT 'pago',
    date TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 10. Tabela de Endereços Salvos dos Clientes
CREATE TABLE IF NOT EXISTS public.customer_addresses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    address TEXT NOT NULL,
    complement TEXT,
    is_default BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 11. Tabela de Banners do Carrossel Hero
CREATE TABLE IF NOT EXISTS public.banners (
    id VARCHAR(50) PRIMARY KEY,
    restaurant_id UUID REFERENCES public.restaurants(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    subtitle TEXT,
    price TEXT,
    currency TEXT,
    bg_gradient TEXT,
    secondary_bg TEXT,
    items_filter VARCHAR(50),
    image TEXT,
    food_photos JSONB,
    is_active BOOLEAN NOT NULL DEFAULT true,
    sort_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 12. Tabela de Marcas Famosas / Parceiros
CREATE TABLE IF NOT EXISTS public.famous_brands (
    id VARCHAR(50) PRIMARY KEY,
    name TEXT NOT NULL,
    short_name TEXT,
    is_ad BOOLEAN NOT NULL DEFAULT false,
    logo_bg VARCHAR(20),
    rating NUMERIC(2,1) NOT NULL DEFAULT 4.8,
    delivery_time TEXT,
    category TEXT,
    avatar_type VARCHAR(30),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ==============================================================================
-- ÍNDICES DE ALTA PERFORMANCE
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_restaurant ON public.products(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_products_available ON public.products(is_available);
CREATE INDEX IF NOT EXISTS idx_products_featured ON public.products(featured);

CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_customer_phone ON public.orders(customer_phone);
CREATE INDEX IF NOT EXISTS idx_orders_restaurant ON public.orders(restaurant_id);

CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON public.order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON public.order_items(product_id);

CREATE INDEX IF NOT EXISTS idx_expenses_date ON public.expenses(date DESC);
CREATE INDEX IF NOT EXISTS idx_expenses_category ON public.expenses(category);

CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_phone ON public.profiles(phone);

-- Habilitar Realtime para a tabela de pedidos (KDS e Cliente)
ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;

