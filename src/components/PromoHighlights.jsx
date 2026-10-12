import React from 'react';
import { PROMO_CARDS } from '../data/products';

export default function PromoHighlights({ onSelectPromo }) {
  return (
    <section className="promo-highlights-section">
      <div className="promo-cards-scroll">
        {PROMO_CARDS.map((card) => (
          <div
            key={card.id}
            className="promo-highlight-card"
            style={{ backgroundColor: card.bgColor }}
            onClick={() => onSelectPromo && onSelectPromo(card.filter)}
            role="button"
            tabIndex={0}
          >
            {/* Top Text Header */}
            <div className="promo-card-title-box">
              <h3 className="promo-card-title">{card.title}</h3>
            </div>

            {/* Bottom Graphic / Photo */}
            <div className="promo-card-image-box">
              <img 
                src={card.image} 
                alt={card.title.replace('\n', ' ')} 
                className="promo-card-img"
                loading="lazy"
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
