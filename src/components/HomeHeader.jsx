import React from 'react';
import { ChevronDown, Bell, Gem, ShoppingBag } from 'lucide-react';

export default function HomeHeader({ 
  currentAddress = "R. RSP 24, 35", 
  userName = "Carlos",
  unreadNotifications = 1,
  onOpenAddress,
  onOpenClub,
  onOpenNotifications,
  cartCount = 0,
  cartTotal = 0,
  onOpenCart
}) {
  return (
    <header className="home-top-bar">
      <div className="home-user-location" onClick={onOpenAddress} role="button" tabIndex={0}>
        <span className="greeting-text">Bom dia, {userName}</span>
        <div className="address-selector">
          <span className="address-text">{currentAddress}</span>
          <ChevronDown size={16} className="chevron-icon" />
        </div>
      </div>

      <div className="home-top-actions">
        {/* Clube Delivy Diamond Button */}
        <button 
          className="club-badge-btn" 
          onClick={onOpenClub}
          title="Clube Delivy VIP"
          aria-label="Clube Delivy VIP"
        >
          <Gem size={20} className="gem-icon" />
        </button>

        {/* Notifications Bell */}
        <button 
          className="notification-bell-btn" 
          onClick={onOpenNotifications}
          title="Notificações e Cupons"
          aria-label="Notificações"
        >
          <Bell size={20} className="bell-icon" />
          {unreadNotifications > 0 && (
            <span className="notification-badge">{unreadNotifications}</span>
          )}
        </button>

        {/* Cart Quick Button (shown if items exist) */}
        {cartCount > 0 && (
          <button 
            className="header-cart-pill"
            onClick={onOpenCart}
            title="Ver Carrinho"
          >
            <ShoppingBag size={18} />
            <span className="cart-pill-badge">{cartCount}</span>
          </button>
        )}
      </div>
    </header>
  );
}
