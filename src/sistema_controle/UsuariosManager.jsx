import React, { useState, useEffect } from 'react';
import { 
  Users, 
  ShieldCheck, 
  Store, 
  UserPlus, 
  Search, 
  Trash2, 
  Edit3, 
  Phone, 
  Mail, 
  MapPin, 
  ShoppingBag, 
  Star,
  Check,
  X,
  MessageCircle
} from 'lucide-react';
import { CentralStore } from './store';

export default function UsuariosManager({ currentUser, onSwitchUser, onNotify }) {
  const [users, setUsers] = useState([]);
  const [roleFilter, setRoleFilter] = useState('all'); // 'all' | 'superadmin' | 'admin' | 'cliente'
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'admin',
    address: '',
    notes: '',
    tag: 'Novo'
  });

  const reloadUsers = () => {
    setUsers(CentralStore.getUsers());
  };

  useEffect(() => {
    reloadUsers();
    const unsub = CentralStore.subscribe((event) => {
      if (event.action === 'USERS_UPDATED') {
        reloadUsers();
      }
    });
    return unsub;
  }, []);

  const handleOpenModal = (user = null) => {
    if (user) {
      setEditingUser(user);
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        role: user.role || 'cliente',
        address: user.address || '',
        notes: user.notes || '',
        tag: user.tag || 'Novo'
      });
    } else {
      setEditingUser(null);
      setFormData({
        name: '',
        email: '',
        phone: '',
        role: 'admin',
        address: '',
        notes: '',
        tag: 'Novo'
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim()) {
      alert('Por favor, informe ao menos o Nome e Telefone/WhatsApp.');
      return;
    }

    if (editingUser) {
      CentralStore.updateUser(editingUser.id, formData);
      if (onNotify) onNotify(`Usuário "${formData.name}" atualizado!`);
    } else {
      CentralStore.addUser(formData);
      if (onNotify) onNotify(`Usuário "${formData.name}" (${formData.role}) cadastrado com sucesso!`);
    }

    handleCloseModal();
    reloadUsers();
  };

  const handleDelete = (id, name) => {
    if (window.confirm(`Deseja remover o usuário "${name}"?`)) {
      CentralStore.deleteUser(id);
      reloadUsers();
      if (onNotify) onNotify(`Usuário removido.`);
    }
  };

  // Filtragem
  const filteredUsers = users.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (u.phone && u.phone.includes(searchTerm)) ||
                          (u.email && u.email.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const countSuperadmins = users.filter(u => u.role === 'superadmin').length;
  const countAdmins = users.filter(u => u.role === 'admin').length;
  const countClientes = users.filter(u => u.role === 'cliente').length;

  return (
    <div>
      {/* Topo da Gestão de Usuários */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fff', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Users size={26} color="#ea580c" />
            Gestão de Usuários & Níveis de Acesso
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginTop: '4px' }}>
            Controle de Clientes, Superadmin da Plataforma e Administradores (Donos da Loja).
          </p>
        </div>

        <button className="btn-primary-adm" onClick={() => handleOpenModal()}>
          <UserPlus size={18} />
          Cadastrar Novo Usuário
        </button>
      </div>

      {/* Cards de Métricas de Perfis */}
      <div className="admin-grid-4">
        {/* Superadmin Card */}
        <div 
          className="admin-card admin-stat-card" 
          onClick={() => setRoleFilter('superadmin')}
          style={{ cursor: 'pointer', borderLeft: '4px solid #8b5cf6' }}
        >
          <div>
            <div className="admin-stat-label">Superadmins (Master)</div>
            <div className="admin-stat-value" style={{ color: '#c4b5fd' }}>{countSuperadmins}</div>
            <div className="admin-stat-sub" style={{ color: '#94a3b8' }}>Acesso global completo</div>
          </div>
          <div className="admin-stat-icon-wrap" style={{ background: 'rgba(139, 92, 246, 0.15)', color: '#a78bfa' }}>
            <ShieldCheck size={26} />
          </div>
        </div>

        {/* Donos da Loja (Admin) */}
        <div 
          className="admin-card admin-stat-card" 
          onClick={() => setRoleFilter('admin')}
          style={{ cursor: 'pointer', borderLeft: '4px solid #ea580c' }}
        >
          <div>
            <div className="admin-stat-label">Donos da Loja (Admin)</div>
            <div className="admin-stat-value" style={{ color: '#fdba74' }}>{countAdmins}</div>
            <div className="admin-stat-sub" style={{ color: '#94a3b8' }}>Gestão operacional da loja</div>
          </div>
          <div className="admin-stat-icon-wrap" style={{ background: 'rgba(234, 88, 12, 0.15)', color: '#fb923c' }}>
            <Store size={26} />
          </div>
        </div>

        {/* Base de Clientes */}
        <div 
          className="admin-card admin-stat-card" 
          onClick={() => setRoleFilter('cliente')}
          style={{ cursor: 'pointer', borderLeft: '4px solid #10b981' }}
        >
          <div>
            <div className="admin-stat-label">Clientes Cadastrados</div>
            <div className="admin-stat-value" style={{ color: '#34d399' }}>{countClientes}</div>
            <div className="admin-stat-sub" style={{ color: '#94a3b8' }}>Histórico de pedidos & LTV</div>
          </div>
          <div className="admin-stat-icon-wrap" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981' }}>
            <ShoppingBag size={26} />
          </div>
        </div>

        {/* Sessão Ativa */}
        <div className="admin-card admin-stat-card" style={{ borderLeft: '4px solid #38bdf8' }}>
          <div>
            <div className="admin-stat-label">Perfil Ativo Agora</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fff', marginTop: '4px' }}>
              {currentUser?.name || 'Superadmin'}
            </div>
            <div className="admin-stat-sub" style={{ color: '#38bdf8' }}>
              Nível: {currentUser?.role?.toUpperCase()}
            </div>
          </div>
          <div className="admin-stat-icon-wrap" style={{ background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8' }}>
            <Users size={26} />
          </div>
        </div>
      </div>

      {/* Barra de Filtros e Pesquisa */}
      <div className="admin-card" style={{ marginBottom: '24px', padding: '16px 20px' }}>
        <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
            <input 
              type="text"
              placeholder="Buscar por nome, telefone WhatsApp ou e-mail..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="admin-form-input"
              style={{ width: '100%', paddingLeft: '38px' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            {['all', 'superadmin', 'admin', 'cliente'].map(role => (
              <button
                key={role}
                onClick={() => setRoleFilter(role)}
                style={{
                  background: roleFilter === role ? '#ea580c' : '#1e293b',
                  color: '#fff',
                  border: 'none',
                  padding: '8px 14px',
                  borderRadius: '8px',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                {role === 'all' && 'Todos'}
                {role === 'superadmin' && '🛡️ Superadmin'}
                {role === 'admin' && '🏪 Donos (Admin)'}
                {role === 'cliente' && '👤 Clientes'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tabela de Usuários */}
      <div className="admin-card" style={{ padding: '0', overflow: 'hidden' }}>
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Usuário</th>
                <th>Nível / Papel</th>
                <th>Contato & WhatsApp</th>
                <th>Endereço / Localidade</th>
                <th>Histórico / LTV</th>
                <th style={{ textAlign: 'right' }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>
                    Nenhum usuário encontrado.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => {
                  const isCurrent = currentUser?.id === user.id;

                  return (
                    <tr key={user.id}>
                      {/* Nome e Avatar */}
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div style={{ 
                            width: '40px', 
                            height: '40px', 
                            borderRadius: '50%', 
                            background: user.role === 'superadmin' ? '#5b21b6' : user.role === 'admin' ? '#c2410c' : '#1e293b',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 800,
                            color: '#fff',
                            fontSize: '1rem',
                            border: isCurrent ? '2px solid #38bdf8' : 'none'
                          }}>
                            {user.name.charAt(0)}
                          </div>
                          <div>
                            <div style={{ fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', gap: '6px' }}>
                              {user.name}
                              {isCurrent && (
                                <span style={{ fontSize: '0.7rem', background: '#38bdf8', color: '#000', padding: '1px 5px', borderRadius: '4px', fontWeight: 800 }}>
                                  VOCÊ
                                </span>
                              )}
                            </div>
                            <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                              {user.email || 'Sem e-mail cadastrado'}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Papel */}
                      <td>
                        {user.role === 'superadmin' && (
                          <span className="admin-role-pill role-superadmin">
                            🛡️ Superadmin
                          </span>
                        )}
                        {user.role === 'admin' && (
                          <span className="admin-role-pill role-admin">
                            🏪 Dono da Loja
                          </span>
                        )}
                        {user.role === 'cliente' && (
                          <span style={{ 
                            background: 'rgba(16, 185, 129, 0.15)', 
                            color: '#34d399', 
                            padding: '4px 8px', 
                            borderRadius: '6px', 
                            fontSize: '0.78rem',
                            fontWeight: 700 
                          }}>
                            👤 {user.tag || 'Cliente'}
                          </span>
                        )}
                        {user.role === 'kitchen' && (
                          <span className="admin-role-pill role-kitchen">
                            🧑‍🍳 Cozinha
                          </span>
                        )}
                      </td>

                      {/* Contato */}
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ color: '#fff', fontWeight: 600 }}>{user.phone}</span>
                          {user.phone && (
                            <a 
                              href={`https://wa.me/55${user.phone.replace(/\D/g, '')}`}
                              target="_blank" 
                              rel="noreferrer"
                              title="Abrir no WhatsApp"
                              style={{ 
                                background: 'rgba(37, 211, 102, 0.15)', 
                                color: '#25d366', 
                                padding: '4px', 
                                borderRadius: '6px',
                                display: 'inline-flex'
                              }}
                            >
                              <MessageCircle size={15} />
                            </a>
                          )}
                        </div>
                      </td>

                      {/* Endereço */}
                      <td>
                        <span style={{ color: '#cbd5e1', fontSize: '0.85rem' }}>
                          {user.address || 'Balcão / Não informado'}
                        </span>
                      </td>

                      {/* Histórico / LTV */}
                      <td>
                        {user.role === 'cliente' ? (
                          <div>
                            <div style={{ color: '#10b981', fontWeight: 800 }}>
                              R$ {Number(user.totalSpent || 0).toFixed(2).replace('.', ',')}
                            </div>
                            <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                              {user.ordersCount || 1} pedidos realizados
                            </div>
                          </div>
                        ) : (
                          <span style={{ color: '#94a3b8', fontSize: '0.8rem' }}>Membro Equipe</span>
                        )}
                      </td>

                      {/* Ações */}
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '8px' }}>
                          {/* Alternar para este usuário */}
                          {onSwitchUser && (user.role === 'superadmin' || user.role === 'admin') && !isCurrent && (
                            <button
                              onClick={() => onSwitchUser(user)}
                              style={{
                                background: '#1e293b',
                                color: '#38bdf8',
                                border: '1px solid #334155',
                                padding: '6px 10px',
                                borderRadius: '6px',
                                fontSize: '0.78rem',
                                fontWeight: 700,
                                cursor: 'pointer'
                              }}
                              title="Assumir sessão deste usuário"
                            >
                              Alternar p/ Ele
                            </button>
                          )}

                          <button 
                            onClick={() => handleOpenModal(user)}
                            className="btn-outline-adm"
                            style={{ padding: '6px 10px' }}
                            title="Editar Dados"
                          >
                            <Edit3 size={15} />
                          </button>

                          <button 
                            onClick={() => handleDelete(user.id, user.name)}
                            className="btn-outline-adm"
                            style={{ padding: '6px 10px', color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.3)' }}
                            title="Excluir Usuário"
                          >
                            <Trash2 size={15} />
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

      {/* MODAL DE CADASTRO / EDIÇÃO DE USUÁRIO */}
      {isModalOpen && (
        <div className="admin-modal-overlay" onClick={handleCloseModal}>
          <div className="admin-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <UserPlus size={20} color="#ea580c" />
                {editingUser ? 'Editar Usuário' : 'Cadastrar Novo Usuário'}
              </h3>
              <button onClick={handleCloseModal} style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="admin-modal-body">
              {/* Nível de Acesso */}
              <div className="admin-form-group">
                <label className="admin-form-label">Perfil de Acesso / Nível *</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, role: 'cliente' })}
                    style={{
                      padding: '12px',
                      borderRadius: '8px',
                      border: formData.role === 'cliente' ? '2px solid #10b981' : '1px solid #334155',
                      background: formData.role === 'cliente' ? 'rgba(16, 185, 129, 0.15)' : '#0b0f19',
                      color: formData.role === 'cliente' ? '#34d399' : '#cbd5e1',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    👤 Cliente
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, role: 'admin' })}
                    style={{
                      padding: '12px',
                      borderRadius: '8px',
                      border: formData.role === 'admin' ? '2px solid #ea580c' : '1px solid #334155',
                      background: formData.role === 'admin' ? 'rgba(234, 88, 12, 0.15)' : '#0b0f19',
                      color: formData.role === 'admin' ? '#fb923c' : '#cbd5e1',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    🏪 Dono da Loja
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, role: 'superadmin' })}
                    style={{
                      padding: '12px',
                      borderRadius: '8px',
                      border: formData.role === 'superadmin' ? '2px solid #8b5cf6' : '1px solid #334155',
                      background: formData.role === 'superadmin' ? 'rgba(139, 92, 246, 0.15)' : '#0b0f19',
                      color: formData.role === 'superadmin' ? '#c4b5fd' : '#cbd5e1',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    🛡️ Superadmin
                  </button>
                </div>
              </div>

              {/* Nome e WhatsApp */}
              <div className="admin-form-grid-2">
                <div className="admin-form-group">
                  <label className="admin-form-label">Nome Completo *</label>
                  <input 
                    type="text"
                    placeholder="Ex: Carlos Maciel"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="admin-form-input"
                    required
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-form-label">WhatsApp / Telefone *</label>
                  <input 
                    type="text"
                    placeholder="(11) 98765-4321"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="admin-form-input"
                    required
                  />
                </div>
              </div>

              {/* E-mail e Endereço */}
              <div className="admin-form-grid-2">
                <div className="admin-form-group">
                  <label className="admin-form-label">E-mail</label>
                  <input 
                    type="email"
                    placeholder="carlos@exemplo.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="admin-form-input"
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-form-label">Endereço Principal</label>
                  <input 
                    type="text"
                    placeholder="Rua, número, complemento"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="admin-form-input"
                  />
                </div>
              </div>

              {/* Tag ou Observações */}
              <div className="admin-form-group">
                <label className="admin-form-label">Observações ou Tag de Fidelidade</label>
                <input 
                  type="text"
                  placeholder="Ex: VIP, Dono Franquia Centro, Preferência por carne mal passada"
                  value={formData.notes || formData.tag}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value, tag: e.target.value })}
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
                  Salvar Usuário
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
