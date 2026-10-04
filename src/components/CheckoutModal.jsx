import React, { useState } from 'react';
import { X, MapPin, QrCode, CreditCard, DollarSign, ShoppingBag, ArrowLeft, Send, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { RESTAURANT_INFO } from '../data/products';

export default function CheckoutModal({
  isOpen,
  onClose,
  cartItems,
  subtotal,
  deliveryFee,
  discountAmount,
  finalTotal,
  onOrderPlaced
}) {
  if (!isOpen) return null;

  const [deliveryType, setDeliveryType] = useState('delivery'); // 'delivery' | 'pickup'
  const [paymentMethod, setPaymentMethod] = useState('pix'); // 'pix' | 'card' | 'cash'
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    street: '',
    number: '',
    neighborhood: '',
    complement: '',
    changeFor: ''
  });

  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Informe seu nome';
    if (!formData.phone.trim()) errs.phone = 'Informe seu WhatsApp';
    
    if (deliveryType === 'delivery') {
      if (!formData.street.trim()) errs.street = 'Informe a rua/avenida';
      if (!formData.number.trim()) errs.number = 'Número';
      if (!formData.neighborhood.trim()) errs.neighborhood = 'Bairro';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Pix 5% extra discount if pix selected
  const pixDiscount = paymentMethod === 'pix' ? finalTotal * 0.05 : 0;
  const grandTotal = finalTotal - pixDiscount;

  const handleSubmitOrder = (e) => {
    e.preventDefault();
    if (!validate()) return;

    // Trigger celebration confetti
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (err) {
      console.log('Confetti error:', err);
    }

    const orderId = `DEL-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder = {
      orderId,
      createdAt: new Date().toISOString(),
      items: cartItems,
      deliveryType,
      customer: formData,
      paymentMethod,
      subtotal,
      deliveryFee: deliveryType === 'pickup' ? 0 : deliveryFee,
      discountAmount,
      pixDiscount,
      grandTotal: deliveryType === 'pickup' ? grandTotal - deliveryFee : grandTotal,
      status: 'received' // 'received' -> 'preparing' -> 'delivering' -> 'completed'
    };

    onOrderPlaced(newOrder);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" style={{ maxWidth: '580px' }} onClick={(e) => e.stopPropagation()}>
        <div style={{ 
          padding: '20px 24px', 
          borderBottom: '1px solid var(--border-color)', 
          display: 'flex', 
          alignItems: 'center', 
          justify: 'space-between' 
        }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShoppingBag size={20} className="text-primary" />
            Finalizar Pedido
          </h2>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmitOrder} className="modal-body">
          {/* Step 1: Customer Data */}
          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '12px', color: 'var(--primary)' }}>
              1. Seus Dados de Contato
            </h3>
            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label">Nome Completo *</label>
                <input
                  type="text"
                  name="name"
                  className="form-input"
                  placeholder="Ex: Carlos Silva"
                  value={formData.name}
                  onChange={handleInputChange}
                />
                {errors.name && <span style={{ color: 'var(--danger)', fontSize: '0.75rem' }}>{errors.name}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">WhatsApp / Celular *</label>
                <input
                  type="text"
                  name="phone"
                  className="form-input"
                  placeholder="(11) 99999-9999"
                  value={formData.phone}
                  onChange={handleInputChange}
                />
                {errors.phone && <span style={{ color: 'var(--danger)', fontSize: '0.75rem' }}>{errors.phone}</span>}
              </div>
            </div>
          </div>

          {/* Step 2: Delivery vs Pickup */}
          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '12px', color: 'var(--primary)' }}>
              2. Forma de Entrega
            </h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '14px' }}>
              <div
                className={`payment-card ${deliveryType === 'delivery' ? 'active' : ''}`}
                onClick={() => setDeliveryType('delivery')}
              >
                <MapPin size={22} />
                <span>Receber em Casa (Delivery)</span>
              </div>
              
              <div
                className={`payment-card ${deliveryType === 'pickup' ? 'active' : ''}`}
                onClick={() => setDeliveryType('pickup')}
              >
                <ShoppingBag size={22} />
                <span>Retirar no Local (Grátis)</span>
              </div>
            </div>

            {deliveryType === 'delivery' ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '3fr 1fr', gap: '10px' }}>
                  <div className="form-group">
                    <label className="form-label">Rua / Avenida *</label>
                    <input
                      type="text"
                      name="street"
                      className="form-input"
                      placeholder="Ex: Av. Paulista"
                      value={formData.street}
                      onChange={handleInputChange}
                    />
                    {errors.street && <span style={{ color: 'var(--danger)', fontSize: '0.75rem' }}>{errors.street}</span>}
                  </div>

                  <div className="form-group">
                    <label className="form-label">Nº *</label>
                    <input
                      type="text"
                      name="number"
                      className="form-input"
                      placeholder="1500"
                      value={formData.number}
                      onChange={handleInputChange}
                    />
                    {errors.number && <span style={{ color: 'var(--danger)', fontSize: '0.75rem' }}>{errors.number}</span>}
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div className="form-group">
                    <label className="form-label">Bairro *</label>
                    <input
                      type="text"
                      name="neighborhood"
                      className="form-input"
                      placeholder="Ex: Bela Vista"
                      value={formData.neighborhood}
                      onChange={handleInputChange}
                    />
                    {errors.neighborhood && <span style={{ color: 'var(--danger)', fontSize: '0.75rem' }}>{errors.neighborhood}</span>}
                  </div>

                  <div className="form-group">
                    <label className="form-label">Complemento / Ref.</label>
                    <input
                      type="text"
                      name="complement"
                      className="form-input"
                      placeholder="Apto 42 / Bloco B"
                      value={formData.complement}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ 
                background: 'rgba(255, 255, 255, 0.03)', 
                padding: '12px 16px', 
                borderRadius: '8px', 
                fontSize: '0.85rem',
                color: 'var(--text-secondary)' 
              }}>
                📍 Endereço para retirada: <strong>{RESTAURANT_INFO.address}</strong>
                <br />⏱️ Tempo estimado para apronto: <strong>20 - 30 minutos</strong>
              </div>
            )}
          </div>

          {/* Step 3: Payment Method */}
          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '12px', color: 'var(--primary)' }}>
              3. Forma de Pagamento
            </h3>

            <div className="payment-options">
              <div
                className={`payment-card ${paymentMethod === 'pix' ? 'active' : ''}`}
                onClick={() => setPaymentMethod('pix')}
              >
                <QrCode size={22} />
                <span>Pix Instantâneo (5% OFF)</span>
              </div>

              <div
                className={`payment-card ${paymentMethod === 'card' ? 'active' : ''}`}
                onClick={() => setPaymentMethod('card')}
              >
                <CreditCard size={22} />
                <span>Cartão (Entregador)</span>
              </div>

              <div
                className={`payment-card ${paymentMethod === 'cash' ? 'active' : ''}`}
                onClick={() => setPaymentMethod('cash')}
              >
                <DollarSign size={22} />
                <span>Dinheiro</span>
              </div>
            </div>

            {paymentMethod === 'pix' && (
              <div style={{ 
                marginTop: '12px', 
                background: 'rgba(16, 185, 129, 0.08)', 
                border: '1px dashed rgba(16, 185, 129, 0.4)', 
                padding: '12px', 
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                fontSize: '0.85rem'
              }}>
                <CheckCircle2 size={20} style={{ color: 'var(--success)', flexShrink: 0 }} />
                <div>
                  <strong>Desconto de 5% ativado!</strong> Você economiza R$ {pixDiscount.toFixed(2).replace('.', ',')} pagando via QR Code Pix.
                </div>
              </div>
            )}

            {paymentMethod === 'cash' && (
              <div className="form-group" style={{ marginTop: '12px' }}>
                <label className="form-label">Troco para quanto?</label>
                <input
                  type="text"
                  name="changeFor"
                  className="form-input"
                  placeholder="Ex: Troco para R$ 100,00 ou Não preciso de troco"
                  value={formData.changeFor}
                  onChange={handleInputChange}
                />
              </div>
            )}
          </div>

          {/* Final Summary */}
          <div style={{ 
            background: 'var(--bg-main)', 
            padding: '16px', 
            borderRadius: '12px', 
            marginBottom: '20px',
            border: '1px solid var(--border-color)' 
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
              <span>Total dos Produtos</span>
              <span>R$ {subtotal.toFixed(2).replace('.', ',')}</span>
            </div>
            
            {deliveryType === 'delivery' && (
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                <span>Taxa de Entrega</span>
                <span>{deliveryFee === 0 ? 'GRÁTIS' : `R$ ${deliveryFee.toFixed(2).replace('.', ',')}`}</span>
              </div>
            )}

            {pixDiscount > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: 'var(--success)', marginBottom: '4px' }}>
                <span>Desconto Pix (5%)</span>
                <span>- R$ {pixDiscount.toFixed(2).replace('.', ',')}</span>
              </div>
            )}

            <div style={{ 
              display: 'flex', 
              justify: 'space-between', 
              fontSize: '1.25rem', 
              fontWeight: 800, 
              color: 'var(--primary)',
              marginTop: '8px',
              paddingTop: '8px',
              borderTop: '1px solid rgba(255,255,255,0.08)' 
            }}>
              <span>Valor Final</span>
              <span>R$ {grandTotal.toFixed(2).replace('.', ',')}</span>
            </div>
          </div>

          <button type="submit" className="checkout-btn">
            <Send size={18} />
            <span>Confirmar e Enviar Pedido</span>
          </button>
        </form>
      </div>
    </div>
  );
}
