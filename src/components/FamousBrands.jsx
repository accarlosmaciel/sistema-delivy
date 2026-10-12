import React from 'react';
import { FAMOUS_BRANDS } from '../data/products';

function BrandLogo({ brand }) {
  switch (brand.avatarType) {
    case 'acai':
      return (
        <div className="brand-circle brand-acai">
          <div className="brand-inner-ring">
            <span className="brand-heart">I ♥</span>
            <span className="brand-text-sm">AÇAÍ</span>
            <span className="brand-star">★</span>
          </div>
        </div>
      );
    case 'portela':
      return (
        <div className="brand-circle brand-portela">
          <span className="portela-text">PORTELA</span>
        </div>
      );
    case 'salgados':
      return (
        <div className="brand-circle brand-salgados">
          <div className="salgados-flame">
            <span className="salgados-heart">♥</span>
            <span className="salgados-star">★</span>
          </div>
        </div>
      );
    case 'gelatto':
      return (
        <div className="brand-circle brand-gelatto">
          <span className="gelatto-label">DUO</span>
          <span className="gelatto-sub">GELATTO</span>
        </div>
      );
    case 'mangalo':
      return (
        <div className="brand-circle brand-mangalo">
          <span className="gelatto-label-small">DUO</span>
          <span className="gelatto-sub-small">GELATTO</span>
        </div>
      );
    case 'delivy':
    default:
      return (
        <div className="brand-circle brand-delivy-default">
          <span className="delivy-brand-initial">D</span>
        </div>
      );
  }
}

export default function FamousBrands({ onSelectBrand }) {
  return (
    <section className="famous-brands-section">
      <div className="famous-brands-header">
        <div>
          <h2 className="famous-brands-title">Famosos no Delivy</h2>
          <span className="famous-brands-subtitle">Marcas famosas</span>
        </div>
        <button className="famous-ver-mais" onClick={() => onSelectBrand && onSelectBrand('all')}>
          Ver mais
        </button>
      </div>

      <div className="famous-brands-list">
        {FAMOUS_BRANDS.map((brand) => (
          <div 
            key={brand.id} 
            className="famous-brand-item"
            onClick={() => onSelectBrand && onSelectBrand(brand.id)}
            role="button"
            tabIndex={0}
          >
            {/* Ad badge placeholder to align all circles evenly */}
            <div className="ad-badge-container">
              {brand.isAd && <span className="ad-badge">Ad</span>}
            </div>

            {/* Circular Logo */}
            <BrandLogo brand={brand} />

            {/* Brand Title Label */}
            <span className="famous-brand-name" title={brand.name}>
              {brand.shortName || brand.name}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
