import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import RestaurantInfo from './components/RestaurantInfo';
import CategoryNav from './components/CategoryNav';
import ProductCard from './components/ProductCard';
import ProductModal from './components/ProductModal';
import CartDrawer from './components/CartDrawer';
import CheckoutModal from './components/CheckoutModal';
import OrderTrackerModal from './components/OrderTrackerModal';
import Toast from './components/Toast';
import { PRODUCTS, CATEGORIES, RESTAURANT_INFO } from './data/products';
import { ShoppingBag, ArrowRight } from 'lucide-react';

export default function App() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Cart state stored in localStorage for persistence
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem('delivy_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [appliedCoupon, setAppliedCoupon] = useState(null);

  // Active Order state
  const [activeOrder, setActiveOrder] = useState(() => {
    const saved = localStorage.getItem('delivy_active_order');
    return saved ? JSON.parse(saved) : null;
  });

  // Modals state
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isTrackerOpen, setIsTrackerOpen] = useState(false);
  
  // Toast notification
  const [toastMessage, setToastMessage] = useState('');

  // Persist cart
  useEffect(() => {
    localStorage.setItem('delivy_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // Persist active order
  useEffect(() => {
    if (activeOrder) {
      localStorage.setItem('delivy_active_order', JSON.stringify(activeOrder));
    } else {
      localStorage.removeItem('delivy_active_order');
    }
  }, [activeOrder]);

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
    // If product has required options, open modal for options
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

    showToast(`"${product.name}" adicionado ao carrinho!`);
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
    showToast(`"${product.name}" personalizado adicionado!`);
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
    setActiveOrder(newOrder);
    setCartItems([]);
    setAppliedCoupon(null);
    setIsCheckoutOpen(false);
    setIsCartOpen(false);
    setIsTrackerOpen(true);
    showToast(`Pedido #${newOrder.orderId} realizado com sucesso! 🎉`);
  };

  const showToast = (msg) => {
    setToastMessage(msg);
  };

  // Filter products by category and search term
  const filteredProducts = PRODUCTS.filter((product) => {
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
      product.description.toLowerCase().includes(query);

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="app-container">
      {/* Top Navigation Bar */}
      <Header
        cartCount={cartCount}
        cartTotal={finalTotal}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenTracker={() => setIsTrackerOpen(true)}
        activeOrder={activeOrder}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />

      {/* Restaurant Hero & Infos */}
      <RestaurantInfo cartSubtotal={cartSubtotal} />

      {/* Search & Category Pills */}
      <CategoryNav
        activeCategory={activeCategory}
        onSelectCategory={setActiveCategory}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        productsCount={filteredProducts.length}
      />

      {/* Main Cardápio Grid */}
      <main>
        <div className="section-header">
          <h2 className="section-title">
            {CATEGORIES.find((c) => c.id === activeCategory)?.icon} {' '}
            {CATEGORIES.find((c) => c.id === activeCategory)?.name || 'Cardápio'}
          </h2>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            {filteredProducts.length} {filteredProducts.length === 1 ? 'produto' : 'produtos'}
          </span>
        </div>

        {filteredProducts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 24px', color: 'var(--text-muted)' }}>
            <p style={{ fontSize: '1.1rem', marginBottom: '8px' }}>Nenhum produto encontrado</p>
            <p style={{ fontSize: '0.88rem' }}>Tente pesquisar por outros termos ou mudar de categoria.</p>
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
      </main>

      {/* Mobile Floating Bottom Cart Bar */}
      {cartCount > 0 && !isCartOpen && (
        <div className="mobile-cart-bar" onClick={() => setIsCartOpen(true)}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span className="cart-badge" style={{ background: '#fff', color: 'var(--primary)' }}>
              {cartCount}
            </span>
            <span style={{ fontWeight: 700 }}>Ver Seu Pedido</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 800 }}>
            <span>R$ {finalTotal.toFixed(2).replace('.', ',')}</span>
            <ArrowRight size={18} />
          </div>
        </div>
      )}

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
    </div>
  );
}
