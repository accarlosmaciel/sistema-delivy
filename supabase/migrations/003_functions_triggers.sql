-- ==============================================================================
-- DELIVY GOURMET & CRAFTS — MIGRATION 003: FUNCTIONS & TRIGGERS
-- Descrição: Triggers automáticos de auditoria, estoque e sincronização de perfis
-- Compatibilidade: Supabase PostgreSQL 15+
-- ==============================================================================

-- 1. Função genérica de atualização do campo updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers de updated_at
DROP TRIGGER IF EXISTS trg_restaurants_updated_at ON public.restaurants;
CREATE TRIGGER trg_restaurants_updated_at
    BEFORE UPDATE ON public.restaurants
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS trg_products_updated_at ON public.products;
CREATE TRIGGER trg_products_updated_at
    BEFORE UPDATE ON public.products
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS trg_profiles_updated_at ON public.profiles;
CREATE TRIGGER trg_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS trg_orders_updated_at ON public.orders;
CREATE TRIGGER trg_orders_updated_at
    BEFORE UPDATE ON public.orders
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ==============================================================================
-- 2. Trigger de sincronização de Novos Usuários do Supabase Auth para public.profiles
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.handle_new_auth_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (
        id, 
        email, 
        name, 
        phone, 
        role, 
        avatar,
        status
    )
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'name', NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
        NEW.raw_user_meta_data->>'phone',
        COALESCE(NEW.raw_user_meta_data->>'role', 'cliente'),
        NEW.raw_user_meta_data->>'avatar_url',
        'ativo'
    )
    ON CONFLICT (id) DO UPDATE
    SET 
        email = EXCLUDED.email,
        name = COALESCE(EXCLUDED.name, public.profiles.name),
        updated_at = now();
        
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_on_auth_user_created ON auth.users;
CREATE TRIGGER trg_on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_auth_user();

-- ==============================================================================
-- 3. Baixa Automática de Estoque ao Inserir Itens de Pedido
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.handle_order_item_stock()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.product_id IS NOT NULL THEN
        UPDATE public.products
        SET 
            stock = GREATEST(0, stock - NEW.quantity),
            is_available = CASE WHEN (stock - NEW.quantity) <= 0 THEN false ELSE is_available END,
            updated_at = now()
        WHERE id = NEW.product_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_order_items_stock_decrement ON public.order_items;
CREATE TRIGGER trg_order_items_stock_decrement
    AFTER INSERT ON public.order_items
    FOR EACH ROW EXECUTE FUNCTION public.handle_order_item_stock();

-- ==============================================================================
-- 4. Atualização Automática de Métricas de Clientes ao Realizar Pedido
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.handle_customer_metrics_on_order()
RETURNS TRIGGER AS $$
DECLARE
    v_profile_id UUID;
    v_new_count INT;
    v_new_spent NUMERIC(10,2);
BEGIN
    -- Se tiver customer_id associado
    IF NEW.customer_id IS NOT NULL THEN
        v_profile_id := NEW.customer_id;
    ELSE
        -- Tenta localizar por telefone
        SELECT id INTO v_profile_id 
        FROM public.profiles 
        WHERE phone = NEW.customer_phone 
        LIMIT 1;
    END IF;

    -- Se o perfil existir, atualiza contadores e tags
    IF v_profile_id IS NOT NULL THEN
        SELECT 
            orders_count + 1, 
            total_spent + NEW.grand_total 
        INTO v_new_count, v_new_spent
        FROM public.profiles
        WHERE id = v_profile_id;

        UPDATE public.profiles
        SET 
            orders_count = v_new_count,
            total_spent = v_new_spent,
            tag = CASE 
                WHEN v_new_count >= 4 THEN 'Cliente VIP ⭐'
                WHEN v_new_count > 1 THEN 'Recorrente'
                ELSE 'Novo'
            END,
            address = COALESCE(NEW.street || ', ' || NEW.number || ' - ' || NEW.neighborhood, address),
            updated_at = now()
        WHERE id = v_profile_id;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_order_customer_metrics ON public.orders;
CREATE TRIGGER trg_order_customer_metrics
    AFTER INSERT ON public.orders
    FOR EACH ROW EXECUTE FUNCTION public.handle_customer_metrics_on_order();

