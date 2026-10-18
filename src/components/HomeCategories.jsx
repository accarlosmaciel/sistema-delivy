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

    case 'pizza':
      return (
        <svg viewBox="0 0 64 64" className="cat-svg">
          {/* Crust */}
          <path d="M14 18 C26 12, 38 12, 50 18 L32 54 Z" fill="#f59e0b" />
          <path d="M16 20 C27 15, 37 15, 48 20 L32 50 Z" fill="#fbbf24" />
          {/* Melted cheese drips */}
          <path d="M19 22 Q24 28 29 23 Q34 29 39 24 Q44 28 47 22" stroke="#fef08a" strokeWidth="2.5" fill="none" />
          {/* Pepperoni slices */}
          <circle cx="28" cy="27" r="4.5" fill="#dc2626" />
          <circle cx="37" cy="33" r="4" fill="#dc2626" />
          <circle cx="31" cy="41" r="3.5" fill="#dc2626" />
          {/* Basil herbs */}
          <circle cx="23" cy="25" r="1.5" fill="#16a34a" />
          <circle cx="34" cy="24" r="1.5" fill="#16a34a" />
          <circle cx="41" cy="27" r="1.5" fill="#16a34a" />
          <circle cx="26" cy="35" r="1.5" fill="#16a34a" />
        </svg>
      );

    case 'esfiha':
      return (
        <svg viewBox="0 0 64 64" className="cat-svg">
          {/* Golden dough base */}
          <ellipse cx="32" cy="34" rx="20" ry="16" fill="#f59e0b" />
          <ellipse cx="32" cy="34" rx="17" ry="13" fill="#fbbf24" />
          {/* Savory meat filling */}
          <ellipse cx="32" cy="34" rx="14" ry="10" fill="#78350f" />
          <ellipse cx="32" cy="34" rx="11" ry="7" fill="#451a03" />
          {/* Diced tomato and seasoning bits */}
          <rect x="25" y="31" width="3" height="3" rx="1" fill="#ef4444" />
          <rect x="33" y="34" width="3" height="3" rx="1" fill="#ef4444" />
          <rect x="36" y="29" width="3" height="3" rx="1" fill="#fef08a" />
          <circle cx="29" cy="35" r="1" fill="#22c55e" />
          <circle cx="35" cy="32" r="1" fill="#22c55e" />
          {/* Lemon slice */}
          <path d="M38 18 C46 18, 50 24, 48 30 Z" fill="#84cc16" />
          <path d="M40 20 C45 20, 48 24, 46 28 Z" fill="#bef264" />
        </svg>
      );

    case 'refrigerante':
    case 'drinks':
      return (
        <svg viewBox="0 0 64 64" className="cat-svg">
          {/* Soda can with classic red body */}
          <rect x="20" y="18" width="24" height="36" rx="5" fill="#dc2626" />
          {/* Silver top & bottom rims */}
          <ellipse cx="32" cy="18" rx="12" ry="4" fill="#e2e8f0" />
          <ellipse cx="32" cy="18" rx="10" ry="3" fill="#cbd5e1" />
          <ellipse cx="32" cy="54" rx="12" ry="4" fill="#94a3b8" />
          {/* White wave brand ribbon */}
          <path d="M20 34 Q32 26 44 34 L44 40 Q32 32 20 40 Z" fill="#ffffff" />
          {/* Refreshing ice cubes */}
          <rect x="40" y="38" width="9" height="9" rx="2" fill="#38bdf8" opacity="0.85" transform="rotate(15 44 42)" />
          <rect x="15" y="42" width="8" height="8" rx="2" fill="#38bdf8" opacity="0.85" transform="rotate(-12 19 46)" />
          {/* Straw */}
          <path d="M32 18 L36 8 L42 6" stroke="#ef4444" strokeWidth="3" strokeLinecap="round" fill="none" />
        </svg>
      );

    case 'milkshake':
      return (
        <svg viewBox="0 0 64 64" className="cat-svg">
          {/* Tall glass cup */}
          <path d="M22 24 L25 50 C25 52, 39 52, 39 50 L42 24 Z" fill="#ede9fe" stroke="#c4b5fd" strokeWidth="1.5" />
          {/* Creamy strawberry shake inside */}
          <path d="M23 27 L25 49 C25 51, 39 51, 39 49 L41 27 Z" fill="#f43f5e" />
          <path d="M24 38 L25 49 C25 51, 39 51, 39 49 L40 38 Z" fill="#e11d48" />
          {/* Whipped Cream */}
          <path d="M22 25 Q24 16 32 14 Q40 16 42 25 Z" fill="#ffffff" />
          <circle cx="32" cy="14" r="5" fill="#ffffff" />
          {/* Cherry on top */}
          <circle cx="32" cy="10" r="3.5" fill="#dc2626" />
          <path d="M33 7 C35 3, 39 3, 40 5" stroke="#15803d" strokeWidth="1.5" fill="none" strokeLinecap="round" />
          {/* Straw */}
          <path d="M26 24 L20 6" stroke="#fbbf24" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      );

    case 'soda':
    case 'soda_artesanal':
      return (
        <svg viewBox="0 0 64 64" className="cat-svg">
          {/* Tall soda glass with gradient layers */}
          <path d="M20 18 L24 52 C24 54, 40 54, 40 52 L44 18 Z" fill="#e0f2fe" stroke="#38bdf8" strokeWidth="1.5" />
          <path d="M21 24 L24 51 C24 53, 40 53, 40 51 L43 24 Z" fill="#06b6d4" />
          <path d="M22 38 L24 51 C24 53, 40 53, 40 51 L42 38 Z" fill="#e11d48" />
          {/* Ice cubes */}
          <rect x="25" y="24" width="7" height="7" rx="1.5" fill="#ffffff" opacity="0.8" transform="rotate(10 28 27)" />
          <rect x="32" y="30" width="6" height="6" rx="1.5" fill="#ffffff" opacity="0.8" transform="rotate(-15 35 33)" />
          {/* Lemon wheel & mint */}
          <circle cx="43" cy="18" r="7" fill="#eab308" />
          <circle cx="43" cy="18" r="5" fill="#fef08a" />
          <path d="M26 15 C22 10, 20 14, 25 18 Z" fill="#22c55e" />
          <path d="M29 18 L32 8" stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      );

    case 'fries':
    case 'porcoes':
      return (
        <svg viewBox="0 0 64 64" className="cat-svg">
          {/* Red French Fries Box */}
          <path d="M18 28 L22 54 L42 54 L46 28 Z" fill="#ef4444" />
          <path d="M18 28 C26 34, 38 34, 46 28" fill="#dc2626" />
          {/* Golden fries sticks */}
          <rect x="21" y="12" width="4" height="20" rx="1" fill="#f59e0b" transform="rotate(-8 23 22)" />
          <rect x="26" y="8" width="4.5" height="24" rx="1" fill="#fbbf24" transform="rotate(-3 28 20)" />
          <rect x="31" y="7" width="4.5" height="25" rx="1" fill="#f59e0b" transform="rotate(2 33 19)" />
          <rect x="36" y="10" width="4.5" height="22" rx="1" fill="#fbbf24" transform="rotate(7 38 21)" />
          <rect x="40" y="14" width="4" height="18" rx="1" fill="#f59e0b" transform="rotate(12 42 23)" />
        </svg>
      );

    case 'dessert':
    case 'sobremesas':
      return (
        <svg viewBox="0 0 64 64" className="cat-svg">
          {/* Slice of chocolate cake / brownie */}
          <path d="M14 38 L50 24 L50 44 L14 48 Z" fill="#451a03" />
          <path d="M14 38 L32 18 L50 24 L32 44 Z" fill="#78350f" />
          {/* Cream & Strawberry */}
          <path d="M14 43 L50 29" stroke="#fbbf24" strokeWidth="2" />
          <circle cx="32" cy="22" r="4" fill="#f43f5e" />
          <circle cx="32" cy="22" r="2.5" fill="#e11d48" />
        </svg>
      );

    case 'combo':
    case 'promo':
      return (
        <svg viewBox="0 0 64 64" className="cat-svg">
          {/* Combo box with ribbon */}
          <rect x="16" y="20" width="32" height="30" rx="5" fill="#ea580c" />
          <path d="M16 32 L48 32" stroke="#f97316" strokeWidth="3" />
          <rect x="30" y="20" width="4" height="30" fill="#fef08a" />
          <circle cx="32" cy="18" r="4" fill="#fef08a" />
          <text x="32" y="44" fill="#ffffff" fontSize="14" fontWeight="900" textAnchor="middle" fontFamily="sans-serif">
            %
          </text>
        </svg>
      );

    case 'grid':
    default:
      return (
        <svg viewBox="0 0 64 64" className="cat-svg">
          {/* 4 modern rounded squares */}
          <rect x="17" y="17" width="12" height="12" rx="3" fill="#ea1d2c" />
          <rect x="35" y="17" width="12" height="12" rx="3" fill="#ea1d2c" />
          <rect x="17" y="35" width="12" height="12" rx="3" fill="#ea1d2c" />
          <rect x="35" y="35" width="12" height="12" rx="3" fill="#ea1d2c" />
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
