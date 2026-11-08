# 🧪 CHECKLIST DE TESTES PONTA A PONTA — DELIVY FULL-STACK

Este checklist contém a bateria completa de testes de homologação funcional e regressão técnica para validar o sistema antes e depois da publicação em produção.

---

## 📱 1. CARDÁPIO DIGITAL DO CLIENTE (`/`)

- [ ] **1.1 Carregamento e Responsividade Mobile**
  - [ ] A aplicação carrega instantaneamente no celular e desktop sem layout shift.
  - [ ] O banner superior do restaurante exibe tempo estimado (30-45 min), nota (4.9 ⭐) e badge de status Aberto.
  - [ ] A barra de progresso para Frete Grátis atualiza conforme itens são adicionados.

- [ ] **1.2 Filtros e Busca**
  - [ ] A navegação por categorias (Hambúrgueres, Pizzas, Esfihas, Sobremesas, Bebidas) rola suavemente até a seção correta.
  - [ ] O campo de busca filtra produtos por nome ou ingredientes em tempo real.
  - [ ] Categorias com produtos esgotados exibem badge visual ou desabilitam o botão de compra rápida.

- [ ] **1.3 Customização de Produto (`ProductModal`)**
  - [ ] Ao clicar em um produto complexo (ex: Delivy Monster Bacon), o modal de customização abre.
  - [ ] A seleção obrigatória de rádio (ex: Ponto da Carne) bloqueia o avanço até o cliente selecionar uma opção.
  - [ ] Adicionais pagos com checkbox (ex: Bacon Extra, Queijo Cheddar) recalculam o preço unitário instantaneamente.
  - [ ] Campo de observação aceita instruções especiais e as repassa para a comanda da cozinha.

- [ ] **1.4 Sacola de Compras (`CartDrawer`)**
  - [ ] O contador de itens na barra inferior reflete a quantidade exata.
  - [ ] O botão `+` e `-` ajusta quantidades e remove o item ao zerar.
  - [ ] Limpar sacola esvazia os itens e reseta cupons aplicados.

- [ ] **1.5 Cupons de Desconto e Promoções**
  - [ ] Testar cupom `DELIVY10`: Aplica 10% de desconto no subtotal.
  - [ ] Testar cupom `VIP50`: Aplica R$ 50,00 de desconto (respeitando valor mínimo de R$ 150).
  - [ ] Testar cupom `FRETEGRATIS`: Zera o valor da taxa de entrega.
  - [ ] Cupom inexistente ou inválido exibe toast de erro e não aplica desconto.

- [ ] **1.6 Checkout e Finalização (`CheckoutModal`)**
  - [ ] Alternância entre "Entrega Delivery" (com endereço completo) e "Retirada no Balcão" (com taxa R$ 0,00).
  - [ ] Seleção de forma de pagamento:
    - [ ] **PIX:** Aplica 5% de desconto automático no fechamento.
    - [ ] **Cartão de Crédito/Débito:** Exibe seleção de maquininha na entrega.
    - [ ] **Dinheiro:** Exibe campo para cálculo de troco.
  - [ ] Validação de campos obrigatórios (Nome e WhatsApp com máscara).
  - [ ] Ao clicar em "Confirmar Pedido":
    - [ ] Dispara toast de sucesso.
    - [ ] Baixa imediata de estoque do produto no sistema.
    - [ ] Abre o rastreador de pedido em tempo real (`OrderTrackerModal`).
    - [ ] Oferece link direto para enviar o resumo do pedido ao WhatsApp do restaurante.

---

## 👨‍🍳 2. COZINHA TV — KDS (`/cozinha`)

- [ ] **2.1 Recepção de Pedidos em Tempo Real**
  - [ ] Ao realizar um pedido no cardápio do cliente, o novo card aparece instantaneamente na tela da cozinha sem precisar recarregar a página (via Supabase Realtime / BroadcastChannel).
  - [ ] O alerta sonoro característico de campainha toca automaticamente (sintetizador Web Audio API).
  - [ ] O crachá do pedido exibe número identificador (ex: `#PED-1083`), nome do cliente e tipo de entrega (Delivery ou Retirada).

- [ ] **2.2 Detalhes e Observações de Preparo**
  - [ ] Todos os itens do pedido aparecem com quantidade em destaque.
  - [ ] As opções escolhidas (ex: Ao Ponto, Maionese Extra) e observações aparecem formatadas e legíveis à distância.

- [ ] **2.3 Cronômetro Progressivo e Código de Cores**
  - [ ] O relógio digital de hora certa permanece sincronizado.
  - [ ] Menos de 15 min: Borda verde / status normal.
  - [ ] Entre 15 e 30 min: Alerta em tom amarelo/âmbar.
  - [ ] Mais de 30 min: Alerta pulsante em vermelho (Atraso crítico).

