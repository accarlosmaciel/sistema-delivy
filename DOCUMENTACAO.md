# ⚛️ Delivy — Documentação Técnica e Arquitetura de Software em React 19

---

## 1. Visão Geral da Arquitetura React 19

O **Delivy** é uma SPA (*Single Page Application*) desenvolvida sobre a versão mais recente do **React (19.2+)**, utilizando o empacotador **Vite 8** e paradigma puramente funcional baseado em **React Hooks**, **Componentização Modular**, **Fluxo Unidirecional de Dados (Props Down, Events Up)** e **Persistência Reativa com LocalStorage**.

### 1.1 Características Chave no Ecossistema React:
* **Functional Components & Hooks:** 100% dos componentes utilizam funções e hooks nativos (`useState`, `useEffect`). Sem dependência de bibliotecas pesadas de estado global (como Redux ou MobX), mantendo performance ultrarrápida com estado centralizado no nó raiz (`App.jsx`).
* **Sincronização Reativa com LocalStorage:** Efeitos (`useEffect`) monitoram mutações nos estados de `cartItems` e `activeOrder`, persistindo automaticamente em disco sem intervenção manual.
* **Composição de Modais e Portais Lógicos:** Renderização condicional de Modais (`ProductModal`, `CheckoutModal`, `OrderTrackerModal`) e Gaveta lateral (`CartDrawer`) via propagação de booleanos e callbacks de fechamento.
* **Cálculo Derivado em Tempo Real (Derived State):** Subtotal, taxa de entrega, descontos e total líquido são calculados durante a fase de renderização, eliminando problemas de sincronia de estado duplo.

---

## 2. Diagrama de Árvore de Componentes e Fluxo de Dados React

O diagrama abaixo ilustra a hierarquia completa da Virtual DOM do React, as **Props descendentes** e os **Callbacks ascendentes**:

```mermaid
graph TD
  App["⚛️ App.jsx (Root Store / State Container)"]

  %% Filhos Diretos
  Header["Header.jsx"]
  RestInfo["RestaurantInfo.jsx"]
  CatNav["CategoryNav.jsx"]
  ProductGrid["Grid de Produtos (Map em App.jsx)"]
  ProdCard["ProductCard.jsx"]
  ProdModal["ProductModal.jsx"]
  CartDraw["CartDrawer.jsx"]
  CheckModal["CheckoutModal.jsx"]
  TrackerModal["OrderTrackerModal.jsx"]
  ToastComp["Toast.jsx"]
  CatIcon["CategoryIcon.jsx"]

  %% Hierarquia de Montagem
  App -->|props: cartCount, activeOrder, onOpenCart, onOpenTracker| Header
  App -->|props: RESTAURANT_INFO| RestInfo
  App -->|props: activeCategory, onSelectCategory, searchTerm, setSearchTerm| CatNav
  CatNav -->|props: iconName| CatIcon
  App --> ProductGrid
  ProductGrid -->|props: product, cartQty, onAddToCart, onRemoveFromCart, onClickCard| ProdCard
  
  %% Modais e Gavetas Condicionais
  App -.->|renderiza se selectedProduct != null| ProdModal
  App -.->|renderiza se isCartOpen == true| CartDraw
  App -.->|renderiza se isCheckoutOpen == true| CheckModal
  App -.->|renderiza se isTrackerOpen == true| TrackerModal
  App -.->|renderiza se toastMessage != ''| ToastComp

  %% Callbacks Ascendentes
  ProdCard -->|"dispatch: onAddToCart() / onClickCard()"| App
  ProdModal -->|"dispatch: onConfirmAdd({ product, quantity, options, notes, total })"| App
  CartDraw -->|"dispatch: onUpdateQty(idx, qty) / onProceedToCheckout()"| App
  CheckModal -->|"dispatch: onOrderPlaced(newOrder)"| App
  TrackerModal -->|"dispatch: onNewOrder()"| App
```

---

## 3. Diagrama de Casos de Uso com Event Handlers React

![Diagrama de Casos de Uso](./docs/diagramas/diagrama_casos_de_uso.jpg)

Mapeia as ações do usuário vinculadas diretamente aos disparadores de eventos e handlers do React:

