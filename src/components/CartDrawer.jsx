import React, { useState } from 'react';
import { X, ShoppingBag, Trash2, Plus, Minus, ArrowRight, Tag, CheckCircle2 } from 'lucide-react';
import { RESTAURANT_INFO, PROMO_COUPONS } from '../data/products';

export default function CartDrawer({
  isOpen,
  onClose,
  cartItems,
  onUpdateQty,
  onRemoveItem,
  onClearCart,
  onProceedToCheckout,
  appliedCoupon,
  setAppliedCoupon
}) {
  if (!isOpen) return null;

  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState('');

  // Subtotal calculation
  const subtotal = cartItems.reduce((acc, item) => {
    return acc + (item.totalPrice || item.product.price * item.quantity);
  }, 0);

  // Delivery Fee calculation
  const deliveryFee = subtotal >= RESTAURANT_INFO.freeDeliveryMin ? 0 : RESTAURANT_INFO.deliveryFee;

  // Coupon discount calculation
  let discountAmount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountPercent) {
      discountAmount = (subtotal * appliedCoupon.discountPercent) / 100;
    } else if (appliedCoupon.discountValue) {
      discountAmount = appliedCoupon.discountValue;
    } else if (appliedCoupon.freeDelivery) {
      discountAmount = deliveryFee;
    }
  }

  const finalTotal = Math.max(0, subtotal + (appliedCoupon?.freeDelivery ? 0 : deliveryFee) - (appliedCoupon?.freeDelivery ? 0 : discountAmount));

  const handleApplyCoupon = () => {
    const code = couponCode.trim().toUpperCase();
    setCouponError('');

    if (!code) return;

    if (PROMO_COUPONS[code]) {
      const couponObj = PROMO_COUPONS[code];
      if (couponObj.minSubtotal && subtotal < couponObj.minSubtotal) {
        setCouponError(`Cupom válido apenas para compras acima de R$ ${couponObj.minSubtotal.toFixed(2)}`);
        return;
      }
      setAppliedCoupon({ code, ...couponObj });
      setCouponCode('');
    } else {
      setCouponError('Cupom inválido. Tente DELIVY10 ou PRIMEIRO');
    }
  };

  return (
    <div className="cart-drawer-overlay" onClick={onClose}>
      <div className="cart-drawer" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="cart-header">
          <h2>
            <ShoppingBag size={22} className="text-primary" />
            <span>Seu Carrinho ({cartItems.reduce((a, b) => a + b.quantity, 0)})</span>
          </h2>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="cart-body">
          {cartItems.length === 0 ? (
            <div className="empty-cart">
              <div className="empty-cart-icon">
                <ShoppingBag size={36} />
              </div>
              <h3>Seu carrinho está vazio</h3>
              <p>Adicione deliciosos itens do cardápio para fazer seu pedido!</p>
            </div>
          ) : (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Itens do Pedido</span>
                <button 
                  onClick={onClearCart} 
                  style={{ background: 'none', border: 'none', color: 'var(--danger)', fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                >
                  <Trash2 size={14} /> Esvaziar
                </button>
              </div>

              {cartItems.map((item, index) => {
                const itemSinglePrice = item.totalPrice ? item.totalPrice / item.quantity : item.product.price;
                return (
                  <div key={index} className="cart-item">
                    <img src={item.product.image} alt={item.product.name} className="cart-item-img" />
                    <div className="cart-item-info">
                      <div className="cart-item-title">{item.product.name}</div>
                      
                      {/* Render options & notes summary */}
                      {item.selectedOptions && Object.keys(item.selectedOptions).length > 0 && (
                        <div className="cart-item-details">
                          {Object.entries(item.selectedOptions).map(([key, val], oIdx) => {
                            if (Array.isArray(val)) {
                              return val.map((v, i) => <div key={i}>+ {v.name}</div>);
                            }
                            return <div key={oIdx}>• {typeof val === 'object' ? val.name : val}</div>;
                          })}
                        </div>
                      )}

                      {item.notes && (
                        <div className="cart-item-details" style={{ fontStyle: 'italic', color: 'var(--text-muted)' }}>
                          Obs: "{item.notes}"
                        </div>
                      )}

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
                        <div className="cart-item-price">
                          R$ {(itemSinglePrice * item.quantity).toFixed(2).replace('.', ',')}
                        </div>

                        <div className="qty-counter">
                          <button className="qty-btn" onClick={() => onUpdateQty(index, item.quantity - 1)}>
                            <Minus size={12} />
                          </button>
                          <span className="qty-count">{item.quantity}</span>
                          <button className="qty-btn" onClick={() => onUpdateQty(index, item.quantity + 1)}>
                            <Plus size={12} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <div className="cart-footer">
            {/* Coupon Section */}
            {!appliedCoupon ? (
              <div>
                <div className="coupon-row">
                  <input
                    type="text"
                    className="coupon-input"
                    placeholder="Possui cupom? (Ex: DELIVY10)"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                  />
                  <button className="coupon-btn" onClick={handleApplyCoupon}>
                    Aplicar
                  </button>
                </div>
                {couponError && <p style={{ color: 'var(--danger)', fontSize: '0.78rem', marginBottom: '10px' }}>{couponError}</p>}
              </div>
            ) : (
              <div style={{ 
                background: 'rgba(16, 185, 129, 0.1)', 
                border: '1px solid rgba(16, 185, 129, 0.3)', 
                padding: '10px 14px', 
                borderRadius: '8px', 
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--success)', fontSize: '0.85rem', fontWeight: 600 }}>
                  <CheckCircle2 size={16} />
                  <span>Cupom <strong>{appliedCoupon.code}</strong> aplicado!</span>
                </div>
                <button 
                  onClick={() => setAppliedCoupon(null)} 
                  style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '0.75rem', cursor: 'pointer', textDecoration: 'underline' }}
                >
                  Remover
                </button>
              </div>
            )}

            {/* Calculations Summary */}
            <div className="summary-row">
              <span>Subtotal</span>
              <span>R$ {subtotal.toFixed(2).replace('.', ',')}</span>
            </div>

            <div className="summary-row">
              <span>Taxa de Entrega</span>
              <span>
                {deliveryFee === 0 
                  ? <span style={{ color: 'var(--success)', fontWeight: 700 }}>GRÁTIS</span> 
                  : `R$ ${deliveryFee.toFixed(2).replace('.', ',')}`}
              </span>
            </div>

            {appliedCoupon && (
              <div className="summary-row" style={{ color: 'var(--success)' }}>
                <span>Desconto ({appliedCoupon.code})</span>
                <span>- R$ {discountAmount.toFixed(2).replace('.', ',')}</span>
              </div>
            )}

            <div className="summary-row total">
              <span>Total</span>
              <span>R$ {finalTotal.toFixed(2).replace('.', ',')}</span>
            </div>

            <button className="checkout-btn" onClick={onProceedToCheckout}>
              <span>Avançar para Checkout</span>
              <ArrowRight size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
