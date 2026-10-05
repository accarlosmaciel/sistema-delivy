import React from 'react';
import { Plus, Minus } from 'lucide-react';

export default function ProductCard({ product, cartQty, onAddToCart, onRemoveFromCart, onClickCard }) {
  return (
    <div className="product-card" onClick={() => onClickCard(product)}>
      <div className="product-img-wrapper">
        <img 
          src={product.image} 
          alt={product.name} 
          className="product-img" 
          loading="lazy"
        />
        {product.badge && (
          <span className="product-badge">{product.badge}</span>
        )}
      </div>

      <div className="product-content">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-desc">{product.description}</p>

        <div className="product-footer">
          <div className="price-box">
            <span className="current-price">
              R$ {product.price.toFixed(2).replace('.', ',')}
            </span>
            {product.originalPrice && (
              <span className="original-price">
                R$ {product.originalPrice.toFixed(2).replace('.', ',')}
              </span>
            )}
          </div>

          <div onClick={(e) => e.stopPropagation()}>
            {cartQty > 0 ? (
              <div className="qty-counter">
                <button 
                  className="qty-btn" 
                  onClick={() => onRemoveFromCart(product.id)}
                  aria-label="Diminuir quantidade"
                >
                  <Minus size={14} />
                </button>
                <span className="qty-count">{cartQty}</span>
                <button 
                  className="qty-btn" 
                  onClick={() => onAddToCart(product)}
                  aria-label="Aumentar quantidade"
                >
                  <Plus size={14} />
                </button>
              </div>
            ) : (
              <button 
                className="add-btn" 
                onClick={() => onAddToCart(product)}
              >
                <Plus size={16} />
                <span>Adicionar</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