```mermaid
flowchart LR
  Usuario(("👤 Usuário / Cliente"))
  Atendente(("🧑‍🍳 Cozinha"))
  WhatsAppAPI(("📱 WhatsApp"))

  subgraph ReactApp["Aplicação React 19 (Delivy)"]
    H1["onClickCard() / handleQuickAdd()<br><i>Adicionar produto ao carrinho</i>"]
    H2["handleModalConfirmAdd()<br><i>Confirmar personalização com adicionais</i>"]
    H3["handleUpdateQty(index, delta)<br><i>Alterar quantidade no CartDrawer</i>"]
    H4["handleApplyCoupon(code)<br><i>Validar e aplicar cupom no estado</i>"]
    H5["setIsCheckoutOpen(true)<br><i>Abrir modal de fechamento</i>"]
    H6["handleSubmitOrder(formData)<br><i>Validar formulário e criar pedido</i>"]
    H7["setIsTrackerOpen(true)<br><i>Exibir acompanhamento em tempo real</i>"]
    H8["formatWhatsAppMessage()<br><i>Gerar texto e abrir URL wa.me</i>"]
    H9["handleNewOrder()<br><i>Limpar pedido ativo e reabrir cardápio</i>"]
  end

  Usuario --> H1
  Usuario --> H2
  Usuario --> H3
  Usuario --> H4
  Usuario --> H5
  Usuario --> H6
  Usuario --> H7
  Usuario --> H8
  Usuario --> H9

  H1 -.->|Atualiza cartItems| H3
  H2 -.->|Insere item complexo| H3
  H5 -.->|Aciona| H6
  H6 -.->|Gera activeOrder| H7
  H7 -.->|Dispara| H8
  H8 --> WhatsAppAPI
  H7 -.->|Acompanha preparo| Atendente
```

---

## 4. Diagrama de Classes UML dos Componentes React

![Diagrama de Classes UML](./docs/diagramas/diagrama_classes_uml.jpg)

Modela a estrutura orientada a componentes do React: **Estados Internos (`useState`)**, **Efeitos (`useEffect`)**, **Propriedades Tipadas (`Props`)** e **Métodos Handlers**:

```mermaid
classDiagram
  class App {
    +String activeCategory
    +String searchTerm
    +Array cartItems
    +Object appliedCoupon
    +Object activeOrder
    +Object selectedProduct
    +Boolean isCartOpen
    +Boolean isCheckoutOpen
    +Boolean isTrackerOpen
    +String toastMessage
    +cartSubtotal: Float (derived)
    +cartCount: Int (derived)
    +deliveryFee: Float (derived)
    +discountAmount: Float (derived)
    +finalTotal: Float (derived)
    +useEffect(syncCartToLocalStorage)
    +useEffect(syncOrderToLocalStorage)
    +handleQuickAdd(Product product)
    +handleRemoveFromCart(String productId)
    +handleModalConfirmAdd(Object customItem)
    +handleUpdateQty(Int index, Int newQty)
    +handleClearCart()
    +handleOrderPlaced(Object newOrder)
    +handleNewOrder()
    +showToast(String msg)
    +render() JSX
  }

  class ProductCard {
    <<props>>
    +Object product
    +Int cartQty
    +Function onAddToCart
    +Function onRemoveFromCart
    +Function onClickCard
    +render() JSX
  }

  class ProductModal {
    <<props>>
    +Object product
    +Function onClose
    +Function onConfirmAdd
    <<state>>
    +Int quantity
    +Object selectedOptions
    +String notes
    +totalPrice: Float (derived)
    +handleOptionSelect(groupTitle, optionName)
    +handleMultiOptionToggle(groupTitle, item)
    +handleConfirm()
    +render() JSX
  }

  class CartDrawer {
    <<props>>
    +Boolean isOpen
    +Function onClose
    +Array cartItems
    +Function onUpdateQty
    +Function onClearCart
    +Function onProceedToCheckout
    +Object appliedCoupon
    +Function setAppliedCoupon
    <<state>>
    +String couponCode
    +String couponError
    +subtotal: Float (derived)
    +deliveryFee: Float (derived)
    +discountAmount: Float (derived)
    +finalTotal: Float (derived)
    +freeDeliveryProgress: Float (derived)
    +handleApplyCoupon(e)
    +handleRemoveCoupon()
    +render() JSX
  }

  class CheckoutModal {
    <<props>>
    +Boolean isOpen
    +Function onClose
    +Array cartItems
    +Float subtotal
    +Float deliveryFee
    +Float discountAmount
    +Float finalTotal
    +Function onOrderPlaced
    <<state>>
    +String deliveryType
    +String paymentMethod
    +Object formData
    +Object errors
    +pixDiscount: Float (derived)
    +grandTotal: Float (derived)
    +handleInputChange(e)
    +validate() Boolean
    +handleSubmitOrder(e)
    +render() JSX
  }

  class OrderTrackerModal {
    <<props>>
    +Boolean isOpen
    +Function onClose
    +Object order
    +Function onNewOrder
    <<state>>
    +Int currentStep
    +Boolean copied
    +Int minutesLeft
    +useEffect(countdownTimer)
    +formatWhatsAppMessage() String
    +handleCopyPix()
    +render() JSX
  }

  class CategoryNav {
    <<props>>
    +String activeCategory
    +Function onSelectCategory
    +String searchTerm
    +Function setSearchTerm
    +render() JSX
  }

  class Header {
    <<props>>
    +Int cartCount
    +Function onOpenCart
    +Function onOpenTracker
    +Object activeOrder
    +render() JSX
  }

  App *-- ProductCard : renderiza lista
  App *-- ProductModal : instancia condicional
  App *-- CartDrawer : gerencia gaveta
  App *-- CheckoutModal : controla fechamento
  App *-- OrderTrackerModal : controla rastreamento
  App *-- CategoryNav : navegação e busca
  App *-- Header : topo da aplicação
```

