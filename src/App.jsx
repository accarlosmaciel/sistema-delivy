'use client';

import React, { useState, useEffect, useRef } from 'react';
import HomeHeader from './components/HomeHeader';
import HomeCategories from './components/HomeCategories';
import HeroBanner from './components/HeroBanner';

import BottomNavBar from './components/BottomNavBar';
import AddressModal from './components/AddressModal';
import ClubVipModal from './components/ClubVipModal';
import NotificationDrawer from './components/NotificationDrawer';
import ProfileDrawer from './components/ProfileDrawer';
import CategoryNav from './components/CategoryNav';
import ProductCard from './components/ProductCard';
import ProductModal from './components/ProductModal';
import CartDrawer from './components/CartDrawer';
import CheckoutModal from './components/CheckoutModal';
import OrderTrackerModal from './components/OrderTrackerModal';
import Toast from './components/Toast';
import CategoryIcon from './components/CategoryIcon';
import { PRODUCTS, CATEGORIES, RESTAURANT_INFO, PROMO_COUPONS } from './data/products';
import { ArrowRight, Search, Sparkles } from 'lucide-react';
import SistemaControleApp from './sistema_controle/SistemaControleApp';
import TelaCozinhaKDS from './sistema_controle/TelaCozinhaKDS';
import ViewSwitcherBar from './sistema_controle/ViewSwitcherBar';
import { CentralStore } from './sistema_controle/store';

