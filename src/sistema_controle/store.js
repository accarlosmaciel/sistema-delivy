// Gerenciador Central de Dados e Sincronização em Tempo Real (LocalStorage + BroadcastChannel)
import { PRODUCTS as INITIAL_PRODUCTS, PROMO_COUPONS as INITIAL_COUPONS, RESTAURANT_INFO } from '../data/products';

const SYNC_CHANNEL_NAME = 'delivy_realtime_bus';
let broadcastChannel = null;

if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
  try {
    broadcastChannel = new BroadcastChannel(SYNC_CHANNEL_NAME);
  } catch (e) {
    console.warn('BroadcastChannel não suportado neste ambiente', e);
  }
}

// Chaves do localStorage
const KEYS = {
  PRODUCTS: 'delivy_products_db',
  ORDERS: 'delivy_orders_history',
  ACTIVE_ORDER: 'delivy_active_order',
  COUPONS: 'delivy_coupons_db',
  USERS: 'delivy_users_db',
  FINANCES: 'delivy_expenses_db',
  CURRENT_USER: 'delivy_current_session_user'
};

// Pedidos Iniciais de Demonstração para alimentar Cozinha, Dashboard e Financeiro
const SEED_ORDERS = [
  {
    id: 'PED-1082',
    date: new Date(Date.now() - 1000 * 60 * 8).toISOString(), // 8 min atrás
    customer: {
      name: 'Mariana Duarte',
      phone: '(11) 98765-4321',
      address: 'Rua Augusta, 1200 - Apto 42',
      neighborhood: 'Consolação',
      city: 'São Paulo'
    },
    items: [
      {
        product: { id: 'b1', name: 'Delivy Monster Bacon', price: 38.90 },
        quantity: 2,
        notes: 'PONTO DA CARNE: AO PONTO. Sem cebola roxa, por favor!',
        options: { 'Ponto da Carne': 'Ao Ponto (suculenta)', 'Molho Extra': 'Maionese Verde da Casa (+R$ 4.00)' },
        totalPrice: 85.80
      },
      {
        product: { id: 'beb1', name: 'Soda Italiana de Frutas Vermelhas', price: 14.90 },
        quantity: 2,
        totalPrice: 29.80
      }
    ],
    paymentMethod: 'pix',
    deliveryType: 'delivery',
    subtotal: 115.60,
    deliveryFee: 4.90,
    discountAmount: 0,
    grandTotal: 120.50,
    status: 'received', // 'received' | 'preparing' | 'ready' | 'delivering' | 'completed' | 'cancelled'
    elapsedMinutes: 8
  },
  {
    id: 'PED-1081',
    date: new Date(Date.now() - 1000 * 60 * 22).toISOString(), // 22 min atrás
    customer: {
      name: 'Rodrigo Medeiros',
      phone: '(11) 97123-9988',
      address: 'Av. Paulista, 900 - Conj 105',
      neighborhood: 'Bela Vista',
      city: 'São Paulo'
    },
    items: [
      {
        product: { id: 'p1', name: 'Pizza Margherita Especial DOC', price: 62.00 },
        quantity: 1,
        notes: 'Massa fina bem crocante!',
        options: { 'Borda Recheada': 'Borda Catupiry Original (+R$ 12.00)' },
        totalPrice: 74.00
      },
      {
        product: { id: 's1', name: 'Brownie Supremo com Gelato de Baunilha', price: 24.90 },
        quantity: 1,
        totalPrice: 24.90
      }
    ],
    paymentMethod: 'credit',
    deliveryType: 'delivery',
    subtotal: 98.90,
    deliveryFee: 0,
    discountAmount: 10.00,
    grandTotal: 88.90,
    status: 'preparing',
    elapsedMinutes: 22
  },
  {
    id: 'PED-1080',
    date: new Date(Date.now() - 1000 * 60 * 35).toISOString(), // 35 min atrás
    customer: {
      name: 'Beatriz Fagundes',
      phone: '(11) 99455-1122',
      address: 'Retirada no Balcão',
      neighborhood: 'Loja Delivy',
      city: 'São Paulo'
    },
    items: [
      {
        product: { id: 'c1', name: 'Combo Casal Gourmet', price: 89.90 },
        quantity: 1,
        notes: 'Caprichar no bacon!',
        options: { 'Bebida 1': 'Coca-Cola Zero 350ml', 'Bebida 2': 'Guaraná Antarctica 350ml' },
        totalPrice: 89.90
      }
    ],
    paymentMethod: 'pix',
    deliveryType: 'pickup',
    subtotal: 89.90,
    deliveryFee: 0,
    discountAmount: 0,
    grandTotal: 89.90,
    status: 'ready',
    elapsedMinutes: 35
  },
  {
    id: 'PED-1079',
    date: new Date(Date.now() - 1000 * 60 * 75).toISOString(),
    customer: {
      name: 'Lucas Nogueira',
      phone: '(11) 98822-3344',
      address: 'Alameda Santos, 1450',
      neighborhood: 'Cerqueira César',
      city: 'São Paulo'
    },
    items: [
      {
        product: { id: 'b2', name: 'Smash Cheddar Melt Duplo', price: 32.90 },
        quantity: 2,
        totalPrice: 65.80
      },
      {
        product: { id: 'a1', name: 'Batata Rústica com Alecrim & Páprica', price: 21.90 },
        quantity: 1,
        totalPrice: 21.90
      }
    ],
    paymentMethod: 'credit',
    deliveryType: 'delivery',
    subtotal: 87.70,
    deliveryFee: 4.90,
    discountAmount: 8.77,
    grandTotal: 83.83,
    status: 'completed',
    elapsedMinutes: 75
  },
  {
    id: 'PED-1078',
    date: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    customer: {
      name: 'Fernanda Lima',
      phone: '(11) 97711-2233',
      address: 'Rua Pamplona, 650',
      neighborhood: 'Jardins',
      city: 'São Paulo'
    },
    items: [
      {
        product: { id: 'p2', name: 'Pizza Pepperoni & Jalapeño Honey', price: 68.00 },
        quantity: 1,
        totalPrice: 68.00
      }
    ],
    paymentMethod: 'debit',
    deliveryType: 'delivery',
    subtotal: 68.00,
    deliveryFee: 4.90,
    discountAmount: 0,
    grandTotal: 72.90,
    status: 'completed',
    elapsedMinutes: 120
  }
];

