import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  ShoppingBag, 
  Users, 
  DollarSign, 
  ChefHat, 
  Clock, 
  ArrowUpRight, 
  AlertTriangle, 
  Flame, 
  ExternalLink,
  Calendar,
  CheckCircle2
} from 'lucide-react';
import { CentralStore } from './store';

export default function Dashboard({ onNavigateTab }) {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);

  const reloadData = () => {
    setOrders(CentralStore.getOrders());
    setProducts(CentralStore.getProducts());
    setUsers(CentralStore.getUsers());
  };

  useEffect(() => {
    reloadData();
    const unsub = CentralStore.subscribe(() => {
      reloadData();
    });
    return unsub;
  }, []);

  // Métricas
  const totalOrdersCount = orders.length;
  const activeOrdersInKitchen = orders.filter(o => o.status === 'received' || o.status === 'preparing' || o.status === 'ready');
  const totalRevenue = orders.filter(o => o.status !== 'cancelled').reduce((sum, o) => sum + (o.grandTotal || 0), 0);
  const averageTicket = totalOrdersCount > 0 ? (totalRevenue / totalOrdersCount) : 0;
  const lowStockProducts = products.filter(p => (p.stock !== undefined ? p.stock : 20) < 10);

  // Simulação de vendas por hora (pico de delivery 18h às 23h)
  const hourlyData = [
    { hour: '18h', orders: 4, height: 35 },
    { hour: '19h', orders: 9, height: 70 },
    { hour: '20h', orders: 14, height: 100 },
    { hour: '21h', orders: 12, height: 85 },
    { hour: '22h', orders: 7, height: 55 },
    { hour: '23h', orders: 3, height: 25 },
  ];

  // Top Produtos mais vendidos calculados com base nos pedidos
  const productSalesMap = {};
  orders.forEach(order => {
    order.items?.forEach(item => {
      const name = item.product?.name || item.name || 'Produto';
      productSalesMap[name] = (productSalesMap[name] || 0) + item.quantity;
    });
  });

  const topSelling = Object.entries(productSalesMap)
    .map(([name, qty]) => ({ name, qty }))
    .sort((a, b) => b.qty - a.qty)
    .slice(0, 4);

  return (
    <div>
      {/* Cabeçalho do Dashboard */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fff' }}>
            Painel Geral do Dono da Loja
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginTop: '4px' }}>
            Visão unificada das operações de entrega, produção na cozinha e faturamento.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button 
            className="btn-primary-adm" 
            onClick={() => onNavigateTab && onNavigateTab('cozinha')}
            style={{ background: 'linear-gradient(135deg, #ea580c 0%, #f97316 100%)' }}
          >
            <ChefHat size={18} />
            Abrir Cozinha TV ({activeOrdersInKitchen.length})
          </button>
        </div>
      </div>

      {/* Cards de Métricas Principais */}
      <div className="admin-grid-4">
        {/* Faturamento */}
        <div className="admin-card admin-stat-card" style={{ borderLeft: '4px solid #10b981' }}>
          <div>
            <div className="admin-stat-label">Faturamento Total</div>
            <div className="admin-stat-value" style={{ color: '#34d399' }}>
              R$ {totalRevenue.toFixed(2).replace('.', ',')}
            </div>
            <div className="admin-stat-sub" style={{ color: '#10b981' }}>
              <ArrowUpRight size={14} /> +18.4% vs semana anterior
            </div>
          </div>
          <div className="admin-stat-icon-wrap" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981' }}>
            <DollarSign size={26} />
          </div>
        </div>

        {/* Pedidos em Cozinha */}
        <div 
          className="admin-card admin-stat-card" 
          onClick={() => onNavigateTab && onNavigateTab('cozinha')}
          style={{ borderLeft: '4px solid #ea580c', cursor: 'pointer' }}
        >
          <div>
            <div className="admin-stat-label">Pedidos na Cozinha Agora</div>
            <div className="admin-stat-value" style={{ color: '#fb923c' }}>
              {activeOrdersInKitchen.length}
            </div>
            <div className="admin-stat-sub" style={{ color: '#ea580c' }}>
              <Flame size={14} /> Em preparo / prontos
            </div>
          </div>
          <div className="admin-stat-icon-wrap" style={{ background: 'rgba(234, 88, 12, 0.15)', color: '#fb923c' }}>
            <ChefHat size={26} />
          </div>
        </div>

        {/* Ticket Médio */}
        <div className="admin-card admin-stat-card" style={{ borderLeft: '4px solid #38bdf8' }}>
          <div>
            <div className="admin-stat-label">Ticket Médio</div>
            <div className="admin-stat-value" style={{ color: '#38bdf8' }}>
              R$ {averageTicket.toFixed(2).replace('.', ',')}
            </div>
            <div className="admin-stat-sub" style={{ color: '#94a3b8' }}>
              {totalOrdersCount} pedidos consolidados
            </div>
          </div>
          <div className="admin-stat-icon-wrap" style={{ background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8' }}>
            <TrendingUp size={26} />
          </div>
        </div>

        {/* Clientes */}
        <div 
          className="admin-card admin-stat-card" 
          onClick={() => onNavigateTab && onNavigateTab('usuarios')}
          style={{ borderLeft: '4px solid #8b5cf6', cursor: 'pointer' }}
        >
          <div>
            <div className="admin-stat-label">Clientes na Base</div>
            <div className="admin-stat-value" style={{ color: '#c4b5fd' }}>
              {users.filter(u => u.role === 'cliente').length}
            </div>
            <div className="admin-stat-sub" style={{ color: '#8b5cf6' }}>
              Clientes fidelizados
            </div>
          </div>
          <div className="admin-stat-icon-wrap" style={{ background: 'rgba(139, 92, 246, 0.15)', color: '#a78bfa' }}>
            <Users size={26} />
          </div>
        </div>
      </div>

      {/* Seção Central: Gráficos de Vendas & Fila da Cozinha */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '20px', marginBottom: '28px' }}>
        {/* Gráfico de Vendas por Hora do Turno */}
        <div className="admin-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#fff' }}>
                Curva de Pedidos no Turno Noturno
              </h3>
              <p style={{ color: '#94a3b8', fontSize: '0.82rem', marginTop: '2px' }}>
                Volume de comandas por faixa horária
              </p>
            </div>
            <span style={{ fontSize: '0.75rem', background: '#1e293b', color: '#38bdf8', padding: '4px 10px', borderRadius: '6px', fontWeight: 700 }}>
              Pico: 20h às 21h
            </span>
          </div>

          {/* Gráfico em barras CSS */}
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '170px', padding: '10px 10px 0 10px', borderBottom: '1px solid #1f293d' }}>
            {hourlyData.map((d) => (
              <div key={d.hour} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', flex: 1 }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#fff' }}>{d.orders}</span>
                <div 
                  style={{ 
                    width: '32px', 
                    height: `${d.height}%`, 
                    background: d.height === 100 ? 'linear-gradient(180deg, #ea580c 0%, #c2410c 100%)' : '#1e293b',
                    borderRadius: '6px 6px 0 0',
                    transition: 'height 0.3s ease',
                    boxShadow: d.height === 100 ? '0 0 15px rgba(234, 88, 12, 0.4)' : 'none'
                  }} 
                />
                <span style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '6px' }}>{d.hour}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Fila Ativa da Cozinha / KDS */}
        <div className="admin-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Flame size={20} color="#ea580c" />
              Fila da Cozinha em Tempo Real
            </h3>
            <button 
              onClick={() => onNavigateTab && onNavigateTab('cozinha')}
              style={{ background: 'transparent', border: 'none', color: '#38bdf8', cursor: 'pointer', fontSize: '0.82rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              Ver na TV <ExternalLink size={14} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '230px', overflowY: 'auto' }}>
            {activeOrdersInKitchen.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '30px', color: '#94a3b8' }}>
                Nenhum pedido no fogão neste momento.
              </div>
            ) : (
              activeOrdersInKitchen.map((ord) => (
                <div 
                  key={ord.id}
                  style={{
                    background: '#0b0f19',
                    border: '1px solid #1f293d',
                    borderRadius: '10px',
                    padding: '12px 14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <strong style={{ color: '#fff', fontSize: '0.95rem' }}>{ord.id}</strong>
                      <span style={{ color: '#cbd5e1', fontSize: '0.85rem' }}>• {ord.customer.name}</span>
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '4px' }}>
                      {ord.items?.map(it => `${it.quantity}x ${it.product?.name || it.name}`).join(', ')}
                    </div>
                  </div>

                  <span className={`badge-status status-${ord.status}`}>
                    {ord.status === 'received' && '🟡 Novo'}
                    {ord.status === 'preparing' && '🟠 No Fogo'}
                    {ord.status === 'ready' && '🟢 Pronto'}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Grid: Alertas de Estoque & Produtos Mais Vendidos */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px' }}>
        {/* Produtos Top Sellers */}
        <div className="admin-card">
          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#fff', marginBottom: '16px' }}>
            🏆 Mais Vendidos do Cardápio
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {topSelling.length > 0 ? (
              topSelling.map((prod, idx) => (
                <div key={idx}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', marginBottom: '4px' }}>
                    <span style={{ color: '#fff', fontWeight: 600 }}>#{idx + 1} {prod.name}</span>
                    <span style={{ color: '#ea580c', fontWeight: 800 }}>{prod.qty} pedidos</span>
                  </div>
                  <div style={{ width: '100%', height: '6px', background: '#1e293b', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ 
                      height: '100%', 
                      background: 'linear-gradient(90deg, #ea580c, #f97316)', 
                      width: `${Math.min(100, (prod.qty / (topSelling[0].qty || 1)) * 100)}%` 
                    }} />
                  </div>
                </div>
              ))
            ) : (
              <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Aguardando fechamento de pedidos.</p>
            )}
          </div>
        </div>

        {/* Alertas de Reposição de Estoque */}
        <div className="admin-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertTriangle size={20} color="#f59e0b" />
              Alertas de Estoque Crítico (&lt; 10 un)
            </h3>
            <button 
              onClick={() => onNavigateTab && onNavigateTab('produtos')}
              style={{ background: 'transparent', border: 'none', color: '#38bdf8', cursor: 'pointer', fontSize: '0.82rem', fontWeight: 700 }}
            >
              Gerenciar Estoque
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {lowStockProducts.length === 0 ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '16px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '10px', color: '#34d399' }}>
                <CheckCircle2 size={20} />
                <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>Todos os produtos com estoque saudável!</span>
              </div>
            ) : (
              lowStockProducts.slice(0, 4).map((p) => (
                <div 
                  key={p.id}
                  style={{
                    background: '#0b0f19',
                    border: '1px solid rgba(245, 158, 11, 0.3)',
                    borderRadius: '8px',
                    padding: '10px 14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <img src={p.image} alt={p.name} style={{ width: '36px', height: '36px', borderRadius: '6px', objectFit: 'cover' }} />
                    <span style={{ color: '#fff', fontWeight: 600, fontSize: '0.9rem' }}>{p.name}</span>
                  </div>
                  <span style={{ background: '#f59e0b25', color: '#f59e0b', padding: '3px 8px', borderRadius: '4px', fontWeight: 800, fontSize: '0.82rem' }}>
                    Apenas {p.stock !== undefined ? p.stock : 8} un
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