export default function App() {
  const [currentView, setCurrentView] = useState('client'); // 'client' | 'kitchen' | 'admin'
  const [productsList, setProductsList] = useState(PRODUCTS);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('inicio');
  const [currentAddress, setCurrentAddress] = useState('R. RSP 24, 35');
  
  // Cart state stored in localStorage for persistence
  const [cartItems, setCartItems] = useState([]);
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  // Active Order state
  const [activeOrder, setActiveOrder] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Modals state
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isTrackerOpen, setIsTrackerOpen] = useState(false);
  const [isAddressOpen, setIsAddressOpen] = useState(false);
  const [isClubOpen, setIsClubOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(1);
  
  // Toast notification
  const [toastMessage, setToastMessage] = useState('');

  const searchInputRef = useRef(null);
  const catalogRef = useRef(null);

  // Load persisted state safely on client mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('delivy_cart');
      if (savedCart) setCartItems(JSON.parse(savedCart));

      const savedOrder = localStorage.getItem('delivy_active_order');
      if (savedOrder) setActiveOrder(JSON.parse(savedOrder));

      const savedAddress = localStorage.getItem('delivy_address');
      if (savedAddress) setCurrentAddress(savedAddress);

      // Carregar produtos e estoque atualizados do CentralStore
      setProductsList(CentralStore.getProducts());
    } catch (e) {
      console.error('Erro ao carregar do localStorage:', e);
    }
    setIsLoaded(true);

    // Escutar eventos da cozinha e do gestor
    const unsub = CentralStore.subscribe((event) => {
      if (event.action === 'PRODUCTS_UPDATED') {
        setProductsList(event.payload);
      } else if (event.action === 'ACTIVE_ORDER_UPDATED') {
        setActiveOrder(event.payload);
      } else if (event.action === 'ORDERS_UPDATED') {
        try {
          const savedOrder = localStorage.getItem('delivy_active_order');
          if (savedOrder) {
            const current = JSON.parse(savedOrder);
            const found = event.payload.find(o => o.id === current.id);
            if (found && found.status !== current.status) {
              setActiveOrder(found);
            }
          }
        } catch (e) {}
      }
    });

    return unsub;
  }, []);

  // Persist cart
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem('delivy_cart', JSON.stringify(cartItems));
    } catch (e) {
      console.error('Erro ao salvar carrinho:', e);
    }
  }, [cartItems, isLoaded]);

  // Persist active order
  useEffect(() => {
    if (!isLoaded) return;
    try {
      if (activeOrder) {
        localStorage.setItem('delivy_active_order', JSON.stringify(activeOrder));
      } else {
        localStorage.removeItem('delivy_active_order');
      }
    } catch (e) {
      console.error('Erro ao salvar pedido:', e);
    }
  }, [activeOrder, isLoaded]);

  // Persist address
  const handleSelectAddress = (addr) => {
    setCurrentAddress(addr);
    try {
      localStorage.setItem('delivy_address', addr);
    } catch (e) {}
    showToast(`Endereço atualizado: ${addr}`);
  };

  // Total calculation
  const cartSubtotal = cartItems.reduce((sum, item) => {
    return sum + (item.totalPrice || item.product.price * item.quantity);
  }, 0);

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const deliveryFee = cartSubtotal >= RESTAURANT_INFO.freeDeliveryMin ? 0 : RESTAURANT_INFO.deliveryFee;

  let discountAmount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountPercent) {
      discountAmount = (cartSubtotal * appliedCoupon.discountPercent) / 100;
    } else if (appliedCoupon.discountValue) {
      discountAmount = appliedCoupon.discountValue;
    }
  }

  const finalTotal = Math.max(0, cartSubtotal + (appliedCoupon?.freeDelivery ? 0 : deliveryFee) - (appliedCoupon?.freeDelivery ? 0 : discountAmount));

  // Handlers
  const handleQuickAdd = (product) => {
    if (product.options && product.options.some((o) => o.required)) {
      setSelectedProduct(product);
      return;
    }

    setCartItems((prev) => {
      const existingIdx = prev.findIndex((i) => i.product.id === product.id && !i.notes && !i.selectedOptions);
      if (existingIdx > -1) {
        const updated = [...prev];
        updated[existingIdx].quantity += 1;
        return updated;
      }
      return [...prev, { product, quantity: 1, totalPrice: product.price }];
    });

    showToast(`"${product.name}" adicionado ao pedido!`);
  };

  const handleRemoveFromCart = (productId) => {
    setCartItems((prev) => {
      const existingIdx = prev.findIndex((i) => i.product.id === productId);
      if (existingIdx === -1) return prev;
      
      const updated = [...prev];
      if (updated[existingIdx].quantity > 1) {
        updated[existingIdx].quantity -= 1;
      } else {
        updated.splice(existingIdx, 1);
      }
      return updated;
    });
  };

  const handleModalConfirmAdd = ({ product, quantity, selectedOptions, notes, totalPrice }) => {
    setCartItems((prev) => [
      ...prev,
      { product, quantity, selectedOptions, notes, totalPrice }
    ]);
    showToast(`"${product.name}" adicionado com personalizações!`);
  };

  const handleUpdateQty = (index, newQty) => {
    if (newQty <= 0) {
      setCartItems((prev) => prev.filter((_, i) => i !== index));
    } else {
      setCartItems((prev) => {
        const updated = [...prev];
        const unitPrice = updated[index].totalPrice ? updated[index].totalPrice / updated[index].quantity : updated[index].product.price;
        updated[index].quantity = newQty;
        updated[index].totalPrice = unitPrice * newQty;
        return updated;
      });
    }
  };

  const handleClearCart = () => {
    setCartItems([]);
    setAppliedCoupon(null);
  };

  const handleOrderPlaced = (newOrder) => {
    // Sincroniza pedido com a Cozinha TV, Dashboard e Clientes
    const fullSavedOrder = CentralStore.addOrder(newOrder);
    setActiveOrder(fullSavedOrder);
    setCartItems([]);
    setAppliedCoupon(null);
    setIsCheckoutOpen(false);
    setIsCartOpen(false);
    setIsTrackerOpen(true);
    showToast(`Pedido #${fullSavedOrder.id || newOrder.orderId} realizado e enviado para a Cozinha!`);
  };

  const showToast = (msg) => {
    setToastMessage(msg);
  };

  const handleSelectHomeCategory = (categoryId) => {
    // Map home category clicks
    if (categoryId === 'restaurantes') {
      setActiveCategory('burgers');
    } else if (categoryId === 'bebidas') {
      setActiveCategory('bebidas');
    } else if (categoryId === 'promocoes') {
      setActiveCategory('destaques');
    } else if (categoryId === 'gourmet') {
      setActiveCategory('pizzas');
    } else if (categoryId === 'ver_mais') {
      setActiveCategory('all');
    } else {
      setActiveCategory('all');
    }

    if (catalogRef.current) {
      catalogRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handlePromoFilter = (filterKey) => {
    if (filterKey === 'esfihas') {
      setActiveCategory('esfihas');
    } else if (filterKey === 'padaria') {
      setActiveCategory('padaria');
    } else if (filterKey === 'japonesa') {
      setActiveCategory('japonesa');
    } else {
      setActiveCategory('destaques');
    }

    if (catalogRef.current) {
      catalogRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleApplyCouponCode = (code) => {
    const coupons = CentralStore.getCoupons();
    const coupon = coupons[code.toUpperCase()];
    if (coupon) {
      setAppliedCoupon(coupon);
      showToast(`Cupom ${code.toUpperCase()} ativado com sucesso!`);
    } else {
      showToast('Cupom inválido ou expirado');
    }
  };

  const handleBottomTab = (tab) => {
    setActiveTab(tab);
    if (tab === 'inicio') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (tab === 'busca') {
      if (catalogRef.current) {
        catalogRef.current.scrollIntoView({ behavior: 'smooth' });
        setTimeout(() => searchInputRef.current?.focus(), 300);
      }
    } else if (tab === 'pedidos') {
      if (activeOrder) {
        setIsTrackerOpen(true);
      } else {
        showToast('Nenhum pedido em andamento no momento.');
      }
    } else if (tab === 'perfil') {
      setIsProfileOpen(true);
    }
  };

  // Filter products by category and search term using the dynamic store
  const filteredProducts = productsList.filter((product) => {
    const matchesCategory = 
      activeCategory === 'all' 
        ? true 
        : activeCategory === 'destaques' 
          ? product.featured 
          : product.category === activeCategory;

    const query = searchTerm.toLowerCase().trim();
    const matchesSearch = 
      !query || 
      product.name.toLowerCase().includes(query) || 
      (product.description && product.description.toLowerCase().includes(query));

    return matchesCategory && matchesSearch;
  });

  if (currentView === 'admin') {
    return (
      <>
        <SistemaControleApp onNavigateToClient={() => setCurrentView('client')} />
        <ViewSwitcherBar activeView={currentView} onViewChange={setCurrentView} />
      </>
    );
  }

  if (currentView === 'kitchen') {
    return (
      <>
        <TelaCozinhaKDS onNavigateBack={() => setCurrentView('client')} />
        <ViewSwitcherBar activeView={currentView} onViewChange={setCurrentView} />
      </>
    );
  }

  return (
    <div className="delivy-mobile-container">
      {/* 1. Top Bar: Greeting, Address Selector, VIP Club, Notification Bell */}
      <HomeHeader
        currentAddress={currentAddress}
        userName="Carlos"
        unreadNotifications={unreadNotifications}
        onOpenAddress={() => setIsAddressOpen(true)}
        onOpenClub={() => setIsClubOpen(true)}
        onOpenNotifications={() => {
          setIsNotificationsOpen(true);
          setUnreadNotifications(0);
        }}
        cartCount={cartCount}
        cartTotal={finalTotal}
        onOpenCart={() => setIsCartOpen(true)}
      />

      {/* 2. Quick Categories (Restaurantes, Mercados, Bebidas, etc.) */}
      <HomeCategories
        activeCategory={activeCategory}
        onSelectCategory={handleSelectHomeCategory}
      />

      {/* 3. Hero Carousel Banner ("tudo a partir de R$ 0,90") */}
      <HeroBanner 
        onBannerClick={handlePromoFilter} 
      />

      {/* 6. Search Bar & Cardápio / Restaurantes Catalog */}
      <section className="catalog-section-container" ref={catalogRef}>
        <div className="search-bar-wrapper">
          <Search size={18} className="search-bar-icon" />
          <input
            ref={searchInputRef}
            type="text"
            className="search-bar-input"
            placeholder="Buscar em pratos, esfihas ou bebidas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button className="search-clear-btn" onClick={() => setSearchTerm('')}>
              ×
            </button>
          )}
        </div>

        {/* Category Pills Navigation */}
        <CategoryNav
          activeCategory={activeCategory}
          onSelectCategory={setActiveCategory}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          productsCount={filteredProducts.length}
        />

        {/* Products Section Header */}
        <div className="section-header">
          <h2 className="section-title">
            <CategoryIcon 
              name={CATEGORIES.find((c) => c.id === activeCategory)?.icon || 'Sparkles'} 
              size={15} 
              style={{ color: '#ea1d2c' }} 
            />
            <span>{CATEGORIES.find((c) => c.id === activeCategory)?.name || 'Destaques'}</span>
          </h2>
          <span className="products-count-label">
            {filteredProducts.length} {filteredProducts.length === 1 ? 'item' : 'itens'}
          </span>
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="empty-catalog-box">
            <p className="empty-title">Nenhum produto encontrado</p>
            <p className="empty-sub">Tente pesquisar por outro termo ou escolha outra categoria acima.</p>
          </div>
        ) : (
          <div className="products-grid">
            {filteredProducts.map((product) => {
              const inCartQty = cartItems
                .filter((item) => item.product.id === product.id)
                .reduce((a, b) => a + b.quantity, 0);

              return (
                <ProductCard
                  key={product.id}
                  product={product}
                  cartQty={inCartQty}
                  onAddToCart={() => handleQuickAdd(product)}
                  onRemoveFromCart={() => handleRemoveFromCart(product.id)}
                  onClickCard={(prod) => setSelectedProduct(prod)}
                />
              );
            })}
          </div>
        )}
      </section>

      {/* Floating Cart Button for Mobile if Cart has items */}
      {cartCount > 0 && !isCartOpen && (
        <div className="mobile-cart-bar" onClick={() => setIsCartOpen(true)}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span className="cart-badge-counter">
              {cartCount}
            </span>
            <span style={{ fontWeight: 700 }}>Ver Sacola</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 800 }}>
            <span>R$ {finalTotal.toFixed(2).replace('.', ',')}</span>
            <ArrowRight size={18} />
          </div>
        </div>
      )}

      {/* 7. Bottom Navigation Bar: Início, Busca, Pedidos, Perfil */}
      <BottomNavBar
        activeTab={activeTab}
        onSelectTab={handleBottomTab}
        activeOrderCount={activeOrder ? 1 : 0}
        hasProfileNotification={true}
      />

      {/* Modals & Drawers */}
      <AddressModal
        isOpen={isAddressOpen}
        onClose={() => setIsAddressOpen(false)}
        currentAddress={currentAddress}
        onSelectAddress={handleSelectAddress}
      />

      <ClubVipModal
        isOpen={isClubOpen}
        onClose={() => setIsClubOpen(false)}
        onApplyCoupon={handleApplyCouponCode}
      />

      <NotificationDrawer
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        onSelectPromo={handlePromoFilter}
      />

      <ProfileDrawer
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        userName="Carlos"
        currentAddress={currentAddress}
        onOpenAddress={() => setIsAddressOpen(true)}
        onOpenClub={() => setIsClubOpen(true)}
      />

      {/* Product Customization Modal */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onConfirmAdd={handleModalConfirmAdd}
        />
      )}

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQty={handleUpdateQty}
        onRemoveItem={(index) => handleUpdateQty(index, 0)}
        onClearCart={handleClearCart}
        onProceedToCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
        appliedCoupon={appliedCoupon}
        setAppliedCoupon={setAppliedCoupon}
      />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={cartItems}
        subtotal={cartSubtotal}
        deliveryFee={deliveryFee}
        discountAmount={discountAmount}
        finalTotal={finalTotal}
        onOrderPlaced={handleOrderPlaced}
      />

      {/* Order Tracker Modal */}
      <OrderTrackerModal
        isOpen={isTrackerOpen}
        onClose={() => setIsTrackerOpen(false)}
        order={activeOrder}
        onNewOrder={() => {
          setIsTrackerOpen(false);
          setActiveOrder(null);
        }}
      />

      {/* Toast Notification */}
      <Toast message={toastMessage} onClose={() => setToastMessage('')} />

      {/* Floating View Switcher Bar */}
      <ViewSwitcherBar activeView={currentView} onViewChange={setCurrentView} />
    </div>
  );
}
