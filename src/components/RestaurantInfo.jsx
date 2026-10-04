import React from 'react';
import { Star, Clock, MapPin, Truck, Info } from 'lucide-react';
import { RESTAURANT_INFO } from '../data/products';

export default function RestaurantInfo({ cartSubtotal }) {
  const freeDeliveryMin = RESTAURANT_INFO.freeDeliveryMin;
  const progressPercent = Math.min(100, (cartSubtotal / freeDeliveryMin) * 100);
  const remainingForFreeDelivery = Math.max(0, freeDeliveryMin - cartSubtotal);

  return (
    <>
      <div 
        className="restaurant-hero" 
        style={{ backgroundImage: `url(${RESTAURANT_INFO.bannerImage})` }}
      />
      
      <div className="restaurant-info-card">
        <img 
          src={RESTAURANT_INFO.logoImage} 
          alt={RESTAURANT_INFO.name} 
          className="restaurant-avatar" 
        />
        
        <div className="restaurant-details">
          <h1>{RESTAURANT_INFO.name}</h1>
          <p>{RESTAURANT_INFO.tagline}</p>
          
          <div className="meta-row">
            <div className="meta-item">
              <Clock size={14} />
              <span>{RESTAURANT_INFO.deliveryTime}</span>
            </div>
            <div className="meta-item">
              <Truck size={14} />
              <span>Taxa: R$ {RESTAURANT_INFO.deliveryFee.toFixed(2).replace('.', ',')}</span>
            </div>
            <div className="meta-item">
              <MapPin size={14} />
              <span>{RESTAURANT_INFO.address}</span>
            </div>
          </div>
        </div>

        <div className="rating-badge">
          <div className="rating-score">
            <Star size={18} fill="#FFB800" color="#FFB800" />
            <span>{RESTAURANT_INFO.rating}</span>
          </div>
          <span className="rating-count">({RESTAURANT_INFO.reviewsCount}+ avaliações)</span>
        </div>

        {/* Free Delivery Bar */}
        <div style={{ 
          gridColumn: '1 / -1', 
          marginTop: '12px', 
          paddingTop: '16px', 
          borderTop: '1px solid rgba(255,255,255,0.06)' 
        }}>
          <div style={{ 
            display: 'flex', 
            justify: 'space-between', 
            fontSize: '0.85rem', 
            marginBottom: '6px',
            color: 'var(--text-secondary)'
          }}>
            <span>
              {remainingForFreeDelivery === 0 
                ? '🎉 Parabéns! Você ganhou FRETE GRÁTIS!' 
                : `Faltam R$ ${remainingForFreeDelivery.toFixed(2).replace('.', ',')} para FRETE GRÁTIS!`}
            </span>
            <span style={{ fontWeight: 700, color: 'var(--primary)' }}>
              R$ {cartSubtotal.toFixed(2).replace('.', ',')} / R$ {freeDeliveryMin.toFixed(2)}
            </span>
          </div>
          <div style={{ 
            width: '100%', 
            height: '6px', 
            background: 'rgba(255,255,255,0.08)', 
            borderRadius: '99px', 
            overflow: 'hidden' 
          }}>
            <div style={{ 
              width: `${progressPercent}%`, 
              height: '100%', 
              background: progressPercent >= 100 ? 'var(--success)' : 'linear-gradient(90deg, var(--primary), var(--secondary))', 
              transition: 'width 0.4s ease' 
            }} />
          </div>
        </div>
      </div>
    </>
  );
}
