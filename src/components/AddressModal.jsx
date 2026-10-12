import React, { useState } from 'react';
import { X, MapPin, Check, Plus } from 'lucide-react';

export default function AddressModal({ isOpen, onClose, currentAddress, onSelectAddress }) {
  const [newAddressInput, setNewAddressInput] = useState('');

  if (!isOpen) return null;

  const savedAddresses = [
    { id: '1', title: 'Casa', address: 'R. RSP 24, 35', complement: 'Apto 102 - Centro' },
    { id: '2', title: 'Trabalho', address: 'Av. Paulista, 1500', complement: 'Andar 8 - Bela Vista' },
    { id: '3', title: 'Academia', address: 'R. Oscar Freire, 820', complement: 'Jardins' }
  ];

  const handleAddNew = (e) => {
    e.preventDefault();
    if (newAddressInput.trim()) {
      onSelectAddress(newAddressInput.trim());
      setNewAddressInput('');
      onClose();
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-sheet-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-sheet-header">
          <h3>Onde você quer receber seu pedido?</h3>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="address-list">
          {savedAddresses.map((item) => {
            const isCurrent = currentAddress.includes(item.address) || item.address.includes(currentAddress);
            return (
              <div 
                key={item.id} 
                className={`address-item-card ${isCurrent ? 'selected' : ''}`}
                onClick={() => {
                  onSelectAddress(item.address);
                  onClose();
                }}
              >
                <div className="address-item-icon">
                  <MapPin size={20} />
                </div>
                <div className="address-item-info">
                  <strong>{item.title}</strong>
                  <span>{item.address} - {item.complement}</span>
                </div>
                {isCurrent && <Check size={18} className="check-selected-icon" />}
              </div>
            );
          })}
        </div>

        <form onSubmit={handleAddNew} className="new-address-form">
          <input
            type="text"
            placeholder="Adicionar novo endereço..."
            value={newAddressInput}
            onChange={(e) => setNewAddressInput(e.target.value)}
            className="new-address-input"
          />
          <button type="submit" className="add-address-btn">
            <Plus size={18} />
            <span>Adicionar</span>
          </button>
        </form>
      </div>
    </div>
  );
}
