# theSmoothAuth Clerk

Uma aplicação web moderna com sistema de autenticação completo usando Clerk para autenticação e Supabase como base de dados PostgreSQL.

## 🚀 Funcionalidades

- **Autenticação segura** com Clerk (login, registo, recuperação de password)
- **Gestão de perfil** com sincronização automática Clerk → Supabase
- **Proteção de rotas** com middleware Next.js
- **Interface moderna** com shadcn/ui e Tailwind CSS
- **Validação de formulários** com React Hook Form + Zod
- **Notificações** com Sonner toasts
- **Type safety** completo com TypeScript

## 🛠️ Stack Tecnológica

- **Framework**: Next.js 16 (App Router)
- **Autenticação**: Clerk (@clerk/nextjs)
- **Base de Dados**: Supabase (PostgreSQL apenas)
- **UI**: shadcn/ui + Tailwind CSS
- **Forms**: React Hook Form + Zod
- **HTTP**: Server Actions
- **Hosting**: Vercel (recomendado)

## 📋 Pré-requisitos

- Node.js 18+ ou Bun 1.0+
- Conta no [Clerk](https://clerk.com)
- Conta no [Supabase](https://supabase.com)
- Git

## 🚀 Configuração Local

### 1. Clonar o repositório

```bash
git clone <repository-url>
cd theSmoothAuth-Clerk
```

### 2. Instalar dependências

```bash
# Com npm
npm install

# Com bun
bun install
```

### 3. Configurar variáveis de ambiente

Copie o ficheiro `.env.local.example` para `.env.local`:

```bash
cp .env.local.example .env.local
```

Edite o `.env.local` com as suas credenciais:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/home
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/home

# Supabase Database
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Application URL
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Clerk Webhook Secret (opcional para desenvolvimento)
CLERK_WEBHOOK_SECRET=whsec_...
```

### 4. Configurar Clerk

1. Crie uma aplicação em [clerk.com](https://clerk.com)
2. Copie as chaves `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` e `CLERK_SECRET_KEY`
3. Configure as Redirect URLs no dashboard do Clerk:
   ```
   http://localhost:3000/sign-in
   http://localhost:3000/sign-up
   http://localhost:3000/home
   ```

### 5. Configurar Supabase

1. Crie um projeto em [supabase.com](https://supabase.com)
2. Execute a migração SQL:
   ```bash
   # Via Supabase Dashboard:
   # 1. Vá para SQL Editor
   # 2. Cole o conteúdo de supabase/migrations/001_create_profiles_table.sql
   # 3. Execute a query
   ```
3. Copie `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 6. Configurar Webhook do Clerk (opcional)

Para sincronização automática Clerk → Supabase:

1. No dashboard do Clerk, vá para **Webhooks**
2. Crie um novo webhook com URL: `https://your-app.com/api/webhooks/clerk`
3. Selecione os eventos:
   - `user.created`
   - `user.updated`
   - `user.deleted` (opcional)
4. Copie o `CLERK_WEBHOOK_SECRET`

## 🏃‍♂️ Executar Localmente

### Modo desenvolvimento

```bash
# Com npm
npm run dev

# Com bun
bun dev
```

A aplicação estará disponível em [http://localhost:3000](http://localhost:3000).

### Build para produção

```bash
# Build
npm run build

# Iniciar servidor de produção
npm start
```

## 📁 Estrutura do Projeto

```
src/
├── app/
│   ├── (auth)/              # Rotas de autenticação (Clerk)
│   ├── (dashboard)/         # Rotas protegidas
│   ├── api/webhooks/clerk/  # Webhook Clerk → Supabase
│   ├── layout.tsx           # Layout raiz com ClerkProvider
│   └── globals.css          # Estilos globais
├── components/
│   ├── ui/                  # Componentes shadcn/ui
│   └── user/                # Componentes de utilizador
├── lib/
│   ├── supabase/            # Cliente Supabase
│   ├── schemas/             # Schemas Zod para validação
│   └── clerk/               # Helpers Clerk (server-side)
├── actions/                 # Server Actions
└── middleware.ts            # Middleware de autenticação
```

## 🔐 Fluxo de Autenticação

1. **Registo**: Utilizador regista-se via Clerk → Webhook cria perfil no Supabase
2. **Login**: Clerk autentica → Middleware protege rotas → Server Actions verificam auth()
3. **Perfil**: Dados sincronizados entre Clerk e Supabase via Server Actions
4. **Segurança**: Todas as operações de DB verificam `await auth()` do Clerk

## 🌐 Deploy na Vercel

### 1. Conectar repositório

1. Vá para [vercel.com](https://vercel.com)
2. Importe o repositório GitHub
3. Configure as variáveis de ambiente (mesmas do `.env.local`)

### 2. Variáveis de ambiente na Vercel

Adicione todas as variáveis do `.env.local` ao projeto Vercel.

### 3. Configurar domínios

1. No dashboard do Clerk, adicione o domínio da Vercel às Redirect URLs
2. Atualize `NEXT_PUBLIC_APP_URL` no Vercel

## 🧪 Testar a Aplicação

### Fluxo de registo

1. Aceda a `/sign-up`
2. Preencha nome, email, password
3. Clerk cria utilizador + webhook cria perfil no Supabase
4. Redirect automático para `/home`

### Fluxo de login

1. Aceda a `/sign-in`
2. Introduza credenciais válidas
3. Redirect para `/home`
4. Verifique que o UserMenu mostra informações corretas

### Gestão de perfil

1. Aceda a `/profile` (autenticado)
2. Edite nome, telefone ou avatar
3. Submeta o formulário
4. Verifique que dados são atualizados em Clerk e Supabase

## 🔧 Troubleshooting

### Erro "Clerk not configured"

Verifique se as variáveis `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` e `CLERK_SECRET_KEY` estão corretas.

### Erro "Supabase connection failed"

Verifique `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY`.

### Webhook não funciona em desenvolvimento local

Use uma ferramenta como [ngrok](https://ngrok.com) para expor o localhost:

```bash
ngrok http 3000
```

Configure o webhook do Clerk com o URL do ngrok.

### Migração SQL falha

Execute a query manualmente no SQL Editor do Supabase.

## 📚 Recursos

- [Documentação Clerk](https://clerk.com/docs)
- [Documentação Supabase](https://supabase.com/docs)
- [Documentação Next.js](https://nextjs.org/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com)

## 🎯 Boas Práticas Seguidas

1. **Segurança**: Clerk auth() em todas as Server Actions
2. **Type Safety**: TypeScript estrito + Zod validation
3. **Performance**: Server Components para operações de DB
4. **UX**: Formulários com validação em tempo real
5. **Acessibilidade**: Componentes shadcn/ui acessíveis

## 📄 Licença

MIT

## 🤝 Contribuir

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-funcionalidade`)
3. Commit as alterações (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## 📞 Suporte

Para questões ou problemas, abra uma issue no repositório.