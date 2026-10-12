import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { HERO_BANNERS } from '../data/products';

export default function HeroBanner({ onBannerClick }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto rotate banner every 5.5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % HERO_BANNERS.length);
    }, 5500);
    return () => clearInterval(timer);
  }, []);

  const currentBanner = HERO_BANNERS[currentIndex] || HERO_BANNERS[0];

  const handlePrev = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + HERO_BANNERS.length) % HERO_BANNERS.length);
  };

  const handleNext = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % HERO_BANNERS.length);
  };

  return (
    <div className="hero-carousel-container">
      <div className="hero-carousel-wrapper">
        {/* Navigation Arrow Left */}
        <button 
          type="button"
          className="hero-nav-arrow arrow-left" 
          onClick={handlePrev} 
          aria-label="Banner anterior"
        >
          <ChevronLeft size={22} />
        </button>

        {/* Main Active Banner Card */}
        <div 
          className="hero-banner-card"
          onClick={() => onBannerClick && onBannerClick(currentBanner.itemsFilter)}
          style={{ background: currentBanner.bgGradient }}
        >
          {/* Subtle Organic Background Curves / Wave Accent */}
          <div className="banner-curve-accent">
            <svg viewBox="0 0 400 160" preserveAspectRatio="none" className="curve-svg">
              <path 
                d="M 0,0 C 120,40 180,120 400,80 L 400,0 Z" 
                fill="rgba(255, 255, 255, 0.08)" 
              />
              <path 
                d="M 0,160 C 140,110 240,150 400,100 L 400,160 Z" 
                fill="rgba(0, 0, 0, 0.05)" 
              />
            </svg>
          </div>

          {/* Left Visual: Delicious Food Photos Composition */}
          <div className="banner-left-food-showcase">
            {currentBanner.foodPhotos && currentBanner.foodPhotos.length > 1 ? (
              <div className="esfihas-duo-composition">
                {/* Top / Background Esfiha */}
                <div className="esfiha-real-dish dish-queijo">
                  <div className="dish-crust-rim">
                    <img 
                      src={currentBanner.foodPhotos[1].src} 
                      alt={currentBanner.foodPhotos[1].alt} 
                      className="dish-food-photo" 
                    />
                  </div>
                </div>

                {/* Bottom / Front Esfiha */}
                <div className="esfiha-real-dish dish-carne">
                  <div className="dish-crust-rim">
                    <img 
                      src={currentBanner.foodPhotos[0].src} 
                      alt={currentBanner.foodPhotos[0].alt} 
                      className="dish-food-photo" 
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="single-food-composition">
                <div className="single-food-dish">
                  <img 
                    src={currentBanner.foodPhotos?.[0]?.src || currentBanner.image} 
                    alt={currentBanner.title} 
                    className="dish-food-photo" 
                  />
                </div>
              </div>
            )}
          </div>

          {/* Right Text & Price Box */}
          <div className="banner-right-content">
            <div className="banner-brand-chip">OFERTA DO DIA</div>
            <h2 className="banner-heading-tudo">{currentBanner.title}</h2>
            
            <div className="banner-divider-row">
              <span className="banner-line-left" />
              <span className="banner-subtext">{currentBanner.subtitle}</span>
              <span className="banner-line-right" />
            </div>

            <div className="banner-price-tag">
              <span className="currency">{currentBanner.currency}</span>
              <span className="price-big">{currentBanner.price}</span>
            </div>
          </div>
        </div>

        {/* Navigation Arrow Right */}
        <button 
          type="button"
          className="hero-nav-arrow arrow-right" 
          onClick={handleNext} 
          aria-label="Próximo banner"
        >
          <ChevronRight size={22} />
        </button>
      </div>

      {/* Pagination Indicator Dots */}
      <div className="hero-dots-row">
        {HERO_BANNERS.map((_, idx) => {
          const isActive = idx === currentIndex;
          return (
            <button
              key={idx}
              className={`hero-dot ${isActive ? 'active' : ''}`}
              onClick={() => setCurrentIndex(idx)}
              aria-label={`Ir para banner ${idx + 1}`}
            />
          );
        })}
      </div>
    </div>
  );
}
