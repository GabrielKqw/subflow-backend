# 🚀 Subscription Management API

Backend completo para gerenciamento de assinaturas e pagamentos recorrentes, construído com Node.js, TypeScript e arquitetura limpa.

## 💡 Sobre o Projeto

Sistema robusto para gerenciar usuários, planos de assinatura, cobranças recorrentes e pagamentos. Ideal para SaaS, startups e fintechs que precisam de um sistema de billing completo.

**Principais características:**
- Autenticação JWT com refresh tokens
- Múltiplos planos de assinatura
- Pagamentos recorrentes automatizados
- Webhooks para integrações com gateways (Stripe, Mercado Pago)
- Sistema de roles (admin/user)
- Cache com Redis
- Logs estruturados

## 🧱 Stack Tecnológica

- **Runtime:** Node.js 18+
- **Linguagem:** TypeScript
- **Framework:** Express
- **Banco de Dados:** PostgreSQL
- **ORM:** Prisma
- **Autenticação:** JWT + bcrypt
- **Validação:** Zod
- **Cache:** Redis (ioredis)
- **Logs:** Winston
- **Testes:** Jest
- **Containerização:** Docker

## 🚀 Instalação

### Com Make
```bash
npm install
make setup
make dev
```

### Com Docker
```bash
docker-compose up -d
docker-compose exec app npx prisma migrate deploy
docker-compose exec app npx prisma db seed
```

### Manual
```bash
npm install

# Configure variáveis de ambiente
cat > .env << EOF
NODE_ENV=development
PORT=3000
DATABASE_URL="postgresql://user:password@localhost:5432/subscription_db"
JWT_SECRET=your-secret-key
JWT_REFRESH_SECRET=your-refresh-secret
REDIS_HOST=localhost
REDIS_PORT=6379
EOF

# Setup do banco
npx prisma migrate dev
npx prisma db seed

# Iniciar servidor
npm run dev
```

API disponível em `http://localhost:3000`

## 📂 Arquitetura

### Estrutura de Diretórios
```
src/
├── modules/              # Módulos de negócio
│   └── auth/            # Autenticação e autorização
├── shared/
│   ├── config/          # Configurações (DB, Redis, Logger)
│   ├── middlewares/     # Middlewares globais
│   ├── errors/          # Classes de erro customizadas
│   └── utils/           # Utilitários (JWT, Hash, Validators)
└── server.ts            # Entry point
```

### Padrões Utilizados
- **Clean Architecture** - Separação clara de responsabilidades
- **Repository Pattern** - Abstração do acesso a dados
- **Service Pattern** - Lógica de negócio centralizada
- **Dependency Injection** - Desacoplamento de componentes

## 🌐 API Endpoints

### Autenticação
```
POST   /api/auth/register      # Criar nova conta
POST   /api/auth/login         # Autenticar usuário
POST   /api/auth/refresh       # Renovar access token
POST   /api/auth/logout        # Encerrar sessão
GET    /api/auth/me            # Dados do usuário autenticado
```

### Planos
```
GET    /api/plans              # Listar todos os planos
GET    /api/plans/:id          # Detalhes de um plano
POST   /api/plans              # Criar plano (admin)
PUT    /api/plans/:id          # Atualizar plano (admin)
DELETE /api/plans/:id          # Remover plano (admin)
```

### Assinaturas
```
POST   /api/subscriptions      # Criar assinatura
GET    /api/subscriptions/me   # Minhas assinaturas
DELETE /api/subscriptions/:id  # Cancelar assinatura
```

### Pagamentos
```
POST   /api/payments/initiate  # Iniciar processo de pagamento
GET    /api/payments/history   # Histórico de pagamentos
```

### Webhooks
```
POST   /api/webhooks/payment   # Receber notificações de pagamento
```

### Admin
```
GET    /api/admin/users        # Listar todos os usuários
GET    /api/admin/logs         # Logs de atividades do sistema
```

## 🗄️ Modelos de Dados

### User
Usuários do sistema com diferentes níveis de acesso.
- Roles: `USER`, `ADMIN`
- Autenticação via JWT

### Plan
Planos de assinatura disponíveis.
- Preço e duração configuráveis
- Features ilimitadas por plano

### Subscription
Assinaturas ativas dos usuários.
- Status: `ACTIVE`, `CANCELLED`, `EXPIRED`, `PENDING`
- Renovação automática

### Payment
Histórico de transações.
- Status: `PENDING`, `APPROVED`, `REJECTED`, `REFUNDED`, `CANCELLED`
- Métodos: `CREDIT_CARD`, `PIX`, `BOLETO`

### ActivityLog
Auditoria de ações no sistema.

## 🔒 Segurança

- Senhas criptografadas com bcrypt (10 rounds)
- JWT com tokens de curta duração (15min access, 7 dias refresh)
- Refresh tokens armazenados no Redis
- CORS configurável
- Helmet para headers de segurança
- Validação rigorosa de inputs (Zod)
- Rate limiting (planejado)

## 🧪 Testes

```bash
# Executar todos os testes
npm test

# Testes com cobertura
npm run test:coverage

# Testes em modo watch
npm run test:watch
```

## 📦 Deploy

### Opções Recomendadas

**Backend:**
- Render (free tier disponível)
- Railway
- Vercel (serverless)

**Banco de Dados:**
- Neon.tech (PostgreSQL serverless)
- Supabase
- Railway PostgreSQL

**Redis:**
- Upstash (serverless)
- Redis Cloud

### Variáveis de Ambiente em Produção

```env
NODE_ENV=production
DATABASE_URL="postgresql://..."
JWT_SECRET="strong-secret-key"
JWT_REFRESH_SECRET="another-strong-key"
REDIS_HOST="your-redis-host"
REDIS_PORT=6379
```

## 🛠️ Comandos Úteis

```bash
# Desenvolvimento
make dev              # Iniciar servidor de desenvolvimento
make test             # Executar testes
make lint             # Verificar código

# Banco de dados
make migrate          # Criar migration
make seed             # Popular banco com dados iniciais
make studio           # Abrir Prisma Studio

# Docker
make docker-up        # Subir containers
make docker-down      # Parar containers
make docker-logs      # Ver logs

# Ver todos os comandos
make help
```

## 📖 Documentação Adicional

- [TESTING.md](TESTING.md) - Exemplos de uso da API

## 📝 Licença

MIT

---

**Desenvolvido com TypeScript, Express e boas práticas de engenharia de software.**
