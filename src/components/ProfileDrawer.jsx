import React from 'react';
import { X, User, Heart, CreditCard, MapPin, Gift, Settings, ShieldCheck, LogOut, Lock } from 'lucide-react';

export default function ProfileDrawer({ isOpen, onClose, userName = "Carlos", currentAddress = "R. RSP 24, 35", onOpenAddress, onOpenClub, onOpenAdminLogin }) {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-sheet-content profile-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-sheet-header">
          <h3>Meu Perfil</h3>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="profile-header-card">
          <div className="profile-avatar">
            <User size={30} color="#ffffff" />
          </div>
          <div className="profile-user-info">
            <h4>{userName}</h4>
            <p>carlos@delivy.com.br</p>
            <span className="profile-tier-badge" onClick={() => { onOpenClub && onOpenClub(); onClose(); }}>
              💎 Membro VIP Delivy
            </span>
          </div>
        </div>

        <div className="profile-menu-links">
          <div className="profile-menu-item" onClick={() => { onOpenAddress && onOpenAddress(); onClose(); }}>
            <MapPin size={20} />
            <div className="menu-text">
              <strong>Meus Endereços</strong>
              <span>{currentAddress}</span>
            </div>
          </div>

          <div className="profile-menu-item" onClick={() => { onOpenClub && onOpenClub(); onClose(); }}>
            <Gift size={20} />
            <div className="menu-text">
              <strong>Cupons & Benefícios</strong>
              <span>3 cupons disponíveis</span>
            </div>
          </div>

          <div className="profile-menu-item">
            <CreditCard size={20} />
            <div className="menu-text">
              <strong>Formas de Pagamento</strong>
              <span>Pix, Cartão de Crédito e VR</span>
            </div>
          </div>

          <div className="profile-menu-item">
            <Heart size={20} />
            <div className="menu-text">
              <strong>Favoritos</strong>
              <span>Lojas e pratos salvos</span>
            </div>
          </div>

          <div className="profile-menu-item">
            <ShieldCheck size={20} />
            <div className="menu-text">
              <strong>Segurança e Privacidade</strong>
              <span>Dados protegidos</span>
            </div>
          </div>

          {/* Acesso exclusivo do Gestor / Restaurante */}
          <div 
            className="profile-menu-item" 
            style={{ 
              marginTop: '12px', 
              background: 'linear-gradient(135deg, rgba(234, 88, 12, 0.1) 0%, rgba(220, 38, 38, 0.05) 100%)',
              border: '1px solid rgba(234, 88, 12, 0.25)',
              borderRadius: '12px'
            }} 
            onClick={() => { 
              if (onOpenAdminLogin) onOpenAdminLogin(); 
              onClose(); 
            }}
          >
            <Lock size={20} color="#ea580c" />
            <div className="menu-text">
              <strong style={{ color: '#ea580c' }}>Área do Dono / Gestão</strong>
              <span>Acesso restrito com senha</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
