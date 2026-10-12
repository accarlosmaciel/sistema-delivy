import React from 'react';
import { Search } from 'lucide-react';
import { CATEGORIES } from '../data/products';
import CategoryIcon from './CategoryIcon';

export default function CategoryNav({ activeCategory, onSelectCategory, searchTerm, setSearchTerm }) {
  return (
    <>

      {/* Category Scroll Bar */}
      <div className="category-nav-wrapper">
        <div className="category-scroll">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              className={`category-btn ${activeCategory === cat.id ? 'active' : ''}`}
              onClick={() => onSelectCategory(cat.id)}
            >
              <CategoryIcon name={cat.icon} size={18} />
              <span>{cat.name}</span>
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
