-- ==============================================================================
-- DELIVY GOURMET & CRAFTS — MIGRATION 002: ROW LEVEL SECURITY (RLS) POLICIES
-- Descrição: Políticas de segurança e controle de acesso granular por role
-- Compatibilidade: Supabase PostgreSQL 15+
-- ==============================================================================

-- 1. Habilitar RLS em todas as tabelas públicas
ALTER TABLE public.restaurants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.famous_brands ENABLE ROW LEVEL SECURITY;

-- ==============================================================================
-- FUNÇÕES AUXILIARES DE CHECAGEM DE PERMISSÃO (SECURITY DEFINER)
-- ==============================================================================

-- Verifica se o usuário autenticado é admin ou superadmin
CREATE OR REPLACE FUNCTION public.is_admin_or_superadmin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid()
          AND role IN ('admin', 'superadmin')
          AND status = 'ativo'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Verifica se o usuário autenticado pertence à equipe de cozinha ou gestão
CREATE OR REPLACE FUNCTION public.is_kitchen_or_staff()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid()
          AND role IN ('kitchen', 'admin', 'superadmin')
          AND status = 'ativo'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==============================================================================
-- POLÍTICAS: RESTAURANTES, CATEGORIAS, BANNERS E MARCAS
-- Leitura pública para exibição do cardápio; Edição restrita a administradores
-- ==============================================================================

-- Restaurants
CREATE POLICY "Restaurantes são visíveis para todos"
    ON public.restaurants FOR SELECT
    USING (true);

CREATE POLICY "Apenas administradores podem atualizar dados do restaurante"
    ON public.restaurants FOR UPDATE
    TO authenticated
    USING (public.is_admin_or_superadmin())
    WITH CHECK (public.is_admin_or_superadmin());

-- Categories
CREATE POLICY "Categorias são visíveis publicamente"
    ON public.categories FOR SELECT
    USING (is_active = true OR public.is_admin_or_superadmin());

CREATE POLICY "Apenas administradores podem gerenciar categorias"
    ON public.categories FOR ALL
    TO authenticated
    USING (public.is_admin_or_superadmin())
    WITH CHECK (public.is_admin_or_superadmin());

-- Banners
CREATE POLICY "Banners são visíveis publicamente"
    ON public.banners FOR SELECT
    USING (is_active = true OR public.is_admin_or_superadmin());

CREATE POLICY "Apenas administradores podem gerenciar banners"
    ON public.banners FOR ALL
    TO authenticated
    USING (public.is_admin_or_superadmin())
    WITH CHECK (public.is_admin_or_superadmin());

-- Famous Brands
CREATE POLICY "Marcas parceiras são visíveis publicamente"
    ON public.famous_brands FOR SELECT
    USING (true);

CREATE POLICY "Apenas administradores podem gerenciar marcas parceiras"
    ON public.famous_brands FOR ALL
    TO authenticated
    USING (public.is_admin_or_superadmin())
    WITH CHECK (public.is_admin_or_superadmin());

-- ==============================================================================
-- POLÍTICAS: PRODUTOS E ESTOQUE
-- Cardápio aberto para clientes; Criação, edição e exclusão exclusivas do gestor
-- ==============================================================================

CREATE POLICY "Produtos disponíveis são visíveis publicamente"
    ON public.products FOR SELECT
    USING (is_available = true OR public.is_kitchen_or_staff());

CREATE POLICY "Apenas administradores podem criar produtos"
    ON public.products FOR INSERT
    TO authenticated
    WITH CHECK (public.is_admin_or_superadmin());

CREATE POLICY "Apenas administradores podem atualizar produtos"
    ON public.products FOR UPDATE
    TO authenticated
    USING (public.is_admin_or_superadmin())
    WITH CHECK (public.is_admin_or_superadmin());

CREATE POLICY "Apenas administradores podem excluir produtos"
    ON public.products FOR DELETE
    TO authenticated
    USING (public.is_admin_or_superadmin());

-- ==============================================================================
-- POLÍTICAS: CUPONS DE DESCONTO
-- Clientes podem consultar cupom no checkout; Gestores administram
-- ==============================================================================

CREATE POLICY "Cupons ativos são consultáveis"
    ON public.coupons FOR SELECT
    USING (is_active = true OR public.is_admin_or_superadmin());

CREATE POLICY "Apenas administradores podem criar cupons"
    ON public.coupons FOR INSERT
    TO authenticated
    WITH CHECK (public.is_admin_or_superadmin());

