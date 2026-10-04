import React from 'react';
import { Search } from 'lucide-react';
import { CATEGORIES } from '../data/products';

export default function CategoryNav({ activeCategory, onSelectCategory, searchTerm, setSearchTerm, productsCount }) {
  return (
    <>
      {/* Search Input */}
      <div className="search-container">
        <div className="search-input-wrapper">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Buscar por nome do produto ou ingrediente (ex: bacon, gorgonzola, pizza...)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Category Scroll Bar */}
      <div className="category-nav-wrapper">
        <div className="category-scroll">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              className={`category-btn ${activeCategory === cat.id ? 'active' : ''}`}
              onClick={() => onSelectCategory(cat.id)}
            >
              <span>{cat.icon}</span>
              <span>{cat.name}</span>
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
