export const RESTAURANT_INFO = {
  name: "Delivy Gourmet & Crafts",
  tagline: "Os melhores hambúrgueres artesanais e pizzas da cidade",
  rating: 4.9,
  reviewsCount: 1480,
  deliveryTime: "30 - 45 min",
  deliveryFee: 4.90,
  freeDeliveryMin: 70.00,
  status: "Aberto",
  openingHours: "18:00 às 23:30",
  address: "Av. Paulista, 1500 - Bela Vista, São Paulo",
  phone: "(11) 99876-5432",
  bannerImage: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80",
  logoImage: "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=300&q=80"
};

export const CATEGORIES = [
  { id: "all", name: "Todos", icon: "Sparkles" },
  { id: "destaques", name: "Mais Pedidos", icon: "Flame" },
  { id: "burgers", name: "Burgers Artesanais", icon: "Hamburger" },
  { id: "pizzas", name: "Pizzas Forno a Lenha", icon: "Pizza" },
  { id: "porcoes", name: "Porções & Fritas", icon: "UtensilsCrossed" },
  { id: "bebidas", name: "Bebidas & Shakes", icon: "CupSoda" },
  { id: "sobremesas", name: "Sobremesas", icon: "CakeSlice" },
  { id: "combos", name: "Combos & Ofertas", icon: "Tag" }
];