CREATE POLICY "Apenas administradores podem atualizar cupons"
    ON public.coupons FOR UPDATE
    TO authenticated
    USING (public.is_admin_or_superadmin())
    WITH CHECK (public.is_admin_or_superadmin());

CREATE POLICY "Apenas administradores podem excluir cupons"
    ON public.coupons FOR DELETE
    TO authenticated
    USING (public.is_admin_or_superadmin());

-- ==============================================================================
-- POLÍTICAS: PERFIS (PROFILES)
-- Proteção de dados de clientes e controle de acesso
-- ==============================================================================

CREATE POLICY "Usuários podem ver seu próprio perfil ou gestores podem ver todos"
    ON public.profiles FOR SELECT
    TO authenticated
    USING (id = auth.uid() OR public.is_admin_or_superadmin());

CREATE POLICY "Usuários podem atualizar seus próprios dados de perfil"
    ON public.profiles FOR UPDATE
    TO authenticated
    USING (id = auth.uid() OR public.is_admin_or_superadmin())
    WITH CHECK (id = auth.uid() OR public.is_admin_or_superadmin());

CREATE POLICY "Gestores podem criar e gerenciar perfis"
    ON public.profiles FOR ALL
    TO authenticated
    USING (public.is_admin_or_superadmin())
    WITH CHECK (public.is_admin_or_superadmin());

-- ==============================================================================
-- POLÍTICAS: PEDIDOS (ORDERS) E ITENS (ORDER_ITEMS)
-- Suporte ao Guest Checkout sem atrito + Visualização pelo KDS e Gestão
-- ==============================================================================

-- Criação de pedido permitida anonimamente (Guest Checkout) ou por cliente logado
CREATE POLICY "Qualquer pessoa pode criar pedidos no cardápio"
    ON public.orders FOR INSERT
    WITH CHECK (true);

-- Leitura de pedidos: Gestores/Cozinha veem todos; cliente vê se for dele ou via chave da API
CREATE POLICY "Equipe do restaurante pode ver todos os pedidos"
    ON public.orders FOR SELECT
    USING (
        public.is_kitchen_or_staff() 
        OR (auth.uid() IS NOT NULL AND customer_id = auth.uid())
        OR (customer_id IS NULL) -- Pedidos anônimos consultáveis pelo ID direto no backend
    );

-- Atualização de status do pedido: restrita à Cozinha e Gestão
CREATE POLICY "Apenas equipe de cozinha e gestores podem atualizar status de pedidos"
    ON public.orders FOR UPDATE
    TO authenticated
    USING (public.is_kitchen_or_staff())
    WITH CHECK (public.is_kitchen_or_staff());

-- Itens de Pedido (Order Items)
CREATE POLICY "Itens de pedido são inseríveis junto com o pedido"
    ON public.order_items FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Itens de pedido são visíveis para a equipe ou dono do pedido"
    ON public.order_items FOR SELECT
    USING (
        public.is_kitchen_or_staff() 
        OR EXISTS (
            SELECT 1 FROM public.orders o 
            WHERE o.id = order_items.order_id 
              AND (o.customer_id = auth.uid() OR public.is_kitchen_or_staff() OR o.customer_id IS NULL)
        )
    );

-- ==============================================================================
-- POLÍTICAS: CONTROLE FINANCEIRO / DESPESAS
-- Acesso restrito exclusivo a administradores
-- ==============================================================================

CREATE POLICY "Apenas administradores podem ver despesas financeiras"
    ON public.expenses FOR SELECT
    TO authenticated
    USING (public.is_admin_or_superadmin());

CREATE POLICY "Apenas administradores podem lançar despesas"
    ON public.expenses FOR INSERT
    TO authenticated
    WITH CHECK (public.is_admin_or_superadmin());

CREATE POLICY "Apenas administradores podem excluir despesas"
    ON public.expenses FOR DELETE
    TO authenticated
    USING (public.is_admin_or_superadmin());

-- ==============================================================================
-- POLÍTICAS: ENDEREÇOS SALVOS DOS CLIENTES
-- ==============================================================================

CREATE POLICY "Clientes podem gerenciar seus próprios endereços"
    ON public.customer_addresses FOR ALL
    TO authenticated
    USING (profile_id = auth.uid() OR public.is_admin_or_superadmin())
    WITH CHECK (profile_id = auth.uid() OR public.is_admin_or_superadmin());
