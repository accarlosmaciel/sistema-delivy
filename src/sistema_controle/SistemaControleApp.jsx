'use client';

import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  ChefHat, 
  Package, 
  Tag, 
  Users, 
  Wallet, 
  ShoppingBag, 
  Menu, 
  X, 
  Bell, 
  Sparkles, 
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Store
} from 'lucide-react';
import Dashboard from './Dashboard';
import TelaCozinhaKDS from './TelaCozinhaKDS';
import ProdutosManager from './ProdutosManager';
import PromocoesManager from './PromocoesManager';
import UsuariosManager from './UsuariosManager';
import ControleFinanceiro from './ControleFinanceiro';
import { CentralStore } from './store';
import './sistema_controle.css';

export default function SistemaControleApp({ initialTab = 'dashboard', onNavigateToClient }) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [currentUser, setCurrentUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [toastMessage, setToastMessage] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const reloadStoreData = () => {
    setCurrentUser(CentralStore.getCurrentUser());
    setOrders(CentralStore.getOrders());
  };

  useEffect(() => {
    reloadStoreData();
    const unsub = CentralStore.subscribe(() => {
      reloadStoreData();
    });
    return unsub;
  }, []);

  const showNotification = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage('');
    }, 3800);
  };

  const handleSwitchUser = (user) => {
    CentralStore.setCurrentUser(user);
    setCurrentUser(user);
    showNotification(`Sessão alterada para ${user.name} (${user.role.toUpperCase()})`);
  };

  const activeOrdersInKitchen = orders.filter(
    o => o.status === 'received' || o.status === 'preparing' || o.status === 'ready'
  );

  // Se a aba selecionada for a Cozinha KDS em modo TV dedicado
  if (activeTab === 'cozinha') {
    return (
      <TelaCozinhaKDS onNavigateBack={() => setActiveTab('dashboard')} />
    );
  }

  return (
    <div className="admin-shell">
      {/* Toast Notifier */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '24px',
          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
          color: '#fff',
          padding: '12px 20px',
          borderRadius: '10px',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
          zIndex: 99999,
          fontWeight: 700,
          fontSize: '0.9rem',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          animation: 'slideInRight 0.3s ease'
        }}>
          <Sparkles size={18} />
          {toastMessage}
        </div>
      )}

      {/* Sidebar Lateral */}
      <aside className={`admin-sidebar ${isMobileMenuOpen ? 'open' : ''}`}>
        {/* Topo Sidebar */}
        <div className="admin-sidebar-header">
          <div className="admin-logo-badge">
            <Store size={22} />
          </div>
          <div style={{ flex: 1 }}>
            <h1 style={{ fontSize: '1.15rem', fontWeight: 900, color: '#fff', lineHeight: 1.2 }}>
              Delivy <span style={{ color: '#ea580c' }}>Gestor</span>
            </h1>
            <span style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Sistema de Controle
            </span>
          </div>
          {isMobileMenuOpen && (
            <button 
              onClick={() => setIsMobileMenuOpen(false)}
              style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
            >
              <X size={20} />
            </button>
          )}
        </div>

        {/* Itens de Navegação */}
        <nav className="admin-nav">
          <button 
            className={`admin-nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => { setActiveTab('dashboard'); setIsMobileMenuOpen(false); }}
          >
            <LayoutDashboard size={20} />
            <span>Dashboard Geral</span>
          </button>

          <button 
            className={`admin-nav-item ${activeTab === 'cozinha' ? 'active' : ''}`}
            onClick={() => { setActiveTab('cozinha'); setIsMobileMenuOpen(false); }}
          >
            <ChefHat size={20} />
            <span>Cozinha TV (KDS)</span>
            {activeOrdersInKitchen.length > 0 && (
              <span className="admin-nav-badge" style={{ background: '#ea580c', color: '#fff' }}>
                {activeOrdersInKitchen.length} no fogo
              </span>
            )}
          </button>

          <button 
            className={`admin-nav-item ${activeTab === 'produtos' ? 'active' : ''}`}
            onClick={() => { setActiveTab('produtos'); setIsMobileMenuOpen(false); }}
          >
            <Package size={20} />
            <span>Produtos & Estoque</span>
          </button>

          <button 
            className={`admin-nav-item ${activeTab === 'promocoes' ? 'active' : ''}`}
            onClick={() => { setActiveTab('promocoes'); setIsMobileMenuOpen(false); }}
          >
            <Tag size={20} />
            <span>Promoções & Cupons</span>
          </button>

          <button 
            className={`admin-nav-item ${activeTab === 'usuarios' ? 'active' : ''}`}
            onClick={() => { setActiveTab('usuarios'); setIsMobileMenuOpen(false); }}
          >
            <Users size={20} />
            <span>Clientes & Permissões</span>
          </button>

          <button 
            className={`admin-nav-item ${activeTab === 'financeiro' ? 'active' : ''}`}
            onClick={() => { setActiveTab('financeiro'); setIsMobileMenuOpen(false); }}
          >
            <Wallet size={20} />
            <span>Controle Financeiro</span>
          </button>
        </nav>

        {/* Card do Usuário Logado */}
        <div className="admin-user-card">
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '50%',
            background: currentUser?.role === 'superadmin' ? '#6d28d9' : '#ea580c',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 800,
            color: '#fff',
            fontSize: '0.95rem'
          }}>
            {currentUser?.name ? currentUser.name.charAt(0) : 'A'}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {currentUser?.name || 'Carlos Maciel'}
            </div>
            <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
              {currentUser?.role === 'superadmin' ? '🛡️ Superadmin' : '🏪 Dono da Loja'}
            </div>
          </div>
        </div>
      </aside>

      {/* Área Principal de Conteúdo */}
      <main className="admin-main">
        {/* Barra Superior */}
        <header className="admin-topbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <button 
              className="btn-outline-adm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              style={{ display: 'md-none', padding: '6px' }}
            >
              <Menu size={20} />
            </button>
            <div className="admin-topbar-title">
              {activeTab === 'dashboard' && 'Dashboard Operacional'}
              {activeTab === 'produtos' && 'Catálogo de Produtos & Controle de Estoque'}
              {activeTab === 'promocoes' && 'Promoções, Descontos e Cupons'}
              {activeTab === 'usuarios' && 'Gestão de Clientes, Superadmin & Dono'}
              {activeTab === 'financeiro' && 'Balanço Financeiro & Fechamento de Caixa'}
            </div>
          </div>

          {/* Ações da Topbar */}
          <div className="admin-topbar-actions">
            {/* Atalho para Cardápio do Cliente */}
            {onNavigateToClient && (
              <button 
                onClick={onNavigateToClient}
                className="btn-outline-adm"
                style={{ borderColor: 'rgba(56, 189, 248, 0.4)', color: '#38bdf8' }}
              >
                <ShoppingBag size={16} />
                <span>Ver Cardápio do Cliente</span>
              </button>
            )}

            {/* Botão de Ir para Cozinha TV */}
            <button 
              onClick={() => setActiveTab('cozinha')}
              className="btn-primary-adm"
              style={{ padding: '8px 14px', fontSize: '0.85rem' }}
            >
              <ChefHat size={16} />
              <span>Modo Cozinha TV</span>
            </button>
          </div>
        </header>

        {/* Conteúdo da Aba */}
        <div className="admin-content">
          {activeTab === 'dashboard' && <Dashboard onNavigateTab={setActiveTab} />}
          {activeTab === 'produtos' && <ProdutosManager onNotify={showNotification} />}
          {activeTab === 'promocoes' && <PromocoesManager onNotify={showNotification} />}
          {activeTab === 'usuarios' && (
            <UsuariosManager 
              currentUser={currentUser} 
              onSwitchUser={handleSwitchUser} 
              onNotify={showNotification} 
            />
          )}
          {activeTab === 'financeiro' && <ControleFinanceiro onNotify={showNotification} />}
        </div>
      </main>
    </div>
  );
}
