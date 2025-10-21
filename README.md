# 🚀 Subscription Management API

> Backend completo desenvolvido em 24 horas - Sistema de gerenciamento de assinaturas e pagamentos

## 💡 Sobre

API para gerenciar usuários, planos, assinaturas e pagamentos recorrentes, com webhooks e autenticação JWT. Projeto real que poderia ser usado em produção por SaaS, startups ou fintechs.

## 🧱 Stack

- Node.js + TypeScript
- Express
- PostgreSQL + Prisma
- JWT + bcrypt
- Zod (validação)
- Redis (cache)
- Docker

## 🚀 Como Executar

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
cp .env.example .env
npx prisma migrate dev
npx prisma db seed
npm run dev
```

API rodando em `http://localhost:3000`

## 📂 Estrutura

```
src/
├── modules/          # Módulos de negócio
├── shared/
│   ├── config/      # Database, Redis, Logger
│   ├── middlewares/ # Auth, Error Handler
│   ├── errors/      # Classes de erro
│   └── utils/       # JWT, Hash, Validators
└── server.ts
```

## 🌐 Endpoints (Planejados)

```
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/refresh
GET    /api/plans
POST   /api/plans
POST   /api/subscriptions
GET    /api/subscriptions/me
DELETE /api/subscriptions/:id
POST   /api/payments/initiate
POST   /api/webhooks/payment
GET    /api/admin/users
```

## 🗄️ Modelos

- **User** - Usuários (admin, user)
- **Plan** - Planos de assinatura
- **Subscription** - Assinaturas dos usuários
- **Payment** - Histórico de pagamentos
- **ActivityLog** - Logs de atividades

## 🧪 Testes

```bash
npm test
npm run test:coverage
```

## 📦 Deploy

- Backend: Render / Railway / Vercel
- Database: Neon.tech / Supabase
- Redis: Upstash / Redis Cloud

## 🎯 Próximos Passos

- [ ] Implementar módulo Auth
- [ ] Implementar módulo Plans
- [ ] Implementar módulo Subscriptions
- [ ] Implementar módulo Payments
- [ ] Sistema de Webhooks
- [ ] Admin Dashboard
- [ ] Documentação Swagger
- [ ] Testes automatizados
- [ ] Deploy

## 📝 Licença

MIT
# subflow-backend
