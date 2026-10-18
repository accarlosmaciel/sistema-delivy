import React, { useState, useEffect } from 'react';
import { 
  ChefHat, 
  Clock, 
  Volume2, 
  VolumeX, 
  Maximize2, 
  Minimize2, 
  Flame, 
  CheckCircle, 
  Bike, 
  AlertTriangle, 
  Printer, 
  RefreshCw,
  BellRing,
  Filter
} from 'lucide-react';
import { CentralStore } from './store';
import { kitchenAudio } from './audioNotification';

export default function TelaCozinhaKDS({ onNavigateBack }) {
  const [orders, setOrders] = useState([]);
  const [filterStatus, setFilterStatus] = useState('active'); // 'active' | 'received' | 'preparing' | 'ready' | 'all'
  const [currentTime, setCurrentTime] = useState('');
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [lastAlertOrder, setLastAlertOrder] = useState(null);

  // Carrega pedidos e escuta atualizações em tempo real
  const reloadOrders = () => {
    const list = CentralStore.getOrders();
    setOrders(list);
  };

  useEffect(() => {
    reloadOrders();

    // Sincronização em tempo real via BroadcastChannel
    const unsubscribe = CentralStore.subscribe((event) => {
      if (event.action === 'NEW_ORDER_RECEIVED') {
        reloadOrders();
        setLastAlertOrder(event.payload);
        if (audioEnabled) {
          kitchenAudio.playNewOrderAlert();
        }
      } else if (event.action === 'ORDERS_UPDATED') {
        reloadOrders();
      }
    });

    // Atualiza relógio a cada segundo
    const clockInterval = setInterval(() => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    }, 1000);

    // Atualiza timers dos pedidos a cada 30 segundos
    const timerInterval = setInterval(() => {
      setOrders([...CentralStore.getOrders()]);
    }, 30000);

    return () => {
      unsubscribe();
      clearInterval(clockInterval);
      clearInterval(timerInterval);
    };
  }, [audioEnabled]);

  // Alternar tela cheia (ideal para TV)
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
      }
    }
  };

  // Avançar status do pedido
  const handleUpdateStatus = (orderId, newStatus) => {
    CentralStore.updateOrderStatus(orderId, newStatus);
    reloadOrders();
  };

  // Imprimir comanda simplificada para cozinha
  const handlePrintTicket = (order) => {
    const printWindow = window.open('', '', 'width=380,height=600');
    if (!printWindow) return;
    printWindow.document.write(`
      <html>
        <head>
          <title>Comanda ${order.id}</title>
          <style>
            body { font-family: monospace; padding: 10px; font-size: 14px; color: #000; }
            h2 { margin: 0 0 5px 0; font-size: 18px; text-align: center; }
            hr { border-top: 1px dashed #000; margin: 10px 0; }
            .obs { background: #eee; padding: 4px; font-weight: bold; margin-top: 4px; }
          </style>
        </head>
        <body>
          <h2>DELIVY GOURMET</h2>
          <p style="text-align:center;">*** COMANDA DA COZINHA ***</p>
          <hr />
          <p><strong>PEDIDO:</strong> ${order.id}</p>
          <p><strong>DATA:</strong> ${new Date(order.date).toLocaleTimeString('pt-BR')} | ${new Date(order.date).toLocaleDateString('pt-BR')}</p>
          <p><strong>CLIENTE:</strong> ${order.customer.name}</p>
          <p><strong>TIPO:</strong> ${order.deliveryType === 'pickup' ? 'RETIRADA NO BALCÃO' : 'DELIVERY'}</p>
          <hr />
          ${order.items.map(item => `
            <div style="margin-bottom: 8px;">
              <strong>${item.quantity}x ${item.product?.name || item.name}</strong>
              ${item.options ? `<div style="font-size: 12px; color: #444;">${Object.entries(item.options).map(([k, v]) => `${k}: ${v}`).join(', ')}</div>` : ''}
              ${item.notes ? `<div class="obs">OBS: ${item.notes}</div>` : ''}
            </div>
          `).join('')}
          <hr />
          <p style="text-align:center;">COZINHA - PRODUÇÃO</p>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  };

  // Calcular minutos decorridos
  const getElapsedMinutes = (dateString) => {
    const orderTime = new Date(dateString).getTime();
    const now = Date.now();
    return Math.max(0, Math.floor((now - orderTime) / (1000 * 60)));
  };

  // Filtragem dos pedidos
  const activeOrders = orders.filter(o => {
    if (filterStatus === 'active') {
      return o.status === 'received' || o.status === 'preparing' || o.status === 'ready';
    }
    if (filterStatus === 'all') return true;
    return o.status === filterStatus;
  });

  // Contadores rápidos
  const countReceived = orders.filter(o => o.status === 'received').length;
  const countPreparing = orders.filter(o => o.status === 'preparing').length;
  const countReady = orders.filter(o => o.status === 'ready').length;

  return (
    <div className="kds-tv-shell">
      {/* Topo da Cozinha / KDS */}
      <header className="kds-tv-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div className="kds-tv-title">
            <div style={{ 
              background: 'linear-gradient(135deg, #ea580c, #f97316)', 
              padding: '8px', 
              borderRadius: '10px', 
              display: 'flex', 
              alignItems: 'center' 
            }}>
              <ChefHat size={28} color="#fff" />
            </div>
            <div>
              <span style={{ color: '#fff', fontSize: '1.3rem', fontWeight: 800 }}>KDS COZINHA</span>
              <span style={{ marginLeft: '8px', fontSize: '0.8rem', background: '#334155', padding: '2px 8px', borderRadius: '4px', color: '#38bdf8' }}>
                MODO TV
              </span>
            </div>
          </div>

          {/* Filtros de Status */}
          <div style={{ display: 'flex', gap: '8px', background: '#090d16', padding: '4px', borderRadius: '10px' }}>
            <button 
              onClick={() => setFilterStatus('active')}
              style={{
                background: filterStatus === 'active' ? '#ea580c' : 'transparent',
                color: '#fff',
                border: 'none',
                padding: '6px 14px',
                borderRadius: '8px',
                fontSize: '0.85rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              Em Produção ({countReceived + countPreparing + countReady})
            </button>

            <button 
              onClick={() => setFilterStatus('received')}
              style={{
                background: filterStatus === 'received' ? '#eab308' : 'transparent',
                color: filterStatus === 'received' ? '#000' : '#facc15',
                border: 'none',
                padding: '6px 12px',
                borderRadius: '8px',
                fontSize: '0.85rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              🟡 Novos ({countReceived})
            </button>

            <button 
              onClick={() => setFilterStatus('preparing')}
              style={{
                background: filterStatus === 'preparing' ? '#f97316' : 'transparent',
                color: '#fff',
                border: 'none',
                padding: '6px 12px',
                borderRadius: '8px',
                fontSize: '0.85rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              🔥 No Fogo ({countPreparing})
            </button>

            <button 
              onClick={() => setFilterStatus('ready')}
              style={{
                background: filterStatus === 'ready' ? '#10b981' : 'transparent',
                color: '#fff',
                border: 'none',
                padding: '6px 12px',
                borderRadius: '8px',
                fontSize: '0.85rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              🟢 Prontos ({countReady})
            </button>
          </div>
        </div>

        {/* Relógio & Controles TV */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div className="kds-clock">
            {currentTime || '19:45:00'}
          </div>

          {/* Teste / Toggle de Som */}
          <button 
            onClick={() => {
              kitchenAudio.playNewOrderAlert();
              setAudioEnabled(!audioEnabled);
            }}
            title={audioEnabled ? "Alerta Sonoro Ativo (Clique para testar som)" : "Som Desativado"}
            style={{
              background: audioEnabled ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
              border: `1px solid ${audioEnabled ? '#10b981' : '#ef4444'}`,
              color: audioEnabled ? '#34d399' : '#f87171',
              padding: '8px 12px',
              borderRadius: '8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontWeight: 600,
              fontSize: '0.85rem'
            }}
          >
            {audioEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
            {audioEnabled ? 'Som TV Ligado' : 'Mudo'}
          </button>

          {/* Tela Cheia */}
          <button 
            onClick={toggleFullscreen}
            title="Expandir para TV"
            style={{
              background: '#1e293b',
              border: '1px solid #334155',
              color: '#fff',
              padding: '8px 12px',
              borderRadius: '8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontWeight: 600,
              fontSize: '0.85rem'
            }}
          >
            {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
            {isFullscreen ? 'Sair TV' : 'Tela Cheia'}
          </button>

          {onNavigateBack && (
            <button 
              onClick={onNavigateBack}
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: '#cbd5e1',
                padding: '8px 14px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '0.85rem',
                fontWeight: 600
              }}
            >
              Voltar ao Painel
            </button>
          )}
        </div>
      </header>

      {/* Grid de Pedidos para TV */}
      {activeOrders.length === 0 ? (
        <div style={{ 
          flex: 1, 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center',
          background: '#0a0f1d',
          borderRadius: '16px',
          border: '2px dashed #1e293b',
          padding: '60px 20px',
          textAlign: 'center'
        }}>
          <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#1e293b', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
            <ChefHat size={44} color="#94a3b8" />
          </div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fff', marginBottom: '8px' }}>
            Cozinha Livre e Organizada!
          </h2>
          <p style={{ color: '#94a3b8', maxWidth: '420px', fontSize: '1rem', lineHeight: '1.5' }}>
            Nenhum pedido pendente nesta etapa. Assim que o cliente finalizar no cardápio, a comanda aparecerá aqui com aviso sonoro na TV.
          </p>
        </div>
      ) : (
        <div className="kds-grid">
          {activeOrders.map((order) => {
            const elapsed = getElapsedMinutes(order.date);
            const isUrgent = elapsed >= 30 && order.status !== 'ready';
            const timerClass = elapsed < 15 ? 'timer-green' : elapsed < 30 ? 'timer-yellow' : 'timer-red';

            return (
              <div 
                key={order.id} 
                className={`kds-order-card ${isUrgent ? 'urgent' : ''}`}
                style={{
                  borderTop: order.status === 'received' 
                    ? '5px solid #eab308' 
                    : order.status === 'preparing' 
                    ? '5px solid #f97316' 
                    : '5px solid #10b981'
                }}
              >
                {/* Cabeçalho do Card */}
                <div className="kds-order-header">
                  <div className="kds-order-id">
                    <span style={{ color: '#ea580c' }}>#</span>
                    <span>{order.id}</span>
                    {order.status === 'received' && (
                      <span style={{ fontSize: '0.7rem', background: '#eab308', color: '#000', padding: '2px 6px', borderRadius: '4px', fontWeight: 800 }}>
                        NOVO
                      </span>
                    )}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <button 
                      onClick={() => handlePrintTicket(order)} 
                      title="Imprimir Comanda Térmica"
                      style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '4px' }}
                    >
                      <Printer size={18} />
                    </button>
                    <div className={`kds-timer ${timerClass}`}>
                      <Clock size={16} />
                      <span>{elapsed}m</span>
                    </div>
                  </div>
                </div>

                {/* Linha do Cliente e Tipo de Pedido */}
                <div className="kds-customer-row">
                  <strong style={{ color: '#fff', fontSize: '1rem' }}>{order.customer.name}</strong>
                  <span style={{ 
                    fontSize: '0.78rem', 
                    padding: '3px 8px', 
                    borderRadius: '6px',
                    fontWeight: 700,
                    background: order.deliveryType === 'pickup' ? 'rgba(168, 85, 247, 0.2)' : 'rgba(59, 130, 246, 0.2)',
                    color: order.deliveryType === 'pickup' ? '#c084fc' : '#60a5fa'
                  }}>
                    {order.deliveryType === 'pickup' ? '🛍️ RETIRADA' : '🛵 ENTREGA'}
                  </span>
                </div>

                {/* Itens do Pedido */}
                <div className="kds-items-list">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="kds-item-row">
                      <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                        <span className="kds-item-qty">{item.quantity}</span>
                        <div style={{ flex: 1 }}>
                          <div className="kds-item-title">
                            {item.product?.name || item.name}
                          </div>

                          {/* Adicionais / Opções */}
                          {item.options && Object.keys(item.options).length > 0 && (
                            <div className="kds-item-options">
                              {Object.entries(item.options).map(([k, v]) => (
                                <span key={k} style={{ display: 'inline-block', marginRight: '8px' }}>
                                  • {k}: <strong>{v}</strong>
                                </span>
                              ))}
                            </div>
                          )}

                          {/* Observações da Cozinha com Destaque Máximo */}
                          {item.notes && (
                            <div className="kds-item-notes">
                              ⚠️ {item.notes}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Botões de Ação para a Cozinha com 1 toque */}
                <div className="kds-actions-bar">
                  {order.status === 'received' && (
                    <>
                      <button 
                        className="kds-btn kds-btn-prep"
                        style={{ gridColumn: 'span 2' }}
                        onClick={() => handleUpdateStatus(order.id, 'preparing')}
                      >
                        <Flame size={20} />
                        Começar Preparo 🔥
                      </button>
                    </>
                  )}

                  {order.status === 'preparing' && (
                    <>
                      <button 
                        className="kds-btn kds-btn-ready"
                        style={{ gridColumn: 'span 2' }}
                        onClick={() => handleUpdateStatus(order.id, 'ready')}
                      >
                        <CheckCircle size={20} />
                        Marcar Pronto 🟢
                      </button>
                    </>
                  )}

                  {order.status === 'ready' && (
                    <>
                      <button 
                        className="kds-btn kds-btn-deliver"
                        style={{ gridColumn: 'span 2' }}
                        onClick={() => handleUpdateStatus(order.id, 'delivering')}
                      >
                        <Bike size={20} />
                        {order.deliveryType === 'pickup' ? 'Entregar ao Cliente' : 'Chamar Entregador'}
                      </button>
                    </>
                  )}

                  {order.status === 'delivering' && (
                    <button 
                      className="kds-btn"
                      style={{ gridColumn: 'span 2', background: '#334155', color: '#cbd5e1' }}
                      onClick={() => handleUpdateStatus(order.id, 'completed')}
                    >
                      Concluir Pedido
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
