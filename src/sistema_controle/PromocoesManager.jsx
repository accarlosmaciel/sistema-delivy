import React, { useState, useEffect } from 'react';
import { 
  Tag, 
  Plus, 
  Trash2, 
  Check, 
  X, 
  Percent, 
  DollarSign, 
  Truck, 
  Sparkles,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { CentralStore } from './store';

export default function PromocoesManager({ onNotify }) {
  const [coupons, setCoupons] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [discountType, setDiscountType] = useState('percent'); // 'percent' | 'fixed' | 'freedelivery'
  const [discountValue, setDiscountValue] = useState('15');
  const [minSubtotal, setMinSubtotal] = useState('40.00');
  const [description, setDescription] = useState('15% de desconto especial');

  const reloadCoupons = () => {
    setCoupons(CentralStore.getCoupons());
  };

  useEffect(() => {
    reloadCoupons();
    const unsub = CentralStore.subscribe((event) => {
      if (event.action === 'COUPONS_UPDATED') {
        reloadCoupons();
      }
    });
    return unsub;
  }, []);

  const handleOpenModal = () => {
    setCouponCode('');
    setDiscountType('percent');
    setDiscountValue('15');
    setMinSubtotal('40.00');
    setDescription('');
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const cleanCode = couponCode.trim().toUpperCase().replace(/\s+/g, '');
    if (!cleanCode) {
      alert('Por favor, informe o código do cupom (ex: DELIVY15).');
      return;
    }

    const couponData = {
      description: description.trim() || `Cupom ${cleanCode}`,
      minSubtotal: parseFloat(minSubtotal) || 0,
      createdAt: new Date().toISOString()
    };

    if (discountType === 'percent') {
      couponData.discountPercent = parseFloat(discountValue) || 10;
    } else if (discountType === 'fixed') {
      couponData.discountValue = parseFloat(discountValue) || 10.00;
    } else if (discountType === 'freedelivery') {
      couponData.freeDelivery = true;
    }

    CentralStore.saveCoupon(cleanCode, couponData);
    if (onNotify) onNotify(`Cupom ${cleanCode} ativado com sucesso!`);
    handleCloseModal();
    reloadCoupons();
  };

  const handleDelete = (code) => {
    if (window.confirm(`Deseja desativar o cupom "${code}"?`)) {
      CentralStore.deleteCoupon(code);
      reloadCoupons();
      if (onNotify) onNotify(`Cupom ${code} removido.`);
    }
  };

  const couponEntries = Object.entries(coupons);

  return (
    <div>
      {/* Topo de Promoções */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fff', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Tag size={26} color="#ea580c" />
            Cadastro de Promoções & Cupons de Desconto
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginTop: '4px' }}>
            Crie incentivos de compra, campanhas de frete grátis e descontos aplicáveis diretamente no carrinho dos clientes.
          </p>
        </div>

        <button className="btn-primary-adm" onClick={handleOpenModal}>
          <Plus size={18} />
          Criar Nova Promoção / Cupom
        </button>
      </div>

      {/* Grid de Cupons Ativos */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px', marginBottom: '28px' }}>
        {couponEntries.map(([code, data]) => {
          let badgeColor = '#ea580c';
          let discountLabel = '';
          let icon = <Tag size={20} />;

          if (data.discountPercent) {
            badgeColor = '#ea580c';
            discountLabel = `${data.discountPercent}% OFF`;
            icon = <Percent size={20} />;
          } else if (data.discountValue) {
            badgeColor = '#10b981';
            discountLabel = `R$ ${Number(data.discountValue).toFixed(2).replace('.', ',')} OFF`;
            icon = <DollarSign size={20} />;
          } else if (data.freeDelivery) {
            badgeColor = '#3b82f6';
            discountLabel = 'FRETE GRÁTIS';
            icon = <Truck size={20} />;
          }

          return (
            <div key={code} className="admin-card" style={{ position: 'relative', overflow: 'hidden' }}>
              <div style={{ 
                position: 'absolute', 
                top: 0, 
                left: 0, 
                right: 0, 
                height: '4px', 
                background: badgeColor 
              }} />

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span style={{ 
                  fontFamily: 'monospace', 
                  fontSize: '1.25rem', 
                  fontWeight: 900, 
                  letterSpacing: '0.08em',
                  background: '#090d16',
                  color: '#fff',
                  padding: '6px 14px',
                  borderRadius: '8px',
                  border: '1px dashed #334155'
                }}>
                  {code}
                </span>

                <span style={{ 
                  background: `${badgeColor}25`, 
                  color: badgeColor, 
                  border: `1px solid ${badgeColor}50`,
                  padding: '4px 10px',
                  borderRadius: '999px',
                  fontSize: '0.78rem',
                  fontWeight: 800
                }}>
                  {discountLabel}
                </span>
              </div>

              <p style={{ color: '#cbd5e1', fontSize: '0.92rem', marginBottom: '16px', minHeight: '40px' }}>
                {data.description}
              </p>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #1f293d', paddingTop: '12px', fontSize: '0.8rem', color: '#94a3b8' }}>
                <div>
                  {data.minSubtotal ? (
                    <span>Mínimo: R$ {Number(data.minSubtotal).toFixed(2).replace('.', ',')}</span>
                  ) : (
                    <span>Sem valor mínimo</span>
                  )}
                </div>

                <button 
                  onClick={() => handleDelete(code)}
                  style={{ 
                    background: 'transparent', 
                    border: 'none', 
                    color: '#ef4444', 
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '0.8rem',
                    fontWeight: 600
                  }}
                >
                  <Trash2 size={15} /> Excluir
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Destaque Informativo de Promoções Ativas */}
      <div className="admin-card" style={{ background: 'linear-gradient(135deg, #111827 0%, #1e1b4b 100%)', border: '1px solid #312e81' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
          <div style={{ background: '#4338ca', padding: '12px', borderRadius: '12px', color: '#fff' }}>
            <Sparkles size={28} />
          </div>
          <div>
            <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fff', marginBottom: '6px' }}>
              Integração Instantânea com o Cardápio do Cliente
            </h4>
            <p style={{ color: '#c7d2fe', fontSize: '0.9rem', lineHeight: '1.5' }}>
              Qualquer cupom que você cadastrar aqui fica imediatamente disponível para seus clientes digitarem no carrinho e receberem o desconto na hora do checkout.
            </p>
          </div>
        </div>
      </div>

      {/* MODAL DE CRIAÇÃO DE PROMOÇÃO */}
      {isModalOpen && (
        <div className="admin-modal-overlay" onClick={handleCloseModal}>
          <div className="admin-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Tag size={20} color="#ea580c" />
                Criar Nova Promoção / Cupom
              </h3>
              <button onClick={handleCloseModal} style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="admin-modal-body">
              {/* Código do Cupom */}
              <div className="admin-form-group">
                <label className="admin-form-label">Código do Cupom *</label>
                <input 
                  type="text"
                  placeholder="Ex: QUERO15, BURGERLOVE, PROMO10"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="admin-form-input"
                  style={{ textTransform: 'uppercase', fontFamily: 'monospace', fontWeight: 800, letterSpacing: '0.05em' }}
                  required
                />
              </div>

              {/* Tipo de Desconto */}
              <div className="admin-form-group">
                <label className="admin-form-label">Tipo de Benefício *</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                  <button
                    type="button"
                    onClick={() => setDiscountType('percent')}
                    style={{
                      padding: '12px',
                      borderRadius: '8px',
                      border: discountType === 'percent' ? '2px solid #ea580c' : '1px solid #334155',
                      background: discountType === 'percent' ? 'rgba(234, 88, 12, 0.15)' : '#0b0f19',
                      color: discountType === 'percent' ? '#fb923c' : '#cbd5e1',
                      fontWeight: 700,
                      cursor: 'pointer',
                      fontSize: '0.85rem'
                    }}
                  >
                    % Porcentagem
                  </button>

                  <button
                    type="button"
                    onClick={() => setDiscountType('fixed')}
                    style={{
                      padding: '12px',
                      borderRadius: '8px',
                      border: discountType === 'fixed' ? '2px solid #10b981' : '1px solid #334155',
                      background: discountType === 'fixed' ? 'rgba(16, 185, 129, 0.15)' : '#0b0f19',
                      color: discountType === 'fixed' ? '#34d399' : '#cbd5e1',
                      fontWeight: 700,
                      cursor: 'pointer',
                      fontSize: '0.85rem'
                    }}
                  >
                    R$ Valor Fixo
                  </button>

                  <button
                    type="button"
                    onClick={() => setDiscountType('freedelivery')}
                    style={{
                      padding: '12px',
                      borderRadius: '8px',
                      border: discountType === 'freedelivery' ? '2px solid #3b82f6' : '1px solid #334155',
                      background: discountType === 'freedelivery' ? 'rgba(59, 130, 246, 0.15)' : '#0b0f19',
                      color: discountType === 'freedelivery' ? '#60a5fa' : '#cbd5e1',
                      fontWeight: 700,
                      cursor: 'pointer',
                      fontSize: '0.85rem'
                    }}
                  >
                    🛵 Frete Grátis
                  </button>
                </div>
              </div>

              {/* Valor do Desconto e Pedido Mínimo */}
              <div className="admin-form-grid-2">
                {discountType !== 'freedelivery' && (
                  <div className="admin-form-group">
                    <label className="admin-form-label">
                      {discountType === 'percent' ? 'Desconto em Porcentagem (%)' : 'Desconto em Reais (R$)'}
                    </label>
                    <input 
                      type="number"
                      step={discountType === 'percent' ? '1' : '0.01'}
                      placeholder={discountType === 'percent' ? '15' : '10.00'}
                      value={discountValue}
                      onChange={(e) => setDiscountValue(e.target.value)}
                      className="admin-form-input"
                      required
                    />
                  </div>
                )}

                <div className="admin-form-group" style={{ gridColumn: discountType === 'freedelivery' ? 'span 2' : 'auto' }}>
                  <label className="admin-form-label">Valor Mínimo do Pedido (R$)</label>
                  <input 
                    type="number"
                    step="0.01"
                    placeholder="40.00 (deixe 0 para sem mínimo)"
                    value={minSubtotal}
                    onChange={(e) => setMinSubtotal(e.target.value)}
                    className="admin-form-input"
                  />
                </div>
              </div>

              {/* Descrição */}
              <div className="admin-form-group">
                <label className="admin-form-label">Descrição Exibida no Carrinho</label>
                <input 
                  type="text"
                  placeholder="Ex: 15% OFF em todo o cardápio acima de R$ 40"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="admin-form-input"
                />
              </div>

              {/* Rodapé */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '12px', borderTop: '1px solid #1f293d', paddingTop: '16px' }}>
                <button type="button" className="btn-outline-adm" onClick={handleCloseModal}>
                  Cancelar
                </button>
                <button type="submit" className="btn-primary-adm">
                  <Check size={18} />
                  Ativar Promoção
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