---

## 5. Diagrama de Objetos UML (Estado Vivo da Virtual DOM em Execução)

![Diagrama de Objetos UML](./docs/diagramas/diagrama_objetos_uml.jpg)

Ilustra o estado concreto das instâncias e dos Hooks em tempo de execução no React durante o atendimento do pedido `#DEL-4821`:

```mermaid
flowchart TD
  subgraph AppState["Estado de 'App.jsx' (useState Hooks)"]
    app_cat["activeCategory = 'all'"]
    app_search["searchTerm = ''"]
    app_isCartOpen["isCartOpen = false"]
    app_isCheckoutOpen["isCheckoutOpen = false"]
    app_isTrackerOpen["isTrackerOpen = true"]
    app_cart["cartItems = [] (limpo após checkout)"]
  end

  subgraph ActiveOrderState["activeOrder (Persistido no LocalStorage)"]
    order_id["orderId = 'DEL-4821'"]
    order_type["deliveryType = 'delivery'"]
    order_pay["paymentMethod = 'pix'"]
    order_subtotal["subtotal = 47.90"]
    order_fee["deliveryFee = 4.90"]
    order_pixDisc["pixDiscount = 2.64 (5%)"]
    order_total["grandTotal = 50.16"]
    order_status["status = 'received'"]
  end

  subgraph CustomerObj["activeOrder.customer (Dados Validados)"]
    cust_name["name = 'João Carlos Silva'"]
    cust_phone["phone = '(11) 98765-4321'"]
    cust_addr["street = 'Rua Augusta, 740 - Consolação (Apto 42B)'"]
  end

  subgraph OrderItemObj["activeOrder.items[0] (Item Customizado)"]
    item_prod["product.name = 'Delivy Monster Bacon'"]
    item_qty["quantity = 1"]
    item_opts["selectedOptions = {
      'Ponto da Carne': 'Ao Ponto',
      'Adicionais': ['Bacon Extra (5.50)', 'Maionese (3.50)']
    }"]
    item_notes["notes = 'Sem cebola crua'"]
    item_price["totalPrice = 47.90"]
  end

  subgraph TrackerState["Estado de 'OrderTrackerModal.jsx'"]
    track_step["currentStep = 1 (Preparando)"]
    track_min["minutesLeft = 34 min"]
    track_copied["copied = false"]
  end

  AppState -->|"activeOrder"| ActiveOrderState
  ActiveOrderState -->|"customer"| CustomerObj
  ActiveOrderState -->|"items[0]"| OrderItemObj
  AppState -->|"props: order"| TrackerState
```

---

## 6. Diagrama de Sequência UML: Fluxo de Estado e Efeitos React

![Diagrama de Sequência UML](./docs/diagramas/diagrama_sequencia_uml.jpg)

Mapeia a troca ordenada de chamadas de funções, re-renderizações e sincronizações de efeitos entre os componentes React:

