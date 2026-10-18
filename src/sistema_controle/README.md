# 🖥️ Sistema de Controle & Gestão Integrada Delivy

Este módulo foi criado na nova pasta dedicada [`src/sistema_controle/`](file:///c:/Users/carlo/Desktop/sistema%20delivy/src/sistema_controle/) para gerenciar todas as operações do delivery em sincronia direta com a visão do cliente.

---

## 📁 Estrutura de Arquivos Criada

- **[`store.js`](file:///c:/Users/carlo/Desktop/sistema%20delivy/src/sistema_controle/store.js):** 
  Central de dados reativa com `LocalStorage` e `BroadcastChannel`. Sincroniza em tempo real os pedidos, produtos, estoque, cupons e clientes entre as abas e dispositivos (Cliente ⟷ Cozinha TV ⟷ Gestão).

- **[`Dashboard.jsx`](file:///c:/Users/carlo/Desktop/sistema%20delivy/src/sistema_controle/Dashboard.jsx):**
  Painel executivo com métricas de faturamento, pedidos ativos no fogão, ticket médio, clientes, curva de pedidos por horário e alertas de estoque crítico.

- **[`TelaCozinhaKDS.jsx`](file:///c:/Users/carlo/Desktop/sistema%20delivy/src/sistema_controle/TelaCozinhaKDS.jsx):**
  Kitchen Display System (KDS) projetado para telas de TV ou monitores industriais. Possui relógio em tempo real, botão de tela cheia, cronômetro com código de cores (verde, amarelo e vermelho urgente), som de campainha de novos pedidos (Web Audio API) e impressão de comandas térmicas.

- **[`ProdutosManager.jsx`](file:///c:/Users/carlo/Desktop/sistema%20delivy/src/sistema_controle/ProdutosManager.jsx):**
  Cadastro e edição completa de produtos (título, fotos em alta resolução, descrição, categoria, preço regular/promocional, estoque numérico com baixa automática ao vender e status de disponibilidade no cardápio).

- **[`PromocoesManager.jsx`](file:///c:/Users/carlo/Desktop/sistema%20delivy/src/sistema_controle/PromocoesManager.jsx):**
  Gestão de cupons de desconto (% percentual, R$ valor fixo ou frete grátis) e valores mínimos, integrados diretamente ao checkout do cliente.

- **[`UsuariosManager.jsx`](file:///c:/Users/carlo/Desktop/sistema%20delivy/src/sistema_controle/UsuariosManager.jsx):**
  Gestão de usuários por níveis de acesso:
  - **Superadmin:** Acesso irrestrito a métricas e configurações globais.
  - **Admin (Dono da Loja):** Controle operacional da loja, estoque, cozinha e finanças.
  - **Clientes:** Base de clientes com histórico de compras, LTV acumulado, endereço e atalho com 1 clique para WhatsApp.

- **[`ControleFinanceiro.jsx`](file:///c:/Users/carlo/Desktop/sistema%20delivy/src/sistema_controle/ControleFinanceiro.jsx):**
  Controle financeiro com DRE simplificado (faturamento bruto, descontos, despesas e lucro líquido operacional), vendas divididas por forma de pagamento (PIX, Cartão de Crédito, Débito e Dinheiro), lançamento de saídas e impressão de fechamento de caixa.

- **[`audioNotification.js`](file:///c:/Users/carlo/Desktop/sistema%20delivy/src/sistema_controle/audioNotification.js):**
  Sintetizador de campainha de restaurante e alertas de atraso via Web Audio API.

- **[`ViewSwitcherBar.jsx`](file:///c:/Users/carlo/Desktop/sistema%20delivy/src/sistema_controle/ViewSwitcherBar.jsx):**
  Barra flutuante moderna para alternar com 1 clique entre:
  - 📱 **Cardápio Cliente**
  - 🧑‍🍳 **Cozinha TV**
  - 💼 **Painel Gestor**

- **[`sistema_controle.css`](file:///c:/Users/carlo/Desktop/sistema%20delivy/src/sistema_controle/sistema_controle.css):**
  Design system de alto contraste, modo TV para cozinha, glassmorphism e responsividade.

---

## 🚀 Rotas Disponíveis no Next.js

1. `/` → **Visão do Cliente** (Cardápio completo, personalização de lanches, carrinho e rastreamento de pedidos).
2. `/admin` → **Painel do Gestor / Dono da Loja** (Dashboard, Produtos, Promoções, Usuários e Financeiro).
3. `/cozinha` → **Cozinha TV (KDS)** (Modo tela cheia otimizado para TV).
