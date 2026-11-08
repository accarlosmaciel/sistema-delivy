-- ==============================================================================
-- DELIVY GOURMET & CRAFTS — SEED DATA (DADOS DE DEMONSTRAÇÃO)
-- Descrição: Popula o banco com os dados mockados do cardápio e gestão
-- Compatibilidade: Supabase SQL Editor / CLI
-- ==============================================================================

-- 1. Restaurante Principal Padrão
INSERT INTO public.restaurants (
    id, name, tagline, rating, reviews_count, delivery_time, delivery_fee, 
    free_delivery_min, status, opening_hours, address, phone, banner_image, logo_image
) VALUES (
    'a0000000-0000-0000-0000-000000000001',
    'Delivy Gourmet & Crafts',
    'Os melhores hambúrgueres artesanais e pizzas da cidade',
    4.9,
    1480,
    '30 - 45 min',
    4.90,
    70.00,
    'Aberto',
    '18:00 às 23:30',
    'Av. Paulista, 1500 - Bela Vista, São Paulo',
    '(11) 99876-5432',
    'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=300&q=80'
) ON CONFLICT (id) DO NOTHING;

-- 2. Categorias do Cardápio
INSERT INTO public.categories (id, name, icon, color, badge, sort_order, is_active) VALUES
('all', 'Todos', 'Sparkles', '#f5f5f5', NULL, 0, true),
('destaques', 'Mais Pedidos', 'Flame', '#fee2e2', 'Em Alta', 1, true),
('burgers', 'Hambúrguer', 'Hamburger', '#ffefe5', NULL, 2, true),
('pizzas', 'Pizza', 'Pizza', '#fff3e0', NULL, 3, true),
('esfihas', 'Esfiha', 'Utensils', '#ffebee', 'A partir R$ 0,90', 4, true),
('refrigerante', 'Refrigerante', 'CupSoda', '#e3f2fd', NULL, 5, true),
('milkshake', 'Milkshake', 'IceCream', '#ede7f6', 'Novo', 6, true),
('soda_artesanal', 'Soda Artesanal', 'GlassWater', '#e0f2fe', 'Refrescante', 7, true),
('porcoes', 'Porções', 'UtensilsCrossed', '#fef3c7', NULL, 8, true),
('sobremesas', 'Sobremesas', 'CakeSlice', '#fce4ec', NULL, 9, true),
('combos', 'Combos', 'Tag', '#ffebee', 'Ofertas', 10, true)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, icon = EXCLUDED.icon;

-- 3. Banners Promocionais do Carrossel Hero
INSERT INTO public.banners (
    id, restaurant_id, title, subtitle, price, currency, bg_gradient, secondary_bg, items_filter, image, food_photos, is_active, sort_order
) VALUES
(
    'esfihas-090',
    'a0000000-0000-0000-0000-000000000001',
    'tudo',
    'a partir de',
    '0,90',
    'R$',
    'linear-gradient(135deg, #ff5722 0%, #ff8f00 100%)',
    '#ff7043',
    'esfihas',
    'https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?auto=format&fit=crop&w=600&q=80',
    '[{"src": "https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?auto=format&fit=crop&w=400&q=80", "alt": "Esfiha aberta de carne artesanal"}, {"src": "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=400&q=80", "alt": "Esfiha aberta de queijo e orégano"}]'::jsonb,
    true,
    1
),
(
    'burger-promo',
    'a0000000-0000-0000-0000-000000000001',
    'burgers',
    'com até 30% OFF',
    '24,90',
    'a partir de R$',
    'linear-gradient(135deg, #ea1d2c 0%, #ff5252 100%)',
    '#ff1744',
    'burgers',
    'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80',
    '[{"src": "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=400&q=80", "alt": "Hambúrguer artesanal suculento"}]'::jsonb,
    true,
    2
),
(
    'frete-gratis',
    'a0000000-0000-0000-0000-000000000001',
    'entrega grátis',
    'em toda a cidade',
    '0,00',
    'taxa R$',
    'linear-gradient(135deg, #059669 0%, #10b981 100%)',
    '#34d399',
    'all',
    'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?auto=format&fit=crop&w=600&q=80',
    '[{"src": "https://images.unsplash.com/photo-1604382355076-af4b0eb60143?auto=format&fit=crop&w=400&q=80", "alt": "Pizza artesanal forno a lenha"}]'::jsonb,
    true,
    3
)
ON CONFLICT (id) DO NOTHING;

