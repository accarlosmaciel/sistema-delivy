import React, { useState, useEffect } from 'react';
import { X, CheckCircle, Clock, ChefHat, Bike, Home, MessageCircle, Copy, Check, RefreshCw } from 'lucide-react';
import { RESTAURANT_INFO } from '../data/products';

export default function OrderTrackerModal({ isOpen, onClose, order, onNewOrder }) {
  // Simulate status progression over time for demonstration
  const [currentStep, setCurrentStep] = useState(1); // 0: recebido, 1: preparando, 2: em transito, 3: entregue
  const [copied, setCopied] = useState(false);
  const [minutesLeft, setMinutesLeft] = useState(35);

  useEffect(() => {
    if (!isOpen || !order) return;
    const timer = setInterval(() => {
      setMinutesLeft((prev) => (prev > 1 ? prev - 1 : 1));
    }, 60000); // Reduce every minute

    return () => clearInterval(timer);
  }, [isOpen, order]);

  if (!isOpen || !order) return null;

  const steps = [
    { label: 'Recebido', icon: <CheckCircle size={18} /> },
    { label: 'Preparando', icon: <ChefHat size={18} /> },
    { label: 'Em Trânsito', icon: <Bike size={18} /> },
    { label: 'Entregue', icon: <Home size={18} /> }
  ];

  // Generate WhatsApp order message string
  const formatWhatsAppMessage = () => {
    let msg = `*DELIVY GOURMET - NOVO PEDIDO: #${order.orderId}*\n`;
    msg += `*Cliente:* ${order.customer.name} (${order.customer.phone})\n`;
    msg += `*Entrega:* ${order.deliveryType === 'delivery' ? 'Delivery' : 'Retirada no Local'}\n`;
    if (order.deliveryType === 'delivery') {
      msg += `*Endereço:* ${order.customer.street}, ${order.customer.number} - ${order.customer.neighborhood}`;
      if (order.customer.complement) msg += ` (${order.customer.complement})`;
      msg += `\n`;
    }
    msg += `*Pagamento:* ${order.paymentMethod.toUpperCase()}\n\n`;
    msg += `*ITENS DO PEDIDO:*\n`;

    order.items.forEach((item) => {
      msg += `• ${item.quantity}x ${item.product.name} - R$ ${(item.totalPrice || item.product.price * item.quantity).toFixed(2)}\n`;
      if (item.notes) msg += `   Obs: ${item.notes}\n`;
    });

    msg += `\n*TOTAL FINAL: R$ ${order.grandTotal.toFixed(2)}*`;
    return encodeURIComponent(msg);
  };

  const whatsappUrl = `https://wa.me/5511998765432?text=${formatWhatsAppMessage()}`;

  const handleCopyPix = () => {
    navigator.clipboard.writeText(`00020126580014br.gov.bcb.pix0136delivy-pix-key-${order.orderId}5204000053039865405${order.grandTotal.toFixed(2)}5802BR5925Delivy Gourmet Craft Burger6009SAO PAULO62070503***6304`);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" style={{ maxWidth: '580px' }} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={{ 
          padding: '20px 24px', 
          borderBottom: '1px solid var(--border-color)',
          display: 'flex', 
          alignItems: 'center', 
          justify: 'space-between',
          background: 'linear-gradient(135deg, rgba(255,107,0,0.1) 0%, rgba(15,23,42,0) 100%)'
        }}>
          <div>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Acompanhamento de Pedido
            </span>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--primary)' }}>
              Pedido #{order.orderId}
            </h2>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          {/* Estimated Time Card */}
          <div style={{ 
            background: 'var(--bg-card-hover)', 
            border: '1px solid var(--border-color)', 
            borderRadius: '16px', 
            padding: '20px', 
            textAlign: 'center',
            marginBottom: '24px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '4px' }}>
              <Clock size={18} className="text-primary" />
              <span>Tempo Estimado de Chegada</span>
            </div>
            <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--primary)', lineHeight: 1.1 }}>
              {minutesLeft} min
            </div>
            <span style={{ fontSize: '0.8rem', color: 'var(--success)' }}>
              Status atual: <strong>{steps[currentStep].label}</strong>
            </span>
          </div>

          {/* Progress Step Bar */}
          <div className="tracking-steps">
            {steps.map((step, idx) => {
              const isCompleted = idx < currentStep;
              const isActive = idx === currentStep;

              return (
                <div 
                  key={idx} 
                  className={`tracking-step ${isCompleted ? 'completed' : ''} ${isActive ? 'active' : ''}`}
                  onClick={() => setCurrentStep(idx)} // Allow demo toggle
                  style={{ cursor: 'pointer' }}
                  title="Clique para simular próximo status"
                >
                  <div className="step-circle">
                    {step.icon}
                  </div>
                  <span>{step.label}</span>
                </div>
              );
            })}
          </div>

          {/* Pix QR Code Box if Pix selected */}
          {order.paymentMethod === 'pix' && (
            <div style={{ 
              background: 'rgba(16, 185, 129, 0.08)', 
              border: '1px solid rgba(16, 185, 129, 0.3)', 
              padding: '16px', 
              borderRadius: '12px', 
              marginBottom: '20px',
              textAlign: 'center'
            }}>
              <div style={{ fontWeight: 700, color: 'var(--success)', marginBottom: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                <CheckCircle size={18} />
                <span>Pagamento Pix Gerado - Total: R$ {order.grandTotal.toFixed(2).replace('.', ',')}</span>
              </div>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>
                Copie o código abaixo e pague no app do seu banco para confirmação imediata.
              </p>
              <button 
                onClick={handleCopyPix}
                style={{ 
                  background: 'var(--success)', 
                  color: '#fff', 
                  border: 'none', 
                  padding: '10px 18px', 
                  borderRadius: 'var(--radius-full)', 
                  fontWeight: 700, 
                  fontSize: '0.88rem', 
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                {copied ? <Check size={16} /> : <Copy size={16} />}
                <span>{copied ? 'Código Pix Copiado!' : 'Copiar Chave Pix Copia e Cola'}</span>
              </button>
            </div>
          )}

          {/* Order Details Summary */}
          <div style={{ 
            background: 'rgba(255, 255, 255, 0.02)', 
            border: '1px solid var(--border-color)', 
            borderRadius: '12px', 
            padding: '16px', 
            marginBottom: '20px' 
          }}>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '10px' }}>Resumo do Pedido</h4>
            
            {order.items.map((item, idx) => (
              <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '6px' }}>
                <span>{item.quantity}x {item.product.name}</span>
                <span>R$ {(item.totalPrice || item.product.price * item.quantity).toFixed(2).replace('.', ',')}</span>
              </div>
            ))}

            <div style={{ borderTop: '1px dashed var(--border-color)', marginTop: '10px', paddingTop: '10px', display: 'flex', justifyContent: 'space-between', fontWeight: 700 }}>
              <span>Total Pago</span>
              <span style={{ color: 'var(--primary)' }}>R$ {order.grandTotal.toFixed(2).replace('.', ',')}</span>
            </div>
          </div>

          {/* WhatsApp Direct Action */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justify: 'center', 
              gap: '10px', 
              background: '#25D366', 
              color: '#fff', 
              textDecoration: 'none', 
              padding: '14px', 
              borderRadius: 'var(--radius-full)', 
              fontWeight: 700, 
              fontSize: '1rem',
              boxShadow: '0 8px 20px rgba(37, 211, 102, 0.3)',
              marginBottom: '12px'
            }}
          >
            <MessageCircle size={20} />
            <span>Enviar Pedido para WhatsApp do Restaurante</span>
          </a>

          <button
            onClick={onNewOrder}
            style={{ 
              width: '100%', 
              background: 'transparent', 
              color: 'var(--text-secondary)', 
              border: '1px solid var(--border-color)', 
              padding: '12px', 
              borderRadius: 'var(--radius-full)', 
              fontWeight: 600, 
              fontSize: '0.9rem', 
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            <RefreshCw size={16} />
            <span>Fazer Outro Pedido</span>
          </button>
        </div>
      </div>
    </div>
  );
}
