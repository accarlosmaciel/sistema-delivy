import React from 'react';
import { Home, Search, ReceiptText, User } from 'lucide-react';

export default function BottomNavBar({ 
  activeTab = 'inicio', 
  onSelectTab,
  activeOrderCount = 0,
  hasProfileNotification = true
}) {
  return (
    <nav className="bottom-nav-bar">
      <button 
        className={`nav-tab-item ${activeTab === 'inicio' ? 'active' : ''}`}
        onClick={() => onSelectTab('inicio')}
        aria-label="Início"
      >
        <Home size={22} className="nav-tab-icon" fill={activeTab === 'inicio' ? 'currentColor' : 'none'} />
        <span className="nav-tab-label">Início</span>
      </button>

      <button 
        className={`nav-tab-item ${activeTab === 'busca' ? 'active' : ''}`}
        onClick={() => onSelectTab('busca')}
        aria-label="Busca"
      >
        <Search size={22} className="nav-tab-icon" />
        <span className="nav-tab-label">Busca</span>
      </button>

      <button 
        className={`nav-tab-item ${activeTab === 'pedidos' ? 'active' : ''}`}
        onClick={() => onSelectTab('pedidos')}
        aria-label="Pedidos"
      >
        <div className="nav-icon-relative">
          <ReceiptText size={22} className="nav-tab-icon" />
          {activeOrderCount > 0 && (
            <span className="nav-badge-count">{activeOrderCount}</span>
          )}
        </div>
        <span className="nav-tab-label">Pedidos</span>
      </button>

      <button 
        className={`nav-tab-item ${activeTab === 'perfil' ? 'active' : ''}`}
        onClick={() => onSelectTab('perfil')}
        aria-label="Perfil"
      >
        <div className="nav-icon-relative">
          <User size={22} className="nav-tab-icon" />
          {hasProfileNotification && (
            <span className="nav-dot-badge" />
          )}
        </div>
        <span className="nav-tab-label">Perfil</span>
      </button>
    </nav>
  );
}