-- 4. Marcas Parceiras
INSERT INTO public.famous_brands (id, name, short_name, is_ad, logo_bg, rating, delivery_time, category, avatar_type) VALUES
('iloveacai', 'I Love Açaí 24h', 'I Love Açaí', true, '#fff000', 4.8, '25-35 min', 'Açaí & Gelatos', 'acai'),
('portela', 'Portela Bolos e Doces - Centro', 'Portela Bolos', true, '#1c140d', 4.9, '30-40 min', 'Confeitaria & Bolos', 'portela'),
('ilovesalgados', 'I Love Salgados 24h', 'I Love Salgados', false, '#ffffff', 4.7, '20-30 min', 'Salgados & Lanches', 'salgados'),
('duogelatto', 'Duo Gelatto Açaí - Mangabeiras', 'Duo Gelatto Açai', false, '#1e1b4b', 4.9, '35-45 min', 'Gelato Artesanal', 'gelatto'),
('delivygourmet', 'Delivy Gourmet Burgers', 'Delivy Burgers', false, '#ea580c', 5.0, '25-35 min', 'Hambúrgueres Artesanais', 'delivy')
ON CONFLICT (id) DO NOTHING;

-- 5. Catálogo de Produtos
INSERT INTO public.products (
    id, restaurant_id, category_id, name, description, price, original_price, stock, is_available, featured, badge, image, options
) VALUES
(
    'e1',
    'a0000000-0000-0000-0000-000000000001',
    'esfihas',
    'Esfiha Aberta de Carne Delivy',
    'Massa fininha e leve, recheada com carne moída selecionada temperada com limão, tomate, cebola e especiarias árabes autênticas.',
    0.90,
    3.50,
    50,
    true,
    true,
    'A Partir de R$ 0,90',
    'https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?auto=format&fit=crop&w=800&q=80',
    '[{"title": "Deseja Limão Extra?", "required": false, "items": [{"name": "Sim, fatias de limão taiti", "price": 0}]}]'::jsonb
),
(
    'e2',
    'a0000000-0000-0000-0000-000000000001',
    'esfihas',
    'Esfiha Aberta de Queijo & Orégano',
    'Generoso recheio de blend de queijos derretidos com orégano chileno e azeite de oliva, massa crocante e douradinha.',
    1.90,
    4.00,
    45,
    true,
    true,
    'Super Promoção',
    'https://images.unsplash.com/photo-1594007654729-407eedc4be65?auto=format&fit=crop&w=800&q=80',
    '[]'::jsonb
),
(
    'e3',
    'a0000000-0000-0000-0000-000000000001',
    'esfihas',
    'Esfiha de Frango com Catupiry',
    'Frango desfiado suculento temperado com ervas finas, coberto com o autêntico Catupiry Original gratinado.',
    2.50,
    4.50,
    30,
    true,
    true,
    'Campeã de Vendas',
    'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80',
    '[]'::jsonb
),
(
    'b1',
    'a0000000-0000-0000-0000-000000000001',
    'burgers',
    'Delivy Monster Bacon',
    'Pão brioche tostado na manteiga, 2x blends de Angus 160g, queijo cheddar inglês derretido, tiras de bacon crocante e maionese defumada.',
    38.90,
    45.90,
    25,
    true,
    true,
    'Mais Pedido',
    'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80',
    '[
        {"title": "Ponto da Carne", "required": true, "items": ["Ao Ponto (suculenta)", "Bem Passado", "Ao Ponto para Menos (vermelhinha)"]},
        {"title": "Adicionais Extras", "multiple": true, "items": [{"name": "Bacon Crocante Extra", "price": 5.50}, {"name": "Maionese Verde da Casa (50ml)", "price": 3.50}, {"name": "Cebola Caramelizada", "price": 4.00}]}
    ]'::jsonb
),
(
    'b2',
    'a0000000-0000-0000-0000-000000000001',
    'burgers',
    'Smash Cheddar Melt Duplo',
    '2x ultra smash burgers prensados com crostinha crocante, triplo cheddar cremoso, cebola caramelizada no shoyu e molho especial no pão australiano.',
    32.90,
    NULL,
    20,
    true,
    true,
    'Novo',
    'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=800&q=80',
    '[
        {"title": "Adicionais", "multiple": true, "items": [{"name": "Hambúrguer Smash Extra (80g)", "price": 7.00}, {"name": "Picles Artesanal", "price": 2.50}]}
    ]'::jsonb
),
(
    'p1',
    'a0000000-0000-0000-0000-000000000001',
    'pizzas',
    'Pizza Margherita Especial DOC',
    'Molho de tomate pelado italiano San Marzano, mozzarella de búfala fresca, parmesão ralado na hora, folhas de manjericão gigante e azeite trufado.',
    62.00,
    69.00,
    15,
    true,
    true,
    'Forno a Lenha',
    'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?auto=format&fit=crop&w=800&q=80',
    '[
        {"title": "Borda Recheada", "required": false, "items": [{"name": "Sem Borda Recheada", "price": 0}, {"name": "Borda Catupiry Original (+R$ 12.00)", "price": 12.00}, {"name": "Borda Cheddar Cremoso (+R$ 10.00)", "price": 10.00}]}
    ]'::jsonb
),
(
    'beb1',
    'a0000000-0000-0000-0000-000000000001',
    'soda_artesanal',
    'Soda Italiana de Frutas Vermelhas',
    'Xarope natural de amora, framboesa e morango, água gaseificada premium, gelo cristal e folhas de hortelã fresca.',
    14.90,
    NULL,
    30,
    true,
    false,
    '',
    'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80',
    '[]'::jsonb
),
(
    's1',
    'a0000000-0000-0000-0000-000000000001',
    'sobremesas',
    'Brownie Supremo com Gelato de Baunilha',
    'Brownie morno de chocolate belga 70%, servido com uma bola de gelato artesanal de baunilha de Madagascar e calda quente de chocolate.',
    24.90,
    NULL,
    20,
    true,
    true,
    'Sobremesa do Chef',
    'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80',
    '[]'::jsonb
),
(
    'c1',
    'a0000000-0000-0000-0000-000000000001',
    'combos',
    'Combo Casal Gourmet',
    '2x Delivy Monster Bacon + 1x Batata Crinkle G + 2x Bebidas à escolha. Economize R$ 16,10!',
    89.90,
    106.00,
    18,
    true,
    true,
    'Super Oferta',
    'https://images.unsplash.com/photo-1610614819513-58e34989848b?auto=format&fit=crop&w=800&q=80',
    '[
        {"title": "Bebida 1", "required": true, "items": ["Coca-Cola Original 350ml", "Coca-Cola Zero 350ml", "Guaraná Antarctica 350ml"]},
        {"title": "Bebida 2", "required": true, "items": ["Coca-Cola Original 350ml", "Coca-Cola Zero 350ml", "Guaraná Antarctica 350ml"]}
    ]'::jsonb
)
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;

