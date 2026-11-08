# 🚀 GUIA DE DEPLOY — DELIVY FULL-STACK (SUPABASE + VERCEL)

Este guia orienta o provisionamento da infraestrutura de banco de dados no **Supabase** e a publicação contínua da aplicação no **Vercel**.

---

## 📋 PRÉ-REQUISITOS

1. Conta ativa no [Supabase](https://supabase.com/)
2. Conta ativa na [Vercel](https://vercel.com/)
3. Repositório no GitHub configurado (`https://github.com/accarlosmaciel/sistema-delivy.git`)
4. Node.js 18+ instalado localmente para testes prévios

---

## 🗄️ PARTE 1: CONFIGURAÇÃO DO SUPABASE

### 1.1 Criar Novo Projeto
1. Acesse o [Dashboard do Supabase](https://supabase.com/dashboard).
2. Clique em **"New Project"**.
3. Defina:
   - **Name:** `delivy-gourmet` (ou seu nome de preferência)
   - **Database Password:** Gere uma senha forte e armazene com segurança.
   - **Region:** Selecione `South America (São Paulo) - sa-east-1` para menor latência no Brasil.
4. Aguarde o provisionamento (aproximadamente 1 a 2 minutos).

---

### 1.2 Executar as Migrações do Banco de Dados
No menu lateral esquerdo do Supabase, clique em **"SQL Editor"** e execute os arquivos do diretório `supabase/` na **ordem estrita** abaixo:

#### Passo 1: Schema Inicial
Abra o arquivo [`supabase/migrations/001_initial_schema.sql`](supabase/migrations/001_initial_schema.sql), copie todo o conteúdo, cole no SQL Editor do Supabase e clique em **"Run"** (`Ctrl + Enter`).
> **O que ele faz:** Cria as extensões `uuid-ossp`, `pgcrypto`, as tabelas `restaurants`, `categories`, `products`, `coupons`, `profiles`, `orders`, `order_items`, `expenses`, `banners`, índices de performance e habilita a publicação `supabase_realtime` para a tabela `orders`.

#### Passo 2: Políticas de Segurança (Row Level Security - RLS)
Abra [`supabase/migrations/002_rls_policies.sql`](supabase/migrations/002_rls_policies.sql), cole no SQL Editor e execute.
> **O que ele faz:** Habilita RLS em todas as tabelas e configura regras restritivas: leitura pública para catálogo e cardápio, criação sem atrito para clientes realizarem pedidos (Guest Checkout), e restrição de escrita administrativa apenas para usuários autenticados com cargos `admin`, `superadmin` ou `kitchen`.

#### Passo 3: Funções e Triggers de Automação
Abra [`supabase/migrations/003_functions_triggers.sql`](supabase/migrations/003_functions_triggers.sql), cole no SQL Editor e execute.
> **O que ele faz:** Cria gatilhos automáticos para carimbo de data/hora (`handle_updated_at`), sincronização do Supabase Auth para a tabela `profiles`, baixa automática de estoque a cada item vendido e atualização do histórico e categoria VIP dos clientes.

#### Passo 4: Carga de Dados Inicial (Seed)
Abra [`supabase/seed.sql`](supabase/seed.sql), cole no SQL Editor e execute.
> **O que ele faz:** Popula o restaurante oficial, categorias artesanais (Hambúrgueres, Pizzas, Esfihas, Sobremesas, Bebidas), cardápio completo com opções customizáveis, cupons promocionais (`DELIVY10`, `VIP50`, `FRETEGRATIS`), contas de acesso inicial e despesas para o DRE.

---

### 1.3 Configuração de Armazenamento (Storage Buckets)
Para upload de fotos de produtos e avatares no painel administrativo:
1. No menu lateral esquerdo, vá em **"Storage"**.
2. Clique em **"New Bucket"**:
   - **Nome:** `products`
   - **Public Bucket:** Marque como **LIGADO (Public)**
   - Clique em **Save**.
3. Crie outro Bucket:
   - **Nome:** `avatars`
   - **Public Bucket:** Marque como **LIGADO (Public)**
   - Clique em **Save**.

---

### 1.4 Coleta das Chaves de API
1. No menu lateral esquerdo, vá em **Project Settings** (ícone de engrenagem) > **API**.
2. Copie os seguintes valores para uso na Vercel:
   - **Project URL:** Ex: `https://abcdefghijkl.supabase.co`
   - **Project API Keys:**
     - `anon` / `public`: Chave pública para o cliente frontend
     - `service_role`: Chave secreta de servidor (guarda no ambiente restrito da Vercel)

---

## ⚡ PARTE 2: CONFIGURAÇÃO E DEPLOY NA VERCEL

### 2.1 Importar o Projeto
1. Acesse o [Dashboard da Vercel](https://vercel.com/dashboard).
2. Clique em **"Add New..."** > **"Project"**.
3. Conecte sua conta do GitHub e selecione o repositório:
   `https://github.com/accarlosmaciel/sistema-delivy.git`
4. Na tela de configuração:
   - **Framework Preset:** `Next.js`
   - **Root Directory:** `./`
   - **Build Command:** `npm run build` (padrão)
   - **Output Directory:** `.next` (padrão)

---

### 2.2 Configurar Variáveis de Ambiente (Environment Variables)
Antes de clicar em Deploy, expanda a seção **"Environment Variables"** e adicione as seguintes variáveis:

| Variável | Valor | Ambiente |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Sua Project URL do Supabase | Production, Preview, Development |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Sua chave pública `anon` do Supabase | Production, Preview, Development |
| `SUPABASE_SERVICE_ROLE_KEY` | Sua chave secreta `service_role` | Production, Preview, Development |
| `NEXT_PUBLIC_RESTAURANT_ID` | `a0000000-0000-0000-0000-000000000001` | Production, Preview, Development |
| `NEXT_PUBLIC_APP_URL` | URL final do seu app (ex: `https://delivy.vercel.app`) | Production |

> ⚠️ **Atenção:** A chave `SUPABASE_SERVICE_ROLE_KEY` **nunca** possui o prefixo `NEXT_PUBLIC_`. Ela opera exclusivamente no backend serverless (Next.js API routes), garantindo blindagem total e segurança.

---

### 2.3 Executar o Deploy
1. Clique em **"Deploy"**.
2. Aguarde o processo de compilação da Vercel (leva cerca de 1 a 2 minutos).
3. Ao finalizar, você receberá a URL oficial de produção (ex: `https://sistema-delivy.vercel.app`).

---

## 🌐 PARTE 3: PÓS-DEPLOY E DOMÍNIO PERSONALIZADO (OPCIONAL)

1. No painel do projeto na Vercel, acesse **Settings** > **Domains**.
2. Insira seu domínio próprio (ex: `pedido.meurestaurante.com.br`).
3. Configure os apontamentos DNS (CNAME ou A) indicados pela Vercel no seu provedor de domínio (Registro.br, Cloudflare, etc.).
4. O certificado SSL gratuito Let's Encrypt será emitido automaticamente.

---

## 🛡️ CONTAS DE ACESSO INICIAL AO PAINEL

| Perfil | E-mail | Senha Padrão | Acesso |
|---|---|---|---|
| **Superadmin (Master)** | `superadmin@delivy.com.br` | `admin123` | Painel Gestor + Cozinha KDS + Multi-Loja |
| **Dono da Loja (Admin)** | `roberto@delivygourmet.com` | `admin123` | Painel Gestor + Cozinha KDS |
| **Cozinha TV (KDS)** | `cozinha@delivygourmet.com` | `cozinha123` | Tela da Cozinha KDS |

> 💡 *Dica:* Altere as senhas no primeiro login através do painel de Usuários (`/admin`).

---

## 📱 INSTALAÇÃO PWA NO CELULAR

O Delivy é um **Progressive Web App (PWA)** nativo:
- **No iOS (Safari):** Toque no botão de compartilhamento e selecione **"Adicionar à Tela de Início"**.
- **No Android (Chrome):** O banner inteligente de instalação aparecerá na parte inferior, ou clique nos 3 pontos > **"Instalar Aplicativo"**.
- O app funciona com ícone dedicado em tela cheia sem barras de navegação do browser.

