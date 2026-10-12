import React from 'react';
import { X, Bell, Tag, Flame, Sparkles } from 'lucide-react';

export default function NotificationDrawer({ isOpen, onClose, onSelectPromo }) {
  if (!isOpen) return null;

  const notifications = [
    {
      id: 'n1',
      title: 'Novo Cupom Disponível!',
      desc: 'Use o código PRIMEIRO e ganhe R$ 10 OFF na sua primeira compra!',
      time: 'Há 5 minutos',
      icon: <Tag size={18} color="#ea1d2c" />,
      filter: 'promocoes'
    },
    {
      id: 'n2',
      title: 'Esfihas a partir de R$ 0,90!',
      desc: 'Promoção relâmpago liberada por tempo limitado na sua região.',
      time: 'Há 25 minutos',
      icon: <Flame size={18} color="#f97316" />,
      filter: 'esfihas'
    },
    {
      id: 'n3',
      title: 'Padarias com Entrega Grátis',
      desc: 'Peça pães artesanais e cafés com taxa 0 até as 12h.',
      time: 'Hoje, 08:30',
      icon: <Sparkles size={18} color="#0d9488" />,
      filter: 'padaria'
    }
  ];

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-sheet-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-sheet-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Bell size={20} color="#ea1d2c" />
            <h3>Notificações</h3>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="notifications-list">
          {notifications.map((notif) => (
            <div 
              key={notif.id} 
              className="notif-card"
              onClick={() => {
                onSelectPromo && onSelectPromo(notif.filter);
                onClose();
              }}
            >
              <div className="notif-icon-box">{notif.icon}</div>
              <div className="notif-text-box">
                <div className="notif-title-row">
                  <strong>{notif.title}</strong>
                  <span className="notif-time">{notif.time}</span>
                </div>
                <p className="notif-desc">{notif.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