-- 6. Cupons de Desconto
INSERT INTO public.coupons (code, description, discount_type, discount_percent, discount_value, free_delivery, min_subtotal, is_active) VALUES
('DELIVY10', '10% de desconto no total do pedido', 'percent', 10.00, NULL, false, 0.00, true),
('PRIMEIRO', 'R$ 10,00 OFF no primeiro pedido acima de R$ 40', 'fixed', NULL, 10.00, false, 40.00, true),
('FRETEGRATIS', 'Frete Grátis garantido para toda a cidade', 'freedelivery', NULL, NULL, true, 0.00, true)
ON CONFLICT (code) DO NOTHING;

-- 7. Despesas de Demonstração (Controle Financeiro)
INSERT INTO public.expenses (id, restaurant_id, category, description, amount, type, payment_method, status, date) VALUES
('exp-1', 'a0000000-0000-0000-0000-000000000001', 'Insumos & Carnes', 'Compra de 25kg Blend Angus + Queijo Cheddar Inglês', 850.00, 'despesa', 'pix', 'pago', now() - interval '18 hours'),
('exp-2', 'a0000000-0000-0000-0000-000000000001', 'Embalagens', 'Caixas térmicas personalizadas para hambúrguer (500 un)', 320.00, 'despesa', 'boleto', 'pago', now() - interval '36 hours'),
('exp-3', 'a0000000-0000-0000-0000-000000000001', 'Logística & Entregadores', 'Diária repasse equipe motoboys (3 entregadores)', 270.00, 'despesa', 'pix', 'pago', now() - interval '6 hours'),
('exp-4', 'a0000000-0000-0000-0000-000000000001', 'Marketing', 'Anúncios Instagram e Promoção Semanal', 150.00, 'despesa', 'credit', 'pago', now() - interval '48 hours')
ON CONFLICT (id) DO NOTHING;