// Usuários do Sistema (Superadmin, Dono da Loja e Clientes)
const SEED_USERS = [
  {
    id: 'u-superadmin',
    name: 'Carlos Maciel (Master)',
    email: 'superadmin@delivy.com.br',
    role: 'superadmin', // 'superadmin' | 'admin' | 'cliente' | 'kitchen'
    phone: '(11) 99999-0001',
    status: 'ativo',
    createdAt: '2026-01-10',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    notes: 'Acesso Irrestrito à Plataforma e Multi-Lojas'
  },
  {
    id: 'u-admin-loja',
    name: 'Roberto Valente (Dono da Loja)',
    email: 'roberto@delivygourmet.com',
    role: 'admin',
    phone: '(11) 98111-2222',
    status: 'ativo',
    createdAt: '2026-01-15',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    notes: 'Gestão completa do Delivy Gourmet'
  },
  {
    id: 'u-kitchen',
    name: 'Equipe Cozinha Principal',
    email: 'cozinha@delivygourmet.com',
    role: 'kitchen',
    phone: '(11) 98222-3333',
    status: 'ativo',
    createdAt: '2026-02-01',
    avatar: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=200&q=80',
    notes: 'Terminal de Produção KDS'
  },
  {
    id: 'c-1',
    name: 'Mariana Duarte',
    email: 'mariana.duarte@gmail.com',
    role: 'cliente',
    phone: '(11) 98765-4321',
    status: 'ativo',
    createdAt: '2026-02-14',
    totalSpent: 489.20,
    ordersCount: 5,
    tag: 'Cliente VIP ⭐',
    address: 'Rua Augusta, 1200 - Apto 42'
  },
  {
    id: 'c-2',
    name: 'Rodrigo Medeiros',
    email: 'rodrigo.medeiros@yahoo.com',
    role: 'cliente',
    phone: '(11) 97123-9988',
    status: 'ativo',
    createdAt: '2026-03-02',
    totalSpent: 260.50,
    ordersCount: 3,
    tag: 'Recorrente',
    address: 'Av. Paulista, 900 - Conj 105'
  },
  {
    id: 'c-3',
    name: 'Beatriz Fagundes',
    email: 'bia.fagundes@outlook.com',
    role: 'cliente',
    phone: '(11) 99455-1122',
    status: 'ativo',
    createdAt: '2026-04-10',
    totalSpent: 135.00,
    ordersCount: 2,
    tag: 'Novo',
    address: 'Retirada no Balcão'
  }
];

