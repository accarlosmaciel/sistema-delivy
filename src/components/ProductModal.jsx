import React, { useState } from 'react';
import { X, Plus, Minus } from 'lucide-react';

export default function ProductModal({ product, onClose, onConfirmAdd }) {
  const [quantity, setQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [notes, setNotes] = useState('');

  if (!product) return null;

  // Handle single option choice (radio)
  const handleOptionSelect = (groupTitle, optionName) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [groupTitle]: optionName
    }));
  };

  // Handle multi options (checkboxes with prices)
  const handleMultiOptionToggle = (groupTitle, item) => {
    const currentList = selectedOptions[groupTitle] || [];
    const exists = currentList.some((i) => i.name === item.name);
    
    let updatedList;
    if (exists) {
      updatedList = currentList.filter((i) => i.name !== item.name);
    } else {
      updatedList = [...currentList, item];
    }

    setSelectedOptions((prev) => ({
      ...prev,
      [groupTitle]: updatedList
    }));
  };

  // Calculate total item price based on base price + selected options * quantity
  const calculateExtrasPrice = () => {
    let extraSum = 0;
    if (!product.options) return 0;

    product.options.forEach((group) => {
      const selected = selectedOptions[group.title];
      if (selected) {
        if (Array.isArray(selected)) {
          selected.forEach((item) => {
            if (item.price) extraSum += item.price;
          });
        } else if (typeof selected === 'object' && selected.price) {
          extraSum += selected.price;
        }
      }
    });

    return extraSum;
  };

  const itemUnitPrice = product.price + calculateExtrasPrice();
  const totalPrice = itemUnitPrice * quantity;

  const handleSubmit = () => {
    onConfirmAdd({
      product,
      quantity,
      selectedOptions,
      notes,
      totalPrice
    });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose} aria-label="Fechar">
          <X size={20} />
        </button>

        <img src={product.image} alt={product.name} className="modal-hero-img" />

        <div className="modal-body">
          <h2 className="modal-title">{product.name}</h2>
          <p className="modal-desc">{product.description}</p>

          {/* Product Options */}
          {product.options && product.options.length > 0 && product.options.map((group, gIdx) => (
            <div key={gIdx} className="option-group">
              <div className="option-header">
                <span className="option-title">{group.title}</span>
                {group.required && <span className="option-required">Obrigatório</span>}
              </div>

              <div className="option-list">
                {group.items.map((item, iIdx) => {
                  const isObject = typeof item === 'object';
                  const itemName = isObject ? item.name : item;
                  const itemPrice = isObject ? item.price : 0;

                  if (group.multiple) {
                    const currentSelected = selectedOptions[group.title] || [];
                    const isChecked = currentSelected.some((i) => i.name === itemName);

                    return (
                      <label key={iIdx} className="option-item">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <input
                            type="checkbox"
                            className="option-checkbox"
                            checked={isChecked}
                            onChange={() => handleMultiOptionToggle(group.title, { name: itemName, price: itemPrice })}
                          />
                          <span>{itemName}</span>
                        </div>
                        {itemPrice > 0 && (
                          <span style={{ color: 'var(--primary)', fontWeight: 600 }}>
                            + R$ {itemPrice.toFixed(2).replace('.', ',')}
                          </span>
                        )}
                      </label>
                    );
                  } else {
                    const isSelected = selectedOptions[group.title] === itemName || 
                      (selectedOptions[group.title] && selectedOptions[group.title].name === itemName);

                    return (
                      <label key={iIdx} className="option-item">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <input
                            type="radio"
                            name={`option-${gIdx}`}
                            className="option-radio"
                            checked={isSelected}
                            onChange={() => handleOptionSelect(group.title, isObject ? item : itemName)}
                          />
                          <span>{itemName}</span>
                        </div>
                        {itemPrice > 0 && (
                          <span style={{ color: 'var(--primary)', fontWeight: 600 }}>
                            + R$ {itemPrice.toFixed(2).replace('.', ',')}
                          </span>
                        )}
                      </label>
                    );
                  }
                })}
              </div>
            </div>
          ))}

          {/* Observations / Notes */}
          <div className="option-group">
            <span className="option-title">Observações do Item</span>
            <textarea
              className="notes-input"
              rows={2}
              placeholder="Ex: Tirar a cebola, molho à parte, pão bem tostado..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
        </div>

        {/* Modal Footer with quantity & add button */}
        <div className="modal-footer">
          <div className="modal-qty-control">
            <button 
              className="qty-btn" 
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
            >
              <Minus size={16} />
            </button>
            <span className="qty-count">{quantity}</span>
            <button 
              className="qty-btn" 
              onClick={() => setQuantity(quantity + 1)}
            >
              <Plus size={16} />
            </button>
          </div>

          <button className="modal-add-btn" onClick={handleSubmit}>
            <span>Adicionar ao Pedido</span>
            <span>R$ {totalPrice.toFixed(2).replace('.', ',')}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