-- 8. Pedidos de Demonstração (Para alimentar Cozinha KDS, Dashboard e Financeiro)
INSERT INTO public.orders (
    id, restaurant_id, customer_name, customer_phone, delivery_type, street, number, neighborhood,
    payment_method, subtotal, delivery_fee, discount_amount, pix_discount, grand_total, status, created_at
) VALUES
(
    'PED-1082',
    'a0000000-0000-0000-0000-000000000001',
    'Mariana Duarte',
    '(11) 98765-4321',
    'delivery',
    'Rua Augusta',
    '1200',
    'Consolação',
    'pix',
    115.60,
    4.90,
    0.00,
    6.03,
    114.47,
    'received',
    now() - interval '8 minutes'
),
(
    'PED-1081',
    'a0000000-0000-0000-0000-000000000001',
    'Rodrigo Medeiros',
    '(11) 97123-9988',
    'delivery',
    'Av. Paulista',
    '900',
    'Bela Vista',
    'card',
    98.90,
    0.00,
    10.00,
    0.00,
    88.90,
    'preparing',
    now() - interval '22 minutes'
),
(
    'PED-1080',
    'a0000000-0000-0000-0000-000000000001',
    'Beatriz Fagundes',
    '(11) 99455-1122',
    'pickup',
    'Retirada no Balcão',
    'S/N',
    'Loja Delivy',
    'pix',
    89.90,
    0.00,
    0.00,
    4.50,
    85.40,
    'ready',
    now() - interval '35 minutes'
),
(
    'PED-1079',
    'a0000000-0000-0000-0000-000000000001',
    'Lucas Nogueira',
    '(11) 98822-3344',
    'delivery',
    'Alameda Santos',
    '1450',
    'Cerqueira César',
    'card',
    87.70,
    4.90,
    8.77,
    0.00,
    83.83,
    'completed',
    now() - interval '75 minutes'
),
(
    'PED-1078',
    'a0000000-0000-0000-0000-000000000001',
    'Fernanda Lima',
    '(11) 97711-2233',
    'delivery',
    'Rua Pamplona',
    '650',
    'Jardins',
    'card',
    68.00,
    4.90,
    0.00,
    0.00,
    72.90,
    'completed',
    now() - interval '120 minutes'
)
ON CONFLICT (id) DO NOTHING;

-- 9. Itens dos Pedidos de Demonstração
INSERT INTO public.order_items (order_id, product_id, product_name, unit_price, quantity, selected_options, notes, total_price) VALUES
('PED-1082', 'b1', 'Delivy Monster Bacon', 38.90, 2, '{"Ponto da Carne": "Ao Ponto (suculenta)", "Molho Extra": "Maionese Verde da Casa (+R$ 4.00)"}'::jsonb, 'PONTO DA CARNE: AO PONTO. Sem cebola roxa!', 85.80),
('PED-1082', 'beb1', 'Soda Italiana de Frutas Vermelhas', 14.90, 2, '{}'::jsonb, NULL, 29.80),
('PED-1081', 'p1', 'Pizza Margherita Especial DOC', 62.00, 1, '{"Borda Recheada": "Borda Catupiry Original (+R$ 12.00)"}'::jsonb, 'Massa fina bem crocante!', 74.00),
('PED-1081', 's1', 'Brownie Supremo com Gelato de Baunilha', 24.90, 1, '{}'::jsonb, NULL, 24.90),
('PED-1080', 'c1', 'Combo Casal Gourmet', 89.90, 1, '{"Bebida 1": "Coca-Cola Zero 350ml", "Bebida 2": "Guaraná Antarctica 350ml"}'::jsonb, 'Caprichar no bacon!', 89.90),
('PED-1079', 'b2', 'Smash Cheddar Melt Duplo', 32.90, 2, '{}'::jsonb, NULL, 65.80),
('PED-1078', 'p1', 'Pizza Margherita Especial DOC', 68.00, 1, '{}'::jsonb, NULL, 68.00);
