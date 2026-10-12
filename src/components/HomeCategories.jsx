import React from 'react';
import { HOME_CATEGORIES } from '../data/products';

function CategorySvgIcon({ type }) {
  switch (type) {
    case 'burger':
      return (
        <svg viewBox="0 0 64 64" className="cat-svg">
          {/* Top bun */}
          <path d="M12 28 C12 14, 52 14, 52 28 Z" fill="#f59e0b" />
          <ellipse cx="20" cy="21" rx="1.5" ry="0.8" fill="#fef3c7" />
          <ellipse cx="32" cy="19" rx="1.5" ry="0.8" fill="#fef3c7" />
          <ellipse cx="44" cy="22" rx="1.5" ry="0.8" fill="#fef3c7" />
          <ellipse cx="27" cy="24" rx="1.5" ry="0.8" fill="#fef3c7" />
          <ellipse cx="38" cy="24" rx="1.5" ry="0.8" fill="#fef3c7" />
          {/* Tomato & cheese */}
          <rect x="14" y="29" width="36" height="4" rx="2" fill="#ef4444" />
          <path d="M15 33 L25 38 L35 33 L45 38 L49 33 Z" fill="#fbbf24" />
          {/* Burger patty */}
          <rect x="13" y="34" width="38" height="6" rx="3" fill="#78350f" />
          {/* Lettuce */}
          <path d="M11 37 Q16 41 21 37 Q26 41 31 37 Q36 41 41 37 Q46 41 53 37" stroke="#22c55e" strokeWidth="3" fill="none" strokeLinecap="round" />
          {/* Bottom bun */}
          <rect x="14" y="42" width="36" height="8" rx="4" fill="#f59e0b" />
        </svg>
      );
    case 'market':
      return (
        <svg viewBox="0 0 64 64" className="cat-svg">
          {/* Red shopping basket */}
          <path d="M14 26 L50 26 L45 52 L19 52 Z" fill="#ef4444" />
          <path d="M14 26 L50 26" stroke="#b91c1c" strokeWidth="2.5" />
          {/* Handle */}
          <path d="M22 26 C22 12, 42 12, 42 26" stroke="#0284c7" strokeWidth="3" fill="none" strokeLinecap="round" />
          {/* Groceries inside */}
          <rect x="23" y="15" width="6" height="15" rx="3" fill="#f59e0b" transform="rotate(-15 26 22)" />
          <circle cx="34" cy="20" r="5" fill="#22c55e" />
          <circle cx="41" cy="22" r="4.5" fill="#e11d48" />
          <rect x="18" y="34" width="28" height="2" fill="#b91c1c" />
          <rect x="21" y="42" width="22" height="2" fill="#b91c1c" />
        </svg>
      );
    case 'pharmacy':
      return (
        <svg viewBox="0 0 64 64" className="cat-svg">
          {/* Blue medicine bottle */}
          <rect x="14" y="24" width="18" height="26" rx="4" fill="#38bdf8" />
          <rect x="17" y="19" width="12" height="6" rx="2" fill="#0284c7" />
          {/* Red/white bottle & pill */}
          <rect x="34" y="28" width="18" height="22" rx="4" fill="#ef4444" />
          <rect x="37" y="23" width="12" height="6" rx="2" fill="#e2e8f0" />
          {/* Cross on bottle */}
          <path d="M43 33 L43 45 M37 39 L49 39" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      );
    case 'drinks':
      return (
        <svg viewBox="0 0 64 64" className="cat-svg">
          {/* Red soda bottle */}
          <path d="M21 16 L27 16 L29 25 L29 48 L19 48 L19 25 Z" fill="#dc2626" />
          <rect x="22" y="13" width="4" height="4" fill="#ffffff" />
          <rect x="19" y="30" width="10" height="8" fill="#ffffff" />
          {/* Green can */}
          <rect x="33" y="26" width="16" height="22" rx="3" fill="#059669" />
          <ellipse cx="41" cy="26" rx="8" ry="2.5" fill="#10b981" />
          <rect x="35" y="32" width="12" height="8" rx="1" fill="#f8fafc" />
          <circle cx="41" cy="36" r="2.5" fill="#dc2626" />
        </svg>
      );
    case 'pet':
      return (
        <svg viewBox="0 0 64 64" className="cat-svg">
          {/* Pet food red bag */}
          <path d="M18 20 L46 20 L42 52 L22 52 Z" fill="#ef4444" />
          <path d="M22 20 L28 14 L36 14 L42 20 Z" fill="#dc2626" />
          {/* Paw print */}
          <ellipse cx="32" cy="38" rx="4" ry="3" fill="#ffffff" />
          <circle cx="27" cy="31" r="2" fill="#ffffff" />
          <circle cx="37" cy="31" r="2" fill="#ffffff" />
          <circle cx="32" cy="28" r="2" fill="#ffffff" />
          {/* Dog bone */}
          <rect x="38" y="44" width="16" height="4" rx="2" fill="#38bdf8" transform="rotate(-25 46 46)" />
          <circle cx="38" cy="48" r="2.5" fill="#38bdf8" />
          <circle cx="42" cy="44" r="2.5" fill="#38bdf8" />
          <circle cx="50" cy="41" r="2.5" fill="#38bdf8" />
          <circle cx="54" cy="45" r="2.5" fill="#38bdf8" />
        </svg>
      );
    case 'uber':
      return (
        <svg viewBox="0 0 64 64" className="cat-svg">
          {/* Black circle */}
          <circle cx="32" cy="32" r="22" fill="#000000" />
          <text x="32" y="34" fill="#ffffff" fontSize="10" fontWeight="900" textAnchor="middle" fontFamily="sans-serif">
            Uber
          </text>
        </svg>
      );
    case 'promo':
      return (
        <svg viewBox="0 0 64 64" className="cat-svg">
          {/* Red promo ticket / bag with % */}
          <rect x="18" y="16" width="28" height="34" rx="5" fill="#ef4444" />
          <path d="M26 16 C26 10, 38 10, 38 16" stroke="#ffffff" strokeWidth="2.5" fill="none" />
          <text x="32" y="38" fill="#ffffff" fontSize="16" fontWeight="900" textAnchor="middle" fontFamily="sans-serif">
            %
          </text>
        </svg>
      );
    case 'shopping':
      return (
        <svg viewBox="0 0 64 64" className="cat-svg">
          {/* Gift shopping bags */}
          <rect x="18" y="24" width="28" height="26" rx="4" fill="#e11d48" />
          <path d="M26 24 C26 16, 38 16, 38 24" stroke="#fbbf24" strokeWidth="3" fill="none" />
          {/* Ribbon */}
          <rect x="30" y="24" width="4" height="26" fill="#fbbf24" />
          <path d="M18 36 L46 36" stroke="#fbbf24" strokeWidth="3" />
        </svg>
      );
    case 'gourmet':
      return (
        <svg viewBox="0 0 64 64" className="cat-svg">
          {/* Black pan / platter with delicious food */}
          <ellipse cx="32" cy="34" rx="20" ry="14" fill="#18181b" />
          <ellipse cx="32" cy="34" rx="17" ry="11" fill="#f97316" />
          <circle cx="28" cy="32" r="4" fill="#fbbf24" />
          <ellipse cx="36" cy="35" rx="5" ry="3" fill="#ef4444" />
          <circle cx="32" cy="30" r="2" fill="#22c55e" />
          <circle cx="34" cy="38" r="2" fill="#22c55e" />
        </svg>
      );
    case 'grid':
    default:
      return (
        <svg viewBox="0 0 64 64" className="cat-svg">
          {/* 4 squares icon */}
          <rect x="17" y="17" width="12" height="12" rx="3" fill="#71717a" />
          <rect x="35" y="17" width="12" height="12" rx="3" fill="#71717a" />
          <rect x="17" y="35" width="12" height="12" rx="3" fill="#71717a" />
          <rect x="35" y="35" width="12" height="12" rx="3" fill="#71717a" />
        </svg>
      );
  }
}

export default function HomeCategories({ activeCategory, onSelectCategory }) {
  return (
    <div className="home-categories-grid">
      {HOME_CATEGORIES.map((cat) => {
        const isSelected = activeCategory === cat.id;

        return (
          <button
            key={cat.id}
            className={`cat-grid-item ${isSelected ? 'active' : ''}`}
            onClick={() => onSelectCategory(cat.id)}
            title={cat.name}
          >
            <div className="cat-icon-wrapper">
              <CategorySvgIcon type={cat.icon} />
              {cat.badge && (
                <span className="cat-novo-badge">{cat.badge}</span>
              )}
            </div>
            <span className="cat-label">{cat.name}</span>
          </button>
        );
      })}
    </div>
  );
}
