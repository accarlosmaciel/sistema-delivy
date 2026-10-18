import React, { useState, useEffect } from 'react';
import { 
  Package, 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Check, 
  X, 
  AlertCircle, 
  Image as ImageIcon, 
  Layers, 
  Sparkles,
  ArrowUpDown,
  Filter
} from 'lucide-react';
import { CentralStore } from './store';
import { CATEGORIES } from '../data/products';

export default function ProdutosManager({ onNotify }) {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [stockFilter, setStockFilter] = useState('all'); // 'all' | 'low' | 'out'
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Formulário do produto
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    originalPrice: '',
    category: 'burgers',
    stock: 30,
    image: '',
    badge: '',
    isAvailable: true,
    featured: false
  });

  // Fotos pré-definidas de alta resolução para agilizar o cadastro
  const QUICK_IMAGES = [
    { label: 'Hambúrguer Gourmet', url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80' },
    { label: 'Smash Duplo Cheddar', url: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=800&q=80' },
    { label: 'Pizza Artesanal', url: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80' },
    { label: 'Batata Rústica', url: 'https://images.unsplash.com/photo-1576107232684-1279f3908594?auto=format&fit=crop&w=800&q=80' },
    { label: 'Bebida Gelada', url: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=800&q=80' },
    { label: 'Sobremesa Brownie', url: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80' }
  ];

  const reloadProducts = () => {
    setProducts(CentralStore.getProducts());
  };

  useEffect(() => {
    reloadProducts();
    const unsub = CentralStore.subscribe((event) => {
      if (event.action === 'PRODUCTS_UPDATED') {
        reloadProducts();
      }
    });
    return unsub;
  }, []);

  const handleOpenModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name || '',
        description: product.description || '',
        price: product.price ? product.price.toString() : '',
        originalPrice: product.originalPrice ? product.originalPrice.toString() : '',
        category: product.category || 'burgers',
        stock: product.stock !== undefined ? product.stock : 25,
        image: product.image || '',
        badge: product.badge || '',
        isAvailable: product.isAvailable !== false,
        featured: !!product.featured
      });
    } else {
      setEditingProduct(null);
      setFormData({
        name: '',
        description: '',
        price: '',
        originalPrice: '',
        category: 'burgers',
        stock: 30,
        image: QUICK_IMAGES[0].url,
        badge: 'Novo',
        isAvailable: true,
        featured: false
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.price) {
      alert('Por favor, informe o título e o valor do produto.');
      return;
    }

    const payload = {
      name: formData.name.trim(),
      description: formData.description.trim(),
      price: parseFloat(formData.price) || 0,
      originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : null,
      category: formData.category,
      stock: parseInt(formData.stock, 10) || 0,
      image: formData.image || QUICK_IMAGES[0].url,
      badge: formData.badge,
      isAvailable: formData.isAvailable,
      featured: formData.featured
    };

    if (editingProduct) {
      CentralStore.updateProduct(editingProduct.id, payload);
      if (onNotify) onNotify(`Produto "${payload.name}" atualizado com sucesso!`);
    } else {
      CentralStore.addProduct(payload);
      if (onNotify) onNotify(`Novo produto "${payload.name}" cadastrado e disponível no cardápio!`);
    }

    handleCloseModal();
    reloadProducts();
  };

  const handleDelete = (id, name) => {
    if (window.confirm(`Tem certeza que deseja excluir o produto "${name}"?`)) {
      CentralStore.deleteProduct(id);
      reloadProducts();
      if (onNotify) onNotify(`Produto "${name}" removido.`);
    }
  };

  // Ajuste rápido de estoque com 1 clique (+5 ou -1)
  const handleQuickStock = (id, currentStock, delta) => {
    const newStock = Math.max(0, currentStock + delta);
    CentralStore.updateProduct(id, { 
      stock: newStock,
      isAvailable: newStock > 0 
    });
    reloadProducts();
  };

  const toggleAvailability = (id, currentStatus) => {
    CentralStore.updateProduct(id, { isAvailable: !currentStatus });
    reloadProducts();
  };

  // Filtragem
  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (p.description && p.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCat = selectedCategory === 'all' || p.category === selectedCategory;
    const stockVal = p.stock !== undefined ? p.stock : 20;
    
    let matchesStock = true;
    if (stockFilter === 'low') matchesStock = stockVal > 0 && stockVal < 10;
    if (stockFilter === 'out') matchesStock = stockVal <= 0 || p.isAvailable === false;

    return matchesSearch && matchesCat && matchesStock;
  });

  return (
    <div>
      {/* Topo da Gestão de Produtos */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fff', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Package size={26} color="#ea580c" />
            Cadastro de Produtos & Controle de Estoque
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginTop: '4px' }}>
            Gerencie fotos, preços, descrições e estoque em tempo real sincronizado com o cardápio do cliente.
          </p>
        </div>

        <button className="btn-primary-adm" onClick={() => handleOpenModal()}>
          <Plus size={18} />
          Cadastrar Novo Produto
        </button>
      </div>

      {/* Barra de Filtros e Busca */}
      <div className="admin-card" style={{ marginBottom: '24px', padding: '16px 20px' }}>
        <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', alignItems: 'center' }}>
          {/* Busca por texto */}
          <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
            <input 
              type="text"
              placeholder="Buscar por nome, ingrediente ou descrição..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="admin-form-input"
              style={{ width: '100%', paddingLeft: '38px' }}
            />
          </div>

          {/* Categoria */}
          <select 
            value={selectedCategory} 
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="admin-form-input"
            style={{ width: 'auto', minWidth: '160px' }}
          >
            <option value="all">Todas as Categorias</option>
            {CATEGORIES && CATEGORIES.filter(c => c.id !== 'all').map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>

          {/* Filtro de Estoque */}
          <select 
            value={stockFilter} 
            onChange={(e) => setStockFilter(e.target.value)}
            className="admin-form-input"
            style={{ width: 'auto', minWidth: '160px' }}
          >
            <option value="all">Todos os Estoques</option>
            <option value="low">⚠️ Estoque Baixo (&lt; 10)</option>
            <option value="out">❌ Esgotados / Pausados</option>
          </select>

          <span style={{ fontSize: '0.85rem', color: '#94a3b8', marginLeft: 'auto' }}>
            <strong>{filteredProducts.length}</strong> produtos exibidos
          </span>
        </div>
      </div>

      {/* Tabela de Produtos */}
      <div className="admin-card" style={{ padding: '0', overflow: 'hidden' }}>
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Produto & Foto</th>
                <th>Categoria</th>
                <th>Preço</th>
                <th>Estoque Atual</th>
                <th>Status no Cardápio</th>
                <th style={{ textAlign: 'right' }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>
                    Nenhum produto encontrado com os filtros selecionados.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((prod) => {
                  const stock = prod.stock !== undefined ? prod.stock : 25;
                  const isLowStock = stock > 0 && stock < 10;
                  const isOutOfStock = stock <= 0 || prod.isAvailable === false;

                  return (
                    <tr key={prod.id}>
                      {/* Foto e Título */}
                      <td style={{ minWidth: '260px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                          <img 
                            src={prod.image} 
                            alt={prod.name}
                            style={{ 
                              width: '54px', 
                              height: '54px', 
                              borderRadius: '10px', 
                              objectFit: 'cover',
                              border: '1px solid #1f293d'
                            }} 
                          />
                          <div>
                            <div style={{ fontWeight: 700, color: '#fff', fontSize: '0.98rem' }}>
                              {prod.name}
                            </div>
                            <div style={{ fontSize: '0.78rem', color: '#94a3b8', maxWidth: '300px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {prod.description}
                            </div>
                            {prod.badge && (
                              <span style={{ fontSize: '0.7rem', background: 'rgba(234, 88, 12, 0.2)', color: '#fb923c', padding: '1px 6px', borderRadius: '4px', marginTop: '4px', display: 'inline-block' }}>
                                {prod.badge}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Categoria */}
                      <td>
                        <span style={{ textTransform: 'capitalize', color: '#cbd5e1', fontSize: '0.85rem', background: '#1e293b', padding: '4px 10px', borderRadius: '6px' }}>
                          {prod.category}
                        </span>
                      </td>

                      {/* Preço */}
                      <td>
                        <div style={{ fontWeight: 800, color: '#10b981', fontSize: '1.05rem' }}>
                          R$ {Number(prod.price).toFixed(2).replace('.', ',')}
                        </div>
                        {prod.originalPrice && (
                          <div style={{ fontSize: '0.78rem', color: '#64748b', textDecoration: 'line-through' }}>
                            R$ {Number(prod.originalPrice).toFixed(2).replace('.', ',')}
                          </div>
                        )}
                      </td>

                      {/* Estoque */}
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <button 
                            onClick={() => handleQuickStock(prod.id, stock, -1)}
                            style={{ width: '26px', height: '26px', borderRadius: '6px', background: '#1e293b', color: '#fff', border: '1px solid #334155', cursor: 'pointer' }}
                            title="Diminuir 1 un"
                          >
                            -
                          </button>

                          <span style={{ 
                            fontWeight: 800, 
                            fontSize: '0.95rem',
                            color: isOutOfStock ? '#ef4444' : isLowStock ? '#f59e0b' : '#fff' 
                          }}>
                            {stock} un
                          </span>

                          <button 
                            onClick={() => handleQuickStock(prod.id, stock, 5)}
                            style={{ width: '26px', height: '26px', borderRadius: '6px', background: '#1e293b', color: '#fff', border: '1px solid #334155', cursor: 'pointer' }}
                            title="Repor +5 un"
                          >
                            +
                          </button>
                        </div>
                        {isLowStock && (
                          <span style={{ fontSize: '0.72rem', color: '#f59e0b', display: 'block', marginTop: '4px' }}>
                            ⚠️ Baixo estoque
                          </span>
                        )}
                      </td>

                      {/* Status / Disponibilidade */}
                      <td>
                        <button 
                          onClick={() => toggleAvailability(prod.id, prod.isAvailable !== false)}
                          style={{
                            background: prod.isAvailable !== false && stock > 0 ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                            color: prod.isAvailable !== false && stock > 0 ? '#34d399' : '#f87171',
                            border: `1px solid ${prod.isAvailable !== false && stock > 0 ? '#10b981' : '#ef4444'}`,
                            padding: '4px 10px',
                            borderRadius: '999px',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            cursor: 'pointer'
                          }}
                        >
                          {prod.isAvailable !== false && stock > 0 ? '● Ativo no Cardápio' : '✕ Esgotado / Oculto'}
                        </button>
                      </td>

                      {/* Ações */}
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '8px' }}>
                          <button 
                            onClick={() => handleOpenModal(prod)}
                            className="btn-outline-adm"
                            style={{ padding: '6px 10px' }}
                            title="Editar Produto"
                          >
                            <Edit3 size={16} />
                          </button>
                          <button 
                            onClick={() => handleDelete(prod.id, prod.name)}
                            className="btn-outline-adm"
                            style={{ padding: '6px 10px', color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.3)' }}
                            title="Excluir Produto"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL DE CADASTRO / EDIÇÃO DE PRODUTO */}
      {isModalOpen && (
        <div className="admin-modal-overlay" onClick={handleCloseModal}>
          <div className="admin-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Package size={20} color="#ea580c" />
                {editingProduct ? 'Editar Produto' : 'Cadastrar Novo Produto'}
              </h3>
              <button 
                onClick={handleCloseModal}
                style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="admin-modal-body">
              {/* Título / Nome */}
              <div className="admin-form-group">
                <label className="admin-form-label">Título do Produto *</label>
                <input 
                  type="text"
                  placeholder="Ex: Hambúrguer Trufado Angus"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="admin-form-input"
                  required
                />
              </div>

              {/* Descrição */}
              <div className="admin-form-group">
                <label className="admin-form-label">Descrição e Ingredientes</label>
                <textarea 
                  rows={3}
                  placeholder="Ex: Pão brioche selado na manteiga, 180g de blend angus grelhado, queijo gouda derretido e maionese trufada da casa."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="admin-form-input"
                  style={{ resize: 'vertical' }}
                />
              </div>

              {/* Preços e Estoque */}
              <div className="admin-form-grid-2">
                <div className="admin-form-group">
                  <label className="admin-form-label">Preço de Venda (R$) *</label>
                  <input 
                    type="number"
                    step="0.01"
                    placeholder="38.90"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="admin-form-input"
                    required
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-form-label">Preço Promocional Antigo (R$)</label>
                  <input 
                    type="number"
                    step="0.01"
                    placeholder="45.00 (opcional)"
                    value={formData.originalPrice}
                    onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                    className="admin-form-input"
                  />
                </div>
              </div>

              <div className="admin-form-grid-2">
                <div className="admin-form-group">
                  <label className="admin-form-label">Categoria</label>
                  <select 
                    value={formData.category} 
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="admin-form-input"
                  >
                    {CATEGORIES && CATEGORIES.filter(c => c.id !== 'all').map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                <div className="admin-form-group">
                  <label className="admin-form-label">Quantidade em Estoque</label>
                  <input 
                    type="number"
                    min="0"
                    placeholder="30"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    className="admin-form-input"
                  />
                </div>
              </div>

              {/* Foto do Produto */}
              <div className="admin-form-group">
                <label className="admin-form-label">URL da Foto do Produto</label>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <input 
                    type="url"
                    placeholder="https://images.unsplash.com/photo-..."
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    className="admin-form-input"
                    style={{ flex: 1 }}
                  />
                  {formData.image && (
                    <img 
                      src={formData.image} 
                      alt="Preview" 
                      style={{ width: '42px', height: '42px', borderRadius: '8px', objectFit: 'cover' }} 
                    />
                  )}
                </div>

                {/* Seleção Rápida de Fotos */}
                <div style={{ marginTop: '8px' }}>
                  <span style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block', marginBottom: '6px' }}>
                    Ou escolha uma foto gastronômica pronta:
                  </span>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {QUICK_IMAGES.map((img, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setFormData({ ...formData, image: img.url })}
                        style={{
                          background: formData.image === img.url ? '#ea580c' : '#1e293b',
                          color: '#fff',
                          border: 'none',
                          padding: '4px 10px',
                          borderRadius: '6px',
                          fontSize: '0.75rem',
                          cursor: 'pointer'
                        }}
                      >
                        {img.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Badge e Destaque */}
              <div className="admin-form-grid-2">
                <div className="admin-form-group">
                  <label className="admin-form-label">Selo / Badge em Destaque</label>
                  <input 
                    type="text"
                    placeholder="Ex: Mais Vendido, Artesanal, Chef"
                    value={formData.badge}
                    onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                    className="admin-form-input"
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '8px', marginTop: '14px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.88rem', color: '#cbd5e1', cursor: 'pointer' }}>
                    <input 
                      type="checkbox" 
                      checked={formData.isAvailable} 
                      onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })} 
                    />
                    Disponível para venda imediata
                  </label>

                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.88rem', color: '#cbd5e1', cursor: 'pointer' }}>
                    <input 
                      type="checkbox" 
                      checked={formData.featured} 
                      onChange={(e) => setFormData({ ...formData, featured: e.target.checked })} 
                    />
                    Destacar no topo do Cardápio
                  </label>
                </div>
              </div>

              {/* Botões do Rodapé */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '12px', borderTop: '1px solid #1f293d', paddingTop: '16px' }}>
                <button type="button" className="btn-outline-adm" onClick={handleCloseModal}>
                  Cancelar
                </button>
                <button type="submit" className="btn-primary-adm">
                  <Check size={18} />
                  {editingProduct ? 'Salvar Alterações' : 'Criar Produto'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