```mermaid
sequenceDiagram
  autonumber
  actor Cliente as 👤 Cliente
  participant ProdCard as 🎴 ProductCard
  participant App as ⚛️ App.jsx
  participant ProdModal as 🪟 ProductModal
  participant Drawer as 🛒 CartDrawer
  participant Checkout as 📋 CheckoutModal
  participant LocalStorage as 💾 LocalStorage
  participant Tracker as ⏱️ OrderTrackerModal

  Cliente->>ProdCard: Clica em produto com adicionais
  ProdCard->>App: onClickCard(product)
  App->>App: setSelectedProduct(product)
  App->>ProdModal: Renderiza com props { product, isOpen: true }
  
  Cliente->>ProdModal: Escolhe 'Ao Ponto' e 'Bacon Extra'
  ProdModal->>ProdModal: setSelectedOptions(...) -> recalcula totalPrice
  Cliente->>ProdModal: Clica em "Adicionar ao Pedido"
  ProdModal->>App: onConfirmAdd({ product, quantity, selectedOptions, notes, totalPrice })
  
  App->>App: setCartItems([...prev, customItem])
  App->>LocalStorage: useEffect() detecta mudança e salva 'delivy_cart'
  App->>ProdModal: setSelectedProduct(null) -> desmonta modal
  
  Cliente->>Drawer: Clica em "Finalizar Pedido"
  Drawer->>App: onProceedToCheckout()
  App->>App: setIsCartOpen(false); setIsCheckoutOpen(true)
  App->>Checkout: Renderiza CheckoutModal com { cartItems, finalTotal }

  Cliente->>Checkout: Preenche dados, seleciona Pix e clica em Confirmar
  Checkout->>Checkout: validate() == true -> dispara confetti()
  Checkout->>App: onOrderPlaced(newOrder)
  
  App->>App: setActiveOrder(newOrder); setCartItems([])
  App->>LocalStorage: useEffect() salva 'delivy_active_order' e remove 'delivy_cart'
  App->>App: setIsCheckoutOpen(false); setIsTrackerOpen(true)
  App->>Tracker: Renderiza OrderTrackerModal com { order: newOrder }
  Tracker-->>Cliente: Exibe chave Pix Copia e Cola e Linha do Tempo
```

---

## 7. Diagrama de Ciclo de Vida do Pedido (Statechart)

Especifica as transições da máquina de estados do pedido com foco nas mutações de estado do React:

```mermaid
stateDiagram-v2
  [*] --> Idle: Inicialização do App (Carrega localStorage)
  
  Idle --> NavegandoCardapio: Catálogo montado
  NavegandoCardapio --> ItemCustomizando: setSelectedProduct(product)
  ItemCustomizando --> CarrinhoModificado: handleModalConfirmAdd() -> setCartItems()
  
  CarrinhoModificado --> CarrinhoDrawerAberto: setIsCartOpen(true)
  CarrinhoDrawerAberto --> CheckoutAberto: setIsCheckoutOpen(true)
  CheckoutAberto --> CarrinhoDrawerAberto: onClose()
  
  CheckoutAberto --> PedidoRecebido: handleSubmitOrder() -> onOrderPlaced(newOrder)
  
  state PedidoEmAndamento {
    [*] --> PedidoRecebido: order.status = 'received'
    PedidoRecebido --> EmPreparo: currentStep = 1 (Preparando)
    EmPreparo --> EmTransito: currentStep = 2 (A caminho / Motoboy)
    EmTransito --> Entregue: currentStep = 3 (Concluído)
  }

  Entregue --> Idle: handleNewOrder() -> limpa activeOrder
```

---

## 8. Dicionário de Dados dos Objetos de Estado React

### 8.1 Estrutura do Estado `cartItems`
```javascript
[
  {
    product: {
      id: "b1",
      name: "Delivy Monster Bacon",
      price: 38.90,
      category: "burgers"
    },
    quantity: 1,
    selectedOptions: {
      "Ponto da Carne": "Ao Ponto (Suculento)",
      "Adicionais Extras": [
        { name: "Bacon Crocante Extra", price: 5.50 },
        { name: "Maionese Verde da Casa (50ml)", price: 3.50 }
      ]
    },
    notes: "Sem cebola crua",
    totalPrice: 47.90
  }
]
```

### 8.2 Estrutura do Estado `activeOrder`
```javascript
{
  orderId: "DEL-4821",
  createdAt: "2026-10-04T19:30:00.000Z",
  items: [ /* cartItems */ ],
  deliveryType: "delivery", // 'delivery' | 'pickup'
  customer: {
    name: "João Carlos Silva",
    phone: "(11) 98765-4321",
    street: "Rua Augusta",
    number: "740",
    neighborhood: "Consolação",
    complement: "Apto 42B",
    changeFor: ""
  },
  paymentMethod: "pix", // 'pix' | 'card' | 'cash'
  subtotal: 47.90,
  deliveryFee: 4.90,
  discountAmount: 0.00,
  pixDiscount: 2.64,
  grandTotal: 50.16,
  status: "received" // 'received' | 'preparing' | 'delivering' | 'completed'
}
```

---

## 9. Comandos Operacionais do React 19 (Vite)

```bash
# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento HMR
npm run dev

# Análise de lint e regras de Hooks
npm run lint

# Build de produção otimizado com Rollup
npm run build
```
