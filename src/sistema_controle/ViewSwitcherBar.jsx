'use client';

import React from 'react';
import { Smartphone, ChefHat, LayoutDashboard } from 'lucide-react';

export default function ViewSwitcherBar({ activeView, onViewChange }) {
  return (
    <div className="view-switcher-pill" role="navigation" aria-label="Alternar Visões do Sistema">
      <span style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 800, paddingLeft: '6px', letterSpacing: '0.04em' }}>
        Alternar Visão:
      </span>

      <button
        type="button"
        className={`view-switcher-btn ${activeView === 'client' ? 'active' : ''}`}
        onClick={() => onViewChange('client')}
      >
        <Smartphone size={16} />
        <span>Cardápio Cliente</span>
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
    </div>
  );
}
