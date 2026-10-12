import React from 'react';
import { X, Gem, CheckCircle, Sparkles, Tag } from 'lucide-react';

export default function ClubVipModal({ isOpen, onClose, onApplyCoupon }) {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-sheet-content club-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-sheet-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div className="club-modal-badge">
              <Gem size={20} color="#9333ea" />
            </div>
            <h3>Clube Delivy VIP</h3>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="club-content-body">
          <div className="club-banner-highlight">
            <span className="club-vip-tag">MEMBRO DIAMOND</span>
            <h4>Você economiza mais em todos os pedidos!</h4>
            <p>Aproveite cupons semanais de até 25% OFF e taxa grátis nas melhores padarias e restaurantes.</p>
          </div>

          <div className="club-benefits-list">
            <div className="benefit-row">
              <CheckCircle size={18} color="#10b981" />
              <span>Frete Grátis ilimitado em pedidos acima de R$ 50</span>
            </div>
            <div className="benefit-row">
              <CheckCircle size={18} color="#10b981" />
              <span>5 Cupons mensais de R$ 10 OFF</span>
            </div>
            <div className="benefit-row">
              <CheckCircle size={18} color="#10b981" />
              <span>Acesso prioritário a promoções relâmpago</span>
            </div>
          </div>

          <div className="club-coupons-available">
            <span className="subhead">Seus cupons ativos do Clube:</span>
            <div className="coupon-chip-card" onClick={() => { onApplyCoupon && onApplyCoupon('DELIVY10'); onClose(); }}>
              <Tag size={16} color="#9333ea" />
              <div>
                <strong>DELIVY10</strong>
                <span>10% OFF em qualquer pedido hoje</span>
              </div>
              <button className="use-coupon-btn">Usar</button>
            </div>
            <div className="coupon-chip-card" onClick={() => { onApplyCoupon && onApplyCoupon('FRETEGRATIS'); onClose(); }}>
              <Tag size={16} color="#10b981" />
              <div>
                <strong>FRETEGRATIS</strong>
                <span>Entrega grátis sem valor mínimo</span>
              </div>
              <button className="use-coupon-btn">Usar</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