- [ ] **2.4 Fluxo de Status do KDS**
  - [ ] Clicar em "Iniciar Preparo": Muda status de `received` para `preparing`.
  - [ ] Clicar em "Marcar como Pronto": Muda status de `preparing` para `ready`.
  - [ ] Clicar em "Despachar / Finalizar": Muda status de `ready` para `delivering` ou `completed`.
  - [ ] A mudança reflete instantaneamente no rastreador do cliente (`OrderTrackerModal`).

- [ ] **2.5 Impressão Térmica de Comanda**
  - [ ] Clicar no botão de impressora abre o diálogo de impressão padronizado para bobinas térmicas de 80mm/58mm.
  - [ ] Elementos da tela da TV (cabeçalhos e botões) são ocultados via CSS `@media print`, imprimindo apenas a comanda limpa.

- [ ] **2.6 Modo Tela Cheia**
  - [ ] O botão "Tela Cheia" alterna o KDS para modo fullscreen nativo da Smart TV ou monitor da cozinha.

---

## 📊 3. PAINEL DO GESTOR / ADMINISTRADOR (`/admin`)

- [ ] **3.1 Autenticação e Controle de Sessão**
  - [ ] Tentativa de acesso sem autenticação exibe o modal de login administrativo.
  - [ ] Login com credenciais de Cozinha (`cozinha@delivygourmet.com`) direciona diretamente ao terminal KDS.
  - [ ] Login com credenciais de Administrador (`superadmin@delivy.com.br`) libera acesso irrestrito ao painel.
  - [ ] Botão "Sair do Sistema" encerra a sessão com segurança.

- [ ] **3.2 Dashboard Executivo**
  - [ ] Exibe os 4 cards de KPIs: Faturamento do Dia, Ticket Médio, Total de Pedidos e Clientes Atendidos.
  - [ ] Gráfico de curva de distribuição de pedidos por horário reflete os picos de almoço e jantar.
  - [ ] Card de "Alertas de Estoque Baixo" lista produtos com menos de 10 unidades.

- [ ] **3.3 Gestão de Produtos (`ProdutosManager`)**
  - [ ] Listagem de produtos com imagem, categoria, preço e estoque atual.
  - [ ] Alternância rápida de disponibilidade ("Ativo" / "Pausado").
  - [ ] Edição rápida de estoque direto na lista (+ e -).
  - [ ] Modal de cadastro de produto: criação de item com nome, preço, categoria e foto.
  - [ ] Exclusão de produto com confirmação.

- [ ] **3.4 Gestão de Promoções e Cupons (`PromocoesManager`)**
  - [ ] Lista cupons ativos com total de usos e tipo de desconto (porcentagem, valor fixo ou frete grátis).
  - [ ] Criação de novo cupom com código personalizado e valor mínimo de compra.
  - [ ] Exclusão ou desativação de cupom.

- [ ] **3.5 Gestão de Usuários e Clientes (`UsuariosManager`)**
  - [ ] Lista todos os clientes e suas métricas consolidadas (Total Gasto, Quantidade de Pedidos, Tag VIP).
  - [ ] Clientes que atingem 4 ou mais pedidos recebem automaticamente a badge `Cliente VIP ⭐`.
  - [ ] Edição de telefone, endereço e observações cadastrais.

- [ ] **3.6 Controle Financeiro e DRE (`ControleFinanceiro`)**
  - [ ] Resumo com Entradas (Faturamento dos pedidos concluídos), Saídas (Despesas operacionais) e Saldo Líquido.
  - [ ] Gráfico de composição de faturamento por método de pagamento (PIX, Cartão, Dinheiro).
  - [ ] Lançamento de nova despesa operacional (Categoria, Descrição, Valor, Forma de Pagamento).
  - [ ] Fechamento de Caixa: Botão de impressão de fechamento diário consolidado.

---

## 🛡️ 4. SEGURANÇA E BACKEND API

- [ ] **4.1 Validação de Schemas (Zod)**
  - [ ] Requisições com payloads inválidos na API (ex: pedido sem itens, preço negativo) retornam HTTP 400 com mensagem explicativa.
- [ ] **4.2 Row Level Security (RLS)**
  - [ ] Tentativas não autorizadas de escrita em `expenses` ou `restaurants` via client anon são bloqueadas pelo PostgreSQL.
- [ ] **4.3 Resiliência e Fallback Híbrido**
  - [ ] Caso a conexão com a internet seja interrompida, o frontend continua funcional operando via cache local e `BroadcastChannel`, sincronizando quando a conectividade for restabelecida.

