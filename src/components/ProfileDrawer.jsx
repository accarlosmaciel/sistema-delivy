import React from 'react';
import { X, User, Heart, CreditCard, MapPin, Gift, Settings, ShieldCheck, LogOut } from 'lucide-react';

export default function ProfileDrawer({ isOpen, onClose, userName = "Carlos", currentAddress = "R. RSP 24, 35", onOpenAddress, onOpenClub }) {
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
        </div>
      </div>
    </div>
  );
}
