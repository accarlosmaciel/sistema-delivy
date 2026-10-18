'use client';

import React from 'react';
import { Smartphone, ChefHat, LayoutDashboard, Lock, LogOut, ShieldCheck } from 'lucide-react';

export default function ViewSwitcherBar({ activeView, onViewChange, isAdmin, adminUser, onOpenLogin, onLogout }) {
  // Se não estiver logado como admin, mostra apenas um botão discreto de acesso seguro
  if (!isAdmin) {
    return (
      <div className="view-switcher-locked-container">
        <button
          type="button"
          className="view-switcher-lock-btn"
          onClick={onOpenLogin}
          title="Acesso exclusivo para administradores e equipe"
        >
          <Lock size={14} />
          <span>Área do Gestor</span>
        </button>
      </div>
    );
  }

  return (
    <div className="view-switcher-pill" role="navigation" aria-label="Alternar Visões do Sistema">
      <div className="view-switcher-admin-badge" title={`Logado como: ${adminUser?.name || 'Admin'}`}>
        <ShieldCheck size={14} color="#f97316" />
        <span className="view-switcher-admin-name">{adminUser?.name?.split(' ')[0] || 'Admin'}</span>
      </div>

      <button
        type="button"
        className={`view-switcher-btn ${activeView === 'client' ? 'active' : ''}`}
        onClick={() => onViewChange('client')}
      >
        <Smartphone size={16} />
        <span>Cardápio</span>
      </button>

      <button
        type="button"
        className={`view-switcher-btn ${activeView === 'kitchen' ? 'active' : ''}`}
        onClick={() => onViewChange('kitchen')}
      >
        <ChefHat size={16} />
        <span>Cozinha TV</span>
      </button>

      <button
        type="button"
        className={`view-switcher-btn ${activeView === 'admin' ? 'active' : ''}`}
        onClick={() => onViewChange('admin')}
      >
        <LayoutDashboard size={16} />
        <span>Painel Gestor</span>
      </button>

      <button
        type="button"
        className="view-switcher-logout-btn"
        onClick={onLogout}
        title="Sair do modo Administrador"
      >
        <LogOut size={15} />
        <span>Sair</span>
      </button>
    </div>
  );
}

