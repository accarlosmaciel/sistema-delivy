import React from 'react';
import { ShoppingBag, Search, Clock, MapPin, PackageCheck } from 'lucide-react';
import { RESTAURANT_INFO } from '../data/products';

export default function Header({ 
  cartCount, 
  cartTotal, 
  onOpenCart, 
  onOpenTracker, 
  activeOrder,
  searchTerm, 
  setSearchTerm 
}) {
  return (
    <header className="top-bar-sticky">
      <div className="brand-wrapper">
        <img 
          src={RESTAURANT_INFO.logoImage} 
          alt={RESTAURANT_INFO.name} 
          className="brand-logo"
        />
        <div>
          <div className="brand-title">
            {RESTAURANT_INFO.name}
            <span className="badge-open">
              <span className="badge-open-dot"></span>
              {RESTAURANT_INFO.status}
            </span>
          </div>
        </div>
      </div>

      <div className="header-actions">
        {activeOrder && (
          <button 
            className="cart-btn" 
            style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}
            onClick={onOpenTracker}
            title="Acompanhar Pedido em Andamento"
          >
            <PackageCheck size={18} />
            <span className="desktop-only">Ver Pedido</span>
          </button>
        )}

        <button className="cart-btn" onClick={onOpenCart}>
          <ShoppingBag size={18} />
          <span>R$ {cartTotal.toFixed(2).replace('.', ',')}</span>
          {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
        </button>
      </div>
    </header>
  );
}
