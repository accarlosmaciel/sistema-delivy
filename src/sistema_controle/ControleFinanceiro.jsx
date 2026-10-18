import React, { useState, useEffect } from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  CreditCard, 
  Plus, 
  Trash2, 
  Check, 
  X, 
  Printer, 
  PieChart, 
  FileText,
  Calendar,
  Wallet
} from 'lucide-react';
import { CentralStore } from './store';

export default function ControleFinanceiro({ onNotify }) {
  const [orders, setOrders] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form para nova despesa
  const [formExpense, setFormExpense] = useState({
    category: 'Insumos & Carnes',
    description: '',
    amount: '',
    paymentMethod: 'pix',
    date: new Date().toISOString().split('T')[0]
  });

  const reloadData = () => {
    setOrders(CentralStore.getOrders());
    setExpenses(CentralStore.getExpenses());
  };

  useEffect(() => {
    reloadData();
    const unsub = CentralStore.subscribe((event) => {
      if (event.action === 'ORDERS_UPDATED' || event.action === 'FINANCES_UPDATED') {
        reloadData();
      }
    });
    return unsub;
  }, []);

  // Cálculos Financeiros
  const completedOrders = orders.filter(o => o.status !== 'cancelled');
  
  const totalRevenue = completedOrders.reduce((sum, o) => sum + (o.grandTotal || 0), 0);
  const totalDiscounts = completedOrders.reduce((sum, o) => sum + (o.discountAmount || 0), 0);
  const grossSubtotal = completedOrders.reduce((sum, o) => sum + (o.subtotal || 0), 0);
  
  const totalExpenses = expenses.reduce((sum, e) => sum + (parseFloat(e.amount) || 0), 0);
  const netProfit = totalRevenue - totalExpenses;
  const profitMargin = totalRevenue > 0 ? ((netProfit / totalRevenue) * 100).toFixed(1) : 0;

  // Meios de Pagamento
  const paymentBreakdown = {
    pix: completedOrders.filter(o => o.paymentMethod === 'pix').reduce((s, o) => s + (o.grandTotal || 0), 0),
    credit: completedOrders.filter(o => o.paymentMethod === 'credit').reduce((s, o) => s + (o.grandTotal || 0), 0),
    debit: completedOrders.filter(o => o.paymentMethod === 'debit').reduce((s, o) => s + (o.grandTotal || 0), 0),
    money: completedOrders.filter(o => o.paymentMethod === 'money' || o.paymentMethod === 'dinheiro').reduce((s, o) => s + (o.grandTotal || 0), 0)
  };

  const handleOpenModal = () => {
    setFormExpense({
      category: 'Insumos & Carnes',
      description: '',
      amount: '',
      paymentMethod: 'pix',
      date: new Date().toISOString().split('T')[0]
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmitExpense = (e) => {
    e.preventDefault();
    if (!formExpense.description.trim() || !formExpense.amount) {
      alert('Informe a descrição e o valor da despesa.');
      return;
    }

    CentralStore.addExpense({
      category: formExpense.category,
      description: formExpense.description.trim(),
      amount: parseFloat(formExpense.amount) || 0,
      paymentMethod: formExpense.paymentMethod,
      date: new Date(formExpense.date).toISOString()
    });

    if (onNotify) onNotify(`Despesa de R$ ${formExpense.amount} registrada.`);
    handleCloseModal();
    reloadData();
  };

  const handleDeleteExpense = (id) => {
    if (window.confirm('Deseja excluir esta despesa?')) {
      CentralStore.deleteExpense(id);
      reloadData();
      if (onNotify) onNotify('Despesa removida.');
    }
  };

  // Impressão do Fechamento de Caixa
  const handlePrintBalance = () => {
    const printWindow = window.open('', '', 'width=450,height=650');
    if (!printWindow) return;
    printWindow.document.write(`
      <html>
        <head>
          <title>Fechamento de Caixa - Delivy</title>
          <style>
            body { font-family: monospace; padding: 20px; font-size: 13px; color: #000; }
            h2 { text-align: center; margin: 0 0 5px 0; font-size: 18px; }
            hr { border-top: 1px dashed #000; margin: 12px 0; }
            .row { display: flex; justify-content: space-between; margin: 6px 0; }
            .bold { font-weight: bold; }
          </style>
        </head>
        <body>
          <h2>DELIVY GOURMET</h2>
          <p style="text-align: center;">RELATÓRIO FINANCEIRO & FECHAMENTO DE CAIXA</p>
          <hr />
          <div class="row"><span>Data da Emissão:</span><span>${new Date().toLocaleString('pt-BR')}</span></div>
          <div class="row"><span>Total de Pedidos Faturados:</span><span>${completedOrders.length}</span></div>
          <hr />
          <div class="row bold"><span>FATURAMENTO BRUTO:</span><span>R$ ${totalRevenue.toFixed(2)}</span></div>
          <div class="row"><span>- Total Descontos/Cupons:</span><span>R$ ${totalDiscounts.toFixed(2)}</span></div>
          <div class="row bold" style="color: #c00;"><span>- TOTAL DE DESPESAS/CUSTOS:</span><span>R$ ${totalExpenses.toFixed(2)}</span></div>
          <hr />
          <div class="row bold" style="font-size: 15px;"><span>LUCRO LÍQUIDO OPERACIONAL:</span><span>R$ ${netProfit.toFixed(2)} (${profitMargin}%)</span></div>
          <hr />
          <p class="bold">MÉTODOS DE RECEBIMENTO:</p>
          <div class="row"><span>• PIX:</span><span>R$ ${paymentBreakdown.pix.toFixed(2)}</span></div>
          <div class="row"><span>• Cartão de Crédito:</span><span>R$ ${paymentBreakdown.credit.toFixed(2)}</span></div>
          <div class="row"><span>• Cartão de Débito:</span><span>R$ ${paymentBreakdown.debit.toFixed(2)}</span></div>
          <div class="row"><span>• Dinheiro:</span><span>R$ ${paymentBreakdown.money.toFixed(2)}</span></div>
          <hr />
          <p style="text-align: center; margin-top: 20px;">Visto do Gerente: _________________________</p>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  };

  return (
    <div>
      {/* Topo do Financeiro */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fff', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Wallet size={26} color="#10b981" />
            Controle Financeiro & Fluxo de Caixa
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginTop: '4px' }}>
            Acompanhe receitas, despesas operacionais, métodos de pagamento e lucro líquido em tempo real.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn-outline-adm" onClick={handlePrintBalance}>
            <Printer size={18} />
            Imprimir Fechamento
          </button>
          <button className="btn-primary-adm" onClick={handleOpenModal}>
            <Plus size={18} />
            Lançar Despesa / Saída
          </button>
        </div>
      </div>

      {/* Grid de Balanço Financeiro */}
      <div className="admin-grid-4">
        {/* Receita Bruta */}
        <div className="admin-card admin-stat-card" style={{ borderLeft: '4px solid #10b981' }}>
          <div>
            <div className="admin-stat-label">Receita de Pedidos</div>
            <div className="admin-stat-value" style={{ color: '#34d399' }}>
              R$ {totalRevenue.toFixed(2).replace('.', ',')}
            </div>
            <div className="admin-stat-sub" style={{ color: '#94a3b8' }}>
              {completedOrders.length} pedidos faturados
            </div>
          </div>
          <div className="admin-stat-icon-wrap" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981' }}>
            <TrendingUp size={26} />
          </div>
        </div>

        {/* Despesas Operacionais */}
        <div className="admin-card admin-stat-card" style={{ borderLeft: '4px solid #ef4444' }}>
          <div>
            <div className="admin-stat-label">Despesas Operacionais</div>
            <div className="admin-stat-value" style={{ color: '#f87171' }}>
              R$ {totalExpenses.toFixed(2).replace('.', ',')}
            </div>
            <div className="admin-stat-sub" style={{ color: '#94a3b8' }}>
              Insumos, equipe, motoboy
            </div>
          </div>
          <div className="admin-stat-icon-wrap" style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#ef4444' }}>
            <TrendingDown size={26} />
          </div>
        </div>

        {/* Lucro Líquido */}
        <div className="admin-card admin-stat-card" style={{ borderLeft: '4px solid #38bdf8' }}>
          <div>
            <div className="admin-stat-label">Lucro Líquido Estimado</div>
            <div className="admin-stat-value" style={{ color: netProfit >= 0 ? '#38bdf8' : '#ef4444' }}>
              R$ {netProfit.toFixed(2).replace('.', ',')}
            </div>
            <div className="admin-stat-sub" style={{ color: '#38bdf8' }}>
              Margem: <strong>{profitMargin}%</strong>
            </div>
          </div>
          <div className="admin-stat-icon-wrap" style={{ background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8' }}>
            <DollarSign size={26} />
          </div>
        </div>

        {/* Ticket Médio */}
        <div className="admin-card admin-stat-card" style={{ borderLeft: '4px solid #ea580c' }}>
          <div>
            <div className="admin-stat-label">Ticket Médio por Pedido</div>
            <div className="admin-stat-value" style={{ color: '#fb923c' }}>
              R$ {(completedOrders.length > 0 ? totalRevenue / completedOrders.length : 0).toFixed(2).replace('.', ',')}
            </div>
            <div className="admin-stat-sub" style={{ color: '#94a3b8' }}>
              Média de consumo
            </div>
          </div>
          <div className="admin-stat-icon-wrap" style={{ background: 'rgba(234, 88, 12, 0.15)', color: '#fb923c' }}>
            <CreditCard size={26} />
          </div>
        </div>
      </div>

      {/* Grid: Meios de Pagamento e Lançamento de Custos */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px', marginBottom: '28px' }}>
        {/* Meios de Pagamento */}
        <div className="admin-card">
          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#fff', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CreditCard size={20} color="#ea580c" />
            Entradas por Forma de Pagamento
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {/* PIX */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '4px' }}>
                <span style={{ color: '#cbd5e1', fontWeight: 600 }}>⚡ PIX Instantâneo</span>
                <span style={{ color: '#34d399', fontWeight: 800 }}>R$ {paymentBreakdown.pix.toFixed(2).replace('.', ',')}</span>
              </div>
              <div style={{ width: '100%', height: '8px', background: '#1e293b', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ 
                  height: '100%', 
                  background: '#10b981', 
                  width: `${totalRevenue > 0 ? (paymentBreakdown.pix / totalRevenue) * 100 : 0}%` 
                }} />
              </div>
            </div>

            {/* Crédito */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '4px' }}>
                <span style={{ color: '#cbd5e1', fontWeight: 600 }}>💳 Cartão de Crédito</span>
                <span style={{ color: '#60a5fa', fontWeight: 800 }}>R$ {paymentBreakdown.credit.toFixed(2).replace('.', ',')}</span>
              </div>
              <div style={{ width: '100%', height: '8px', background: '#1e293b', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ 
                  height: '100%', 
                  background: '#3b82f6', 
                  width: `${totalRevenue > 0 ? (paymentBreakdown.credit / totalRevenue) * 100 : 0}%` 
                }} />
              </div>
            </div>

            {/* Débito */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '4px' }}>
                <span style={{ color: '#cbd5e1', fontWeight: 600 }}>💳 Cartão de Débito</span>
                <span style={{ color: '#a78bfa', fontWeight: 800 }}>R$ {paymentBreakdown.debit.toFixed(2).replace('.', ',')}</span>
              </div>
              <div style={{ width: '100%', height: '8px', background: '#1e293b', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ 
                  height: '100%', 
                  background: '#8b5cf6', 
                  width: `${totalRevenue > 0 ? (paymentBreakdown.debit / totalRevenue) * 100 : 0}%` 
                }} />
              </div>
            </div>

            {/* Dinheiro */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '4px' }}>
                <span style={{ color: '#cbd5e1', fontWeight: 600 }}>💵 Dinheiro / Troco</span>
                <span style={{ color: '#fb923c', fontWeight: 800 }}>R$ {paymentBreakdown.money.toFixed(2).replace('.', ',')}</span>
              </div>
              <div style={{ width: '100%', height: '8px', background: '#1e293b', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ 
                  height: '100%', 
                  background: '#f97316', 
                  width: `${totalRevenue > 0 ? (paymentBreakdown.money / totalRevenue) * 100 : 0}%` 
                }} />
              </div>
            </div>
          </div>
        </div>

        {/* Resumo Fiscal & Descontos */}
        <div className="admin-card">
          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#fff', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FileText size={20} color="#38bdf8" />
            Demonstrativo de Fechamento (DRE)
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.92rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid #1f293d' }}>
              <span style={{ color: '#94a3b8' }}>Faturamento Bruto Cardápio:</span>
              <strong style={{ color: '#fff' }}>R$ {(grossSubtotal + totalRevenue - grossSubtotal).toFixed(2).replace('.', ',')}</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid #1f293d' }}>
              <span style={{ color: '#94a3b8' }}>Total Descontos / Cupons Oferecidos:</span>
              <strong style={{ color: '#ef4444' }}>- R$ {totalDiscounts.toFixed(2).replace('.', ',')}</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid #1f293d' }}>
              <span style={{ color: '#94a3b8' }}>Total Custos Operacionais Registrados:</span>
              <strong style={{ color: '#ef4444' }}>- R$ {totalExpenses.toFixed(2).replace('.', ',')}</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '6px', fontSize: '1.05rem' }}>
              <span style={{ color: '#fff', fontWeight: 800 }}>Saldo Líquido em Caixa:</span>
              <strong style={{ color: '#38bdf8', fontWeight: 900 }}>R$ {netProfit.toFixed(2).replace('.', ',')}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Tabela de Despesas Registradas */}
      <div className="admin-card" style={{ padding: '0', overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #1f293d', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fff' }}>
            Registro de Custos e Despesas Operacionais
          </h3>
          <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
            {expenses.length} lançamentos efetuados
          </span>
        </div>

        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Data</th>
                <th>Categoria</th>
                <th>Descrição da Despesa</th>
                <th>Forma de Pagamento</th>
                <th>Valor (R$)</th>
                <th style={{ textAlign: 'right' }}>Ação</th>
              </tr>
            </thead>
            <tbody>
              {expenses.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '30px', color: '#94a3b8' }}>
                    Nenhuma despesa cadastrada ainda.
                  </td>
                </tr>
              ) : (
                expenses.map((exp) => (
                  <tr key={exp.id}>
                    <td>
                      <span style={{ color: '#cbd5e1', fontSize: '0.85rem' }}>
                        {new Date(exp.date).toLocaleDateString('pt-BR')}
                      </span>
                    </td>
                    <td>
                      <span style={{ background: '#1e293b', color: '#cbd5e1', padding: '3px 8px', borderRadius: '6px', fontSize: '0.78rem', fontWeight: 600 }}>
                        {exp.category}
                      </span>
                    </td>
                    <td>
                      <span style={{ fontWeight: 600, color: '#fff' }}>{exp.description}</span>
                    </td>
                    <td>
                      <span style={{ textTransform: 'uppercase', fontSize: '0.8rem', color: '#94a3b8' }}>
                        {exp.paymentMethod}
                      </span>
                    </td>
                    <td>
                      <span style={{ color: '#ef4444', fontWeight: 800, fontSize: '0.95rem' }}>
                        - R$ {Number(exp.amount).toFixed(2).replace('.', ',')}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        onClick={() => handleDeleteExpense(exp.id)}
                        className="btn-outline-adm"
                        style={{ padding: '4px 8px', color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.3)' }}
                        title="Excluir Lançamento"
                      >
                        <Trash2 size={15} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL DE LANÇAMENTO DE DESPESA */}
      {isModalOpen && (
        <div className="admin-modal-overlay" onClick={handleCloseModal}>
          <div className="admin-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <TrendingDown size={20} color="#ef4444" />
                Lançar Despesa / Saída de Caixa
              </h3>
              <button onClick={handleCloseModal} style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmitExpense} className="admin-modal-body">
              <div className="admin-form-grid-2">
                <div className="admin-form-group">
                  <label className="admin-form-label">Categoria de Custo *</label>
                  <select 
                    value={formExpense.category} 
                    onChange={(e) => setFormExpense({ ...formExpense, category: e.target.value })}
                    className="admin-form-input"
                  >
                    <option value="Insumos & Carnes">Insumos & Carnes</option>
                    <option value="Embalagens">Embalagens & Descartáveis</option>
                    <option value="Logística & Entregadores">Logística & Entregadores</option>
                    <option value="Marketing & Anúncios">Marketing & Anúncios</option>
                    <option value="Gás & Energia">Gás, Energia & Água</option>
                    <option value="Folha de Pagamento">Salários & Adiantamentos</option>
                    <option value="Manutenção">Manutenção Equipamentos</option>
                    <option value="Outros">Outras Despesas</option>
                  </select>
                </div>

                <div className="admin-form-group">
                  <label className="admin-form-label">Valor (R$) *</label>
                  <input 
                    type="number"
                    step="0.01"
                    placeholder="150.00"
                    value={formExpense.amount}
                    onChange={(e) => setFormExpense({ ...formExpense, amount: e.target.value })}
                    className="admin-form-input"
                    required
                  />
                </div>
              </div>

              <div className="admin-form-group">
                <label className="admin-form-label">Descrição Detalhada *</label>
                <input 
                  type="text"
                  placeholder="Ex: Pagamento 15kg pão de brioche artesanal"
                  value={formExpense.description}
                  onChange={(e) => setFormExpense({ ...formExpense, description: e.target.value })}
                  className="admin-form-input"
                  required
                />
              </div>

              <div className="admin-form-grid-2">
                <div className="admin-form-group">
                  <label className="admin-form-label">Forma de Pagamento</label>
                  <select 
                    value={formExpense.paymentMethod} 
                    onChange={(e) => setFormExpense({ ...formExpense, paymentMethod: e.target.value })}
                    className="admin-form-input"
                  >
                    <option value="pix">PIX</option>
                    <option value="boleto">Boleto Bancário</option>
                    <option value="dinheiro">Dinheiro em Espécie</option>
                    <option value="credit">Cartão de Crédito</option>
                    <option value="transfer">Transferência Bancária</option>
                  </select>
                </div>

                <div className="admin-form-group">
                  <label className="admin-form-label">Data da Despesa</label>
                  <input 
                    type="date"
                    value={formExpense.date}
                    onChange={(e) => setFormExpense({ ...formExpense, date: e.target.value })}
                    className="admin-form-input"
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '12px', borderTop: '1px solid #1f293d', paddingTop: '16px' }}>
                <button type="button" className="btn-outline-adm" onClick={handleCloseModal}>
                  Cancelar
                </button>
                <button type="submit" className="btn-primary-adm">
                  <Check size={18} />
                  Confirmar Lançamento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
