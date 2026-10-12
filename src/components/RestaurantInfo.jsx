import React, { useState } from 'react';
import { Star, Clock, MapPin, Truck, ChevronRight, Sparkles, CheckCircle2, Ticket, Heart, Share2, Info, X } from 'lucide-react';
import { RESTAURANT_INFO, PROMO_COUPONS } from '../data/products';

export default function RestaurantInfo({ cartSubtotal = 0, onApplyCoupon }) {
  const [showStoreInfo, setShowStoreInfo] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);

  const freeDeliveryMin = RESTAURANT_INFO.freeDeliveryMin || 70.0;
  const progressPercent = Math.min(100, (cartSubtotal / freeDeliveryMin) * 100);
  const remainingForFreeDelivery = Math.max(0, freeDeliveryMin - cartSubtotal);

  return (
    <div className="premium-restaurant-header">
      {/* 1. Hero Cover Banner with Visual Gradient & Floating Actions */}
      <div 
        className="premium-hero-cover"
        style={{ backgroundImage: `url(${RESTAURANT_INFO.bannerImage})` }}
      >
        <div className="hero-gradient-overlay" />
        
        {/* Floating Quick Badges on Banner */}
        <div className="hero-floating-top">
          <div className="badge-store-status">
            <span className="pulse-green-dot" />
            <span>Aberto agora</span>
          </div>

          <div className="hero-action-buttons">
            <button 
              className={`hero-icon-circle-btn ${isFavorited ? 'favorited' : ''}`}
              onClick={() => setIsFavorited(!isFavorited)}
              title="Favoritar loja"
              aria-label="Favoritar loja"
            >
              <Heart size={16} fill={isFavorited ? '#ea1d2c' : 'none'} color={isFavorited ? '#ea1d2c' : '#ffffff'} />
            </button>
            <button 
              className="hero-icon-circle-btn"
              onClick={() => setShowStoreInfo(true)}
              title="Ver detalhes da loja"
              aria-label="Detalhes da loja"
            >
              <Info size={16} color="#ffffff" />
            </button>
          </div>
        </div>
      </div>

      {/* 2. Restaurant Card */}
      <div className="premium-restaurant-card">
        {/* Top Identity Row: Avatar + Title & Category */}
        <div className="restaurant-brand-row">
          <div className="restaurant-avatar-wrap">
            <img 
              src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=300&q=80" 
              alt={RESTAURANT_INFO.name} 
              className="restaurant-avatar-img"
            />
            <span className="verified-gold-badge" title="Loja Verificada Delivy Super">✓</span>
          </div>

          <div className="restaurant-title-box">
            <div className="title-verified-line">
              <h1 className="restaurant-main-name">{RESTAURANT_INFO.name}</h1>
            </div>
            <p className="restaurant-subcategories">
              Hambúrgueres Artesanais • Pizzas Especiais • Sobremesas
            </p>
          </div>
        </div>

        {/* 3. Essential Metrics Bar (Rating, Time, Delivery, Distance) */}
        <div className="restaurant-metrics-grid">
          <div className="metric-pill rating-highlight">
            <Star size={15} fill="#f59e0b" color="#f59e0b" />
            <strong>{RESTAURANT_INFO.rating}</strong>
            <span className="eval-count">({RESTAURANT_INFO.reviewsCount}+)</span>
          </div>

          <div className="metric-pill">
            <Clock size={15} color="#ea1d2c" />
            <span>{RESTAURANT_INFO.deliveryTime}</span>
          </div>

          <div className="metric-pill">
            <Truck size={15} color="#10b981" />
            <span>R$ {RESTAURANT_INFO.deliveryFee.toFixed(2).replace('.', ',')}</span>
          </div>

          <div className="metric-pill" onClick={() => setShowStoreInfo(true)} role="button">
            <MapPin size={15} color="#6366f1" />
            <span>1,2 km</span>
          </div>
        </div>

        {/* 4. Gamified Free Delivery Progress Bar */}
        <div className="free-delivery-tracker-box">
          <div className="tracker-header">
            <div className="tracker-title-row">
              <div className="tracker-icon-circle">
                {progressPercent >= 100 ? (
                  <CheckCircle2 size={16} color="#10b981" />
                ) : (
                  <Truck size={16} color="#ea1d2c" />
                )}
              </div>
              <span className="tracker-label">
                {progressPercent >= 100 ? (
                  <strong className="success-text">Parabéns! Você desbloqueou FRETE GRÁTIS! 🎉</strong>
                ) : (
                  <span>
                    Faltam <strong>R$ {remainingForFreeDelivery.toFixed(2).replace('.', ',')}</strong> para <strong>Frete Grátis</strong>
                  </span>
                )}
              </span>
            </div>

            <span className="tracker-progress-digits">
              R$ {cartSubtotal.toFixed(2).replace('.', ',')} / R$ {freeDeliveryMin.toFixed(2).replace('.', ',')}
            </span>
          </div>

          {/* Progress Bar Track */}
          <div className="tracker-bar-track">
            <div 
              className={`tracker-bar-fill ${progressPercent >= 100 ? 'complete' : ''}`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* 5. Special Active Coupon Banner */}
        <div className="active-coupon-chip" onClick={() => onApplyCoupon && onApplyCoupon('DELIVY10')}>
          <div className="coupon-left">
            <div className="coupon-ticket-icon">
              <Ticket size={16} color="#ea1d2c" />
            </div>
            <div className="coupon-text">
              <span className="coupon-code">DELIVY10</span>
              <span className="coupon-desc">10% OFF no seu pedido com cupom</span>
            </div>
          </div>
          <span className="coupon-apply-action">Aplicar</span>
        </div>
      </div>

      {/* Store Info Details Modal */}
      {showStoreInfo && (
        <div className="modal-backdrop" onClick={() => setShowStoreInfo(false)}>
          <div className="modal-sheet-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-sheet-header">
              <h3>Sobre {RESTAURANT_INFO.name}</h3>
              <button className="modal-close-btn" onClick={() => setShowStoreInfo(false)}>
                <X size={20} />
              </button>
            </div>

            <div className="store-details-modal-body">
              <div className="info-section-item">
                <Clock size={18} color="#ea1d2c" />
                <div>
                  <strong>Horário de Funcionamento</strong>
                  <p>{RESTAURANT_INFO.openingHours} (Segunda a Domingo)</p>
                </div>
              </div>

              <div className="info-section-item">
                <MapPin size={18} color="#ea1d2c" />
                <div>
                  <strong>Endereço</strong>
                  <p>{RESTAURANT_INFO.address}</p>
                </div>
              </div>

              <div className="info-section-item">
                <Truck size={18} color="#ea1d2c" />
                <div>
                  <strong>Tempo e Entrega</strong>
                  <p>{RESTAURANT_INFO.deliveryTime} • Taxa padrão de R$ {RESTAURANT_INFO.deliveryFee.toFixed(2).replace('.', ',')}</p>
                  <p style={{ fontSize: '0.8rem', color: '#10b981', marginTop: '2px' }}>Frete grátis em compras acima de R$ 70,00</p>
                </div>
              </div>

              <div className="info-section-item">
                <Star size={18} color="#f59e0b" />
                <div>
                  <strong>Avaliações dos Clientes</strong>
                  <p>⭐ {RESTAURANT_INFO.rating} de 5.0 baseado em mais de {RESTAURANT_INFO.reviewsCount} pedidos entregues.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