export const PRODUCTS = [
  {
    id: "b1",
    name: "Delivy Monster Bacon",
    category: "burgers",
    featured: true,
    price: 38.90,
    originalPrice: 44.90,
    description: "Pão brioche selado na manteiga, 2x smash burger 120g de blend bovino Angus, cheddar inglês derretido, tiras crocantes de bacon defumado e molho especial secreto.",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80",
    badge: "Mais Vendido",
    options: [
      {
        title: "Ponto da Carne",
        required: true,
        items: ["Ao Ponto (Suculento)", "Bem Passado", "Ao Ponto para Mal"]
      },
      {
        title: "Adicionais Extras",
        required: false,
        multiple: true,
        items: [
          { name: "Bacon Crocante Extra", price: 5.50 },
          { name: "Queijo Cheddar Extra", price: 4.50 },
          { name: "Maionese Verde da Casa (50ml)", price: 3.50 },
          { name: "Cebola Caramelizada", price: 4.00 }
        ]
      }
    ]
  },
  {
    id: "b2",
    name: "Truffle Gorgonzola Burger",
    category: "burgers",
    featured: true,
    price: 42.50,
    description: "Blend artesanal 180g, creme suave de gorgonzola importado, cebola roxa marinada, rúcula fresca e azeite trufado no pão australiano tostado.",
    image: "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=800&q=80",
    badge: "Chef Special",
    options: [
      {
        title: "Ponto da Carne",
        required: true,
        items: ["Ao Ponto (Recomendado)", "Bem Passado", "Ao Ponto para Mal"]
      },
      {
        title: "Adicionais Extras",
        required: false,
        multiple: true,
        items: [
          { name: "Cogumelos Salteados", price: 6.00 },
          { name: "Bacon Crocante Extra", price: 5.50 },
          { name: "Gorgonzola Extra", price: 6.00 }
        ]
      }
    ]
  },
  {
    id: "b3",
    name: "Smash Classic Double",
    category: "burgers",
    featured: false,
    price: 29.90,
    description: "Dois discos smash de 90g com crosta crocante, queijo americano derretido, conserva de picles artesanal, cebola picadinha e ketchup gourmet.",
    image: "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=800&q=80",
    badge: "Clássico",
    options: [
      {
        title: "Ponto da Carne",
        required: true,
        items: ["Padrão Smash (Bem passado crocante)"]
      }
    ]
  },
  {
    id: "b4",
    name: "Veggie Green Fusion",
    category: "burgers",
    featured: false,
    price: 34.90,
    description: "Hambúrguer artesanal de grão de bico com cogumelos, queijo prato vegetal, vinagrete de tomate confit, alface americana e maionese de ervas no pão vegano.",
    image: "https://images.unsplash.com/photo-1525059696034-4967a8e1dca2?auto=format&fit=crop&w=800&q=80",
    badge: "Vegetariano",
    options: []
  },

  // PIZZAS
  {
    id: "p1",
    name: "Pizza Margherita Di Bufala",
    category: "pizzas",
    featured: true,
    price: 59.90,
    originalPrice: 66.00,
    description: "Massa de fermentação natural 48h, molho de tomate San Marzano, muçarela de búfala fresca, tomates cereja assados e manjericão orgânico colhido no dia.",
    image: "https://images.unsplash.com/photo-1604382355076-af4b0eb60143?auto=format&fit=crop&w=800&q=80",
    badge: "Favorito",
    options: [
      {
        title: "Borda Recheada",
        required: false,
        items: [
          { name: "Sem borda recheada", price: 0 },
          { name: "Borda de Catupiry Original", price: 9.90 },
          { name: "Borda de Cheddar Cremoso", price: 8.90 }
        ]
      }
    ]
  },
  {
    id: "p2",
    name: "Pizza Pepperoni Supreme & Mel Picante",
    category: "pizzas",
    featured: true,
    price: 64.90,
    description: "Molho rústico de tomate, queijo muçarela premium, generosas fatias de pepperoni artesanal levemente picante e fio de mel infusionado com pimenta habanero.",
    image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=800&q=80",
    badge: "Novo",
    options: [
      {
        title: "Borda Recheada",
        required: false,
        items: [
          { name: "Sem borda recheada", price: 0 },
          { name: "Borda de Catupiry Original", price: 9.90 },
          { name: "Borda de Cheddar Cremoso", price: 8.90 }
        ]
      }
    ]
  },
  {
    id: "p3",
    name: "Pizza Quatro Queijos Trufada",
    category: "pizzas",
    featured: false,
    price: 68.00,
    description: "Combinação harmoniosa de muçarela, provolone defumado, gorgonzola cremoso e requeijão artesanal, finalizada com azeite de trufas brancas.",
    image: "https://images.unsplash.com/photo-1573821663912-569905455b1c?auto=format&fit=crop&w=800&q=80",
    badge: "Gourmet",
    options: []
  },

  // PORCOES
  {
    id: "f1",
    name: "Batata Crinkle com Cheddar & Bacon",
    category: "porcoes",
    featured: true,
    price: 26.90,
    description: "Porção generosa de batatas ondulas super crocantes por fora e macias por dentro, cobertas com molho cremoso de cheddar e bastante bacon crocante.",
    image: "https://images.unsplash.com/photo-1576107232684-1279f3908594?auto=format&fit=crop&w=800&q=80",
    badge: "Perfeito para Dividir",
    options: []
  },
  {
    id: "f2",
    name: "Coxinha sem Massa de Costela (6 un)",
    category: "porcoes",
    featured: false,
    price: 28.50,
    description: "Coxinhas artesanais recheadas exclusivamente com costela bovina desfiada e cream cheese, empanadas na farinha panko crocante.",
    image: "https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=800&q=80",
    badge: "Imperdível",
    options: []
  },
  {
    id: "f3",
    name: "Onion Rings Gourmet + Dip Barbecue",
    category: "porcoes",
    featured: false,
    price: 22.00,
    description: "Anéis de cebola selecionados, empanados no tempero secreto e fritos até dourar. Acompanha molho barbecue artesanal defumado.",
    image: "https://images.unsplash.com/photo-1639024471283-03518883512d?auto=format&fit=crop&w=800&q=80",
    badge: "",
    options: []
  },

  // BEBIDAS
  {
    id: "d1",
    name: "Milkshake Nutella com Ninho (400ml)",
    category: "bebidas",
    featured: true,
    price: 21.90,
    description: "Sorvete cremoso de baunilha batido com bastante Nutella original, leite Ninho e chantilly fresco com farofa de avelã.",
    image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=800&q=80",
    badge: "Sucesso",
    options: []
  },
  {
    id: "d2",
    name: "Soda Artesanal de Frutas Vermelhas",
    category: "bebidas",
    featured: false,
    price: 13.90,
    description: "Infusão natural de morango, framboesa e amora com água com gás, gelo e hortelã fresca. Refrescante e 100% natural.",
    image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80",
    badge: "Refrescante",
    options: []
  },
  {
    id: "d3",
    name: "Coca-Cola Zero Lata 350ml",
    category: "bebidas",
    featured: false,
    price: 6.50,
    description: "Refrigerante lata 350ml geladinho.",
    image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=800&q=80",
    badge: "",
    options: []
  },

  // SOBREMESAS
  {
    id: "s1",
    name: "Brownie Supremo com Gelato de Baunilha",
    category: "sobremesas",
    featured: true,
    price: 24.90,
    description: "Brownie morno de chocolate belga 70%, servido com uma bola de gelato artesanal de baunilha de Madagascar e calda quente de chocolate.",
    image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80",
    badge: "Sobremesa do Chef",
    options: []
  },
  {
    id: "s2",
    name: "Cheesecake de Frutas Vermelhas",
    category: "sobremesas",
    featured: false,
    price: 22.90,
    description: "Base crocante de biscoito amanteigado, creme aveludado de queijo e cobertura caseira de calda de frutas vermelhas inteiras.",
    image: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=800&q=80",
    badge: "",
    options: []
  },

  // COMBOS
  {
    id: "c1",
    name: "Combo Casal Gourmet",
    category: "combos",
    featured: true,
    price: 89.90,
    originalPrice: 106.00,
    description: "2x Delivy Monster Bacon + 1x Batata Crinkle G + 2x Bebidas à escolha. Economize R$ 16,10!",
    image: "https://images.unsplash.com/photo-1610614819513-58e34989848b?auto=format&fit=crop&w=800&q=80",
    badge: "Super Oferta",
    options: [
      {
        title: "Bebida 1",
        required: true,
        items: ["Coca-Cola Original 350ml", "Coca-Cola Zero 350ml", "Guaraná Antarctica 350ml", "Soda de Frutas Vermelhas (+R$ 4.00)"]
      },
      {
        title: "Bebida 2",
        required: true,
        items: ["Coca-Cola Original 350ml", "Coca-Cola Zero 350ml", "Guaraná Antarctica 350ml", "Soda de Frutas Vermelhas (+R$ 4.00)"]
      }
    ]
  }
];

export const PROMO_COUPONS = {
  "DELIVY10": { discountPercent: 10, description: "10% de desconto no total" },
  "PRIMEIRO": { discountValue: 10.00, minSubtotal: 40.00, description: "R$ 10,00 off no primeiro pedido acima de R$ 40" },
  "FRETEGRATIS": { freeDelivery: true, description: "Frete Grátis garantido" }
};
