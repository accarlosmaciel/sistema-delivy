import React, { useState, useEffect } from 'react';
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
  const nextBanner = HERO_BANNERS[(currentIndex + 1) % HERO_BANNERS.length] || HERO_BANNERS[0];

  return (
    <div className="hero-carousel-container">
      <div className="hero-carousel-wrapper">
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

          {/* Left Visual: Delicious Real Food Photos Composition */}
          <div className="banner-left-food-showcase">
            {currentBanner.foodPhotos && currentBanner.foodPhotos.length > 1 ? (
              <div className="esfihas-duo-composition">
                {/* Cheese Esfiha (Top Right) */}
                <div className="esfiha-real-dish dish-queijo">
                  <div className="dish-crust-rim">
                    <img 
                      src={currentBanner.foodPhotos[1].src} 
                      alt={currentBanner.foodPhotos[1].alt} 
                      className="dish-food-photo" 
                    />
                  </div>
                </div>

                {/* Meat Esfiha (Bottom Left, in front) */}
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

        {/* Peek of the Next Banner on the Right */}
        <div 
          className="hero-banner-peek"
          onClick={() => setCurrentIndex((prev) => (prev + 1) % HERO_BANNERS.length)}
          style={{
            background: nextBanner.secondaryBg || '#ff5252'
          }}
          title="Ver próxima oferta"
        >
          <div className="peek-content">
            <span className="peek-title">{nextBanner.title}</span>
          </div>
        </div>
      </div>

      {/* 6 Pagination Indicator Dots */}
      <div className="hero-dots-row">
        {[0, 1, 2, 3, 4, 5].map((idx) => {
          const isActive = idx === (currentIndex % 6);
          return (
            <button
              key={idx}
              className={`hero-dot ${isActive ? 'active' : ''}`}
              onClick={() => setCurrentIndex(idx % HERO_BANNERS.length)}
              aria-label={`Ir para banner ${idx + 1}`}
            />
          );
        })}
      </div>
    </div>
  );
}