// Despesas Iniciais para Controle Financeiro
const SEED_EXPENSES = [
  {
    id: 'exp-1',
    category: 'Insumos & Carnes',
    description: 'Compra de 25kg Blend Angus + Queijo Cheddar Inglês',
    amount: 850.00,
    type: 'despesa',
    date: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString(),
    status: 'pago',
    paymentMethod: 'pix'
  },
  {
    id: 'exp-2',
    category: 'Embalagens',
    description: 'Caixas térmicas personalizadas para hambúrguer (500 un)',
    amount: 320.00,
    type: 'despesa',
    date: new Date(Date.now() - 1000 * 60 * 60 * 36).toISOString(),
    status: 'pago',
    paymentMethod: 'boleto'
  },
  {
    id: 'exp-3',
    category: 'Logística & Entregadores',
    description: 'Diária repasse equipe motoboys (3 entregadores)',
    amount: 270.00,
    type: 'despesa',
    date: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
    status: 'pago',
    paymentMethod: 'pix'
  },
  {
    id: 'exp-4',
    category: 'Marketing',
    description: 'Anúncios Instagram e Promoção Semanal',
    amount: 150.00,
    type: 'despesa',
    date: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    status: 'pago',
    paymentMethod: 'credit'
  }
];

// Funções Utilitárias de Armazenamento e Sincronização
export const CentralStore = {
  // Notificar outros ouvintes
  broadcast(action, payload) {
    if (broadcastChannel) {
      try {
        broadcastChannel.postMessage({ action, payload, timestamp: Date.now() });
      } catch (e) {
        console.error('Erro no broadcast:', e);
      }
    }
  },

  // Inscrever para mudanças
  subscribe(callback) {
    if (!broadcastChannel) return () => {};
    const handler = (event) => {
      callback(event.data);
    };
    broadcastChannel.addEventListener('message', handler);
    return () => broadcastChannel.removeEventListener('message', handler);
  },

  // --- PRODUTOS & ESTOQUE ---
  getProducts() {
    if (typeof window === 'undefined') return INITIAL_PRODUCTS;
    try {
      const saved = localStorage.getItem(KEYS.PRODUCTS);
      if (saved) {
        const parsed = JSON.parse(saved);
        const missing = INITIAL_PRODUCTS.filter(ip => !parsed.some(p => p.id === ip.id));
        if (missing.length > 0) {
          const merged = [...parsed, ...missing.map((p, idx) => ({
            ...p,
            stock: p.stock !== undefined ? p.stock : 25,
            isAvailable: p.isAvailable !== false
          }))];
          localStorage.setItem(KEYS.PRODUCTS, JSON.stringify(merged));
          return merged;
        }
        return parsed;
      }
      // Inicializar com estoque padrão
      const seeded = INITIAL_PRODUCTS.map((p, idx) => ({
        ...p,
        stock: p.stock !== undefined ? p.stock : (idx % 3 === 0 ? 8 : 25), // estoque realista
        isAvailable: p.isAvailable !== undefined ? p.isAvailable : true
      }));
      localStorage.setItem(KEYS.PRODUCTS, JSON.stringify(seeded));
      return seeded;
    } catch (e) {
      return INITIAL_PRODUCTS;
    }
  },

  saveProducts(products) {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(KEYS.PRODUCTS, JSON.stringify(products));
      this.broadcast('PRODUCTS_UPDATED', products);
    } catch (e) {
      console.error(e);
    }
  },

  addProduct(newProd) {
    const list = this.getProducts();
    const created = {
      ...newProd,
      id: newProd.id || 'prod-' + Date.now(),
      price: parseFloat(newProd.price) || 0,
      stock: parseInt(newProd.stock, 10) || 0,
      isAvailable: newProd.isAvailable !== false
    };
    const updated = [created, ...list];
    this.saveProducts(updated);
    return created;
  },

  updateProduct(id, updates) {
    const list = this.getProducts();
    const updated = list.map(p => (p.id === id ? { ...p, ...updates } : p));
    this.saveProducts(updated);
    return updated;
  },

  deleteProduct(id) {
    const list = this.getProducts();
    const updated = list.filter(p => p.id !== id);
    this.saveProducts(updated);
    return updated;
  },

  // Baixa no estoque após um pedido
  decrementStockForOrder(orderItems) {
    const list = this.getProducts();
    let changed = false;
    const updated = list.map(prod => {
      const match = orderItems.find(item => item.product?.id === prod.id);
      if (match) {
        changed = true;
        const currentStock = prod.stock !== undefined ? prod.stock : 20;
        const newStock = Math.max(0, currentStock - match.quantity);
        return {
          ...prod,
          stock: newStock,
          isAvailable: newStock > 0
        };
      }
      return prod;
    });

    if (changed) {
      this.saveProducts(updated);
    }
  },

  // --- PEDIDOS (COZINHA & CLIENTE & DASHBOARD) ---
  getOrders() {
    if (typeof window === 'undefined') return SEED_ORDERS;
    try {
      const saved = localStorage.getItem(KEYS.ORDERS);
      if (saved) return JSON.parse(saved);
      localStorage.setItem(KEYS.ORDERS, JSON.stringify(SEED_ORDERS));
      return SEED_ORDERS;
    } catch (e) {
      return SEED_ORDERS;
    }
  },

  saveOrders(orders) {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(KEYS.ORDERS, JSON.stringify(orders));
      this.broadcast('ORDERS_UPDATED', orders);
    } catch (e) {
      console.error(e);
    }
  },

  addOrder(order) {
    const list = this.getOrders();
    const fullOrder = {
      ...order,
      id: order.id || `PED-${Math.floor(1000 + Math.random() * 9000)}`,
      date: order.date || new Date().toISOString(),
      status: order.status || 'received',
      elapsedMinutes: 0
    };
    const updated = [fullOrder, ...list];
    this.saveOrders(updated);

    // Baixa automática no estoque
    if (fullOrder.items && fullOrder.items.length > 0) {
      this.decrementStockForOrder(fullOrder.items);
    }

    // Registra / atualiza cliente automaticamente
    if (fullOrder.customer?.name) {
      this.registerOrUpdateCustomerFromOrder(fullOrder);
    }

    this.broadcast('NEW_ORDER_RECEIVED', fullOrder);
    return fullOrder;
  },

  updateOrderStatus(orderId, newStatus) {
    const list = this.getOrders();
    const updated = list.map(o => (o.id === orderId ? { ...o, status: newStatus } : o));
    this.saveOrders(updated);

    // Sincronizar também com activeOrder do cliente se for o pedido atual dele
    try {
      const activeStr = localStorage.getItem(KEYS.ACTIVE_ORDER);
      if (activeStr) {
        const active = JSON.parse(activeStr);
        if (active.id === orderId) {
          active.status = newStatus;
          localStorage.setItem(KEYS.ACTIVE_ORDER, JSON.stringify(active));
          this.broadcast('ACTIVE_ORDER_UPDATED', active);
        }
      }
    } catch (e) {}

    return updated;
  },

  // --- PROMOÇÕES & CUPONS ---
  getCoupons() {
    if (typeof window === 'undefined') return INITIAL_COUPONS;
    try {
      const saved = localStorage.getItem(KEYS.COUPONS);
      if (saved) return JSON.parse(saved);
      localStorage.setItem(KEYS.COUPONS, JSON.stringify(INITIAL_COUPONS));
      return INITIAL_COUPONS;
    } catch (e) {
      return INITIAL_COUPONS;
    }
  },

  saveCoupons(coupons) {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(KEYS.COUPONS, JSON.stringify(coupons));
      this.broadcast('COUPONS_UPDATED', coupons);
    } catch (e) {
      console.error(e);
    }
  },

  saveCoupon(code, couponData) {
    const current = this.getCoupons();
    const updated = {
      ...current,
      [code.toUpperCase()]: couponData
    };
    this.saveCoupons(updated);
    return updated;
  },

  deleteCoupon(code) {
    const current = this.getCoupons();
    const copy = { ...current };
    delete copy[code];
    this.saveCoupons(copy);
    return copy;
  },

  // --- USUÁRIOS (CLIENTES, ADMINS, SUPERADMIN) ---
  getUsers() {
    if (typeof window === 'undefined') return SEED_USERS;
    try {
      const saved = localStorage.getItem(KEYS.USERS);
      if (saved) return JSON.parse(saved);
      localStorage.setItem(KEYS.USERS, JSON.stringify(SEED_USERS));
      return SEED_USERS;
    } catch (e) {
      return SEED_USERS;
    }
  },

  saveUsers(users) {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(KEYS.USERS, JSON.stringify(users));
      this.broadcast('USERS_UPDATED', users);
    } catch (e) {
      console.error(e);
    }
  },

  addUser(user) {
    const list = this.getUsers();
    const created = {
      ...user,
      id: user.id || 'u-' + Date.now(),
      createdAt: new Date().toISOString().split('T')[0],
      status: user.status || 'ativo'
    };
    const updated = [created, ...list];
    this.saveUsers(updated);
    return created;
  },

  updateUser(id, updates) {
    const list = this.getUsers();
    const updated = list.map(u => (u.id === id ? { ...u, ...updates } : u));
    this.saveUsers(updated);
    return updated;
  },

  deleteUser(id) {
    const list = this.getUsers();
    const updated = list.filter(u => u.id !== id);
    this.saveUsers(updated);
    return updated;
  },

  registerOrUpdateCustomerFromOrder(order) {
    const list = this.getUsers();
    const phone = order.customer.phone;
    const existingIndex = list.findIndex(u => u.phone === phone || u.name === order.customer.name);

    if (existingIndex >= 0) {
      const current = list[existingIndex];
      const updatedUser = {
        ...current,
        ordersCount: (current.ordersCount || 0) + 1,
        totalSpent: Number(((current.totalSpent || 0) + (order.grandTotal || 0)).toFixed(2)),
        address: order.customer.address || current.address,
        tag: ((current.ordersCount || 0) + 1) >= 4 ? 'Cliente VIP ⭐' : 'Recorrente'
      };
      list[existingIndex] = updatedUser;
      this.saveUsers(list);
    } else {
      const newUser = {
        id: 'c-' + Date.now(),
        name: order.customer.name,
        email: order.customer.email || `${order.customer.name.toLowerCase().replace(/\s+/g, '')}@cliente.com`,
        phone: order.customer.phone,
        role: 'cliente',
        status: 'ativo',
        createdAt: new Date().toISOString().split('T')[0],
        totalSpent: Number((order.grandTotal || 0).toFixed(2)),
        ordersCount: 1,
        tag: 'Novo',
        address: order.customer.address || 'Não especificado'
      };
      this.saveUsers([newUser, ...list]);
    }
  },

  // Sessão atual do usuário no painel de controle
  getCurrentUser() {
    if (typeof window === 'undefined') return SEED_USERS[0];
    try {
      const saved = localStorage.getItem(KEYS.CURRENT_USER);
      if (saved) return JSON.parse(saved);
      return SEED_USERS[0]; // Superadmin padrão
    } catch (e) {
      return SEED_USERS[0];
    }
  },

  setCurrentUser(user) {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(user));
      this.broadcast('CURRENT_USER_CHANGED', user);
    } catch (e) {}
  },

  // --- CONTROLE FINANCEIRO (DESPESAS E SAÍDAS) ---
  getExpenses() {
    if (typeof window === 'undefined') return SEED_EXPENSES;
    try {
      const saved = localStorage.getItem(KEYS.FINANCES);
      if (saved) return JSON.parse(saved);
      localStorage.setItem(KEYS.FINANCES, JSON.stringify(SEED_EXPENSES));
      return SEED_EXPENSES;
    } catch (e) {
      return SEED_EXPENSES;
    }
  },

  saveExpenses(expenses) {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(KEYS.FINANCES, JSON.stringify(expenses));
      this.broadcast('FINANCES_UPDATED', expenses);
    } catch (e) {
      console.error(e);
    }
  },

  addExpense(item) {
    const list = this.getExpenses();
    const created = {
      ...item,
      id: item.id || 'exp-' + Date.now(),
      amount: parseFloat(item.amount) || 0,
      date: item.date || new Date().toISOString(),
      status: item.status || 'pago'
    };
    const updated = [created, ...list];
    this.saveExpenses(updated);
    return created;
  },

  deleteExpense(id) {
    const list = this.getExpenses();
    const updated = list.filter(e => e.id !== id);
    this.saveExpenses(updated);
    return updated;
  }
};
